<button class="wrapper">
  <div class="image-wrapper">
    <div class="gradient" />
  </div>
  <div class="text-wrapper">
    <p>&nbsp;</p>
  </div>
</button>

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

  .gradient {
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent, #000);
  }
</style>
