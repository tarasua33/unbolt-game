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
        const config = this._config;
        const { x, y, z, rotX, rotY, rotZ, scaleX, scaleY, scaleZ, visible } = config;

        if (typeof x === "number") this.position.x = x;
        if (typeof y === "number") this.position.y = y;
        if (typeof z === "number") this.position.z = z;
        if (typeof rotX === "number") this.rotation.x = rotX;
        if (typeof rotY === "number") this.rotation.y = rotY;
        if (typeof rotZ === "number") this.rotation.z = rotZ;
        if (typeof scaleX === "number") this.scale.x = scaleX;
        if (typeof scaleY === "number") this.scale.y = scaleY;
        if (typeof scaleZ === "number") this.scale.z = scaleZ;
        if (typeof visible === "boolean") this.visible = visible;
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