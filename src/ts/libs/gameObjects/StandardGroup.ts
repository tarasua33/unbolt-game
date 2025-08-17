import { IGameObject } from './IGameObject';
import { IGameGroup } from './IGameGroup';
import { Group } from 'three';

export interface StandardGroupConfig {
    x?: number;
    y?: number;
    z?: number;
    rotX?: number;
    rotY?: number;
    rotZ?: number;
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;
    visible?: boolean;
}

export class StandardGroup<T extends StandardGroupConfig = StandardGroupConfig> extends Group implements IGameGroup {
    protected _config: T;
    protected _gameObjects: IGameObject[] = [];

    constructor(config: T) {
        super();

        this._config = config;
    }

    public buildObject(): void {
        this._setBaseConfig(this);
    }

    public reset(): void {
        this._setBaseConfig(this);

        for (const child of this._gameObjects) {
            child.reset();
        }
    }

    /* eslint-disable */
    private _setBaseConfig(ctx: any): void {
        // 
    }
    /* eslint-enable */

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