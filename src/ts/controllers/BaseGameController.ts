import { IGameUI } from "../factories/GameUiObjectsFactory";
import { BaseStep, BaseStepParams } from "../libs/controllers/BaseStep";
import { Sequence } from "../libs/controllers/Sequence";
import { StepsManager } from "../libs/controllers/StepsManager";
import { ElementIDs } from "../models/HouseModel";
import { IModels } from "../models/Models";
import { Bolt } from "../objects/Bolt";
import { HouseElementUnboltedStep } from "./steps/HouseElementUnboltedStep";
import { IListeningPointedBoltStepParams, ListeningPointedBoltStep } from "./steps/ListeningPointedBoltStep";
import { ResetMainGameStep, ResetMainGameStepParams } from "./steps/transitions/ResetMainGameStep";
import { ScreenFadeInStep, ScreenFadeInStepParams } from "./steps/transitions/ScreenFadeInStep";
import { ScreenFadeOutStep, ScreenFadeOutStepParams } from "./steps/transitions/ScreenFadeOutStep";
import { UnboltStep } from "./steps/UnboltStep";

interface IControllerParams extends BaseStepParams {
    gameUI: IGameUI;
}

export class BaseGameController extends BaseStep<IControllerParams> {
    private _mng = new StepsManager();
    private _listeningPointedBoltStep: ListeningPointedBoltStep;

    constructor(models: IModels) {
        super(models);

        this._listeningPointedBoltStep = new ListeningPointedBoltStep(models);
    }

    public start(params: IControllerParams): void {
        this._mng.completeSteps.addOnce(this._onComplete, this);
        const models = this._models;
        const { gameUI } = this._params = params;

        const listeningPointedBoltStep = this._listeningPointedBoltStep;
        const listeningPointedParams: IListeningPointedBoltStepParams = { bolts: gameUI.bolts }
        listeningPointedBoltStep.unboltedElementSignal.add(this._onUnboltedHouseElement, this);
        listeningPointedBoltStep.unboltSignal.add(this._onUnbolt, this);

        const showGameSequence = new Sequence();
        const playGameSequence = new Sequence();

        const showScreenStep = new ScreenFadeInStep(models);
        const showScreenParams: ScreenFadeInStepParams = {
            screen: gameUI.transitionScreen
        };

        const resetMainGameStep = new ResetMainGameStep(models);
        const resetGameParams: ResetMainGameStepParams = {
            mainGameView: gameUI.mainGroup
        };

        const hideScreenStep = new ScreenFadeOutStep(models);
        const hideScreenStepPrams: ScreenFadeOutStepParams = {
            screen: gameUI.transitionScreen
        }

        showGameSequence.addConsequents(showScreenStep, showScreenParams);
        showGameSequence.addConsequents(resetMainGameStep, resetGameParams);
        showGameSequence.addConsequents(hideScreenStep, hideScreenStepPrams);

        playGameSequence.addPermanent(listeningPointedBoltStep, listeningPointedParams);

        this._mng.start([
            showGameSequence,
            playGameSequence
        ])
    }

    protected _onComplete(): void {
        console.warn("COMPLETE BASE GAME CONTROLLER");

        super._onComplete();
    }

    private _onUnbolt(bolt: Bolt): void {
        this._mng.addDynamicStep(new UnboltStep(this._models), {
            bolt
        });
    }

    private _onUnboltedHouseElement(id: ElementIDs): void {
        this._mng.addDynamicStep(new HouseElementUnboltedStep(this._models), {
            id,
            elements: this._params.gameUI.houseElements
        });
    }
}