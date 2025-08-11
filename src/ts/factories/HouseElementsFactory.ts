import { BoxGeometry, MeshStandardMaterial, RepeatWrapping } from "three";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { ElementIDs } from "../models/HouseModel";
import { HouseElement, HouseElementConfig } from "../objects/HouseElement";
// import * as dat from "lil-gui";

interface IParamsConfig {
    parent: IGameGroup;
}

export class HouseElementsFactory extends AbstractStandardFactory<HouseElement[]> {

    public buildUi(params: IParamsConfig): HouseElement[] {
        const { parent } = params;
        const assetsLoader = this._assetsLoader;

        // const gui = new dat.GUI();

        const roofTile = this._assetsLoader.assets.textures.tile!;
        roofTile.rotation = Math.PI / 2;
        roofTile.wrapS = RepeatWrapping;
        roofTile.wrapT = RepeatWrapping;

        // Кількість повторів (по X і Y)
        roofTile.repeat.set(8, 8);

        const geometry = new BoxGeometry(3, 0.05, 5);
        const roofMaterials: MeshStandardMaterial[] = [
            new MeshStandardMaterial({ color: "#a64319" }),
            new MeshStandardMaterial({ color: "#a64319" }),
            new MeshStandardMaterial({ map: roofTile}),
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
                // gui
            },
            {
                z: 2.05,
                x: 1,
                y: 1.395,
                rotZ: Math.PI / 2,
                scaleX: 1.19,
                scaleY: 1.39,
                element: assetsLoader.assets.gltf.window!,
                elementId: ElementIDs.WINDOW_F,
                // gui
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
                // gui
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
                // gui
            },
            {
                y: 1.04,
                x: -1,
                z: 2.035,
                element: assetsLoader.assets.gltf.wallDoor!,
                elementId: ElementIDs.WALL_FD,
                // gui
            },
            {
                y: 1.04,
                x: 1.0,
                z: 2.035,
                element: assetsLoader.assets.gltf.wallWindow!,
                elementId: ElementIDs.WALL_FW,
                // gui
            },
            {
                y: 1.04,
                x: -1.97,
                z: 1,
                rotY: Math.PI / 2,
                element: assetsLoader.assets.gltf.wallWindow!.clone(),
                elementId: ElementIDs.WALL_LSFW,
                // gui
            },
            {
                y: 1.04,
                x: -1.97,
                z: -1,
                rotY: Math.PI / 2,
                element: assetsLoader.assets.gltf.wallFull!,
                elementId: ElementIDs.WALL_LSB,
                // gui
            },
            {
                y: 1.04,
                x: 1.97,
                z: -1,
                rotY: Math.PI / 2,
                element: assetsLoader.assets.gltf.wallWindow!.clone(),
                elementId: ElementIDs.WALL_RSBW,
                // gui
            },
            {
                y: 1.04,
                x: 1.97,
                z: 1,
                rotY: Math.PI / 2,
                element: assetsLoader.assets.gltf.wallFull!.clone(),
                elementId: ElementIDs.WALL_RSF,
                // gui
            },
            {
                y: 1.04,
                x: -1,
                z: -2.035,
                element: assetsLoader.assets.gltf.wallFull!.clone(),
                elementId: ElementIDs.WALL_BL,
                // gui
            },
            {
                y: 1.04,
                x: 1.0,
                z: -2.035,
                element: assetsLoader.assets.gltf.wallFull!.clone(),
                elementId: ElementIDs.WALL_BR,
                // gui
            },
            {
                scaleX: 2.2,
                scaleZ: 2.2,
                y: 2.08,
                // visible: false,
                element: assetsLoader.assets.gltf.floorBoard!,
                elementId: ElementIDs.FLOOR_T,
                // gui
            },
            {
                scaleX: 2.02,
                scaleZ: 2.05,
                element: assetsLoader.assets.gltf.floorPattern!,
                elementId: ElementIDs.FLOOR_B,
                // gui
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
                // gui
            },
                        {
                x: 1.24,
                y: 2.8,
                rotZ: -0.59,
                elementId: ElementIDs.ROOF_L,
                meshConfig: {
                    geometry: geometry,
                    material: roofMaterials
                },
                // gui
            }
        ]

        const houseElements: HouseElement[] = [];
        for (const conf of configs) {
            const element = new HouseElement(conf);
            element.buildObject();
            parent.addObject(element)

            houseElements.push(element);
        }

        return houseElements
    }
}