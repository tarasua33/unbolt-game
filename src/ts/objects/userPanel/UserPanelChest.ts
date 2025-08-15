import { Material } from "three";
import { StandardGroup, StandardGroupConfig } from "../../libs/gameObjects/StandardGroup";
import { StandardMesh, StandardMeshConfig } from "../../libs/gameObjects/StandardMesh";
import { IPoint } from "../../libs/utils/GameHelpers";
import { Signal } from "../../libs/utils/Signal";
// import gsap from "gsap";

export interface UserPanelChestConfig extends StandardGroupConfig {
    chestConfig: StandardMeshConfig;
    circleConfig: StandardMeshConfig;
    circlesPositions: IPoint[];
    circlesOpacity: number;
    circleMaterials: Material[][],
    chestIdx: number
}


export class UserPanelChest extends StandardGroup<UserPanelChestConfig> {
    public completeAnimationSignal = new Signal();
    private _circles: StandardMesh[] = [];
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
            const circle = new StandardMesh(circleConfig);
            circle.buildObject();
            this.addObject(circle);

            circle.position.set(x, y, circle.position.z);
            this._circles.push(circle);
        }

        // (this._config.circleConfig.material as MeshBasicMaterial).color.set("green")
    }

    public collectBolt(): StandardMesh {
        const circle = this._circles[this._collected]!;
        this._collected++;

        return circle;
    }

    public reset(): void {
        this._collected = 0;
        for (const circle of this._circles) {
            (circle.material as Material).opacity = this._config.circlesOpacity;
        }

        super.reset();
    }
}