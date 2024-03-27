import { writable } from "svelte/store";

export const toggles = writable({
    editMode: true,
    paused: false,
    settings: false,
    credits: false,
});

export const starshipSettings = writable({
});

export const superHeavySettings = writable({
});

export const telemetry = writable({
    dt: 0,
    superHeavyRaptors: [],
    superHeavyAngle: 0,

    starshipRaptors: [],
    starshipAngle: 0,
});

export const gameSettings = writable({
    textureResolution: 1,
    volume: 1,
    muted: false,
});