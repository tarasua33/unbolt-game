import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { MainCamera } from "../libs/gameObjects/MainCamera";
import { StandardGroup } from "../libs/gameObjects/StandardGroup";

interface IParamsConfig {
    parent: MainCamera;
}

export class UserPanelFactory extends AbstractStandardFactory<StandardGroup> {

    public buildUi(params: IParamsConfig): StandardGroup {
        const { parent } = params;

        const panel = new StandardGroup({z: -2.06, visible: false});
        panel.buildObject();
        parent.addObject(panel)

        return panel
    }
}