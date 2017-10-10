import * as CONSTANTS from '../../constants';
import Load from 'storm-load';

const capitalise = str => str[0].toUpperCase() + str.slice(1);
const constantise = str => str.split('-').join('_').toUpperCase();

export default component => fn => {
                    if(!document.querySelector(CONSTANTS[constantise(component)].SELECTOR)) return;
                    Load(`${CONSTANTS.PATHS.JS_ASYNC}/${CONSTANTS[constantise(component)].MODULE || component}.min.js`)
                        .then(() => fn ? fn() : CONSTANTS[constantise(component)].MODULE ? 
                                        window[CONSTANTS[constantise(component)].MODULE](CONSTANTS[constantise(component)].SELECTOR, CONSTANTS[constantise(component)].OPTIONS || {}) :
                                        window[component.split('-').map(capitalise).join('')]
                                            .init(CONSTANTS[constantise(component)].SELECTOR, CONSTANTS[constantise(component)].OPTIONS || {}));
                };