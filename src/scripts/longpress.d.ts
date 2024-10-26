import { CompositionEventHandler } from "react";

declare namespace svelteHTML {
  export interface HTMLAttributes<T> {
    "on:longpress"?: CompositionEventHandler<T>;
  }
}
