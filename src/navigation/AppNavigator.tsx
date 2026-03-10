import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../constants/theme';

import HomeScreen from '../screens/Home/HomeScreen';
import DownloaderScreen from '../screens/Downloader/DownloaderScreen';
import VideoPlayerScreen from '../screens/VideoPlayer/VideoPlayerScreen';
import VPNBrowserScreen from '../screens/VPNBrowser/VPNBrowserScreen';
import TranslatorScreen from '../screens/Translator/TranslatorScreen';
import TranscriberScreen from '../screens/Transcriber/TranscriberScreen';
import SummaryGeneratorScreen from '../screens/SummaryGenerator/SummaryGeneratorScreen';
import VoiceRecorderScreen from '../screens/VoiceRecorder/VoiceRecorderScreen';
import CallRecorderScreen from '../screens/CallRecorder/CallRecorderScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  Downloader: undefined;
  VideoPlayer: undefined;
  VPNBrowser: undefined;
  Translator: undefined;
  Transcriber: undefined;
  SummaryGenerator: undefined;
  VoiceRecorder: undefined;
  CallRecorder: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Downloader" component={DownloaderScreen} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        <Stack.Screen name="VPNBrowser" component={VPNBrowserScreen} />
        <Stack.Screen name="Translator" component={TranslatorScreen} />
        <Stack.Screen name="Transcriber" component={TranscriberScreen} />
        <Stack.Screen name="SummaryGenerator" component={SummaryGeneratorScreen} />
        <Stack.Screen name="VoiceRecorder" component={VoiceRecorderScreen} />
        <Stack.Screen name="CallRecorder" component={CallRecorderScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
