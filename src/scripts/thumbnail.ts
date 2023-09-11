import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm";

// const ffmpeg = new FFmpeg();

const load = async (ffmpeg: FFmpeg) => {
  console.log("loading ffmpeg");
  // ffmpeg.on("log", ({ message }) => {
  //   console.log(message);
  // });
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });
  console.log("ffmpeg loaded");
};

export const translateVideoURL = (video: string) => {
  const url = new URL(video);
  return `${import.meta.env.PUBLIC_TWITTER_API_URL}/lover${url.pathname}`;
};

export const getThumbnail = async (video: string) => {
  const ffmpeg = new FFmpeg();
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
  if (typeof data === "string") {
    return data;
  }
  if (typeof window === "undefined") {
    return data;
  }
  return URL.createObjectURL(new window.Blob([data], { type: "image/jpeg" }));
};
