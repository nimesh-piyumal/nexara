const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const fs = require('fs');
const stream = require('stream');
const util = require('util');

const pipeline = util.promisify(stream.pipeline);

class Nexara {
    /**
     * Core HTTP Request method with Smart Auto-Retry logic and Proxy Support.
     * @param {string} url - The target URL.
     * @param {object} options - Axios request configurations.
     * @param {number} retries - Number of retry attempts if request fails (Default: 3).
     * @returns {Promise<object>} The Axios response object.
     */
    static async request(url, options = {}, retries = 3) {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        
        const defaultOptions = {
            httpsAgent,
            timeout: 10000, // 10 seconds timeout to prevent hanging
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            ...options
        };

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await axios.get(url, defaultOptions);
            } catch (error) {
                if (attempt === retries) {
                    throw new Error(`Nexara request() failed after ${retries} attempts: ${error.message}`);
                }
                // Wait for 1 second before retrying (Exponential Backoff concept can be added here)
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    /**
     * Fetch and parse HTML content directly.
     * @param {string} url - The target URL.
     * @returns {Promise<object>} The Cheerio instance.
     */
    static async fetchHtml(url) {
        const response = await this.request(url);
        return cheerio.load(response.data);
    }

    /**
     * Parse raw HTML string using Cheerio.
     * @param {string} html - The raw HTML string.
     * @returns {object} The Cheerio instance.
     */
    static load(html) {
        return cheerio.load(html);
    }

    /**
     * Extract SEO Meta Data efficiently.
     * @param {string} url - The target URL.
     * @returns {Promise<object>} A JSON object containing meta details.
     */
    static async getMeta(url) {
        const $ = await this.fetchHtml(url);
        return {
            title: $('title').text() || $('meta[property="og:title"]').attr('content') || '',
            description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '',
            image: $('meta[property="og:image"]').attr('content') || '',
            keywords: $('meta[name="keywords"]').attr('content') || '',
            url: url
        };
    }

    /**
     * Extract all Hyperlinks and Image URLs from a webpage.
     * @param {string} url - The target URL.
     * @returns {Promise<object>} Object containing arrays of links and images.
     */
    static async extractAssets(url) {
        const $ = await this.fetchHtml(url);
        const links = [];
        const images = [];

        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript')) links.push(href);
        });

        $('img').each((i, el) => {
            const src = $(el).attr('src');
            if (src) images.push(src);
        });

        // Remove duplicates using Set
        return {
            links: [...new Set(links)],
            images: [...new Set(images)]
        };
    }

    /**
     * Download a file from a URL efficiently using Node.js Streams.
     * @param {string} url - The file URL.
     * @param {string} destination - The local file path to save the downloaded file.
     * @returns {Promise<string>} Success message with file path.
     */
    static async downloadFile(url, destination) {
        try {
            const response = await this.request(url, { responseType: 'stream' });
            await pipeline(response.data, fs.createWriteStream(destination));
            return `File successfully downloaded to ${destination}`;
        } catch (error) {
            throw new Error(`Nexara downloadFile() error: ${error.message}`);
        }
    }

    /**
     * Capture a lightweight webpage screenshot (Legacy Support Maintained).
     * @param {string} url - The target URL to capture.
     * @returns {Promise<Buffer>} The image buffer.
     */
    static async ssweb(url) {
        const apiUrl = `https://image.thum.io/get/width/1200/crop/800/${url}`;
        const response = await this.request(apiUrl, { responseType: 'arraybuffer' });
        return response.data;
    }
}

// Export mapping for backward compatibility and clean API
module.exports = {
    get: (url, options) => Nexara.request(url, options),
    load: Nexara.load,
    ssweb: Nexara.ssweb,
    fetchHtml: Nexara.fetchHtml.bind(Nexara),
    getMeta: Nexara.getMeta.bind(Nexara),
    extractAssets: Nexara.extractAssets.bind(Nexara),
    downloadFile: Nexara.downloadFile.bind(Nexara)
};