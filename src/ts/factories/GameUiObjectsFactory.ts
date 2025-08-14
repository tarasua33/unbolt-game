import { World } from "cannon-es";
import { AbstractBaseFactory } from "../libs/factories/AbstractBaseFactory";
import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { DragDispatcher } from "../libs/utils/DragDispatcher";
import { BoltsFactory } from "./BoltsFactory";
import { HouseElementsFactory, IHouseMap } from "./HouseElementsFactory";
import { MainGroupFactory } from "./MainGroupFactory";
import { TransitionScreen } from "../objects/screens/TransitionScreen";
import { TransitionScreenFactory } from "./TransitionScreenFactory";
import { MainCamera } from "../libs/gameObjects/MainCamera";
import { MainGameGroup } from "../objects/gameObjects/MainGameGroup";
import { Bolt } from "../objects/gameObjects/Bolt";

export interface IGameUI {
    mainGroup: MainGameGroup;
    houseElements: IHouseMap;
    bolts: Bolt[];
    transitionScreen: TransitionScreen;
}

interface IGameFactoryConfig {
    scene: IGameGroup;
    drag: DragDispatcher;
    physicWorld: World;
    camera: MainCamera;
}

export class GameUiObjectsFactory extends AbstractBaseFactory {
    public buildGameUIObjects(config: IGameFactoryConfig): IGameUI {
        const { scene, drag, physicWorld, camera } = config;
        const assetsLoader = this._assetsLoader;
        const models = this._models;

        const mainFactory = new MainGroupFactory(assetsLoader, models);
        const houseElementsFactory = new HouseElementsFactory(assetsLoader, models);
        const boltsFactory = new BoltsFactory(assetsLoader, models);
        const transitionScreenFactory = new TransitionScreenFactory(assetsLoader, models)

        const mainGroup = mainFactory.buildUi({ parent: scene, drag })

        const ui = {
            mainGroup: mainGroup,
            houseElements: houseElementsFactory.buildUi({ parent: mainGroup, physicWorld }),
            bolts: boltsFactory.buildUi({ parent: mainGroup }),
            transitionScreen: transitionScreenFactory.buildUi({parent: camera})
        }

        return ui;
    }
}