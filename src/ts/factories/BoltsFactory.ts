import { CylinderGeometry, MeshPhongMaterial } from "three";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { IGameGroup } from "../libs/gameObjects/IGameGroup";
import { ElementIDs } from "../models/HouseModel";
import { Bolt, BoltConfig } from "../objects/Bolt";
import { COLORS } from "../models/BoltsModel";

interface IParamsConfig {
    parent: IGameGroup;
}

export class BoltsFactory extends AbstractStandardFactory<Bolt[]> {

    public buildUi(params: IParamsConfig): Bolt[] {
        const { parent } = params;
        const assetsLoader = this._assetsLoader;

        const bodyGeometry = new CylinderGeometry(0.2, 0.1, 0.4, 16);
        const greenBodyMaterial = new MeshPhongMaterial({
            color: COLORS.green,
            map: assetsLoader.assets.textures.boltBody!
        })

        const boltHead = assetsLoader.assets.textures.boltHead!
        const headGeometry = new CylinderGeometry(0.25, 0.35, 0.25, 16);
        const greenHeadMaterials = [
            new MeshPhongMaterial({
                color: COLORS.green,
            }),
            new MeshPhongMaterial({
                color: COLORS.green,
                map: boltHead,
            }),
            new MeshPhongMaterial({
                color: COLORS.green,
            }),
        ];

        const redBodyMaterial = greenBodyMaterial.clone();
        redBodyMaterial.color.set(COLORS.red);
        const redHeadMaterials = [
            new MeshPhongMaterial({
                color: COLORS.red,
            }),
            new MeshPhongMaterial({
                color: COLORS.red,
                map: boltHead,
            }),
            new MeshPhongMaterial({
                color: COLORS.red,
            }),
        ];

        const yellowBodyMaterial = greenBodyMaterial.clone();
        yellowBodyMaterial.color.set(COLORS.yellow);
        const yellowHeadMaterials = [
            new MeshPhongMaterial({
                color: COLORS.yellow,
            }),
            new MeshPhongMaterial({
                color: COLORS.yellow,
                map: boltHead,
            }),
            new MeshPhongMaterial({
                color: COLORS.yellow,
            }),
        ];

        const blueBodyMaterial = greenBodyMaterial.clone();
        blueBodyMaterial.color.set(COLORS.blue);
        const blueHeadMaterials = [
            new MeshPhongMaterial({
                color: COLORS.blue,
            }),
            new MeshPhongMaterial({
                color: COLORS.blue,
                map: boltHead,
            }),
            new MeshPhongMaterial({
                color: COLORS.blue,
            }),
        ];

        const greyBodyMaterial = greenBodyMaterial.clone();
        greyBodyMaterial.color.set(COLORS.grey);
        const greyHeadMaterials = [
            new MeshPhongMaterial({
                color: COLORS.grey,
            }),
            new MeshPhongMaterial({
                color: COLORS.grey,
                map: boltHead,
            }),
            new MeshPhongMaterial({
                color: COLORS.grey,
            }),
        ];

        const bodyMaterialsMap = new Map([
            [COLORS.green, greenBodyMaterial],
            [COLORS.red, redBodyMaterial],
            [COLORS.blue, blueBodyMaterial],
            [COLORS.yellow, yellowBodyMaterial],
            [COLORS.grey, greyBodyMaterial],
        ])

        const headMaterialsMap = new Map([
            [COLORS.green, greenHeadMaterials],
            [COLORS.red, redHeadMaterials],
            [COLORS.blue, blueHeadMaterials],
            [COLORS.yellow, yellowHeadMaterials],
            [COLORS.grey, greyHeadMaterials],
        ])

        const setUpPositionsConfigs = [
            // FLOOR_B
            {
                boltedElementId: ElementIDs.FLOOR_B,
                preventerElementId: ElementIDs.WALL_RSBW,
                x: 1.89,
                y: 0.05,
                z: -1.025,
                rotZ: 0,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.FLOOR_B,
                preventerElementId: ElementIDs.WALL_LSFW,
                x: -1.9,
                y: 0.05,
                z: 0.885,
                rotZ: 0,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.FLOOR_B,
                x: -1,
                y: 0.05,
                z: -1.50,
                rotZ: 0,
                rotX: 0,
                rotY: 0
            },

            //WALLS
            {
                boltedElementId: ElementIDs.WALL_FD,
                x: -1,
                y: 1.80,
                z: 2.08,
                rotZ: 0,
                rotX: Math.PI / 2,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_FD,
                x: -0.5,
                y: 1.05,
                z: 2.08,
                rotZ: 0,
                rotX: Math.PI / 2,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_FW,
                x: 1.5,
                y: 0.55,
                z: 2.08,
                rotZ: 0,
                rotX: Math.PI / 2,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_FW,
                x: 0.25,
                y: 1.35,
                z: 2.08,
                rotZ: 0,
                rotX: Math.PI / 2,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_LSFW,
                x: -2.02,
                y: 0.25,
                z: 1.8,
                rotZ: Math.PI / 2,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_LSFW,
                x: -2.02,
                y: 1.85,
                z: 0.15,
                rotZ: Math.PI / 2,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_LSB,
                x: -2.02,
                y: 0.55,
                z: -0.75,
                rotZ: Math.PI / 2,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_LSB,
                x: -2.02,
                y: 1.05,
                z: -1.65,
                rotZ: Math.PI / 2,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_RSF,
                x: 2.02,
                y: 1.15,
                z: 1.9,
                rotZ: - Math.PI / 2,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_RSF,
                x: 2.02,
                y: 1.85,
                z: 0.25,
                rotZ: - Math.PI / 2,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_RSBW,
                x: 2.02,
                y: 1.05,
                z: -0.15,
                rotZ: - Math.PI / 2,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_RSBW,
                x: 2.02,
                y: 1.55,
                z: -1.8,
                rotZ: - Math.PI / 2,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_BL,
                x: -1.09,
                y: 1.65,
                z: -2.08,
                rotZ: 0,
                rotX: - Math.PI / 2,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_BL,
                x: -0.65,
                y: 0.35,
                z: -2.08,
                rotZ: 0,
                rotX: - Math.PI / 2,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_BR,
                x: 0.85,
                y: 0.45,
                z: -2.08,
                rotZ: 0,
                rotX: - Math.PI / 2,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WALL_BR,
                x: 1.75,
                y: 1.45,
                z: -2.08,
                rotZ: 0,
                rotX: - Math.PI / 2,
                rotY: 0
            },
            // WINDOW DOOR
            {
                boltedElementId: ElementIDs.DOOR,
                x: -1,
                y: 1,
                z: 2.15,
                rotX: Math.PI / 2,
                rotZ: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WINDOW_F,
                x: 1.05,
                y: 1.35,
                z: 2.15,
                rotX: Math.PI / 2,
                rotZ: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WINDOW_R,
                x: 2.1,
                y: 1.4,
                z: -1.1,
                rotZ: - Math.PI / 2,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.WINDOW_L,
                x: -2.1,
                y: 1.3,
                z: 1,
                rotZ: Math.PI / 2,
                rotX: 0,
                rotY: 0
            },
            //FLOOR_TOP
            {
                boltedElementId: ElementIDs.FLOOR_T,
                preventerElementId: ElementIDs.ROOF_R,
                x: 2.1,
                y: 2.12,
                z: -0.8,
                rotZ: 0,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.FLOOR_T,
                preventerElementId: ElementIDs.ROOF_L,
                x: -2.1,
                y: 2.12,
                z: 1.25,
                rotZ: 0,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.FLOOR_T,
                x: 1,
                y: 2.12,
                z: 1.50,
                rotZ: 0,
                rotX: 0,
                rotY: 0
            },
            // ROOF
            {
                boltedElementId: ElementIDs.ROOF_R,
                x: 0.73,
                y: 3.19,
                z: 0,
                rotZ: -0.62,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.ROOF_R,
                x: 0.73,
                y: 3.19,
                z: 1.5,
                rotZ: -0.62,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.ROOF_L,
                x: -1.6,
                y: 2.62,
                z: -1.4,
                rotZ: 0.62,
                rotX: 0,
                rotY: 0
            },
            {
                boltedElementId: ElementIDs.ROOF_L,
                x: -0.5,
                y: 3.355,
                z: 1.02,
                rotZ: 0.62,
                rotX: 0,
                rotY: 0
            },
        ];


        const configs: BoltConfig[] = [];
        const boltColorsAmount = this._models.boltsModel.boltsColorsAmount;
        for (const pos of setUpPositionsConfigs) {
            const colorIndex = Math.floor(Math.random() * boltColorsAmount.length);
            const color = boltColorsAmount.splice(colorIndex, 1)[0]!;

            configs.push({
                boltedElementId: pos.boltedElementId,
                x: pos.x,
                y: pos.y,
                z: pos.z,
                rotX: pos.rotX,
                rotY: pos.rotY,
                rotZ: pos.rotZ,

                scaleX: 0.35,
                scaleZ: 0.35,
                scaleY: 0.35,
                bodyConfig: {
                    y: -0.2,
                    geometry: bodyGeometry,
                    material: bodyMaterialsMap.get(color)!
                },
                headConfig: {
                    y: 0.1,
                    geometry: headGeometry,
                    material: headMaterialsMap.get(color)!
                },
                preventerElementId: pos.preventerElementId!
                // gui: pos.gui!
            })
        }

        const bolts: Bolt[] = [];
        for (const conf of configs) {
            const element = new Bolt(conf);
            element.buildObject();
            parent.addObject(element)

            bolts.push(element);
        }

        return bolts
    }
}