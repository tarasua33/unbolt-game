import { GameUiObjectsFactory, IGameUI } from "../factories/GameUiObjectsFactory";
import { IDispatchers } from "../Game";
import { BaseState } from "../libs/controllers/BaseState";
import { StandardScene } from "../libs/gameObjects/StandardScene";
import { LoadingScreen } from "../objects/screens/LoadingScreen";
import { BaseGameController } from "./BaseGameController";

export class BaseGameState extends BaseState {
    private _baseGameController!: BaseGameController;
    private _gameUI!: IGameUI;
    private _loadingScreen!: LoadingScreen;

    public start(loadingScreen: LoadingScreen): void {
        this._loadingScreen = loadingScreen;
        const dispatchers = this._dispatchers;
        this._baseGameController = new BaseGameController(this._models);

        // CREATE UI ELEMENTS
        const gameUI = this._gameUI = this._buildGameObjects(this._mainScene, dispatchers);

        // START DISPATCH EVENTS
        dispatchers.drag.startDispatch();
        dispatchers.raycaster.startDispatch((gameUI.bolts.slice() as any).concat(Array.from(gameUI.houseElements.values()).slice()));

        const baseGameController = this._baseGameController;
        baseGameController.start({ gameUI, loadingScreen: loadingScreen });
    }

    private _buildGameObjects(scene: StandardScene, dispatchers: IDispatchers): IGameUI {
        const uiFactory = new GameUiObjectsFactory(this._assetsLoader, this._models);
        const gameUI = uiFactory.buildGameUIObjects({
            scene,
            camera: this._mainCamera,
            drag: dispatchers.drag,
            physicWorld: this._physicWorld
        });

        return gameUI
    }

    public changeState(key: string): void {
        const state = this._states.get(key)!;
        state.start();
    }
}