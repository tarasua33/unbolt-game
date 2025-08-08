import { Object3D, Object3DEventMap } from "three";

export interface IGameObject extends Object3D<Object3DEventMap>
{
    buildObject(): void

    updateObject(dt: number): void
}