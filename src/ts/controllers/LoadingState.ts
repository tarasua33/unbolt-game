import { LoadingScreenFactory } from "../factories/LoadingScreenFactory";
import { BaseState } from "../libs/controllers/BaseState";
import { LoadingScreen } from "../objects/screens/LoadingScreen";
import { LoadingScreenController } from "./LoadingScreenController";


export class LoadingState extends BaseState {
    private _loadingScreen!: LoadingScreen;

    public start(): void {
        const assetsLoader = this._assetsLoader;

        const loadingScreen = this._loadingScreen = new LoadingScreenFactory().buildUi({ parent: this._mainCamera });

        const loadingScreenController = new LoadingScreenController(this._models);
        loadingScreenController.completeStepSignal.addOnce(this._onAssetsLoaded, this)
        loadingScreenController.start({ view: loadingScreen, assetsLoader });

        assetsLoader.loadAssets();

    }

    private _onAssetsLoaded(): void {
        this.changeState("baseGameState");
    }

    public changeState(key: string): void {
        const baseGameState =  this._states.get(key)!;
        baseGameState.start(this._loadingScreen)
    }
}