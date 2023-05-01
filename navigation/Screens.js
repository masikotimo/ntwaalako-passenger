import React from 'react';
import { Easing, Animated, Dimensions } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Block, Text, theme } from "galio-framework";

import Request from '../screens/Request';
import ApprovedTrips from '../screens/ApprovedTrips';
import Login from '../screens/Login';
import HomeScreen from '../screens/Home';
import OnboardingScreen from '../screens/Onboarding';
import ProfileScreen from '../screens/Profile';
import ProScreen from '../screens/Pro';
import SettingsScreen from '../screens/Settings';
import { useSelector, useDispatch } from 'react-redux';


import CustomDrawerContent from './Menu';
import { Icon, Header } from '../components';
import { Images, materialTheme } from "../constants/";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();



function ProfileStack(props) {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              white
              transparent
              title="Profile"
              scene={scene}
              navigation={navigation}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Settings" scene={scene} navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

function RequestStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Request"
        component={Request}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Request" scene={scene} navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

function TripStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Trip"
        component={ApprovedTrips}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Trip" scene={scene} navigation={navigation} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              tabs
              title="Home"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name="Pro"
        component={ProScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back white transparent title="" navigation={navigation} scene={scene} />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  const profile = {
    avatar: Images.Profile,
    name: "John Doe",
    type: "NIRA",
    plan: "CO",
    rating: 4.8
  };
  const profiles = useSelector((state) => state.profile);
  profiles?  (
    profile.name=profiles.first_name,
    profile.type="organisation"
    ):null

  

  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={props => (
        <CustomDrawerContent {...props} profile={profile} />
      )}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8
      }}
      drawerContentOptions={{
        activeTintColor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: materialTheme.COLORS.ACTIVE,
        inactiveBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.74,
          paddingHorizontal: 12,
          // paddingVertical: 4,
          justifyContent: "center",
          alignContent: "center",
          // alignItems: 'center',
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          fontWeight: "normal"
        }
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="shop"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Request"
        component={RequestStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="shop"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Trip"
        component={TripStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="shop"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />

      

      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="gears"
              family="font-awesome"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: -3 }}
            />
          )
        }}
      />

      <Drawer.Screen
        name="Sign In"
        component={Login}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="ios-log-in"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Log Out"
        component={ProScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="md-person-add"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen name="App" component={AppStack} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

