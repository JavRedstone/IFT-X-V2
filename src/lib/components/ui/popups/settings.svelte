<script lang="ts">
    import { gameSettings } from "$lib/components/stores/ui-store";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let volume: number = 1;
    let particles: boolean = true;

    let isOpen: boolean = false;

    function setupUpdator(): void {
        localStorage.getItem("volume") && (volume = parseFloat(localStorage.getItem("volume") as string));
        localStorage.getItem("particles") && (particles = localStorage.getItem("particles") === "true");
        gameSettings.update((settings) => {
            settings.volume = volume;
            settings.particles = particles;
            return settings;
        });
        gameSettings.subscribe((settings) => {
            volume = settings.volume;
            particles = settings.particles;
        });
    }

    function save(): void {
        isOpen = false;
        localStorage.setItem("volume", volume.toString());
        localStorage.setItem("particles", particles.toString());
        gameSettings.update((settings) => {
            settings.volume = volume;
            settings.particles = particles;
            return settings;
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
    
    .settings-toggle {
        position: fixed;
        height: 18px;
        border: 1px solid white;
        outline: none;
        border-radius: 9px;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 12px;
        color: white;
        font-family: "M PLUS Code Latin", monospace;

        transition: background-color 0.2s, color 0.2s;
        animation: increaseOpacity 0.5s;

        user-select: none;

        &:hover {
            background-color: rgba(255, 255, 255, 0.5);
            color: black;
            cursor: pointer;
        }
    }

    .settings-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 150px;
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid white;
        border-radius: 9px;
        font-family: "M PLUS Code Latin", monospace;
        color: white;
        font-size: 12px;
        padding: 10px;
        
        user-select: none;
    }

    .settings-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 24px;
    }

    .setting-container {
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .setting-title {
        font-size: 16px;
        margin-bottom: 5px;
    }

    .setting-slider {
        -webkit-appearance: none;
        width: 50%;
        height: 24px;
        background: rgba(255, 255, 255, 0.5);
        outline: none;

        animation: increaseOpacity 0.5s;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: white;
            cursor: pointer;
        }
    }

    .setting-slider-value {
        font-size: 16px;
        width: 30px;
        text-align: center;
    }

    .setting-checkbox {
        width: 24px;
        height: 24px;
        margin-top: 8px;
        accent-color: black;
        outline: none;
        border: none;
    }

    .settings-save {
        position: absolute;
        left:0;
        bottom:0;
        width:100%;
        height: 32px;
        border: none;
        border-top: 1px solid white;
        border-bottom-left-radius: 9px;
        border-bottom-right-radius: 9px;
        outline: none;
        background-color:rgba(0, 0, 0, 0.5);
        font-size: 16px;
        color: white;
        font-family: "M PLUS Code Latin", monospace;

        transition: background-color 0.2s, color 0.2s;
        animation: increaseOpacity 0.5s;

        &:hover {
            background-color: rgba(255, 255, 255, 0.5);
            color: black;
            cursor: pointer;
        }
    }
</style>
<button class="settings-toggle" on:click={() => isOpen = !isOpen}>Settings</button>
{#if isOpen}
    <div class="settings-container" transition:fly={{ y: 25, duration: 300 }}>
        <div class="settings-title">Settings</div>
        <div class="setting-container">
            <div class="setting-title">Volume</div>
            <input type="range" min="0" max="1" step="0.01" class="setting-slider" bind:value={volume}>
            <div class="setting-slider-value">{Math.round(volume * 100)}%</div>
        </div>
        <div class="setting-container">
            <div class="setting-title">Particle Effects</div>
            <input class="setting-checkbox" type="checkbox" bind:checked={particles}>
        </div>
        <button class="settings-save" on:click={save}>Save</button>
    </div>
{/if}