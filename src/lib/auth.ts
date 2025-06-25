import crypto from 'crypto';
import bcrypt from 'bcryptjs';



export class AuthService {

  static generateApiKey(): string {
    // Generate a 32-byte random string and encode it as hex
    const randomBytes = crypto.randomBytes(32);
    const timestamp = Date.now().toString(36);
    return `fapi_${timestamp}_${randomBytes.toString('hex')}`;
  }

// gen a unique user ID
  static generateUserId(): string {
    const randomBytes = crypto.randomBytes(16);
    const timestamp = Date.now().toString(36);
    return `user_${timestamp}_${randomBytes.toString('hex')}`;
  }

  // Hash a password using bcrypt
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify a password against its hash
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // is valid email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validate username format
  static validateUsername(username: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (username.length > 20) {
      errors.push('Username must be no more than 20 characters long');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, hyphens, and underscores');
    }

    if (/^[_-]/.test(username) || /[_-]$/.test(username)) {
      errors.push('Username cannot start or end with hyphens or underscores');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Extract API key from Authorization header
  static extractApiKey(authHeader: string | null): string | null {
    if (!authHeader) return null;

    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    const apiKeyMatch = authHeader.match(/^ApiKey\s+(.+)$/i);
    
    if (bearerMatch) return bearerMatch[1];
    if (apiKeyMatch) return apiKeyMatch[1];
    
    if (authHeader.startsWith('fapi_')) return authHeader;
    
    return null;
  }

  // Validate API key format
  static isValidApiKeyFormat(apiKey: string): boolean {
    return /^fapi_[a-z0-9]+_[a-f0-9]{64}$/.test(apiKey);
  }

  // Generate a secure random string for various purposes
  static generateSecureRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex').substring(0, length);
  }

  // Rate limiting helper - generate a simple key for user identification
  static generateRateLimitKey(ip: string, email?: string): string {
    return email ? `auth:${email}` : `auth:ip:${ip}`;
  }
}

export default AuthService;
