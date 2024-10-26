<script lang="ts">
  function downloadFile(filename: string, text: string) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function openFile() {
    return new Promise<string>((resolve, reject) => {
      var input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = (e) => {
        var file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return reject("No file selected");

        var reader = new FileReader();
        reader.onload = (e) => {
          var contents = e.target?.result as string;
          resolve(contents);
        };
        reader.readAsText(file);
      };
      input.click();
    });
  }

  function exportData() {
    console.log("Exporting data...");

    let data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith("cache:")) continue;
      data[key] = localStorage.getItem(key);
    }

    // navigator.clipboard.writeText(JSON.stringify(data));
    downloadFile(`data-${Date.now()}.json`, JSON.stringify(data));

    // alert("Data copied to clipboard!");
    alert("Data exported!");
  }

  async function importData() {
    console.log("Importing data...");

    // let data = prompt("Paste data here:");
    let data = await openFile();
    if (!data) return;

    let parsedData = JSON.parse(data);

    localStorage.clear();
    for (let key in parsedData) {
      localStorage.setItem(key, parsedData[key]);
    }

    alert("Data imported!");

    location.reload();
  }

  async function mergeData() {
    console.log("Merging data...");

    // let data = prompt("Paste data here:");
    let data = await openFile();
    if (!data) return;

    let parsedData = JSON.parse(data);

    for (let key in parsedData) {
      let existing = localStorage.getItem(key) ?? "";
      try {
        existing = JSON.parse(existing);
        const parsed = JSON.parse(parsedData[key]);
        existing = merge(existing, parsed);
        localStorage.setItem(key, JSON.stringify(existing));
      } catch (e) {
        localStorage.setItem(key, parsedData[key]);
      }
    }

    alert("Data merged!");
  }

  function clearCache() {
    console.log("Clearing data...");

    for (let key in localStorage) {
      if (key.startsWith("cache:")) localStorage.removeItem(key);
    }

    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });

    location.reload();
  }

  function merge(a: any, b: any) {
    if (Array.isArray(a) && Array.isArray(b)) return a.concat(b);
    for (let key in b) {
      if (typeof b[key] === "object") {
        merge(a[key], b[key]);
      } else {
        a[key] = b[key];
      }
    }
    return a;
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
