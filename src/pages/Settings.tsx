import { ElementType, HTMLHopeProps } from '@hope-ui/solid';
import { createSignal } from 'solid-js';

import {
  Show
} from "solid-js";

import {
  Button,
  Flex,
  Box,
  Text,
  Input,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@hope-ui/solid";

import { 
  ICard,
  IDashboardBody,
} from '../components/shared'; 

import {
  Pannel
} from '../components/Pannel'; 

import appState from '../providers/global';
import { client, queries, mutations } from '../utils/gql';

interface SystemSettings {
  isosPath: string,
  disksPath: string,
  downloadsPath: string,
  extractIsosPath: string,
  modifiedIsosPath: string,
}

function getSettingValue(settings: any[], path: string) {
  const setting = settings.find((s) => s.path === path);
  return setting?.value;
}

function loadSystemSettings(systemSettings, setSystemSettings) {
  client.query(queries.systemSettings, {})
    .toPromise()
    .then((result) => {
      if (result.error) {
        console.error("Error loading system settings: ", result.error.message);
      } else {
        // setSystemSettings(result.data.systemSettings);
        const settings = {
          isosPath: getSettingValue(result.data.systemSettings, 'system.paths.isos'),
          disksPath: getSettingValue(result.data.systemSettings, 'system.paths.disks'),
          downloadsPath: getSettingValue(result.data.systemSettings, 'system.paths.downloads'),
          extractIsosPath: getSettingValue(result.data.systemSettings, 'system.paths.extract_isos'),
          modifiedIsosPath: getSettingValue(result.data.systemSettings, 'system.paths.modified_isos'),
        } as SystemSettings;
        setSystemSettings(settings);
      }
      return true;
    });
}

interface SettingsOptions {
}

export type SettingsProps<C extends ElementType = "div"> = HTMLHopeProps<C, SettingsOptions>;

export default function Settings(props: SettingsProps) {
  const [systemSettings, setSystemSettings] = createSignal<SystemSettings>({
    isosPath: '',
    disksPath: '',
    downloadsPath: '',
    extractIsosPath: '',
    modifiedIsosPath: '',
  });
  const setIsoPath = (event) => {
    console.log('ASSSS');
    setSystemSettings({
      ...systemSettings(),
      isosPath: event.target.value,
    });
  }
  const setDiskPath = (event) => {
    console.log('ASSSS');
    setSystemSettings({
      ...systemSettings(),
      disksPath: event.target.value,
    });
  }
  const setDownloadPath = (event) => {
    console.log('ASSSS');
    setSystemSettings({
      ...systemSettings(),
      downloadsPath: event.target.value,
    });
  }
  const setExtractIsoPath = (event) => {
    console.log('ASSSS');
    setSystemSettings({
      ...systemSettings(),
      extractedIsosPath: event.target.value,
    });
  }
  const setModifiedIsoPath = (event) => {
    console.log('ASSSS');
    setSystemSettings({
      ...systemSettings(),
      modifiedIsosPath: event.target.value,
    });
  }

  loadSystemSettings(systemSettings, setSystemSettings);

  const saveSystemSettings = () => {
    console.log("Saving system settings", systemSettings());
    client
      .mutation(mutations.updatePaths, {
        isosPath: systemSettings().isosPath,
        disksPath: systemSettings().disksPath,
        downloadsPath: systemSettings().downloadsPath,
        extractIsosPath: systemSettings().extractIsosPath,
        modifiedIsosPath: systemSettings().modifiedIsosPath,
      })
      .toPromise()
      .then((result) => {
        console.log('saveSystemSettings', result);
        if (result.error) {
          console.error("Error saving system settings: ", result.error.message);
        } else {
          console.log("System settings saved");
        }
        return true;
      });
  }
  
  return (
    <HStack
      spacing="$1"
      p="0"
      alignItems="stretch"
      h="100vh"
      {...props}
      >
      <Pannel></Pannel>
      <IDashboardBody panelOpened={true}>
          <ICard w="$full" minH="$xl" marginTop="$sm">
            <Text
              paddingBottom="$2"
              borderBottom="1px solid $neutral7"
            >Settings</Text>
            <VStack spacing="10px" marginTop="8px">
              <FormControl id="isoPath" required display="flex" flexDirection="column">
                <FormLabel>ISO Path</FormLabel>
                <Input type="text" value={systemSettings().isosPath} onInput={setIsoPath} />
                <FormHelperText>Path to ISO files</FormHelperText>
              </FormControl>
              <FormControl id="diskPath" required display="flex" flexDirection="column">
                <FormLabel>Disk Path</FormLabel>
                <Input type="text" value={systemSettings().disksPath} onInput={setDiskPath} />
                <FormHelperText>Path to disk files</FormHelperText>
              </FormControl>
              <FormControl id="downloadPath" required display="flex" flexDirection="column">
                <FormLabel>Download Path</FormLabel>
                <Input type="text" value={systemSettings().downloadsPath} onInput={setDownloadPath} />
                <FormHelperText>Path to download files</FormHelperText>
              </FormControl>
              <FormControl id="extractIsoPath" required display="flex" flexDirection="column">
                <FormLabel>Extract ISO Path</FormLabel>
                <Input type="text" value={systemSettings().extractIsosPath} onInput={setExtractIsoPath} />
                <FormHelperText>Temporal path where ISOs are extracted before insert pre and post scripts</FormHelperText>
              </FormControl>
              <FormControl id="modifiedIsoPath" required display="flex" flexDirection="column">
                <FormLabel>Modified ISO Path</FormLabel>
                <Input type="text" value={systemSettings().modifiedIsosPath} onInput={setModifiedIsoPath} />
                <FormHelperText>Path to modified ISO files.</FormHelperText>
              </FormControl>
            </VStack>
              {/* Action setions */}
              <Flex w="100%" 
                justifyContent="flex-end"
              >
                <Button
                  colorScheme="primary"
                  onClick={saveSystemSettings}
                  >Save</Button>
              </Flex>
            
          </ICard>
      </IDashboardBody>
    </HStack>
  )
}