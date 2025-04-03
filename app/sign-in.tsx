import React, { useState } from 'react';
import { Platform, Keyboard, TouchableWithoutFeedback, Linking } from 'react-native';
import { router } from 'expo-router';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { Phone, Lock, ArrowRight, Dumbbell } from 'lucide-react-native';
import { useUser } from '@/context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
  min-height: ${Platform.OS === 'web' ? '100vh' : '100%'};
  padding: ${theme.spacing.xl}px;
  justify-content: center;
`;

const LogoContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: ${theme.borderRadius.lg}px;
  overflow: hidden;
  margin-bottom: ${theme.spacing.xl}px;
  align-self: center;
`;

const LogoInner = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const LogoIcon = styled(Dumbbell)`
  transform: rotate(-45deg);
`;

const Title = styled.Text`
  font-family: ${theme.fonts.bold};
  font-size: 32px;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.md}px;
`;

const Subtitle = styled.Text`
  font-family: ${theme.fonts.regular};
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl}px;
`;

const Form = styled.View`
  width: 100%;
  max-width: 400px;
  align-self: center;
`;

const InputContainer = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.lg}px;
`;

const Input = styled.TextInput`
  flex: 1;
  font-family: ${theme.fonts.regular};
  font-size: 16px;
  color: ${theme.colors.text};
  margin-left: ${theme.spacing.md}px;
`;

const SignInButton = styled.TouchableOpacity`
  overflow: hidden;
  border-radius: ${theme.borderRadius.lg}px;
  margin-top: ${theme.spacing.md}px;
`;

const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg}px;
`;

const ButtonText = styled.Text`
  font-family: ${theme.fonts.bold};
  font-size: 16px;
  color: ${theme.colors.background};
  margin-right: ${theme.spacing.sm}px;
`;

const SignUpContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${theme.spacing.xl}px;
`;

const SignUpText = styled.Text`
  font-family: ${theme.fonts.regular};
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`;

const SignUpLink = styled.Text`
  font-family: ${theme.fonts.bold};
  font-size: 14px;
  color: ${theme.colors.primary};
  margin-left: ${theme.spacing.xs}px;
`;

const ErrorText = styled.Text`
  font-family: ${theme.fonts.regular};
  font-size: 14px;
  color: ${theme.colors.error};
  text-align: center;
  margin-top: ${theme.spacing.md}px;
`;

export default function SignInScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useUser();

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:8082/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, password }),
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.user)
        console.log('Sign in success:', data);
        await AsyncStorage.setItem('userToken', data.token); // Use AsyncStorage to store token
        setError(null);
        // Navigate to app or update state here
      } else {
        const errorData = await response.json();
        console.error('Sign in failed:', errorData.error);
        setError(errorData.error);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Network error');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <ScrollContainer contentContainerStyle={{ flexGrow: 1 }}>
          <ContentContainer>
            <LogoContainer>
              <LinearGradient
                colors={theme.colors.gradient.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '100%', height: '100%' }}>
                <LogoInner>
                  <LogoIcon size={40} color={theme.colors.background} />
                </LogoInner>
              </LinearGradient>
            </LogoContainer>

            <Title>Welcome Back</Title>
            <Subtitle>Sign in to access your fitness journey</Subtitle>

            <Form>
              <InputContainer>
                <InputWrapper>
                  <Phone size={20} color={theme.colors.textSecondary} />
                  <Input
                    placeholder="Phone Number"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </InputWrapper>
              </InputContainer>

              <InputContainer>
                <InputWrapper>
                  <Lock size={20} color={theme.colors.textSecondary} />
                  <Input
                    placeholder="Password"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </InputWrapper>
              </InputContainer>

              <SignInButton onPress={handleSignIn}>
                <LinearGradient
                  colors={theme.colors.gradient.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: '100%' }}>
                  <ButtonContent>
                    <ButtonText>SIGN IN</ButtonText>
                    <ArrowRight size={20} color={theme.colors.background} />
                  </ButtonContent>
                </LinearGradient>
              </SignInButton>

              {error && <ErrorText>{error}</ErrorText>}

              <SignUpContainer>
                <SignUpText>Don't have an account?</SignUpText>
                <SignUpLink onPress={() => Linking.openURL('https://boss-lifting-club.onrender.com/signup')}>
                  Sign up
                </SignUpLink>
              </SignUpContainer>
            </Form>
          </ContentContainer>
        </ScrollContainer>
      </Container>
    </TouchableWithoutFeedback>
  );
}