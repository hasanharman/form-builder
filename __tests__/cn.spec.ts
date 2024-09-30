import { describe, it, expect, vi } from 'vitest';
import { cn } from '../lib/utils';
import { twMerge } from 'tailwind-merge';

vi.mock('tailwind-merge', () => ({
  twMerge: vi.fn((input) => input),
}));

describe('cn', () => {
  it('should merge class names correctly', () => {
    const result = cn('bg-red-500', 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should handle empty strings and falsy values', () => {
    const result = cn('bg-red-500', false, undefined, 'text-white', null);
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should return empty string for no classes', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should call twMerge with correct input', () => {
    const classes = ['bg-red-500', 'text-white'];
    cn(...classes);
    expect(twMerge).toHaveBeenCalledWith(classes.join(' '));
  });
});
