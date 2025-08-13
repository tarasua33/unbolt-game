import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { TransitionScreen } from "../../../objects/screens/TransitionScreen";

export interface ScreenFadeInStepParams extends BaseStepParams {
    screen: TransitionScreen;
}

export class ScreenFadeInStep<T extends ScreenFadeInStepParams = ScreenFadeInStepParams> extends BaseStep<ScreenFadeInStepParams> {
    public start(params: T): void {
        const { screen } = params;
        this._params = params;
        screen.completeAnimationSignal.addOnce(this._onComplete, this);
        screen.show();
    }

    public _onComplete(): void {
        this._params.screen.completeAnimationSignal.remove(this._onComplete);
        super._onComplete();
    }

    public forceComplete(): void {
        this._onComplete();
    }
}