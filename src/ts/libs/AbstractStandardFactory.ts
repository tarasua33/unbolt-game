import { IGameGroup } from "./gameObjects/IGameGroup";
import { IGameObject } from "./gameObjects/IGameObject";

export abstract class AbstractStandardFactory<T extends IGameObject = IGameObject>
{
    public abstract buildUi(parent: IGameGroup): T
}