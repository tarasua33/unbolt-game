import { Controller, IControllerParams } from "../libs/controllers/Controller";
import { Sequence } from "../libs/controllers/Sequence";
import { AssetsLoader } from "../libs/utils/AssetsLoader";
import { LoadingScreen } from "../objects/screens/LoadingScreen";
import { AwaitCompleteStep, AwaitCompleteStepParams } from "./steps/general/AwaitCompleteStep";
import { AwaitTimeStep, AwaitTimeStepParams } from "./steps/general/AwaitTimeStep";
import { ScreenFadeInStep, ScreenFadeInStepParams } from "./steps/transitions/ScreenFadeInStep";
import { SubscribeProgressStep, SubscribeProgressStepParams } from "./steps/transitions/SubscribeProgressStep";

export interface ILoadingScreenControllerParams extends IControllerParams {
    assetsLoader: AssetsLoader;
    view: LoadingScreen;
}

export class LoadingScreenController extends Controller<ILoadingScreenControllerParams> {
    public start(params: ILoadingScreenControllerParams): void {
        const { view, assetsLoader } = this._params = params;
        const models = this._models

        // FIRST
        // Consequents
        const progressStartLoadSequence = new Sequence();

        const showLSStep = new ScreenFadeInStep(models);
        const showLSStepParams: ScreenFadeInStepParams = {
            screen: view
        }
        progressStartLoadSequence.addConsequents(showLSStep, showLSStepParams);

        // Permanent
        const awaitCompleteLoad = new AwaitCompleteStep(models);
        const awaitCompleteLoadParams: AwaitCompleteStepParams = {
            signal: assetsLoader.assetsLoadComplete
        }
        progressStartLoadSequence.addPermanent(awaitCompleteLoad, awaitCompleteLoadParams);

        const subscribeProgressStep = new SubscribeProgressStep(models);
        const progressParams: SubscribeProgressStepParams = {
            assetsLoader,
            view
        }
        progressStartLoadSequence.addPermanent(subscribeProgressStep, progressParams);

        // SECOND
        // Consequents
        const progressEndLoadSequence = new Sequence();
        const awaitStep = new AwaitTimeStep(models);
        const awaitStepParams: AwaitTimeStepParams = {
            delay: 0.5
        }
        progressEndLoadSequence.addConsequents(awaitStep, awaitStepParams);

        // START
        this._mng.start([
            progressStartLoadSequence,
            progressEndLoadSequence
        ])
    }
}