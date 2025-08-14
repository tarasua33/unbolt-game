import { StandardGroup, StandardGroupConfig } from "../../libs/gameObjects/StandardGroup";
import { ElementIDs } from "../../models/HouseModel";
// import * as dat from "lil-gui";
import { StandardMesh, StandardMeshConfig } from "../../libs/gameObjects/StandardMesh";
import { Signal } from "../../libs/utils/Signal";
import gsap from "gsap";
import { Back } from "gsap";

export interface BoltConfig extends StandardGroupConfig {
    bodyConfig: StandardMeshConfig;
    headConfig: StandardMeshConfig;
    boltedElementId: ElementIDs;
    preventerElementId: ElementIDs | undefined;
}


export class Bolt extends StandardGroup<BoltConfig> {
    public raycasterSignal = new Signal();
    public completeUnboltedSignal = new Signal();

    private _boltedElementId!: ElementIDs;
    private _preventerElementId!: ElementIDs | undefined;

    private _bolted = true;
    private _animationGroup!: StandardGroup;

    private _progress = 0;
    private _animYOffset = 4;
    private _animYRotation = Math.PI * 6;

    public get boltedElementId(): ElementIDs {
        return this._boltedElementId;
    }

    public get preventerElementId(): ElementIDs | undefined {
        return this._preventerElementId;
    }

    public get bolted(): boolean {
        return this._bolted;
    }

    public buildObject(): void {
        super.buildObject();

        const { boltedElementId, preventerElementId, bodyConfig, headConfig } = this._config;

        this._boltedElementId = boltedElementId;
        this._preventerElementId = preventerElementId;

        const animationGroup = this._animationGroup = new StandardGroup({});
        this.addObject(animationGroup);

        const body = new StandardMesh(bodyConfig);
        body.buildObject();
        animationGroup.addObject(body);

        const head = new StandardMesh(headConfig);
        head.buildObject();
        head.raycasterSignal.add(this._onPointed, this);
        animationGroup.addObject(head);

        // DEV
        // if (gui) {
        //     const delta = 0.005
        //     const folder = gui.addFolder(boltedElementId);
        //     folder.add(this.position, "x").min(-5).max(5).step(delta).name("Position x");
        //     folder.add(this.position, "y").min(-5).max(5).step(delta).name("Position y");
        //     folder.add(this.position, "z").min(-5).max(5).step(delta).name("Position z");
        //     folder.add(this.rotation, "x").min(-5).max(5).step(delta).name("Rotation x");
        //     folder.add(this.rotation, "y").min(-5).max(5).step(delta).name("Rotation y");
        //     folder.add(this.rotation, "z").min(-5).max(5).step(delta).name("Rotation z");
        //     folder.add(this.scale, "x").min(-5).max(5).step(delta).name("Scale x");
        //     folder.add(this.scale, "y").min(-5).max(5).step(delta).name("Scale y");
        //     folder.add(this.scale, "z").min(-5).max(5).step(delta).name("Scale z");
        // }
    }

    public _onPointed(): void {
        this.raycasterSignal.dispatch(this);
    }

    public unbolt(): void {
        this._bolted = false;

        return this._startTweenAnimation();
    }

    private _startTweenAnimation(): void {
        this._progress = 0;
        this._animationGroup.rotation.z = Math.PI / 4;

        gsap.killTweensOf(this);
        gsap.to(this,
            {
                ["progress"]: 1,
                duration: 1.5,
                ease: "expo.out",
                overwrite: true,
                onComplete: this._onCompleteUnboltedAnimation.bind(this)
            });
    }

    private _onCompleteUnboltedAnimation(): void {
        this.visible = false;

        this.completeUnboltedSignal.dispatch();
    }

    private set progress(value: number) {
        this._progress = value;

        const animationGroup = this._animationGroup;
        animationGroup.position.y = this._progress * this._animYOffset;
        animationGroup.rotation.y = this._progress * this._animYRotation;

        const helpValue = Back.easeIn(value);

        animationGroup.scale.x = 1 - Math.sin(helpValue);
        animationGroup.scale.y = 1 - Math.sin(helpValue);
        animationGroup.scale.z = 1 - Math.sin(helpValue);
    }

    private get progress(): number {
        return this._progress;
    }

    public reset(): void {
        super.reset();

        gsap.killTweensOf(this);

        this._bolted = true;
        const animationGroup = this._animationGroup;
        animationGroup.position.set(0, 0, 0);
        animationGroup.rotation.set(0, 0, 0);
        animationGroup.scale.set(1, 1, 1);

        this.visible = true;
    }
}