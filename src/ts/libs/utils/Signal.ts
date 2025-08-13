import MiniSignal from 'mini-signals';

export class Signal<T extends any[]> {
    private _signal = new MiniSignal();
    private _bindings = new Map<T, any>();
    private _bindingsOnce = new Map<T, any>();

    public add(listener: any): void {
        const binding = this._signal.add(listener);
        this._bindings.set(listener, binding);
    }

    public addOnce(listener: any): void {
        const binding = this._signal.add(listener);
        this._bindings.set(listener, binding);
    }

    public remove(listener: any): void {
        const bind = this._bindings.get(listener)

        if (bind) {
            bind.detach();
            this._bindings.delete(listener);
        }

        this._removeOnce(listener);
    }

    private _removeOnce(listener: any): void {
        const bindOnce = this._bindingsOnce.get(listener)
        if (bindOnce) {
            bindOnce.detach();
            this._bindingsOnce.delete(listener);
        }
    }

    public removeAll(): void {
        this._signal.detachAll();
        this._bindingsOnce.clear();
        this._bindings.clear();
    }

    private _removeAllOnce(): void {
        const bindingsOnce = this._bindingsOnce;
        const listeners = bindingsOnce.keys();

        for (const lst of listeners) {
            const bind = bindingsOnce.get(lst);

            if (bind) {
                bind.detach();
                bindingsOnce.delete(lst);
            }
        }
    }

    public dispatch(...args: T): void {
        this._signal.dispatch(...args);
        this._removeAllOnce();
    }
}