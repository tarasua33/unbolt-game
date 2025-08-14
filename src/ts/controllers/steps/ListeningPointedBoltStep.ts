import { BaseStep, BaseStepParams } from "../../libs/controllers/BaseStep";
import { Signal } from "../../libs/utils/Signal";
import { Bolt } from "../../objects/gameObjects/Bolt";

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
            console.log("POINTED");
            const preventerElementId = bolt.preventerElementId;

            const houseModel = this._models.houseModel;

            if (!preventerElementId || !houseModel.boltedElements.has(preventerElementId)) {

                this._boltsNum--;
                this.unboltSignal.dispatch(bolt);

                const config = houseModel.taskMap.get(bolt.boltedElementId);
                config!.boltsNum--;

                if (config!.boltsNum <= 0) {
                    this.unboltedElementSignal.dispatch(bolt.boltedElementId);
                }
            }

            if (this._boltsNum === 0)
            {
                this._onComplete();
            }
        }
    }

    public forceComplete(): void {
        for (const bolt of this._params.bolts) {
            bolt.raycasterSignal.removeAll();
        }
    }
}