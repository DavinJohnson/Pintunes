import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;
  const { CLIENT_ID, CLIENT_SECRET } = process.env;
  
  try {
    // Exchange code for access token
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        code,
        redirect_uri: 'http://localhost:3000/api/auth/callback',
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );

    const { access_token } = response.data;
    
    // Store the token and user info in session or db
    res.status(200).json({ access_token });
  } catch (error) {
    res.status(400).json({ error: 'Failed to authenticate with Spotify' });
  }
}