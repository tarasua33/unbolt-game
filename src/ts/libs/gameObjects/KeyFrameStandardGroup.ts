import { Signal } from '../utils/Signal';
import { StandardGroup, StandardGroupConfig } from './StandardGroup';
import { KeyFrameAnimation, KeyFrameAnimationConfig } from './KeyFrameAnimation';

export interface KeyFrameStandardGroupConfig extends StandardGroupConfig {
    animations: KeyFrameAnimationConfig;
}

export class KeyFrameStandardGroup<T extends KeyFrameStandardGroupConfig = KeyFrameStandardGroupConfig> extends StandardGroup<T> {
    public readonly completeAnimation = new Signal();
    public animator!: KeyFrameAnimation;

    public buildObject(): void {
        super.buildObject();

        const animation = this.animator = new KeyFrameAnimation(this._config.animations, this);
        animation.completeAnimation.add(this._onCompleteAnimation, this)
        animation.createAnimations();
    }

    private _onCompleteAnimation(): void {
        this.completeAnimation.dispatch();
    }

    public reset(): void {
        this.animator.reset();
        super.reset();
    }

    public updateObject(dt: number): void {
        this.animator.updateMixer(dt);
        super.updateObject(dt);
    }
}