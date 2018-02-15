const defaults = {
	visbileClassName: 'is--visible'
};

const TRIGGER_EVENTS = ['click', 'keydown'],
	TRIGGER_KEYCODES = [13, 32];

const PasswordToggle = {
	init(){
		TRIGGER_EVENTS.forEach(trigger => { this.node.addEventListener(trigger, this.handleTriggered.bind(this));});
		return this;
	},
	handleTriggered(e){
		if(!!e.keyCode && !~TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
		this.toggle();
	},
	toggle(){
        this.input.setAttribute('type', this.input.getAttribute('type') === 'text' ? 'password' : 'text');
		this.node.classList.toggle(this.settings.visbileClassName);
	}
};

const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel));
	
	if(!els.length) return;

	return els.map(el => Object.assign(Object.create(PasswordToggle), {
				node: el,
				input: el.previousElementSibling,
				settings: Object.assign({}, defaults, opts)
			}).init());
};

export default { init };