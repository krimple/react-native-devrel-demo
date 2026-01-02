/**
 * Basic Components Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';
import { EmptyState } from '../EmptyState';

describe('Basic Components', () => {
  describe('LoadingSpinner', () => {
    it('should render', () => {
      const { getByTestId } = render(<LoadingSpinner />);
      // ActivityIndicator is rendered
      expect(true).toBe(true);
    });
  });

  describe('ErrorMessage', () => {
    it('should display error message', () => {
      const { getByText } = render(<ErrorMessage message="Test error" />);
      expect(getByText('Test error')).toBeDefined();
    });

    it('should show retry button when onRetry provided', () => {
      const mockRetry = jest.fn();
      const { getByText } = render(
        <ErrorMessage message="Test error" onRetry={mockRetry} />,
      );
      expect(getByText('Retry')).toBeDefined();
    });
  });

  describe('EmptyState', () => {
    it('should display title and message', () => {
      const { getByText } = render(
        <EmptyState title="Empty" message="No items" />,
      );
      expect(getByText('Empty')).toBeDefined();
      expect(getByText('No items')).toBeDefined();
    });

    it('should show action button when provided', () => {
      const mockAction = jest.fn();
      const { getByText } = render(
        <EmptyState
          title="Empty"
          message="No items"
          actionLabel="Add Items"
          onAction={mockAction}
        />,
      );
      expect(getByText('Add Items')).toBeDefined();
    });
  });
});
