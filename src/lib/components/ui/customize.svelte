<script lang="ts">
	import { StringHelper } from './../helpers/StringHelper';
    import { onMount } from "svelte";
    import { Vector2, type Vector3 } from "three";
    import { RaptorUI } from "../structs/ui/RaptorUI";
    import { starshipSettings, superHeavySettings } from "../ui-stores/ui-store";
    import { MathHelper } from "../helpers/MathHelper";
    import s25b9 from "../images/s25b9.png";
  import { StarshipConstants } from '../constants/objects/StarshipConstants';
  import { SuperHeavyConstants } from '../constants/objects/SuperHeavyConstants';

    let starshipRaptors: RaptorUI[] = [];
    let superHeavyRaptors: RaptorUI[] = [];

    const sizeMult = 66;
    const posOffset = 24;
    const rSeaRadius = 7.5;
    const rVacRadius = 16;
    const border = 1.275;
    const rSeaRealRadius = rSeaRadius + border;
    const rVacRealRadius = rVacRadius + border;
    const defaultThrottle = 1;

    let starshipOptions: any = {
        bodyHeightScale: 1,

        forwardLHeightScale: 1,
        forwardLWidthScale: 1,
        forwardRHeightScale: 1,
        forwardRWidthScale: 1,
        aftLHeightScale: 1,
        aftLWidthScale: 1,
        aftRHeightScale: 1,
        aftRWidthScale: 1,

        rSeaRadius: 0,
        numRSeas: 0,
        rSeaAngularOffset: 0,
        rSeaAngularOffsetDegrees: 0,

        rVacRadius: 0,
        numRVacs: 0,
        rVacAngularOffset: 0,
        rVacAngularOffsetDegrees: 0,
    };
    let validatedStarship: any = {
        bodyHeightScale: true,

        forwardLHeightScale: true,
        forwardLWidthScale: true,
        forwardRHeightScale: true,
        forwardRWidthScale: true,
        aftLHeightScale: true,
        aftLWidthScale: true,
        aftRHeightScale: true,
        aftRWidthScale: true,

        rSeaRadius: true,
        numRSeas: true,
        rSeaAngularOffset: true,
        rSeaAngularOffsetDegrees: true,

        rVacRadius: true,
        numRVacs: true,
        rVacAngularOffset: true,
        rVacAngularOffsetDegrees: true,
    }
    let superHeavyOptions: any = {
        hsrHeightScale: 1,
        bodyHeightScale: 1,

        numGridFins: 0,
        gridFinLengthScale: 1,
        gridFinWidthScale: 1,
        gridFinAngularOffset: 0,
        gridFinAngularOffsetDegrees: 0,

        numChines: 0,
        chineHeightScale: 1,
        chineAngularOffset: 0,
        chineAngularOffsetDegrees: 0,

        numRSeas1: 0,
        rSeaRadius1: 0,
        rSeaAngularOffset1: 0,
        rSeaAngularOffset1Degrees: 0,

        numRSeas2: 0,
        rSeaRadius2: 0,
        rSeaAngularOffset2: 0,
        rSeaAngularOffset2Degrees: 0,

        numRSeas3: 0,
        rSeaRadius3: 0,
        rSeaAngularOffset3: 0,
        rSeaAngularOffset3Degrees: 0,
    };
    let validatedSuperHeavy: any = {
        hsrHeightScale: true,
        bodyHeightScale: true,

        numGridFins: true,
        gridFinLengthScale: true,
        gridFinWidthScale: true,
        gridFinAngularOffset: true,
        gridFinAngularOffsetDegrees: true,

        numChines: true,
        chineHeightScale: true,
        chineAngularOffset: true,
        chineAngularOffsetDegrees: true,

        numRSeas1: true,
        rSeaRadius1: true,
        rSeaAngularOffset1: true,
        rSeaAngularOffset1Degrees: true,

        numRSeas2: true,
        rSeaRadius2: true,
        rSeaAngularOffset2: true,
        rSeaAngularOffset2Degrees: true,

        numRSeas3: true,
        rSeaRadius3: true,
        rSeaAngularOffset3: true,
        rSeaAngularOffset3Degrees: true,
    }

    function setupUpdator() {
        starshipSettings.subscribe((value) => {
            starshipOptions.rSeaAngularOffset = value.rSeaAngularOffset;
            starshipOptions.rVacAngularOffset = value.rVacAngularOffset;

            starshipOptions.rSeaAngularOffsetDegrees = value.rSeaAngularOffset * 180 / Math.PI;
            starshipOptions.rVacAngularOffsetDegrees = value.rVacAngularOffset * 180 / Math.PI;

            starshipOptions.bodyHeightScale = value.bodyHeightScale;
            
            starshipOptions.forwardLHeightScale = value.forwardLHeightScale;
            starshipOptions.forwardLWidthScale = value.forwardLWidthScale;
            starshipOptions.forwardRHeightScale = value.forwardRHeightScale;
            starshipOptions.forwardRWidthScale = value.forwardRWidthScale;
            starshipOptions.aftLHeightScale = value.aftLHeightScale;
            starshipOptions.aftLWidthScale = value.aftLWidthScale;
            starshipOptions.aftRHeightScale = value.aftRHeightScale;
            starshipOptions.aftRWidthScale = value.aftRWidthScale;

            starshipOptions.rSeaRadius = value.rSeaRadius;
            starshipOptions.numRSeas = value.numRSeas;

            starshipOptions.rVacRadius = value.rVacRadius;
            starshipOptions.numRVacs = value.numRVacs;
            
            createRaptors();
        });
        superHeavySettings.subscribe((value) => {
            superHeavyOptions.gridFinAngularOffset = value.gridFinAngularOffset;
            superHeavyOptions.chineAngularOffset = value.chineAngularOffset;

            superHeavyOptions.gridFinAngularOffsetDegrees = value.gridFinAngularOffset * 180 / Math.PI;
            superHeavyOptions.chineAngularOffsetDegrees = value.chineAngularOffset * 180 / Math.PI;

            superHeavyOptions.rSeaAngularOffset1 = value.rSeaAngularOffset1;
            superHeavyOptions.rSeaAngularOffset2 = value.rSeaAngularOffset2;
            superHeavyOptions.rSeaAngularOffset3 = value.rSeaAngularOffset3;

            superHeavyOptions.rSeaAngularOffset1Degrees = value.rSeaAngularOffset1 * 180 / Math.PI;
            superHeavyOptions.rSeaAngularOffset2Degrees = value.rSeaAngularOffset2 * 180 / Math.PI;
            superHeavyOptions.rSeaAngularOffset3Degrees = value.rSeaAngularOffset3 * 180 / Math.PI;

            superHeavyOptions.hsrHeightScale = value.hsrHeightScale;
            superHeavyOptions.bodyHeightScale = value.bodyHeightScale;
            superHeavyOptions.chineHeightScale = value.chineHeightScale;
            superHeavyOptions.numChines = value.numChines;

            superHeavyOptions.gridFinLengthScale = value.gridFinLengthScale;
            superHeavyOptions.gridFinWidthScale = value.gridFinWidthScale;
            superHeavyOptions.numGridFins = value.numGridFins;

            superHeavyOptions.rSeaRadius1 = value.rSeaRadius1;
            superHeavyOptions.numRSeas1 = value.numRSeas1;

            superHeavyOptions.rSeaRadius2 = value.rSeaRadius2;
            superHeavyOptions.numRSeas2 = value.numRSeas2;

            superHeavyOptions.rSeaRadius3 = value.rSeaRadius3;
            superHeavyOptions.numRSeas3 = value.numRSeas3;
            
            createRaptors();
        });
    }

    function createRaptors() {
        starshipRaptors = [];
        superHeavyRaptors = [];
        setTimeout(() => {
            createStarshipRaptors();
            createSuperHeavyRaptors();
            // to make html catch up so the animation doesn't break
        }, 0);
    }

    function createStarshipRaptors() {
        let rSeaPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRSeas, starshipOptions.rSeaRadius * sizeMult, starshipOptions.rSeaAngularOffset);
        for (let i = 0; i < starshipOptions.numRSeas; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(true, defaultThrottle, new Vector2(sizeMult - rSeaPositions[i].z - rSeaRealRadius, rSeaPositions[i].x + sizeMult - rSeaRealRadius))];
        }
        let rVacPositions: Vector3[] = MathHelper.getCircularPositions(starshipOptions.numRVacs, starshipOptions.rVacRadius * sizeMult, starshipOptions.rVacAngularOffset);
        for (let i = 0; i < starshipOptions.numRVacs; i++) {
            starshipRaptors = [...starshipRaptors, new RaptorUI(false, defaultThrottle, new Vector2(sizeMult - rVacPositions[i].z - rVacRealRadius, rVacPositions[i].x + sizeMult - rVacRealRadius))];
        }
    }

    function createSuperHeavyRaptors() {
        let rSeaPositions1: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas1, superHeavyOptions.rSeaRadius1 * sizeMult, superHeavyOptions.rSeaAngularOffset1);
        for (let i = 0; i < superHeavyOptions.numRSeas1; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, defaultThrottle, new Vector2(sizeMult - rSeaRealRadius - rSeaPositions1[i].z, rSeaPositions1[i].x + sizeMult - rSeaRealRadius))];
        }
        let rSeaPositions2: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas2, superHeavyOptions.rSeaRadius2 * sizeMult, superHeavyOptions.rSeaAngularOffset2);
        for (let i = 0; i < superHeavyOptions.numRSeas2; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, defaultThrottle, new Vector2(sizeMult - rSeaRealRadius - rSeaPositions2[i].z, rSeaPositions2[i].x + sizeMult - rSeaRealRadius))];
        }
        let rSeaPositions3: Vector3[] = MathHelper.getCircularPositions(superHeavyOptions.numRSeas3, superHeavyOptions.rSeaRadius3 * sizeMult, superHeavyOptions.rSeaAngularOffset3);
        for (let i = 0; i < superHeavyOptions.numRSeas3; i++) {
            superHeavyRaptors = [...superHeavyRaptors, new RaptorUI(true, defaultThrottle, new Vector2(sizeMult - rSeaRealRadius - rSeaPositions3[i].z, rSeaPositions3[i].x + sizeMult - rSeaRealRadius))];
        }
    }

    function convertToCustomize(str: string): string {
        str = StringHelper.makeCapitalizedSpaced(str);
        str = str.replace('Num', 'Number Of');
        str = str.replace('Scale', '');
        str = str.replace('Degrees', '');
        str = str.replace('R Sea', 'Raptor Sea Level');
        str = str.replace('R Vac', 'Raptor Vacuum');
        str = str.replace('1', 'Inner');
        str = str.replace('2', 'Middle');
        str = str.replace('3', 'Outer');
        str = str.replace('Aft L', 'Aft Left Flap');
        str = str.replace('Aft R', 'Aft Right Flap');
        str = str.replace('Forward L', 'Forward Left Flap');
        str = str.replace('Forward R', 'Forward Right Flap');
        str = str.replace('Hsr', 'Hot Staging Ring');
        return str;
    }

    function validate(): void {
        validateStarship();
        validateSuperHeavy();
    }

    function reset(): void {
        resetStarship();
        resetSuperHeavy();
    }

    function validateStarship(): void {
        let isCompletelyValidated: boolean = true;

        if (isCompletelyValidated) {
            starshipSettings.update((value) => {
                value.rSeaAngularOffset = starshipOptions.rSeaAngularOffsetDegrees * Math.PI / 180;
                value.rVacAngularOffset = starshipOptions.rVacAngularOffsetDegrees * Math.PI / 180;

                value.bodyHeightScale = starshipOptions.bodyHeightScale;
                
                value.forwardLHeightScale = starshipOptions.forwardLHeightScale;
                value.forwardLWidthScale = starshipOptions.forwardLWidthScale;
                value.forwardRHeightScale = starshipOptions.forwardRHeightScale;
                value.forwardRWidthScale = starshipOptions.forwardRWidthScale;
                value.aftLHeightScale = starshipOptions.aftLHeightScale;
                value.aftLWidthScale = starshipOptions.aftLWidthScale;
                value.aftRHeightScale = starshipOptions.aftRHeightScale;
                value.aftRWidthScale = starshipOptions.aftRWidthScale;

                value.rSeaRadius = starshipOptions.rSeaRadius;
                value.numRSeas = starshipOptions.numRSeas;

                value.rVacRadius = starshipOptions.rVacRadius;
                value.numRVacs = starshipOptions.numRVacs;
                
                return value;
            });
        }
    }

    function resetStarship(): void {
        starshipOptions = {
            bodyHeightScale: 1,

            forwardLHeightScale: 1,
            forwardLWidthScale: 1,
            forwardRHeightScale: 1,
            forwardRWidthScale: 1,
            aftLHeightScale: 1,
            aftLWidthScale: 1,
            aftRHeightScale: 1,
            aftRWidthScale: 1,

            rSeaRadius: StarshipConstants.R_SEA_RADIUS,
            numRSeas: StarshipConstants.NUM_R_SEAS,
            rSeaAngularOffset: StarshipConstants.R_SEA_ANGULAR_OFFSET,
            rSeaAngularOffsetDegrees: StarshipConstants.R_SEA_ANGULAR_OFFSET * 180 / Math.PI,

            rVacRadius: StarshipConstants.R_VAC_RADIUS,
            numRVacs: StarshipConstants.NUM_R_VACS,
            rVacAngularOffset: StarshipConstants.R_VAC_ANGULAR_OFFSET,
            rVacAngularOffsetDegrees: StarshipConstants.R_VAC_ANGULAR_OFFSET * 180 / Math.PI,
        };
        validateStarship();
    }

    function validateSuperHeavy(): void {
        let isCompletelyValidated: boolean = true;

        if (isCompletelyValidated) {
            superHeavySettings.update((value) => {
                value.gridFinAngularOffset = superHeavyOptions.gridFinAngularOffsetDegrees * Math.PI / 180;
                value.chineAngularOffset = superHeavyOptions.chineAngularOffsetDegrees * Math.PI / 180;

                value.rSeaAngularOffset1 = superHeavyOptions.rSeaAngularOffset1Degrees * Math.PI / 180;
                value.rSeaAngularOffset2 = superHeavyOptions.rSeaAngularOffset2Degrees * Math.PI / 180;
                value.rSeaAngularOffset3 = superHeavyOptions.rSeaAngularOffset3Degrees * Math.PI / 180;

                value.hsrHeightScale = superHeavyOptions.hsrHeightScale;
                value.bodyHeightScale = superHeavyOptions.bodyHeightScale;
                value.chineHeightScale = superHeavyOptions.chineHeightScale;
                value.numChines = superHeavyOptions.numChines;

                value.gridFinLengthScale = superHeavyOptions.gridFinLengthScale;
                value.gridFinWidthScale = superHeavyOptions.gridFinWidthScale;
                value.numGridFins = superHeavyOptions.numGridFins;

                value.rSeaRadius1 = superHeavyOptions.rSeaRadius1;
                value.numRSeas1 = superHeavyOptions.numRSeas1;

                value.rSeaRadius2 = superHeavyOptions.rSeaRadius2;
                value.numRSeas2 = superHeavyOptions.numRSeas2;

                value.rSeaRadius3 = superHeavyOptions.rSeaRadius3;
                value.numRSeas3 = superHeavyOptions.numRSeas3;
                
                return value;
            });
        }
    }

    function resetSuperHeavy(): void {
        superHeavyOptions = {
            hsrHeightScale: 1,
            bodyHeightScale: 1,

            numGridFins: SuperHeavyConstants.NUM_GRID_FINS,
            gridFinLengthScale: 1,
            gridFinWidthScale: 1,
            gridFinAngularOffset: SuperHeavyConstants.GRID_FIN_ANGULAR_OFFSET,
            gridFinAngularOffsetDegrees: SuperHeavyConstants.GRID_FIN_ANGULAR_OFFSET * 180 / Math.PI,

            numChines: SuperHeavyConstants.NUM_CHINES,
            chineHeightScale: 1,
            chineAngularOffset: SuperHeavyConstants.CHINE_ANGULAR_OFFSET,
            chineAngularOffsetDegrees: SuperHeavyConstants.CHINE_ANGULAR_OFFSET * 180 / Math.PI,

            numRSeas1: SuperHeavyConstants.NUM_R_SEAS_1,
            rSeaRadius1: SuperHeavyConstants.R_SEA_RADIUS_1,
            rSeaAngularOffset1: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_1,
            rSeaAngularOffset1Degrees: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_1 * 180 / Math.PI,

            numRSeas2: SuperHeavyConstants.NUM_R_SEAS_2,
            rSeaRadius2: SuperHeavyConstants.R_SEA_RADIUS_2,
            rSeaAngularOffset2: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_2,
            rSeaAngularOffset2Degrees: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_2 * 180 / Math.PI,

            numRSeas3: SuperHeavyConstants.NUM_R_SEAS_3,
            rSeaRadius3: SuperHeavyConstants.R_SEA_RADIUS_3,
            rSeaAngularOffset3: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_3,
            rSeaAngularOffset3Degrees: SuperHeavyConstants.R_SEA_ANGULAR_OFFSET_3 * 180 / Math.PI,
        };
        validateSuperHeavy();
    }

    let hasLeftBar: boolean = true;
    let hasRightBar: boolean = true;

    function hideShowLeftBar() {
        hasLeftBar = !hasLeftBar;
    }

    function hideShowRightBar() {
        hasRightBar = !hasRightBar;
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

    @keyframes slideInLeft {
        from {
            left: -50px;
        }
        to {
            left: 16px;
        }
    }

    @keyframes grow {
        from {
            width: 0;
            height: 0;
        }
        to {
            width: 104%;
            height: 104%;
        }
    }

    .customize-container {
        position: fixed;
        top: 0;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);

        animation: increaseOpacity 0.5s;
    }

    .customize-image {
        position: absolute;
        object-fit: contain;
        height: calc(100vh - 128px);
        max-width: 50px;
        left: 16px;
        top: 64px;
        user-select: none;

        animation: slideInLeft 0.5s, increaseOpacity 2s;
    }
    
    .customize-options {
        position: absolute;
        width: 150px;
        overflow: auto;
    }

    .customize-title {
        position: absolute;
        width: 134px;
        padding-left: 8px;
        padding-right: 8px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        user-select: none;
    }

    .customize-option-title {
        margin-top: 8px;
    }

    .customize-option {
        padding: 6px;
        text-align: center;
        font-size: 14px;
        user-select: none;
    }

    .customize-option-input {
        width: 80%;
        margin-top: 8px;
        padding-left: 6px;
        padding-right: 6px;
        padding-top: 4px;
        border: none;
        outline: none;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, 0.5);
        font-size: 14px;
        color: white;
        font-family: "M PLUS Code Latin", monospace;
        transition: background-color 0.2s, color 0.2s;

        &:hover {
            background-color: rgba(0, 0, 0, 0.75);
        }
    }

    .customize-raptor {
        position: absolute;
        border: solid white;
        border-radius: 100%;

        animation: increaseOpacity 4s;
    }

    .customize-raptor-throttle {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 100%;
        background-color: white;

        animation: grow 2s infinite alternate;
    }
    
    .customize-banner {
        position: fixed;
        top: 0;
        /* left: 390px;
        width: calc(100vw - 722px); */
        height: 32px;
        background-color: rgba(0, 0, 0, 0.5);
        user-select: none;
    }

    .customize-action {
        position: absolute;
        border: none;
        outline: none;
        background-color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
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
</style>

{#if hasLeftBar}
    <div class="customize-container" style="width: 390px; left: 0px;">
        <img class="customize-image" src={s25b9} alt="booster">
        <div class="customize-title" style="right:166px; top:16px;">Customize Starship</div>
        <div class="customize-options" style="right:166px; top: 56px; height: calc(100vh - 88px);">
            {#each Object.keys(starshipOptions) as option}
                {#if !(option.includes("AngularOffset") && !option.includes("Degrees")) && !convertToCustomize(option).includes('Raptor')}
                    <div class="customize-option">
                        <div class="customize-option-title">{convertToCustomize(option)}</div>
                        <input class="customize-option-input" type="number" bind:value={starshipOptions[option]}>
                    </div>
                {/if}
            {/each}
        </div>
        <div class="customize-title" style="right:16px; top:16px;">Customize Superheavy</div>
        <div class="customize-options" style="right:16px; top: 56px; height: calc(100vh - 88px);">
            {#each Object.keys(superHeavyOptions) as option}
                {#if !(option.includes("AngularOffset") && !option.includes("Degrees")) && !convertToCustomize(option).includes('Raptor')}
                    <div class="customize-option">
                        <div class="customize-option-title">{convertToCustomize(option)}</div>
                        <input class="customize-option-input" type="number" bind:value={superHeavyOptions[option]}>
                    </div>
                {/if}
            {/each}
        </div>
        <button class="customize-action" style="left: 0; bottom: 0; width: 100%; height: 24px;" on:click={hideShowLeftBar}>Hide Left</button>
    </div>
{/if}
{#if hasRightBar}
    <div class="customize-container" style="width: 340px; right: 0px;">
        {#each starshipRaptors as raptor}
            <div class="customize-raptor" style="border-width: {border}px; width: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; height: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; right: {raptor.position.x + posOffset + 152}px; top: {raptor.position.y + posOffset}px;">
                <div class="customize-raptor-throttle" style="width: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px; height: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px"></div>
            </div>
        {/each}
        {#each superHeavyRaptors as raptor}
            <div class="customize-raptor" style="border-width: {border}px; width: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; height: {raptor.isSea ? rSeaRadius*2 : rVacRadius*2}px; right: {raptor.position.x + posOffset}px; top: {raptor.position.y + posOffset}px;">
                <div class="customize-raptor-throttle" style="width: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px; height: {raptor.isSea ? raptor.throttle * rSeaRealRadius * 2 : raptor.throttle * rVacRealRadius * 2}px"></div>
            </div>
        {/each}
        <div class="customize-title" style="right:166px; top:170px;">Customize Starship</div>
        <div class="customize-options" style="right:166px; top: 220px; height: calc(100vh - 252px);">
            {#each Object.keys(starshipOptions) as option}
                {#if !(option.includes("AngularOffset") && !option.includes("Degrees")) && convertToCustomize(option).includes('Raptor')}
                    <div class="customize-option">
                        <div class="customize-option-title">{convertToCustomize(option)}</div>
                        <input class="customize-option-input" type="number" bind:value={starshipOptions[option]}>
                    </div>
                {/if}
            {/each}
        </div>
        <div class="customize-title" style="right:16px; top:170px;">Customize Superheavy</div>
        <div class="customize-options" style="right:16px; top: 220px; height: calc(100vh - 252px);">
            {#each Object.keys(superHeavyOptions) as option}
                {#if !(option.includes("AngularOffset") && !option.includes("Degrees")) && convertToCustomize(option).includes('Raptor')}
                    <div class="customize-option">
                        <div class="customize-option-title">{convertToCustomize(option)}</div>
                        <input class="customize-option-input" type="number" bind:value={superHeavyOptions[option]}>
                    </div>
                {/if}
            {/each}
        </div>
        <button class="customize-action" style="right: 0; bottom: 0; width: 100%; height: 24px;" on:click={hideShowRightBar}>Hide Right</button>
    </div>
{/if}
<div class="customize-banner" style={hasLeftBar ? hasRightBar ? "left: 390px; width: calc(100vw - 390px - 340px);" : "left: 390px; width: calc(100vw - 390px);" : hasRightBar ? "left: 0; width: calc(100vw - 340px);" : "left: 0; width: 100vw;"}>
    {#if !hasLeftBar}
        <button class="customize-action" style="left:0; top: 0; width: 20%; height: 100%; border-right: 1px solid white;" on:click={hideShowLeftBar}>Show Left</button>
    {/if}
    {#if !hasRightBar}
        <button class="customize-action" style="right:0; top: 0; width: 20%; height: 100%; border-left: 1px solid white;" on:click={hideShowRightBar}>Show Right</button>
    {/if}
    <button class="customize-action" style="left:{hasLeftBar ? '0' : '20%'}; top: 0; width: {hasLeftBar && hasRightBar ? '50%' : !hasLeftBar && !hasRightBar ? '30%' : '40%'}; height: 100%; border-right: 1px solid white;" on:click={validate}>Validate</button>
    <button class="customize-action" style="right:{hasRightBar ? '0' : '20%'}; top: 0; width: {hasLeftBar && hasRightBar ? '50%' : !hasLeftBar && !hasRightBar ? '30%' : '40%'}; height: 100%;" on:click={reset}>Reset</button>
</div>