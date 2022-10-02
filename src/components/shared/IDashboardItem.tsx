import type { Component } from 'solid-js';
import { Show, splitProps } from 'solid-js';
import { useLocation } from '@solidjs/router';

import {
  Box,
  Center,
  VStack,
  HStack,
  Flex,
  Text,
  Icon,
  Tooltip,
  Spacer,
  ElementType,
  HTMLHopeProps
} from "@hope-ui/solid";

interface IDashboardItemOptions {
  selected?: boolean,
  path?: string | "/",
  inGroup?: boolean | false,
  icon?: ElementType,
}

export type IDashboardItemProps<C extends ElementType = "div"> = HTMLHopeProps<C, IDashboardItemOptions>;

export function IDashboardItem<C extends ElementType = "div">(props: IDashboardItemProps) {
  const [local, others] = splitProps(props, ["selected", "path", "inGroup", "icon", "children"]);

  const selected = local.selected || useLocation().pathname == local.path;
  // Refactorize this and put the style inside the theme
  const bg = selected ? "$neutral6" : "$transparent";
  const hoverBg = selected ? "$neutral7" : "$neutral5";
  const p = local.inGroup ? "$2" : "$3";

  const onClick = () => {
    if (others.onClick) {
      return true
    } else if (local.path) {
      window.location.href = local.path;
    }
  }

  const hoverStyle = {
    bg: hoverBg,
    color: "$white",
  }

  return (
    <>
      <Box
        class='iDashboardItem'
        bg={bg}
        w="$full"
        p={p}
        cursor="pointer"
        _hover={ hoverStyle }
        {...others}
        >
        <HStack onClick={onClick} w="$full">
          <Show when={props.icon}>
            <Tooltip label="Close">
              <Icon size="md" color="$neutral5" fontSize="24px" marginRight="14px">
                {local.icon}
              </Icon>
            </Tooltip>
          </Show>
          <Show when={props.icon == null}>
            <Box w="24px" h="24px" marginRight="14px"></Box>
          </Show>
          <Text>{props.children}</Text>
          <Spacer />
          
        </HStack>
      </Box>
    </>
  )
}
