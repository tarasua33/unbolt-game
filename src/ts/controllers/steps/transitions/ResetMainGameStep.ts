import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { MainGameGroup } from "../../../objects/gameObjects/MainGameGroup";
import { LoadingScreen } from "../../../objects/screens/LoadingScreen";

export interface ResetMainGameStepParams extends BaseStepParams {
    mainGameView: MainGameGroup;
    loadingScreen: LoadingScreen;
}

export class ResetMainGameStep<T extends ResetMainGameStepParams = ResetMainGameStepParams> extends BaseStep<ResetMainGameStepParams> {
    public start({ mainGameView, loadingScreen }: T): void {
        loadingScreen.visible = false;
        mainGameView.reset();
        mainGameView.visible = true;

        this._onComplete();
    }
}