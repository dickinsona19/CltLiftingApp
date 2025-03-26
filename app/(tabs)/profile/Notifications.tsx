import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useState } from 'react';

export default function NotificationsScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [progressUpdates, setProgressUpdates] = useState(true);
  const [newsUpdates, setNewsUpdates] = useState(false);
  
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
        <Text style={styles.sectionTitle}>Notification Channels</Text>
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.settingText}>Push Notifications</Text>
                <Text style={styles.settingSubtext}>Receive alerts on your device</Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#2C2C2E', true: 'rgba(212, 175, 55, 0.3)' }}
              thumbColor={pushEnabled ? '#D4AF37' : '#8E8E93'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.settingText}>Email Notifications</Text>
                <Text style={styles.settingSubtext}>Receive updates via email</Text>
              </View>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: '#2C2C2E', true: 'rgba(212, 175, 55, 0.3)' }}
              thumbColor={emailEnabled ? '#D4AF37' : '#8E8E93'}
            />
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(1000)} style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Types</Text>
        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="fitness" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.settingText}>Workout Reminders</Text>
                <Text style={styles.settingSubtext}>Daily workout notifications</Text>
              </View>
            </View>
            <Switch
              value={workoutReminders}
              onValueChange={setWorkoutReminders}
              trackColor={{ false: '#2C2C2E', true: 'rgba(212, 175, 55, 0.3)' }}
              thumbColor={workoutReminders ? '#D4AF37' : '#8E8E93'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="trending-up" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.settingText}>Progress Updates</Text>
                <Text style={styles.settingSubtext}>Weekly progress summaries</Text>
              </View>
            </View>
            <Switch
              value={progressUpdates}
              onValueChange={setProgressUpdates}
              trackColor={{ false: '#2C2C2E', true: 'rgba(212, 175, 55, 0.3)' }}
              thumbColor={progressUpdates ? '#D4AF37' : '#8E8E93'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="newspaper" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.settingText}>News & Updates</Text>
                <Text style={styles.settingSubtext}>Product updates and news</Text>
              </View>
            </View>
            <Switch
              value={newsUpdates}
              onValueChange={setNewsUpdates}
              trackColor={{ false: '#2C2C2E', true: 'rgba(212, 175, 55, 0.3)' }}
              thumbColor={newsUpdates ? '#D4AF37' : '#8E8E93'}
            />
          </View>
        </View>
      </Animated.View>

      <TouchableOpacity style={styles.scheduleButton}>
        <Ionicons name="time" size={24} color="#D4AF37" />
        <Text style={styles.scheduleButtonText}>Configure Quiet Hours</Text>
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
    marginRight: 16,
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
  scheduleButton: {
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
  scheduleButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});