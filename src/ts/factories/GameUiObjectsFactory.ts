import { AbstractBaseFactory } from "../libs/factories/AbstractBaseFactory";
import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { IGameObject } from "../libs/gameObjects/IGameObject";
import { DragDispatcher } from "../libs/utils/DragDispatcher";
import { BoltsFactory } from "./BoltsFactory";
import { HouseElementsFactory } from "./HouseElementsFactory";
import { MainGroupFactory } from "./MainGroupFactory";

export class GameUiObjectsFactory extends AbstractBaseFactory {
    public buildGameUIObjects(scene: IGameGroup, drag: DragDispatcher): Record<string, IGameObject | IGameObject[]> {
        const assetsLoader = this._assetsLoader;

            const mainFactory = new MainGroupFactory(assetsLoader);
            const  houseElementsFactory = new HouseElementsFactory(assetsLoader);
            const boltsFactory = new BoltsFactory(assetsLoader)
        
        const mainGroup = mainFactory.buildUi({ parent: scene, drag })

        const ui = {
            mainGroup: mainGroup,
            houseElements: houseElementsFactory.buildUi({parent: mainGroup}),
            bolts: boltsFactory.buildUi({parent: mainGroup})
        }

        return ui;
    }
}