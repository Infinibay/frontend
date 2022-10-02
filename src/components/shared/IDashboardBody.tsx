import type { Component } from 'solid-js';
import { JSX, splitProps } from 'solid-js';

import { ElementType, HTMLHopeProps } from '@hope-ui/solid';

import {
  Box,
  Center,
} from "@hope-ui/solid";

interface IDashboardBodyOptions {
  panelOpened?: boolean | false,
}

export type IDahsboardBodyProps<C extends ElementType = "div"> = HTMLHopeProps<C, IDashboardBodyOptions>;

export function IDashboardBody<C extends ElementType = "div">(props: IDahsboardBodyProps) {
  const [local, others] = splitProps(props, ['panelOpened', 'children']);

  return (
      <Box class='iDashboardBody'
        position="relative"
        height="$full"
        width="$full"
        bg="$neutral1"
        paddingBottom="0px"
        left="$xs"
        overflow="scroll"
        {...others}
        >
        <Box padding="32px" minH="100vh">
          { local.children }
        </Box>
      </Box>
  )
}
