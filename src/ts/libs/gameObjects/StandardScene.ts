import { IGameObject } from './IGameObject';
import { IGameGroup } from './IGameGroup';
import { Scene } from 'three';

export class StandardScene extends Scene implements IGameGroup {
    private _gameObjects: IGameObject[] = [];

    public buildObject(): void {
        // pass
    }

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