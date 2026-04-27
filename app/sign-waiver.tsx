import { View, Text, StyleSheet } from 'react-native';

export default function SignWaiverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Waiver</Text>
      <Text style={styles.subtitle}>Waiver flow is being prepared for mobile.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
  },
});
