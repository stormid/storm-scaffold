import { h } from '../../../tools/dom/h';
import DefaultLayout from '../layouts/default';
import Card from '../components/card';
const DashboardPage = () => <DefaultLayout title={'Dashboard'}>
        <div class="card__list">
            <Card />
        </div>
    </DefaultLayout>;

export default DashboardPage;