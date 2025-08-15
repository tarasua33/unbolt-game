import { BaseStep, BaseStepParams } from "../../libs/controllers/BaseStep";
import { StandardMesh } from "../../libs/gameObjects/StandardMesh";
import { UserPanelChest } from "../../objects/userPanel/UserPanelChest";
import { Signal } from "../../libs/utils/Signal";

interface CollectBoltStepParams extends BaseStepParams {
    chests: UserPanelChest[];
    idx: number;
}

export class CollectBoltStep<T extends CollectBoltStepParams = CollectBoltStepParams> extends BaseStep<CollectBoltStepParams> {
    public readonly needUpdatePackSignal = new Signal();
    private _progress = 0;
    private _packIdx!: number;
    private _needUpdatePack = false;
    private _collectView!: StandardMesh;

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
        this.needUpdatePackSignal.dispatch(this._needUpdatePack, this._packIdx);

        this._needUpdatePack = false;

        super._onComplete()
    }
}