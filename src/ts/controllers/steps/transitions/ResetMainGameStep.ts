import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { StandardGroup } from "../../../libs/gameObjects/StandardGroup";
import { MainGameGroup } from "../../../objects/gameObjects/MainGameGroup";
import { LoadingScreen } from "../../../objects/screens/LoadingScreen";
import { UserPanelChest } from "../../../objects/userPanel/UserPanelChest";

export interface ResetMainGameStepParams extends BaseStepParams {
    mainGameView: MainGameGroup;
    loadingScreen: LoadingScreen;
    userPanel: StandardGroup;
    chests: UserPanelChest[]
}

export class ResetMainGameStep<T extends ResetMainGameStepParams = ResetMainGameStepParams> extends BaseStep<ResetMainGameStepParams> {
    public start({ mainGameView, loadingScreen, userPanel,chests}: T): void {
        loadingScreen.visible = false;
        
        mainGameView.reset();
        mainGameView.visible = true;

        userPanel.reset();
        userPanel.visible = true;

        const targetPacks = this._models.boltsModel.targetBoltsPacks;
        for (let i = 0; i < chests.length; i++)
        {
            chests[i]!.setTargetPackConfig(targetPacks[i]!.type);
        }

        this._onComplete();
    }
}