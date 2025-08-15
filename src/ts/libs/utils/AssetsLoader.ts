import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Signal } from "./Signal";
import { Box3, LoadingManager, Object3D, Texture, TextureLoader, Vector3 } from 'three';
import { ElementTypes } from "../../models/HouseModel";

interface IAssets {
    gltf: Record<ElementTypes, Object3D | undefined>;
    textures: Record<string, Texture>
}

export class AssetsLoader {
    public assetsLoadComplete = new Signal();
    public progressLoadSignal = new Signal();

    public assets: IAssets = {
        gltf: {
            [ElementTypes.WINDOW]: undefined,
            [ElementTypes.DOOR]: undefined,
            [ElementTypes.FL_B]: undefined,
            [ElementTypes.FL_P]: undefined,
            [ElementTypes.WOOL_D]: undefined,
            [ElementTypes.WOOL_F]: undefined,
            [ElementTypes.WOOL_W]: undefined
        },
        textures: {}
    }
    
    private _gltfLoader: GLTFLoader;
    private _textureLoader: TextureLoader;
    private _manager!: LoadingManager;

    constructor() {
        const manager = this._manager = new LoadingManager();
        this._gltfLoader = new GLTFLoader(manager);
        this._textureLoader = new TextureLoader(manager);
    }

    public loadAssets(): void {
        this._manager.onProgress = this._onProgressLoad.bind(this);
        this._manager.onLoad = this._onLoadAsset.bind(this);

        const gltfLoader = this._gltfLoader;
        const textureLoader = this._textureLoader;

        gltfLoader.load("/walls_window_door/scene.gltf",
            this._onHouseElementsLoaded.bind(this)
        )

        textureLoader.load("/tile.jpg", (data: Texture) => {
            this.assets.textures["tile"] = data;
        })

        textureLoader.load("/bolt_body.jpg", (data: Texture) => {
            this.assets.textures["boltBody"] = data;
        });

        textureLoader.load("/bolt_head.jpg", (data: Texture) => {
            this.assets.textures["boltHead"] = data;
        })

        textureLoader.load("/chest.png", (data: Texture) => {
            this.assets.textures["chest"] = data;
        })
    }

    private _onHouseElementsLoaded(gltf: any): void {
        const elements = [
            { type: ElementTypes.WINDOW, idx: 0 },
            { type: ElementTypes.WOOL_F, idx: 1 },
            { type: ElementTypes.WOOL_D, idx: 2 },
            { type: ElementTypes.WOOL_W, idx: 7 },
            { type: ElementTypes.FL_P, idx: 11 },
            { type: ElementTypes.DOOR, idx: 12 },
            { type: ElementTypes.FL_B, idx: 10 },
        ]

        for (const el of elements) {
            const model = gltf.scene.children[0]!.children[0]!.children[0]!.children[el.idx]!;
            this.assets.gltf![el.type] = model;

            const box = new Box3().setFromObject(model);
            const center = new Vector3();
            box.getCenter(center);
            model.position.sub(center);
        }
    }

    private _onLoadAsset(): void
    {
        this.assetsLoadComplete.dispatch();
    }

    private _onProgressLoad(url: string, itemsLoaded: number, itemsTotal: number): void {
        const value = itemsLoaded / itemsTotal;

        this.progressLoadSignal.dispatch(value);
    }
}