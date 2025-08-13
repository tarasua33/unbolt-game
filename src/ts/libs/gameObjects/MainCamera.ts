import { PerspectiveCamera } from "three";
import { IGameObject } from "./IGameObject";

export class MainCamera extends PerspectiveCamera {
    protected _gameObjects: IGameObject[] = [];

    public addObject(object: IGameObject): void {
        this._gameObjects.push(object);
        this.add(object);
    }

    public updateObject(dt: number): void {
        for (const child of this._gameObjects) {
            child.updateObject(dt)
        }
    }
}