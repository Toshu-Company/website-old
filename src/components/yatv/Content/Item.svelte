<script lang="ts">
  import { setting as common } from "../../../store/setting";
  import Loading from "../../../assets/loading.jpg";
  import { Yatv } from "../../../libs/api";
  import Detail from "../Modal/Detail.svelte";

  export let videoInfo: Yatv.SearchResultVideo;

  let modal = false;
  let imageUrl: string;

  $: if (videoInfo.thumbnail) {
    Yatv.mirror(videoInfo.thumbnail)
      .then((res) => res.blob())
      .then((blob) => {
        imageUrl = URL.createObjectURL(blob);
      });
  } else {
    Yatv.getVideo(videoInfo.url).then((res) => {
      videoInfo.thumbnail = res.thumbnail;
    });
  }
</script>

<button class="wrapper" on:click={() => (modal = true)}>
  <div class="image-wrapper">
    {#if $common.censored}
      <img src={Loading.src} alt="Loading" />
    {:else if imageUrl}
      <img src={imageUrl} alt="Thumbnail" />
    {:else}
      <div class="gradient" />
    {/if}
  </div>
  <div class="text-wrapper">
    <p>
      {$common.censored ? "Good Picture 👍" : videoInfo?.title ?? "\u00a0"}
    </p>
  </div>
</button>
{#if modal}
  <Detail info={videoInfo} close={() => (modal = false)} />
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
    height: 284px;
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

  .text-wrapper {
    width: 100%;
    flex: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    p {
      min-height: 18px;
      font-size: 16px;
      font-weight: 500;
      color: #dbdbdb;

      @media (max-width: 772px) {
        font-size: 14px;
      }
    }
  }

  img {
    border-radius: 8px 8px 0 0;
    width: 100%;
    height: 100%;
  }

  .gradient {
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent, #000);
  }
</style>
