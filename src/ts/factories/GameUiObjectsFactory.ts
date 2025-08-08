import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { IGameObject } from "../libs/gameObjects/IGameObject";
import { DragDispatcher } from "../libs/utils/DragDispatcher";
import { MainGroupFactory } from "./MainGroupFactory";

export class GameUiObjectsFactory
{
    private _factories = {
        cubeFactory: new MainGroupFactory()
    }

    public buildGameUIObjects(scene: IGameGroup, drag: DragDispatcher): Record<string, IGameObject>
    {
        const {cubeFactory} = this._factories;
        const ui = {
            mainGroup: cubeFactory.buildUi({parent: scene, drag})
        }

        return ui;
    }
}