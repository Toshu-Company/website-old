import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Blob } from "buffer";

const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm";

const workers: {
  ffmpeg: FFmpeg;
  used: boolean;
}[] = [];

const generateWorker = async () => {
  const ffmpeg = new FFmpeg();
  await load(ffmpeg);
  const worker = {
    ffmpeg,
    used: false,
  };
  workers.push(worker);
  return worker;
};

export const getWorker = async () => {
  const worker =
    workers.find((worker) => !worker.used) ?? (await generateWorker());
  worker.used = true;
  return worker;
};

const _cache = new Map<string, string>();
const cachedBlobURL = async (url: string, mimeType: string) => {
  if (_cache.has(url)) {
    return _cache.get(url);
  }
  const blobURL = await toBlobURL(url, mimeType);
  _cache.set(url, blobURL);
  return blobURL;
};

const load = async (ffmpeg: FFmpeg) => {
  console.log("loading ffmpeg");
  await ffmpeg
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
};

export const translateVideoURL = (video: string) => {
  const url = new URL(video);
  return `${import.meta.env.PUBLIC_TWITTER_API_URL}/lover${url.pathname}`;
};

export const getThumbnail = async (video: string) => {
  const worker = await getWorker();
  const ffmpeg = worker.ffmpeg;
  console.log("workers", workers.length);
  if (!ffmpeg.loaded) {
    await load(ffmpeg);
  }
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
  worker.used = false;
  if (typeof data === "string") {
    return data;
  }
  if (typeof window === "undefined") {
    return data;
  }
  return URL.createObjectURL(new Blob([data], { type: "image/jpeg" }) as any);
};
