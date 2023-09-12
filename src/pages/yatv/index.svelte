<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";
  import Common from "../../components/Content";
  import Item from "../../components/yatv/Content/Item.svelte";
  import { Yatv } from "../../libs/api";

  let loading = true;
  let observed = false;
  let page = 1;
  let videos: Yatv.SearchResultVideo[] = [];
  let element: HTMLDivElement;

  async function fetch(page: number) {
    const data = await Yatv.getIndex(page);
    videos = videos.concat(data);
  }

  $: {
    fetch(page).then(() => {
      loading = false;
      observed = false;
    });
  }
</script>

<div class="wrapper">
  <Common.Container>
    {#if loading}
      {#each Array(10) as _}
        <Common.Skeleton />
      {/each}
    {:else}
      {#each videos as video, i}
        <Item videoInfo={video} />
      {/each}
    {/if}
    <IntersectionObserver
      {element}
      on:intersect={() => {
        if (!observed) {
          observed = true;
          page++;
        }
      }}
    >
      <div bind:this={element} data-visible={videos.length > 0}>Loading...</div>
    </IntersectionObserver>
  </Common.Container>
</div>

<style lang="scss">
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      &[data-visible="true"] {
        display: block;
      }
      &[data-visible="false"] {
        display: none;
      }
    }
  }
</style>
