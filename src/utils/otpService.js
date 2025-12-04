// Simple OTP generator and validator (for development)
// In production, use Firebase Phone Auth or SMS service

class OTPService {
  constructor() {
    this.otpStore = new Map(); // phone -> {otp, expiresAt}
    this.OTP_EXPIRY_MINUTES = 10;
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP to phone (mock for development)
  sendOTP(phoneNumber) {
    return new Promise((resolve, reject) => {
      try {
        // Generate OTP
        const otp = this.generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

        // Store OTP
        this.otpStore.set(phoneNumber, {
          otp,
          expiresAt,
          attempts: 0
        });

        // In development, log OTP to console
        console.log(`📱 OTP for ${phoneNumber}: ${otp}`);
        console.log(`⏰ OTP expires at: ${expiresAt.toLocaleTimeString()}`);

        // In production, integrate with SMS gateway here
        // await smsService.send(phoneNumber, `Your OTP is: ${otp}`);

        resolve({
          success: true,
          message: 'OTP sent successfully',
          otp: otp, // Only for development
          expiresIn: `${this.OTP_EXPIRY_MINUTES} minutes`
        });
      } catch (error) {
        reject({
          success: false,
          error: 'Failed to send OTP'
        });
      }
    });
  }

  // Verify OTP
  verifyOTP(phoneNumber, userOTP) {
    return new Promise((resolve, reject) => {
      const storedData = this.otpStore.get(phoneNumber);
      
      if (!storedData) {
        return reject({
          success: false,
          error: 'OTP expired or not requested'
        });
      }

      // Check expiry
      if (new Date() > storedData.expiresAt) {
        this.otpStore.delete(phoneNumber);
        return reject({
          success: false,
          error: 'OTP has expired'
        });
      }

      // Check attempts
      if (storedData.attempts >= 3) {
        this.otpStore.delete(phoneNumber);
        return reject({
          success: false,
          error: 'Too many attempts. Please request new OTP'
        });
      }

      // Verify OTP
      if (storedData.otp === userOTP) {
        this.otpStore.delete(phoneNumber); // Clear after successful verification
        resolve({
          success: true,
          message: 'OTP verified successfully'
        });
      } else {
        // Increment attempts
        storedData.attempts++;
        this.otpStore.set(phoneNumber, storedData);
        
        reject({
          success: false,
          error: 'Invalid OTP',
          attemptsLeft: 3 - storedData.attempts
        });
      }
    });
  }

  // Resend OTP
  resendOTP(phoneNumber) {
    return this.sendOTP(phoneNumber);
  }

  // Clear expired OTPs (call periodically)
  cleanupExpiredOTPs() {
    const now = new Date();
    for (const [phone, data] of this.otpStore.entries()) {
      if (now > data.expiresAt) {
        this.otpStore.delete(phone);
      }
    }
  }
}

// Singleton instance
export default new OTPService();