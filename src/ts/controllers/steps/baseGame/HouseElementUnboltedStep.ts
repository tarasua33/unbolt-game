import { IHouseMap } from "../../../factories/HouseElementsFactory";
import { BaseStep, BaseStepParams } from "../../../libs/controllers/BaseStep";
import { ElementIDs } from "../../../models/HouseModel";

interface HouseElementUnboltedStepParams extends BaseStepParams {
    elements: IHouseMap;
    id: ElementIDs;
}

export class HouseElementUnboltedStep<T extends HouseElementUnboltedStepParams = HouseElementUnboltedStepParams> extends BaseStep<HouseElementUnboltedStepParams> {
    public start({ elements, id }: T): void {
        this._models.houseModel.boltedElements.delete(id);

        const element = elements.get(id)!
        element.applyPhysics();

        this._onComplete();
    }
}