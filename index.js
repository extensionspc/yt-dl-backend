const express = require('express');
const youtubedl = require('youtube-dl-exec');
const cors = require('cors');

const app = express();
app.use(cors());  // Enable CORS to avoid cross-origin issues

// Route to fetch video information
app.get('/api/video', async (req, res) => {
  const videoUrl = req.query.url;
  try {
    const info = await youtubedl(videoUrl, { dumpSingleJson: true });
    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      downloads: info.formats.map(format => ({
        url: format.url,
        extension: format.ext,
        size: format.filesize || 'N/A'
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch video data.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
