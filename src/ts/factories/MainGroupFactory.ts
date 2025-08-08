import * as THREE from 'three';
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { DragDispatcher } from '../libs/utils/DragDispatcher';
import { MainGameGroup, MainGameGroupConfig } from '../objects/MainGameGroup';

interface IParamsConfig {
    parent: IGameGroup;
    drag: DragDispatcher
}

export class MainGroupFactory extends AbstractStandardFactory<MainGameGroup> {

    public buildUi(params: IParamsConfig): MainGameGroup {
        const { parent, drag } = params;

        const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
        const blueMaterial = new THREE.MeshStandardMaterial({ color: "blue" });

        const mainGameGroupConfig: MainGameGroupConfig = {
            cubeConfig: { geometry: cubeGeometry, material: blueMaterial },
            drag,
            rotationYSpeed: 0.01
        }

        const cube = new MainGameGroup(mainGameGroupConfig);
        cube.buildObject();
        parent.addObject(cube)

        return cube
    }
}