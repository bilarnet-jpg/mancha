import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEventsStore } from '../../store/eventsStore';
import { Colors, Spacing, Radius } from '../../theme';

export default function TicketSuccessScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { currentOrder } = useEventsStore();

  const handleShare = async () => {
    if (!currentOrder) return;
    await Share.share({
      title: `Meu ingresso — ${currentOrder.eventTitle}`,
      message: `🎫 Tenho ingresso para ${currentOrder.eventTitle}!\n📅 ${currentOrder.eventDate}\n📍 ${currentOrder.eventLocation}\n\nNos vemos lá! 🐍💚`,
    });
  };

  if (!currentOrder) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Colors.textMuted }}>Ingresso não encontrado.</Text>
      </View>
    );
  }

  const ticket = currentOrder.tickets[0];
  const code = ticket?.code ?? `MCG${Date.now().toString().slice(-8)}`;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: 60 }]}
      >
        {/* Sucesso */}
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Text style={{ fontSize: 56 }}>🎉</Text>
          </View>
          <Text style={styles.successTitle}>Ingresso Garantido!</Text>
          <Text style={styles.successSub}>
            {currentOrder.paymentMethod === 'free'
              ? 'Sua inscrição foi confirmada com sucesso.'
              : 'Pagamento confirmado! Seu ingresso está pronto.'}
          </Text>
        </View>

        {/* INGRESSO DIGITAL */}
        <View style={styles.ticketWrap}>
          <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.ticket}>
            {/* Topo do ingresso */}
            <View style={styles.ticketTop}>
              <View style={styles.ticketAccent} />
              <View style={styles.ticketBadge}>
                <Text style={styles.ticketBadgeText}>🎫 INGRESSO OFICIAL</Text>
              </View>
              <Text style={styles.ticketEventTitle}>{currentOrder.eventTitle}</Text>
              <Text style={styles.ticketTypeName}>{currentOrder.ticketTypeName}</Text>
            </View>

            {/* Linha tracejada */}
            <View style={styles.ticketDivider}>
              <View style={styles.ticketHoleLeft} />
              <View style={styles.ticketDashedLine} />
              <View style={styles.ticketHoleRight} />
            </View>

            {/* Corpo do ingresso */}
            <View style={styles.ticketBody}>
              <View style={styles.ticketInfoGrid}>
                <TicketInfo label="📅 Data" value={new Date(currentOrder.eventDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} />
                <TicketInfo label="📍 Local" value={currentOrder.eventLocation} />
              </View>

              {/* QR Code simulado */}
              <View style={styles.qrWrap}>
                <View style={styles.qrBox}>
                  <Text style={{ fontSize: 52 }}>📲</Text>
                </View>
                <Text style={styles.qrHint}>Apresente na entrada</Text>
              </View>

              {/* Código */}
              <View style={styles.codeWrap}>
                <Text style={styles.codeLabel}>Código do Ingresso</Text>
                <Text style={styles.code}>{code}</Text>
              </View>

              {/* Status */}
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>ATIVO</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Ações */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn} activeOpacity={0.85}>
            <LinearGradient
              colors={Colors.gradientPrimary}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.shareBtnGrad}
            >
              <Text style={styles.shareBtnText}>📤 Compartilhar Ingresso</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('MyTickets')}
            style={styles.myTicketsBtn}
          >
            <Text style={styles.myTicketsBtnText}>🎫 Ver Meus Ingressos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('HomeTab')}
            style={styles.homeBtn}
          >
            <Text style={styles.homeBtnText}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function TicketInfo({ label, value }: { label: string; value: string }) {
  return (
    <View style={tiStyles.wrap}>
      <Text style={tiStyles.label}>{label}</Text>
      <Text style={tiStyles.value}>{value}</Text>
    </View>
  );
}

const tiStyles = StyleSheet.create({
  wrap: { marginBottom: 10 },
  label: { fontSize: 10, color: Colors.textMuted, letterSpacing: 1, marginBottom: 2 },
  value: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
});

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.xl },
  successWrap: { alignItems: 'center', marginBottom: Spacing.xxl },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.primaryMuted, borderWidth: 2, borderColor: `${Colors.primary}44`, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.base },
  successTitle: { fontSize: 26, color: Colors.textPrimary, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  successSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  ticketWrap: { marginBottom: Spacing.xxl, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: `${Colors.gold}33` },
  ticket: { },
  ticketTop: { padding: Spacing.xl, position: 'relative' },
  ticketAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: Colors.gold },
  ticketBadge: { backgroundColor: Colors.goldMuted, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 12 },
  ticketBadgeText: { fontSize: 10, color: Colors.gold, fontWeight: '700', letterSpacing: 1.5 },
  ticketEventTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', marginBottom: 6 },
  ticketTypeName: { fontSize: 14, color: Colors.textSecondary },
  ticketDivider: { flexDirection: 'row', alignItems: 'center', marginHorizontal: -1 },
  ticketHoleLeft: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bg, marginLeft: -12 },
  ticketDashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  ticketHoleRight: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bg, marginRight: -12 },
  ticketBody: { padding: Spacing.xl },
  ticketInfoGrid: { marginBottom: Spacing.base },
  qrWrap: { alignItems: 'center', marginBottom: Spacing.base },
  qrBox: { width: 140, height: 140, borderRadius: Radius.lg, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  qrHint: { fontSize: 11, color: Colors.textMuted },
  codeWrap: { alignItems: 'center', marginBottom: Spacing.base },
  codeLabel: { fontSize: 10, color: Colors.textMuted, letterSpacing: 2, marginBottom: 6 },
  code: { fontSize: 22, color: Colors.gold, fontWeight: '700', letterSpacing: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  statusText: { fontSize: 12, color: Colors.primary, fontWeight: '700', letterSpacing: 2 },
  actions: { gap: 12 },
  shareBtn: { borderRadius: Radius.lg, overflow: 'hidden' },
  shareBtnGrad: { height: 52, alignItems: 'center', justifyContent: 'center' },
  shareBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  myTicketsBtn: { height: 52, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.primary, borderRadius: Radius.lg },
  myTicketsBtnText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  homeBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  homeBtnText: { fontSize: 14, color: Colors.textMuted },
});
