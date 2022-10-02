import { Component } from 'solid-js';

import {
  Box,
  Center,
  Text,
  Flex
} from "@hope-ui/solid";

import { ElementType, HTMLHopeProps } from '@hope-ui/solid';

interface IDashboardPanelTitleOptions {
}

export type IDashboardPanelTitleProps<C extends ElementType = "div"> = HTMLHopeProps<C, IDashboardPanelTitleOptions>;

export function IDashboardPanelTitle<C extends ElementType = "div">(props: IDashboardPanelTitleProps) {
  return (
    <>
      <Box class='iDashboardPanelTitle' bg="$accent8" p="$4" color="$white" fontSize="$xl" fontWeight="bold">
        {props.children}
      </Box>
    </>
  )
}
