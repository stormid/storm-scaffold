import Toggle from 'storm-toggle';
import { TOGGLES } from '../../constants';

export default () => {
	if(document.querySelector(TOGGLES.SELECTOR.GLOBAL)) Toggle.init(TOGGLES.SELECTOR.GLOBAL);
	if(document.querySelector(TOGGLES.SELECTOR.LOCAL)) Toggle.init(TOGGLES.SELECTOR.LOCAL, TOGGLES.OPTIONS.LOCAL);
};