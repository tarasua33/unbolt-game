import { DragGroup, DragGroupConfig } from "../../libs/gameObjects/DragGroup";
import { HouseElement } from "./HouseElement";

export interface MainGameGroupConfig extends DragGroupConfig {
    // cubeConfig: StandardMeshConfig;
}

export class MainGameGroup extends DragGroup<MainGameGroupConfig> {
    public houseElements: HouseElement[] = [];

    protected _onDrag(deltaX: number): void {
        const rotBefore = this.rotation.y;
        super._onDrag(deltaX);

        const rotAfter = this.rotation.y;
        for (const element of this.houseElements) {
            element.addDragVelocity(rotAfter - rotBefore);
        }
    }
}