import { BaseStep, BaseStepParams } from "./BaseStep";

export interface IStepAndParams {
    step: BaseStep;
    params: BaseStepParams;
}

export interface ISequence {
    permanents: IStepAndParams[];
    consequents: IStepAndParams[];
}

export class Sequence {
    public permanents: IStepAndParams[] = [];
    public consequents: IStepAndParams[] = [];

    public addPermanent<S extends BaseStep<P>, P extends BaseStepParams>(step: S, params: P): void {
        this.permanents.push({ step, params });
    }

    public addConsequents<S extends BaseStep<P>, P extends BaseStepParams>(step: S, params: P): void {
        this.consequents.push({ step, params });
    }
}