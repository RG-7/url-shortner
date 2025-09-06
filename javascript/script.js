const form = document.getElementById('shortener-form');
const resultDiv = document.getElementById('result');
const urlInput = document.getElementById('url-input');

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const url = urlInput.value.trim();
    resultDiv.style.display = 'none';
    if (!url) {
        resultDiv.innerHTML = '<span style="color:#c00;font-weight:700;">Please enter a URL.</span>';
        resultDiv.style.display = 'block';
        return;
    }
    if (!isValidUrl(url)) {
        resultDiv.innerHTML = '<span style="color:#c00;font-weight:700;">Invalid URL. Please check and try again.</span>';
        resultDiv.style.display = 'block';
        return;
    }
    resultDiv.innerHTML = '<div class="loader-box"><span class="loader"></span> <span>Shortening your URL...</span></div>';
    resultDiv.style.display = 'block';
    // Send POST request to Worker API
    // Generate a random slug for the short URL
    const slug = Math.random().toString(36).substring(2, 8);
    fetch('https://url-engine.rg-ratn.workers.dev/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ target: url, slug })
    })
    .then(async response => {
        const data = await response.json();
        if (data.success && data.slug) {
            const shortUrl = `https://url-engine.rg-ratn.workers.dev/${data.slug}`;
            resultDiv.innerHTML = `
                <span class='short-label'>Shortened URL:</span>
                <div style="display:flex;align-items:center;gap:10px;">
                    <a href='${shortUrl}' target='_blank' class='short-url'>${shortUrl}</a>
                    <button class='copy-btn' type='button' title='Copy URL'>Copy</button>
                </div>
            `;
            const copyBtn = resultDiv.querySelector('.copy-btn');
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(shortUrl);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy', 1200);
            });
        } else {
            resultDiv.innerHTML = `<span style='color:#c00;font-weight:700;'>${data.error || 'Failed to shorten URL.'}</span>`;
        }
        resultDiv.style.display = 'block';
    })
    .catch(() => {
        resultDiv.innerHTML = '<span style="color:#c00;font-weight:700;">Network error. Please try again.</span>';
        resultDiv.style.display = 'block';
    });
});

urlInput.addEventListener('input', function() {
    resultDiv.style.display = 'none';
    resultDiv.innerHTML = '';
});
