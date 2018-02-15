import PasswordToggle from './libs/storm-password-toggle';

const onDOMContentLoadedTasks = [() => {
    PasswordToggle.init('.js-password__toggle');
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });