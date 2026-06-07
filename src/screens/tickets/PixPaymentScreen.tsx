import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Clipboard, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEventsStore } from '../../store/eventsStore';
import { Colors, Spacing, Radius } from '../../theme';

export default function PixPaymentScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { currentOrder } = useEventsStore();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleCopy = () => {
    if (currentOrder?.pixCode) {
      Clipboard.setString(currentOrder.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSimulatePaid = () => {
    Alert.alert(
      '✅ Pagamento Confirmado!',
      'Seu ingresso foi gerado com sucesso.',
      [{ text: 'Ver Ingresso', onPress: () => navigation.navigate('TicketSuccess') }]
    );
  };

  if (!currentOrder) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Colors.textMuted }}>Pedido não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: 60 }]}
      >
        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.xl }}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>

        {/* Timer */}
        <View style={styles.timerWrap}>
          <View style={[styles.timerBadge, { borderColor: timeLeft < 300 ? Colors.red : Colors.goldBorder }]}>
            <Text style={styles.timerIcon}>⏱️</Text>
            <Text style={[styles.timerText, { color: timeLeft < 300 ? Colors.red : Colors.gold }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
          <Text style={styles.timerLabel}>Tempo restante para pagar</Text>
        </View>

        {/* Resumo */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryAccent} />
          <Text style={styles.summaryTitle}>{currentOrder.eventTitle}</Text>
          <Text style={styles.summaryTicket}>{currentOrder.ticketTypeName}</Text>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Total a pagar</Text>
            <Text style={styles.summaryTotalValue}>R$ {currentOrder.totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* QR Code Simulado */}
        <View style={styles.qrWrap}>
          <Text style={styles.qrTitle}>QR Code PIX</Text>
          <View style={styles.qrBox}>
            <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.qrInner}>
              <Text style={{ fontSize: 80 }}>📱</Text>
              <Text style={styles.qrHint}>Abra seu banco e escaneie</Text>
            </LinearGradient>
          </View>
        </View>

        {/* PIX Copia e Cola */}
        <View style={styles.pixSection}>
          <Text style={styles.pixLabel}>PIX Copia e Cola</Text>
          <View style={styles.pixCodeWrap}>
            <Text style={styles.pixCode} numberOfLines={3}>{currentOrder.pixCode}</Text>
          </View>
          <TouchableOpacity onPress={handleCopy} style={styles.copyBtn} activeOpacity={0.85}>
            <LinearGradient
              colors={copied ? ['#00D26A', '#00A855'] : Colors.gradientPrimary}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.copyBtnGrad}
            >
              <Text style={styles.copyBtnText}>
                {copied ? '✓ Código Copiado!' : '📋 Copiar Código PIX'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Instruções */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Como pagar:</Text>
          {[
            'Abra o app do seu banco',
            'Acesse a área PIX',
            'Escolha "Pagar com QR Code" ou "Copia e Cola"',
            'Cole o código ou escaneie o QR Code',
            'Confirme o pagamento',
            'Seu ingresso será gerado automaticamente',
          ].map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Simular pagamento (apenas para teste) */}
        <TouchableOpacity onPress={handleSimulatePaid} style={styles.simulateBtn}>
          <Text style={styles.simulateBtnText}>🧪 Simular Pagamento (Teste)</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.xl },
  timerWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 20, paddingVertical: 10, marginBottom: 6 },
  timerIcon: { fontSize: 18 },
  timerText: { fontSize: 24, fontWeight: '700', letterSpacing: 2 },
  timerLabel: { fontSize: 12, color: Colors.textMuted },
  summaryCard: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.xl, position: 'relative', overflow: 'hidden' },
  summaryAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primary },
  summaryTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  summaryTicket: { fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing.base },
  summaryDivider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.base },
  summaryTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTotalLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryTotalValue: { fontSize: 24, color: Colors.primary, fontWeight: '700' },
  qrWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  qrTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  qrBox: { width: 220, height: 220, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 2, borderColor: Colors.goldBorder },
  qrInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  qrHint: { fontSize: 12, color: Colors.textMuted, textAlign: 'center' },
  pixSection: { marginBottom: Spacing.xl },
  pixLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  pixCodeWrap: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.base, marginBottom: Spacing.sm },
  pixCode: { fontSize: 11, color: Colors.textMuted, fontFamily: 'monospace' },
  copyBtn: { borderRadius: Radius.lg, overflow: 'hidden' },
  copyBtnGrad: { height: 52, alignItems: 'center', justifyContent: 'center' },
  copyBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  instructions: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.xl },
  instructionsTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}44`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumText: { fontSize: 11, color: Colors.primary, fontWeight: '700' },
  stepText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 22, flex: 1 },
  simulateBtn: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center' },
  simulateBtnText: { fontSize: 13, color: Colors.textMuted },
});
