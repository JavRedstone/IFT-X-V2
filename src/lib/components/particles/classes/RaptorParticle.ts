import System, { SpriteRenderer } from 'three-nebula';
import * as THREE from 'three';
import { Vector3, Euler, Quaternion } from 'three';
import { type ThrelteContext } from '@threlte/core';
import { ParticleConstants } from '../../constants/ParticleConstants';

export class RaptorParticle {
    public static readonly PARTICLE_SYSTEM: any = {
        "preParticles": 500,
        "integrationType": "EULER",
        "emitters": [
            {
                "id": "3ef1b620-0995-11ef-883f-6fa390d4b039",
                "totalEmitTimes": null,
                "life": null,
                "cache": {
                    "totalEmitTimes": 0,
                    "life": 0
                },
                "rate": {
                    "particlesMin": 1,
                    "particlesMax": 1,
                    "perSecondMin": 0.025,
                    "perSecondMax": 0.1
                },
                "position": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
                "rotation": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
                "initializers": [
                    {
                        "id": "3ef1b621-0995-11ef-883f-6fa390d4b039",
                        "type": "Mass",
                        "properties": {
                            "min": 20,
                            "max": 30,
                            "isEnabled": true,
                            "center": false
                        }
                    },
                    {
                        "id": "3ef1b622-0995-11ef-883f-6fa390d4b039",
                        "type": "Life",
                        "properties": {
                            "min": 1,
                            "max": 2,
                            "isEnabled": true,
                            "center": false
                        }
                    },
                    {
                        "id": "3ef1dd30-0995-11ef-883f-6fa390d4b039",
                        "type": "BodySprite",
                        "properties": {
                            "texture": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJkSURBVHjaxJeJbusgEEW94S1L//83X18M2MSuLd2pbqc4wZGqRLrKBsyZhQHny7Jk73xVL8xpVhWrcmiB5lX+6GJ5YgQ2owbAm8oIwH1VgKZUmGcRqKGGPgtEQQAzGR8hQ59fAmhJHSAagigJ4E7GPWRXOYC6owAd1JM6wDQPADyMWUqZRMqmAojHp1Vn6EQQEgUNMJLnUjMyJsM49wygBkAPw9dVFwXRkncCIIW3GRgoTQUZn6HxCMAFEFd8TwEQ78X4rHbILoAUmeT+RFG4UhQ6MiIAE4W/UsYFjuVjAIa2nIY4q1R0GFtQWG3E84lqw2GO2QOoCKBVu0BAPgDSU0eUDjjQenNkV/AW/pWChhpMTelo1a64AOKM30vk18GzTHXCNtI/Knz3DFBgsUqBGIjTInXRY1yA9xkVoqW5tVq3pDR9A0hfF5BSARmVnh7RMDCaIdcNgbPBkgzn1Bu+SfIEFSpSBmkxyrMicb0fAEuCZrWnN89veA/4XcakrPcjBWzkTuLjlbfTQPOlBhz+HwkqqPXmPQDdrQItxE1moGof1S74j/8txk8EHhTQrAE8qlwfqS5yukm1x/rAJ9Jiaa6nyATqD78aUVBhFo8b1V4DdTXdCW+IxA1zB4JhiOhZMEWO1HqnvdoHZ4FAMIhV9REF8FiUm0jsYPEJx/Fm/N8OhH90HI9YRHesWbXXZwAShU8qThe7H8YAuJmw5yOd989uRINKRTJAhoF8jbqrHKfeCYdIISZfSq26bk/K+yO3YvfKrVgiwQBHnwt8ynPB25+M8hceTt/ybPhnryJ78+tLgAEAuCFyiQgQB30AAAAASUVORK5CYII=",
                            "isEnabled": true
                        }
                    },
                    {
                        "id": "3ef1dd31-0995-11ef-883f-6fa390d4b039",
                        "type": "Radius",
                        "properties": {
                            "width": 0.000075,
                            "height": 0.000075,
                            "isEnabled": true,
                            "center": false
                        }
                    },
                    {
                        "id": "3ef1dd32-0995-11ef-883f-6fa390d4b039",
                        "type": "RadialVelocity",
                        "properties": {
                            "radius": 0.001,
                            "x": 0,
                            "y": -1,
                            "z": 0,
                            "theta": 0,
                            "isEnabled": true
                        }
                    }
                ],
                "behaviours": [
                    {
                        "id": "3ef1dd33-0995-11ef-883f-6fa390d4b039",
                        "type": "Alpha",
                        "properties": {
                            "alphaA": 0.75,
                            "alphaB": 0,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "3ef1dd34-0995-11ef-883f-6fa390d4b039",
                        "type": "Color",
                        "properties": {
                            "colorA": "#8A2BE2",
                            "colorB": "#ff4500",
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "3ef1dd35-0995-11ef-883f-6fa390d4b039",
                        "type": "Scale",
                        "properties": {
                            "scaleA": ParticleConstants.RAPTOR_A_SCALE,
                            "scaleB": ParticleConstants.RAPTOR_B_SCALE,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "3ef1dd36-0995-11ef-883f-6fa390d4b039",
                        "type": "Force",
                        "properties": {
                            "fx": 0,
                            "fy": ParticleConstants.RAPTOR_FORCE,
                            "fz": 0,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "3ef1dd37-0995-11ef-883f-6fa390d4b039",
                        "type": "Rotate",
                        "properties": {
                            "x": 0,
                            "y": 0,
                            "z": 0,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "3ef1dd38-0995-11ef-883f-6fa390d4b039",
                        "type": "RandomDrift",
                        "properties": {
                            "driftX": 0,
                            "driftY": 0,
                            "driftZ": 0,
                            "delay": 1,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "3ef1dd39-0995-11ef-883f-6fa390d4b039",
                        "type": "Spring",
                        "properties": {
                            "x": 0,
                            "y": 0,
                            "z": 0,
                            "spring": 0.01,
                            "friction": 1,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "3ef1dd37-0995-11ef-883f-6fa390d4b039",
                        "type": "Gravity",
                        "properties": {
                            "x": 0,
                            "y": 0,
                            "z": 0,
                            "gravity": 0,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                ],
                "emitterBehaviours": [
                    {
                        "id": "3ef1dd3a-0995-11ef-883f-6fa390d4b039",
                        "type": "Rotate",
                        "properties": {
                            "x": 0,
                            "y": 0,
                            "z": 0,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    }
                ]
            }
        ]
    };

    public tc: ThrelteContext;
    public system: System;
    public position: Vector3 = new Vector3(0, 0, 0);
    public rotation: Euler = new Euler(0, 0, 0);
    public throttle: number;
    
    public constructor(tc: ThrelteContext) {
        this.tc = tc;
        this.createParticleSystem();
    }

    public createParticleSystem(): void {
        System.fromJSONAsync(RaptorParticle.PARTICLE_SYSTEM, THREE).then(loaded => {
            let systemRenderer: SpriteRenderer = new SpriteRenderer(this.tc.scene, THREE);
            this.system = loaded.addRenderer(systemRenderer);

            this.system.emit({
                onStart() {
                    // console.log('Start');
                },
                onUpdate() {
                    // console.log('Update');
                },
                onEnd() {
                    // console.log('End');
                }
            });
        })
    }

    public update(position: Vector3, rotation: Quaternion, throttle: number, altitude: number): void {
        if (this.system === undefined) return;
        this.position = position;
        this.rotation = new Euler().setFromQuaternion(rotation);
        for (let emitter of this.system.emitters) {
            emitter.setPosition(this.position);
            emitter.setRotation(this.rotation);
            for (let behaviour of emitter.behaviours) {
                if (behaviour['type'] === 'Spring') {
                    behaviour['x'] = this.position.x;
                    behaviour['y'] = this.position.y;
                    behaviour['z'] = this.position.z;
                    behaviour['pos']['x'] = this.position.x;
                    behaviour['pos']['y'] = this.position.y;
                    behaviour['pos']['z'] = this.position.z;
                    // otherwise this weird gravity pulling thing happens even though theres no gravity
                }
                if (behaviour['type'] === 'Force') {
                    let forceVector: Vector3 = new Vector3(0, ParticleConstants.RAPTOR_FORCE * ParticleConstants.FORCE_MULT, 0);
                    let forceVectorRotated: Vector3 = forceVector.applyQuaternion(rotation);
                    behaviour['fx'] = forceVectorRotated.x;
                    behaviour['fy'] = forceVectorRotated.y;
                    behaviour['fz'] = forceVectorRotated.z;
                    behaviour['force']['x'] = forceVectorRotated.x;
                    behaviour['force']['y'] = forceVectorRotated.y;
                    behaviour['force']['z'] = forceVectorRotated.z;
                }
                if (behaviour['type'] === 'Scale') {
                    behaviour['scaleA']['a'] = throttle * ParticleConstants.RAPTOR_A_SCALE;
                    behaviour['scaleA']['b'] = throttle * ParticleConstants.RAPTOR_A_SCALE;
                    behaviour['scaleB']['a'] = throttle * ParticleConstants.RAPTOR_B_SCALE;
                    behaviour['scaleB']['b'] = throttle * ParticleConstants.RAPTOR_B_SCALE;
                }
            }
            emitter.setBehaviours(emitter.behaviours);
            for (let initializer of emitter['initializers']) {
                if (initializer['type'] === 'RadialVelocity') {
                    initializer['tha'] = altitude * ParticleConstants.RAPTOR_THETA_ALTITUDE;
                }
            }
            emitter.setInitializers(emitter['initializers']);
        }
        this.system.update();
    }

    public remove(): void {
        for (let emitter of this.system.emitters) {
            for (let behaviour of emitter.behaviours) {
                if (behaviour['type'] === 'Scale') {
                    behaviour['scaleA']['a'] = 0;
                    behaviour['scaleA']['b'] = 0;
                    behaviour['scaleB']['a'] = 0;
                    behaviour['scaleB']['b'] = 0;
                }
            }
            emitter.setBehaviours(emitter.behaviours);
            emitter.removeAllParticles();
        }
        this.system.update();
    }
}