import FontFaceObserver from 'FontFaceObserver';
import CONSTANTS from '../../constants';

export default () => {
	Promise
	.all(CONSTANTS.FONTS.map(font => new FontFaceObserver(font).load()))
	.then(() => document.documentElement.classList.remove('no-webfonts'),() => console.log('Font is not available after waiting 3 seconds'));
};