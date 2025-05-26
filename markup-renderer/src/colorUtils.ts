// colorUtils.ts
import tinycolor from "tinycolor2";

export const generateColorScale = (baseColor: string) => {
  const base = tinycolor(baseColor).toHsl();
  const scale: { [key: number]: string } = {};

  // Target lightness values for Tailwind-like scale (50 to 950)
  const lightnessMap: { [key: number]: number } = {
    50: 97,
    100: 94,
    200: 86,
    300: 77,
    400: 66,
    500: 55,
    600: 44,
    700: 34,
    800: 25,
    900: 15,
    950: 10,
  };

  Object.entries(lightnessMap).forEach(([key, lightness]) => {
    // You can optionally tweak saturation based on lightness
    const saturationAdjustment = lightness > 80 ? base.s * 0.9 : base.s * 1.1;

    const color = tinycolor({
      h: base.h,
      s: Math.min(1, saturationAdjustment),
      l: lightness / 100,
    });

    scale[parseInt(key)] = color.toHexString();
  });

  return scale;
};
