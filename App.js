import * as React from 'react';
import { StatusBar } from 'react-native';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import SearchPage from './components/SearchPage';
import SongPage from './components/SongPage';
import SettingsPage from './components/SettingsPage';
import FavoritePage from './components/FavoritePage';

const MainPage = () => {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Search" component={SearchPage} options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="feature-search-outline" color={color} size={26} />
        ),
      }}/>
      <Tab.Screen name="Favorites" component={FavoritePage} options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="heart" color={color} size={26} />
        ),
      }}/>
      <Tab.Screen name="Settings" component={SettingsPage} options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="cog" color={color} size={26} />
        ),
      }}/>
    </Tab.Navigator>
  );
}

export default () => {  
  const theme = {
    ...DarkTheme,
    dark: true,
    mode: 'adaptive'
  };

  const Stack = createStackNavigator();

  return (
    <>
      <StatusBar hidden={true} />

      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator>
            <Stack.Screen name="Main" component={MainPage} options={{headerShown: false}}/>
            <Stack.Screen name="Song" options={{title: "Lyrics"}} component={SongPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </>
  );
    
}