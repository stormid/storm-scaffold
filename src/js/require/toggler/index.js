import Toggler from './libs/toggler';
import CONSTANTS from '../../constants';

export default () => {
	if(document.querySelector(CONSTANTS.TOGGLERS.CLASSNAME.GLOBAL)) Toggler.init(CONSTANTS.TOGGLERS.CLASSNAME.GLOBAL);
	if(document.querySelector(CONSTANTS.TOGGLERS.CLASSNAME.LOCAL)) Toggler.init(CONSTANTS.TOGGLERS.CLASSNAME.LOCAL, {targetLocal: true});
};