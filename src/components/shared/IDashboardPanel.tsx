import type { Component,  } from 'solid-js';
import { splitProps, children } from 'solid-js';
import {
  Box,
  Center,
  VStack,
  HStack,
  Flex,
} from "@hope-ui/solid";

import { ElementType, HTMLHopeProps } from '@hope-ui/solid';

interface IDashboardPanelOptions {
}

export type IDashboardPanelProps<C extends ElementType = "div"> = HTMLHopeProps<C, IDashboardPanelOptions>;

export function IDashboardPanel<C extends ElementType = "div">(props: IDashboardPanelProps) {
  const [local, others] = splitProps(props, ["children"]);
  const resolved = children(() => local.children);

  return (
      <Flex class='iDashboardPanel' 
        flexDirection="column"
        flexWrap="nowrap"
        justifyContent="flex-start"
        alignItems="stretch"
        w="$md"
        bg="$neutral4"
        shadow="$xl"
        {...others}
        >
        {resolved}
      </Flex>
  )
}
