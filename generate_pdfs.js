const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const url = require('url');

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
        },
        {
            input: 'resume-en-apple-ga.html',
            output: 'Hyunsik_Jeon_Resume_Apple_GA.pdf'
        },
        {
            input: 'resume-en-rochester-bd.html',
            output: 'Hyunsik_Jeon_Resume_Rochester_BD.pdf'
        },
        {
            input: 'resume-en-citi-research.html',
            output: 'Hyunsik_Jeon_Resume_Citi_Research.pdf'
        },
        {
            input: 'resume-en-transperfect-ai-bd.html',
            output: 'Hyunsik_Jeon_Resume_TransPerfect_AI_BD.pdf'
        },
        {
            input: 'resume-en-qt-bd.html',
            output: 'Hyunsik_Jeon_Resume_Qt_BD.pdf'
        },
        {
            input: 'resume-en-tt-hr.html',
            output: 'Hyunsik_Jeon_Resume_TT_HR.pdf'
        },
        {
            input: 'resume-en-cfd-bd.html',
            output: 'Hyunsik_Jeon_Resume_CFD_BD.pdf'
        },
        {
            input: 'resume-en-healthcare-bd.html',
            output: 'Hyunsik_Jeon_Resume_Healthcare_BD.pdf'
        },
        {
            input: 'resume-en-google-customer-engineer.html',
            output: 'Hyunsik_Jeon_Resume_Google_Customer_Engineer.pdf'
        },
        {
            input: 'resume-en-google-sales-specialist.html',
            output: 'Hyunsik_Jeon_Resume_Google_Sales_Specialist.pdf'
        },
        {
            input: 'resume-en-amazon-ai-ops.html',
            output: 'Hyunsik_Jeon_Resume_Amazon_AI_Ops.pdf'
        },
        {
            input: 'resume-ko-ailingo-ai-startup.html',
            output: 'Hyunsik_Jeon_Resume_AiLingo_AI_Startup_KR.pdf'
        },
        {
            input: 'resume-ko-innocean-ai-pm.html',
            output: 'Hyunsik_Jeon_Resume_Innocean_AI_PM_KR.pdf'
        },
        {
            input: 'resume-ko-ch5-b2b-marketing.html',
            output: 'Hyunsik_Jeon_Resume_CH5_B2B_Marketing_KR.pdf'
        },
        {
            input: 'resume-en-apple-consumer-bd.html',
            output: 'Hyunsik_Jeon_Resume_Apple_Consumer_BD.pdf'
        },
        {
            input: 'resume-en-apple-sales-data-analyst.html',
            output: 'Hyunsik_Jeon_Resume_Apple_Sales_Data_Analyst.pdf'
        },
        {
            input: 'resume-ko-ai-strategist.html',
            output: 'Hyunsik_Jeon_Resume_AI_Strategist_KR.pdf'
        }
    ];

    for (const item of filesToConvert) {
        const inputPath = path.join(publicDir, item.input);
        const outputPath = path.join(publicDir, item.output);
        const fileUrl = url.pathToFileURL(inputPath).href;

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
