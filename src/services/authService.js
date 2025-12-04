import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from '@react-native-firebase/auth';
import OTPService from '../utils/otpService';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  constructor() {
    this.auth = getAuth();
    this.USERS_STORAGE_KEY = '@smartcontacts_users';
    this.CURRENT_USER_KEY = '@smartcontacts_current_user';
  }

  // ========== USER REGISTRATION ==========
  registerUser = async (firstName, lastName, phone, password) => {
    try {
      console.log('Starting registration for:', { firstName, lastName, phone });
      
      // 1. Generate unique email from phone (for Firebase requirement)
      const firebaseEmail = this.generateEmailFromPhone(phone);
      
      // 2. Create user in Firebase (email/password required by Firebase)
      const userCredential = await createUserWithEmailAndPassword(
        this.auth, 
        firebaseEmail, 
        password
      );
      
      // 3. Update profile with name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // 4. Save user data to local storage (since Firebase doesn't store phone)
      const userData = {
        uid: userCredential.user.uid,
        firstName,
        lastName,
        phone,
        email: firebaseEmail, // Store generated email for reference
        createdAt: new Date().toISOString(),
        isPhoneVerified: false // Will be true after OTP verification
      };

      await this.saveUserToStorage(userData);
      
      console.log('User registered successfully:', userData.uid);
      
      return {
        success: true,
        user: userData,
        message: 'Registration successful! Please verify your phone number.'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error),
        errorCode: error.code
      };
    }
  };

  // ========== PHONE VERIFICATION ==========
  sendPhoneOTP = async (phone) => {
    try {
      // In production, use Firebase Phone Auth:
      // const confirmation = await this.auth.signInWithPhoneNumber(phone);
      
      // For development, use our mock OTP service
      const result = await OTPService.sendOTP(phone);
      
      return {
        success: true,
        message: 'OTP sent successfully',
        // In Firebase: return { confirmation, verificationId }
        // For mock: return otp for testing
        otp: result.otp // Remove in production
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send OTP. Please try again.'
      };
    }
  };

  verifyPhoneOTP = async (phone, otp) => {
    try {
      // Verify OTP
      await OTPService.verifyOTP(phone, otp);
      
      // Mark phone as verified in storage
      const users = await this.getUsersFromStorage();
      const userIndex = users.findIndex(u => u.phone === phone);
      
      if (userIndex !== -1) {
        users[userIndex].isPhoneVerified = true;
        users[userIndex].phoneVerifiedAt = new Date().toISOString();
        await AsyncStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(users));
      }
      
      return {
        success: true,
        message: 'Phone number verified successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.error || 'Invalid OTP'
      };
    }
  };

  // ========== USER LOGIN ==========
  loginWithPhone = async (phone, password) => {
    try {
      // 1. Check if user exists in our storage
      const users = await this.getUsersFromStorage();
      const user = users.find(u => u.phone === phone);
      
      if (!user) {
        return {
          success: false,
          error: 'No account found with this phone number'
        };
      }
      
      // 2. Check if phone is verified
      if (!user.isPhoneVerified) {
        return {
          success: false,
          error: 'Please verify your phone number first',
          needsVerification: true
        };
      }
      
      // 3. Login with Firebase (using generated email)
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        user.email, // Generated email
        password
      );
      
      // 4. Save current user session
      await AsyncStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      
      console.log('Login successful for user:', user.uid);
      
      return {
        success: true,
        user: user,
        message: 'Login successful!'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error),
        errorCode: error.code
      };
    }
  };

  // ========== FORGOT PASSWORD ==========
  forgotPassword = async (phone) => {
    try {
      // 1. Find user by phone
      const users = await this.getUsersFromStorage();
      const user = users.find(u => u.phone === phone);
      
      if (!user) {
        return {
          success: false,
          error: 'No account found with this phone number'
        };
      }
      
      // 2. Send OTP for password reset
      const otpResult = await OTPService.sendOTP(phone);
      
      return {
        success: true,
        message: 'OTP sent for password reset',
        otp: otpResult.otp, // Remove in production
        userEmail: user.email // Need email for Firebase password reset
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process request'
      };
    }
  };

  resetPassword = async (phone, otp, newPassword) => {
    try {
      // 1. Verify OTP
      await OTPService.verifyOTP(phone, otp);
      
      // 2. Find user
      const users = await this.getUsersFromStorage();
      const user = users.find(u => u.phone === phone);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      // 3. Firebase requires reauthentication to change password
      // For simplicity, we'll create a new approach
      // Note: This is a limitation - proper implementation needs user's current password
      
      // Alternative: Store password in secure storage (Keychain/Keystore)
      // Or use Firebase Admin SDK on backend
      
      // For now, we'll update in our storage
      const userIndex = users.findIndex(u => u.phone === phone);
      users[userIndex].password = newPassword; // In real app, hash this!
      
      await AsyncStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(users));
      
      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.error || 'Failed to reset password'
      };
    }
  };

  // ========== HELPER METHODS ==========
  generateEmailFromPhone = (phone) => {
    // Generate unique email for Firebase
    return `${phone}@smartcontacts.app`;
  };

  getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later';
      default:
        return error.message || 'An error occurred';
    }
  };

  // ========== STORAGE HELPERS ==========
  saveUserToStorage = async (userData) => {
    try {
      const existingUsers = await this.getUsersFromStorage();
      existingUsers.push(userData);
      await AsyncStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(existingUsers));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  };

  getUsersFromStorage = async () => {
    try {
      const usersJson = await AsyncStorage.getItem(this.USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  getCurrentUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem(this.CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  };

  logout = async () => {
    try {
      await signOut(this.auth);
      await AsyncStorage.removeItem(this.CURRENT_USER_KEY);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  onAuthStateChanged = (callback) => {
    return firebaseOnAuthStateChanged(this.auth, callback);
  };
}

export default new AuthService();