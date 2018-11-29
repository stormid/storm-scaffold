import { h } from '../../../../tools/dom/h';

export const Card = ({ href, title, summary, children }) => <a href={href} class="card">
    <div class="card__bd">
    { title && <h1 class="card__title">{title}</h1> }
    { summary && <div class="card__summary">{summary}</div> }
    { children }
    </div>
</a>;

export const Ghost = () => <div class="card">
    <div class="card__bd">
    <div class="card__title" style={{width: '30%', backgroundColor:'#eee', height: '18px'}}></div>
    <div class="card__summary" style={{backgroundColor:'#eee', height: '14px'}}></div>
    </div>
</div>;

export const Empty = () => <div class="card card--empty"></div>;

export default Card; 