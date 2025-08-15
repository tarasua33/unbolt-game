export interface IPoint {
    x: number;
    y: number
}

export function createCircleGraphic(size: number, center: IPoint, radius: number, startAngle: number, endAngle: number, color = "white", fillBg = true, bgColor = "black"): HTMLCanvasElement {
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    if (fillBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
    }

    ctx.fillStyle = color;
    ctx.beginPath()
    ctx.arc(center.x, center.y, radius, startAngle, endAngle);
    ctx.fill();

    return canvas
}