import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { IGameObject } from "../libs/gameObjects/IGameObject";
import { CubeFactory } from "./CubeFactory";

export class GameUiObjectsFactory
{
    private _factories = {
        cubeFactory: new CubeFactory()
    }

    public buildGameUIObjects(scene: IGameGroup): Record<string, IGameObject>
    {
        const {cubeFactory} = this._factories;
        const ui = {
            cube: cubeFactory.buildUi(scene)
        }

        return ui;
    }
}