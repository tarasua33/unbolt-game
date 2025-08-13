import MiniSignal from 'mini-signals';

export class Signal {
    private _signal = new MiniSignal();
    private _bindings = new Map<Function, any>();
    private _bindingsOnce = new Map<Function, any>();

    public add(listener: Function, context: Object): void {
        const bind = listener.bind(context);

        const binding = this._signal.add(bind);
        this._bindings.set(bind, binding);
    }

    public addOnce(listener: Function, context: Object): void {
        const bind = listener.bind(context);
        
        const binding = this._signal.add(bind);
        this._bindings.set(bind, binding);
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

    public dispatch(...args: any[]): void {
        this._signal.dispatch(...args);
        this._removeAllOnce();
    }
}