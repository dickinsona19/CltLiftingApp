import { View, Text, StyleSheet, Dimensions, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useUser } from '@/context/UserContext';
import { StatusBar } from 'expo-status-bar';
export default function HomeScreen() {
  const screenWidth = Dimensions.get('window').width;
  const qrSize = Math.min(screenWidth * 0.6, 280);
  const {user} =useUser()
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <StatusBar hidden />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <LinearGradient
        colors={['rgba(75, 156, 211, 0.25)', 'rgba(38, 22, 183, 0)']}
        style={styles.gradient}
      />
      

      <Animated.View 
        entering={FadeInDown.delay(200).duration(1000)} 
        style={styles.contentContainer}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Digital Access Card</Text>
          <Text style={styles.subtitle}>
            Present this QR code at the entrance{'\n'}for quick and secure check-in
          </Text>

          <View style={styles.qrContainer}>
            <QRCode
              value={user?.entryQrcodeToken}
              size={qrSize}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          </View>
          {/* <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Invalid Member</Text>
          </View> */}
        </View>
      </Animated.View>
      </ScrollView>
    </>
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
  header: {
    paddingTop: Platform.OS === 'web' ? 40 : 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    color: '#D4AF37',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
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
  title: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    ...Platform.select({
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      default: {
        elevation: 2,
      },
    }),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});