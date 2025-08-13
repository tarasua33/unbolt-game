import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { TransitionScreen } from "../../../objects/screens/TransitionScreen";

export interface ScreenFadeOutStepParams extends BaseStepParams {
    screen: TransitionScreen;
}

export class ScreenFadeOutStep<T extends ScreenFadeOutStepParams = ScreenFadeOutStepParams> extends BaseStep<T> {
    public start(params: T): void {
        const { screen } = params;
        this._params = params;
        screen.completeAnimationSignal.addOnce(this._onComplete, this);
        screen.hide();
    }

    public _onComplete(): void {
        this._params.screen.completeAnimationSignal.remove(this._onComplete);
        super._onComplete();
    }

    public forceComplete(): void {
        this._onComplete();
    }
}