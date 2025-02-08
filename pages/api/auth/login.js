import axios from 'axios';

export default async function handler(req, res) {
  const { CLIENT_ID, CLIENT_SECRET } = process.env;
  
  const redirectUri = 'http://localhost:3000/api/auth/callback';
  const scope = 'user-library-read user-read-email'; // Add more scopes as needed

  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.redirect(authUrl);
}