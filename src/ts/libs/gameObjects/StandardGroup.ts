import * as THREE from 'three';
import { IGameObject } from './IGameObject';
import { IGameGroup } from './IGameGroup';

interface StandardGroupConfig {
}

export class StandardGroup<T extends StandardGroupConfig = StandardGroupConfig> extends THREE.Group implements IGameGroup {
    private _config: T;
        private _gameObjects: IGameObject[] = [];

    constructor(config: T) {
        super();

        this._config = config;
    }

    public buildObject(): void {
        // pass
    }

    public addObject(object: IGameObject): void
    {
        this._gameObjects.push(object);
        this.add(object);
    }

    public updateObject(dt: number): void
    {
        for (const child of this._gameObjects)
        {
            child.updateObject(dt)
        }
    }
}