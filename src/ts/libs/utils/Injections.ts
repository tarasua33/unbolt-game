import { StandardGroup } from "../gameObjects/StandardGroup";
import { StandardMesh } from "../gameObjects/StandardMesh";

export function injector(cls: new (...args: any[]) => any, fnc: Function): void {
    cls.prototype[fnc.name] = fnc;
}


/* eslint-disable */
function _setBaseConfig(ctx: any): void {
    const config = ctx._config;
    const { x, y, z, rotX, rotY, rotZ, scaleX, scaleY, scaleZ, visible } = config;

    if (typeof x === "number") ctx.position.x = x;
    if (typeof y === "number") ctx.position.y = y;
    if (typeof z === "number") ctx.position.z = z;

    ctx.rotation.set(0, 0, 0);
    ctx.quaternion.set(0, 0, 0, 1);
    if (typeof rotX === "number") ctx.rotation.x = rotX;
    if (typeof rotY === "number") ctx.rotation.y = rotY;
    if (typeof rotZ === "number") ctx.rotation.z = rotZ;

    if (typeof scaleX === "number") ctx.scale.x = scaleX;
    if (typeof scaleY === "number") ctx.scale.y = scaleY;
    if (typeof scaleZ === "number") ctx.scale.z = scaleZ;

    if (typeof visible === "boolean") ctx.visible = visible;
}
/* eslint-enable */

export function injectAll(): any {
    injector(StandardGroup, _setBaseConfig);
    injector(StandardMesh, _setBaseConfig);
}