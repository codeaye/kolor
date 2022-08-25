import { createSignal, For, onMount } from "solid-js";
import Boxed from "./components/Boxed";

import { invoke } from "@tauri-apps/api/tauri";
import { getReadableBg } from "./utils";
import { Refresh } from "./components/Icons";

function App() {
  const [invalid, setInvalid] = createSignal(false);
  const [input, setInput] = createSignal("");
  const [isMac, setIsMac] = createSignal(false);
  const [gradient, setGradient] = createSignal([]);

  const setNewGradient = async (hex: string) =>
    setGradient(await invoke("palette", { hex }));

  const refreshColour = async () => {
    const new_colour: string = await invoke("random_colour");
    setInput(new_colour);
    await setNewGradient(new_colour);
  };

  onMount(async () => {
    setIsMac(await invoke("is_macos"));
    refreshColour();
  });

  const handleInput = (event: InputEvent) => {
    const value = (event.target as HTMLInputElement).value;
    if (value !== "") {
      setInput(value);
      if (/^#[0-9A-F]{6}$/i.test(value)) {
        setInvalid(false);
        setNewGradient(value);
      } else {
        setInvalid(true);
      }
    }
  };

  return (
    <div class="h-screen w-screen bg-stone-800">
      {isMac() && (
        <div data-tauri-drag-region class="pt-3 pb-4 mb-0.5 bg-stone-900" />
      )}
      <div class="p-2">
        <div
          class={`flex border-2 mb-2 rounded gap-1 duration-500 ${
            invalid() ? "border-red-500" : "border-green-500"
          }`}
          style={{
            color: invalid() ? "#E5E7EB" : input(),
            "background-color": invalid()
              ? "#292524"
              : getReadableBg(input(), "#292524", "#fff"),
          }}
        >
          <button
            onClick={refreshColour}
            class="hover:-hue-rotate-180 hover:rotate-180 duration-500 focus:ring-4 focus:outline-none font-medium text-sm p-2.5 text-center inline-flex items-center mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <Refresh />
            </svg>
          </button>
          <input
            class="bg-transparent flex-grow font-mono text-lg antialiased font-semibold appearance-none w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={input()}
            onInput={handleInput}
          />
          <input
            type="color"
            value={input()}
            onInput={handleInput}
            class="bg-transparent flex-none h-11 px-1"
          />
        </div>
        <div class="grid gap-1 grid-cols-5 select-none">
          <For each={gradient()}>
            {(colour, i) => <Boxed colour={colour} />}
          </For>
        </div>
      </div>
    </div>
  );
}

export default App;
