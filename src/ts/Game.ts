import { StandardScene } from './libs/gameObjects/StandardScene';
import { DragDispatcher } from './libs/utils/DragDispatcher';
import { AssetsLoader } from './libs/utils/AssetsLoader';
import { AmbientLight, Clock, DirectionalLight, WebGLRenderer } from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { World } from 'cannon-es';
import { RaycasterDispatcher } from './libs/utils/RaycasterDispatcher';
import { HouseModel } from './models/HouseModel';
import { BoltsModel } from './models/BoltsModel';
import { MainCamera } from './libs/gameObjects/MainCamera';
import { LoadingState } from './controllers/LoadingState';
import { BaseGameState } from './controllers/BaseGameState';

export interface IDispatchers {
    drag: DragDispatcher;
    raycaster: RaycasterDispatcher;
}

export class Game {
    private _mainCamera: MainCamera;
    // private _canvas: HTMLCanvasElement;
    private _clock = new Clock;
    private _scene: StandardScene;
    private _renderer: WebGLRenderer;
    private _physicWorld!: World;
    private _gravityY = -9.8;

    private _sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    }

    private _mainCameraConfig = {
        x: 0,
        y: 9,
        z: 12,
        rotation: - Math.PI / 6,
        mainCameraViewAngle: 75
    }
    private _lightConfig = {
        color: 0xffffff,
        intensity: 1.5,
        x: 10,
        y: 10,
        z: 0
    }
    private _bgColor = "#AFEEEE";

    /**
     * @param {string} canvasName - ClassName or Id canvas dom
    */
    constructor(canvasName: string) {
        const canvas = document.querySelector(canvasName) as HTMLCanvasElement;
        const scene = this._scene = new StandardScene();

        const sizes = this._sizes;
        const cameraConfig = this._mainCameraConfig;
        const camera = this._mainCamera = new MainCamera(
            cameraConfig.mainCameraViewAngle,
            sizes.width / sizes.height);
        camera.position.set(cameraConfig.x, cameraConfig.y, cameraConfig.z)
        camera.rotation.x = cameraConfig.rotation;
        scene.add(camera);

        const lightConfig = this._lightConfig;
        const light = new AmbientLight(lightConfig.color, lightConfig.intensity);
        const directionalLight = new DirectionalLight(lightConfig.color, lightConfig.intensity);
        directionalLight.position.set(lightConfig.x, lightConfig.y, lightConfig.z);
        scene.add(light);
        scene.add(directionalLight);

        // const controls = new OrbitControls(camera, canvas);
        // controls.enableDamping = true;

        const renderer = this._renderer = new WebGLRenderer({ canvas });
        renderer.setSize(sizes.width, sizes.height);
        renderer.render(scene, camera);

        // FPS CLOCK
        this._clock = new Clock();

        this._createGameWorld(renderer);
    }

    private _createGameWorld(renderer: WebGLRenderer): void {
        // CREATE MODELS
        const houseModel = new HouseModel();
        houseModel.reset();
        const boltsModel = new BoltsModel();
        boltsModel.reset();
        const models = {
            houseModel: houseModel,
            boltsModel: boltsModel
        }

        // PHYSIC WORLD
        const world = this._physicWorld = new World();
        world.gravity.set(0, this._gravityY, 0);

        // CREATE DISPATCHERS
        const dispatchers = this._createDispatchers(renderer);

        // LOAD ASSETS
        const assetsLoader = new AssetsLoader();

        // BASE GAME STATE
        const baseGameState = new BaseGameState(this._scene, this._mainCamera, models, assetsLoader, dispatchers, world);

        // LOADING STATE
        const loadingState = new LoadingState(this._scene, this._mainCamera, models, assetsLoader, dispatchers, world);
        loadingState.addState("baseGameState", baseGameState);
        loadingState.start();
    }

    private _createDispatchers(renderer: WebGLRenderer): IDispatchers {
        const result: IDispatchers = {
            drag: new DragDispatcher(renderer),
            raycaster: new RaycasterDispatcher(renderer, this._mainCamera)
        }

        return result
    }

    public update(): void {
        const dt = this._clock.getDelta();
        this._physicWorld.step(1 / 60, dt, 3);

        this._mainCamera.updateObject(dt)
        this._scene.updateObject(dt);

        const renderer = this._renderer;
        renderer.setClearColor(this._bgColor);
        renderer.render(this._scene, this._mainCamera);
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