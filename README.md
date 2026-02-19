# Nexara

A highly efficient, lightweight Node.js module designed for robust web scraping, HTML parsing, asset extraction, and automated webpage screenshot capturing. 

Unlike heavy headless browser solutions, **Nexara** is built on top of Axios and Cheerio, ensuring maximum performance, low memory footprint, and blisteringly fast execution.

## 🚀 Key Features

- **Smart Auto-Retry:** Automatically handles failed requests (e.g., 500 errors, socket hang-ups) with intelligent retry logic.
- **Advanced Asset Extraction:** Easily extract all hyperlinks and image sources from any webpage.
- **Memory-Efficient File Downloader:** Download large files (images, videos, documents) directly to your disk using Node.js Streams without bloating RAM.
- **SEO Meta Extraction:** Instantly fetch standard and OpenGraph meta tags (Title, Description, Images, Keywords).
- **Lightweight Screenshots:** Capture high-quality webpage screenshots without the heavy overhead of Puppeteer or Playwright.
- **Proxy & Custom Header Support:** Built-in support to bypass basic scraping blocks using custom User-Agents and HTTPS Agents.

## 📦 Installation

Install the package via npm:

```bash
npm install nexara
```

## 💻 Usage & Examples

### 1. Basic HTML Fetching & Parsing

Fetch raw HTML and parse it instantly using the built-in Cheerio wrapper.

```javascript
const nexara = require('nexara');

async function scrapeTitle() {
    try {
        // Fetch and parse in one go
        const $ = await nexara.fetchHtml('[https://example.com](https://example.com)');
        console.log('Page Title:', $('title').text());
    } catch (error) {
        console.error('Scraping Error:', error);
    }
}
scrapeTitle();

```

### 2. Extracting Links and Images

Easily scrape all `href` and `src` attributes from a target URL.

```javascript
const nexara = require('nexara');

async function getAssets() {
    const assets = await nexara.extractAssets('[https://example.com](https://example.com)');
    console.log(`Found ${assets.links.length} Links`);
    console.log(`Found ${assets.images.length} Images`);
}
getAssets();

```

### 3. Memory-Efficient File Downloading

Download files directly to your local storage securely and efficiently.

```javascript
const nexara = require('nexara');

async function download() {
    const result = await nexara.downloadFile(
        '[https://via.placeholder.com/150](https://via.placeholder.com/150)', 
        './downloaded-image.png'
    );
    console.log(result); // "File successfully downloaded to ./downloaded-image.png"
}
download();

```

### 4. Extracting SEO Meta Data

Perfect for building link previews or SEO analysis tools.

```javascript
const nexara = require('nexara');

async function getSeoData() {
    const meta = await nexara.getMeta('[https://github.com/nimesh-piyumal](https://github.com/nimesh-piyumal)');
    console.log('Title:', meta.title);
    console.log('Description:', meta.description);
}
getSeoData();

```

### 5. Capturing Webpage Screenshots

Capture remote webpage screenshots instantly via a lightweight, built-in engine.

```javascript
const nexara = require('nexara');
const fs = require('fs');

async function takeScreenshot() {
    const screenshotBuffer = await nexara.ssweb('[https://github.com](https://github.com)');
    fs.writeFileSync('screenshot.png', screenshotBuffer);
    console.log('Screenshot saved as screenshot.png');
}
takeScreenshot();

```

### 6. Advanced Configuration (Auto-Retries & Proxies)

Make robust requests with automatic retries and custom Axios configurations.

```javascript
const nexara = require('nexara');

async function robustRequest() {
    const options = {
        timeout: 5000,
        // Add proxy or custom headers here
    };
    
    // Will retry up to 3 times if the request fails
    const response = await nexara.get('[https://example.com](https://example.com)', options, 3);
    console.log('Status Code:', response.status);
}
robustRequest();

```

## 🛠️ API Reference

| Method | Description | Returns |
| --- | --- | --- |
| `get(url, [options], [retries])` | Makes an HTTP GET request with auto-retry logic. | `Promise<Object>` |
| `fetchHtml(url)` | Fetches a URL and returns a Cheerio instance. | `Promise<Object>` |
| `load(htmlString)` | Parses raw HTML string using Cheerio. | `Object` (Cheerio) |
| `extractAssets(url)` | Returns an object containing unique arrays of links and images. | `Promise<Object>` |
| `getMeta(url)` | Extracts Title, Description, Image, and Keywords. | `Promise<Object>` |
| `downloadFile(url, dest)` | Downloads a file efficiently to a specified path. | `Promise<String>` |
| `ssweb(url)` | Captures a 1200px wide screenshot of the target URL. | `Promise<Buffer>` |

## 👨‍💻 Author

Created and maintained by **Nimesh Piyumal**.

* GitHub: [nimesh-piyumal](https://github.com/nimesh-piyumal)
* Email: nimeshofficial.info@gmail.com

## 📄 License

This project is licensed under the ISC License. Feel free to contribute or report issues on GitHub!