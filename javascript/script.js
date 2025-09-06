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
    setTimeout(() => {
        const shortUrl = 'https://sho.rt/' + Math.random().toString(36).substring(2, 8);
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
    }, 1600);
});

urlInput.addEventListener('input', function() {
    resultDiv.style.display = 'none';
    resultDiv.innerHTML = '';
});
