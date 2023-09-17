<script>
  import Container from "../../components/Content/Container.svelte";
  import Item from "../../components/yatv/Content/Item.svelte";
  import { favorite } from "../../store/yatv/favorite";
</script>

<div class="wrapper">
  <Container>
    {#each $favorite as v, i}
      <Item
        videoInfo={{
          url: v,
        }}
      />
    {/each}
  </Container>
</div>
