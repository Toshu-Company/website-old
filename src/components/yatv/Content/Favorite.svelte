<script lang="ts">
  import HeartIcon from "../../../assets/heart.svg";
  import HeartFillIcon from "../../../assets/heart-fill.svg";
  import type { VirtualProvider } from "../../../libs/source/twitter";
  import { Yatv } from "../../../libs/api";

  export let info: Yatv.SearchResultVideo;
  export let provider: VirtualProvider<Yatv.SearchResultVideo>;

  const { favorite: store } = provider;
  const favorite = store.use("svelte");

  let favorited = false;

  $: (async () => {
    favorited = await (store.Type === "object"
      ? store.includes(info)
      : store.includes(info.id));
  })(),
    [$favorite];

  async function toggle() {
    if (store.Type === "object") {
      if (await store.includes(info)) {
        await store.remove(info);
      } else {
        await store.add(info);
      }
    } else {
      if (await store.includes(info.id)) {
        await store.remove(info.id);
      } else {
        await store.add(info.id);
      }
    }
  }
</script>

<button on:click={toggle}>
  <img
    src={favorited ? HeartFillIcon.src : HeartIcon.src}
    width="24"
    alt="Favorites"
  />
</button>

<style>
  button {
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  img {
    @media screen and (max-width: 768px) {
      width: 20px;
    }
  }
</style>
