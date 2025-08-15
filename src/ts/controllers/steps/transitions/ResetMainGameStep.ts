import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { StandardGroup } from "../../../libs/gameObjects/StandardGroup";
import { MainGameGroup } from "../../../objects/gameObjects/MainGameGroup";
import { LoadingScreen } from "../../../objects/screens/LoadingScreen";

export interface ResetMainGameStepParams extends BaseStepParams {
    mainGameView: MainGameGroup;
    loadingScreen: LoadingScreen;
    userPanel: StandardGroup;
}

export class ResetMainGameStep<T extends ResetMainGameStepParams = ResetMainGameStepParams> extends BaseStep<ResetMainGameStepParams> {
    public start({ mainGameView, loadingScreen, userPanel }: T): void {
        loadingScreen.visible = false;
        mainGameView.reset();
        mainGameView.visible = true;
        userPanel.visible = true;

        this._onComplete();
    }
}