import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '@/constants/theme';
import { Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HeaderContainer = styled.View`
  height: ${Platform.OS === 'web' ? '80px' : '100px'};
  background-color: ${theme.colors.background};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
  padding-top: ${Platform.OS === 'web' ? '0' : '20px'};
  padding-horizontal: ${theme.spacing.xl}px;
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LogoContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.md}px;
  overflow: hidden;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 6;
`;

const LogoText = styled.Text`
  font-family: ${theme.fonts.bold};
  font-size: 32px;
  color: ${theme.colors.background};
  line-height: 38px;
  z-index: 1;
`;

const LogoInner = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.bold};
  font-size: 20px;
  color: ${theme.colors.text};
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-left: 10px; /* Adjusted to move the title a little to the left */
`;

const NotificationButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full}px;
  background-color: ${theme.colors.surface};
  justify-content: center;
  align-items: center;
`;

const NotificationBadge = styled.View`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: ${theme.borderRadius.full}px;
  background-color: ${theme.colors.primary};
  border: 2px solid ${theme.colors.background};
`;

const CenterContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-left: -15px; /* Adjusted to move the center container a little to the left */
`;

export default function Header() {
  return (
    <HeaderContainer>
      <LeftSection>
        <LogoContainer>
          <LinearGradient
            colors={theme.colors.gradient.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: '100%', height: '100%' }}>
            <LogoInner>
              <LogoText>C</LogoText>
            </LogoInner>
          </LinearGradient>
        </LogoContainer>
      </LeftSection>
      <CenterContainer>
        <Title>CLT Lifting Club</Title>
      </CenterContainer>
      {/* <NotificationButton>
        <Bell size={20} color={theme.colors.textSecondary} />
        <NotificationBadge />
      </NotificationButton> */}
    </HeaderContainer>
  );
}