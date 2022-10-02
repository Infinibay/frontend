import { splitProps } from 'solid-js';
import {
  Box,
  Center,
  Flex
} from "@hope-ui/solid";
import { ElementType, HTMLHopeProps } from '@hope-ui/solid';

interface IDashboardItemGroupTitleOptions {}
export type IDashboardItemGroupTitleProps<C extends ElementType = "div"> = HTMLHopeProps<C, IDashboardItemGroupTitleOptions>;

export function IDashboardItemGroupTitle<C extends ElementType = "div">(props: IDashboardItemGroupTitleProps) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <>
      <Box
        class='iDashboardItemGroupTitle'
        borderBottom="4px solid $accent8"
        p="$3"
        {...others}
        >
        {local.children}
      </Box>
    </>
  )
}
