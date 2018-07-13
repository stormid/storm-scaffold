import jest from 'jest';
import config from '../jest-puppeteer.config';

describe('Server > 200 status and html content', () => {
    let response;
    beforeAll(async () => {
        response = await page.goto(`http://localhost:${config.server.port}/`, { waitUntil: 'load'});
        console.log(response.status());
        console.log(response.headers());
    });


    // it('return a status code 200', async () => {
    //     expect(response.status()).toEqual(200);
    // });

    it('should send "text/html; charset=utf-8" content-type in headers', async () => {
        expect(response.headers()['content-type']).toEqual('text/html; charset=utf-8');
    });
    
});


describe('Server > error handling middleware', () => {
    it('returns status code 403', async () => {
        const response = await page.goto(`http://localhost:${config.server.port}/403`, { waitUntil: 'load'});
        expect(response.status()).toEqual(403)
    });

    it('returns status code 404', async () => {
        const response = await page.goto(`http://localhost:${config.server.port}/404`, { waitUntil: 'load'});
        expect(response.status()).toEqual(404)
    });

    it('returns status code 500', async () => {
        const response = await page.goto(`http://localhost:${config.server.port}/500`, { waitUntil: 'load'});
        expect(response.status()).toEqual(500)
    });
});