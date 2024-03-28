<script lang="ts">
    import { onMount } from "svelte";
    import { Vector2, type Vector3 } from "three";
    import { RaptorUI } from "../structs/ui/RaptorUI";
    import { starshipSettings, superHeavySettings } from "../ui-stores/ui-store";
    import { MathHelper } from "../helpers/MathHelper";
    import s25 from "../images/s25.png";
    import b9 from "../images/b9.png";
    import s25b9 from "../images/s25b9.png";

    let starshipRaptors: RaptorUI[] = [];
    let superHeavyRaptors: RaptorUI[] = [];

    const sizeMult = 44;
    const posOffset = 12;
    const angOffset = 90*Math.PI/180;
    const rSeaRadius = 4.5;
    const rVacRadius = 12;

    let starshipOptions: any = {
        rSeaAngularOffset: 0,
        rVacAngularOffset: 0,

        rSeaRadius: 0,
        numRSeas: 0,
        rVacRadius: 0,
        numRVacs: 0,
    };
    let superHeavyOptions: any = {
        rSeaAngularOffset1: 0,
        rSeaAngularOffset2: 0,
        rSeaAngularOffset3: 0,

        rSeaRadius1: 0,
        numRSeas1: 0,
        rSeaRadius2: 0,
        numRSeas2: 0,
        rSeaRadius3: 0,
        numRSeas3: 0,
    };

    function setupUpdator() {
        starshipSettings.subscribe((value) => {
            starshipRaptors = [];
            superHeavyRaptors = [];
            starshipOptions.rSeaAngularOffset = value.rSeaAngularOffset;
            starshipOptions.rVacAngularOffset = value.rVacAngularOffset;

            starshipOptions.rSeaRadius = value.rSeaRadius;
            starshipOptions.numRSeas = value.numRSeas;
            superHeavyOptions.rVacRadius = value.rVacRadius;
            starshipOptions.numRVacs = value.numRVacs;
            createStarshipRaptors();
            createSuperHeavyRaptors();
        });
        superHeavySettings.subscribe((value) => {
            starshipRaptors = [];
            superHeavyRaptors = [];
            superHeavyOptions.rSeaAngularOffset1 = value.rSeaAngularOffset1;
            superHeavyOptions.rSeaAngularOffset2 = value.rSeaAngularOffset2;
            superHeavyOptions.rSeaAngularOffset3 = value.rSeaAngularOffset3;

            superHeavyOptions.rSeaRadius1 = value.rSeaRadius1;
            superHeavyOptions.numRSeas1 = value.numRSeas1;
            superHeavyOptions.rSeaRadius2 = value.rSeaRadius2;
            superHeavyOptions.numRSeas2 = value.numRSeas2;
            superHeavyOptions.rSeaRadius3 = value.rSeaRadius3;
            superHeavyOptions.numRSeas3 = value.numRSeas3;
            createStarshipRaptors();
            createSuperHeavyRaptors();
        });
    }

    function createStarshipRaptors() {
        let rSeaPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRSeas, starshipOptions.rSeaRadius * sizeMult, starshipOptions.rSeaAngularOffset + angOffset);
        for (let i = 0; i < starshipOptions.numRSeas; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(i, false, true, new Vector2(superHeavyOptions.rSeaRadius3 * sizeMult - rSeaPositions[i].x - rSeaRadius, rSeaPositions[i].z + superHeavyOptions.rSeaRadius3 * sizeMult - rSeaRadius))];
        }
        let rVacPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRVacs, superHeavyOptions.rVacRadius * sizeMult, starshipOptions.rVacAngularOffset + angOffset);
        for (let i = 0; i < starshipOptions.numRVacs; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(i, false, false, new Vector2(superHeavyOptions.rSeaRadius3 * sizeMult - rVacPositions[i].x - rVacRadius, rVacPositions[i].z + superHeavyOptions.rSeaRadius3 * sizeMult - rVacRadius))];
        }
    }

    function createSuperHeavyRaptors() {
        let rSeaPositions1: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas1, superHeavyOptions.rSeaRadius1 * sizeMult, superHeavyOptions.rSeaAngularOffset1 + angOffset);
        for (let i = 0; i < superHeavyOptions.numRSeas1; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(i, false, true, new Vector2(rSeaPositions1[i].x + superHeavyOptions.rSeaRadius3 * sizeMult - rSeaRadius, rSeaPositions1[i].z + superHeavyOptions.rSeaRadius3 * sizeMult - rSeaRadius))];
        }
        let rSeaPositions2: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas2, superHeavyOptions.rSeaRadius2 * sizeMult, superHeavyOptions.rSeaAngularOffset2 + angOffset);
        for (let i = 0; i < superHeavyOptions.numRSeas2; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(i, false, true, new Vector2(rSeaPositions2[i].x + superHeavyOptions.rSeaRadius3 * sizeMult - rSeaRadius, rSeaPositions2[i].z + superHeavyOptions.rSeaRadius3 * sizeMult - rSeaRadius))];
        }
        let rSeaPositions3: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas3, superHeavyOptions.rSeaRadius3 * sizeMult, superHeavyOptions.rSeaAngularOffset3 + angOffset);
        for (let i = 0; i < superHeavyOptions.numRSeas3; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(i, false, true, new Vector2(rSeaPositions3[i].x + superHeavyOptions.rSeaRadius3 * sizeMult - rSeaRadius, rSeaPositions3[i].z + superHeavyOptions.rSeaRadius3 * sizeMult - rSeaRadius))];
        }
    }

    onMount(() => {
        setupUpdator();
    });
