import { useTask, type ThrelteContext, type Size } from "@threlte/core";
import { BlendFunction, BloomEffect, EffectComposer, EffectPass, KernelSize, RenderPass } from 'postprocessing';
import { PerspectiveCamera, type Camera } from "three";
import { Postprocessing } from "../constants/PostprocessingConstants";

export class PostprocessingManager {
    public tc: ThrelteContext;
    public effectComposer: EffectComposer;
    public isBloomEnabled: boolean = false;

    constructor(tc: ThrelteContext) {
        this.tc = tc;
        this.setup();
    }

    public setup(): void {
        this.effectComposer = new EffectComposer(this.tc.renderer);
        this.renderEffectComposer();
    }

    public renderEffectComposer(): void {
        // useTask(
        //     (delta: number) => {
        //         this.effectComposer.render(delta);
        //     },
        //     {
        //         stage: this.tc.renderStage,
        //         autoInvalidate: false
        //     }
        // );
        this.effectComposer.render();
        requestAnimationFrame(this.renderEffectComposer.bind(this));
    }

    public updateRenderPass(camera: Camera, size: Size): void {
        this.updateEffects(camera);
        this.updateComposerSize(size);
    }

    public updateEffects(camera: Camera): void {
        let renderPass: RenderPass = new RenderPass(this.tc.scene, camera);
        this.effectComposer.removeAllPasses();
        this.effectComposer.setSize(window.innerWidth, window.innerHeight);
        this.effectComposer.addPass(renderPass);
        if (this.isBloomEnabled) {
            const bloomEffect: BloomEffect = new BloomEffect({
                blendFunction: BlendFunction.SCREEN,
                luminanceThreshold: Postprocessing.BLOOM_LUMINANCE_THRESHOLD,
                luminanceSmoothing: Postprocessing.BLOOM_LUMINANCE_SMOOTHING,
                intensity: Postprocessing.BLOOM_INTENSITY,
                kernelSize: KernelSize.SMALL,
            });
            let bloomEffectPass: EffectPass = new EffectPass(camera, bloomEffect);
            bloomEffectPass.renderToScreen = true;
            this.effectComposer.addPass(bloomEffectPass);
        }
    }

    public updateComposerSize(size: Size): void {
        this.effectComposer.setSize(size.width, size.height);
    }
}