<script>
  import Container from "../../components/Content/Container.svelte";
  import Item from "../../components/lover/Content/Item.svelte";
  import { favorite } from "../../store/lover/favorite";
</script>

<div class="wrapper">
  <Container>
    {#each $favorite as v, i}
      <Item videoId={v} />
    {/each}
  </Container>
</div>
