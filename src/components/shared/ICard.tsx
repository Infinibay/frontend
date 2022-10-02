import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import {
  Box,
  Center,
  Flex
} from "@hope-ui/solid";

import { ElementType, HTMLHopeProps } from '@hope-ui/solid';

interface ICardOptions {
}

export type ICardProps<C extends ElementType = "div"> = HTMLHopeProps<C, ICardOptions>;

export function ICard<C extends ElementType = "div">(props: ICardProps) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <>
      <Box
        class='iCard'
        bg="$neutral3"
        borderRadius="$lg"
        padding="$4"
        width="$full"
        shadow="$xl"
        {...others}
        >
        {local.children}
      </Box>
    </>
  )
}
