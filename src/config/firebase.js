const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Initialize Firebase Admin SDK
let firebaseInitialized = false;

try {
  // Check if we have the required Firebase credentials
  if (process.env.FIREBASE_PROJECT_ID && 
      process.env.FIREBASE_PRIVATE_KEY && 
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY !== "your-private-key") {
    
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('Firebase Admin SDK initialized successfully');
    firebaseInitialized = true;
  } else {
    // Use application default credentials if available
    try {
      admin.initializeApp();
      console.log('Firebase Admin SDK initialized with default credentials');
      firebaseInitialized = true;
    } catch (defaultCredError) {
      console.warn('Firebase Admin SDK not initialized: Missing credentials');
      console.warn('Push notifications will not work without Firebase credentials');
    }
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  console.warn('Push notifications will not work without Firebase credentials');
}

// Create a mock admin object if Firebase wasn't initialized
const mockAdmin = {
  messaging: () => ({
    send: async () => {
      console.log('[MOCK] Would send push notification (Firebase not configured)');
      return 'mock-message-id';
    },
    sendMulticast: async () => {
      console.log('[MOCK] Would send multicast push notification (Firebase not configured)');
      return { successCount: 0, failureCount: 0 };
    }
  })
};

// Export the real admin if initialized, otherwise export the mock
module.exports = firebaseInitialized ? admin : mockAdmin;