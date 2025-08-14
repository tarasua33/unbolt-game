import { StandardGroup, StandardGroupConfig } from "../../libs/gameObjects/StandardGroup";
import { ElementIDs } from "../../models/HouseModel";
// import { Object3D, BufferGeometry, Material } from 'three';
import { Object3D, BufferGeometry, Material, Box3, Vector3 } from 'three';
import * as dat from "lil-gui";
import { StandardMesh } from "../../libs/gameObjects/StandardMesh";
import { Body, Box, Vec3, World } from "cannon-es";

export interface HouseElementConfig extends StandardGroupConfig {
    physicWorld: World;
    initialMas?: number;
    element?: Object3D;
    meshConfig?: {
        geometry: BufferGeometry;
        material: Material | Material[]
    },
    elementId: ElementIDs;
    gui?: dat.GUI
}

const MIN_GRAVITY_Y = -40;
const BASE_MASS = 10;
const MAX_DRAG_VELOCITY = 4;

export class HouseElement extends StandardGroup<HouseElementConfig> {
    private _groupBody!: Body;
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

        const { elementId, element, meshConfig, gui, physicWorld, initialMas } = this._config;

        this._elementId = elementId;

        if (element) {
            this._element = element;

            this.add(element);
        }
        else if (meshConfig) {
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

        this._addPhysicBody(physicWorld, initialMas);
    }

    private _addPhysicBody(physicWorld: World, initialMas = 0): void {
        const box = new Box3().setFromObject(this);
        const size = new Vector3();
        box.getSize(size);

        // console.log(size);
        const halfDimensions = new Vec3(size.x / 2, size.y / 2, size.z / 2);

        const shape = new Box(halfDimensions);
        const body = this._groupBody = new Body({ mass: initialMas });
        const { x, y, z } = this.position;
        body.position.set(x, y, z);
        const { x: qX, y: qY, z: qZ, w } = this.quaternion;
        body.quaternion.set(qX, qY, qZ, w);
        body.addShape(shape);
        physicWorld.addBody(body);

        body.updateMassProperties();
    }

    public applyPhysics(): void {
        const body = this._groupBody;
        body.mass = BASE_MASS;

        if (this._elementId === ElementIDs.FLOOR_T) {
            body.velocity.set(3.5, 3.5, 0);
        }
        else {
            const { x, z } = this.position;

            if (Math.abs(x) > Math.abs(z)) {
                body.velocity.set(x * 2, 0, body.velocity.z);
            }
            else {
                body.velocity.set(body.velocity.x, 0, z * 2);
            }
        }
        body.type = Body.DYNAMIC;

        body.updateMassProperties();
    }

    public addDragVelocity(): void {
        if (this._groupBody.mass > 0) {
            const body = this._groupBody;

            const { x, z } = this.position;

            if (Math.abs(x) > Math.abs(z)) {
                const multiplier = x < 0 ? -1 : 1;
                const abs = Math.min(Math.abs(x), MAX_DRAG_VELOCITY)
                body.velocity.set(abs * multiplier, 0, body.velocity.z);
            }
            else {
                const multiplier = z < 0 ? -1 : 1;
                const abs = Math.min(Math.abs(z), MAX_DRAG_VELOCITY)
                body.velocity.set(body.velocity.x, 0, multiplier * abs);
            }
        }
    }

    public updateObject(dt: number): void {
        super.updateObject(dt);

        const body = this._groupBody;
        if (body) {
            this.position.copy(this._groupBody.position);
            this.quaternion.copy(this._groupBody.quaternion);

            if (this.position.y < MIN_GRAVITY_Y && body.mass > 0) {

                body.mass = 0;
                body.velocity.set(0, 0, 0);
                body.angularVelocity.set(0, 0, 0);
                body.updateMassProperties();
                body.type = Body.STATIC;

                this.visible = false;
            }
        }
    }

    public reset(): void {
        super.reset();

        const body = this._groupBody;

        const { x, y, z } = this.position;
        body.position.set(x, y, z);
        const { x: qX, y: qY, z: qZ, w } = this.quaternion;
        body.quaternion.set(qX, qY, qZ, w);

        body.mass = 0;
        body.velocity.set(0, 0, 0);
        body.angularVelocity.set(0, 0, 0);
        body.updateMassProperties();
        body.type = Body.STATIC;

        this.visible = true;
    }
}