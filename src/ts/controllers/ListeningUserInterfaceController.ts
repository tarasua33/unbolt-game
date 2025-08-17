import { IGameUI } from "../factories/GameUiObjectsFactory";
import { Controller, IControllerParams } from "../libs/controllers/Controller";
import { Sequence } from "../libs/controllers/Sequence";
import { KeyFrameStandardMesh } from "../libs/gameObjects/KeyFrameStandardMesh";
import { Signal } from "../libs/utils/Signal";
import { AwaitCompleteStep, AwaitCompleteStepParams } from "./steps/general/AwaitCompleteStep";
import { ReplayPickStep, ReplayPickStepParams } from "./steps/transitions/ReplayPickStep";
import { ScreenFadeInStep, ScreenFadeInStepParams } from "./steps/transitions/ScreenFadeInStep";

export interface IListeningUserInterfaceControllerParams extends IControllerParams {
    button: KeyFrameStandardMesh;
    gameUI: IGameUI;
}

export class ListeningUserInterfaceController extends Controller<IListeningUserInterfaceControllerParams> {
    public readonly stopGameSignal = new Signal();

    private _awaitCompleteLoad!: AwaitCompleteStep;
    
    public start(params: IListeningUserInterfaceControllerParams): void {
        const { button, gameUI } = this._params = params;
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
        const hideGameSequence = new Sequence();
        // // Consequents
        const replayPickStep = new ReplayPickStep(models);
        const replayPickParams: ReplayPickStepParams = {
            button: gameUI.replayButton
        };
        hideGameSequence.addConsequents(replayPickStep, replayPickParams);

        const showScreenStep = new ScreenFadeInStep(models);
        const showScreenParams: ScreenFadeInStepParams = {
            screen: gameUI.transitionScreen
        };
        hideGameSequence.addConsequents(showScreenStep, showScreenParams);

        // START
        this._mng.start([
            startListeningSequence,
            hideGameSequence
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