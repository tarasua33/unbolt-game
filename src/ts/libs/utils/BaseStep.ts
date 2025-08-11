import { HouseModel } from "../../models/HouseModel";

export class BaseStep
{
    protected _houseModel: HouseModel;

    constructor(houseModel: HouseModel)
    {
        this._houseModel = houseModel;
    }
}