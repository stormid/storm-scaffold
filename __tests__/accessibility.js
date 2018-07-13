import jest from 'jest';
import { toHaveNoViolations } from 'jest-axe';
import config from '../jest-puppeteer.config';
const walker = require('../server/lib/router/walker');

expect.extend(toHaveNoViolations);

walker(__dirname, `../app/ui/templates/views`, /(index)?.html/)
    .forEach(url => {
        url = url === '.' ? '/' : url;

        describe(`Accessibility`, () => {        
            beforeAll(async () => {
                await page.goto(`http://localhost:${config.server.port}${url}`, { waitUntil: 'load'});
                await page.addScriptTag({ path: require.resolve('axe-core') });
            });

            it(`should have no violations on ${url}`, async () => {
                const result = await page.evaluate(() => {
                    return new Promise(resolve => {
                        window.axe.run((err, results) => {
                            if (err) throw err;
                            resolve(results);
                        });
                    });
                });
                expect(result).toHaveNoViolations();
            });
        });
    });
