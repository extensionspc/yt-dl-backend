const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/video', async (req, res) => {
    const videoUrl = req.query.url;
    if (!ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: 'Invalid YouTube URL.' });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const downloads = info.formats.map(format => ({
            url: format.url,
            extension: format.container,
            size: format.contentLength || 'N/A',
        }));

        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            downloads,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch video data.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
