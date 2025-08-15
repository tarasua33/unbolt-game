// import { MeshBasicMaterial } from "three";
import { StandardGroup, StandardGroupConfig } from "../../libs/gameObjects/StandardGroup";
import { StandardMesh, StandardMeshConfig } from "../../libs/gameObjects/StandardMesh";
import { IPoint } from "../../libs/utils/GameHelpers";
import { Signal } from "../../libs/utils/Signal";
// import gsap from "gsap";

export interface UserPanelChestConfig extends StandardGroupConfig {
    chestConfig: StandardMeshConfig;
    circleConfig: StandardMeshConfig;
    circlesPositions: IPoint[]
}


export class UserPanelChest extends StandardGroup<UserPanelChestConfig> {
    public completeAnimationSignal = new Signal();

    private _circles: StandardMesh[] = [];

    public buildObject(): void {
        super.buildObject();

        const { chestConfig, circlesPositions, circleConfig } = this._config;

        const chest = new StandardMesh(chestConfig);
        chest.buildObject();
        this.addObject(chest);

        for (const {x, y} of circlesPositions) {
            const circle = new StandardMesh(circleConfig);
            circle.buildObject();
            this.addObject(circle);

            circle.position.set(x, y, circle.position.z);
            this._circles.push(circle);
        }

        // (this._config.circleConfig.material as MeshBasicMaterial).color.set("green")
    }
}