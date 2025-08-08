import * as THREE from 'three';
import { AbstractStandardFactory } from "../libs/AbstractStandardFactory";
import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { StandardMesh } from "../libs/gameObjects/StandardMesh";

export class CubeFactory extends AbstractStandardFactory<StandardMesh> {

    public buildUi(parent: IGameGroup): StandardMesh {

        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const blueMaterial = new THREE.MeshStandardMaterial({ color: "blue" });

        const cube = new StandardMesh({ geometry: cubeGeometry, material: blueMaterial });

        parent.addObject(cube)

        return cube
    }
}