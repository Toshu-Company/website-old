<script lang="ts">
  import type { VideoInfo } from "../../../libs/api/lover";
  import { setting as common } from "../../../store/setting";
  import { setting as twitter } from "../../../store/twitter/setting";
  import { translateVideoURL } from "../../../scripts/thumbnail";
  import Default from "../../Modal/Default.svelte";
  import Favorite from "../Content/Favorite.svelte";
  import Hls from "hls.js";

  let videoRef: HTMLVideoElement;

  export let close: () => void;
  export let detail: VideoInfo;

  $: if (videoRef) {
    if (!$common.censored && Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 60 * 2,
      });
      hls.loadSource(translateVideoURL(detail.video));
      hls.attachMedia(videoRef);
      videoRef.focus();
    } else if (videoRef.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.src = translateVideoURL(detail.video);
    } else {
      videoRef.src =
        "https://file-examples.com/storage/fe7e31ec4b64ff77da87142/2017/04/file_example_MP4_480_1_5MG.mp4";
    }
  }
</script>

<Default maxWidth={1200} {close}>
  <div class="wrapper">
    <video
      bind:this={videoRef}
      controls
      loop={$twitter.loop}
      autoplay={$twitter.autoPlay}
    >
      <track kind="captions" />
    </video>
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
