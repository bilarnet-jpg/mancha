import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Clipboard, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStoreStore } from '../../../store/storeStore';
import { Colors, Spacing, Radius } from '../../../theme';

// ── PIX PAYMENT ───────────────────────────────────────────────
export function StorePixPaymentScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { currentOrder, clearCart } = useStoreStore();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timer); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleCopy = () => {
    if (currentOrder?.pixCode) {
      Clipboard.setString(currentOrder.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSimulatePaid = () => {
    clearCart();
    Alert.alert('✅ Pagamento Confirmado!', 'Seu pedido foi confirmado.', [
      { text: 'Ver Pedido', onPress: () => navigation.navigate('OrderSuccess') },
    ]);
  };

  if (!currentOrder) return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: Colors.textMuted }}>Pedido não encontrado.</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.xl }}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>

        {/* Timer */}
        <View style={styles.timerWrap}>
          <View style={[styles.timerBadge, { borderColor: timeLeft < 300 ? Colors.red : Colors.goldBorder }]}>
            <Text style={styles.timerIcon}>⏱️</Text>
            <Text style={[styles.timerText, { color: timeLeft < 300 ? Colors.red : Colors.gold }]}>{formatTime(timeLeft)}</Text>
          </View>
          <Text style={styles.timerLabel}>Tempo restante para pagar</Text>
        </View>

        {/* Resumo */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryAccent} />
          <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
          {currentOrder.items.map((item, i) => (
            <View key={i} style={styles.orderItem}>
              <Text style={styles.orderItemName} numberOfLines={1}>{item.productName}</Text>
              <Text style={styles.orderItemQty}>x{item.quantity}</Text>
              <Text style={styles.orderItemPrice}>R$ {(item.unitPrice * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.summaryDivider} />
          {currentOrder.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={{ fontSize: 13, color: Colors.primary }}>Desconto</Text>
              <Text style={{ fontSize: 13, color: Colors.primary }}>-R$ {currentOrder.discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {currentOrder.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* QR Code */}
        <View style={styles.qrWrap}>
          <Text style={styles.qrTitle}>QR Code PIX</Text>
          <View style={styles.qrBox}>
            <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.qrInner}>
              <Text style={{ fontSize: 72 }}>📱</Text>
              <Text style={styles.qrHint}>Abra seu banco e escaneie</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Copia e cola */}
        <View style={styles.pixSection}>
          <Text style={styles.pixLabel}>PIX Copia e Cola</Text>
          <View style={styles.pixCodeWrap}>
            <Text style={styles.pixCode} numberOfLines={3}>{currentOrder.pixCode}</Text>
          </View>
          <TouchableOpacity onPress={handleCopy} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
            <LinearGradient colors={copied ? ['#00D26A', '#00A855'] : Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.copyBtn}>
              <Text style={styles.copyBtnText}>{copied ? '✓ Código Copiado!' : '📋 Copiar Código PIX'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Simular */}
        <TouchableOpacity onPress={handleSimulatePaid} style={styles.simulateBtn}>
          <Text style={styles.simulateBtnText}>🧪 Simular Pagamento (Teste)</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ── ORDER SUCCESS ─────────────────────────────────────────────
export function OrderSuccessScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { currentOrder } = useStoreStore();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 40, alignItems: 'center' }]}>
        <View style={styles.successIcon}>
          <Text style={{ fontSize: 60 }}>🎉</Text>
        </View>
        <Text style={styles.successTitle}>Pedido Confirmado!</Text>
        <Text style={styles.successSub}>Seu pagamento foi processado e o pedido está em preparação.</Text>

        {currentOrder && (
          <View style={styles.orderCard}>
            <View style={styles.orderCardAccent} />
            <Text style={styles.orderCardId}>Pedido #{currentOrder.id.slice(-8).toUpperCase()}</Text>
            <Text style={styles.orderCardDate}>{new Date(currentOrder.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
            <View style={styles.orderCardDivider} />
            {currentOrder.items.map((item, i) => (
              <View key={i} style={styles.orderItem}>
                <Text style={styles.orderItemName} numberOfLines={1}>{item.productName}</Text>
                <Text style={styles.orderItemQty}>x{item.quantity}</Text>
                <Text style={styles.orderItemPrice}>R$ {(item.unitPrice * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.orderCardDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Pago</Text>
              <Text style={styles.totalValue}>R$ {currentOrder.total.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* Status do pedido */}
        <View style={styles.statusSteps}>
          {[
            { label: 'Pedido Confirmado', done: true, icon: '✅' },
            { label: 'Em Preparação', done: false, icon: '📦' },
            { label: 'Enviado', done: false, icon: '🚚' },
            { label: 'Entregue', done: false, icon: '🏠' },
          ].map((step, i) => (
            <View key={i} style={styles.statusStep}>
              <View style={[styles.statusDot, { backgroundColor: step.done ? Colors.primary : Colors.border }]}>
                <Text style={{ fontSize: 10 }}>{step.done ? '✓' : ''}</Text>
              </View>
              <Text style={[styles.statusLabel, { color: step.done ? Colors.primary : Colors.textMuted }]}>
                {step.icon} {step.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ gap: 12, width: '100%', marginTop: Spacing.xl }}>
          <TouchableOpacity onPress={() => navigation.navigate('MyOrders')} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
            <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>📦 Acompanhar Pedido</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('StoreMain')} style={styles.outlineBtn}>
            <Text style={styles.outlineBtnText}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ── MY ORDERS ─────────────────────────────────────────────────
export function MyOrdersScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { orders, currentOrder } = useStoreStore();

  const allOrders = currentOrder ? [currentOrder, ...orders.filter(o => o.id !== currentOrder.id)] : orders;

  const STATUS_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
    pending: { label: 'Aguardando Pagamento', color: Colors.gold, emoji: '⏳' },
    paid: { label: 'Pago — Em Preparação', color: Colors.primary, emoji: '📦' },
    preparing: { label: 'Em Preparação', color: '#4FC3F7', emoji: '🔧' },
    shipped: { label: 'Enviado', color: '#9C27B0', emoji: '🚚' },
    delivered: { label: 'Entregue', color: Colors.primary, emoji: '✅' },
    cancelled: { label: 'Cancelado', color: Colors.red, emoji: '❌' },
  };

  return (
    <View style={[{ flex: 1, backgroundColor: Colors.bg }, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 100 }}>
        {allOrders.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 80, gap: 12 }}>
            <Text style={{ fontSize: 64 }}>📦</Text>
            <Text style={styles.successTitle}>Nenhum pedido ainda</Text>
            <Text style={{ fontSize: 13, color: Colors.textMuted }}>Seus pedidos aparecerão aqui</Text>
          </View>
        ) : (
          allOrders.map(order => {
            const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={[styles.orderCardAccent, { backgroundColor: statusCfg.color }]} />
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={styles.orderCardId}>#{order.id.slice(-8).toUpperCase()}</Text>
                    <Text style={styles.orderCardDate}>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${statusCfg.color}22`, borderColor: `${statusCfg.color}44` }]}>
                    <Text style={[styles.statusBadgeText, { color: statusCfg.color }]}>{statusCfg.emoji} {statusCfg.label}</Text>
                  </View>
                </View>
                <View style={styles.orderCardDivider} />
                {order.items.slice(0, 2).map((item, i) => (
                  <View key={i} style={styles.orderItem}>
                    <Text style={styles.orderItemName} numberOfLines={1}>{item.productName}</Text>
                    <Text style={styles.orderItemQty}>x{item.quantity}</Text>
                    <Text style={styles.orderItemPrice}>R$ {(item.unitPrice * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}
                {order.items.length > 2 && (
                  <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 4 }}>+{order.items.length - 2} outros itens</Text>
                )}
                <View style={styles.orderCardDivider} />
                <View style={styles.summaryRow}>
                  <Text style={{ fontSize: 13, color: Colors.textSecondary }}>{order.items.reduce((s, i) => s + i.quantity, 0)} itens</Text>
                  <Text style={styles.totalValue}>R$ {order.total.toFixed(2)}</Text>
                </View>
                {order.trackingCode && (
                  <View style={styles.trackingWrap}>
                    <Text style={styles.trackingLabel}>📬 Rastreio:</Text>
                    <Text style={styles.trackingCode}>{order.trackingCode}</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  timerWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 20, paddingVertical: 10, marginBottom: 6 },
  timerIcon: { fontSize: 18 },
  timerText: { fontSize: 24, fontWeight: '700', letterSpacing: 2 },
  timerLabel: { fontSize: 12, color: Colors.textMuted },
  summaryCard: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.xl, position: 'relative', overflow: 'hidden' },
  summaryAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primary },
  summaryTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  summaryDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  totalLabel: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700' },
  totalValue: { fontSize: 20, color: Colors.primary, fontWeight: '700' },
  orderItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  orderItemName: { flex: 1, fontSize: 13, color: Colors.textSecondary },
  orderItemQty: { fontSize: 12, color: Colors.textMuted },
  orderItemPrice: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  qrWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  qrTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  qrBox: { width: 200, height: 200, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 2, borderColor: Colors.goldBorder },
  qrInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  qrHint: { fontSize: 12, color: Colors.textMuted },
  pixSection: { marginBottom: Spacing.xl },
  pixLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  pixCodeWrap: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.base, marginBottom: Spacing.sm },
  pixCode: { fontSize: 10, color: Colors.textMuted, fontFamily: 'monospace' },
  copyBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  copyBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  simulateBtn: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center', marginBottom: 40 },
  simulateBtnText: { fontSize: 13, color: Colors.textMuted },
  successIcon: { width: 110, height: 110, borderRadius: 55, backgroundColor: Colors.primaryMuted, borderWidth: 2, borderColor: `${Colors.primary}44`, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.base },
  successTitle: { fontSize: 24, color: Colors.textPrimary, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  successSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  orderCard: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.base, position: 'relative', overflow: 'hidden' },
  orderCardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primary },
  orderCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  orderCardId: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700' },
  orderCardDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  orderCardDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  statusBadge: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 8, paddingVertical: 4 },
  statusBadgeText: { fontSize: 10, fontWeight: '600' },
  statusSteps: { width: '100%', gap: 12, marginTop: Spacing.xl },
  statusStep: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statusLabel: { fontSize: 14 },
  actionBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  outlineBtn: { height: 52, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg },
  outlineBtnText: { fontSize: 14, color: Colors.textSecondary },
  trackingWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  trackingLabel: { fontSize: 12, color: Colors.textMuted },
  trackingCode: { fontSize: 13, color: Colors.primary, fontWeight: '600', letterSpacing: 1 },
});
