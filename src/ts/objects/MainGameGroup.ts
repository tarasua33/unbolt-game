import { DragGroup, DragGroupConfig } from "../libs/gameObjects/DragGroup";
import { HouseElement } from "./HouseElement";

export interface MainGameGroupConfig extends DragGroupConfig {
    // cubeConfig: StandardMeshConfig;
}

export class MainGameGroup extends DragGroup<MainGameGroupConfig> {
    public houseElements: HouseElement[] = [];

    protected _onDrag(deltaX: number) {
        super._onDrag(deltaX);

        for (const element of this.houseElements) {
            element.addDragVelocity()
        }
    }
}