import { IGameUI } from "../factories/GameUiObjectsFactory";
import { Controller, IControllerParams } from "../libs/controllers/Controller";
import { Sequence } from "../libs/controllers/Sequence";
import { ElementIDs } from "../models/HouseModel";
import { IModels } from "../models/Models";
import { Bolt } from "../objects/gameObjects/Bolt";
import { LoadingScreen } from "../objects/screens/LoadingScreen";
import { HouseElementUnboltedStep } from "./steps/HouseElementUnboltedStep";
import { IListeningPointedBoltStepParams, ListeningPointedBoltStep } from "./steps/ListeningPointedBoltStep";
import { ResetMainGameStep, ResetMainGameStepParams } from "./steps/transitions/ResetMainGameStep";
import { ScreenFadeInStep, ScreenFadeInStepParams } from "./steps/transitions/ScreenFadeInStep";
import { ScreenFadeOutStep, ScreenFadeOutStepParams } from "./steps/transitions/ScreenFadeOutStep";
import { UnboltStep } from "./steps/UnboltStep";

interface IControllerBaseParams extends IControllerParams {
    gameUI: IGameUI;
    loadingScreen: LoadingScreen;
}

export class BaseGameController extends Controller<IControllerBaseParams> {
    private _listeningPointedBoltStep: ListeningPointedBoltStep;

    constructor(models: IModels) {
        super(models);

        this._listeningPointedBoltStep = new ListeningPointedBoltStep(models);
    }

    public start(params: IControllerBaseParams): void {
        const models = this._models;
        const { gameUI, loadingScreen } = this._params = params;

        // SHOW GAME
        // Consequents
        const showGameSequence = new Sequence();
        const showScreenStep = new ScreenFadeInStep(models);
        const showScreenParams: ScreenFadeInStepParams = {
            screen: gameUI.transitionScreen
        };
        showGameSequence.addConsequents(showScreenStep, showScreenParams);

        const resetMainGameStep = new ResetMainGameStep(models);
        const resetGameParams: ResetMainGameStepParams = {
            mainGameView: gameUI.mainGroup,
            loadingScreen
        };
        showGameSequence.addConsequents(resetMainGameStep, resetGameParams);

        const hideScreenStep = new ScreenFadeOutStep(models);
        const hideScreenStepPrams: ScreenFadeOutStepParams = {
            screen: gameUI.transitionScreen
        }
        showGameSequence.addConsequents(hideScreenStep, hideScreenStepPrams);

        // PLAY GAME
        // Permanent
        const playGameSequence = new Sequence();

        const listeningPointedBoltStep = this._listeningPointedBoltStep;
        const listeningPointedParams: IListeningPointedBoltStepParams = { bolts: gameUI.bolts }
        listeningPointedBoltStep.unboltedElementSignal.add(this._onUnboltedHouseElement, this);
        listeningPointedBoltStep.unboltSignal.add(this._onUnbolt, this);

        playGameSequence.addPermanent(listeningPointedBoltStep, listeningPointedParams);

        // START
        this._mng.start([
            showGameSequence,
            playGameSequence
        ])
    }

    protected _onComplete(): void {
        console.warn("COMPLETE BASE GAME CONTROLLER");
        const listeningPointedBoltStep = this._listeningPointedBoltStep;
        listeningPointedBoltStep.unboltedElementSignal.remove(this._onUnboltedHouseElement);
        listeningPointedBoltStep.unboltSignal.remove(this._onUnbolt);

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