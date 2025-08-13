import { IModels } from "../../models/Models";
import { AssetsLoader } from "../utils/AssetsLoader";

export abstract class AbstractBaseFactory {
    protected _assetsLoader: AssetsLoader;
    protected _models: IModels;

    constructor(assetsLoader: AssetsLoader, models: IModels) {
        this._assetsLoader = assetsLoader;
        this._models = models;
    }
}