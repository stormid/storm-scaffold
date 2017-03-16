/**
 * @name storm-toggler: Class and ARIA toggle UI state manipulation
 * @version 0.11.0: Wed, 15 Mar 2017 13:46:42 GMT
 * @author mjbp
 * @license MIT
 */
const defaults = {
	delay: 0,
	startOpen: false,
	local: false,
	prehook: false,
	callback: false,
	focus: false,
	trapTab: false
};

const StormToggler = {
	init() {
		this.targetElement = document.getElementById(this.targetId);
		this.classTarget = (!this.settings.local) ? document.documentElement : this.targetElement.parentNode;
		this.siblingBtns = [].slice.call(document.querySelectorAll('[href="#' + this.targetId + '"], [data-target="#' + this.targetId + '"]'));
		if(this.settings.focus) this.focusableChildren = this.getFocusableChildren();
		if(this.settings.trapTab) this.boundKeyListener = this.keyListener.bind(this);

		this.statusClass = !this.settings.local ? `on--${this.targetId}` : 'active';
		this.animatingClass = !this.settings.local ? `animating--${this.targetId}` : 'animating';

		this.siblingBtns.forEach(btn => {
			btn.setAttribute('role','button');
			btn.setAttribute('aria-controls', this.targetId);
			btn.setAttribute('aria-expanded', 'false');
		});

		this.btn.addEventListener('click', e => { this.toggle(e); });
		this.settings.startOpen && this.toggle();
		
		return this;
	},
	getFocusableChildren() {
		const focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

		return [].slice.call(this.targetElement.querySelectorAll(focusableElements.join(',')));
	},
	toggleAttributes: function(){
		this.isOpen = !this.isOpen;
		this.siblingBtns.forEach(sibling => {
			sibling.setAttribute('aria-expanded', sibling.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
		});
	},
	toggleDocumentState: function(){
		this.classTarget.classList.remove(this.animatingClass);
		this.classTarget.classList.toggle(this.statusClass);
	},
	manageFocus: function(){
		if(!this.isOpen){
			this.lastFocused = document.activeElement;
			this.focusableChildren.length && window.setTimeout(() => this.focusableChildren[0].focus(), this.settings.delay);
			this.settings.trapTab && document.addEventListener('keydown', this.boundKeyListener);
		}
		else {
			this.settings.trapTab && document.removeEventListener('keydown', this.boundKeyListener);
			this.focusableChildren.length && window.setTimeout(() => {
				this.lastFocused.focus();
				this.lastFocused = false;
			}, this.settings.delay);
		}
	},
	trapTab: function(e){
		let focusedIndex = this.focusableChildren.indexOf(document.activeElement);
		if(e.shiftKey && focusedIndex === 0) {
			e.preventDefault();
			this.focusableChildren[this.focusableChildren.length - 1].focus();
		} else {
			if(!e.shiftKey && focusedIndex === this.focusableChildren.length - 1) {
				e.preventDefault();
				this.focusableChildren[0].focus();
			}
		}
	},
	keyListener(e){
		if (this.isOpen && e.keyCode === 27) {
			e.preventDefault();
			this.toggle();
		}
		if (this.isOpen && e.keyCode === 9) {
			this.trapTab(e);
		}
	},
	toggle: function(e){
		let delay = this.classTarget.classList.contains(this.statusClass) ?  this.settings.delay : 0;

		(!!this.settings.prehook && typeof this.settings.prehook === 'function') && this.settings.prehook.call(this);
		
		if(e){
			e.preventDefault();
			e.stopPropagation();
		}
		
		this.classTarget.classList.add(this.animatingClass);
		
		window.setTimeout(() => {
			(!!this.settings.focus && this.focusableChildren) && this.manageFocus();
			this.toggleAttributes();
			this.toggleDocumentState();
			(!!this.settings.callback && typeof this.settings.callback === 'function') && this.settings.callback.call(this);
		}, delay);
	}
};

const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel));
	
	if(!els.length) throw new Error('Toggler cannot be initialised, no augmentable elements found');

	return els.map((el) => {
		return Object.assign(Object.create(StormToggler), {
			btn: el,
			targetId: (el.getAttribute('href')|| el.getAttribute('data-target')).substr(1),
			settings: Object.assign({}, defaults, opts)
		}).init();
	});
};

export default { init };