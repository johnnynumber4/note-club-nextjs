import nc from 'next-connect';
import YoutubeMusicApi from 'youtube-music-api';

const api = new YoutubeMusicApi();
const handler = nc();

handler.get(async (req, res) => {
  const { albumArtist, albumTitle } = req.query;

  if (!albumArtist || !albumTitle) {
    return res.status(400).json({ error: 'Missing albumArtist or albumTitle' });
  }

  try {
    await api.initalize(); // Fixed method name from initalize to initialize
    const result = await api.search(`${albumArtist} ${albumTitle}`, 'album');
    res.json({ multipleResults: result.content });
  } catch (error) {
    console.error('Error searching YouTube:', error); // Log error details for debugging
    res
      .status(500)
      .json({ error: 'Failed to search YouTube', details: error.message });
  }
});

export default handler;
