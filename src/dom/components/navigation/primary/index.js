import { h } from '../../../../../tools/dom/h';
import MenuButton from '../../menu-button';

const PrimaryNavItem = ({ href, active, label, sub }) => <li class="nav-primary__item">
    <a class={`nav-primary__link${active ? ' is--active' : ''}`} href={href}>{label }</a>
    { sub && <PrimaryNavSubNav items={sub} /> }
</li>

const PrimaryNavSubNav = ({ items }) => <ul class="nav-primary__sub-list">
    { items.map(item => <PrimaryNavSubItem href={item.href} label={item.label} active={active === item.label} />) }
</ul>;

const PrimaryNavSubItem = ({ href, label }) => <li class="nav-primary__sub-item">
    <a class={`nav-primary__sub-link${active ? ' is--active' : ''}`} href={ href }>{ label }</a>
</li>

const PrimaryNav = ({ items, active }) => <div class="nav-primary__container">
    <MenuButton className="nav-primary__btn js-toggle__primary-nav" />
    <nav class="nav-primary js-toggle__nav" id="primary__nav" data-toggle="js-toggle__primary-nav">
        <ul class="nav-primary__list">
            { items.map(item => <PrimaryNavItem label={item.label} href={item.href} active={active === item.label} />) }
        </ul>
    </nav>
</div>;

export default PrimaryNav;