import { Camera, CanvasTexture, MeshBasicMaterial, PlaneGeometry } from "three";
import { AbstractStandardFactory } from "../libs/factories/AbstractStandardFactory";
import { TransitionScreen, TransitionScreenConfig } from "../objects/screens/TransitionScreen";
import { createCircleGraphic } from "../libs/utils/GameHelpers";

interface IParamsConfig {
    parent: Camera;
}

export class TransitionScreenFactory extends AbstractStandardFactory<TransitionScreen> {

    public buildUi(params: IParamsConfig): TransitionScreen {
        const { parent } = params;

        const canvasSize = 265;
        const transitionScreenConfig: TransitionScreenConfig = {
            material: new MeshBasicMaterial({
                color: "#07917f",
                alphaMap: new CanvasTexture(createCircleGraphic(
                    canvasSize,
                    {x: canvasSize / 2, y: canvasSize / 2},
                    canvasSize / 2,
                    0,
                    Math.PI * 2
                )),
                transparent: true
            }),
            geometry: new PlaneGeometry(3, 3,),
            z: -2
        }

        const screen = new TransitionScreen(transitionScreenConfig);
        screen.buildObject();
        parent.add(screen)

        return screen
    }
}