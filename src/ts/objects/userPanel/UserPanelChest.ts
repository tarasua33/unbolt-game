import { MeshBasicMaterial } from "three";
import { StandardMesh, StandardMeshConfig } from "../../libs/gameObjects/StandardMesh";
import { IPoint } from "../../libs/utils/GameHelpers";
import { KeyFrameStandardMesh, KeyFrameStandardMeshConfig } from "../../libs/gameObjects/KeyFrameStandardMesh";
import { KeyFrameStandardGroup, KeyFrameStandardGroupConfig } from "../../libs/gameObjects/KeyFrameStandardGroup";
import { COLORS } from "../../models/BoltsModel";

export interface UserPanelChestConfig extends KeyFrameStandardGroupConfig {
    chestConfig: StandardMeshConfig;
    circleConfig: KeyFrameStandardMeshConfig;
    circlesPositions: IPoint[];
    circlesOpacity: number;
    circleMaterials: MeshBasicMaterial[][],
    chestIdx: number
}


export class UserPanelChest extends KeyFrameStandardGroup<UserPanelChestConfig> {
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
    }

    public collectBolt(): void {
        const circle = this._circles[this._collected]!;
        this._collected++;

        circle.completeAnimation.addOnce(this._onCompleteCollect, this);
        circle.animator.playAnimation("collect");
    }

    public setTargetPackConfig(color: COLORS): void {
        this._collected = 0
        for (const circle of this._circles) {
            (circle.material as MeshBasicMaterial).color.set(color);
            (circle.material as MeshBasicMaterial).opacity = this._config.circlesOpacity;
        }
    }

    private _onCompleteCollect(): void {
        this.completeAnimation.dispatch();
    }

    public closeChestAnimation(): void {
        this.animator.playAnimation("close");
    }

    public openChestAnimation(): void {
        this.animator.playAnimation("open");
    }

    public reset(): void {
        this._collected = 0;
        for (const circle of this._circles) {
            (circle.material as MeshBasicMaterial).opacity = this._config.circlesOpacity;
        }

        super.reset();
    }
}