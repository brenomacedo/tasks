/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';
import TaskList from './src/screens/TaskList'
import Navigator from './src/Navigator'

AppRegistry.registerComponent(appName, () => Navigator);
