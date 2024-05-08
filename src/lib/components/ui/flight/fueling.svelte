<script lang="ts">
    import { onMount } from "svelte";
    import s25b9 from "../../images/s25b9.png";
    import { telemetry, toggles } from "../../stores/ui-store";
    import { LaunchHelper } from "../../helpers/LaunchHelper";

    const imageTop: number = 84;
    const imageBottom: number = 16;
    const imageLeft: number = 16;

    let realHeight: number = 0;

    let hasStartedFueling: boolean = false;
    let doneFueling: boolean = false;

    let setTelemetry: boolean = false;

    let telemetryValues: any = {
        dt: 0,

        starshipLOX: 0,
        starshipCH4: 0,

        superHeavyLOX: 0,
        superHeavyCH4: 0,
    };
    
    function setupUpdator(): void {
        toggles.subscribe((value) => {
            hasStartedFueling = value.hasStartedFueling;
            doneFueling = value.doneFueling;
        });
        telemetry.subscribe((value) => {
            telemetryValues.dt = value.dt;

            telemetryValues.starshipLOX = value.starshipLOX;
            telemetryValues.starshipCH4 = value.starshipCH4;

            telemetryValues.superHeavyLOX = value.superHeavyLOX;
            telemetryValues.superHeavyCH4 = value.superHeavyCH4;

            realHeight = window.innerHeight - imageTop - imageBottom;

            setTimeout(() => {
                setTelemetry = true;
                // make sure the dt is updated first
            }, 100);
        });
    }

    function startFueling(): void {
        toggles.update((value) => {
            value.hasStartedFueling = true;
            return value;
        });
    }

    function proceedLaunch(): void {
        toggles.update((value) => {
            value.isFueling = false;
            value.hasStartedFueling = false;
            value.doneFueling = false;
            value.isLaunching = true;
            return value;
        });
    }

    function setupWindow(): void {
        window.addEventListener("resize", () => {
            realHeight = window.innerHeight - imageTop - imageBottom;
        });
    }
    
    onMount(() => {
        setupWindow();
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
    .fueling-container {
        position: fixed;
        top: 0;
        height: 100vh;
        width: 225px;
        background-color: rgba(0, 0, 0, 0.5);

        animation: increaseOpacity 0.5s;

        user-select: none;
    }

    .fueling-time {
        position: absolute;
        left: 16px;
        top: 16px;
        font-weight: bold;
        font-size: 24px;
        
        animation: increaseOpacity 0.5s;
    }

    .fueling-event {
        position: absolute;
        left: 16px;
        top: 46px;
        font-weight: bold;
        font-size: 12px;
        
        animation: increaseOpacity 0.5s;
    }

    .fueling-image {
        position: absolute;
        width: auto;
    }

    .fueling-level-title {
        position: absolute;
        right: 16px;
        font-size: 20px;
    }

    .fueling-level {
        position: absolute;
        right: 16px;
        font-size: 16px;
    }

    .fueling-bar-container {
        position: absolute;
    }

    .fueling-bar {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
    }

    .fueling-action {
        position: absolute;
        border: none;
        outline: none;
        background-color: #009f6B80;
        font-size: 16px;
        color: white;
        font-family: "M PLUS Code Latin", monospace;

        transition: background-color 0.2s, color 0.2s;
        animation: increaseOpacity 0.5s;

        &:hover {
            background-color: #009f6B;
            cursor: pointer;
        }
    }
</style>
<div class="fueling-container">
    {#if hasStartedFueling}
        <div class="fueling-time">{ LaunchHelper.getTString(telemetryValues.dt) }</div>
        <div class="fueling-event">INTEGRATED FLIGHT TEST X</div>
    {:else if setTelemetry}
        <button class="fueling-action" style="width: 100%; height: 64px; left: 0; top: 0;" on:click={startFueling}><b>GO</b> for Propellant Load &#10054;</button>
    {/if}
    {#if doneFueling}
        <button class="fueling-action" style="width: calc(100vw - 225px); height: 64px; left: 225px; top: 0;" on:click={proceedLaunch}><b>GO</b> for Launch &#128640;</button>
    {/if}
    <div class="fueling-bar-container" style="top: {imageTop + realHeight * 0.195}px; left: {imageLeft + realHeight * 0.039}px; width: {realHeight * 0.085}px; height: {realHeight * 0.08}px;">
        <div class="fueling-bar" style="background-color: rgba(255, 150, 150, 0.5); height: {telemetryValues.starshipCH4 * 100}%;"></div>
    </div>
    <div class="fueling-bar-container" style="top: {imageTop + realHeight * 0.275}px; left: {imageLeft + realHeight * 0.039}px; width: {realHeight * 0.085}px; height: {realHeight * 0.0875}px;">
        <div class="fueling-bar" style="background-color: rgba(150, 150, 255, 0.5); height: {telemetryValues.starshipLOX * 100}%;"></div>
    </div>
    <div class="fueling-bar-container" style="top: {imageTop + realHeight * 0.435}px; left: {imageLeft + realHeight * 0.039}px; width: {realHeight * 0.085}px; height: {realHeight * 0.23}px;">
        <div class="fueling-bar" style="background-color: rgba(255, 150, 150, 0.5); height: {telemetryValues.superHeavyCH4 * 100}%;"></div>
    </div>
    <div class="fueling-bar-container" style="top: {imageTop + realHeight * 0.664}px; left: {imageLeft + realHeight * 0.039}px; width: {realHeight * 0.085}px; height: {realHeight * 0.3}px;">
        <div class="fueling-bar" style="background-color: rgba(150, 150, 255, 0.5); height: {telemetryValues.superHeavyLOX * 100}%;"></div>
    </div>
    <div class="fueling-level-title" style="top: 100px;"><b>STARSHIP</b></div>
    <div class="fueling-level" style="top: 140px;">CH4: {Math.round(telemetryValues.starshipCH4 * 100)}%</div>
    <div class="fueling-level" style="top: 160px;">LOX: {Math.round(telemetryValues.starshipLOX * 100)}%</div>
    <div class="fueling-level-title" style="top: 200px;"><b>SUPERHEAVY</b></div>
    <div class="fueling-level" style="top: 240px;">CH4: {Math.round(telemetryValues.superHeavyCH4 * 100)}%</div>
    <div class="fueling-level" style="top: 260px;">LOX: {Math.round(telemetryValues.superHeavyLOX * 100)}%</div>
    <img class="fueling-image" style="top: {imageTop}px; left: {imageLeft}px; height: {realHeight}px;" src={s25b9} alt="s25b9" />
</div>