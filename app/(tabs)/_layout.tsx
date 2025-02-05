import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import React from 'react'

import {icons} from '../../constants'

const TabIcon = ({icon, color, name, focused}) => {
  return(
    <View className="items-center justify-center gap-1 top-6">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
       <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} 
       text-xs text-center w-full`} style={{ color: color}}>
        {name}
      </Text>
    </View>
  ) 
}

const TabsLayout = () => {
  return (
    <>
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#47313E',
            tabBarInactiveTintColor: 'A493A8',
            tabBarStyle: {
              backgroundColor: '#F4E8D0',
              borderTopWidth: 1, 
              borderTopColor: '#E4D292',
              height: 84
            }
          }}
        >  
            <Tabs.Screen
                name="home"
                options={{
                  title: 'Home',
                  headerShown: false,
                  tabBarIcon: ({color, focused}) => (
                    <TabIcon
                      icon={icons.home}
                      color={color}
                      name="Home"
                      focused={focused}
                    />
                  )
                }}
            />

            <Tabs.Screen
                name="create-config"
                options={{
                  title: 'Add',
                  headerShown: false,
                  tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                      icon={icons.plus}
                      color={color}
                      name="Create"
                      focused={focused}
                    />
                  )
                }}
            />

            <Tabs.Screen
                name="choose-config"
                options={{
                  title: 'Configs',
                  headerShown: false,
                  tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                      icon={icons.play}
                      color={color}
                      name="Configs"
                      focused={focused}
                    />
                  )
                }}
            />

          <Tabs.Screen
                name="record-archive"
                options={{
                  title: 'Archive',
                  headerShown: false,
                  tabBarIcon: ({color, focused}) => (
                    <TabIcon 
                      icon={icons.bookmark}
                      color={color}
                      name="Archive"
                      focused={focused}
                    />
                  )
                }}
            />
        </Tabs>
    </>
  )
}

export default TabsLayout