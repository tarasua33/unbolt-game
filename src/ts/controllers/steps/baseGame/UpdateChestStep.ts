import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { UserPanelChest } from "../../../objects/userPanel/UserPanelChest";

interface UpdateChestStepParams extends BaseStepParams {
    chests: UserPanelChest[];
    idx: number;
}

export class UpdateChestStep<T extends UpdateChestStepParams = UpdateChestStepParams> extends BaseStep<UpdateChestStepParams> {
    private _packIdx!: number;

    public start(params: T): void {
        const { chests, idx } =
            this._params = params;
        const chest = chests[idx]!;
        this._packIdx = idx;

        chest.completeAnimation.addOnce(this._onChestClosed, this);
        chest.closeChestAnimation();
    }

    private _onChestClosed(): void {
        const boltsModel = this._models.boltsModel;
        const targetPack = boltsModel.targetBoltsPacks[this._packIdx];
        const idx = Math.floor(Math.random() * boltsModel.boltsPacks.length);
        const pack = boltsModel.boltsPacks.splice(idx, 1)[0];

        if (pack) {
            targetPack!.type = pack!.type;

            const chest = this._params.chests[this._packIdx]!;
            chest.completeAnimation.addOnce(this._onComplete, this);

            chest.setTargetPackConfig(pack.type);
            chest.openChestAnimation();
        }
        else {
            this._onComplete()
        }
    }

    public forceComplete(): void {
        this._onComplete();
    }

    protected _onComplete(): void {
        this._models.boltsModel.targetBoltsPacks[this._packIdx]!.count = 3
        const chest = this._params.chests[this._packIdx]!;
        chest.completeAnimation.remove(this._onComplete);
        chest.completeAnimation.remove(this._onChestClosed);

        super._onComplete()
    }
}