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
        this._setBaseConfig(this);
    }

    public reset(): void {
        this._setBaseConfig(this);
    }

    /* eslint-disable */
    private _setBaseConfig(ctx: any): void {
        //pass
    }

    /* eslint-disable */
    public updateObject(dt: number): void {
        // pass
    }
    /* eslint-enable */

    public onPointed(): void {
        this.raycasterSignal.dispatch()
    }
}