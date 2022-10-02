import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import {
  Box,
  Center,
  Flex
} from "@hope-ui/solid";

import { ElementType, HTMLHopeProps } from '@hope-ui/solid';

interface IDashboardItemGroupOptions {}
export type IDashboardItemGroupProp<C extends ElementType = "div"> = HTMLHopeProps<C, IDashboardItemGroupOptions>;

export function IDashboardItemGroup<C extends ElementType = "div">(props: IDashboardItemGroupProp) {
  const [local, others] = splitProps(props, ["children"]);
  return (
    <>
      <Box
        class='iDashboardItemGroup'
        bg="$neutral3"
        marginTop="$3"
        w="$full"
        {...others}
      >
        {local.children}
      </Box>
    </>
  )
}
