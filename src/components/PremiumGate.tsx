import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radius } from '../theme';

const { width: W } = Dimensions.get('window');

interface PremiumGateProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  feature: string;
  emoji?: string;
}

export default function PremiumGate({ visible, onClose, onSubscribe, feature, emoji = '👑' }: PremiumGateProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFillObject} />
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />

        <View style={styles.card}>
          <LinearGradient colors={['#134227', '#0A1F14']} style={StyleSheet.absoluteFillObject} />
          <View style={styles.cardAccent} />
          <View style={styles.cardGlow} />

          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.title}>Recurso Exclusivo</Text>
          <Text style={styles.subtitle}>
            <Text style={styles.featureName}>{feature}</Text> é exclusivo para membros{'\n'}
            <Text style={styles.planName}>Mancha Verde eu sou</Text>
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceFrom}>A partir de</Text>
            <Text style={styles.price}>R$ 10</Text>
            <Text style={styles.pricePeriod}>/mês</Text>
          </View>

          <View style={styles.features}>
            {[
              'Curtir e comentar nos Reels',
              'Enviar Cartões da Mancha',
              'Minha História completa',
              '15% de desconto na Loja',
            ].map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={onSubscribe} style={{ borderRadius: Radius.lg, overflow: 'hidden', width: '100%' }}>
            <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.subscribeBtn}>
              <Text style={styles.subscribeBtnText}>💚 Assinar Mancha Verde eu sou</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>Agora não</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  card: {
    width: W - Spacing.xl * 2,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,255,133,0.3)',
    padding: 28,
    alignItems: 'center',
    position: 'relative',
  },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primaryBright },
  cardGlow: { position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(0,255,133,0.08)' },
  emoji: { fontSize: 52, marginBottom: 16 },
  title: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800', marginBottom: 10 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  featureName: { color: Colors.primaryBright, fontWeight: '700' },
  planName: { color: Colors.primaryBright, fontWeight: '700' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 20 },
  priceFrom: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  price: { fontSize: 36, color: Colors.primaryBright, fontWeight: '900', lineHeight: 40 },
  pricePeriod: { fontSize: 14, color: Colors.textMuted, marginBottom: 6 },
  features: { width: '100%', gap: 8, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureCheck: { fontSize: 14, color: Colors.primaryBright, fontWeight: '700', width: 20 },
  featureText: { fontSize: 13, color: Colors.textSecondary },
  subscribeBtn: { height: 52, alignItems: 'center', justifyContent: 'center', width: '100%' },
  subscribeBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  closeBtn: { marginTop: 14, padding: 10 },
  closeBtnText: { fontSize: 13, color: Colors.textMuted },
});
