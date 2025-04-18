import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useUser } from '@/context/UserContext';
import { useState } from 'react';
import EditImageModal from './EditImageModal';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { theme } from '@/constants/theme';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateUser, userMedia } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  const profilePictureUri = user?.profilePictureUrl

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
       colors={['rgba(75, 156, 211, 0.25)', 'rgba(38, 22, 183, 0)']}
        style={styles.gradient}
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <EditImageModal setModalVisible={setModalVisible}/>
        </View>
      </Modal>
     
      <Animated.View entering={FadeInDown.delay(200).duration(1000)} style={styles.header}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: profilePictureUri || '' }}
            style={styles.profileImage}
          />
          <View style={styles.editIconContainer}>
            <Ionicons name="pencil" size={16} color="#FFF" />
          </View>
        
        </View>
        </TouchableOpacity>
        <Text style={styles.name}>{`${user?.firstName} ${user?.lastName}`}</Text>
        <View style={styles.membershipBadge}>
          <Text style={styles.membershipStatus}>Premium Member</Text>
        </View>
      </Animated.View>
   
     
{user?.membership &&
      <Animated.View entering={FadeInUp.delay(600).duration(1000)} style={styles.section}>
        <Text style={styles.sectionTitle}>Membership Details</Text>
        <View style={styles.membershipCard}>
          <View style={styles.membershipHeader}>
            <Ionicons name="fitness" size={24} color={theme.colors.primary} />
            <Text style={styles.membershipType}>{user?.membership?.name}</Text>
          </View>
          <Text style={styles.membershipExpiry}>$ {user?.membership?.price}/{user?.membership?.chargeInterval}</Text>
          <View style={styles.membershipPerks}>
            <Text style={styles.perkItem}>✓ Unlimited Gym Access</Text>
            <Text style={styles.perkItem}>✓ Sauna/Cold Plunge Access</Text>
            <Text style={styles.perkItem}>✓ Access To Exclusive Events</Text>
          </View>
        </View>
      </Animated.View>
}
     
      <Animated.View entering={FadeInUp.delay(1000).duration(1000)} style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.settingsContainer}>
        <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/(tabs)/profile/PasswordSecurity')}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="key" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.settingText}>Password & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
           style={styles.settingItem}
           onPress={() => router.push('/(tabs)/profile/Referral')}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="shield-checkmark" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.settingText}>Referral</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </TouchableOpacity>

            
          {/* <AnimatedTouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/(tabs)/profile/PaymentMethods')}
            disabled={true}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={20} color="#D4AF37" />
              </View>
              <Text style={styles.settingItemDisabled}>Payment Methods</Text>
              <Text style={{...styles.settingText, fontFamily: 'Arial'}}> (Coming soon..)</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </AnimatedTouchableOpacity>
          
          <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/(tabs)/profile/Notifications')}
          disabled={true}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={20} color="#D4AF37" />
              </View>
              <Text style={styles.settingItemDisabled}>Notifications</Text>
              <Text style={{...styles.settingText, fontFamily: 'Arial'}}> (Coming soon..)</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity> */}

        </View>
      </Animated.View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.removeItem('userToken');
          updateUser(null);
        }}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
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
    height: 600,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    width: '90%',
    alignItems: 'center',
    position: 'relative',
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: -40,
    right: 0,
    padding: 10,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 60,
  },
  profileImageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  membershipBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  membershipStatus: {
    color: theme.colors.primary,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1C1C1E',
    marginHorizontal: 20,
    marginVertical: 20,
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
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#2C2C2E',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 15,
  },
  membershipCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
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
  membershipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  membershipType: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 10,
  },
  membershipExpiry: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 15,
  },
  membershipPerks: {
    marginTop: 10,
  },
  perkItem: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
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
  actionText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  settingsContainer: {
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
  settingItemDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    color: 'rgba(128, 128, 128, 0.8)', // Grey and slightly opaque
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
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
  logoutButton: {
    margin: 20,
    marginTop: 10,
    padding: 15,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    alignItems: 'center',
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
  logoutText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});