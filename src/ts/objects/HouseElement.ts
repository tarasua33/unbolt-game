import { StandardGroup, StandardGroupConfig } from "../libs/gameObjects/StandardGroup";
import { ElementIDs } from "../models/HouseModel";
import { Object3D, BufferGeometry, Material } from 'three';
// import { Object3D, BufferGeometry, Material, Box3, Vector3 } from 'three';
import * as dat from "lil-gui";
import { StandardMesh } from "../libs/gameObjects/StandardMesh";

export interface HouseElementConfig extends StandardGroupConfig {
    element?: Object3D;
    meshConfig?: {
        geometry: BufferGeometry;
        material: Material | Material[]
    },
    elementId: ElementIDs;
    gui?: dat.GUI
}


export class HouseElement extends StandardGroup<HouseElementConfig> {
    private _elementId!: ElementIDs;
    private _element!: Object3D
    private _bolted = true;

    public get elementId(): ElementIDs {
        return this._elementId;
    }

    public get bolted(): boolean {
        return this._bolted;
    }

    public buildObject(): void {
        super.buildObject();

        const { elementId, element, meshConfig, gui } = this._config;

        this._elementId = elementId;

        if (element)
        {
        this._element = element;
        this.add(element);
        }
        else if (meshConfig)
        {
            const element = this._element = new StandardMesh(meshConfig);

            this.addObject(element)
        }

        // DEV
        if (gui) {
            const delta = 0.005
            const folder = gui.addFolder(elementId);
            folder.add(this.position, "x").min(-5).max(5).step(delta).name("Position x");
            folder.add(this.position, "y").min(-5).max(5).step(delta).name("Position y");
            folder.add(this.position, "z").min(-5).max(5).step(delta).name("Position z");
            folder.add(this.rotation, "x").min(-5).max(5).step(delta).name("Rotation x");
            folder.add(this.rotation, "y").min(-5).max(5).step(delta).name("Rotation y");
            folder.add(this.rotation, "z").min(-5).max(5).step(delta).name("Rotation z");
            folder.add(this.scale, "x").min(-5).max(5).step(delta).name("Scale x");
            folder.add(this.scale, "y").min(-5).max(5).step(delta).name("Scale y");
            folder.add(this.scale, "z").min(-5).max(5).step(delta).name("Scale z");
        }

        // const box = new Box3().setFromObject(this);
        // const size = new Vector3();
        // box.getSize(size);

        // console.log(size);
    }
}