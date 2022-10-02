import { splitProps } from 'solid-js';
import { 
  Box,
  Center,
  Flex
} from "@hope-ui/solid";

import { ElementType, HTMLHopeProps } from '@hope-ui/solid';

interface IDashboardPanelHeaderOptions {}
export type IDashboardPanelHeaderProps<C extends ElementType = "div"> = HTMLHopeProps<C, IDashboardPanelHeaderOptions>;

export function IDashboardPanelHeader<C extends ElementType = "div">(props: IDashboardPanelHeaderProps) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <>
      <Box
        class='iDashboardPanelHeader'
        bg="$accent8"
        w="$full"
        {...others}
      >
        {local.children}
      </Box>
    </>
  )
}

