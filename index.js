const express = require('express');
const youtubedl = require('youtube-dl-exec');
const cors = require('cors');

const app = express();
app.use(cors());  // Enable CORS

// API Route to Fetch Video Info
app.get('/api/video', async (req, res) => {
  const videoUrl = req.query.url;

  try {
    const info = await youtubedl(videoUrl, { dumpSingleJson: true });
    res.status(200).json({
      title: info.title,
      thumbnail: info.thumbnail,
      downloads: info.formats.map(format => ({
        url: format.url,
        extension: format.ext,
        size: format.filesize || 'N/A'
      }))
    });
  } catch (error) {
    console.error('Error fetching video:', error);  // Log detailed error
    res.status(500).json({ error: `Failed to fetch video data: ${error.message}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
