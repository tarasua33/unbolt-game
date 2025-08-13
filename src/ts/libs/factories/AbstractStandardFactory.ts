import { Camera } from "three";
import { IGameGroup } from "../gameObjects/IGameGroup";
import { IGameObject } from "../gameObjects/IGameObject";
import { AbstractBaseFactory } from "./AbstractBaseFactory";

interface IBuildConfig
{
    parent: IGameGroup | Camera
}

export abstract class AbstractStandardFactory<T extends IGameObject | IGameObject[] = IGameObject> extends AbstractBaseFactory
{
    public abstract buildUi(params: IBuildConfig): T
}