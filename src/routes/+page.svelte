<script lang="ts">
  import App from '$lib/components/App.svelte'
</script>

<svelte:head>
  <title>IFT-X</title>
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Code+Latin:wght@100..700&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
  <App />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  * { 
    color: white;
    /* text-shadow: 0 0 1rem #ffffff; */
    font-family: "M PLUS Code Latin", monospace;
  }

  .app {
    width: 100vw;
    height: 100vh;
  }
</style>
