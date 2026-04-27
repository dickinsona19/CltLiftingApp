import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useUser } from '@/context/UserContext';
import { theme } from '@/constants/theme';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { confirmSetupIntent } = useStripe();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardInfo, setCardInfo] = useState<{
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault?: boolean;
  } | null>(null);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const BASE_URL = 'https://boss-lifting-club-api.onrender.com';
  const ENDPOINTS = {
    getCustomerSummary: (customerId: string) => `${BASE_URL}/stripe/customer-summary/${customerId}`,
    createSetupIntent: `${BASE_URL}/create-setup-intent`,
    updatePaymentMethod: `${BASE_URL}/update-payment-method`,
  };

  const normalizeCardInfo = (payload: any) => {
    const card = payload?.defaultPaymentMethod || payload?.card || payload?.paymentMethod?.card || payload?.paymentMethod;

    if (!card) {
      return null;
    }

    if (!card.last4 && !card.brand) {
      return null;
    }

    return {
      brand: String(card.brand || '').toUpperCase(),
      last4: String(card.last4 || ''),
      expMonth: Number(card.expMonth || card.exp_month || 0),
      expYear: Number(card.expYear || card.exp_year || 0),
      isDefault: Boolean(payload?.isDefault ?? true),
    };
  };

  const fetchDefaultCard = useCallback(async () => {
    const customerId = user?.userStripeMemberId;
    if (!customerId) {
      setIsLoading(false);
      setCardInfo(null);
      setError('No Stripe customer is linked to this account yet.');
      return;
    }

    setError(null);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await fetch(ENDPOINTS.getCustomerSummary(customerId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Unable to load card information');
      }

      const data = await res.json();
      setCardInfo(normalizeCardInfo(data || {}));
    } catch (fetchError) {
      console.error('Failed to fetch default card:', fetchError);
      setError('Could not load your card details right now.');
      setCardInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userStripeMemberId]);

  useEffect(() => {
    fetchDefaultCard();
  }, [fetchDefaultCard]);

  const handleUpdateCardInformation = async () => {
    const customerId = user?.userStripeMemberId;
    if (!customerId || isUpdating) {
      return;
    }

    if (Platform.OS !== 'web' && !isCardComplete) {
      Alert.alert('Card details required', 'Please enter complete card details before updating.');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const setupIntentResponse = await fetch(ENDPOINTS.createSetupIntent, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ customerId }),
      });

      if (!setupIntentResponse.ok) {
        const body = await setupIntentResponse.text();
        throw new Error(body || 'Unable to start card update');
      }

      const setupIntentData = await setupIntentResponse.json();
      const clientSecret = setupIntentData?.clientSecret;
      if (!clientSecret) {
        throw new Error('Missing setup intent client secret');
      }

      const { setupIntent, error: stripeError } = await confirmSetupIntent(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || undefined,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Stripe setup failed');
      }

      const paymentMethodId = setupIntent?.paymentMethodId;
      if (!paymentMethodId) {
        throw new Error('No payment method returned from Stripe');
      }

      const updateMethodResponse = await fetch(ENDPOINTS.updatePaymentMethod, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ customerId, paymentMethodId }),
      });

      if (!updateMethodResponse.ok) {
        const body = await updateMethodResponse.text();
        throw new Error(body || 'Failed to set new default card');
      }

      const updateResult = await updateMethodResponse.json();
      if (updateResult?.error) {
        throw new Error(updateResult.error);
      }

      Alert.alert('Card updated', 'Your default card was updated successfully.');
      setShowUpdateForm(false);
      setIsLoading(true);
      await fetchDefaultCard();
    } catch (updateError) {
      console.error('Failed to update payment method:', updateError);
      Alert.alert('Unable to update card', 'Please try again in a moment.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#2F80C5', '#1D5E97']} style={styles.topBlue} />
      <LinearGradient colors={['rgba(23, 72, 117, 0.35)', 'rgba(17, 17, 17, 0)']} style={styles.gradient} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/profile'))}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="chevron-back" size={28} color={theme.colors.primary} />
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeInDown.delay(200).duration(1000)} style={styles.section}>
        <Text style={styles.sectionTitle}>Card Information</Text>
        <View style={styles.card}>
          {isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading card information...</Text>
            </View>
          ) : (
            <>
              <View style={styles.paymentCard}>
                <View style={styles.cardLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="card-outline" size={20} color={theme.colors.primary} />
                  </View>
                  <View>
                    {cardInfo ? (
                      <>
                        <Text style={styles.cardText}>
                          {cardInfo.brand || 'CARD'} •••• {cardInfo.last4}
                        </Text>
                        <Text style={styles.cardSubtext}>
                          Expires {String(cardInfo.expMonth).padStart(2, '0')}/{String(cardInfo.expYear).slice(-2)}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.cardText}>No default card on file</Text>
                        <Text style={styles.cardSubtext}>Add one card to keep billing active</Text>
                      </>
                    )}
                  </View>
                </View>
                {cardInfo?.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              {!showUpdateForm ? (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setShowUpdateForm(true)}
                >
                  <Ionicons name="create-outline" size={18} color={theme.colors.primary} />
                  <Text style={styles.secondaryButtonText}>Edit Card</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <View style={styles.inputContainer}>
                    {Platform.OS === 'web' ? (
                      <Text style={styles.webNote}>
                        Card editing is available on iOS/Android builds.
                      </Text>
                    ) : (
                      <CardField
                        postalCodeEnabled
                        placeholders={{ number: '4242 4242 4242 4242' }}
                        cardStyle={{
                          backgroundColor: '#2C2C2E',
                          textColor: '#FFFFFF',
                          borderColor: '#2C2C2E',
                          borderWidth: 1,
                          borderRadius: 10,
                        }}
                        style={styles.cardField}
                        onCardChange={(details) => setIsCardComplete(Boolean(details.complete))}
                      />
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryButton, (isUpdating || (Platform.OS !== 'web' && !isCardComplete)) && styles.disabledButton]}
                    onPress={handleUpdateCardInformation}
                    disabled={isUpdating || (Platform.OS !== 'web' && !isCardComplete)}
                  >
                    {isUpdating ? (
                      <ActivityIndicator color="#111111" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle-outline" size={18} color="#111111" />
                        <Text style={styles.primaryButtonText}>Save Card</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.ghostButton}
                    onPress={() => setShowUpdateForm(false)}
                  >
                    <Text style={styles.ghostButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setIsLoading(true);
                  fetchDefaultCard();
                }}
              >
                <Ionicons name="refresh" size={18} color={theme.colors.primary} />
                <Text style={styles.secondaryButtonText}>Refresh Card Details</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  topBlue: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
  },
  backButton: {
    marginRight: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    ...Platform.select({
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      default: {
        elevation: 4,
      },
    }),
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  loadingText: {
    marginTop: 10,
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  cardSubtext: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: 'rgba(75, 156, 211, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  defaultText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  errorText: {
    color: '#FF6767',
    marginTop: 12,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    marginTop: 14,
  },
  cardField: {
    width: '100%',
    height: 52,
  },
  webNote: {
    color: '#8E8E93',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#111111',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  secondaryButton: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  ghostButton: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 10,
  },
  ghostButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  noteText: {
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 14,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
});