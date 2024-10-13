const youtubedl = require('youtube-dl-exec');

export default async function handler(req, res) {
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
    console.error('Error fetching video:', error.message);
    res.status(500).json({ error: 'Failed to fetch video data.' });
  }
}
