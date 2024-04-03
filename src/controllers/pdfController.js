import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';

const __dirname = path.resolve();

const downloadPDF = async (req, res, analyticsData, templateName, fileName) => {
    try {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();

        const templatePath = path.resolve(__dirname, `template/${templateName}.ejs`);
        const htmlContent = await ejs.renderFile(templatePath, { analyticsData, currentDate, currentTime });

        const pdfPath = path.resolve(__dirname, `pdf/${fileName}.pdf`);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({ path: pdfPath, format: 'A4' });
        await browser.close();

        res.download(pdfPath, `${fileName}.pdf`, async (err) => {
            if (!err) {
                await fs.promises.unlink(pdfPath);
            }
        });
    } catch (error) {
        console.error(`Error fetching ${fileName} analytics data:`, error);
        res.status(500).send('Internal Server Error');
    }
};

export const userAnalytics = async (req, res) => {
    const { data } = req.query;
    const analyticsData = JSON.parse(decodeURIComponent(data || '{}'));
    await downloadPDF(req, res, analyticsData, 'tempUserAnalytics', 'UserAnalyticsReport');
};

export const ageAnalytics = async (req, res) => {
    const { data } = req.query;
    const analyticsData = JSON.parse(decodeURIComponent(data || '{}'));
    await downloadPDF(req, res, analyticsData, 'tempAgeAnalytics', 'AgeAnalyticsReport');
};

export const genderAnalytics = async (req, res) => {
    const { data } = req.query;
    const analyticsData = JSON.parse(decodeURIComponent(data || '{}'));
    await downloadPDF(req, res, analyticsData, 'tempGenderAnalytics', 'GenderAnalyticsReport');
};

export const postAnalytics = async (req, res) => {
    const { data } = req.query;
    const analyticsData = JSON.parse(decodeURIComponent(data || '{}'));
    await downloadPDF(req, res, analyticsData, 'tempPostAnalytics', 'PostAnalyticsReport');
};

export const postUserAnalytics = async (req, res) => {
    const { data } = req.query;
    const analyticsData = JSON.parse(decodeURIComponent(data || '{}'));
    await downloadPDF(req, res, analyticsData, 'tempPost(User)Analytics', 'Post(User)AnalyticsReport');
 };

export const salesAnalytics = async (req, res) => { 
    const { data } = req.query;
    const analyticsData = JSON.parse(decodeURIComponent(data || '{}'));
    await downloadPDF(req, res, analyticsData, 'tempSalesAnalytics', 'SalesAnalyticsReport');
};
