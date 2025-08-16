import { IModels } from "../../models/Models";
import { BaseStep, BaseStepParams } from "./BaseStep";
import { StepsManager } from "./StepsManager";

export interface IControllerParams extends BaseStepParams {
}

export abstract class Controller<T extends IControllerParams = IControllerParams> extends BaseStep<T> {
    protected _mng = new StepsManager();

    constructor(models: IModels) {
        super(models);

        this._mng.completeSteps.add(this._onComplete, this);
    }
}