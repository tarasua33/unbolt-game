import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { AssetsLoader } from "../../../libs/utils/AssetsLoader";
import { LoadingScreen } from "../../../objects/screens/LoadingScreen";

export interface SubscribeProgressStepParams extends BaseStepParams {
    assetsLoader: AssetsLoader;
    view: LoadingScreen;
}

export class SubscribeProgressStep<T extends SubscribeProgressStepParams = SubscribeProgressStepParams> extends BaseStep<SubscribeProgressStepParams> {
    public start(params: T): void {
        const { assetsLoader } = this._params = params;
        assetsLoader.assetsLoadComplete.addOnce(this._onComplete, this);
        assetsLoader.progressLoadSignal.add(this._onUpdateProgress, this);
    }

    private _onUpdateProgress(value: number): void {
        this._params.view.updateProgress(value);
    }

    protected _onComplete(): void {
        const params = this._params;
        params.assetsLoader.progressLoadSignal.removeAll();
        params.view.updateProgress(1);
        super._onComplete();
    }
}