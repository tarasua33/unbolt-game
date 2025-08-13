import { BoxGeometry, MeshStandardMaterial, RepeatWrapping } from "three";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { ElementIDs } from "../models/HouseModel";
import { HouseElement, HouseElementConfig } from "../objects/HouseElement";
import { World } from "cannon-es";
import { MainGameGroup } from "../objects/MainGameGroup";

interface IParamsConfig {
    parent: MainGameGroup;
    physicWorld: World;
}

export class HouseElementsFactory extends AbstractStandardFactory<HouseElement[]> {

    public buildUi(params: IParamsConfig): HouseElement[] {
        const { parent, physicWorld } = params;
        const assetsLoader = this._assetsLoader;

        const roofTile = this._assetsLoader.assets.textures.tile!;
        roofTile.rotation = Math.PI / 2;
        roofTile.wrapS = RepeatWrapping;
        roofTile.wrapT = RepeatWrapping;
        roofTile.repeat.set(8, 8);

        const geometry = new BoxGeometry(3, 0.05, 5);
        const roofMaterials: MeshStandardMaterial[] = [
            new MeshStandardMaterial({ color: "#a64319" }),
            new MeshStandardMaterial({ color: "#a64319" }),
            new MeshStandardMaterial({ map: roofTile }),
            new MeshStandardMaterial({ color: "#a64319" }),
            new MeshStandardMaterial({ color: "#a64319" }),
            new MeshStandardMaterial({ color: "#a64319" })
        ]

        const configs: HouseElementConfig[] = [
            {
                y: 0.76,
                z: 2.1,
                x: -1,
                element: assetsLoader.assets.gltf.door!,
                elementId: ElementIDs.DOOR,
                physicWorld
                // initialMas: 10
            },
            {
                z: 2.1,
                x: 1,
                y: 1.395,
                rotZ: Math.PI / 2,
                scaleX: 1.19,
                scaleY: 1.39,
                element: assetsLoader.assets.gltf.window!,
                elementId: ElementIDs.WINDOW_F,
                physicWorld
            },
            {
                z: 1,
                x: -2.02,
                y: 1.395,
                rotZ: Math.PI / 2,
                rotY: Math.PI / 2,
                scaleX: 1.19,
                scaleY: 1.39,
                element: assetsLoader.assets.gltf.window!.clone(),
                elementId: ElementIDs.WINDOW_L,
                physicWorld
            },
            {
                z: -1,
                x: 2.02,
                y: 1.395,
                rotZ: Math.PI / 2,
                rotY: -Math.PI / 2,
                scaleX: 1.19,
                scaleY: 1.39,
                element: assetsLoader.assets.gltf.window!.clone(),
                elementId: ElementIDs.WINDOW_R,
                physicWorld
            },
            {
                y: 1.04,
                x: -1,
                z: 2.035,
                element: assetsLoader.assets.gltf.wallDoor!,
                elementId: ElementIDs.WALL_FD,
                physicWorld
            },
            {
                y: 1.04,
                x: 1.0,
                z: 2.035,
                element: assetsLoader.assets.gltf.wallWindow!,
                elementId: ElementIDs.WALL_FW,
                physicWorld
            },
            {
                y: 1.04,
                x: -1.97,
                z: 1,
                rotY: Math.PI / 2,
                element: assetsLoader.assets.gltf.wallWindow!.clone(),
                elementId: ElementIDs.WALL_LSFW,
                physicWorld
            },
            {
                y: 1.04,
                x: -1.97,
                z: -1,
                rotY: Math.PI / 2,
                element: assetsLoader.assets.gltf.wallFull!,
                elementId: ElementIDs.WALL_LSB,
                physicWorld
            },
            {
                y: 1.04,
                x: 1.97,
                z: -1,
                rotY: Math.PI / 2,
                element: assetsLoader.assets.gltf.wallWindow!.clone(),
                elementId: ElementIDs.WALL_RSBW,
                physicWorld
            },
            {
                y: 1.04,
                x: 1.97,
                z: 1,
                rotY: Math.PI / 2,
                element: assetsLoader.assets.gltf.wallFull!.clone(),
                elementId: ElementIDs.WALL_RSF,
                physicWorld
            },
            {
                y: 1.04,
                x: -1,
                z: -2.035,
                element: assetsLoader.assets.gltf.wallFull!.clone(),
                elementId: ElementIDs.WALL_BL,
                physicWorld
            },
            {
                y: 1.04,
                x: 1.0,
                z: -2.035,
                element: assetsLoader.assets.gltf.wallFull!.clone(),
                elementId: ElementIDs.WALL_BR,
                physicWorld
            },
            {
                scaleX: 2.02,
                scaleZ: 2.05,
                element: assetsLoader.assets.gltf.floorPattern!,
                elementId: ElementIDs.FLOOR_B,
                physicWorld
            },
            {
                scaleX: 2.2,
                scaleZ: 2.2,
                y: 2.08,
                element: assetsLoader.assets.gltf.floorBoard!,
                elementId: ElementIDs.FLOOR_T,
                physicWorld
            },
            {
                x: -1.24,
                y: 2.8,
                rotZ: 0.59,
                elementId: ElementIDs.ROOF_L,
                meshConfig: {
                    geometry: geometry,
                    material: roofMaterials
                },
                physicWorld
            },
            {
                x: 1.24,
                y: 2.8,
                rotZ: -0.59,
                elementId: ElementIDs.ROOF_R,
                meshConfig: {
                    geometry: geometry,
                    material: roofMaterials
                },
                physicWorld
            }
        ]

        const houseElements: HouseElement[] = [];
        for (const conf of configs) {
            const element = new HouseElement(conf);
            element.buildObject();
            parent.addObject(element)

            parent.houseElements.push(element);
            houseElements.push(element);
        }

        return houseElements
    }
}