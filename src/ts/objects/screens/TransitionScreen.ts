import { Group } from "@tweenjs/tween.js";
import { StandardMesh, StandardMeshConfig } from "../../libs/gameObjects/StandardMesh";

export interface TransitionScreenConfig extends StandardMeshConfig{

}

export class TransitionScreen extends StandardMesh<TransitionScreenConfig>
{
    private _tweenGroup!: Group;

    public buildObject(): void {
        super.buildObject();

        this._tweenGroup = new Group();
    }

    public updateObject(dt: number): void {
        super.updateObject(dt);

        this._tweenGroup.update(performance.now());
    }
}