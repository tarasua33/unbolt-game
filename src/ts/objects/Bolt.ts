import { StandardGroup, StandardGroupConfig } from "../libs/gameObjects/StandardGroup";
import { ElementIDs } from "../models/HouseModel";
import * as dat from "lil-gui";
import { StandardMesh, StandardMeshConfig } from "../libs/gameObjects/StandardMesh";
import { Signal } from "../libs/utils/Signal";

export interface BoltConfig extends StandardGroupConfig {
    bodyConfig: StandardMeshConfig;
    headConfig: StandardMeshConfig;
    boltedElementId: ElementIDs;
    blockerElementId: ElementIDs | undefined;
    gui?: dat.GUI
}


export class Bolt extends StandardGroup<BoltConfig> {
    public raycasterSignal = new Signal();

    private _boltedElementId!: ElementIDs;
    private _blockerElementId!: ElementIDs | undefined;

    private _bolted = true;
    private _animationGroup!: StandardGroup;

    public get boltedElementId(): ElementIDs {
        return this._boltedElementId;
    }

    public get blockerElementId(): ElementIDs | undefined {
        return this._blockerElementId;
    }

    public get bolted(): boolean {
        return this._bolted;
    }

    public buildObject(): void {
        super.buildObject();

        const { boltedElementId, bodyConfig, headConfig, gui } = this._config;

        this._boltedElementId = boltedElementId;

        const animationGroup = this._animationGroup = new StandardGroup({});
        this.addObject(animationGroup);

        const body = new StandardMesh(bodyConfig);
        body.buildObject();
        animationGroup.addObject(body);

        const head = new StandardMesh(headConfig);
        head.buildObject();
        head.raycasterSignal.add(this._onPointed.bind(this));
        animationGroup.addObject(head);

        // DEV
        if (gui) {
            const delta = 0.005
            const folder = gui.addFolder(boltedElementId);
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
    }

    public _onPointed(): void {
        console.log("POINTED");
        this.raycasterSignal.dispatch(this);
    }
}