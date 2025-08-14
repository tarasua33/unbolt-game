import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import gsap from "gsap";

export interface AwaitTimeStepParams extends BaseStepParams {
    delay: number;
}

export class AwaitTimeStep<T extends AwaitTimeStepParams = AwaitTimeStepParams> extends BaseStep<AwaitTimeStepParams> {
    public start({ delay }: T): void {
        gsap.delayedCall(delay, this._onComplete.bind(this))
    }
}