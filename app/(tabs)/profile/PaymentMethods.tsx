import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['rgba(212, 175, 55, 0.15)', 'rgba(17, 17, 17, 0)']}
        style={styles.gradient}
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.navigate('/profile')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="chevron-back" size={28} color="#D4AF37" />
            <Text style={styles.headerTitle}>   Profile</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeInDown.delay(200).duration(1000)} style={styles.section}>
        <Text style={styles.sectionTitle}>Saved Cards</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.paymentCard}>
            <View style={styles.cardLeft}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1577003811926-53b288a6e5d3?w=800&auto=format&fit=crop&q=60' }} 
                style={styles.cardImage} 
              />
              <View>
                <Text style={styles.cardText}>•••• •••• •••• 4242</Text>
                <Text style={styles.cardSubtext}>Expires 12/25</Text>
              </View>
            </View>
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentCard}>
            <View style={styles.cardLeft}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1577003811926-53b288a6e5d3?w=800&auto=format&fit=crop&q=60' }} 
                style={styles.cardImage} 
              />
              <View>
                <Text style={styles.cardText}>•••• •••• •••• 8888</Text>
                <Text style={styles.cardSubtext}>Expires 09/24</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(1000)} style={styles.section}>
        <Text style={styles.sectionTitle}>Other Payment Methods</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="logo-apple" size={20} color="#D4AF37" />
              </View>
              <Text style={styles.settingText}>Apple Pay</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="logo-google" size={20} color="#D4AF37" />
              </View>
              <Text style={styles.settingText}>Google Pay</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="logo-paypal" size={20} color="#D4AF37" />
              </View>
              <Text style={styles.settingText}>PayPal</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={24} color="#D4AF37" />
        <Text style={styles.addButtonText}>Add New Payment Method</Text>
      </TouchableOpacity>
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
    height: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
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
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 40,
    height: 25,
    borderRadius: 4,
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
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  defaultText: {
    color: '#D4AF37',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  settingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1E',
    margin: 20,
    padding: 16,
    borderRadius: 16,
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
  addButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});