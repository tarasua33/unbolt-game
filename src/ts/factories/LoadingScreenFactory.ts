import { MeshBasicMaterial, PlaneGeometry, ShaderMaterial } from "three";
import { LoadingScreen, LoadingScreenConfig } from "../objects/screens/LoadingScreen";
import { MainCamera } from "../libs/gameObjects/MainCamera";
import { StandardGroup } from "../libs/gameObjects/StandardGroup";

interface IParamsConfig {
    parent: MainCamera | StandardGroup;
}

export class LoadingScreenFactory {

    public buildUi(params: IParamsConfig): LoadingScreen {
        const { parent } = params;
        const uniformProgress = {value: 0.0};
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `
        const fragmentShader = `
            uniform float progress;
            varying vec2 vUv;
            void main() {
                gl_FragColor = vec4(1.0 - pow(progress, 2.0), 0.0 + pow(progress, 2.0), 0.0, 1.0);
            }
        `

        const progressBarGeometry = new PlaneGeometry(1.2, 0.12);
        progressBarGeometry.translate(1, 0, 0)
        const screenConfig: LoadingScreenConfig = {
            bgConfig: {
                material: new MeshBasicMaterial({
                    color: "#373838",
                    opacity: 1,
                    transparent: true
                }),
                geometry: new PlaneGeometry(10, 10)
            },
            progressBarConfig: {
                material: new ShaderMaterial({
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    uniforms: {progress: uniformProgress}
                }),
                geometry: progressBarGeometry,
                z: 0.01,
                x: -1,
                scaleX: 0
            },
            uniformProgress,
            z: -2.05,
            visible: true
        }

        const screen = new LoadingScreen(screenConfig);
        screen.buildObject();
        parent.addObject(screen)

        return screen
    }
}