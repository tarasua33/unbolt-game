import { HouseModel } from "../../models/HouseModel";
import { Signal } from "../utils/Signal";

export interface BaseStepParams {

}

export abstract class BaseStep<T extends BaseStepParams = BaseStepParams>
{
    public completeStep = new Signal();
    
    protected _params!: T;
    protected _houseModel: HouseModel;

    constructor(houseModel: HouseModel)
    {
        this._houseModel = houseModel;
    }
}