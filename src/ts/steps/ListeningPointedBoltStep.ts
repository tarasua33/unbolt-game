import { BaseStep } from "../libs/utils/BaseStep";
import { ElementIDs } from "../models/HouseModel";
import { Bolt } from "../objects/Bolt";
import { HouseElement } from "../objects/HouseElement";

interface IListeningPointedBoltStepParams {
    bolts: Bolt[];
    houseElements: HouseElement[]
}

export class ListeningPointedBoltStep<T extends IListeningPointedBoltStepParams = IListeningPointedBoltStepParams> extends BaseStep {
    private _params!: T;
    private _elementsMap!: Map<ElementIDs, HouseElement>;

    public start(params: T) {
        const { bolts, houseElements } = this._params = params;

        const elementsMap: Map<ElementIDs, HouseElement> = this._elementsMap = new Map();
        for (const element of houseElements) {
            elementsMap.set(element.elementId, element);
        }

        for (const bolt of bolts) {
            bolt.raycasterSignal.add(this._onBoltPointed.bind(this))
        }
    }

    private _onBoltPointed(bolt: Bolt): void {
        if (bolt.bolted) {
            const blockerElementId = bolt.blockerElementId;

            const houseModel = this._houseModel;

            if (!blockerElementId || houseModel.boltedElements.indexOf(blockerElementId) === -1) {
                // taskMap.get(bolt.boltedElementId)
                const config = houseModel.taskMap.get(bolt.boltedElementId);
                config!.boltsNum--;
                bolt.unbolt();

                if (config!.boltsNum <= 0) {
                    const element = this._elementsMap.get(bolt.boltedElementId)!

                    const inx = houseModel.boltedElements.indexOf(element.elementId);
                    houseModel.boltedElements.splice(inx, 1);

                    element.applyPhysics();
                }
            }
        }
    }
}