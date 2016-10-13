let instances = [];
const defaults = {
        delay: 200,
        targetLocal: false,
        callback: null
    },
    StormToggler = {
        init() {
            this.open = false;
            this.targetElement = document.getElementById(this.targetId);
            this.classTarget = (!this.settings.targetLocal) ? document.documentElement : this.targetElement.parentNode;

            this.statusClass = !this.settings.targetLocal ? ['on--', this.targetId].join('') : 'active';
            this.animatingClass = !this.settings.targetLocal ? ['animating--', this.targetId].join('') : 'animating';
    
            this.btn.setAttribute('role', 'button');
            this.btn.setAttribute('aria-controls', this.targetId);
            this.btn.setAttribute('aria-expanded', false);

            this.targetElement.setAttribute('aria-expanded', true);

            this.btn.addEventListener('click', e => { 
                this.toggle.call(this, e); 
            }, false);
        },
        toggle(e) {
            var delay = this.classTarget.classList.contains(this.statusClass) ?  this.settings.delay : 0;
            
            !!e && e.preventDefault(), e.stopPropagation();
            
            this.classTarget.classList.add(this.animatingClass);
            
            window.setTimeout(() => {
                this.open = !this.open;
                this.classTarget.classList.remove(this.animatingClass);
                this.classTarget.classList.toggle(this.statusClass);

                this.btn.setAttribute('aria-expanded', !this.btn.getAttribute('aria-expanded'));
                this.targetElement.setAttribute('aria-hidden', !this.btn.getAttribute('aria-hidden'));
                (!!this.settings.callback && typeof this.settings.callback === 'function') && this.settings.callback.call(this);
            }, delay);
        }
    };

	
const create = (el, i, opts) => {
    instances[i] = Object.assign(Object.create(StormToggler), {
        btn: el,
        targetId: (el.getAttribute('href')|| el.getAttribute('data-target')).substr(1),
        settings: Object.assign({}, defaults, opts)
    });
    instances[i].init();
}

export const init = (sel, opts) => {
    var els = [].slice.call(document.querySelectorAll(sel));
    
    if(els.length === 0) {
        throw new Error('Toggler cannot be initialised, no augmentable elements found');
    }
    
    els.forEach((el, i) => {
        create(el, i, opts);
    });
    return instances;
    
}

export const reload = (sel, opts) => {
    [].slice.call(document.querySelectorAll(sel)).forEach((el, i) => {
        if(!instances.filter(instance => { return (instance.btn === el); }).length) {
            create(el, instances.length, opts);
        }
    });
}

export const destroy = () => {
    instances = [];  
}