import { Component, createSignal } from 'solid-js';
import {createMemo} from 'solid-js';

import { useLocation } from '@solidjs/router';

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
  Spacer,

  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
} from '../components/shared';

import { Pannel } from '../components/Pannel';

import { SiVirtualbox } from 'solid-icons/si'
import { FaSolidNetworkWired } from 'solid-icons/fa'

interface CreateVMsProps {
  isOpen: boolean,
  onClose: () => void,
}

interface CreateVMsOptions {
  name: string,
  ram: number,
  cpu: number,
  diskSize: number,
  os: 'Windows' | 'Linux',
  cdrom: string,
}

function CreateVmModal (props: CreateVMsProps) {
  const [isOpen, setIsOpen] = createSignal(props.isOpen || false)
  const [newVm, setNewVm] = createSignal<CreateVMsOptions>({
    name: '',
    ram: 16386,
    cpu: 2,
    diskSize: 100,
    os: 'Windows',
    cdrom: '',
  });

  const setName = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setNewVm({...newVm(), name: target.value});
  }
  const setRam = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setNewVm({...newVm(), ram: parseInt(target.value)});
  }
  const setCpu = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (value < 1) {
      setNewVm({...newVm(), cpu: 1});
      target.value = '1';
    } else if (value > 16) {
      setNewVm({...newVm(), cpu: 16});
      target.value = '16';
    } else {
      setNewVm({...newVm(), cpu: parseInt(target.value)});
    }
  }
  const setDiskSize = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setNewVm({...newVm(), diskSize: parseInt(target.value)});
  }
  const setOs = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setNewVm({...newVm(), os: target.value as 'Windows' | 'Linux'});
  }
  const setCdrom = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setNewVm({...newVm(), cdrom: target.value});
  }

  return (
    <>
      <Modal centered opened={props.isOpen} onClose={props.onClose}>
        <ModalOverlay
          bg="$blackAlpha3"
          css={{
            backdropFilter: "blur(6px) hue-rotate(10deg) saturate(20%)",
          }}
        />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Create VM</ModalHeader>
          <ModalBody>
            <p>Here comes the form</p>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input type="text" value={newVm().name} onInput={setName} />
            </FormControl>
            <FormControl id="ram">
              <FormLabel>RAM</FormLabel>
              <Input min="8192" type="number" value={newVm().ram} onInput={setRam} />
            </FormControl>
            <FormControl id="cpu">
              <FormLabel>CPU</FormLabel>
              <Input min="1" max="16" type="number" value={newVm().cpu} onInput={setCpu} />
            </FormControl>
            <FormControl id="diskSize">
              <FormLabel>Disk Size</FormLabel>
              <Input min="100" max="1000" type="number" value={newVm().diskSize} onInput={setDiskSize} />
            </FormControl>
            {newVm().cpu}


          </ModalBody>
          <ModalFooter>
            <HStack spacing="$4">

              {/* Cancel button */}
              <Button
                colorScheme="neutral"
                onClick={props.onClose}
              >
                Cancel
              </Button>
              {/* Create button */}
              <Button
                colorScheme="success"
              >
                Create
              </Button>
            </HStack>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default function VMs() {
  const [isCreateVmModalOpen, setIsCreateVmModalOpen] = createSignal(false)
  const openCreateModal = () => {
    setIsCreateVmModalOpen(true)
  }
  const closeCreateModal = () => {
    setIsCreateVmModalOpen(false)
  }
  return (
    <>
      <HStack spacing="$1" p="0" alignItems="stretch" h="100vh">
        <Pannel></Pannel>
        <IDashboardBody panelOpened={true}>
          <HStack spacing="24px" marginTop="$8">
            <ICard h="1400px">
              <Flex 
                w="$full"
                paddingBottom="$2"
                borderBottom="1px solid $neutral7"
                >
                  <Center>
                    <Text 
                      fontSize="xl"
                      fontWeight="bold"
                    >Virtual Machines</Text>
                  </Center>
                
                <Spacer />
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="primary"
                  onClick={openCreateModal}
                >Create</Button>
              </Flex>
              
            </ICard>
          </HStack>

          <CreateVmModal isOpen={isCreateVmModalOpen()} onClose={closeCreateModal}></CreateVmModal>
        </IDashboardBody>
      </HStack>
    </>
  )
}
