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
  if (req.method !== 'POST') {
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

    const payload = req.body;

    // Prepare data
    const data = {
      about: payload.about || { intro: '', history: '', logo: '', philosophy: '', vision: '' },
      settings: payload.settings || {},
      hero_slides: payload.hero_slides || [],
      events: payload.events || [],
      gallery: payload.gallery || [],
      staff: payload.staff || [],
      timeline: payload.timeline || []
    };

    // Merge settings
    if (payload.hero) {
      data.settings.hero_title = payload.hero.title || '';
      data.settings.hero_subtitle = payload.hero.subtitle || '';
    }
    if (payload.contact) {
      data.settings.email = payload.contact.email || '';
      data.settings.instagram = payload.contact.instagram || '';
      data.settings.whatsapp = payload.contact.whatsapp || '';
      data.settings.address = payload.contact.address || '';
    }

    await db.collection('data').doc('main').set(data);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('[bulk-import error]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};