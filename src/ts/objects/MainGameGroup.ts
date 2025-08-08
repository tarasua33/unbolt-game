import { DragGroup, DragGroupConfig } from "../libs/gameObjects/DragGroup";
import { StandardMesh, StandardMeshConfig } from "../libs/gameObjects/StandardMesh";

export interface MainGameGroupConfig extends DragGroupConfig
{
    cubeConfig: StandardMeshConfig;
}

export class MainGameGroup extends DragGroup<MainGameGroupConfig>
{
    public buildObject(): void {
        super.buildObject();
        
        const {cubeConfig} = this._config;

        const cube = new StandardMesh(cubeConfig);
        cube.buildObject();
        this.addObject(cube);
    }
}