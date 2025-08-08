import './style.css';
import { Game } from "./ts/libs/Game";

const game = new Game('.canvas');

const tick = () => {
    game.update();

    window.requestAnimationFrame(tick);
};

tick();

window.addEventListener('resize', () => {
    game.resize()
});