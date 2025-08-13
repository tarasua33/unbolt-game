import { IGameUI } from "../factories/GameUiObjectsFactory";
import { BaseStep, BaseStepParams } from "../libs/controllers/BaseStep";
import { HouseModel } from "../models/HouseModel";
import { ListeningPointedBoltStep } from "./steps/ListeningPointedBoltStep";

interface IControllerParams extends BaseStepParams{
    gameUI: IGameUI;
}

export class BaseGameController  extends BaseStep<IControllerParams> {
    private _listeningPointedBoltStep: ListeningPointedBoltStep;

    constructor(houseModel: HouseModel)
    {
        super(houseModel);

        this._listeningPointedBoltStep = new ListeningPointedBoltStep(houseModel);
    }

    public start(params: IControllerParams): void {
        const {gameUI} = this._params = params;

        this._listeningPointedBoltStep.start({
            bolts: gameUI.bolts,
            houseElements: gameUI.houseElements
        })
    }
}