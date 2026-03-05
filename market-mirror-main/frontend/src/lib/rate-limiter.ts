// Simple rate limiter to prevent rapid requests
class RateLimiter {
  private attempts = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>();
  
  constructor(private maxAttempts: number = 3, private windowMs: number = 60000) {} // 3 attempts per minute
  
  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Check if currently blocked
    if (record.blockedUntil && now < record.blockedUntil) {
      return false;
    }
    
    // Reset if window expired or block period ended
    if (now - record.lastAttempt > this.windowMs || (record.blockedUntil && now >= record.blockedUntil)) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Check if under limit
    if (record.count < this.maxAttempts) {
      record.count++;
      record.lastAttempt = now;
      return true;
    }
    
    // Block for extended period if limit exceeded
    record.blockedUntil = now + (this.windowMs * 2); // Block for 2x window time
    return false;
  }
  
  getRemainingAttempts(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return this.maxAttempts;
    
    const now = Date.now();
    if (now - record.lastAttempt > this.windowMs || (record.blockedUntil && now >= record.blockedUntil)) {
      return this.maxAttempts;
    }
    
    return Math.max(0, this.maxAttempts - record.count);
  }
  
  getTimeToReset(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;
    
    const now = Date.now();
    
    // If blocked, return block time
    if (record.blockedUntil && now < record.blockedUntil) {
      return record.blockedUntil - now;
    }
    
    // Otherwise return window reset time
    const timeSinceLast = now - record.lastAttempt;
    return Math.max(0, this.windowMs - timeSinceLast);
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// More conservative limits to prevent 429 errors
export const authRateLimiter = new RateLimiter(2, 60000); // 2 attempts per minute
export const signupRateLimiter = new RateLimiter(1, 120000); // 1 signup per 2 minutes
