"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMobile = exports.validatePassword = exports.validateEmail = exports.validateName = exports.validateRequiredFields = void 0;
const validateRequiredFields = (fields) => {
    for (const [field, value] of Object.entries(fields)) {
        if (value === undefined || value === null || value === "") {
            return `${field} is required`;
        }
    }
    return null;
};
exports.validateRequiredFields = validateRequiredFields;
const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        return "Name must contain only letters and spaces";
    }
    if (name.length < 2 || name.length > 50) {
        return "Name must be between 2 and 50 characters";
    }
    return null;
};
exports.validateName = validateName;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }
    return null;
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
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
exports.validatePassword = validatePassword;
const validateMobile = (mobile) => {
    const mobileRegex = /^\+?[1-9]\d{1,14}$/;
    if (!mobileRegex.test(mobile)) {
        return "Invalid mobile number format";
    }
    return null;
};
exports.validateMobile = validateMobile;
