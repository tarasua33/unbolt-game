import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { StandardGroup } from "../../../libs/gameObjects/StandardGroup";
import { Bolt } from "../../../objects/gameObjects/Bolt";
import { MainGameGroup } from "../../../objects/gameObjects/MainGameGroup";
import { LoadingScreen } from "../../../objects/screens/LoadingScreen";
import { UserPanelChest } from "../../../objects/userPanel/UserPanelChest";

export interface ResetMainGameStepParams extends BaseStepParams {
    mainGameView: MainGameGroup;
    loadingScreen: LoadingScreen;
    userPanel: StandardGroup;
    chests: UserPanelChest[];
    bolts: Bolt[];
}

export class ResetMainGameStep<T extends ResetMainGameStepParams = ResetMainGameStepParams> extends BaseStep<ResetMainGameStepParams> {
    public start({ mainGameView, loadingScreen, userPanel, chests, bolts }: T): void {
        loadingScreen.visible = false;

        const boltColorsAmount = this._models.boltsModel.boltsColorsAmount;
        for (const bolt of bolts) {
            const colorIndex = Math.floor(Math.random() * boltColorsAmount.length);
            const color = boltColorsAmount.splice(colorIndex, 1)[0]!;
            bolt.color = color;
        }

        mainGameView.reset();
        mainGameView.visible = true;

        userPanel.reset();
        userPanel.visible = true;

        const targetPacks = this._models.boltsModel.targetBoltsPacks;
        for (let i = 0; i < chests.length; i++) {
            chests[i]!.setTargetPackConfig(targetPacks[i]!.type);
        }

        this._onComplete();
    }
}