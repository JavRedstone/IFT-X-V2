<script lang="ts">
    import { uiSwitches } from "$lib/components/stores/ui-store";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let isOpen: boolean = false;

    function setupUpdator(): void {
        uiSwitches.subscribe((value) => {
            isOpen = value.landed;
        });
    }

    function restart(): void {
        if (window) {
            window.location.reload();
        }
    }

    onMount(() => {
        setupUpdator();
    });
</script>
<style>
    .restart-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 64px;
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid white;
        border-radius: 9px;
        font-family: "M PLUS Code Latin", monospace;
        color: white;
        font-size: 12px;
        padding: 10px;
        
        user-select: none;
    }

    .restart-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
    }

    .restart-action {
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

        &:hover {
            background-color: rgba(255, 255, 255, 0.5);
            color: black;
            cursor: pointer;
        }
    }
</style>
{#if isOpen}
    <div class="restart-container" transition:fly={{ y: 100, duration: 300 }}>
        <div class="restart-title">Flight Test Over</div>
        <button class="restart-action" on:click={restart}>Restart</button>
    </div>
{/if}