import { describe, it, expect } from 'vitest';
import { isNotEmpty } from '../lib/utils'

describe('isNotEmpty', () => {
  it('should return true for non-empty strings', () => {
    expect(isNotEmpty('hello')).toBe(true);
  });

  it('should return false for empty strings', () => {
    expect(isNotEmpty('')).toBe(false);
  });

  it('should return false for strings with only spaces', () => {
    expect(isNotEmpty('   ')).toBe(false);
  });
});
