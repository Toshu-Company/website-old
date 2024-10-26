<script lang="ts">
  import Common from "../../components/Content";
  import Thumbnail from "./_thumbnail.svelte";
  import { onMount } from "svelte";

  let thumbnails: Awaited<ReturnType<typeof getThumbnails>> = [];

  async function getThumbnails() {
    const cache = await caches.open("thumbnail");
    return await cache.keys();
  }

  onMount(() => {
    const timer = setInterval(async () => {
      thumbnails = await getThumbnails();
    }, 1000 * 5);

    return () => clearInterval(timer);
  });
</script>

<div class="wrapper">
  <Common.Container>
    {#if thumbnails.length > 0}
      {#each thumbnails as thumbnail (thumbnail.url)}
        <Thumbnail src={thumbnail.url} />
      {/each}
    {/if}
  </Common.Container>
</div>

<style lang="scss">
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
