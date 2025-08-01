// utils/validation.ts

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const ValidationRules = {
    // Name validation
    name: {
        required: (value: string): ValidationResult => ({
            isValid: value.trim().length > 0,
            error: 'Name is required'
        }),
        minLength: (min: number) => (value: string): ValidationResult => ({
            isValid: value.trim().length >= min,
            error: `Name must be at least ${min} characters`
        }),
        maxLength: (max: number) => (value: string): ValidationResult => ({
            isValid: value.trim().length <= max,
            error: `Name must be less than ${max} characters`
        }),
        pattern: (pattern: RegExp, message: string) => (value: string): ValidationResult => ({
            isValid: pattern.test(value),
            error: message
        })
    },

    // Email validation
    email: {
        required: (value: string): ValidationResult => ({
            isValid: value.trim().length > 0,
            error: 'Email is required'
        }),
        format: (value: string): ValidationResult => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return {
                isValid: emailRegex.test(value.trim()),
                error: 'Please enter a valid email address'
            };
        }
    },

    // Password validation
    password: {
        required: (value: string): ValidationResult => ({
            isValid: value.length > 0,
            error: 'Password is required'
        }),
        minLength: (min: number) => (value: string): ValidationResult => ({
            isValid: value.length >= min,
            error: `Password must be at least ${min} characters`
        }),
        strength: (value: string): ValidationResult => {
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumber = /\d/.test(value);
            const hasSpecialChar = /[@$!%*?&]/.test(value);

            if (!hasUpperCase || !hasLowerCase || !hasNumber) {
                return {
                    isValid: false,
                    error: 'Password must contain uppercase, lowercase, and number'
                };
            }

            return { isValid: true };
        }
    },

    // Phone validation
    phone: {
        required: (value: string): ValidationResult => ({
            isValid: value.trim().length > 0,
            error: 'Phone number is required'
        }),
        format: (value: string): ValidationResult => {
            // Zimbabwe phone format validation
            const phoneRegex = /^\+263\s?7[0-9]\s?[0-9]{3}\s?[0-9]{4}$/;
            const cleanPhone = value.replace(/\s/g, '');

            return {
                isValid: phoneRegex.test(cleanPhone),
                error: 'Please enter a valid Zimbabwe phone number'
            };
        }
    },

    // Address validation
    address: {
        required: (value: string): ValidationResult => ({
            isValid: value.trim().length > 0,
            error: 'Address is required'
        }),
        minLength: (min: number) => (value: string): ValidationResult => ({
            isValid: value.trim().length >= min,
            error: `Address must be at least ${min} characters`
        })
    },

    // OTP validation
    otp: {
        required: (value: string): ValidationResult => ({
            isValid: value.trim().length > 0,
            error: 'Verification code is required'
        }),
        format: (value: string): ValidationResult => ({
            isValid: /^\d{4}$/.test(value),
            error: 'Please enter a valid 4-digit code'
        })
    }
};

// Validator class for running multiple validation rules
export class Validator {
    private rules: Array<(value: string) => ValidationResult> = [];

    addRule(rule: (value: string) => ValidationResult): Validator {
        this.rules.push(rule);
        return this;
    }

    validate(value: string): ValidationResult {
        for (const rule of this.rules) {
            const result = rule(value);
            if (!result.isValid) {
                return result;
            }
        }
        return { isValid: true };
    }
}

// Helper function to create validators
export const createValidator = () => new Validator();

