interface IPoint {
    x: number;
    y: number
}

export function createCircleGraphic(size: number, center: IPoint, radius: number, startAngle: number, endAngle: number): HTMLCanvasElement
{
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "white";
    ctx.beginPath()
    ctx.arc(center.x, center.y, radius, startAngle, endAngle);
    ctx.fill();

    return canvas
}