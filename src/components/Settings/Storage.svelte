<script lang="ts">
  function exportData() {
    console.log("Exporting data...");

    let data: Record<string, any> = {};
    for (let key in localStorage) {
      if (key.startsWith("cache:")) continue;
      data[key] = localStorage.getItem(key);
    }

    navigator.clipboard.writeText(JSON.stringify(data));

    alert("Data copied to clipboard!");
  }

  function importData() {
    console.log("Importing data...");

    let data = prompt("Paste data here:");
    if (!data) return;

    let parsedData = JSON.parse(data);

    localStorage.clear();
    for (let key in parsedData) {
      localStorage.setItem(key, parsedData[key]);
    }

    alert("Data imported!");
  }

  function mergeData() {
    console.log("Merging data...");

    let data = prompt("Paste data here:");
    if (!data) return;

    let parsedData = JSON.parse(data);

    for (let key in parsedData) {
      let existing = localStorage.getItem(key) ?? ({} as any);
      merge(existing, parsedData[key]);
      localStorage.setItem(key, existing);
    }

    alert("Data merged!");
  }

  function clearCache() {
    console.log("Exporting data...");

    let data: Record<string, any> = {};
    for (let key in localStorage) {
      if (key.startsWith("cache:")) localStorage.removeItem(key);
    }

    location.reload();
  }

  function merge(a: any, b: any) {
    for (let key in b) {
      if (typeof b[key] === "object") {
        merge(a[key], b[key]);
      } else {
        a[key] = b[key];
      }
    }
  }
</script>

<div class="wrapper">
  <button on:click={() => importData()}> Import </button>
  <button on:click={() => exportData()}> Export </button>
  <button on:click={() => mergeData()}> Merge </button>
  <button on:click={() => clearCache()}> Clear Cache </button>
</div>

<style>
  .wrapper {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
  }

  button {
    width: 100%;
    height: 48px;

    /* background-color: #000000; */
    background-color: #313131;
    color: #ffffff;

    border: none;
    border-radius: 8px;

    font-size: 24px;
    font-weight: bold;

    cursor: pointer;
  }
</style>
