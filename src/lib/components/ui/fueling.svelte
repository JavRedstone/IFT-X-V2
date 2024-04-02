<script lang="ts">
    import { onMount } from "svelte";
    import s25b9 from "../images/s25b9.png";
    import { telemetry } from "../stores/ui-store";
    import { LaunchHelper } from "../helpers/LaunchHelper";

    const imageTop: number = 84;
    const imageLeft: number = 16;

    let realHeight: number = 0;

    let telemetryValues: any = {
        dt: 0,
        wind: 0,
        temperature: 0,
        weather: true,
        range: true,
        vehicle: true,

        starshipLOX: 0,
        starshipCH4: 0,

        superHeavyLOX: 0,
        superHeavyCH4: 0,
    };
    
    function setupUpdator() {
        telemetry.subscribe((value) => {
            telemetryValues.dt = value.dt;
            telemetryValues.wind = value.wind;
            telemetryValues.temperature = value.temperature;
            telemetryValues.weather = value.weather;
            telemetryValues.range = value.range;
            telemetryValues.vehicle = value.vehicle;

            telemetryValues.starshipLOX = value.starshipLOX;
            telemetryValues.starshipCH4 = value.starshipCH4;

            telemetryValues.superHeavyLOX = value.superHeavyLOX;
            telemetryValues.superHeavyCH4 = value.superHeavyCH4;

            realHeight = window.innerHeight - 2 * imageTop;
        });
    }

    function setupWindow() {
        window.addEventListener("resize", () => {
            realHeight = window.innerHeight - 2 * imageTop;
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
        width: 200px;
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
    }

    .fueling-event {
        position: absolute;
        left: 16px;
        top: 46px;
        font-weight: bold;
        font-size: 12px;
    }

    .fueling-image {
        position: absolute;
        width: auto;
    }

    .fueling-status {
        position: absolute;
        left: 16px;
        font-size: 16px;
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
</style>
<div class="fueling-container">
    <div class="fueling-time">{ LaunchHelper.getTString(telemetryValues.dt) }</div>
    <div class="fueling-event">INTEGRATED FLIGHT TEST X</div>
    <div class="fueling-bar-container" style="top: {imageTop + realHeight * 0.205}px; left: {imageLeft + realHeight * 0.039}px; width: {realHeight * 0.085}px; height: {realHeight * 0.07}px;">
        <div class="fueling-bar" style="background-color: rgba(255, 150, 150, 0.5); height: {telemetryValues.starshipCH4 * 100}%;"></div>
    </div>
    <div class="fueling-bar-container" style="top: {imageTop + realHeight * 0.275}px; left: {imageLeft + realHeight * 0.039}px; width: {realHeight * 0.085}px; height: {realHeight * 0.08}px;">
        <div class="fueling-bar" style="background-color: rgba(150, 150, 255, 0.5); height: {telemetryValues.starshipLOX * 100}%;"></div>
    </div>
    <div class="fueling-bar-container" style="top: {imageTop + realHeight * 0.44}px; left: {imageLeft + realHeight * 0.039}px; width: {realHeight * 0.085}px; height: {realHeight * 0.224}px;">
        <div class="fueling-bar" style="background-color: rgba(255, 150, 150, 0.5); height: {telemetryValues.superHeavyCH4 * 100}%;"></div>
    </div>
    <div class="fueling-bar-container" style="top: {imageTop + realHeight * 0.664}px; left: {imageLeft + realHeight * 0.039}px; width: {realHeight * 0.085}px; height: {realHeight * 0.3}px;">
        <div class="fueling-bar" style="background-color: rgba(150, 150, 255, 0.5); height: {telemetryValues.superHeavyLOX * 100}%;"></div>
    </div>
    <div class="fueling-level" style="top: 100px;"><b>STARSHIP</b></div>
    <div class="fueling-level" style="top: 120px;">CH4: {Math.round(telemetryValues.starshipCH4 * 100)}%</div>
    <div class="fueling-level" style="top: 140px;">LOX: {Math.round(telemetryValues.starshipLOX * 100)}%</div>
    <div class="fueling-level" style="top: 180px;"><b>SUPERHEAVY</b></div>
    <div class="fueling-level" style="top: 200px;">CH4: {Math.round(telemetryValues.superHeavyCH4 * 100)}%</div>
    <div class="fueling-level" style="top: 220px;">LOX: {Math.round(telemetryValues.superHeavyLOX * 100)}%</div>
    <img class="fueling-image" style="top: {imageTop}px; left: {imageLeft}px; height: calc(100vh - {2 * imageTop}px);" src={s25b9} alt="s25b9" />
    <div class="fueling-status" style="bottom: 40px;"><b>WIND</b> {telemetryValues.wind}KM/H</div>
    <div class="fueling-status" style="bottom: 16px;"><b>TEMP</b> {telemetryValues.temperature}°C</div>
</div>
