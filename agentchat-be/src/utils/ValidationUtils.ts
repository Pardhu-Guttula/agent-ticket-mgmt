export const validateRequiredFields = (fields: { [key: string]: any }): string | null => {
  for (const [field, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") {
      return `${field} is required`;
    }
  }
  return null;
};

export const validateName = (name: string): string | null => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return "Name must contain only letters and spaces";
  }
  if (name.length < 2 || name.length > 50) {
    return "Name must be between 2 and 50 characters";
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  const minLength = 8;
  const maxLength = 50;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength || password.length > maxLength) {
    return `Password must be between ${minLength} and ${maxLength} characters`;
  }
  if (!hasLetter) {
    return "Password must contain at least one letter";
  }
  if (!hasNumber) {
    return "Password must contain at least one number";
  }
  if (!hasSpecialChar) {
    return "Password must contain at least one special character";
  }
  return null;
};

export const validateMobile = (mobile: string): string | null => {
  const mobileRegex = /^\+?[1-9]\d{1,14}$/;
  if (!mobileRegex.test(mobile)) {
    return "Invalid mobile number format";
  }
  return null;
};

