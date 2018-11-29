import { h } from '../../../../../tools/dom/h';
import Card, { Ghost, Empty} from '../';
import render from 'preact-render-to-json';

test('Card > Ghost matches snapshot', () => {
    const tree = render(<Ghost />);
    expect(tree).toMatchSnapshot();
});

test('Card > Empty matches snapshot', () => {
    const tree = render(<Empty />);
    expect(tree).toMatchSnapshot();
});

test('Card matches snapshot', () => {
    const tree = render(<Card href={'#'}
                              title={'Quick brown fox'}
                              summary={'Jumps over the lazy dog'}>Woof</Card>);
    expect(tree).toMatchSnapshot();
});

