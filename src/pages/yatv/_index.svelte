<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";
  import Common from "../../components/Content";
  import Item from "../../components/yatv/Content/Item.svelte";
  import { YatvProvider } from "../../libs/source/yatv.ts";
  import type { List } from "../../libs/source/twitter.ts";
  import type { SearchResultVideo } from "../../libs/api/yatv.ts";

  const provider = new YatvProvider();

  let loading = true;
  let observed = false;
  let page = 1;
  let videos: List<SearchResultVideo>["videos"] = [];
  let element: HTMLDivElement;

  async function fetch(page: number) {
    const data = await provider.getVideoList(page);
    videos = videos.concat(data.videos);
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
      {#each videos as video, i (video.id)}
        <Item {provider} videoInfo={video} />
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
