// Function to handle the Download button click
function openbox() {
    document.getElementById("loading").style.display = "block";
}

// Debounce function to prevent multiple requests
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// AJAX Request to Fetch Video Info
function makeRequest(inputUrl, retries = 4) {
    $.ajax({
        url: `https://yt-dl-backend.vercel.app/api/video?url=${encodeURIComponent(inputUrl)}`,
        type: "GET",
        cache: true,
        crossDomain: true,
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept-Language': 'en-US,en;q=0.9',
        },
        success: function (data) {
            handleSuccessResponse(data);
        },
        error: function (xhr, status, error) {
            if (retries > 0) {
                console.log(`Retrying... (${retries} attempts left)`);
                makeRequest(inputUrl, retries - 1);
            } else {
                console.error(`Error: ${error}, Status: ${status}`);
                alert("Failed to fetch video. Please try again.");
                document.getElementById("loading").style.display = "none";
            }
        }
    });
}

// Handle Successful Response
function handleSuccessResponse(data) {
    if (!data || !data.downloads) {
        alert("No download links found.");
        document.getElementById("loading").style.display = "none";
        return;
    }

    document.getElementById("container").style.display = "block";
    document.getElementById("loading").style.display = "none";

    const videoData = data;

    const thumbnail = videoData.thumbnail;
    const title = videoData.title;

    updateElement("thumb", `<img src="${thumbnail}" style="max-width: 100%; height: auto;">`);
    updateElement("title", `<h3>${title}</h3>`);

    const downloadContainer = document.getElementById("download");
    downloadContainer.innerHTML = "";

    videoData.downloads.forEach(download => {
        const downloadUrl = download.url;
        const format = download.extension;
        const size = download.size || 'Unknown';

        const button = `<a href="${downloadUrl}" target="_blank">
            <button class="btn btn-success">${format} (${size})</button>
        </a>`;

        downloadContainer.innerHTML += button;
    });
}

// Update Element Content
function updateElement(elementId, content) {
    document.getElementById(elementId).innerHTML = content;
}

// Debounced Event Listener for the Download Button
document.getElementById("downloadBtn").addEventListener("click", debounce(function () {
    document.getElementById("loading").style.display = "block";
    const inputUrl = document.getElementById("inputUrl").value;
    makeRequest(inputUrl);
}, 300));

const videoHtml = `
    <video style='background: black url(${thumbnailUrl}) center center/cover no-repeat; width:100%; height:500px; border-radius:20px;' 
           poster='${thumbnailUrl}' autoplay controls playsinline>
        <source src='https://your-backend-url.vercel.app/api/video?url=${videoSource}&itag=18' type='video/mp4'>
        ${downloadUrls.map(url => `<source src='${url}' type='video/mp4'>`).join('')}
    </video>`;
