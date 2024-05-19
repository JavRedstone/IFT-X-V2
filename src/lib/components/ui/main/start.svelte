<script lang="ts">
	import { onMount } from 'svelte';
    import { TextureConstants } from "$lib/components/constants/TextureConstants";
    import { gameSettings, uiSwitches } from "$lib/components/stores/ui-store";
    import liftoff from "../../videos/liftoff.mp4";

    let textureResolution: string = `${TextureConstants.DEFAULT_TEXTURE_RESOLUTION}`;

    function startEditing() {
        uiSwitches.update((value) => {
            value.start = false;
            value.loading = true;
            return value;
        });
        gameSettings.update((value) => {
            value.textureResolution = parseInt(textureResolution);
            localStorage.setItem("textureResolution", textureResolution);
            return value;
        });
    }

    onMount(() => {
        textureResolution = localStorage.getItem("textureResolution") || `${TextureConstants.DEFAULT_TEXTURE_RESOLUTION}`;
    });
</script>
<style>
    .start-video {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        min-width: 100vw;
        min-height: 100vh;
        width: auto;
        height: auto;
        filter: brightness(0.5) blur(6px);
    }

    .start-credit-spacex {
        position: absolute;
        bottom: 32px;
        right: 16px;
        font-size: 12px;
        color: white;
    }

    .start-credit-savfk {
        position: absolute;
        bottom: 16px;
        right: 16px;
        font-size: 12px;
        color: white;
    }

    .start-title {
        position: absolute;
        top: 0px;
        left: 32px;
        font-size: 48px;
        color: white;
    }

    .start-abbreviation {
        position: absolute;
        top: 72px;
        left: 32px;
        font-size: 24px;
        color: white;
    }

    .start-description {
        position: absolute;
        top: 112px;
        left: 32px;
        font-size: 24px;
        color: white;
    }

    .start-action {
        position: absolute;
        border: none;
        border-radius: 8px;
        outline: none;
        background-color: rgba(255, 255, 255, 0.25);
        font-size: 20px;
        color: white;
        font-family: "M PLUS Code Latin", monospace;

        transition: background-color 0.2s, color 0.2s;
        animation: increaseOpacity 0.5s;

        &:hover {
            background-color: rgba(255, 255, 255, 0.75);
            color: black;
            cursor: pointer;
        }
    }

    .start-resolution {
        position: absolute;
        bottom: 36px;
        left: 32px;
        font-size: 16px;
        color: white;
    }

    .start-resolution-dropdown {
        position: absolute;
        bottom: 16px;
        left: 32px;
        font-size: 16px;
        color: white;
        background-color: rgba(255, 255, 255, 0.5);
        border: none;
        border-radius: 8px;
        outline: none;
        padding: 4px;
        font-family: "M PLUS Code Latin", monospace;
        color: black;

        transition: background-color 0.2s, color 0.2s;
        animation: increaseOpacity 0.5s;

        &:hover {
            background-color: rgba(255, 255, 255, 0.75);
            cursor: pointer;
        }
    }
</style>
<video src={liftoff} autoplay loop muted disablePictureInPicture class="start-video"></video>
<div class="start-credit-spacex"><b>Video credit:</b> <a href="https://twitter.com/SpaceX/status/1768747417716101402" target="_blank">SpaceX</a></div>
<div class="start-credit-savfk"><b>Music credit:</b> <a href="https://www.youtube.com/watch?v=MCscTvpQ7po" target="_blank">Savfk</a></div>
<h1 class="start-title">IFT-X</h1>
<p class="start-abbreviation">Integrated Flight Test X</p>
<h3 class="start-description">A fun simulation game of the <a href="https://www.spacex.com/vehicles/starship/" target="_blank">SpaceX Starship</a></h3>
<button class="start-action" style="left: 32px; top: 200px; width: 240px; height: 50px;" on:click={startEditing}>Customize Starship</button>
<p class="start-resolution">Texture Resolution</p>
<select class="start-resolution-dropdown" bind:value={textureResolution}>
    <option value="0">1K</option>
    <option value="1">2K</option>
    <option value="2">4K</option>
    <option value="3">10K</option>
</select>