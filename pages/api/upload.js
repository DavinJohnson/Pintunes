import { PinataSDK } from "pinata";
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { playlistData } = req.body; 

    if (!playlistData || typeof playlistData !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid playlist data' });
    }

    try {
      // Save the JSON to a file (optional, but useful for debugging)
      const filePath = path.join(process.cwd(), 'tempPlaylist.json');
      fs.writeFileSync(filePath, JSON.stringify(playlistData, null, 2));

      // Create a FormData instance
      const form = new FormData();
      form.append("file", fs.createReadStream(filePath));
      form.append("pinataMetadata", JSON.stringify({
        name: 'playlist_' + Date.now(),
      }));
      form.append("pinataOptions", JSON.stringify({
        cidVersion: 0,
      }));

      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`, // Use JWT here instead of API key
        },
        body: form,
      };

      // Upload the file to Pinata using fetch
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', options);
      const result = await response.json();

      // Delete the temp file after upload
      fs.unlinkSync(filePath);

      if (response.ok) {
        res.status(200).json({ success: true, data: result });
      } else {
        res.status(500).json({ success: false, message: result.error || 'Failed to upload playlist to Pinata' });
      }
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      res.status(500).json({ success: false, message: 'Failed to upload playlist to Pinata' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
