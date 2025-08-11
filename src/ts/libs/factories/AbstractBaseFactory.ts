import { AssetsLoader } from "../utils/AssetsLoader";

export abstract class AbstractBaseFactory
{
    protected _assetsLoader: AssetsLoader;

    constructor(assetsLoader: AssetsLoader)
    {
        this._assetsLoader = assetsLoader;
    }
}