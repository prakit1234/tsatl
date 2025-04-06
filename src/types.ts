import { ReactElement } from 'react';

export interface AccessibilityRule {
  id: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  test: (element: ReactElement) => boolean;
}

export interface AccessibilityViolation {
  ruleId: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  element: {
    type: string;
    props: Record<string, unknown>;
  };
}

export interface AccessibilityTestResult {
  passed: boolean;
  violations: AccessibilityViolation[];
}

export type AccessibilityRuleSet = Record<string, AccessibilityRule>;

// Type-safe props interface for common HTML elements
export interface AccessibleImageProps {
  alt: string;
  src: string;
  role?: string;
}

export interface AccessibleButtonProps {
  onClick: () => void;
  'aria-label'?: string;
  disabled?: boolean;
}

export interface AccessibleInputProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  id: string;
  type: string;
}

export interface AccessibleFormProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  noValidate?: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export interface AccessibleSelectProps {
  id: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface AccessibleTableProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  summary?: string;
  role?: 'table' | 'grid' | 'treegrid';
}

export interface AccessibleDialogProps {
  'aria-label': string;
  'aria-describedby'?: string;
  role: 'dialog' | 'alertdialog';
  'aria-modal': boolean;
  isOpen: boolean;
  onClose: () => void;
}

export interface AccessibleLinkProps {
  href: string;
  'aria-label'?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface AccessibilityContext {
  role?: string;
  level?: number;
  parentHeadingLevel?: number;
  inLandmark?: boolean;
  inInteractiveElement?: boolean;
}

export interface AccessibilityOptions {
  rules?: AccessibilityRuleSet;
  context?: AccessibilityContext;
  strictMode?: boolean;
  ignoreRules?: string[];
  customMessages?: Record<string, string>;
} 