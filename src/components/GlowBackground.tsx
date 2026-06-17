import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';

export default function GlowBackground() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <LinearGradient
        colors={Colors.gradientBg as any}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.glow1} />
      <View style={styles.glow2} />
    </View>
  );
}

const styles = StyleSheet.create({
  glow1: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(0,255,133,0.10)',
  },
  glow2: {
    position: 'absolute',
    top: 320,
    left: -120,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,216,116,0.06)',
  },
});
