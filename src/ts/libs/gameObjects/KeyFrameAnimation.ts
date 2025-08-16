import { AnimationAction, AnimationClip, AnimationMixer, KeyframeTrack, LoopOnce, NumberKeyframeTrack, Object3D, VectorKeyframeTrack } from 'three';
import { Signal } from '../utils/Signal';

export interface IAnimationStep {
    duration: number,
    values: number[] | number;
}

export interface ITrackConfig {
    propertyKey: string;
    startConfig?: IAnimationStep;
    steps: IAnimationStep[];
}

export type IAnimationConfig = ITrackConfig[];

export const MAP_PROPERTIES = new Map<string, new (...args: any[]) => KeyframeTrack>(
    [
        [".material.opacity", NumberKeyframeTrack],
        [".scale", VectorKeyframeTrack],
        [".position", VectorKeyframeTrack],
    ]
);

export type KeyFrameAnimationConfig = Map<string, IAnimationConfig>

export class KeyFrameAnimation
{
    public readonly completeAnimation = new Signal();
    private _config: KeyFrameAnimationConfig
    protected _animations!: Map<string, AnimationAction>;
    private _currentAction: AnimationAction | undefined;
    private _mixer: AnimationMixer;
    private _bindComplete!: () => any;

    constructor(config: KeyFrameAnimationConfig, ctx: Object3D) {
        this._config = config;
        this._mixer = new AnimationMixer(ctx);
        this._bindComplete = this._onCompleteAnimation.bind(this);
    }

    public createAnimations(): void {
        const animationsConfigs = this._config;
        const animations = this._animations = new Map<string, AnimationAction>();
        const mixer = this._mixer;

        for (const [key, value] of animationsConfigs.entries()) {
            const clip = this._createClip(value, key);
            const animation = mixer.clipAction(clip);
            animations.set(key, animation);
        }
    }

    private _createClip(tracksConfig: IAnimationConfig, key: string): AnimationClip {
        const tracks = []

        for (const track of tracksConfig) {
            tracks.push(this._createTrack(track))
        }

        const clip = new AnimationClip(key, -1, tracks);

        return clip
    }

    private _createTrack(config: ITrackConfig): KeyframeTrack {
        const { propertyKey, steps } = config;

        const times: number[] = [];
        let valuesCombined: number[] = []

        let totalDuration = 0;

        for (const { duration, values } of steps) {
            totalDuration += duration;

            times.push(totalDuration);

            if (typeof values === "number") {
                valuesCombined.push(values);
            }
            else {
                valuesCombined = values.concat(values as Array<number>)
            }
        }

        const Track = MAP_PROPERTIES.get(propertyKey)!;

        const track = new Track(propertyKey, times, valuesCombined);

        return track
    }

    public playAnimation(name: string): void {
        if (this._currentAction) {
            this._currentAction.stop();
        }

        this._mixer.addEventListener('finished', this._bindComplete);
        const action = this._currentAction = this._animations.get(name)!;
        action.reset();
        action.clampWhenFinished = true;
        action.setLoop(LoopOnce, 0)
        action.play();
    }

    private _onCompleteAnimation(): void {
        this._mixer.removeEventListener("finished", this._bindComplete);

        this.completeAnimation.dispatch();
    }

    public reset(): void {
        if (this._currentAction) {
            this._currentAction.stop();
            this._currentAction.reset();
        }
        this._mixer.removeEventListener("finished", this._bindComplete);
    }

    public updateMixer(dt: number): void {
        if (this._mixer) {
            this._mixer.update(dt)
        }
    }
}