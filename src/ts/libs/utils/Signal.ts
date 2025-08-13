import { Signal as BaseSignal } from 'signals';

export class Signal {
        private _signal = new BaseSignal();

    public add(listener: (...args: any[]) => void, listenerContext?: any): void {
        this._signal.add(listener, listenerContext);
    }

    public addOnce(listener: (...args: any[]) => void, listenerContext?: any): void {
        this._signal.addOnce(listener, listenerContext);
    }

    public remove(listener: (...args: any[]) => void): void {
        this._signal.remove(listener);
    }

    public removeAll(): void {
        this._signal.removeAll();
    }

    public dispatch(...args: any[]): void {
        this._signal.dispatch(...args);
    }
}