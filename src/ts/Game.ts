import { StandardScene } from './libs/gameObjects/StandardScene';
import { GameUiObjectsFactory, IGameUI } from './factories/GameUiObjectsFactory';
import { DragDispatcher } from './libs/utils/DragDispatcher';
import { AssetsLoader } from './libs/utils/AssetsLoader';
import { AmbientLight, Clock, DirectionalLight, WebGLRenderer } from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { World } from 'cannon-es';
import { RaycasterDispatcher } from './libs/utils/RaycasterDispatcher';
import { BaseGameController } from './controllers/BaseGameController';
import { HouseModel } from './models/HouseModel';
import { BoltsModel } from './models/BoltsModel';
import { IModels } from './models/Models';
import { MainCamera } from './libs/gameObjects/MainCamera';
import { LoadingScreen } from './objects/screens/LoadingScreen';
import { LoadingScreenFactory } from './factories/LoadingScreenFactory';
import { LoadingScreenController } from './controllers/LoadingScreenController';

interface IDispatchers {
    drag: DragDispatcher;
    raycaster: RaycasterDispatcher;
}

export class Game {
    private _mainCamera: MainCamera;
    private _canvas: HTMLCanvasElement;
    private _clock = new Clock;
    private _scene: StandardScene;
    private _renderer: WebGLRenderer;
    private _assetsLoader!: AssetsLoader;
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

    private _gameUI!: IGameUI;
    private _loadingScreen!: LoadingScreen;
    private _dispatchers!: IDispatchers;
    private _baseGameController!: BaseGameController;
    private _models!: IModels;

    /**
     * @param {string} canvasName - ClassName or Id canvas dom
    */
    constructor(canvasName: string) {
        const canvas = this._canvas = document.querySelector(canvasName) as HTMLCanvasElement;
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
        const models = this._models = {
            houseModel: houseModel,
            boltsModel: boltsModel
        }

        // PHYSIC WORLD
        const world = this._physicWorld = new World();
        world.gravity.set(0, this._gravityY, 0);

        // CREATE DISPATCHERS
        this._dispatchers = this._createDispatchers(renderer);

        // CREATE CONTROLLERS
        this._baseGameController = new BaseGameController(this._models);
        const loadingScreenController = new LoadingScreenController(models);

        // LOADING SCREEN
        const loadingScreen = this._loadingScreen = new LoadingScreenFactory().buildUi({ parent: this._mainCamera });

        // LOAD ASSETS
        const assetsLoader = this._assetsLoader = new AssetsLoader();

        loadingScreenController.completeStepSignal.addOnce(this._onAssetsLoaded, this)
        loadingScreenController.start({ view: loadingScreen, assetsLoader });

        // assetsLoader.assetsLoadComplete.add(this._onAssetsLoaded, this);
        assetsLoader.loadAssets();
    }

    private _onAssetsLoaded(): void {
        const dispatchers = this._dispatchers;

        // CREATE UI ELEMENTS
        const gameUI = this._buildGameObjects(this._scene, dispatchers);

        // START DISPATCH EVENTS
        dispatchers.drag.startDispatch();
        dispatchers.raycaster.startDispatch((gameUI.bolts.slice() as any).concat(Array.from(gameUI.houseElements.values()).slice()));

        const baseGameController = this._baseGameController;
        baseGameController.start({ gameUI, loadingScreen: this._loadingScreen });
    }

    private _buildGameObjects(scene: StandardScene, dispatchers: IDispatchers): IGameUI {
        const uiFactory = new GameUiObjectsFactory(this._assetsLoader, this._models);
        const gameUI = this._gameUI = uiFactory.buildGameUIObjects({
            scene,
            camera: this._mainCamera,
            drag: dispatchers.drag,
            physicWorld: this._physicWorld
        });

        return gameUI
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