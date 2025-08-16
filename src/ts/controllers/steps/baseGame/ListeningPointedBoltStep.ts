import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { Signal } from "../../../libs/utils/Signal";
import { COLORS } from "../../../models/BoltsModel";
import { Bolt } from "../../../objects/gameObjects/Bolt";

export interface IListeningPointedBoltStepParams extends BaseStepParams {
    bolts: Bolt[];
}

export class ListeningPointedBoltStep<T extends IListeningPointedBoltStepParams = IListeningPointedBoltStepParams> extends BaseStep<IListeningPointedBoltStepParams> {
    public unboltSignal = new Signal();
    public unboltedElementSignal = new Signal();

    private _boltsNum = 0;

    public start(params: T): void {
        const { bolts } = this._params = params;

        this._boltsNum = bolts.length;
        for (const bolt of bolts) {
            bolt.raycasterSignal.add(this._onBoltPointed, this)
        }
    }

    private _onBoltPointed(bolt: Bolt): void {
        if (bolt.bolted) {
            const targetPackIndex = this._getTargetChestIndex(bolt.color);
            const isTargetColor = targetPackIndex !== -1;
            const preventerElementId = bolt.preventerElementId;
            const houseModel = this._models.houseModel;

            if (isTargetColor &&
                (!preventerElementId || !houseModel.boltedElements.has(preventerElementId))
            ) {

                this._boltsNum--;
                this.unboltSignal.dispatch(bolt, targetPackIndex);

                const config = houseModel.taskMap.get(bolt.boltedElementId);
                config!.boltsNum--;

                if (config!.boltsNum <= 0) {
                    this.unboltedElementSignal.dispatch(bolt.boltedElementId);
                }
            }

            if (this._boltsNum === 0) {
                this._onComplete();
            }
        }
    }

    private _getTargetChestIndex(color: COLORS): number {
        const targetBoltsPacks = this._models.boltsModel.targetBoltsPacks;

        let idx = -1
        for (let i = 0; i < targetBoltsPacks.length; i++) {
            const pack = targetBoltsPacks[i]!;
            if (pack.type === color && pack.count > 0) {
                idx = i;

                break;
            }
        }

        return idx;
    }

    private _removeBoltsListeners(): void {
        for (const bolt of this._params.bolts) {
            bolt.raycasterSignal.removeAll();
        }
    }

    public forceComplete(): void {
        this._removeBoltsListeners();

        this._onComplete();
    }

    protected _onComplete(): void {
        this._removeBoltsListeners();
        super._onComplete();
    }
}