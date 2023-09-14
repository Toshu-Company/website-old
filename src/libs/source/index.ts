import { TwiVideosNetProvider } from "./twi-videos";
import { TwiVideoNetProvider } from "./twivideo";

export const Providers = {
  TwiVideosNetProvider,
  TwiVideoNetProvider,
};

export interface Constructor<T> {
  new (...args: any[]): T;
}
