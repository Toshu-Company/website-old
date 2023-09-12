<script lang="ts">
  import type { VideoInfo } from "../../../libs/api/lover";
  import { setting as common } from "../../../store/setting";
  import { translateVideoURL } from "../../../scripts/thumbnail";
  import Default from "../../Modal/Default.svelte";
  import Hls from "hls.js";
  import Favorite from "../Content/Favorite.svelte";

  let videoRef: HTMLVideoElement;

  export let close: () => void;
  export let detail: VideoInfo;

  $: if (videoRef) {
    if (!$common.censored && Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 60 * 60,
      });
      hls.loadSource(translateVideoURL(detail.video));
      hls.attachMedia(videoRef);
    } else {
      videoRef.src = "https://youtu.be/0bIRwBpBcZQ";
    }
  }
</script>

<Default maxWidth={1200} {close}>
  <div class="wrapper">
    <video bind:this={videoRef} controls autofocus />
    <div class="top-row">
      <div class="menu">
        <Favorite videoId={detail.id} />
      </div>
    </div>
    <a href="/test" class="external-link">
      <h2 class="title">
        {$common.censored ? "Good Picture 👍" : detail.title ?? "\u00a0"}
      </h2>
    </a>
  </div>
</Default>

<style lang="scss">
  .wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  video {
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 9;
  }

  .top-row {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .menu {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  h2 {
    font-size: 24px;
    font-weight: 500;
    color: white;
    white-space: pre-wrap;

    @media screen and (max-width: 768px) {
      font-size: 18px;
    }
  }
</style>
