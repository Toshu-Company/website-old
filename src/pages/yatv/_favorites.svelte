<script>
  import Container from "../../components/Content/Container.svelte";
  import Item from "../../components/yatv/Content/Item.svelte";
  import { YatvProvider } from "../../libs/source/yatv";

  const provider = new YatvProvider();

  const favorite = provider.favorite.use("svelte");
</script>

<div class="wrapper">
  <Container>
    {#each $favorite as v (v.id)}
      <Item videoInfo={v} />
    {/each}
  </Container>
</div>
