import { StandardGroup, StandardGroupConfig } from "../../libs/gameObjects/StandardGroup";
import { ElementIDs } from "../../models/HouseModel";
import { StandardMesh, StandardMeshConfig } from "../../libs/gameObjects/StandardMesh";
import { Signal } from "../../libs/utils/Signal";
import gsap from "gsap";
import { Back, Expo } from "gsap";
import { COLORS } from "../../models/BoltsModel";
import { Material } from "three";

export interface BoltConfig extends StandardGroupConfig {
    bodyConfig: StandardMeshConfig;
    headConfig: StandardMeshConfig;
    boltedElementId: ElementIDs;
    preventerElementId: ElementIDs | undefined;
    color: COLORS;
    bodyMaterial: Map<COLORS, Material>;
    headMaterial: Map<COLORS, Material[]>;
}

export class Bolt extends StandardGroup<BoltConfig> {
    public raycasterSignal = new Signal();
    public completeUnboltedSignal = new Signal();

    private _body!: StandardMesh;
    private _head!: StandardMesh

    private _boltedElementId!: ElementIDs;
    private _preventerElementId!: ElementIDs | undefined;

    private _color!: COLORS;
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

    public get color(): COLORS {
        return this._color;
    }

    public set color(value: COLORS) {
        this._color = value;
    }

    public buildObject(): void {
        super.buildObject();

        const { color, boltedElementId, preventerElementId, bodyConfig, headConfig } = this._config;

        this._color = color;
        this._boltedElementId = boltedElementId;
        this._preventerElementId = preventerElementId;

        const animationGroup = this._animationGroup = new StandardGroup({});
        this.addObject(animationGroup);

        // const bodyMaterial = (bodyConfig.material as Material);
        // bodyConfig.material = bodyMaterial.clone();
        const body = this._body = new StandardMesh(bodyConfig);
        body.buildObject();
        animationGroup.addObject(body);

        const headMaterial = (headConfig.material as Material[]);
        headConfig.material = headMaterial.map(this._cloneMaterial);
        const head = this._head = new StandardMesh(headConfig);
        head.buildObject();
        head.raycasterSignal.add(this._onPointed, this);
        animationGroup.addObject(head);
    }

    private _cloneMaterial(material: Material): Material {
        return material.clone()
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
                ease: "none",
                overwrite: true,
                onComplete: this._onCompleteUnboltedAnimation.bind(this)
            });
    }

    private _onCompleteUnboltedAnimation(): void {
        this.visible = false;

        (this._body.material as Material).opacity = 1;
        const materials = this._head.material as Material[];
        for (const material of materials) {
            material.opacity = 1;
        }

        this.completeUnboltedSignal.dispatch();
    }

    private set progress(value: number) {
        this._progress = value;

        const moveValue = Expo.easeOut(value);
        const animationGroup = this._animationGroup;
        animationGroup.position.y = moveValue * this._animYOffset;
        animationGroup.rotation.y = moveValue * this._animYRotation;

        const opacityValue = Expo.easeInOut(value);
        (this._body.material as Material).opacity = 1 - opacityValue;
        const materials = this._head.material as Material[];
        for (const material of materials) {
            material.opacity = 1 - opacityValue;
        }

        const scaleValue = Back.easeOut(value);

        animationGroup.scale.x = 1 + 1 * scaleValue;
        animationGroup.scale.y = 1 + 1 * scaleValue;
        animationGroup.scale.z = 1 + 1 * scaleValue;
    }

    private get progress(): number {
        return this._progress;
    }

    public reset(): void {
        super.reset();

        gsap.killTweensOf(this);

        const { bodyMaterial, headMaterial } = this._config;
        const bM = bodyMaterial.get(this._color)!;
        const hM = headMaterial.get(this._color)!;
        bM.opacity = 1;
        for (const material of hM) {
            material.opacity = 1;
        }
        this._body.material = bM;
        this._head.material = hM;

        this._bolted = true;
        const animationGroup = this._animationGroup;
        animationGroup.position.set(0, 0, 0);
        animationGroup.rotation.set(0, 0, 0);
        animationGroup.scale.set(1, 1, 1);

        this.visible = true;
    }
}