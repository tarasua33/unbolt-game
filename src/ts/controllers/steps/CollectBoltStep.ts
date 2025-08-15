import { Material } from "three";
import { BaseStep, BaseStepParams } from "../../libs/controllers/BaseStep";
import { StandardMesh } from "../../libs/gameObjects/StandardMesh";
import { UserPanelChest } from "../../objects/userPanel/UserPanelChest";
import { gsap } from "gsap";
import { Signal } from "../../libs/utils/Signal";

interface CollectBoltStepParams extends BaseStepParams {
    chests: UserPanelChest[];
    idx: number;
}

const START_ALPHA = 0.25;

export class CollectBoltStep<T extends CollectBoltStepParams = CollectBoltStepParams> extends BaseStep<CollectBoltStepParams> {
    public readonly needUpdatePackSignal = new Signal();
    private _progress = 0;
    private _packIdx!: number;
    private _needUpdatePack = false;
    private _collectView!: StandardMesh;

    public start({ chests, idx }: T): void {
        const chest = chests[idx]!;
        this._packIdx = idx;
        
        this._collectView = chest.collectBolt();

        const targetPack = this._models.boltsModel.targetBoltsPacks[idx]!;
        targetPack.count--;
        if (targetPack.count === 0) {
            this._needUpdatePack = true;
        }

        this._startTweenAnimation();
    }

    public forceComplete(): void {
        this._needUpdatePack = false;
        this._onComplete();
    }

    protected _onComplete(): void {
        this.needUpdatePackSignal.dispatch(this._needUpdatePack, this._packIdx);

        gsap.killTweensOf(this);
        this._needUpdatePack = false;

        super._onComplete()
    }

    private _startTweenAnimation(): void {
        this._progress = 0;

        gsap.killTweensOf(this);

        gsap.to(this,
            {
                ["progress"]: 1,
                duration: 0.35,
                ease: "sine.inOut",
                overwrite: true,
                onComplete: this._onComplete.bind(this)
            });
    }

    private set progress(value: number) {
        this._progress = value;

        const calculatedAlpha = START_ALPHA + value * (1 - START_ALPHA);
        (this._collectView.material as Material).opacity = calculatedAlpha;
    }

    private get progress(): number {
        return this._progress;
    }
}