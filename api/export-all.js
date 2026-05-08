const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.firestore();

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if Firebase is configured
    if (!process.env.FIREBASE_PROJECT_ID) {
      return res.status(500).json({
        success: false,
        error: 'Firebase environment variables not configured. Please set FIREBASE_PROJECT_ID, etc. in Vercel.'
      });
    }

    const doc = await db.collection('data').doc('main').get();
    const data = doc.exists ? doc.data() : {
      about: { intro: '', history: '', logo: '', philosophy: '', vision: '' },
      settings: {},
      hero_slides: [],
      events: [],
      gallery: [],
      staff: [],
      timeline: []
    };

    res.status(200).json(data);
  } catch (err) {
    console.error('[export-all error]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};