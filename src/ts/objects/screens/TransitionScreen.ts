import { IFadeIn } from "../../controllers/steps/transitions/ScreenFadeInStep";
import { IFadeOut } from "../../controllers/steps/transitions/ScreenFadeOutStep";
import { StandardMesh, StandardMeshConfig } from "../../libs/gameObjects/StandardMesh";
import { Signal } from "../../libs/utils/Signal";
import gsap from "gsap";

export interface TransitionScreenConfig extends StandardMeshConfig { }

const SHOW_SCALE = 4;

export class TransitionScreen extends StandardMesh<TransitionScreenConfig> implements IFadeIn, IFadeOut {
    public completeAnimationSignal = new Signal();
    private _isFadeIn = true;

    private _progress = 0

    public hide(): void {
        this._isFadeIn = false;
        this.visible = true;
        this.scale.set(SHOW_SCALE, SHOW_SCALE, SHOW_SCALE);

        this._progress = 0;
        return this._startTweenAnimation();
    }

    public show(): void {
        this._isFadeIn = true;
        this.visible = true;
        this.scale.set(0, 0, 0);

        return this._startTweenAnimation();
    }

    private _startTweenAnimation(): void {
        this._progress = 0;

        gsap.killTweensOf(this);

        gsap.to(this,
            {
                ["progress"]: 1,
                duration: this._isFadeIn ? 0.5 : 0.35,
                ease: this._isFadeIn ? "expo.inOut" : "sine.in",
                overwrite: true,
                onComplete: this._onCompleteAnimation.bind(this)
            });
    }

    private set progress(value: number) {
        this._progress = value;

        if (this._isFadeIn) {
            const calculatedScale = value * SHOW_SCALE;
            this.scale.set(calculatedScale, calculatedScale, calculatedScale);
        }
        else {
            const calculatedScale = SHOW_SCALE - value * SHOW_SCALE;
            this.scale.set(calculatedScale, calculatedScale, calculatedScale);
        }
    }

    private get progress(): number {
        return this._progress;
    }

    private _onCompleteAnimation(): void {
        if (!this._isFadeIn) {
            this.visible = false;
        }
        this.completeAnimationSignal.dispatch();
    }
}