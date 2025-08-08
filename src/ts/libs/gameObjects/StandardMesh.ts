import * as THREE from 'three';
import { IGameObject } from './IGameObject';

interface StandardMeshConfig {
    geometry: THREE.BufferGeometry;
    material: THREE.Material | THREE.Material[];
}

export class StandardMesh<T extends StandardMeshConfig = StandardMeshConfig> extends THREE.Mesh implements IGameObject {
    private _config: T;

    constructor(config: T) {
        super(config.geometry, config.material);

        this._config = config;
    }

    public buildObject(): void {
        // pass
    }

    /* eslint-disable */
    public updateObject(dt: number): void {
    /* eslint-enable */
        // pass
    }
}