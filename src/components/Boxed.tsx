import { writeText } from "@tauri-apps/api/clipboard";
import { createSignal } from "solid-js";
import { getReadableBg } from "../utils";
import { Checked, Copy } from "./Icons";

const Boxed = ({ colour }: { colour: string }) => {
  const [hovered, setHovered] = createSignal(false);
  const [clicked, setClicked] = createSignal(false);
  const inverted = getReadableBg(colour, "#292524", "#d6d3d1");

  const handleClick = () => {
    setClicked(true);
    writeText(colour);
    setTimeout(() => {
      setClicked(false);
    }, 1000);
  };

  return (
    <button
      style={{
        "background-color": colour,
        "border-style": "solid",
        "border-width": "2px",
        "border-color": inverted,
      }}
      class="w-full max-w-xs h-10 rounded-md flex justify-center items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-5 h-5"
        style={{ color: inverted }}
      >
        {hovered() && (clicked() ? Checked : Copy)}
      </svg>
    </button>
  );
};

export default Boxed;
