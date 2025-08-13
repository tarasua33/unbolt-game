import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { DragDispatcher } from '../libs/utils/DragDispatcher';
import { MainGameGroup, MainGameGroupConfig } from '../objects/MainGameGroup';

interface IParamsConfig {
    parent: IGameGroup;
    drag: DragDispatcher
}

export class MainGroupFactory extends AbstractStandardFactory<MainGameGroup> {

    public buildUi(params: IParamsConfig): MainGameGroup {
        const { parent, drag } = params;

        const mainGameGroupConfig: MainGameGroupConfig = {
            rotY: 0,
            drag,
            rotationYSpeed: 0.01,
            scaleX: 1.6,
            scaleY: 1.6,
            scaleZ: 1.6
        }

        const group = new MainGameGroup(mainGameGroupConfig);
        group.buildObject();
        parent.addObject(group)

        return group
    }
}