import './style.css';
import { Game } from "./ts/Game";
import Stats from 'stats.js';
import { injectAll } from './ts/libs/utils/Injections';


injectAll();
const game = new Game('.canvas');

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

function tick(): void {
    stats.begin();
    game.update();
    stats.end();

    window.requestAnimationFrame(tick);
};

tick();

window.addEventListener('resize', () => {
    game.resize()
});