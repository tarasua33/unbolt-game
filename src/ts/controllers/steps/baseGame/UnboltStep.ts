import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { Bolt } from "../../../objects/gameObjects/Bolt";

interface UnboltStepParams extends BaseStepParams {
    bolt: Bolt;
}

export class UnboltStep<T extends UnboltStepParams = UnboltStepParams> extends BaseStep<UnboltStepParams> {
    public start({ bolt }: T): void {
        bolt.completeUnboltedSignal.addOnce(this._onComplete, this);
        bolt.unbolt();
    }

    public forceComplete(): void {
        this._onComplete();
    }
}