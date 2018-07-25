import jest from 'jest';
import { toHaveNoViolations } from 'jest-axe';
const fs = require('fs');
const path = require('path');
import config from '../jest-puppeteer.config';

expect.extend(toHaveNoViolations);

const walkDir = (base, dir) => {
    const baseDir = path.join(base, dir);
    const walk = (dir, filelist = []) => {
        fs.readdirSync(dir).forEach(file => {
            filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walk(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir.split(baseDir)[1], file.replace(/(index)?.html/, '')));

        });
        return filelist;
    };
    return walk(path.join(base, dir));
};

walkDir(__dirname, `../src/templates/views`)
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
