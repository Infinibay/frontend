import { ElementType, HTMLHopeProps } from '@hope-ui/solid';
import {
  Show
} from "solid-js";

import {
  Box,
  Text,
  HStack
} from "@hope-ui/solid";

import { 
  IDashboardBody,
} from '../components/shared'; 

import {
  Pannel
} from '../components/Pannel'; 

import appState from '../providers/global';

interface DashboardOptions {
}

export type DashboardProps<C extends ElementType = "div"> = HTMLHopeProps<C, DashboardOptions>;

export default function Dashboard(props: DashboardProps) {
  
  return (
    <HStack spacing="$1" p="0" alignItems="stretch" h="100vh">
      <Pannel></Pannel>
      <IDashboardBody panelOpened={true}>
        <HStack spacing="24px" marginTop="$8">
          Dashboard
          <Show when={appState.user()}>
            <Text>Welcome {appState.user()?.firstName}</Text>
          </Show> 
        </HStack>
      </IDashboardBody>
    </HStack>
  )
}