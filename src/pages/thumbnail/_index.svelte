<script lang="ts">
  import { setting as common } from "../../store/setting";
  import Common from "../../components/Content";
  import Loading from "../../assets/loading.jpg";
  import Thumbnail from "./_thumbnail.svelte";

  async function getThumbnails() {
    const cache = await caches.open("thumbnail");
    return await cache.keys();
  }
</script>

<div class="wrapper">
  <Common.Container>
    {#await getThumbnails() then thumbnails}
      {#if thumbnails.length > 0}
        {#each thumbnails as thumbnail}
          <Thumbnail src={thumbnail.url} />
        {/each}
      {:else}
        <p>No thumbnails found</p>
      {/if}
    {/await}
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
