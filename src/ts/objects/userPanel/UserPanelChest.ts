import { Material } from "three";
import { StandardGroup, StandardGroupConfig } from "../../libs/gameObjects/StandardGroup";
import { StandardMesh, StandardMeshConfig } from "../../libs/gameObjects/StandardMesh";
import { IPoint } from "../../libs/utils/GameHelpers";
import { Signal } from "../../libs/utils/Signal";
import { KeyFrameStandardMesh, KeyFrameStandardMeshConfig } from "../../libs/gameObjects/KeyFrameStandardMesh";

export interface UserPanelChestConfig extends StandardGroupConfig {
    chestConfig: StandardMeshConfig;
    circleConfig: KeyFrameStandardMeshConfig;
    circlesPositions: IPoint[];
    circlesOpacity: number;
    circleMaterials: Material[][],
    chestIdx: number
}


export class UserPanelChest extends StandardGroup<UserPanelChestConfig> {
    public completeAnimation = new Signal();
    private _circles: KeyFrameStandardMesh[] = [];
    private _collected = 0;

    public buildObject(): void {
        super.buildObject();

        const { chestConfig, circlesPositions, circleConfig, circleMaterials, chestIdx } = this._config;

        const chest = new StandardMesh(chestConfig);
        chest.buildObject();
        this.addObject(chest);

        for (let i = 0; i < circlesPositions.length; i++) {
            const { x, y } = circlesPositions[i]!;

            circleConfig.material = circleMaterials[chestIdx]![i]!
            const circle = new KeyFrameStandardMesh(circleConfig);
            circle.buildObject();
            this.addObject(circle);

            circle.position.set(x, y, circle.position.z);
            this._circles.push(circle);
        }

        // (this._config.circleConfig.material as MeshBasicMaterial).color.set("green")
    }

    public collectBolt(): void {
        const circle = this._circles[this._collected]!;
        this._collected++;

        // return circle;
        circle.completeAnimation.addOnce(this._onCompleteCollect, this);
        circle.playAnimation("collect");
    }

    private _onCompleteCollect(): void
    {
        this.completeAnimation.dispatch();
    }

    public reset(): void {
        this._collected = 0;
        for (const circle of this._circles) {
            (circle.material as Material).opacity = this._config.circlesOpacity;
        }

        super.reset();
    }
}