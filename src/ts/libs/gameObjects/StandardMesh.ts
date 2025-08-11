import { BufferGeometry, Mesh } from 'three';
import { IGameObject } from './IGameObject';
import { IMaterial } from './IMaterial';
import { Signal } from '../utils/Signal';

export interface IMeshConfig {
    geometry?: BufferGeometry;
    material?: IMaterial;    
}

export interface StandardMeshConfig extends IMeshConfig {
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

export class StandardMesh<T extends StandardMeshConfig = StandardMeshConfig> extends Mesh implements IGameObject {
    public raycasterSignal = new Signal();

    protected _config: T;

    constructor(config: T) {
        super(config.geometry, config.material);

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

    /* eslint-disable */
    public updateObject(dt: number): void {
        /* eslint-enable */
        // pass
    }

    public onPointed(): void
    {
        this.raycasterSignal.dispatch()
    }
}