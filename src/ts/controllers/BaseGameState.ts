import { GameUiObjectsFactory, IGameUI } from "../factories/GameUiObjectsFactory";
import { IDispatchers } from "../Game";
import { BaseState } from "../libs/controllers/BaseState";
import { StandardScene } from "../libs/gameObjects/StandardScene";
import { LoadingScreen } from "../objects/screens/LoadingScreen";
import { BaseGameController } from "./BaseGameController";
import { ListeningUserInterfaceController } from "./ListeningUserInterfaceController";

export class BaseGameState extends BaseState {
    private _baseGameController!: BaseGameController;
    private _userInterfaceController!: ListeningUserInterfaceController
    private _gameUI!: IGameUI;
    private _loadingScreen!: LoadingScreen;

    public start(loadingScreen: LoadingScreen): void {
        this._loadingScreen = loadingScreen;
        const dispatchers = this._dispatchers;
        const models = this._models;
        const baseGameController = this._baseGameController = new BaseGameController(models);
        const userInterfaceController = this._userInterfaceController = new ListeningUserInterfaceController(models)

        // CREATE UI ELEMENTS
        const gameUI = this._gameUI = this._buildGameObjects(this._mainScene, dispatchers);

        // START DISPATCH EVENTS
        dispatchers.drag.startDispatch();
        dispatchers.raycaster.startDispatch((gameUI.bolts.slice() as any).concat(Array.from(gameUI.houseElements.values()).slice()));

        baseGameController.completeStepSignal.add(this._onGameSuccess, this);
        userInterfaceController.stopGameSignal.addOnce(this._onStopGame, this);

        baseGameController.start({ gameUI, loadingScreen });
        userInterfaceController.start({ gameUI, loadingScreen, button: gameUI.replayButton });
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

    private _onStopGame(): void {
        this._baseGameController.forceComplete();
        this._userInterfaceController.completeStepSignal.addOnce(this._restartGame, this)
    }

    private _restartGame(): void {
        const baseGameController = this._baseGameController;
        const userInterfaceController = this._userInterfaceController;

        baseGameController.completeStepSignal.remove(this._onGameSuccess);
        userInterfaceController.stopGameSignal.remove(this._onStopGame);
        userInterfaceController.completeStepSignal.remove(this._restartGame);

        // userInterfaceController.forceComplete();
        baseGameController.forceComplete();

        this._models.houseModel.reset();
        this._models.boltsModel.reset();

        const gameUI = this._gameUI;
        const loadingScreen = this._loadingScreen;

        baseGameController.completeStepSignal.add(this._onGameSuccess);
        userInterfaceController.stopGameSignal.addOnce(this._onStopGame);
        baseGameController.start({ gameUI, loadingScreen, isReplay: true });
        userInterfaceController.start({ gameUI, loadingScreen, button: gameUI.replayButton });
    }

    private _onGameSuccess(): void {
        const baseGameController = this._baseGameController;
        const userInterfaceController = this._userInterfaceController;

        baseGameController.completeStepSignal.remove(this._onGameSuccess);
        userInterfaceController.stopGameSignal.remove(this._onStopGame);
        userInterfaceController.completeStepSignal.remove(this._restartGame);

        userInterfaceController.forceComplete();
        // baseGameController.forceComplete();

        this._models.houseModel.reset();
        this._models.boltsModel.reset();

        const gameUI = this._gameUI;
        const loadingScreen = this._loadingScreen;

        baseGameController.completeStepSignal.add(this._onGameSuccess, this);
        userInterfaceController.stopGameSignal.addOnce(this._onStopGame, this);
        baseGameController.start({ gameUI, loadingScreen });
        userInterfaceController.start({ gameUI, loadingScreen, button: gameUI.replayButton });
    }
}