import { DragGroup, DragGroupConfig } from "../libs/gameObjects/DragGroup";

export interface MainGameGroupConfig extends DragGroupConfig
{
    // cubeConfig: StandardMeshConfig;
}

export class MainGameGroup extends DragGroup<MainGameGroupConfig>
{
    // pass
}