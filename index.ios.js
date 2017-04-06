import { AppRegistry } from 'react-native';

// @todo remove when RN upstream is fixed
console.ignoredYellowBox = ['Warning: Failed propType: SceneView'];

import shareGo from './shareGo';

AppRegistry.registerComponent('shareGo', () => shareGo);