import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius } from '../theme';

interface PillButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'gold' | 'outline';
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export default function PillButton({ label, onPress, variant = 'primary', style, fullWidth }: PillButtonProps) {
  if (variant === 'outline') {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.outline, fullWidth && styles.fullWidth, style]} activeOpacity={0.7}>
        <Text style={styles.outlineText}>{label}</Text>
      </TouchableOpacity>
    );
  }

  const gradient = variant === 'gold' ? Colors.gradientGold : Colors.gradientPrimary;

  return (
    <TouchableOpacity onPress={onPress} style={[fullWidth && styles.fullWidth, style]} activeOpacity={0.85}>
      <LinearGradient colors={gradient as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.pill}>
        <Text style={styles.pillText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  outline: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.glassBorderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  fullWidth: {
    width: '100%',
  },
});
