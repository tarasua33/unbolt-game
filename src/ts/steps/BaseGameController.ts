import { IGameUI } from "../factories/GameUiObjectsFactory";
import { BaseStep } from "../libs/utils/BaseStep";
import { HouseModel } from "../models/HouseModel";
import { ListeningPointedBoltStep } from "./ListeningPointedBoltStep";

interface IControllerParams {
    gameUI: IGameUI;
}

export class BaseGameController  extends BaseStep {
    private _params!: IControllerParams;
    private _listeningPointedBoltStep: ListeningPointedBoltStep;

    constructor(houseModel: HouseModel)
    {
        super(houseModel);

        this._listeningPointedBoltStep = new ListeningPointedBoltStep(houseModel);
    }

    public start(params: IControllerParams) {
        const {gameUI} = this._params = params;

        this._listeningPointedBoltStep.start({
            bolts: gameUI.bolts,
            houseElements: gameUI.houseElements
        })
    }
}