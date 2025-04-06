import React, { ReactElement } from 'react';
import { AccessibilityRule, AccessibilityRuleSet } from './types';

const hasValidAltText: AccessibilityRule = {
  id: 'img-alt',
  description: 'Images must have valid alt text',
  severity: 'error',
  test: (element: ReactElement) => {
    if (element.type === 'img') {
      const { alt } = element.props;
      return typeof alt === 'string' && alt.length > 0;
    }
    return true;
  },
};

const hasAriaLabel: AccessibilityRule = {
  id: 'aria-label',
  description: 'Interactive elements should have aria-label when text content is not present',
  severity: 'warning',
  test: (element: ReactElement) => {
    if (typeof element.type === 'string' && ['button', 'a', 'input'].includes(element.type)) {
      const { children, 'aria-label': ariaLabel } = element.props;
      return Boolean(children) || Boolean(ariaLabel);
    }
    return true;
  },
};

const hasValidHeadingStructure: AccessibilityRule = {
  id: 'heading-order',
  description: 'Heading levels should only increase by one',
  severity: 'warning',
  test: (element: ReactElement) => {
    if (typeof element.type === 'string' && element.type.match(/^h[1-6]$/)) {
      const level = parseInt(element.type[1]);
      // This is a simplified check. In a real implementation,
      // you'd want to track the previous heading level
      return level <= 2; // For demo purposes, only allowing h1 and h2
    }
    return true;
  },
};

const hasValidButtonRole: AccessibilityRule = {
  id: 'button-role',
  description: 'Elements with onClick handlers should have button role if not a button element',
  severity: 'error',
  test: (element: ReactElement) => {
    if (element.props.onClick && element.type !== 'button') {
      return element.props.role === 'button';
    }
    return true;
  },
};

const hasValidLabelAssociation: AccessibilityRule = {
  id: 'form-label',
  description: 'Form controls must have associated labels',
  severity: 'error',
  test: (element: ReactElement) => {
    if (typeof element.type === 'string' && ['input', 'select', 'textarea'].includes(element.type)) {
      const { id, 'aria-labelledby': ariaLabelledby, 'aria-label': ariaLabel } = element.props;
      // Check if there's a label element as a sibling
      if (element.type === 'input') {
        const parent = element.props.parentElement;
        if (parent && React.Children.toArray(parent.props.children).some(
          child => React.isValidElement(child) && child.type === 'label' && child.props.htmlFor === id
        )) {
          return true;
        }
      }
      return Boolean(ariaLabelledby) || Boolean(ariaLabel);
    }
    return true;
  },
};

const hasValidContrastRatio: AccessibilityRule = {
  id: 'color-contrast',
  description: 'Text elements should have sufficient color contrast',
  severity: 'warning',
  test: (element: ReactElement) => {
    if (typeof element.type === 'string' && element.props.style) {
      const { color, backgroundColor } = element.props.style;
      // This is a simplified check. In a real implementation,
      // you'd want to calculate actual contrast ratios
      return !(color && backgroundColor);
    }
    return true;
  },
};

const hasValidLinkText: AccessibilityRule = {
  id: 'link-text',
  description: 'Links must have meaningful text content',
  severity: 'error',
  test: (element: ReactElement) => {
    if (element.type === 'a') {
      const { children, 'aria-label': ariaLabel } = element.props;
      const text = typeof children === 'string' ? children : ariaLabel;
      const invalidTexts = ['click here', 'here', 'more', 'read more'];
      return Boolean(text) && !invalidTexts.includes(text?.toLowerCase());
    }
    return true;
  },
};

const hasValidTableStructure: AccessibilityRule = {
  id: 'table-structure',
  description: 'Tables must have proper header structure',
  severity: 'error',
  test: (element: ReactElement) => {
    if (element.type === 'table') {
      const hasHeaders = React.Children.toArray(element.props.children).some(
        (child) => React.isValidElement(child) && child.type === 'thead'
      );
      return hasHeaders;
    }
    return true;
  },
};

