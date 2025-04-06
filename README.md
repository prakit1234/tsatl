# Type-Safe Accessibility Testing Library (TSATL)

[![npm version](https://img.shields.io/npm/v/tsatl.svg)](https://www.npmjs.com/package/tsatl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/yourusername/tsatl)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

<div align="center">
  <img src="https://avatars.githubusercontent.com/u/156523414?v=4" alt="Kaii's Profile Picture" width="100" style="border-radius: 50%;" />
  <p><strong>Created by Kaii</strong></p>
</div>

A TypeScript-based library for static analysis of web components to identify potential accessibility issues. This library leverages TypeScript's type system to provide more accurate and comprehensive accessibility testing.

## Features

- Type-safe accessibility testing for React components
- Static analysis of component props and structure
- Built-in accessibility rules for common issues
- Extensible rule system
- TypeScript interfaces for accessible components
- Context-aware testing
- Customizable rule enforcement
- Support for ARIA attributes
- Comprehensive form control validation

## Installation

```bash
npm install tsatl
```

## Usage

### Basic Usage

```typescript
import { testAccessibility } from 'tsatl';

const MyComponent = () => (
  <div>
    <img src="image.jpg" alt="Description" />
    <button onClick={() => {}} aria-label="Close">
      ×
    </button>
  </div>
);

const result = testAccessibility(<MyComponent />);
console.log(result.passed); // true/false
console.log(result.violations); // Array of violations if any
```

### Using Type-Safe Props

```typescript
import {
  AccessibleImageProps,
  AccessibleButtonProps,
  AccessibleFormProps,
  AccessibleDialogProps,
} from 'tsatl';

// TypeScript will enforce the required accessibility props
const imageProps: AccessibleImageProps = {
  src: 'image.jpg',
  alt: 'Description', // Required!
};

const dialogProps: AccessibleDialogProps = {
  'aria-label': 'Settings Dialog',
  role: 'dialog',
  'aria-modal': true,
  isOpen: true,
  onClose: () => {},
};
```

### Customizing Test Options

```typescript
import { testAccessibility, AccessibilityOptions } from 'tsatl';

const options: AccessibilityOptions = {
  // Ignore specific rules
  ignoreRules: ['color-contrast'],
  
  // Enable strict mode (all violations become errors)
  strictMode: true,
  
  // Custom error messages
  customMessages: {
    'img-alt': 'Please add alternative text to this image',
  },
};

const result = testAccessibility(<MyComponent />, options);
```

## Built-in Rules

1. Image Alt Text (`img-alt`)
   - Ensures images have valid alt text
   - Severity: error

2. ARIA Labels (`aria-label`)
   - Checks for aria-label on interactive elements without text content
   - Severity: warning

3. Heading Structure (`heading-order`)
   - Validates heading level hierarchy
   - Severity: warning

4. Button Role (`button-role`)
   - Ensures elements with onClick handlers have appropriate button roles
   - Severity: error

5. Form Labels (`form-label`)
   - Ensures form controls have associated labels
   - Severity: error

6. Color Contrast (`color-contrast`)
   - Checks for sufficient color contrast in text elements
   - Severity: warning

7. Link Text (`link-text`)
   - Ensures links have meaningful text content
   - Severity: error

8. Table Structure (`table-structure`)
   - Validates proper table header structure
   - Severity: error

9. Landmarks (`landmarks`)
   - Ensures proper use of landmark roles
   - Severity: warning

## Type-Safe Interfaces

The library provides TypeScript interfaces for common accessible components:

- `AccessibleImageProps`
- `AccessibleButtonProps`
- `AccessibleInputProps`
- `AccessibleFormProps`
- `AccessibleSelectProps`
- `AccessibleTableProps`
- `AccessibleDialogProps`
- `AccessibleLinkProps`

## Context-Aware Testing

The library maintains context while traversing the component tree:

```typescript
const options: AccessibilityOptions = {
  context: {
    role: 'navigation',
    level: 1,
    inLandmark: true,
    inInteractiveElement: false,
  },
};
```

## Custom Rules

You can create custom rules by implementing the `AccessibilityRule` interface:

```typescript
import { AccessibilityRule } from 'tsatl';

const customRule: AccessibilityRule = {
  id: 'custom-rule',
  description: 'Custom accessibility rule',
  severity: 'warning',
  test: (element) => {
    // Your test logic here
    return true;
  },
};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 