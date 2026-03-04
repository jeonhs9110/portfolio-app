const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDFs() {
    console.log('Starting puppeteer...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const publicDir = path.join(__dirname, 'public');

    const filesToConvert = [
        {
            input: 'resume-ko.html',
            output: 'Hyunsik_Jeon_Resume_KR.pdf'
        },
        {
            input: 'resume-en.html',
            output: 'Hyunsik_Jeon_Resume_EN.pdf'
        },
        {
            input: 'portfolio-ko.html',
            output: 'Hyunsik_Jeon_Portfolio_KR.pdf'
        },
        {
            input: 'portfolio-en.html',
            output: 'Hyunsik_Jeon_Portfolio_EN.pdf'
        }
    ];

    for (const item of filesToConvert) {
        const inputPath = path.join(publicDir, item.input);
        const outputPath = path.join(publicDir, item.output);
        const fileUrl = 'file://' + inputPath.replace(/\\/g, '/');

        console.log(`Generating PDF for ${item.input} -> ${item.output}`);
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });

        // A4 format, hide background if needed
        await page.pdf({
            path: outputPath,
            format: 'a4',
            printBackground: true,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            }
        });
        console.log(`Saved: ${item.output}`);
    }

    await browser.close();
    console.log('Done!');
}

generatePDFs().catch(console.error);
