import { AnimationAction, AnimationClip, AnimationMixer, KeyframeTrack, LoopOnce, NumberKeyframeTrack, VectorKeyframeTrack } from 'three';
import { StandardMesh, StandardMeshConfig } from './StandardMesh';
import { Signal } from '../utils/Signal';

interface IAnimationStep {
    duration: number,
    valuesProperty: number[] | number;
}

interface ITrackConfig {
    propertyKey: string;
    startConfig?: IAnimationStep;
    steps: IAnimationStep[];
}

export type IAnimationConfig = ITrackConfig[]

const MAP_PROPERTIES = new Map<string, new (...args: any[]) => KeyframeTrack>(
    [
        [".material.opacity", NumberKeyframeTrack],
        [".scale", VectorKeyframeTrack],
        [".position", VectorKeyframeTrack],
    ]
);

export interface KeyFrameStandardMeshConfig extends StandardMeshConfig {
    animations: Map<string, IAnimationConfig>
}

export class KeyFrameStandardMesh<T extends KeyFrameStandardMeshConfig = KeyFrameStandardMeshConfig> extends StandardMesh<KeyFrameStandardMeshConfig> {
    public readonly completeAnimation = new Signal();

    protected _animations!: Map<string, AnimationAction>;
    private _currentAction: AnimationAction | undefined;
    private _mixer: AnimationMixer;

    constructor(config: T) {
        super(config);

        this._mixer = new AnimationMixer(this);
    }

    private _createAnimations(): void {
        const animationsConfigs = this._config.animations;
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
        let values: number[] = []

        let totalDuration = 0;

        for (const { duration, valuesProperty } of steps) {
            totalDuration+=duration;

            times.push(totalDuration);

            if (typeof valuesProperty === "number") {
                values.push(valuesProperty);
            }
            else {
                values = values.concat(valuesProperty as Array<number>)
            }
        }

        const Track = MAP_PROPERTIES.get(propertyKey)!;

        const track = new Track(propertyKey, times, values);

        return track
    }

    public buildObject(): void {
        super.buildObject();

        this._createAnimations();
    }

    public playAnimation(name: string): void
    {
        this._mixer.addEventListener('finished', this._onCompleteAnimation.bind(this));
        const action = this._currentAction = this._animations.get(name)!;
        action.clampWhenFinished = true;
        action.setLoop(LoopOnce, 0)
        action.play();
    }

    private _onCompleteAnimation(): void
    {
        this._currentAction = undefined;

        this.completeAnimation.dispatch();
    }

    public reset(): void {
        if (this._currentAction)
        {
            this._currentAction.stop();
        }

        super.reset();
    }

    // /* eslint-disable */
    public updateObject(dt: number): void {
        if (this._mixer)
        {
            this._mixer.update(dt)
        }

        super.updateObject(dt);
    }
    // /* eslint-enable */
}