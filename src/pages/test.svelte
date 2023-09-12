<script>
  import Modal from "../components/Modal";
  import Default from "../components/Modal/Default.svelte";

  let count = 0;
  $: doubled = count * 2;

  $: if (count >= 10) {
    alert("카운트가 10을 넘었습니다. ");
    count = 9;
  }

  function handleClick() {
    // 이벤트 코드
    count += 1;
  }

  let modal = true;
</script>

<button on:click={handleClick}>
  클릭수 {count}
  {count === 1 ? "time" : "times"}
</button>
{#if modal}
  <Default close={() => (modal = false)} />
{/if}

<p>{count} 두배는 {doubled}</p>
<p />
