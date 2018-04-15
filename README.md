# guia-mobil-rn


## Getting started.
For running and building this proyect you will need to have Node and `npm` or `yarn` installed in your machine.
Firt you need to install the React Native CLI
```
npm install -g react-native-cli
```
This will make the command `react-native` globally available.
After clonning the repo, run 
```
yarn install
```
to install all the required dependencies.

## Running on Android
To run the app on an android device or emulator you can use the following command
```
yarn run:android
```
that will call `react-native run-android` under the hood and therefore you can pass any parameter that this command support. 
If you are running in a real device you need to make sure that the metro bundler can be reached from the device. The easiest way to do that
is by running
```
adb reverse tcp:8081 tcp:8081
```
This will tunnel all connections tht uses the port 8081 from your device to your computer.

## Technologies used
When developing this React Native application several technologies has aslo been used
* [React Native Navigation](https://github.com/wix/react-native-navigation)
* [Redux](https://github.com/reactjs/redux)
* [Realm Database](https://github.com/realm/realm-js)
* [Mapbox Maps](https://github.com/alex3165/react-mapbox-gl)
