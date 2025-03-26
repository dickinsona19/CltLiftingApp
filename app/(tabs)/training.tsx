import React from 'react';
import { ScrollView, Image, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '@/constants/theme';
import { ChevronRight, Timer, Zap, Users } from 'lucide-react-native';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Header = styled.View`
  padding: ${theme.spacing.xl}px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.bold};
  font-size: 28px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs}px;
  letter-spacing: 0.5px;
`;

const Subtitle = styled.Text`
  font-family: ${theme.fonts.regular};
  font-size: 15px;
  color: ${theme.colors.textSecondary};
  line-height: 22px;
`;

const TrainingCard = styled.TouchableOpacity`
  margin: ${theme.spacing.md}px ${theme.spacing.xl}px;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl}px;
  overflow: hidden;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 200px;
`;

const CardOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background-color: ${theme.colors.overlay};
`;

const CardContent = styled.View`
  padding: ${theme.spacing.xl}px;
`;

const CardTitle = styled.Text`
  font-family: ${theme.fonts.bold};
  font-size: 20px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm}px;
  letter-spacing: 0.5px;
`;

const CardDescription = styled.Text`
  font-family: ${theme.fonts.regular};
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  line-height: 20px;
  margin-bottom: ${theme.spacing.lg}px;
`;

const MetaContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${theme.spacing.lg}px;
`;

const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: ${theme.spacing.lg}px;
`;

const MetaText = styled.Text`
  font-family: ${theme.fonts.regular};
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  margin-left: ${theme.spacing.xs}px;
`;

const PriceRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;

const Price = styled.Text`
  font-family: ${theme.fonts.bold};
  font-size: 24px;
  color: ${theme.colors.primary};
  letter-spacing: 0.5px;
`;

export default function TrainingScreen() {
  return (
    <Container>
      <Header>
        <Title>Training Programs</Title>
        <Subtitle>Expert-designed workouts to help you reach your fitness goals</Subtitle>
      </Header>

      <TrainingCard>
        <CardImage
          source={{ uri: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=1000&auto=format&fit=crop' }}
          resizeMode="cover"
        />
        <CardOverlay />
        <CardContent>
          <CardTitle>Advanced Strength Program</CardTitle>
          <CardDescription>
            12-week program designed to maximize your strength gains with progressive overload and periodization.
          </CardDescription>
          <MetaContainer>
            <MetaItem>
              <Timer size={16} color={theme.colors.textSecondary} />
              <MetaText>12 Weeks</MetaText>
            </MetaItem>
            <MetaItem>
              <Zap size={16} color={theme.colors.textSecondary} />
              <MetaText>Advanced</MetaText>
            </MetaItem>
          </MetaContainer>
          <PriceRow>
            <Price>$287</Price>
            <ChevronRight color={theme.colors.textSecondary} size={24} />
          </PriceRow>
        </CardContent>
      </TrainingCard>

      <TrainingCard>
        <CardImage
          source={{ uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop' }}
          resizeMode="cover"
        />
        <CardOverlay />
        <CardContent>
          <CardTitle>HIIT Performance</CardTitle>
          <CardDescription>
            High-intensity program focusing on explosive power and cardiovascular endurance.
          </CardDescription>
          <MetaContainer>
            <MetaItem>
              <Timer size={16} color={theme.colors.textSecondary} />
              <MetaText>8 Weeks</MetaText>
            </MetaItem>
            <MetaItem>
              <Zap size={16} color={theme.colors.textSecondary} />
              <MetaText>Intermediate</MetaText>
            </MetaItem>
          </MetaContainer>
          <PriceRow>
            <Price>$199</Price>
            <ChevronRight color={theme.colors.textSecondary} size={24} />
          </PriceRow>
        </CardContent>
      </TrainingCard>

      <TrainingCard style={{ marginBottom: theme.spacing.xl }}>
        <CardImage
          source={{ uri: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop' }}
          resizeMode="cover"
        />
        <CardOverlay />
        <CardContent>
          <CardTitle>1-on-1 Coaching</CardTitle>
          <CardDescription>
            Personalized training sessions with our expert coaches, tailored to your specific goals.
          </CardDescription>
          <MetaContainer>
            <MetaItem>
              <Users size={16} color={theme.colors.textSecondary} />
              <MetaText>Private Sessions</MetaText>
            </MetaItem>
            <MetaItem>
              <Timer size={16} color={theme.colors.textSecondary} />
              <MetaText>60 Minutes</MetaText>
            </MetaItem>
          </MetaContainer>
          <PriceRow>
            <Price>$99/session</Price>
            <ChevronRight color={theme.colors.textSecondary} size={24} />
          </PriceRow>
        </CardContent>
      </TrainingCard>
    </Container>
  );
}