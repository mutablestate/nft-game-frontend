import { writable } from "svelte/store";

export const contract = writable("");
export const currentAccount = writable("");
export const characterNFT = writable("");
export const characters = writable([]);
export const boss = writable(null);
