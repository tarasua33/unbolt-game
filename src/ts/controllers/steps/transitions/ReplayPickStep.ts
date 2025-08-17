import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { KeyFrameStandardMesh } from "../../../libs/gameObjects/KeyFrameStandardMesh";

export interface ReplayPickStepParams extends BaseStepParams {
    button: KeyFrameStandardMesh;
}

export class ReplayPickStep<T extends ReplayPickStepParams = ReplayPickStepParams> extends BaseStep<ReplayPickStepParams> {
    public start({ button }: T): void {
        button.completeAnimation.addOnce(this._onComplete, this);
        button.animator.playAnimation("pick");
    }

    public forceComplete(): void {
        this._onComplete();
    }
}