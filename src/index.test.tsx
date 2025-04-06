import React from 'react';
import {
  testAccessibility,
  AccessibleImageProps,
  AccessibleButtonProps,
  AccessibleFormProps,
  AccessibleDialogProps,
  AccessibilityOptions,
} from './index';

describe('Accessibility Testing Library', () => {
  describe('Image Tests', () => {
    it('should pass for image with valid alt text', () => {
      const img = <img src="test.jpg" alt="Test image" />;
      const result = testAccessibility(img);
      expect(result.passed).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should fail for image without alt text', () => {
      const img = <img src="test.jpg" />;
      const result = testAccessibility(img);
      expect(result.passed).toBe(false);
      expect(result.violations[0].ruleId).toBe('img-alt');
    });
  });

  describe('Button Tests', () => {
    it('should pass for button with aria-label', () => {
      const button = <button aria-label="Close" onClick={() => {}} />;
      const result = testAccessibility(button);
      expect(result.passed).toBe(true);
    });

    it('should fail for div with onClick but no button role', () => {
      const div = <div onClick={() => {}}>Click me</div>;
      const result = testAccessibility(div);
      expect(result.passed).toBe(false);
      expect(result.violations[0].ruleId).toBe('button-role');
    });
  });

  describe('Heading Structure Tests', () => {
    it('should pass for valid heading structure', () => {
      const heading = (
        <div>
          <h1>Title</h1>
          <h2>Subtitle</h2>
        </div>
      );
      const result = testAccessibility(heading);
      expect(result.passed).toBe(true);
    });

    it('should fail for invalid heading structure', () => {
      const heading = (
        <div>
          <h1>Title</h1>
          <h3>Invalid subtitle</h3>
        </div>
      );
      const result = testAccessibility(heading);
      expect(result.passed).toBe(false);
      expect(result.violations[0].ruleId).toBe('heading-order');
    });
  });

  describe('Type Safety Tests', () => {
    it('should enforce type safety for accessible image props', () => {
      const props: AccessibleImageProps = {
        alt: 'Test image',
        src: 'test.jpg',
      };
      const img = <img {...props} />;
      const result = testAccessibility(img);
      expect(result.passed).toBe(true);
    });

    it('should enforce type safety for accessible button props', () => {
      const props: AccessibleButtonProps = {
        onClick: () => {},
        'aria-label': 'Test button',
      };
      const button = <button {...props} />;
      const result = testAccessibility(button);
      expect(result.passed).toBe(true);
    });
  });

  describe('Form Control Tests', () => {
    it('should pass for form controls with labels', () => {
      const form = (
        <form>
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" />
        </form>
      );
      const result = testAccessibility(form);
      expect(result.passed).toBe(true);
    });

    it('should fail for form controls without labels', () => {
      const form = (
        <form>
          <input type="text" />
        </form>
      );
      const result = testAccessibility(form);
      expect(result.passed).toBe(false);
      expect(result.violations[0].ruleId).toBe('form-label');
    });
  });

  describe('Link Text Tests', () => {
    it('should pass for links with meaningful text', () => {
      const link = <a href="#">Contact Support Team</a>;
      const result = testAccessibility(link);
      expect(result.passed).toBe(true);
    });

    it('should fail for links with non-meaningful text', () => {
      const link = <a href="#">Click Here</a>;
      const result = testAccessibility(link);
      expect(result.passed).toBe(false);
      expect(result.violations[0].ruleId).toBe('link-text');
    });
  });

  describe('Table Structure Tests', () => {
    it('should pass for tables with proper headers', () => {
      const table = (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>25</td>
            </tr>
          </tbody>
        </table>
      );
      const result = testAccessibility(table);
      expect(result.passed).toBe(true);
    });

    it('should fail for tables without headers', () => {
      const table = (
        <table>
          <tbody>
            <tr>
              <td>John</td>
              <td>25</td>
            </tr>
          </tbody>
        </table>
      );
      const result = testAccessibility(table);
      expect(result.passed).toBe(false);
      expect(result.violations[0].ruleId).toBe('table-structure');
    });
  });

  describe('Options Tests', () => {
    it('should respect ignored rules', () => {
      const img = <img src="test.jpg" />;
      const options: AccessibilityOptions = {
        ignoreRules: ['img-alt'],
      };
      const result = testAccessibility(img, options);
      expect(result.passed).toBe(true);
    });

    it('should use custom messages', () => {
      const img = <img src="test.jpg" />;
      const customMessage = 'Please add alt text to this image';
      const options: AccessibilityOptions = {
        customMessages: {
          'img-alt': customMessage,
        },
      };
      const result = testAccessibility(img, options);
      expect(result.violations[0].message).toBe(customMessage);
    });

    it('should enforce strict mode', () => {
      const button = <button onClick={() => {}}>Click</button>;
      const options: AccessibilityOptions = {
        strictMode: true,
      };
      const result = testAccessibility(button, options);
      expect(result.violations[0].severity).toBe('error');
    });
  });

  describe('Type Safety Tests with ARIA Attributes', () => {
    it('should enforce ARIA attributes', () => {
      const props: AccessibleDialogProps = {
        'aria-label': 'Settings Dialog',
        role: 'dialog',
        'aria-modal': true,
        isOpen: true,
        onClose: () => {},
      };
      const dialog = <div {...props} />;
      const result = testAccessibility(dialog);
      expect(result.passed).toBe(true);
    });
  });
}); 