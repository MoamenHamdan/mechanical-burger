// Password Management Service
// This service handles dynamic password changes using a global key + user key system

// Read global key from env; fall back to a strong default only for development
const GLOBAL_KEY = import.meta.env.VITE_GLOBAL_KEY || 'MOAMENHAMDAN!@#$%^&*()';

export interface PasswordChangeRequest {
  globalKey: string;
  newPassword: string;
  passwordType: 'admin' | 'advanced_admin';
}

export interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
}

class PasswordService {
  private static instance: PasswordService;
  
  private constructor() {}
  
  public static getInstance(): PasswordService {
    if (!PasswordService.instance) {
      PasswordService.instance = new PasswordService();
    }
    return PasswordService.instance;
  }

  /**
   * Validates a password change request
   */
  public validatePasswordChange(request: PasswordChangeRequest): PasswordValidationResult {
    // Validate global key
    if (request.globalKey !== GLOBAL_KEY) {
      return {
        isValid: false,
        error: 'Invalid global key'
      };
    }

    // Validate new password
    if (!request.newPassword || request.newPassword.length < 6) {
      return {
        isValid: false,
        error: 'Password must be at least 6 characters long'
      };
    }

    if (request.newPassword.length > 50) {
      return {
        isValid: false,
        error: 'Password must be less than 50 characters'
      };
    }

    // Check for valid characters (alphanumeric and common symbols)
    const validCharsRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (!validCharsRegex.test(request.newPassword)) {
      return {
        isValid: false,
        error: 'Password contains invalid characters'
      };
    }

    return { isValid: true };
  }

  /**
   * Changes a password by updating the environment variables
   */
  public async changePassword(request: PasswordChangeRequest): Promise<{ success: boolean; error?: string; message?: string }> {
    const validation = this.validatePasswordChange(request);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    try {
      const passwordKey = request.passwordType === 'admin' 
        ? 'VITE_ADMIN_PASSWORD' 
        : 'VITE_ADVANCED_ADMIN_PASSWORD';
      
      // Store the new password in localStorage for immediate use
      localStorage.setItem(`new_${passwordKey}`, request.newPassword);
      
      // Also store in sessionStorage for current session
      sessionStorage.setItem(`new_${passwordKey}`, request.newPassword);
      
      // Store the change timestamp
      localStorage.setItem(`password_changed_${request.passwordType}`, Date.now().toString());
      
      // Log the change
      console.log(`Password changed for ${request.passwordType} at ${new Date().toISOString()}`);
      console.log(`New password stored in localStorage as: new_${passwordKey}`);
      
      // Show success message with instructions
      const message = `Password changed successfully! The new password is now active. You can use it immediately.`;
      
      return { success: true, message };
    } catch (error) {
      console.error('Error changing password:', error);
      return {
        success: false,
        error: 'Failed to change password. Please try again.'
      };
    }
  }

  /**
   * Gets the current global key
   */
  public getGlobalKey(): string {
    return GLOBAL_KEY;
  }

  /**
   * Gets current password status (masked)
   */
  public getPasswordStatus(): { admin: string; advancedAdmin: string; adminChanged: boolean; advancedChanged: boolean } {
    const adminChanged = !!localStorage.getItem('password_changed_admin');
    const advancedChanged = !!localStorage.getItem('password_changed_advanced_admin');
    
    return {
      admin: '••••••••',
      advancedAdmin: '••••••••',
      adminChanged,
      advancedChanged
    };
  }

  /**
   * Checks if a password change is needed (for demo purposes)
   */
  public isPasswordChangeNeeded(): boolean {
    // In a real app, this might check if passwords haven't been changed in X days
    return false;
  }
}

export const passwordService = PasswordService.getInstance();
