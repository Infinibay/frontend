import { Component, createEffect } from 'solid-js';
import { /*createSignal, */
  Switch, 
  Match,
  lazy
} from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';


import { Routes, Route } from "@solidjs/router";
import { HopeProvider, HopeThemeConfig } from '@hope-ui/solid'

import appState from "./providers/global";
import { mainTheme } from './theme';

// import LogIn from './components/LogIn';
// import MainApp from './components/MainApp';
// import DashboardDemo from './components/DashboardDemo';

const LogIn = lazy(() => import("./components/LogIn"));
const MainApp = lazy(() => import("./components/MainApp"));
const DashboardDemo = lazy(() => import("./components/DashboardDemo"));
const VMs = lazy(() => import("./pages/VMs"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

export default function App () {
  const { user } = appState;
  
  appState.initializeApp()

  return (
    <HopeProvider config={mainTheme}>
      <Switch fallback={<LogIn />}>
        <Match when={user()}>
          <Routes>
            <Route path="/" component={Dashboard} />
            <Route path="/settings" component={Settings} />
            <Route path="/demos/dashboard" component={DashboardDemo} />
            <Route path="/vms" component={VMs} />
          </Routes>
        </Match>
      </Switch>
    </HopeProvider>
  );
};

// export default App;
