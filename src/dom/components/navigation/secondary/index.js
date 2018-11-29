import { h } from '../../../../../tools/dom/h';

const SecondaryNav = ({ items, active }) => <nav class="nav-secondary">
    <ul class="nav-primary__list">
        { 
            items.map(item => {
                return <li class="nav-primary__item">
                    <a class={`nav-primary__link${item.active ? ' is--active' : ''}`} href={item.href}>{ item.label }</a>
                </li>
            })
        }
    </ul>
</nav>;

export default SecondaryNav;