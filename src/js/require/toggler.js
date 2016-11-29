const defaults = {
	delay: 200,
	targetLocal: false,
	callback: null
};

const StormToggler = {
	init() {
		this.targetElement = document.getElementById(this.targetId);
		this.classTarget = (!this.settings.targetLocal) ? document.documentElement : this.targetElement.parentNode;
		this.siblingBtns = [].slice.call(document.querySelectorAll('[href*="#' + this.targetId + '"], [data-target*="#' + this.targetId + '"]'));

		this.statusClass = !this.settings.targetLocal ? `on--${this.targetId}` : 'active';
		this.animatingClass = !this.settings.targetLocal ? `animating--${this.targetId}` : 'animating';

		this.btn.setAttribute('role','button');
		this.btn.setAttribute('aria-controls', this.targetId);
		this.btn.setAttribute('aria-expanded', 'false');

		this.btn.addEventListener('click', e => { this.toggle(e); });
		
		return this;
	},
	toggleAttributes: function(){
		this.open = !this.open;
		this.siblingBtns.forEach(sibling => {
			sibling.setAttribute('aria-expanded', !sibling.getAttribute('aria-expanded'));
		});
	},
	toggleDocumentState: function(){
		this.classTarget.classList.remove(this.animatingClass);
		this.classTarget.classList.toggle(this.statusClass);
	},
	toggle: function(e){
		var delay = this.classTarget.classList.contains(this.statusClass) ?  this.settings.delay : 0;
		
		if(e){
			e.preventDefault();
			e.stopPropagation();
		}
		
		this.classTarget.classList.add(this.animatingClass);
		
		window.setTimeout(() => {
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