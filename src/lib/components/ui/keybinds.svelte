<script lang="ts">
    import { onMount } from "svelte";
  import { toggles } from "../stores/ui-store";

    let isEditing: boolean = false;
    let isLaunching: boolean = false;

    let isOpen: boolean = false;

    function setupUpdator(): void {
        toggles.subscribe((value) => {
            isEditing = value.isEditing;
            isLaunching = value.isLaunching;
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
    @keyframes slideUp {
        from {
            transform: translate(-50%, 100%);
        }
        to {
            transform: translate(-50%, -50%);
        }
    }
    .keybinds-toggle {
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

    .keybinds-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 300px;
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid white;
        border-radius: 9px;
        font-family: "M PLUS Code Latin", monospace;
        color: white;
        font-size: 12px;
        padding: 10px;
        
        user-select: none;

        animation: slideUp 0.5s, increaseOpacity 1s;
    }

    .keybinds-useable {
        width: 100%;
        height: calc(100% - 32px);
        overflow-y: auto;
    }

    .keybinds-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .keybind-keycap {
        display: inline-block;
        width: 30px;
        height: 30px;
        background-color: rgba(255, 255, 255, 0.5);
        border: 1px solid white;
        border-radius: 5px;
        color: black;
        font-size: 24px;
        text-align: center;
        line-height: 30px;
        margin-right: 5px;
    }

    .keybind-text {
        display: inline-block;
        font-size: 14px;
    }

    .keybind-exit {
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
<button class="keybinds-toggle" on:click={() => isOpen = !isOpen}>Keybinds</button>
{#if isOpen}
    <div class="keybinds-container">
        <div class="keybinds-useable">
            {#if isEditing}
                <div class="keybinds-title">Keybinds for Editing</div>
                <div class="keybind-keycap">&#9664;</div>
                <p class="keybind-text">Hide / Show Left Panel</p>
                <br>
                <div class="keybind-keycap">&#9654;</div>
                <p class="keybind-text">Hide / Show Right Panel</p>
                <br>
                <div class="keybind-keycap" style="font-size: 10px">Enter</div>
                <p class="keybind-text">Test</p>
                <br>
                <div class="keybind-keycap">R</div>
                <p class="keybind-text">Reset</p>
            {:else if isLaunching}
                <div class="keybinds-title">Keybinds for Launching</div>
                <div class="keybind-keycap">W</div>
                <p class="keybind-text">SuperHeavy Pitch Up</p>
                <br>
                <div class="keybind-keycap">S</div>
                <p class="keybind-text">SuperHeavy Pitch Down</p>
                <br>
                <div class="keybind-keycap">A</div>
                <p class="keybind-text">SuperHeavy Yaw Left</p>
                <br>
                <div class="keybind-keycap">D</div>
                <p class="keybind-text">SuperHeavy Yaw Right</p>
                <br>
                <div class="keybind-keycap">Q</div>
                <p class="keybind-text">SuperHeavy Roll Left (After Sep)</p>
                <br>
                <div class="keybind-keycap">E</div>
                <p class="keybind-text">SuperHeavy Roll Right (After Sep)</p>
                <br>
                <div class="keybind-keycap">I</div>
                <p class="keybind-text">Starship Pitch Up</p>
                <br>
                <div class="keybind-keycap">K</div>
                <p class="keybind-text">Starship Pitch Down</p>
                <br>
                <div class="keybind-keycap">J</div>
                <p class="keybind-text">Starship Yaw Left</p>
                <br>
                <div class="keybind-keycap">L</div>
                <p class="keybind-text">Starship Yaw Right</p>
                <br>
                <div class="keybind-keycap">U</div>
                <p class="keybind-text">Starship Roll Left</p>
                <br>
                <div class="keybind-keycap">O</div>
                <p class="keybind-text">Starship Roll Right</p>
                <br>
                <div class="keybind-keycap" style="font-size: 10px">Space</div>
                <p class="keybind-text">Start Current Launch Event</p>
            {:else}
                <div class="keybinds-title">Keybinds for General</div>
            {/if}
        </div>
        <button class="keybind-exit" on:click={() => isOpen = false}>Exit</button>
    </div>
{/if}