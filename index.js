const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());  // Enable CORS

// Root route for testing
app.get('/', (req, res) => {
  res.send('API is running. Use /api/video?url=<youtube-url>');
});

// API Route to Fetch Video Info via Proxy
app.get('/api/video', async (req, res) => {
  const videoUrl = req.query.url;

  try {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const proxiedUrl = `${proxyUrl}${videoUrl}`;

    const info = await ytdl.getInfo(proxiedUrl, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      },
    });

    res.status(200).json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      downloads: info.formats.map((format) => ({
        url: format.url,
        extension: format.container,
        size: format.contentLength || 'N/A',
      })),
    });
  } catch (error) {
    console.error('Error fetching video:', error.message);
    res.status(500).json({ error: `Failed to fetch video data: ${error.message}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
