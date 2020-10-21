const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');

describe('Страница с возможностью добавить сообщение из формы', () => {
  let browser;
  let page;
  let html;
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    html = await fs.readFile(path.resolve('index.html'), 'utf8');
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
  });

  it('содержит форму', async () => {
    const form = await page.$('form');
    expect(form).not.toBeNull();
  });

  it('содержит поле ввода сообщения внутри формы', async () => {
    const input = await page.$('form input[type="text"]');
    const nameAttribute = await (await input.getProperty('name')).jsonValue();
    expect(input).not.toBeNull();
    expect(nameAttribute).toBe('message');
  });

  it('содержит кнопку внутри формы', async () => {
    const button = await page.$('form button[type="submit"]');
    expect(button).not.toBeNull();
  });

  it('содержит контейнер для сообщений', async () => {
    const container = await page.$('div#messages');
    expect(container).not.toBeNull();
  });

  it('при отправке формы добавляет сообщение в контейнер', async () => {
    const input = await page.$('form input[type="text"]');
    await input.type('Test message!');
    const button = await page.$('form button[type="submit"]');
    await button.click();
    const message = await page.$('#messages div.message');
    expect(message).not.toBeNull();
    expect(await message.evaluate((node) => node.innerText)).toBe('Test message!');
  });

  afterAll(async () => {
    await browser.close();
  });
});
