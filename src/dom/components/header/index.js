import { h } from '../../../../tools/dom/h';
import Logo from '../logo';

const Header = ({ children }) => <header class="header">
    <div class="skip__container">
        <a class="skip__btn" tabindex="0" href="#main">Skip to main content</a>
    </div>
    { children }
</header>;

export default Header;