<script lang="ts">
  import { setting as common } from "../../store/setting";
  import { longpress } from "../../scripts/longpress";
  import Loading from "../../assets/loading.jpg";
  import Default from "../../components/Modal/Default.svelte";

  export let src: string;

  let modal = false;
  let visible = true;

  async function fetchThumbnail(src: string) {
    const cache = await caches.open("thumbnail");
    const response = await cache.match(src);

    if (response && (await response.clone().arrayBuffer()).byteLength > 0) {
      return URL.createObjectURL(await response.blob());
    }

    visible = false;
    return null;
  }

  function onLongPress(e: TouchEvent) {
    const res = confirm("Do you want to delete this thumbnail?");
    if (res) {
      caches.open("thumbnail").then((cache) => cache.delete(src));
      visible = false;
    }
  }
</script>

{#if visible}
  <button
    class="wrapper"
    on:click={() => (modal = true)}
    use:longpress
    on:longpress={onLongPress}
  >
    <div class="image-wrapper">
      {#if $common.censored}
        <img src={Loading.src} alt="Loading" />
      {:else}
        {#await fetchThumbnail(src)}
          <div class="gradient" />
        {:then imageUrl}
          <img src={imageUrl} alt="Thumbnail" />
        {/await}
      {/if}
    </div>
  </button>
{/if}

{#if modal}
  <Default maxWidth={1200} close={() => (modal = false)}>
    {#await fetchThumbnail(src)}
      <div class="gradient" />
    {:then imageUrl}
      <img src={imageUrl} class="modal" alt="Thumbnail" />
    {/await}
  </Default>
{/if}

<style lang="scss">
  @keyframes animation {
    from {
      opacity: 0.3;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  .wrapper {
    width: 244px;
    height: 244px;
    border-radius: 10px;

    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: #313131;
    transition: all 0.1s ease-in-out;

    @media (max-width: 772px) {
      width: calc(50% - 10px);
      aspect-ratio: 1;
      height: auto;
    }

    &:hover {
      opacity: 0.8;
      transform: translateY(-5px);
    }

    &:active {
      opacity: 0.6;
      transform: translateY(0px);
    }
  }

  .image-wrapper {
    width: 100%;
    height: 244px;
    border-radius: 8px;

    @media (max-width: 772px) {
      aspect-ratio: 1 / 1;
      height: auto;
      overflow: hidden;
    }
  }

  img {
    border-radius: 8px 8px 0 0;
    width: 100%;
    height: 100%;

    &.modal {
      border-radius: 0;
      width: auto;
      height: 100%;
      margin-left: auto;
      margin-right: auto;
      max-height: calc(100vh - 140px);
    }
  }

  .gradient {
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent, #000);
  }
</style>
