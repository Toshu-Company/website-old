import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

export const $rawFavorite = persistentAtom<string>("yatv:favorite", "[]");

export const $favorite = atom<string[]>([
  ...new Set(JSON.parse($rawFavorite.get()) as string[]),
]);
export const favorite = $favorite;

$favorite.listen((value) => {
  $rawFavorite.set(JSON.stringify(value));
});
