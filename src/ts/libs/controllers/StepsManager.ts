import { BaseStep, BaseStepParams } from "./BaseStep"
import { Signal } from "../utils/Signal";
import { ISequence, IStepAndParams } from "./Sequence";

export class StepsManager {
    public completeSteps = new Signal();

    private _sequences?: ISequence[];

    private _consequentsSteps: IStepAndParams[] = [];
    private _permanentsSteps: IStepAndParams[] = [];
    private _dynamicSteps = new Set<BaseStep>();

    private _numPermanentsSteps = 0;
    private _numConsequentsSteps = 0;

    private _isForceComplete = false;

    public start(sequences: ISequence[]): void {
        this._isForceComplete = false;
        this._dynamicSteps.clear();
        this._sequences = sequences;

        this._playNextSequence();
    }

    public addDynamicStep<S extends BaseStep<P>, P extends BaseStepParams>(step: S, params: P): void {
        this._dynamicSteps.add(step);

        step.completeStepSignal.addOnce(this._onCompleteDynamicStep, this);
        step.start(params);
    }

    private _onCompleteDynamicStep(step: BaseStep): void {
        if (this._dynamicSteps.has(step)) {
            this._dynamicSteps.delete(step);
        }
    }

    private _playNextSequence(): void {
        const sequences = this._sequences;

        if (sequences && sequences.length > 0) {
            const sequence = this._sequences!.shift()!;
            this._setUpSequence(sequence);
        }
        else {
            this._onComplete();
        }
    }

    private _setUpSequence(sequence: ISequence): void {
        this._numPermanentsSteps = 0;
        this._consequentsSteps = sequence.consequents;
        this._permanentsSteps = sequence.permanents;
        this._numConsequentsSteps = sequence.consequents.length;

        if (sequence.permanents.length > 0) {
            this._setUpPermanentsSteps(sequence.permanents);
        }

        this._playNextConsequentStep();
    }

    private _setUpPermanentsSteps(permanents: IStepAndParams[]): void {
        for (let i = 0; i < permanents.length; i++) {
            this._numPermanentsSteps++;

            const step = permanents[i]!.step;
            const params = permanents[i]!.params;
            step.completeStepSignal.addOnce(this._onPermanentStepComplete, this);
            step.start(params);
        }
    }

    private _onPermanentStepComplete(): void {
        this._numPermanentsSteps--;

        if (this._numPermanentsSteps === 0) {
            this._tryCompleteSequence();
        }
    }

    private _playNextConsequentStep(): void {
        const consequentsSteps = this._consequentsSteps;

        if (this._numConsequentsSteps > 0) {
            const stepIndex = consequentsSteps.length - this._numConsequentsSteps;
            const step = consequentsSteps[stepIndex]!.step;
            const params = consequentsSteps[stepIndex]!.params;

            console.log(step);

            step.completeStepSignal.addOnce(this._onConsequentStepComplete, this);
            step.start(params);
        }
        else {
            this._tryCompleteSequence();
        }
    }

    private _onConsequentStepComplete(): void {
        if (!this._isForceComplete) {
            this._numConsequentsSteps--;

            this._playNextConsequentStep();
        }
    }

    private _tryCompleteSequence(): void {
        if (!this._isForceComplete) {
            if (this._numPermanentsSteps === 0 && this._numConsequentsSteps === 0) {
                this._playNextSequence();
            }
        }
    }

    private _onComplete(): void {
        this._sequences = [];
        this._consequentsSteps = [];
        this._permanentsSteps = [];

        for (const step of this._dynamicSteps) {
            step.forceComplete();
        }
        this._dynamicSteps.clear();
        
        this.completeSteps.dispatch();
    }

    public forceComplete(): void {
        this._isForceComplete = true;

        for (const step of this._consequentsSteps) {
            step.step.forceComplete();
        }

        for (const step of this._permanentsSteps) {
            step.step.forceComplete();
        }

        this._onComplete();
    }
}