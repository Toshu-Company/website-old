import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

export const $rawFavorite = persistentAtom<string>("lover:favorite", "[]");

export const $favorite = atom<string[]>(JSON.parse($rawFavorite.get()));
export const favorite = $favorite;

$favorite.listen((value) => {
  $rawFavorite.set(JSON.stringify(value));
});
