
 import { createSignal, createRoot } from "solid-js";
 import { createLocalStorage } from '@solid-primitives/storage'

 import {client, queries, mutations} from '../utils/gql';
 import appState from "../providers/global";

function validserObject(user) {
  return user && 
    typeof user === "object" &&
    user.id && 
    user.firstName && 
    user.lastName && 
    user.email;
}

function createCurrentUser(store, setStore) {
  const [user, setUser] = createSignal(null);


  // Try to get user from local storage
  if (!user()) {
    if (store.user) {
      try {
        const parsedUser = JSON.parse(store.user);
        if (validserObject(parsedUser)) {
          setUser(parsedUser);
        }
      } catch (e) {
        console.error("Error parsing user from local storage");
        setStore('user', '');
        setUser(null);
        window.location.href = '/';
      }
    }
    // TODO: Ping some endpoint to validate the token
  }
  return {user, setUser};
}

function createUserToken(store, setStore) {
  const [token, setToken] = createSignal('');

  // Try to get token from local storage
  if (!token()) {
    if (store.token) {
      setToken(store.token);
    }
  }
  return {token, setToken};
}

function loadLocalUser() {
  const result = client.query(queries.currentUser, {})
    .toPromise()
    .then((result) => {
      if (result.data.currentUser.user) {
        appState.setUser(result.data.currentUser.user);
      } else {
        appState.setUser(null);
        window.location.href = '/';
      }
      return true;
    });
  return true;
}

function initializeApp() {
  if (appState.token()) {
    loadLocalUser();
  }
}

// Create a AppProvider that will be used handle all the global state
// and provide it to the app
function AppProvider(props) {
  const [store, setStore] = createLocalStorage();
  const {token, setToken} = createUserToken(store, setStore);
  const {user, setUser} = createCurrentUser(store, setStore);

  const setUserWrapper = (user) => {
    if (user && validserObject(user)) {
      setUser(user);
      setStore('user', JSON.stringify(user));
      return true;
    } else {
      setUser(null);
      setStore('user', '');
      setToken('');
      setStore('token', '');
      window.location.href = '/';
      return true;
    }
  }


  const setTokenWrapper = (token: string) => {
    if (token) {
      setToken(token);
      setStore('token', token);
      return true;
    }
    return false;
  }

  addEventListener('storage', (event) => { 
    console.log('Why are you trying to change ', event.key, "?... I'm watching you!");
    if (event.key == 'token') {
      setTokenWrapper(event.newValue);
      console.log("Don't even try it ;)");
      window.location.href = '/';
    } else if (event.key == 'user') {
      setStore('user', '');
      console.log("Sorry, but user key is useless, it's just a visual thing, but you can't change it. Restarting and reloading.... ");
      window.location.href = '/';
    }
  });

  return {
    initializeApp,
    user,
    setUser: setUserWrapper,
    token,
    setToken: setTokenWrapper,
  };
}

export default createRoot(AppProvider);