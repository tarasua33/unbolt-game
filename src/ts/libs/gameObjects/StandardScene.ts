import * as THREE from 'three';
import { IGameObject } from './IGameObject';
import { IGameGroup } from './IGameGroup';

export class StandardScene extends THREE.Scene implements IGameGroup {
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