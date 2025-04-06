import React, { ReactElement, ReactNode } from 'react';
import {
  AccessibilityTestResult,
  AccessibilityViolation,
  AccessibilityRuleSet,
  AccessibilityOptions,
  AccessibilityContext,
} from './types';
import { defaultRules } from './rules';

export * from './types';
export { defaultRules } from './rules';

const defaultOptions: AccessibilityOptions = {
  strictMode: false,
  ignoreRules: [],
  customMessages: {},
};

const defaultContext: AccessibilityContext = {
  level: 1,
  inLandmark: false,
  inInteractiveElement: false,
};

export function testAccessibility(
  element: ReactElement,
  options: AccessibilityOptions = defaultOptions
): AccessibilityTestResult {
  const {
    rules = defaultRules,
    context = defaultContext,
    strictMode = false,
    ignoreRules = [],
    customMessages = {},
  } = options;

  const violations: AccessibilityViolation[] = [];
  const currentContext: AccessibilityContext = { ...context };

  // Update context based on element type
  if (typeof element.type === 'string') {
    if (element.type.match(/^h[1-6]$/)) {
      currentContext.level = parseInt(element.type[1]);
    }
    if (['main', 'nav', 'header', 'footer', 'aside'].includes(element.type)) {
      currentContext.inLandmark = true;
    }
    if (['button', 'a', 'input', 'select'].includes(element.type)) {
      currentContext.inInteractiveElement = true;
    }
  }

  // Test each rule
  Object.entries(rules)
    .filter(([ruleId]) => !ignoreRules.includes(ruleId))
    .forEach(([ruleId, rule]) => {
      const passed = rule.test(element);
      if (!passed) {
        violations.push({
          ruleId,
          message: customMessages[ruleId] || rule.description,
          severity: strictMode ? 'error' : rule.severity,
          element: {
            type: typeof element.type === 'string' ? element.type : 'Component',
            props: element.props,
          },
        });
      }
    });

  // Test children recursively if they exist
  if (element.props.children) {
    const children = Array.isArray(element.props.children)
      ? element.props.children
      : [element.props.children];

    children.forEach((child: ReactNode) => {
      if (React.isValidElement(child)) {
        const childResult = testAccessibility(child, {
          ...options,
          context: currentContext,
        });
        violations.push(...childResult.violations);
      }
    });
  }

  // In strict mode, all warnings become errors
  if (strictMode) {
    violations.forEach(violation => {
      violation.severity = 'error';
    });
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

// Enhanced type guard with support for required ARIA attributes
export function hasAccessibleProps<T extends object>(
  props: unknown,
  requiredProps: (keyof T)[],
  requiredAriaProps: string[] = []
): props is T {
  if (typeof props !== 'object' || props === null) {
    return false;
  }

  const hasRequired = requiredProps.every((prop) => prop in props);
  const hasAriaProps = requiredAriaProps.every(
    (prop) => `aria-${prop}` in props
  );

  return hasRequired && hasAriaProps;
} 