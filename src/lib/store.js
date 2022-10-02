import { writable } from "svelte/store";

const savedList = localStorage.getItem("list");
const list = writable(savedList ? JSON.parse(savedList) : ["Alice", "Bob", "Eve"]);

function localSet(newData) {
  localStorage.setItem("list", JSON.stringify(newData));
  list.set(newData);
}
const modified = {
  ...list,
  set: localSet,
};

export default modified;
