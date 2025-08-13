import { World } from "cannon-es";
import { AbstractBaseFactory } from "../libs/factories/AbstractBaseFactory";
import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { DragDispatcher } from "../libs/utils/DragDispatcher";
import { BoltsFactory } from "./BoltsFactory";
import { HouseElementsFactory } from "./HouseElementsFactory";
import { MainGroupFactory } from "./MainGroupFactory";
import { MainGameGroup } from "../objects/MainGameGroup";
import { HouseElement } from "../objects/HouseElement";
import { Bolt } from "../objects/Bolt";
// import { TransitionScreen } from "../objects/screens/TransitionScreen";
// import { TransitionScreenFactory } from "./TransitionScreenFactory";
import { Camera } from "three";

export interface IGameUI {
    mainGroup: MainGameGroup;
    houseElements: HouseElement[];
    bolts: Bolt[];
    // transitionScreen: TransitionScreen;
}

interface IGameFactoryConfig
{
    scene: IGameGroup;
    drag: DragDispatcher;
    physicWorld: World;
    camera: Camera;
}

export class GameUiObjectsFactory extends AbstractBaseFactory {
    public buildGameUIObjects(config: IGameFactoryConfig): IGameUI {
        // const {scene, drag, physicWorld, camera} = config;

        const {scene, drag, physicWorld} = config;
        const assetsLoader = this._assetsLoader;

        const mainFactory = new MainGroupFactory(assetsLoader);
        const houseElementsFactory = new HouseElementsFactory(assetsLoader);
        const boltsFactory = new BoltsFactory(assetsLoader);
        // const transitionScreenFactory = new TransitionScreenFactory(assetsLoader)

        const mainGroup = mainFactory.buildUi({ parent: scene, drag })

        const ui = {
            mainGroup: mainGroup,
            houseElements: houseElementsFactory.buildUi({ parent: mainGroup, physicWorld }),
            bolts: boltsFactory.buildUi({ parent: mainGroup }),
            // transitionScreen: transitionScreenFactory.buildUi({parent: camera})
        }

        return ui;
    }
}