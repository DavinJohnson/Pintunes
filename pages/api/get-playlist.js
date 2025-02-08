import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { ipfsHash } = req.query; // Expecting the ipfsHash in the query string (e.g., ?ipfsHash=QmXYZ...)

    if (!ipfsHash) {
      return res.status(400).json({ success: false, message: 'IPFS Hash is required' });
    }

    try {
      // Retrieve the playlist from Pinata using the IPFS hash
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

      res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      console.error('Error retrieving from Pinata:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve playlist from Pinata' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
