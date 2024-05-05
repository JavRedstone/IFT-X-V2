import System, { SpriteRenderer } from 'three-nebula';
import * as THREE from 'three';
import { Vector3, Euler, Quaternion } from 'three';
import { type ThrelteContext } from '@threlte/core';
import { ParticleConstants } from '../constants/ParticleConstants';

export class DelugeParticle {
    public static readonly PARTICLE_SYSTEM: any = {
        "preParticles": 500,
        "integrationType": "EULER",
        "emitters": [
            {
                "id": "125c3860-0a80-11ef-aba2-27d52442715f",
                "totalEmitTimes": null,
                "life": null,
                "cache": {
                    "totalEmitTimes": 0,
                    "life": 0
                },
                "rate": {
                    "particlesMin": 10,
                    "particlesMax": 20,
                    "perSecondMin": 0.1,
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
                        "id": "125c3861-0a80-11ef-aba2-27d52442715f",
                        "type": "Mass",
                        "properties": {
                            "min": 30,
                            "max": 10,
                            "isEnabled": true
                        }
                    },
                    {
                        "id": "125c3862-0a80-11ef-aba2-27d52442715f",
                        "type": "Life",
                        "properties": {
                            "min": 2,
                            "max": 4,
                            "isEnabled": true
                        }
                    },
                    {
                        "id": "125c3863-0a80-11ef-aba2-27d52442715f",
                        "type": "BodySprite",
                        "properties": {
                            "texture": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJkSURBVHjaxJeJbusgEEW94S1L//83X18M2MSuLd2pbqc4wZGqRLrKBsyZhQHny7Jk73xVL8xpVhWrcmiB5lX+6GJ5YgQ2owbAm8oIwH1VgKZUmGcRqKGGPgtEQQAzGR8hQ59fAmhJHSAagigJ4E7GPWRXOYC6owAd1JM6wDQPADyMWUqZRMqmAojHp1Vn6EQQEgUNMJLnUjMyJsM49wygBkAPw9dVFwXRkncCIIW3GRgoTQUZn6HxCMAFEFd8TwEQ78X4rHbILoAUmeT+RFG4UhQ6MiIAE4W/UsYFjuVjAIa2nIY4q1R0GFtQWG3E84lqw2GO2QOoCKBVu0BAPgDSU0eUDjjQenNkV/AW/pWChhpMTelo1a64AOKM30vk18GzTHXCNtI/Knz3DFBgsUqBGIjTInXRY1yA9xkVoqW5tVq3pDR9A0hfF5BSARmVnh7RMDCaIdcNgbPBkgzn1Bu+SfIEFSpSBmkxyrMicb0fAEuCZrWnN89veA/4XcakrPcjBWzkTuLjlbfTQPOlBhz+HwkqqPXmPQDdrQItxE1moGof1S74j/8txk8EHhTQrAE8qlwfqS5yukm1x/rAJ9Jiaa6nyATqD78aUVBhFo8b1V4DdTXdCW+IxA1zB4JhiOhZMEWO1HqnvdoHZ4FAMIhV9REF8FiUm0jsYPEJx/Fm/N8OhH90HI9YRHesWbXXZwAShU8qThe7H8YAuJmw5yOd989uRINKRTJAhoF8jbqrHKfeCYdIISZfSq26bk/K+yO3YvfKrVgiwQBHnwt8ynPB25+M8hceTt/ybPhnryJ78+tLgAEAuCFyiQgQB30AAAAASUVORK5CYII=",
                            "isEnabled": true
                        }
                    },
                    {
                        "id": "125c3864-0a80-11ef-aba2-27d52442715f",
                        "type": "Radius",
                        "properties": {
                            "width": 0.0001,
                            "height": 0.0001,
                            "isEnabled": true
                        }
                    },
                    {
                        "id": "125c3865-0a80-11ef-aba2-27d52442715f",
                        "type": "RadialVelocity",
                        "properties": {
                            "radius": 0.0005,
                            "x": 0,
                            "y": 1,
                            "z": 0,
                            "theta": 90,
                            "isEnabled": true
                        }
                    }
                ],
                "behaviours": [
                    {
                        "id": "125c3866-0a80-11ef-aba2-27d52442715f",
                        "type": "Alpha",
                        "properties": {
                            "alphaA": 0.3,
                            "alphaB": 0,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "125c3867-0a80-11ef-aba2-27d52442715f",
                        "type": "Color",
                        "properties": {
                            "colorA": "#eefeff",
                            "colorB": "#eefeff",
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "125c3868-0a80-11ef-aba2-27d52442715f",
                        "type": "Scale",
                        "properties": {
                            "scaleA": ParticleConstants.DELUGE_A_SCALE,
                            "scaleB": ParticleConstants.DELUGE_B_SCALE,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "125c3869-0a80-11ef-aba2-27d52442715f",
                        "type": "Force",
                        "properties": {
                            "fx": 0,
                            "fy": 0.0001,
                            "fz": 0,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "125c386a-0a80-11ef-aba2-27d52442715f",
                        "type": "Rotate",
                        "properties": {
                            "x": 1,
                            "y": 0,
                            "z": 0,
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
                            "gravity": 0.0001,
                            "life": null,
                            "easing": "easeLinear"
                        }
                    },
                    {
                        "id": "125c386b-0a80-11ef-aba2-27d52442715f",
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
                        "id": "125c386c-0a80-11ef-aba2-27d52442715f",
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
                    }
                ],
                "emitterBehaviours": [
                    {
                        "id": "125c386d-0a80-11ef-aba2-27d52442715f",
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
        System.fromJSONAsync(DelugeParticle.PARTICLE_SYSTEM, THREE).then(loaded => {
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

    public update(position: Vector3, rotation: Quaternion, scale: number): void {
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
                if (behaviour['type'] === 'Scale') {
                    behaviour['scaleA']['a'] = scale * ParticleConstants.DELUGE_A_SCALE;
                    behaviour['scaleA']['b'] = scale * ParticleConstants.DELUGE_A_SCALE;
                    behaviour['scaleB']['a'] = scale * ParticleConstants.DELUGE_B_SCALE;
                    behaviour['scaleB']['b'] = scale * ParticleConstants.DELUGE_B_SCALE;
                }
            }
            emitter.setBehaviours(emitter.behaviours);
        }
        
        this.system.update();
    }
}