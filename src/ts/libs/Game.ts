import * as THREE from 'three';
import { StandardScene } from './gameObjects/StandardScene';
import { GameUiObjectsFactory } from '../factories/GameUiObjectsFactory';
import { IGameObject } from './gameObjects/IGameObject';
import { DragDispatcher } from './utils/DragDispatcher';

interface IDispatchers
{
        drag: DragDispatcher;

}

export class Game {
    private _mainCamera: THREE.PerspectiveCamera;
    private _canvas: HTMLCanvasElement;
    private _clock = new THREE.Clock;
    private _scene: StandardScene;
    private _renderer: THREE.WebGLRenderer;
    private _sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    }

    private _mainCameraConfig = {
        x: 0,
        y: 10,
        z: 10,
        rotation: - Math.PI / 4,
        mainCameraViewAngle: 75
    }
    private _lightConfig = {
        color: 0xffffff,
        intensity: 1.5,
        x: 10,
        y: 10,
        z: 0
    }

    private _gameUI!: Record<string, IGameObject>;

    private _dispatchers!: IDispatchers

    /**
     * @param {string} canvasName - ClassName or Id canvas dom
    */
    constructor(canvasName: string) {
        const canvas = this._canvas = document.querySelector(canvasName) as HTMLCanvasElement;
        const scene = this._scene = new StandardScene();

        const sizes = this._sizes;
        const cameraConfig = this._mainCameraConfig;
        const camera = this._mainCamera = new THREE.PerspectiveCamera(cameraConfig.mainCameraViewAngle, sizes.width / sizes.height);
        camera.position.set(cameraConfig.x, cameraConfig.y, cameraConfig.z)
        camera.rotation.x = cameraConfig.rotation;

        scene.add(camera);

        const lightConfig = this._lightConfig;
        const light = new THREE.AmbientLight(lightConfig.color, lightConfig.intensity);
        const directionalLight = new THREE.DirectionalLight(lightConfig.color, lightConfig.intensity);
        directionalLight.position.set(lightConfig.x, lightConfig.y, lightConfig.z);

        scene.add(light);
        scene.add(directionalLight);

        const renderer = this._renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(sizes.width, sizes.height);
        renderer.render(scene, camera);

        this._clock = new THREE.Clock();

        // CREATE DISPATCHERS
        const dispatchers = this._dispatchers = this._createDispatchers(renderer);

        // CREATE UI ELEMENTS
        this._buildGameObjects(scene, dispatchers);

        // START DISPATCH EVENTS
        dispatchers.drag.startDispatch();
    }

    private _buildGameObjects(scene: StandardScene, dispatchers: IDispatchers): void {
        const uiFactory = new GameUiObjectsFactory();

        this._gameUI = uiFactory.buildGameUIObjects(scene, dispatchers.drag);
    }

    private _createDispatchers(renderer: THREE.WebGLRenderer): IDispatchers
    {
        const result: IDispatchers = {
            drag: new DragDispatcher(renderer)
        }

        return result
    }

    public update(): void {
        this._scene.updateObject(this._clock.getDelta());

        this._renderer.render(this._scene, this._mainCamera);
    }

    public resize(): void {
        const sizes = this._sizes;
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        const camera = this._mainCamera;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        const renderer = this._renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.render(this._scene, camera);
    }
}