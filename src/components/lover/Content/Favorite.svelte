<script lang="ts">
  import { favorite } from "../../../store/lover/favorite";
  import HeartIcon from "../../../assets/heart.svg";
  import HeartFillIcon from "../../../assets/heart-fill.svg";

  export let videoId: string;
</script>

<span
  class="image-button"
  on:click={() => {
    if ($favorite.includes(videoId)) {
      $favorite = $favorite.filter((id) => id !== videoId);
    } else {
      $favorite = [...$favorite, videoId];
    }
  }}
>
  <img
    src={$favorite.includes(videoId) ? HeartFillIcon.src : HeartIcon.src}
    width="24"
    alt="Favorites"
  />
</span>

<style>
  .image-button {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
</style>
