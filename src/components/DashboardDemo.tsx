import type { Component } from 'solid-js';

import { 
  Box,
  Center,
  VStack,
  HStack,
  Heading,
  Button,
  Flex,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Text,
  InputGroup,
  Input,
  InputLeftElement,
  Icon,
  Tooltip,
  Spacer
} from "@hope-ui/solid"

import {
  ICard,
  IDashboardBody,
  IDashboardItem,
  IDashboardItemGroup,
  IDashboardItemGroupTitle,
  IDashboardPanel,
  IDashboardPanelHeader,
  IDashboardPanelTitle
} from './shared';

import { SiVirtualbox } from 'solid-icons/si'
import { FaSolidNetworkWired } from 'solid-icons/fa'

const DashboardDemo: Component = () => {
  return (
    <>
      <IDashboardPanel>
        <VStack w="$full" spacing="14px">
          <IDashboardPanelHeader>
            <IDashboardPanelTitle>Infinibay</IDashboardPanelTitle>
            
          </IDashboardPanelHeader>
          <VStack w="$full">
            <IDashboardItem selected={true} icon={<SiVirtualbox size={24} color="#DDD"/>}>
              VMs
            </IDashboardItem>
            <IDashboardItem icon={<FaSolidNetworkWired size={24} color="#DDD"/>}>
              Networks
            </IDashboardItem>
            <IDashboardItemGroup>
              <IDashboardItemGroupTitle>Settings</IDashboardItemGroupTitle>
              <IDashboardItem inGroup={true}>
                Users
              </IDashboardItem>
              <IDashboardItem inGroup={true}>
                API Keys
              </IDashboardItem>
            </IDashboardItemGroup>
          </VStack>
        </VStack>
      </IDashboardPanel>
      <IDashboardBody panelOpened={true}>
        <HStack spacing="24px">
          <ICard h="$sm" maxW="$sm">
            <Text fontSize="xl" fontWeight="bold">Card 1</Text>
          </ICard>
          <ICard h="$sm" maxW="$sm">
            <Text fontSize="xl" fontWeight="bold">Card 2</Text>
          </ICard>
        </HStack>
      </IDashboardBody>
    </>
  )
}

export default DashboardDemo;