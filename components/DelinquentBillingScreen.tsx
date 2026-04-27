import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

interface DelinquentBillingScreenProps {
  customerId?: string;
  onRefreshStatus: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

const BASE_URL = 'https://boss-lifting-club-api.onrender.com';

const PORTAL_ENDPOINTS = [
  '/stripe/customer-portal-session',
  '/stripe/create-customer-portal-session',
  '/customer-portal-session',
];

export default function DelinquentBillingScreen({
  customerId,
  onRefreshStatus,
  onSignOut,
}: DelinquentBillingScreenProps) {
  const appStateRef = useRef(AppState.currentState);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      const previous = appStateRef.current;
      appStateRef.current = nextState;

      // Re-check delinquent status whenever user returns from background (e.g. Stripe portal).
      if ((previous === 'background' || previous === 'inactive') && nextState === 'active') {
        try {
          await onRefreshStatus();
        } catch (refreshError) {
          console.error('Foreground refresh failed:', refreshError);
        }
      }
    });

    return () => subscription.remove();
  }, [onRefreshStatus]);

  const openBillingPortal = async () => {
    if (!customerId || isOpeningPortal) return;

    setError(null);
    setIsOpeningPortal(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const payload = {
        customerId,
        returnUrl: 'cltliftingclub://billing-return',
      };

      let portalUrl: string | null = null;
      for (const endpoint of PORTAL_ENDPOINTS) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          continue;
        }

        const result = await response.json().catch(() => null);
        const candidate = result?.url || result?.portalUrl || result?.sessionUrl;
        if (candidate) {
          portalUrl = candidate;
          break;
        }
      }

      if (!portalUrl) {
        throw new Error('Billing portal endpoint is unavailable.');
      }

      await Linking.openURL(portalUrl);
    } catch (openError) {
      console.error('Failed to open billing portal:', openError);
      setError('Unable to open billing portal right now. Please try again.');
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const refreshStatus = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setError(null);
    try {
      await onRefreshStatus();
    } catch (refreshError) {
      console.error('Failed to refresh delinquent status:', refreshError);
      setError('Could not refresh account status. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#2F80C5', '#1D5E97']} style={styles.topBlue} />
      <LinearGradient colors={['rgba(23, 72, 117, 0.35)', 'rgba(17, 17, 17, 0)']} style={styles.gradient} />

      <View style={styles.card}>
        <Text style={styles.title}>Billing Action Required</Text>
        <Text style={styles.subtitle}>
          Your account is marked delinquent. Please update payment and settle any outstanding balance to regain app access.
        </Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.primaryButton, isOpeningPortal && styles.disabledButton]}
          onPress={openBillingPortal}
          disabled={isOpeningPortal}
        >
          {isOpeningPortal ? (
            <ActivityIndicator color="#111111" />
          ) : (
            <Text style={styles.primaryButtonText}>Open Stripe Billing Portal</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, isRefreshing && styles.disabledButton]}
          onPress={refreshStatus}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <Text style={styles.secondaryButtonText}>I Paid, Refresh My Access</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    justifyContent: 'center',
    padding: 20,
  },
  topBlue: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 240,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 34,
    fontFamily: theme.fonts.bold,
  },
  subtitle: {
    color: '#B9B9BD',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    fontFamily: theme.fonts.regular,
  },
  errorText: {
    color: '#FF6767',
    marginTop: 12,
    fontFamily: theme.fonts.regular,
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#111111',
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
  secondaryButton: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
  signOutButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signOutText: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: theme.fonts.regular,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
