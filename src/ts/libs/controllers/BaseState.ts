import { World } from "cannon-es";
import { IDispatchers } from "../../Game";
import { IModels } from "../../models/Models";
import { MainCamera } from "../gameObjects/MainCamera";
import { StandardScene } from "../gameObjects/StandardScene";
import { AssetsLoader } from "../utils/AssetsLoader";

export abstract class BaseState {
    protected _assetsLoader: AssetsLoader;
    protected _models: IModels;
    protected _states = new Map<string, BaseState>;
    protected _dispatchers: IDispatchers;
    protected _mainScene: StandardScene;
    protected _mainCamera: MainCamera;
    protected _physicWorld: World;


    constructor(scene: StandardScene,
                mainCamera: MainCamera,
                models: IModels,
                assetsLoader: AssetsLoader,
                dispatchers: IDispatchers,
                physicWorld: World) {
        this._models = models;
        this._assetsLoader = assetsLoader;
        this._dispatchers = dispatchers;
        this._mainScene = scene;
        this._mainCamera = mainCamera;
        this._physicWorld = physicWorld;
    }

    public abstract start(...args: any[]): void

    public addState(key: string, state: BaseState): void
    {
        this._states.set(key, state);
    }

    public abstract changeState(key: string): void
}