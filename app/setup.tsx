import React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Linking } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  FadeIn,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing
} from 'react-native-reanimated';
import {  useState } from 'react';
import { FileText, Camera, Check } from 'lucide-react-native';

import EditImageModal from './(tabs)/profile/EditImageModal';
import { useUser } from '@/context/UserContext';
const { width, height } = Dimensions.get('window');

const Circle = ({ delay, size, position, color }: any) => {


  const animatedStyle = useAnimatedStyle(() => {
    const animation = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    return {
      transform: [{ scale: animation }],
    };
  });

  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(1000)}
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          ...position,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function SetupScreen() {
    const {user} =useUser()

  const [showImageModal, setShowImageModal] = useState(false);



  return (
    <>
      <View style={styles.container}>
        {/* Background Elements */}
        <Circle
          delay={0}
          size={300}
          position={{ top: -100, left: -100 }}
          color="rgba(212, 175, 55, 0.1)"
        />
        <Circle
          delay={200}
          size={200}
          position={{ top: height * 0.3, right: -50 }}
          color="rgba(212, 175, 55, 0.15)"
        />
        <Circle
          delay={400}
          size={250}
          position={{ bottom: -100, left: -50 }}
          color="rgba(212, 175, 55, 0.08)"
        />
        
        {/* Decorative Lines */}
        <Animated.View 
          entering={FadeIn.delay(600).duration(1000)}
          style={[styles.line, styles.line1]} 
        />
        <Animated.View 
          entering={FadeIn.delay(800).duration(1000)}
          style={[styles.line, styles.line2]} 
        />
        
        {/* Content */}
        <Animated.View 
          entering={FadeIn.delay(1000).duration(1000)}
          style={styles.content}
        >
          <Text style={styles.title}>CLT LIFTING CLUB</Text>
          <Text style={styles.subtitle}>STRENGTH • COMMUNITY • GROWTH</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>MEMBERS</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>ACCESS</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15k</Text>
              <Text style={styles.statLabel}>SQ FT</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable 
              style={styles.button} 
              onPress={() => Linking.openURL(`http://localhost:5173/signWaiver?userId=${user?.id}`)}
              disabled={!!user?.signatureData}
            >
               {user?.signatureData ? <Check color="#1A1A1A" size={24} /> : <FileText color="#1A1A1A" size={24} />}
              <Text style={styles.buttonText}>Sign Waiver</Text>
            </Pressable>

            <Pressable 
              style={styles.button}
              onPress={() => setShowImageModal(true)}
              disabled={!!user?.profilePicture}
            >
              {user?.profilePicture ? <Check color="#1A1A1A" size={24} /> : <Camera color="#1A1A1A" size={24} />}
              <Text style={styles.buttonText}>Add Photo</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>

      {showImageModal && (
        <EditImageModal
          setModalVisible={setShowImageModal}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    opacity: 0.5,
  },
  line: {
    position: 'absolute',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    height: 2,
    width: width * 2,
    transform: [{ rotate: '-45deg' }],
  },
  line1: {
    top: height * 0.2,
  },
  line2: {
    top: height * 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#D4AF37',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    letterSpacing: 2,
    marginBottom: 48,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#D4AF37',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    letterSpacing: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#333333',
    marginHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 48,
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 24,
  },
  button: {
    flex: 1,
    backgroundColor: '#D4AF37',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
});