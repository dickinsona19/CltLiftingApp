import React, { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from 'expo-router';
import { QrCode, Dumbbell, Calendar, User } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import Header from '@/components/Header';
import { TouchableOpacity, Alert } from 'react-native';
import { View, Text } from 'react-native';
import { useUser } from '../../context/UserContext';
import SignInScreen from '../sign-in';
import SetupScreen from '../setup';
export default function TabLayout() {
  const { user, updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await fetch('http://localhost:8082/auth/signin/validate', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const userData = await response.json();
            console.log('Validation success:', userData);
            updateUser(userData.user);
          } else {
            const errorData = await response.json();
            console.error('Validation failed:', errorData.error);
            await AsyncStorage.removeItem('userToken');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <View><Text>Loading...</Text></View>;
  }
if(!user){return <SignInScreen /> }
if(!user?.profilePicture || !user?.signatureData){
  return <SetupScreen/>
}


  const content = !user ?  <SignInScreen />: (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 12,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        tabBarLabelStyle: {
          fontFamily: theme.fonts.bold,
          fontSize: 11,
          letterSpacing: 1,
          marginTop: 4,
        },
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'QR CODE',
            tabBarIcon: ({ color, size }) => (
              <QrCode size={size} color={color} strokeWidth={1.5} />
            ),
          }}
        />
        
        <Tabs.Screen
          name="training"
          options={{
            title: 'TRAINING',
            tabBarIcon: ({ color, size }) => (
              <View style={{ position: 'relative' }}>
                <Dumbbell 
                  size={size} 
                  color={color} 
                  strokeWidth={1.5} 
                  opacity={0.5} 
                />
                <View style={{
                  position: 'absolute',
                  top: -5,          // Adjust position as needed
                  right: -5,        // Adjust position as needed
                  backgroundColor: '#FFD700', // Gold color, you can change this
                  borderRadius: 8,  // Makes it circular/rounded
                  padding: 2,       // Inner spacing
                  minWidth: 16,     // Ensures visibility
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ 
                    fontSize: 8,     // Small text
                    color: '#000',   // Black text, adjust for contrast
                    fontWeight: 'bold',
                  }}>
                    SOON
                  </Text>
                </View>
              </View>
            ),
            // Keep your existing tabBarButton if you need the press functionality
            tabBarButton: (props) => (
              <TouchableOpacity {...props} disabled={true} />
            ),
          }}
        />

        // Second Tab
        <Tabs.Screen
          name="events"
          options={{
            title: 'EVENTS',
            tabBarIcon: ({ color, size }) => (
              <View style={{ position: 'relative' }}>
                <Calendar 
                  size={size} 
                  color={color} 
                  strokeWidth={1.5} 
                  opacity={0.5} 
                />
                <View style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  backgroundColor: '#FFD700',
                  borderRadius: 8,
                  padding: 2,
                  minWidth: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ 
                    fontSize: 8, 
                    color: '#000',
                    fontWeight: 'bold',
                  }}>
                    SOON
                  </Text>
                </View>
              </View>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity {...props} disabled={true} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'PROFILE',
            tabBarIcon: ({ color, size }) => (
              <User size={size} color={color} strokeWidth={1.5} />
            ),
          }}
        />
      </Tabs>
  );

  return (
    <>
      <Header />
      {content}
    </>
  );
}