</script>
<style>
    .launch-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 108px;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .launch-r-sea-off {
        position: absolute;
        width: 9px;
        height: 9px;
        border: 1.275px solid white;
        border-radius: 100%;
    }

    .launch-r-sea-on {
        position: absolute;
        width: 9px;
        height: 9px;
        border: 1.275px solid white;
        border-radius: 100%;
        background-color: white;
    }

    .launch-r-vac-off {
        position: absolute;
        width: 24px;
        height: 24px;
        border: 1.275px solid white;
        border-radius: 100%;
    }

    .launch-r-vac-on {
        position: absolute;
        width: 24px;
        height: 24px;
        border: 1.275px solid white;
        border-radius: 100%;
        background-color: white;
    }

    .launch-bar-container {
        position: absolute;
        width: 160px;
        height: 9px;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.75);
    }

    .launch-bar {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        border-radius: 4px;
        background: linear-gradient(to right, transparent, white)
    }

    .launch-fuel {
        position: absolute;
        font-size: 12px;
    }

    .launch-telem-container {
        display: flex;
        position: absolute;
    }

    .launch-telem {
        font-size: 14px;
    }

    .launch-telem-spacer {
        flex-grow: 1;
    }

    .launch-image {
        position: absolute;
        height: 90px;
        width: auto;
        top: 10px;
    }

    .launch-line {
        position: absolute;
        top: 54px;
        width: 120px;
        height: 0;
        border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .launch-time {
        position: absolute;
        left: 50%;
        top: 30px;
        transform: translate(-50%);
        font-weight: bold;
        font-size: 24px;
    }

    .launch-event {
        position: absolute;
        left: 50%;
        top: 60px;
        transform: translate(-50%);
        font-weight: bold;
        font-size: 12px;
    }
</style>
<div class="launch-container" style="user-select: none;">
    <div class="launch-time">T+00:00:05</div>
    <div class="launch-event">INTEGRATED FLIGHT TEST X</div>
    <div style="opacity:0.25">
        {#each starshipRaptors as raptor}
            <div class="launch-raptor">
                <div
                    class={raptor.isOn ? raptor.isSea ? "launch-r-sea-on" : "launch-r-vac-on" : raptor.isSea ? "launch-r-sea-off" : "launch-r-vac-off"}
                    style={`right: ${raptor.position.x + posOffset}px; top: ${raptor.position.y + posOffset}px;`}
                ></div>
            </div>
        {/each}

        <span class="launch-fuel" style="right: 293px; top: 56px;">LOX</span>
        <div class="launch-bar-container"
            style="right: 125px; top: 60px;"
        >
            <div class="launch-bar"></div>
        </div>
        <span class="launch-fuel" style="right: 293px; top: 76px;">CH4</span>
        <div class="launch-bar-container"
            style="right: 125px; top: 80px;"
        >
            <div class="launch-bar"></div>
        </div>

        <div class="launch-telem-container" style="right: 125px; top: 12px; width: 185px">
            <span class="launch-telem">SPEED</span>
            <span class="launch-telem-spacer"></span>
            <span class="launch-telem">10KM/H</span>
        </div>
        <div class="launch-telem-container" style="right: 125px; top: 30px; width: 171px">
            <span class="launch-telem">ALTITUDE</span>
            <span class="launch-telem-spacer"></span>
            <span class="launch-telem">10KM</span>
        </div>
        
        <div class="launch-line" style="right: 354px;"></div>
        <img class="launch-image" style="right: 397px; transform: rotate(0deg);" src={s25} alt="ship">
    </div>
    <div>
        {#each superHeavyRaptors as raptor}
            <div class="launch-raptor">
                <div
                    class={raptor.isOn ? raptor.isSea ? "launch-r-sea-on" : "launch-r-vac-on" : raptor.isSea ? "launch-r-sea-off" : "launch-r-vac-off"}
                    style={`left: ${raptor.position.x + posOffset}px; top: ${raptor.position.y + posOffset}px;`}
                ></div>
            </div>
        {/each}

        <span class="launch-fuel" style="left: 125px; top: 56px;">LOX</span>
        <div class="launch-bar-container"
            style="left: 150px; top: 60px;"
        >
            <div class="launch-bar"></div>
        </div>
        <span class="launch-fuel" style="left: 125px; top: 76px;">CH4</span>
        <div class="launch-bar-container"
            style="left: 150px; top: 80px;"
        >
            <div class="launch-bar"></div>
        </div>
        
        <div class="launch-telem-container" style="left: 125px; top: 12px; width: 185px">
            <span class="launch-telem">SPEED</span>
            <span class="launch-telem-spacer"></span>
            <span class="launch-telem">10KM/H</span>
        </div>
        <div class="launch-telem-container" style="left: 125px; top: 30px; width: 171px">
            <span class="launch-telem">ALTITUDE</span>
            <span class="launch-telem-spacer"></span>
            <span class="launch-telem">10KM</span>
        </div>
        
        <div class="launch-line" style="left: 336px;"></div>
        <img class="launch-image" style="left: 390px; transform: rotate(0deg);" src={s25b9} alt="booster">
    </div>
</div>