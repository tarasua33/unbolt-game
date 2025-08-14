import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { Signal } from "../../../libs/utils/Signal";

export interface AwaitCompleteStepParams extends BaseStepParams {
    signal: Signal;
}

export class AwaitCompleteStep<T extends AwaitCompleteStepParams = AwaitCompleteStepParams> extends BaseStep<AwaitCompleteStepParams> {
    public start({ signal }: T): void {
        signal.addOnce(this._onComplete, this);
    }
}