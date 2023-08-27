import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

export const $rawFavorite = persistentAtom<string>("favorite", "[]");

export const $favorite = atom<string[]>(JSON.parse($rawFavorite.get()));

$favorite.listen((value) => {
  $rawFavorite.set(JSON.stringify(value));
});
