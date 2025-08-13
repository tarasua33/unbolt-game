import { DragDispatcher } from "../utils/DragDispatcher";
import { StandardGroup, StandardGroupConfig } from "./StandardGroup";

export interface DragGroupConfig extends StandardGroupConfig {
    drag: DragDispatcher;
    rotationYSpeed: number;
}

export class DragGroup<T extends DragGroupConfig = DragGroupConfig> extends StandardGroup<T>
{
    private _drag!: DragDispatcher;
    private _rotationYSpeed = 0.01;

    public buildObject(): void {
        super.buildObject();

        const {rotationYSpeed, drag} = this._config

        this._rotationYSpeed = rotationYSpeed;
        
        this._drag = drag;
        drag.dragXSignal.add(this._onDrag.bind(this));
    }

    protected _onDrag(deltaX: number): void
    {
        this.rotation.y += deltaX * this._rotationYSpeed;
    }
}