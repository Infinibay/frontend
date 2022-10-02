import { ElementType, HTMLHopeProps, Spacer } from '@hope-ui/solid';
import {
  VStack,
  Flex,
  Box
} from "@hope-ui/solid";
import { createMemo } from 'solid-js';
import { useLocation } from '@solidjs/router';

import {
  IDashboardBody,
  IDashboardItem,
  IDashboardItemGroup,
  IDashboardItemGroupTitle,
  IDashboardPanel,
  IDashboardPanelHeader,
  IDashboardPanelTitle
} from '../components/shared';

import appState from '../providers/global';

import { 
  SiVirtualbox
} from 'solid-icons/si'
import { 
  FiLogOut,
  FiSettings
} from 'solid-icons/fi'
import { 
  FaSolidNetworkWired,
} from 'solid-icons/fa'

interface PannelOptions {}

export type PannelProps<C extends ElementType = "div"> = HTMLHopeProps<C, PannelOptions>;

export function Pannel<C extends ElementType = "div">(props: PannelProps) {
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);

  const logOut = () => {
    appState.setUser(null)
  }

  return <>
    <IDashboardPanel>
        <VStack alignItems="strech" w="$full" spacing="14px" flexGrow="1" alignSelf="start">
          <IDashboardPanelHeader>
            <IDashboardPanelTitle>Infinibay</IDashboardPanelTitle>
            
          </IDashboardPanelHeader>
          <Flex w="$full" flexDirection="column" flex="1">
            <Box>
              <IDashboardItem path="/vms" icon={<SiVirtualbox size={24} color="#DDD"/>}>
                VMs
              </IDashboardItem>
            </Box>
            <Spacer flexGrow="1"/>
            <Box>
              <IDashboardItem path="/settings" icon={<FiSettings size={24} color="#DDD"/>}>
                Settings
              </IDashboardItem>
              <IDashboardItem onClick={logOut} icon={<FiLogOut size={24} color="#DDD"/>}>
                Log Out
              </IDashboardItem>
            </Box>
            
          </Flex>
        </VStack>
      </IDashboardPanel>
  </>
}