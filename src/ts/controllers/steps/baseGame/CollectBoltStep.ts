import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { UserPanelChest } from "../../../objects/userPanel/UserPanelChest";

interface CollectBoltStepParams extends BaseStepParams {
    chests: UserPanelChest[];
    idx: number;
}

export class CollectBoltStep<T extends CollectBoltStepParams = CollectBoltStepParams> extends BaseStep<CollectBoltStepParams> {
    private _packIdx!: number;
    private _needUpdatePack = false;

    public start({ chests, idx }: T): void {
        const chest = chests[idx]!;
        this._packIdx = idx;

        chest.completeAnimation.addOnce(this._onComplete, this);
        chest.collectBolt();

        const targetPack = this._models.boltsModel.targetBoltsPacks[idx]!;
        targetPack.count--;
        if (targetPack.count === 0) {
            this._needUpdatePack = true;
        }
    }

    public forceComplete(): void {
        this._needUpdatePack = false;
        this._onComplete();
    }

    protected _onComplete(): void {
        super._onComplete(this._needUpdatePack, this._packIdx);
        this._needUpdatePack = false;
    }
}