import type { Providers } from "../../../libs/source";

export const prerender = true;

export function getStaticPaths() {
  return [
    { params: { site: "twivideos" } },
    { params: { site: "twivideo" } },
    { params: { site: "twidouga" } },
    { params: { site: "uraakalist" } },
  ];
}

export function getProvider(site: string): keyof typeof Providers | undefined {
  switch (site) {
    case "twivideos":
      return "TwiVideosNetProvider";
    case "twivideo":
      return "TwiVideoNetProvider";
    case "twidouga":
      return "TwiDougaNetProvider";
    case "uraakalist":
      return "UraakaListComProvider";
    default:
      return undefined;
    //   throw new Error(`Unknown site: ${site}`);
  }
}
