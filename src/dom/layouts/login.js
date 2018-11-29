import { h } from '../../../tools/dom/h';
import Head from '../components/head';

const Login = ({ children, title }) => <html lang="en" class="no-webfonts no-js">
    <Head title={title} />
    <body>
        <main id="main" class="login">{ children }</main>
    </body>
</html>;

export default Login;