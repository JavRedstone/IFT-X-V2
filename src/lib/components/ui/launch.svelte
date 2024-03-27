<script lang="ts">


    function createSuperHeavyRaptors() {

    }
</script>
<style>
    .launch-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 125px;
        background-color: rgba(0, 0, 0, 0.75);
    }

    .r-sea-off {
        /* position: fixed; */
        width: 16px;
        height: 16px;
        border: 2px solid white;
        border-radius: 100%;
    }

    .r-sea-on {
        /* position: fixed; */
        width: 16px;
        height: 16px;
        border: 2px solid white;
        border-radius: 100%;
        background-color: white;
    }

    .r-vac-off {
        /* position: fixed; */
        width: 36px;
        height: 36px;
        border: 2px solid white;
        border-radius: 100%;
    }

    .r-vac-on {
        /* position: fixed; */
        width: 36px;
        height: 36px;
        border: 2px solid white;
        border-radius: 100%;
        background-color: white;
    }
</style>
<div class="launch-container">
    <div class="r-sea-off"></div>
    <div class="r-sea-on"></div>
    <div class="r-vac-off"></div>
    <div class="r-vac-on"></div>
</div>