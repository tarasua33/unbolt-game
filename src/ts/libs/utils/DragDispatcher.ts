import { WebGLRenderer } from 'three';
import { Signal } from './Signal';

interface IMouseEvent {
    clientX: number;
    clientY: number;
}

export class DragDispatcher {
    public dragXSignal = new Signal();
    public dragYSignal = new Signal();

    private _isDragging = false;
    private _previousMouseX = 0;
    private _previousMouseY = 0;

    private _renderer: WebGLRenderer;

    constructor(renderer: WebGLRenderer) {
        this._renderer = renderer;
    }

    public startDispatch(): void {
        const renderer = this._renderer;
        renderer.domElement.style.touchAction = 'none';
        
        renderer.domElement.addEventListener('pointerdown', this._onStartDrag.bind(this));

        window.addEventListener('pointerup', this._onStoptDrag.bind(this));

        renderer.domElement.addEventListener('pointermove', this._onMouseMove.bind(this));
    }

    private _onMouseMove(event: IMouseEvent): void {
        if (!this._isDragging) return;

        const deltaX = event.clientX - this._previousMouseX;
        this._previousMouseX = event.clientX;

        const deltaY = event.clientY - this._previousMouseY;
        this._previousMouseY = event.clientY;

        this.dragXSignal.dispatch(deltaX);
        this.dragYSignal.dispatch(deltaY);
    }

    private _onStartDrag(event: IMouseEvent): void {
        this._isDragging = true;
        this._previousMouseX = event.clientX;
        this._previousMouseY = event.clientY;
    }

    private _onStoptDrag(): void {
        this._isDragging = false;
    }
}
