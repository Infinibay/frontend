import { HopeThemeConfig } from '@hope-ui/solid'

/*
check https://github.com/hope-ui/hope-ui/blob/31accbe407361ff65eb23d3ca1f61fd5c72561cc/packages/solid/src/styled-system/tokens/index.ts
for more info about different options, like sizes, fonts, radii, shadows,etc:
  colors: {
    ...commonColors,
    ...lightColors,
  },
  space,
  sizes,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  radii,
  shadows,
  zIndices,

  Also, check https://github.com/hope-ui/hope-ui/tree/31accbe407361ff65eb23d3ca1f61fd5c72561cc/packages/solid/src/styled-system/tokens
  to see all tokens for all sections
  */
export const mainTheme: HopeThemeConfig = {
  initialColorMode: "dark",
  lightTheme: {
    colors: {
    },
  },
  darkTheme: {
    colors: {
    },
  }
}