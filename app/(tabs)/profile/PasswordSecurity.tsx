import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { changeUserPassword } from '../../../actions/User';

export default function PasswordSecurityScreen() {
  const {user} = useUser();
  const router = useRouter();
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');



  function handlePasswordChange(){
    if (oldPassword && newPassword) {
      changeUserPassword(user?.id, newPassword).then(() => {
        Alert.alert('Success', 'Password changed successfully.');
        setOldPassword('');
        setNewPassword('');
        setShowChangePassword(false);
      }).catch((error) => {
        Alert.alert('Error', 'Failed to change password.');
      });
    } else {
      Alert.alert('Error', 'Please fill in both old and new password fields.');
    }
  }

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
        <Text style={styles.sectionTitle}>Password</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem} onPress={()=>{setShowChangePassword(!showChangePassword)}}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.settingText}>Change Password</Text>
                <Text style={styles.settingSubtext}>Last changed 3 months ago</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          {showChangePassword && (
            <View style={styles.changePasswordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Old Password"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={true}
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={true}
              />
              <Button
                title="Change Password"
                onPress={handlePasswordChange}
              />
            </View>
          )}

          {/* <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="finger-print" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.settingText}>Two-Factor Authentication</Text>
                <Text style={styles.settingSubtext}>Enabled</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity> */}
        </View>
      </Animated.View>

      {/* <Animated.View entering={FadeInDown.delay(400).duration(1000)} style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="phone-portrait" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.settingText}>Trusted Devices</Text>
                <Text style={styles.settingSubtext}>2 devices</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="time" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.settingText}>Login History</Text>
                <Text style={styles.settingSubtext}>View recent activity</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </Animated.View> */}

      {/* <Animated.View entering={FadeInDown.delay(600).duration(1000)} style={styles.section}>
        <Text style={styles.sectionTitle}>Recovery</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.settingText}>Recovery Email</Text>
                <Text style={styles.settingSubtext}>j***@gmail.com</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="key" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.settingText}>Recovery Keys</Text>
                <Text style={styles.settingSubtext}>Generate new keys</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </Animated.View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  changePasswordContainer: {
    padding: 16,
    marginTop: 16,
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
  input: {
    height: 40,
    borderColor: '#2C2C2E',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#1C1C1E',
    color: '#fff',
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
    flex: 1,
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
  settingSubtext: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
});