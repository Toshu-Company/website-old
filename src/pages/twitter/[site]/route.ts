import type { Providers } from "../../../libs/source";

export function getStaticPaths() {
  return [
    { params: { site: "twivideos" } },
    { params: { site: "twivideo" } },
    { params: { site: "uraakalist" } },
  ];
}

export function getProvider(site: string): keyof typeof Providers | undefined {
  switch (site) {
    case "twivideos":
      return "TwiVideosNetProvider";
    case "twivideo":
      return "TwiVideoNetProvider";
    case "uraakalist":
      return "UraakaListComProvider";
    default:
      return undefined;
    //   throw new Error(`Unknown site: ${site}`);
  }
}
