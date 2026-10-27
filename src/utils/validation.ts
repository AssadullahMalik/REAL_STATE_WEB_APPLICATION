/**
 * Validation utilities for Property Partner
 * Strictly enforcing real-time validation and accessible error feedback.
 */

export const isValidEmail = (email: string): boolean => {
  if (!email || !email.trim()) return false;
  const trimmed = email.trim();
  
  // Standard RFC 5322 compliant regex requiring proper domain and valid TLD
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) return false;

  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;

  const domain = parts[1];
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;

  // The last part (TLD) must have at least 2 characters (e.g. .com, .org, .pk)
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) return false;

  return true;
};

export const validateEmailField = (email: string): string | null => {
  if (!email || !email.trim()) {
    return 'This field is required.';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
};

export const validatePasswordField = (password: string, minLength = 8): string | null => {
  if (!password) {
    return 'This field is required.';
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long.`;
  }
  return null;
};

export const validateConfirmPasswordField = (confirmPassword: string, password: string): string | null => {
  if (!confirmPassword) {
    return 'This field is required.';
  }
  if (confirmPassword !== password) {
    return 'Passwords do not match.';
  }
  return null;
};

export const validateRequiredField = (value: string, fieldName = 'This field'): string | null => {
  if (!value || !value.trim()) {
    return `${fieldName} is required.`;
  }
  return null;
};
