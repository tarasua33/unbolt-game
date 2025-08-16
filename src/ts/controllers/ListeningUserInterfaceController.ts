import { IGameUI } from "../factories/GameUiObjectsFactory";
import { Controller, IControllerParams } from "../libs/controllers/Controller";
import { Sequence } from "../libs/controllers/Sequence";
import { KeyFrameStandardMesh } from "../libs/gameObjects/KeyFrameStandardMesh";
import { Signal } from "../libs/utils/Signal";
import { LoadingScreen } from "../objects/screens/LoadingScreen";
import { AwaitCompleteStep, AwaitCompleteStepParams } from "./steps/general/AwaitCompleteStep";
import { ResetMainGameStep, ResetMainGameStepParams } from "./steps/transitions/ResetMainGameStep";
import { ScreenFadeInStep, ScreenFadeInStepParams } from "./steps/transitions/ScreenFadeInStep";

export interface IListeningUserInterfaceControllerParams extends IControllerParams {
    button: KeyFrameStandardMesh;
    gameUI: IGameUI;
    loadingScreen: LoadingScreen;
}

export class ListeningUserInterfaceController extends Controller<IListeningUserInterfaceControllerParams> {
    public readonly stopGameSignal = new Signal();

    private _awaitCompleteLoad!: AwaitCompleteStep;
    
    public start(params: IListeningUserInterfaceControllerParams): void {
        const { button, gameUI, loadingScreen } = this._params = params;
        const models = this._models

        // FIRST
        const startListeningSequence = new Sequence();
        // Permanent
        const awaitCompleteLoad = this._awaitCompleteLoad = new AwaitCompleteStep(models);
        awaitCompleteLoad.completeStepSignal.addOnce(this._onStopGame, this);
        const awaitCompleteLoadParams: AwaitCompleteStepParams = {
            signal: button.raycasterSignal
        }
        startListeningSequence.addPermanent(awaitCompleteLoad, awaitCompleteLoadParams);

        // // SECOND
        const resetGameSequence = new Sequence();
        // // Consequents
        const showScreenStep = new ScreenFadeInStep(models);
        const showScreenParams: ScreenFadeInStepParams = {
            screen: gameUI.transitionScreen
        };
        resetGameSequence.addConsequents(showScreenStep, showScreenParams);

        const resetMainGameStep = new ResetMainGameStep(models);
        const resetGameParams: ResetMainGameStepParams = {
            mainGameView: gameUI.mainGroup,
            userPanel: gameUI.userPanel,
            loadingScreen,
            chests: gameUI.userPanelChests
        };
        resetGameSequence.addConsequents(resetMainGameStep, resetGameParams);

        // START
        this._mng.start([
            startListeningSequence,
            resetGameSequence
        ])
    }

    private _onStopGame(): void
    {
        this.stopGameSignal.dispatch();
    }

    public forceComplete(): void
    {
        if (this._awaitCompleteLoad)
        {
            this._awaitCompleteLoad.completeStepSignal.remove(this._onStopGame);
        }

        this.completeStepSignal.removeAll();

        this._mng.forceComplete();

        this._onComplete();
    }
}