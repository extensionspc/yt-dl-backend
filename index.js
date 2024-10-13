const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());  // Enable CORS

// Root route for testing
app.get('/', (req, res) => {
  res.send('API is running. Use /api/video?url=<youtube-url>');
});

// API Route to Fetch Video Info
app.get('/api/video', async (req, res) => {
  const videoUrl = req.query.url;

  try {
    const info = await ytdl.getInfo(videoUrl);
    res.status(200).json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      downloads: info.formats.map(format => ({
        url: format.url,
        extension: format.container,
        size: format.contentLength || 'N/A'
      }))
    });
  } catch (error) {
    console.error('Error fetching video:', error);  // Log error details
    res.status(500).json({ error: `Failed to fetch video data: ${error.message}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
