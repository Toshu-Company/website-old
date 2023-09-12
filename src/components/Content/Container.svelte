<div class="wrapper">
  <slot />
</div>

<style>
  .wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    align-items: flex-start;
    align-content: flex-start;
  }
</style>
