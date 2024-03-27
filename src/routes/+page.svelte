<script lang="ts">
  import App from '$lib/components/App.svelte'
</script>

<svelte:head>
  <title>IFT-X</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</svelte:head>

<div class="app">
  <App />
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  * { 
    color: white;
    text-shadow: 0 0 1rem #ffffff;
    font-family: 'Poppins', sans-serif;
  }

  .app {
    width: 100vw;
    height: 100vh;
  }
</style>
