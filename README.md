# Nexara

Nexara is a lightweight Node.js module designed to fetch and parse web content efficiently. It also provides a utility for capturing webpage screenshots.

---

### **Author Credit**  
This module was created by **Nimesh Piyumal**.  

- **GitHub**: [Nimesh Piyumal](https://github.com/nimesh-piyumal)  
- **Email**: nimeshofficial.info@gmail.com

Feel free to contribute or report issues!  

---

## Installation

Install the module using npm:

```bash
npm install nexara
```

## Usage

Fetching HTML Content

```javascript
const nexara = require('nexara');

async function fetchHTML() {
    try {
        const response = await nexara.get("https://example.com");
        console.log(response.data); // HTML content
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchHTML();
```

Parsing HTML

```javascript
const nexara = require('nexara');

async function parseHTML() {
    try {
        const response = await nexara.get("https://example.com");
        const $ = nexara.load(response.data);
        
        // Example: Extract the page title
        const title = $('title').text();
        console.log('Page Title:', title);
    } catch (error) {
        console.error('Error:', error);
    }
}

parseHTML();
```

## Capturing Webpage Screenshots

Use the ssweb function to capture a screenshot of a webpage:

```javascript
const nexara = require('nexara');
const fs = require('fs');

async function captureScreenshot() {
    try {
        const screenshot = await nexara.ssweb("https://example.com");
        
        // Save the screenshot to a file
        fs.writeFileSync('screenshot.png', screenshot);
        console.log('Screenshot saved as screenshot.png');
    } catch (error) {
        console.error('Error:', error);
    }
}

captureScreenshot();
```

