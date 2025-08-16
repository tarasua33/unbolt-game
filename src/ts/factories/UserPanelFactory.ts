import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { StandardGroup } from "../libs/gameObjects/StandardGroup";

interface IParamsConfig {
    parent: IGameGroup;
}

export class UserPanelFactory extends AbstractStandardFactory<StandardGroup> {

    public buildUi(params: IParamsConfig): StandardGroup {
        const { parent } = params;

        const panel = new StandardGroup({
            z: 12,
            rotX: - Math.PI / 6,
            visible: false
        });
        panel.buildObject();
        parent.addObject(panel)

        return panel
    }
}