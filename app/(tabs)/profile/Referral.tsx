import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { Box, Divider } from '@gluestack-ui/themed';
import { useUser } from '@/context/UserContext';


export default function Referral() {
  const {user} = useUser()
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [referredUsers] = useState(user?.referredMembersDto || null);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });
console.log(user)
  const handleCopy = () => {
    Clipboard.setString(user?.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.section}>
        <Text style={styles.sectionTitle}>Your Referral Code</Text>
        <Box style={styles.card}>
          <View style={styles.referralCodeWrapper}>
            <LinearGradient
              colors={['#2A2A2A', '#1C1C1E']}
              style={styles.referralCodeBox}
            >
              <View style={styles.referralCodeContent}>
                <Ionicons 
                  name="gift-outline" 
                  size={24} 
                  color="#D4AF37" 
                  style={styles.codeIcon} 
                />
                <Text style={styles.referralCode}>{user?.referralCode}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.copyButton, copied && styles.copyButtonActive]}
                onPress={handleCopy}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={copied ? "checkmark-circle" : "copy-outline"} 
                  size={24} 
                  color={copied ? "#D4AF37" : "#fff"} 
                />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.referralInfo}>
              <Text style={styles.referralCodeHint}>
                {copied ? "Copied to clipboard!" : "Share this code with friends"}
              </Text>
              <Text style={styles.referralCodeSubtext}>
                Earn rewards when they sign up!
              </Text>
            </View>
          </View>
        </Box>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.section}>
        <Text style={styles.sectionTitle}>Referred Friends</Text>
        <Box style={styles.referralList}>
          {referredUsers && referredUsers.map((user, index) => (
            <Box key={user.id} style={styles.referralItem}>
              <View style={styles.referralItemContent}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.firstName[0]}</Text>
                </View>
                <Text style={styles.referralName}>{user.firstName + " " + user.lastName}</Text>
              </View>
              {index < referredUsers.length - 1 && <Divider style={styles.divider} />}
            </Box>
          ))}
        </Box>
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
    height: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 50 : 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginLeft: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
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
  referralCodeWrapper: {
    alignItems: 'center',
  },
  referralCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  referralCodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeIcon: {
    marginRight: 12,
  },
  referralCode: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',

  },
  copyButtonActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  referralInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  referralCodeHint: {
    color:   'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  referralCodeSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  referralList: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 8,
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
  referralItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  referralItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#111111',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  referralName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 1,
  },
});