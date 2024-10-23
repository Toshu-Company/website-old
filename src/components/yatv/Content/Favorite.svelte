<script lang="ts">
  import HeartIcon from "../../../assets/heart.svg";
  import HeartFillIcon from "../../../assets/heart-fill.svg";
  import { favorite } from "../../../store/yatv/favorite";

  export let id: string;

  function toggle() {
    if ($favorite.includes(id)) {
      favorite.set($favorite.filter((x) => x !== id));
    } else {
      favorite.set($favorite.concat(id));
    }
  }
</script>

<button on:click={toggle}>
  <img
    src={$favorite.includes(id) ? HeartFillIcon.src : HeartIcon.src}
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
