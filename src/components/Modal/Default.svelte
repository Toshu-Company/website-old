<script>
  export let maxWidth = 500;
  export let close;
</script>

<div class="wrapper" on:click={close()}>
  <div
    class="container"
    style={`
    max-width: ${maxWidth}px;
    max-height: calc(100vh - 100px);
  `}
    on:click={(e) => e.stopPropagation()}
  >
    <slot />
  </div>
</div>

<style lang="scss">
  @keyframes animation {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;

    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);

    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    width: 80%;
    padding: 20px;
    border-radius: 10px;
    background-color: #1a1a1a;

    animation: animation 0.2s ease-in-out;
  }
</style>
