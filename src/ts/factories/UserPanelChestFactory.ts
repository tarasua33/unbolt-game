import { CanvasTexture, MeshBasicMaterial, PlaneGeometry } from "three";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { StandardGroup } from "../libs/gameObjects/StandardGroup";
import { UserPanelChest, UserPanelChestConfig } from "../objects/userPanel/UserPanelChest";
import { createCircleGraphic } from "../libs/utils/GameHelpers";
import { IAnimationConfig } from "../libs/gameObjects/KeyFrameStandardMesh";

interface IParamsConfig {
    parent: StandardGroup;
}

export class UserPanelChestFactory extends AbstractStandardFactory<UserPanelChest[]> {

    public buildUi(params: IParamsConfig): UserPanelChest[] {
        const assetsLoader = this._assetsLoader;
        const { parent } = params;
        const boltModel = this._models.boltsModel;

        const circleMaterials: MeshBasicMaterial[][] = []
        const chestsNumber = boltModel.chestsNumber;
        const boltsInChestsNumber = boltModel.boltsInChestsNumber;
        const size = 16;
        for (let i = 0; i < chestsNumber; i++) {
            circleMaterials.push([]);
            for (let j = 0; j < boltsInChestsNumber; j++) {

                circleMaterials[i]!.push(
                    new MeshBasicMaterial({
                        map: new CanvasTexture(
                            createCircleGraphic(
                                size,
                                { x: size / 2, y: size / 2 },
                                size / 2,
                                0,
                                Math.PI * 2,
                                "white",
                                false)),
                        transparent: true,
                        opacity: 0.25
                    })
                )
            }
        }

        const userPanelChestConfigs: UserPanelChestConfig[] = [];
        const deltaX = 0.4
        for (let i = 0; i < chestsNumber; i++) {
            userPanelChestConfigs.push(
                {
                    chestIdx: i,
                    scaleX: 0.35,
                    scaleY: 0.35,
                    scaleZ: 0.35,
                    x: -0.4 + deltaX * i,
                    y: 1.05,
                    chestConfig: {
                        geometry: new PlaneGeometry(1, 1),
                        material: new MeshBasicMaterial({
                            map: assetsLoader.assets.textures["chest"]!,
                            transparent: true
                        })
                    },
                    circleConfig: {
                        z: 0.01,
                        geometry: new PlaneGeometry(0.15, 0.15),
                        material: circleMaterials[0]![0]!,
                        animations: new Map<string, IAnimationConfig>([
                            [
                                "collect", [
                                    {
                                        propertyKey: ".material.opacity",
                                        steps: [
                                            {
                                                duration: 0,
                                                valuesProperty: 0.25
                                            },
                                            {
                                                duration: 0.25,
                                                valuesProperty: 0.5
                                            },
                                            {
                                                duration: 0.5,
                                                valuesProperty: 1
                                            }
                                        ]
                                    },
                                    {
                                        propertyKey: ".scale",
                                        steps: [
                                            {
                                                duration: 0,
                                                valuesProperty: [1, 1, 1]
                                            },
                                            {
                                                duration: 0.25,
                                                valuesProperty: [1.5, 1.5, 1.5]
                                            },
                                            {
                                                duration: 0.5,
                                                valuesProperty: [1, 1, 1]
                                            }
                                        ]
                                    },
                                ]
                            ]
                        ])
                    },
                    circlesPositions: [
                        { x: -0.23, y: -0.11 },
                        { x: 0, y: -0.11 },
                        { x: 0.23, y: -0.11 }
                    ],
                    circlesOpacity: 0.25,
                    circleMaterials
                }
            )
        }

        const userPanelChests: UserPanelChest[] = [];

        for (let i = 0; i < chestsNumber; i++) {
            const chest = new UserPanelChest(userPanelChestConfigs[i]!);
            chest.buildObject();
            parent.addObject(chest);

            userPanelChests.push(chest)
        }

        return userPanelChests
    }
}