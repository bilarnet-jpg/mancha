import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radius } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  borderRadius?: number;
  noPadding?: boolean;
}

export default function GlassCard({ children, style, intensity = 40, borderRadius = Radius.xl, noPadding = false }: GlassCardProps) {
  return (
    <View style={[styles.wrapper, { borderRadius }, style]}>
      <BlurView intensity={intensity} tint="dark" style={[StyleSheet.absoluteFillObject, { borderRadius }]} />
      <View style={[styles.tint, { borderRadius }]} />
      <View style={styles.shine} pointerEvents="none" />
      <View style={[styles.content, !noPadding && styles.padding]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    position: 'relative',
  },
  tint: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(20, 56, 34, 0.35)',
  },
  shine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  content: {
    position: 'relative',
  },
  padding: {
    padding: 20,
  },
});
