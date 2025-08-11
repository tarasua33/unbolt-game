import { Camera, Object3D, Raycaster, Vector2, WebGLRenderer } from 'three';
import { StandardMesh } from '../gameObjects/StandardMesh';

interface IMouseEvent {
    clientX: number;
    clientY: number;
}

export class RaycasterDispatcher {
    private _renderer: WebGLRenderer;
    private _raycaster = new Raycaster();
    private _pointer = new Vector2();
    private _camera: Camera;
    private _objects!: Object3D[];

    constructor(renderer: WebGLRenderer, camera: Camera) {
        this._renderer = renderer;
        this._camera = camera;
        this._raycaster = new Raycaster();
        this._pointer = new Vector2();
    }

    public startDispatch(objects: Object3D[]): void {
        const renderer = this._renderer;
        this._objects = objects;
        renderer.domElement.addEventListener('pointerdown', this._onPointDown.bind(this));
    }

    private _onPointDown(event: IMouseEvent): void {
        const renderer = this._renderer;
        const pointer = this._pointer;
        const raycaster = this._raycaster;

        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, this._camera);

        const intersects = raycaster.intersectObjects(this._objects, true);

        if (intersects.length > 0) {
            const mesh = intersects[0]!.object;

            if (mesh instanceof StandardMesh) {
                mesh.onPointed();
            }
        }
    }
}