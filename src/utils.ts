const getReadableBg = (bgColor: string, a: string, b: string): string =>
  bgColor ? (parseInt(bgColor.replace("#", ""), 16) > 0xffffff / 2 ? a : b) : a;
export { getReadableBg };
