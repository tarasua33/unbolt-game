import { IModels } from "../../models/Models";
import { Signal } from "../utils/Signal";

export interface BaseStepParams {

}

export abstract class BaseStep<T extends BaseStepParams = BaseStepParams> {
    public completeStepSignal = new Signal();

    protected _params!: T;
    protected _models: IModels

    constructor(models: IModels) {
        this._models = models;
    }

    public abstract start(params: T): void

    protected _onComplete(): void {
        this.completeStepSignal.dispatch(this);
        console.log(this)
    }

    public forceComplete(): void {
        // pass
    }
}