<script lang="ts">
  import { setting as common } from "../../../store/setting";
  import { setting as twitter } from "../../../store/twitter/setting";
  import Default from "../../Modal/Default.svelte";
  import Hls from "hls.js";
  import { Yatv } from "../../../libs/api";
  import { MIRROR_URL } from "../../../libs/api/yatv";
  import Favorite from "../Content/Favorite.svelte";
  import type { VirtualProvider } from "../../../libs/source/twitter";
  import { onDestroy } from "svelte";

  let videoRef: HTMLVideoElement;

  export let close: () => void;
  export let info: Yatv.SearchResultVideo;
  export let provider: VirtualProvider<Yatv.SearchResultVideo>;

  let detail: Yatv.VideoDetailInfo | null = null;

  Yatv.getVideo(info.url).then((res) => {
    detail = res;
  });

  console.log(detail);

  $: if (videoRef && detail) {
    if (!$common.censored && Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 60 * 2,
        xhrSetup(xhr, url) {
          const encoded = btoa(url);
          xhr.open("GET", `${MIRROR_URL}?url=${encoded}`, true);
          // xhr.open("POST", Yatv.MIRROR_URL, true);
          // xhr.setRequestHeader("Content-Type", "application/json");
          // xhr.send(
          //   JSON.stringify({
          //     url,
          //   })
          // );
          // xhr.send = () => {};
        },
      });
      hls.loadSource(detail.video);
      hls.attachMedia(videoRef);
      videoRef.focus();
    } else {
      videoRef.src =
        "https://file-examples.com/storage/fe7e31ec4b64ff77da87142/2017/04/file_example_MP4_480_1_5MG.mp4";
    }
  }

  onDestroy(() => {
    if (videoRef) {
      videoRef.pause();
      videoRef.removeAttribute("src");
      videoRef.load();
    }
  });
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
      <a
        href={`https://yatv1.com${info.url}`}
        class="external-link"
        target="_blank"
      >
        <h1 class="title">
          {$common.censored ? "Good Picture 👍" : (info.title ?? "\u00a0")}
        </h1>
      </a>
      <div class="menu">
        <Favorite {provider} {info} />
      </div>
    </div>
    <!-- <a href="/test" class="external-link">
      <h2 class="user">@any_user</h2>
    </a> -->
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

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: white;
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
