<script lang="ts">
	import { toggles, uiMessages, uiSwitches } from './../../stores/ui-store';
    import { onMount } from 'svelte';
    import staging from '../../videos/staging.mp4';
  import { TextureConstants } from '$lib/components/constants/TextureConstants';

    let loadingProgress: number = 0;

    function setupUpdator(): void {
        uiMessages.subscribe((value) => {
            loadingProgress = value.numObjsLoaded / TextureConstants.NUM_TEXTURES * 100;

            if (loadingProgress == 100) {
                setTimeout(() => {
                    uiSwitches.update((value) => {
                        value.loading = false;
                        value.playing = true;
                        return value;
                    });
                    toggles.update((value) => {
                        value.isEditing = true;
                        return value;
                    });
                }, 100);
            }
        });
    }

    onMount(() => {
        setupUpdator();
    });
</script>
<style>
    @keyframes increaseOpacity {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .loading-video {
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

    .loading-credit {
        position: absolute;
        bottom: 16px;
        right: 16px;
        font-size: 12px;
        color: white;
    }

    .loading-status {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        color: white;
        animation: increaseOpacity 0.5s;
    }

    .loading-bar {
        position: absolute;
        top: calc(50% + 32px);
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        height: 10px;
        border: 1px solid white;
        border-radius: 5px;
        background-color: rgba(0, 0, 0, 0.75);
        animation: increaseOpacity 0.5s;
    }

    .loading-bar-value {
        width: 0%;
        height: 100%;
        border-radius: 5px;
        background: linear-gradient(to right, rgba(255, 255, 255, 0.25), white);
        animation: increaseOpacity 0.5s;
    }
</style>
<video src={staging} autoplay loop muted disablePictureInPicture class="loading-video"></video>
<div class="loading-credit"><b>Video credit:</b> <a href="https://www.youtube.com/watch?v=ApMrILhTulI" target="_blank">SpaceX</a></div>
<div class="loading-bar">
    <div class="loading-bar-value" style="width: {loadingProgress}%;"></div>
</div>
<div class="loading-status">Loading: {Math.round(loadingProgress)}%</div>