import MiniSignal from 'mini-signals';

export class Signal<T extends any[]> {
    private _signal = new MiniSignal();
    private _bindings = new Map<T, any>();

    public add(listener: any) {
        const binding = this._signal.add(listener);
        this._bindings.set(listener, binding);
    }

    //     public addOnce(listener: any) {
    //     const binding = this._signal.addOnce(listener);
    //     this._bindings.set(listener, binding);
    // }

    public remove(listener: any) {
        const bind = this._bindings.get(listener)

        if (bind) {
            this._bindings.get(listener)?.detach();
            this._bindings.delete(listener);
        }
    }

    public removeAll() {
        this._signal.detachAll()
    }

    public dispatch(...args: T) {
        this._signal.dispatch(...args);
    }
}