const hasValidLandmark: AccessibilityRule = {
  id: 'landmarks',
  description: 'Page must have proper landmark structure',
  severity: 'warning',
  test: (element: ReactElement) => {
    if (typeof element.type === 'string') {
      const validLandmarks = ['main', 'nav', 'header', 'footer', 'aside'];
      const { role } = element.props;
      return !role || validLandmarks.includes(role);
    }
    return true;
  },
};

const hasProperFocusManagement: AccessibilityRule = {
  id: 'focus-management',
  description: 'Components that show/hide content should manage focus appropriately',
  severity: 'error',
  test: (element: ReactElement) => {
    if (typeof element.type === 'string') {
      const { 'aria-hidden': ariaHidden, tabIndex, style } = element.props;
      
      // Check if element is hidden but still focusable
      if (ariaHidden === true || style?.display === 'none' || style?.visibility === 'hidden') {
        return tabIndex === undefined || tabIndex < 0;
      }
    }
    return true;
  },
};

const hasLiveRegionAttributes: AccessibilityRule = {
  id: 'live-regions',
  description: 'Dynamic content updates should use ARIA live regions',
  severity: 'warning',
  test: (element: ReactElement) => {
    if (typeof element.type === 'string') {
      const { role, 'aria-live': ariaLive } = element.props;
      
      // Check for common dynamic content patterns
      const isDynamicContent = role === 'alert' || role === 'status' || role === 'log';
      return !isDynamicContent || Boolean(ariaLive);
    }
    return true;
  },
};

const hasProperPortalManagement: AccessibilityRule = {
  id: 'portal-management',
  description: 'Portals and modals should have proper focus trap and keyboard navigation',
  severity: 'error',
  test: (element: ReactElement) => {
    if (typeof element.type === 'string') {
      const {
        role,
        'aria-modal': ariaModal,
        'aria-label': ariaLabel,
        onKeyDown,
      } = element.props;

      if (role === 'dialog') {
        return Boolean(ariaModal) && Boolean(ariaLabel) && Boolean(onKeyDown);
      }
    }
    return true;
  },
};

const hasLoadingStates: AccessibilityRule = {
  id: 'loading-states',
  description: 'Async operations should indicate loading states accessibly',
  severity: 'warning',
  test: (element: ReactElement) => {
    if (typeof element.type === 'string') {
      const { 'aria-busy': ariaBusy, role, 'aria-live': ariaLive } = element.props;
      
      // Check if loading state is properly communicated
      const isLoadingRegion = role === 'progressbar' || role === 'status';
      return !ariaBusy || (isLoadingRegion && ariaLive);
    }
    return true;
  },
};

const hasErrorHandling: AccessibilityRule = {
  id: 'error-handling',
  description: 'Error states should be properly communicated to assistive technologies',
  severity: 'error',
  test: (element: ReactElement) => {
    if (typeof element.type === 'string') {
      const {
        'aria-invalid': ariaInvalid,
        'aria-errormessage': ariaErrorMessage,
        role,
      } = element.props;
      
      // Check if error states are properly communicated
      if (ariaInvalid === true) {
        return Boolean(ariaErrorMessage) || role === 'alert';
      }
    }
    return true;
  },
};

export const defaultRules: AccessibilityRuleSet = {
  'img-alt': hasValidAltText,
  'aria-label': hasAriaLabel,
  'heading-order': hasValidHeadingStructure,
  'button-role': hasValidButtonRole,
  'form-label': hasValidLabelAssociation,
  'color-contrast': hasValidContrastRatio,
  'link-text': hasValidLinkText,
  'table-structure': hasValidTableStructure,
  'landmarks': hasValidLandmark,
  'focus-management': hasProperFocusManagement,
  'live-regions': hasLiveRegionAttributes,
  'portal-management': hasProperPortalManagement,
  'loading-states': hasLoadingStates,
  'error-handling': hasErrorHandling,
}; 