import Toggler from 'storm-toggler';
import { TOGGLERS } from '../../constants';

export default () => {
	if(document.querySelector(TOGGLERS.SELECTOR.GLOBAL)) Toggler.init(TOGGLERS.SELECTOR.GLOBAL);
	if(document.querySelector(TOGGLERS.SELECTOR.LOCAL)) Toggler.init(TOGGLERS.SELECTOR.LOCAL, TOGGLERS.OPTIONS.LOCAL);
};