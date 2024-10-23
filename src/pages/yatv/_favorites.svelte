<script>
  import Container from "../../components/Content/Container.svelte";
  import Item from "../../components/yatv/Content/Item.svelte";
  import { PersistentStore } from "../../libs/source/twitter";
  import { YatvProvider } from "../../libs/source/yatv";

  const provider = new YatvProvider();

  const favorite = provider.favorite.use("svelte");

  async function migrate() {
    const old = new PersistentStore("yatv", null);
    const data = await Promise.all(
      old.export().map((v) => provider.getVideo(v))
    );
    console.log(data);
    if (provider.favorite.Type === "object") {
      console.log("object");
      await provider.favorite.import(data);
      console.log("imported");
    }
  }
</script>

<div class="wrapper">
  <button on:click={() => migrate()}>Migrate</button>
  <Container>
    {#each $favorite as v (v.id)}
      <Item videoInfo={v} />
    {/each}
  </Container>
</div>
