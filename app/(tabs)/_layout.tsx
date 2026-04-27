import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from 'expo-router';
import { QrCode, User } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import Header from '@/components/Header';
import { ImageBackground, View, Text } from 'react-native';
import { useUser } from '../../context/UserContext';
import SignInScreen from '../sign-in';
import SetupScreen from '../setup';
import DelinquentBillingScreen from '@/components/DelinquentBillingScreen';

const BASE_URL = 'https://boss-lifting-club-api.onrender.com';

export default function TabLayout() {
  const { user, updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        updateUser(null);
        return;
      }

      const response = await fetch(`${BASE_URL}/auth/signin/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        await AsyncStorage.removeItem('userToken');
        updateUser(null);
        return;
      }

      const userData = await response.json();
      updateUser(userData.user);
    } catch (error) {
      console.error('Auth check error:', error);
    }
  }, [updateUser]);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        await checkAuthStatus();
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapAuth();
  }, [checkAuthStatus]);

  const handleSignOut = useCallback(async () => {
    await AsyncStorage.removeItem('userToken');
    updateUser(null);
  }, [updateUser]);

  if (isLoading) {
    return (
      <ImageBackground
        source={require('../../assets/images/IMG_1936.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (!user) {
    return <SignInScreen />;
  }

  if (!user?.profilePictureUrl || !user?.signatureData) {
    return <SetupScreen />;
  }

  if (user?.isDelinquent === true) {
    return (
      <DelinquentBillingScreen
        customerId={user?.userStripeMemberId}
        onRefreshStatus={checkAuthStatus}
        onSignOut={handleSignOut}
      />
    );
  }

  const content = (
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