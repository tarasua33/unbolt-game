import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { MainGameGroup } from "../../../objects/MainGameGroup";

export interface ResetMainGameStepParams extends BaseStepParams {
    mainGameView: MainGameGroup;
}

export class ResetMainGameStep<T extends ResetMainGameStepParams = ResetMainGameStepParams> extends BaseStep<ResetMainGameStepParams> {
    public start({ mainGameView }: T): void {
        mainGameView.reset();
        mainGameView.visible = true;

        this._onComplete();
    }
}