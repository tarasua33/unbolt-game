import { IGameObject } from "./IGameObject";

export interface IGameGroup extends IGameObject {
    addObject(object: IGameObject): void
}