// Common validation configurations
export const Validators = {
    pharmacyName: createValidator()
        .addRule(ValidationRules.name.required)
        .addRule(ValidationRules.name.minLength(2))
        .addRule(ValidationRules.name.maxLength(50)),

    pharmacistName: createValidator()
        .addRule(ValidationRules.name.required)
        .addRule(ValidationRules.name.minLength(2))
        .addRule(ValidationRules.name.maxLength(50))
        .addRule(ValidationRules.name.pattern(
            /^[a-zA-Z\s'-]+$/,
            'Name can only contain letters, spaces, hyphens, and apostrophes'
        )),

    email: createValidator()
        .addRule(ValidationRules.email.required)
        .addRule(ValidationRules.email.format),

    password: createValidator()
        .addRule(ValidationRules.password.required)
        .addRule(ValidationRules.password.minLength(8))
        .addRule(ValidationRules.password.strength),

    phone: createValidator()
        .addRule(ValidationRules.phone.required)
        .addRule(ValidationRules.phone.format),

    address: createValidator()
        .addRule(ValidationRules.address.required)
        .addRule(ValidationRules.address.minLength(10)),

    otp: createValidator()
        .addRule(ValidationRules.otp.required)
        .addRule(ValidationRules.otp.format)
};

// Format phone number for display
export const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.startsWith('263')) {
        const parts = cleaned.match(/^(263)(\d{2})(\d{3})(\d{4})$/);
        if (parts) {
            return `+${parts[1]} ${parts[2]} ${parts[3]} ${parts[4]}`;
        }
    }

    if (cleaned.startsWith('0')) {
        const parts = cleaned.match(/^(0)(\d{2})(\d{3})(\d{4})$/);
        if (parts) {
            return `${parts[1]}${parts[2]} ${parts[3]} ${parts[4]}`;
        }
    }

    return value;
};

// Convert local phone number to international format
export const toInternationalPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.startsWith('0')) {
        return `+263${cleaned.substring(1)}`;
    }

    if (cleaned.startsWith('263')) {
        return `+${cleaned}`;
    }

    return value;
};

// Password strength calculator
export interface PasswordStrength {
    score: number; // 0-4
    label: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
    color: string;
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    const strengthMap: Record<number, PasswordStrength> = {
        0: { score: 0, label: 'Weak', color: '#EF4444' },
        1: { score: 1, label: 'Weak', color: '#EF4444' },
        2: { score: 2, label: 'Fair', color: '#F59E0B' },
        3: { score: 3, label: 'Good', color: '#10B981' },
        4: { score: 4, label: 'Strong', color: '#059669' },
        5: { score: 5, label: 'Very Strong', color: '#047857' }
    };

    return strengthMap[score] || strengthMap[0];
};

// Sanitize input
export const sanitizeInput = {
    name: (value: string): string => {
        return value.trim().replace(/\s+/g, ' ');
    },

    email: (value: string): string => {
        return value.trim().toLowerCase();
    },

    phone: (value: string): string => {
        return value.replace(/\D/g, '');
    },

    address: (value: string): string => {
        return value.trim().replace(/\s+/g, ' ');
    }
};

// Error messages
export const ErrorMessages = {
    network: 'Network error. Please check your connection and try again.',
    server: 'Server error. Please try again later.',
    invalidCredentials: 'Invalid email or password.',
    emailExists: 'An account with this email already exists.',
    weakPassword: 'Password is too weak. Please choose a stronger password.',
    invalidOtp: 'Invalid verification code. Please try again.',
    otpExpired: 'Verification code has expired. Please request a new one.',
    documentUploadFailed: 'Failed to upload document. Please try again.',
    profileIncomplete: 'Please complete your profile to continue.',
    licenseNotVerified: 'Your license is pending verification.',
    generic: 'Something went wrong. Please try again.'
};

// Success messages
export const SuccessMessages = {
    accountCreated: 'Account created successfully!',
    emailVerified: 'Email verified successfully!',
    phoneVerified: 'Phone number verified successfully!',
    documentUploaded: 'Document uploaded successfully!',
    profileCompleted: 'Profile completed successfully!',
    otpSent: 'Verification code sent successfully!',
    passwordReset: 'Password reset successfully!'
};

// Onboarding progress tracking
export interface OnboardingProgress {
    currentStep: number;
    totalSteps: number;
    completedSteps: string[];
    isComplete: boolean;
}

export const calculateOnboardingProgress = (
    userRole: 'pharmacist' | 'pharmacy',
    completedSteps: string[]
): OnboardingProgress => {
    const pharmacistSteps = ['signup', 'contact', 'verification', 'documents'];
    const pharmacySteps = ['signup', 'contact', 'verification', 'address', 'documents'];

    const steps = userRole === 'pharmacist' ? pharmacistSteps : pharmacySteps;
    const currentStep = completedSteps.length;
    const totalSteps = steps.length;
    const isComplete = currentStep === totalSteps;

    return {
        currentStep,
        totalSteps,
        completedSteps,
        isComplete
    };
};