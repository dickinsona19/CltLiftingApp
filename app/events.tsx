import React from 'react';
import styled from 'styled-components/native';
import { theme } from '@/constants/theme';
import { Calendar } from 'lucide-react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg}px;
`;

const Card = styled.View`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.xl}px;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const IconContainer = styled.View`
  background-color: ${theme.colors.secondary}20;
  padding: ${theme.spacing.lg}px;
  border-radius: ${theme.borderRadius.full}px;
  margin-bottom: ${theme.spacing.lg}px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.bold};
  font-size: 24px;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.md}px;
`;

const Subtitle = styled.Text`
  font-family: ${theme.fonts.regular};
  font-size: 16px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: 24px;
`;

export default function EventsScreen() {
  return (
    <Container>
      <Card>
        <IconContainer>
          <Calendar size={48} color={theme.colors.secondary} />
        </IconContainer>
        <Title>Coming Soon</Title>
        <Subtitle>
          Get ready for exciting gym events, competitions, and community meetups. We'll notify you when event registration opens!
        </Subtitle>
      </Card>
    </Container>
  );
}