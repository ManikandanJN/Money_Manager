import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View, StyleSheet, Text, Animated, Easing } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Screens
import RecordsScreen from './src/screens/Records/RecordsScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import ExpensesScreen from './src/screens/Charts/ExpensesScreen';
import MoneyManagerScreen from './src/screens/AddNewRecord/MoneyManagerScreen';
import SignInScreen from './src/screens/SiginScreen/SignInScreen';
import { Provider } from 'react-redux';
import { store } from './src/Redux/store';


// import SignInScreen from './src/screens/Auth/SignInScreen';

const TestScreen = () => <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor: '#000'}}><Text style={{color:"#FFD700"}}>Report screen</Text></View>;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Plus Button Component with Continuous Animation
const CustomPlusButton = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3, 
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, 
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity style={styles.addButton} onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={[styles.plusButton, { transform: [{ scale: scaleAnim }] }]}>
        <Feather name="plus" size={32} color="#000" />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Bottom Tab Navigator (Main App)
const AppTabs = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#1C1C1E',
            height: 80,
            paddingBottom: 20,
          },
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#666',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
        }}
      >
        <Tab.Screen
          name="Records"
          component={RecordsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="file-text-o" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Charts"
          component={ExpensesScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Feather name="bar-chart-2" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={TestScreen}
          options={{
            headerShown: false,
            tabBarButton: (props) => (
              <CustomPlusButton {...props} onPress={() => setModalVisible(true)} />
            ),
          }}
        />
        <Tab.Screen
          name="Reports"
          component={TestScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="insert-chart" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Me"
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Feather name="user" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      {modalVisible && (
        <MoneyManagerScreen visible={modalVisible} onClose={() => setModalVisible(false)} />
      )}
    </>
  );
};

// Stack Navigator (Handles Sign-In & Main App)
const App = () => {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Sign In Screen - First Screen */}
        <Stack.Screen name="SignIn" component={SignInScreen} />

        {/* Main App with Tabs */}
        <Stack.Screen name="MainApp" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -5,
  },
  plusButton: {
    width: 50,
    height: 50,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
