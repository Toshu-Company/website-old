import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Blob } from "buffer";

const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm";

const _cache = new Map<string, string>();
const cachedBlobURL = async (url: string, mimeType: string) => {
  if (_cache.has(url)) {
    return _cache.get(url);
  }
  const blobURL = await toBlobURL(url, mimeType);
  _cache.set(url, blobURL);
  return blobURL;
};

class Worker {
  static workers: Worker[] = [];
  static get count() {
    return Worker.workers.length;
  }
  static get usedCount() {
    return Worker.workers.filter((worker) => worker.used).length;
  }

  public used = false;
  public ffmpeg: FFmpeg;
  constructor() {
    this.ffmpeg = new FFmpeg();
    Worker.workers.push(this);
  }

  async load() {
    console.log("loading ffmpeg");
    await this.ffmpeg
      .load({
        coreURL: await cachedBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await cachedBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      })
      .catch(console.error);
    console.log("ffmpeg loaded");
  }

  async close() {
    this.used = false;
  }

  static async getWorker() {
    const worker =
      Worker.workers.find((worker) => !worker.used) ?? new Worker();
    worker.used = true;
    if (!worker.ffmpeg.loaded) {
      await worker.load();
    }
    console.log("workers", Worker.count);
    console.log("used", Worker.usedCount);
    return worker;
  }
}

const setFile = async (key: string, blob: any) => {
  const dataUrl = await blobToDataURL(blob);
  localStorage.setItem(key, dataUrl);
};

const getFile = async (key: string) => {
  const dataUrl = localStorage.getItem(key);
  if (dataUrl) {
    return dataURLtoBlob(dataUrl);
  }
};

export const translateVideoURL = (video: string) => {
  const url = new URL(video);
  return `${import.meta.env.PUBLIC_TWITTER_API_URL}/lover${url.pathname}`;
};

export const getThumbnail = async (video: string) => {
  if (typeof window !== "undefined") {
    const cached = await getFile(video);
    if (cached) {
      return URL.createObjectURL(cached);
    }
  }
  const worker = await Worker.getWorker();
  const ffmpeg = worker.ffmpeg;
  await ffmpeg.writeFile("input.m3u8", await fetchFile(video));
  await ffmpeg.writeFile(
    "segmentNo0.js",
    await fetchFile(video.split("/").slice(0, -1).join("/") + "/segmentNo0.js")
  );
  await ffmpeg.exec([
    "-allowed_extensions",
    "ALL",
    "-i",
    "input.m3u8",
    "-ss",
    "00:00:00.000",
    "-vframes",
    "1",
    "-vf",
    "scale=320:-1",
    "output.jpg",
  ]);
  const data = await ffmpeg.readFile("output.jpg");
  worker.close();
  if (typeof data === "string") {
    return data;
  }
  if (typeof window === "undefined") {
    return data;
  }
  const blob: any = new Blob([data], { type: "image/jpeg" });
  setFile(video, blob);
  return URL.createObjectURL(blob);
};

//**dataURL to blob**
function dataURLtoBlob(dataurl: string): any {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

//**blob to dataURL**
async function blobToDataURL(blob: any) {
  return new Promise<string>((resolve, reject) => {
    var a = new FileReader();
    a.onload = function (e) {
      resolve(e.target?.result as string);
    };
    a.readAsDataURL(blob);
  });
}
