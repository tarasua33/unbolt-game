import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { Signal } from "../../../libs/utils/Signal";

export interface IFadeIn {
    completeAnimationSignal: Signal;
    show(): void;
}

export interface ScreenFadeInStepParams extends BaseStepParams {
    screen: IFadeIn;
}

export class ScreenFadeInStep<T extends ScreenFadeInStepParams = ScreenFadeInStepParams> extends BaseStep<ScreenFadeInStepParams> {
    public start(params: T): void {
        const { screen } = params;
        this._params = params;
        screen.completeAnimationSignal.addOnce(this._onComplete, this);
        screen.show();
    }

    public _onComplete(): void {
        if (this._params) {
            this._params.screen.completeAnimationSignal.remove(this._onComplete);
        }
        super._onComplete();
    }

    public forceComplete(): void {
        this._onComplete();
    }
}