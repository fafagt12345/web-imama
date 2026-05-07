module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASS || 'imama123';
  if (password === adminPass) {
    return res.json({ success: true, message: 'Login berhasil' });
  }
  res.status(401).json({ success: false, message: 'Password salah' });
};