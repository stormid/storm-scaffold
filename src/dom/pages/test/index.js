import { h } from '../../../../tools/dom/h';
import DefaultLayout from '../../layouts/default';
import Test from '../../components/test';
import Card from '../../components/card';

const TestPage = () => <DefaultLayout title={'Test'}>
    <div class="card__list">
        <Card><Test wtf={'JSX component'} /></Card>
        <Card>{ Test({ wtf: 'Invoke component as function' }) }</Card>
        <Card>{ require('../../components/test').default({ wtf: 'Require and invoke component as commonjs module' }) }</Card>
        <Card>{ (({ wtf }) => { return <Test wtf={wtf} />; })({ wtf: 'Component in an iife' }) }</Card>
        <Card>Text node</Card>
    </div>
</DefaultLayout>;

export default TestPage;