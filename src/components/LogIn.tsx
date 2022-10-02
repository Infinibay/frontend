import { Component, createEffect } from 'solid-js';
import { createSignal, Show } from "solid-js";

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
} from "@hope-ui/solid"
import { FiAtSign } from 'solid-icons/fi'

import appState from "../providers/global";

import { settings } from '../settings';
import { client, queries, mutations } from '../utils/gql';

// Probably remove. The logIn query already returns the user
function fetchCurrentUserInformation (setError) {
  const result = client.query(queries.currentUser, {})
    .toPromise()
    .then((result) => {
      if (result.data.error) {
        setError(result.data.error.message);
      } else {
        appState.setUser(result.data.user);
        window.location = '/vms';
      }
      return true;
    });
  return true;
}

function LoginError (props) {
  const show = props.error !== '';
  return (
    <>
      <Show when={props.error !== ""}>
        <Box 
          padding="$4"
          w="$full">
          <Text 
            color="$neutral12" 
            w="$full" 
            bg="$danger10" 
            borderRadius="8px"
            padding="$2"
            fontWeight="bold"
            fontSize="sm"
            boxShadow="0px 0px 15px 0px #444"
            >{props.error}</Text>
        </Box>
      </Show>
    </>
    
  )
}

const LogIn: Component = () => {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const { setToken } = appState;

  const handleChangeEmail = (event) => { setEmail(event.target.value); };
  const handleChangePassword = (event) => { setPassword(event.target.value); };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = client
      .query(queries.logIn, {email: email(), password: password()})
      .toPromise()
      .then((result) => {
        if (result.data.logIn.error) {
          setError(result.data.logIn.error.message);
        } else {
          setToken(result.data.logIn.token);
          appState.setUser(result.data.logIn.user);
          window.location = '/vms';
          // fetchCurrentUserInformation(setError);
        }
      });
  };

  return (
    <Container h="100vh" centerContent>
      <Flex flexDirection="column" justifyContent="center" h="100%">
        <Box w="$lg" h="auto" bg="$neutral8" borderRadius="$xl" boxShadow="$lg">
          <form onSubmit={handleSubmit}>
            <VStack paddingTop="0px" marginTop="0px" spacing="0px">
              <Box w="100%" bg="$info10" borderTopRadius="$xl" h="$12">
                <Flex flexDirection="column" justifyContent="center" h="100%">
                  <Center>
                    <Heading size="xl" color="$neutral1">Log In</Heading>
                  </Center>
                </Flex>
              </Box>
              {/* ERROR SECTION */}
              <LoginError error={error()}></LoginError>
              
              <Box w="100%" bg="$neutral8" borderBottomRadius="$lg"  padding="$4">
                <VStack spacing="$4">
                  <FormControl id="email" required>
                    <FormLabel for="email">Email address</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none"
                        color="$neutral10" 
                        fontSize="1.2em" bg="$neutral7" borderLeftRadius="$md">
                        <Icon>
                          <FiAtSign size={24} color="#DDD"/>
                        </Icon>
                      </InputLeftElement>

                      <Input id="email" placeholder='Email' color="$neutral1" type='email' bg="white" borderRadius="$md" onInput={handleChangeEmail} />
                    </InputGroup>
                  </FormControl>

                  <FormControl id="password" required>
                    <FormLabel for="password">Password</FormLabel>
                    <Input id="password" placeholder='Password' color="$neutral1" type='password' bg="white" borderRadius="$md" onInput={handleChangePassword}/>
                  </FormControl>
                  <Flex w="100%" justifyContent="flex-end" h="100%">
                    <Spacer />
                    <Box>
                      <Button size="lg" w="100%" type='submit'>Log In</Button>
                    </Box>
                  </Flex>
                  <Text>Don't have an account? <a href="/signup">Sign Up</a></Text>
                </VStack>
              </Box>
            </VStack>
          </form>
        </Box>
      </Flex>
    </Container>
  );
}

export default LogIn;