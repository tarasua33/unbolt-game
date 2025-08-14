import { Material } from "three";
import { IFadeIn } from "../../controllers/steps/transitions/ScreenFadeInStep";
import { IFadeOut } from "../../controllers/steps/transitions/ScreenFadeOutStep";
import { StandardGroup, StandardGroupConfig } from "../../libs/gameObjects/StandardGroup";
import { StandardMesh, StandardMeshConfig } from "../../libs/gameObjects/StandardMesh";
import { Signal } from "../../libs/utils/Signal";
import gsap from "gsap";

export interface LoadingScreenConfig extends StandardGroupConfig {
    bgConfig: StandardMeshConfig;
    progressBarConfig: StandardMeshConfig;
    uniformProgress: { value: number }
}

const MAX_ALPHA = 0.5;

export class LoadingScreen extends StandardGroup<LoadingScreenConfig> implements IFadeIn, IFadeOut {
    public completeAnimationSignal = new Signal();
    private _isFadeIn = true;

    private _progress = 0

    private _bg!: StandardMesh;
    private _progressBar!: StandardMesh;
    private _bgMaterial!: Material
    private _uniformProgress!: { value: number };

    public buildObject(): void {
        super.buildObject();

        const { progressBarConfig, bgConfig, uniformProgress  } = this._config;

        this._uniformProgress = uniformProgress;
        this._bgMaterial = bgConfig.material as Material

        const bg = this._bg = new StandardMesh(bgConfig);
        bg.buildObject();
        this.addObject(bg);

        const progressBar = this._progressBar = new StandardMesh(progressBarConfig);
        progressBar.buildObject();
        this.addObject(progressBar);
    }

    public hide(): void {
        this._isFadeIn = false;
        this.visible = true;

        this._progress = 0;
        return this._startTweenAnimation();
    }

    public show(): void {
        this._isFadeIn = true;
        this.visible = true;
        this._bgMaterial.opacity = 0;

        return this._startTweenAnimation();
    }

    private _startTweenAnimation(): void {
        this._progress = 0;

        gsap.killTweensOf(this);

        gsap.to(this,
            {
                ["progress"]: 1,
                duration: 0.5,
                ease: "sine.in",
                overwrite: true,
                onComplete: this._onCompleteAnimation.bind(this)
            });
    }

    private set progress(value: number) {
        this._progress = value;

        const bgMaterial = this._bgMaterial;
        if (this._isFadeIn) {
            const calculatedAlpha = value * MAX_ALPHA;
            bgMaterial.opacity = calculatedAlpha;
        }
        else {
            const calculatedAlpha = MAX_ALPHA - value * MAX_ALPHA;
            bgMaterial.opacity = calculatedAlpha;
        }
    }

    private get progress(): number {
        return this._progress;
    }

    private _onCompleteAnimation(): void {
        this.completeAnimationSignal.dispatch();
    }

    public updateProgress(value: number): void
    {
        this._progressBar.scale.x = value;
        this._uniformProgress.value = Math.max(0.001, Math.min(value, 1.0));
    }
}