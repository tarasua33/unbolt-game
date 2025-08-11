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
            drag,
            rotationYSpeed: 0.01,
            scaleX: 1.5,
            scaleY: 1.5,
            scaleZ: 1.5
        }

        const group = new MainGameGroup(mainGameGroupConfig);
        group.buildObject();
        parent.addObject(group)

        return group
    }
}