import { MeshBasicMaterial, PlaneGeometry } from "three";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { IAnimationConfig, KeyFrameAnimationConfig } from "../libs/gameObjects/KeyFrameAnimation";
import { KeyFrameStandardMesh, KeyFrameStandardMeshConfig } from "../libs/gameObjects/KeyFrameStandardMesh";

interface IParamsConfig {
    parent: IGameGroup;
}

export class ReplayButtonFactory extends AbstractStandardFactory<KeyFrameStandardMesh> {

    public buildUi(params: IParamsConfig): KeyFrameStandardMesh {
        const { parent } = params;

        const buttonScale = 3;

        const buttonAnimations: KeyFrameAnimationConfig = new Map<string, IAnimationConfig>();
        buttonAnimations.set("pick", [
            {
                propertyKey: ".scale",
                steps: [
                    {
                        duration: 0,
                        values: [buttonScale, buttonScale, buttonScale]
                    },
                    {
                        duration: 0.15,
                        values: [buttonScale + 0.05, buttonScale + 0.05, buttonScale + 0.05]
                    },
                    {
                        duration: 0.15,
                        values: [0, 0, 0]
                    },
                ]
            }
        ])

        const replayButtonConfig: KeyFrameStandardMeshConfig = {
            geometry: new PlaneGeometry(0.3, 0.2),
            material: new MeshBasicMaterial({
                map: this._assetsLoader.assets.textures["replay"]!,
                transparent: true
            }),
            y: 5.65,
            // x: 0.4,
            scaleX: buttonScale,
            scaleY: buttonScale,
            scaleZ: buttonScale,
            animations: buttonAnimations
        }

        const button = new KeyFrameStandardMesh(replayButtonConfig);
        button.buildObject();
        parent.addObject(button)

        return button
    }
}