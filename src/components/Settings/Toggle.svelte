<script lang="ts">
  import * as Twitter from "../../store/twitter/setting";
  import * as Hitomi from "../../store/hitomi/setting";
  import * as Common from "../../store/setting";
  import * as Lover from "../../store/lover/setting";
  import type { MapStore } from "nanostores";

  export let id: string | undefined = undefined;
  export let label: string;
  export let store:
    | {
        key: keyof Twitter.RawSetting;
        store: "twitter";
      }
    | {
        key: keyof Hitomi.RawSetting;
        store: "hitomi";
      }
    | {
        key: keyof Common.RawSetting;
        store: "common";
      }
    | {
        key: keyof Lover.RawSetting;
        store: "lover";
      }
    | undefined = undefined;

  const setting: MapStore | undefined = (() => {
    switch (store?.store) {
      case "twitter":
        return Twitter.$setting;
      case "hitomi":
        return Hitomi.$setting;
      case "common":
        return Common.$setting;
      case "lover":
        return Lover.$setting;
      default:
        throw new Error("store is undefined");
    }
  })();

  let isOn = (store && setting?.get()[store.key]) ?? false;

  function handleToggle() {
    isOn = !isOn;
    store && setting?.setKey(store.key, isOn);
  }
</script>

<div class="wrapper">
  <div class="label">{label}</div>
  <div class="switch" on:click={handleToggle}>
    <input type="checkbox" {id} bind:checked={isOn} readonly />
    <span class="slider" />
  </div>
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .label {
    margin-right: 16px;
    font-size: 28px;
  }

  .switch {
    position: relative;
    width: 60px;
    height: 34px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
      border-radius: 50%;
    }

    input:checked + & {
      background-color: #2196f3;
    }

    input:checked + &:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }
  }
</style>
