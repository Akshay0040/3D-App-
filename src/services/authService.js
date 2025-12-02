import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

class AuthService {
  // Email/Password Sign Up
  signUpWithEmail = async (email, password, phone) => {
    try {
         console.log('Firebase App Check:', {
            app: auth().app,
            appName: auth().app.name,
            apps: auth().apps,
            config: auth().app.options
         });
        console.log('Creating user with:', { email, phone })
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Update user profile with phone number
      await userCredential.user.updateProfile({
        displayName: email.split('@')[0],
      });

    //   await firestore().collection('users').doc(userCredential.user.uid).set({
    //   email: email,
    //   phone: phone,
    //   createdAt: new Date(),
    // });

      // Send email verification
      await userCredential.user.sendEmailVerification();

      console.log('User created successfully:', userCredential.user.uid); 

      return {
        success: true,
        user: userCredential.user,
        message: 'Account created successfully! Please verify your email.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.code // Firebase error code
      };
    }
  };

  // Email/Password Sign In
  signInWithEmail = async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        await userCredential.user.sendEmailVerification();
        return {
          success: false,
          error: 'Please verify your email before signing in. A new verification email has been sent.',
          errorCode: 'auth/email-not-verified'
        };
      }

      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.code // Firebase error code
      };
    }
  };

  // Password Reset
  resetPassword = async (email) => {
    try {
      await auth().sendPasswordResetEmail(email);
      return {
        success: true,
        message: 'Password reset email sent successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.code
      };
    }
  };

  // Sign Out
  signOut = async () => {
    try {
      await auth().signOut();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Get Current User
  getCurrentUser = () => {
    return auth().currentUser;
  };

  // Check Auth State
  onAuthStateChanged = (callback) => {
    return auth().onAuthStateChanged(callback);
  };

  // Delete Account
  deleteAccount = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.delete();
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Update User Profile
  updateProfile = async (displayName, photoURL) => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.updateProfile({
          displayName,
          photoURL
        });
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Send Email Verification
  sendEmailVerification = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.sendEmailVerification();
        return { 
          success: true, 
          message: 'Verification email sent successfully!' 
        };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Update Email
  updateEmail = async (newEmail) => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.updateEmail(newEmail);
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Update Password
  updatePassword = async (newPassword) => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.updatePassword(newPassword);
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Re-authenticate User (required for sensitive operations)
  reauthenticate = async (password) => {
    try {
      const user = auth().currentUser;
      if (user && user.email) {
        const credential = auth.EmailAuthProvider.credential(user.email, password);
        await user.reauthenticateWithCredential(credential);
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };
}

export default new AuthService();