import console from 'console';
import App from './src/App';

// https://stackoverflow.com/questions/60361519/cant-find-a-variable-atob
import { decode, encode } from 'base-64';
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

export default App;

// CMD + SHIFT + R for snippets

// React Navigation doesn't work guys
// - Tabs Example
// - Drawer + Tabs
// - Links to Settings Tab
