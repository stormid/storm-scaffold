import chokidar from 'chokidar';
import { walker } from '../utils';
import { write } from './render';
import { paths } from '../../config';

const render = file => new Promise(resolve => {
    Promise.all(walker(__dirname, `../../${paths.src.templates}/pages`).map(write))
        .then(resolve)
        .catch(err => console.log(err));
});

chokidar
    .watch(`${paths.src.templates}/**/*`)
    .on('add', render)
    .on('change', render);