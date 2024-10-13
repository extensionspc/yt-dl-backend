const ytdl = require('ytdl-core');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/video', async (req, res) => {
    const videoUrl = req.query.url;
    if (!ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: 'Invalid YouTube URL.' });
    }

    try {
        const info = await ytdl.getInfo(videoUrl, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                },
            },
        });
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
        console.error('Error fetching video:', error);
        res.status(500).json({ error: `Failed to fetch video data: ${error.message}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
