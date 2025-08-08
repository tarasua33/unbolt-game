import { IGameGroup } from "../gameObjects/IGameGroup";
import { IGameObject } from "../gameObjects/IGameObject";

interface IBuildCOnfig
{
    parent: IGameGroup
}

export abstract class AbstractStandardFactory<T extends IGameObject = IGameObject>
{
    public abstract buildUi(params: IBuildCOnfig): T
}