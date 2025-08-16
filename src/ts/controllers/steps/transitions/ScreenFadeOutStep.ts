import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { Signal } from "../../../libs/utils/Signal";

export interface IFadeOut {
    completeAnimationSignal: Signal;
    hide(): void;
}

export interface ScreenFadeOutStepParams extends BaseStepParams {
    screen: IFadeOut;
}

export class ScreenFadeOutStep<T extends ScreenFadeOutStepParams = ScreenFadeOutStepParams> extends BaseStep<T> {
    public start(params: T): void {
        const { screen } = params;
        this._params = params;
        screen.completeAnimationSignal.addOnce(this._onComplete, this);
        screen.hide();
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