<svelte:head>
  <title>IFT-X</title>
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Code+Latin:wght@100..700&display=swap" rel="stylesheet">
</svelte:head>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    :global(html) {
        color: white;
        /* text-shadow: 0 0 1rem #ffffff; */
        font-family: "M PLUS Code Latin", monospace;
    }

    :global(::-webkit-scrollbar) {
        width: 0.5rem;
        height: 0.5rem;
    }

    :global(::-webkit-scrollbar-thumb) {
        border-radius: 3px;

        background-color: #ffffff40;
    }

    :global(::-webkit-scrollbar-thumb:hover) {
        background-color: #ffffff80
    }
</style>
<slot></slot>