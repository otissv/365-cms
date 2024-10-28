// If you want to use other PostCSS plugins, see the following:
// https://tailwindcss.com/docs/using-with-preprocessors

import postcss from "@repo/tailwind-config/postcss"

export const plugins = {
  "postcss-import": {},
  "tailwindcss/nesting": {},
  tailwindcss: {},
  autoprefixer: {},
}
