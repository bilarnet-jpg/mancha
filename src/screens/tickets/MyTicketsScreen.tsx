import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEventsStore } from '../../store/eventsStore';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, Radius } from '../../theme';
import { MOCK_EVENTS } from '../../types/events';

export default function MyTicketsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { myTickets, myOrders, currentOrder, loadMyTickets } = useEventsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) loadMyTickets(user.id);
  }, [user]);

  // Mostrar ingresso atual da sessão se existir
  const sessionTickets = currentOrder?.tickets ?? [];
  const hasTickets = sessionTickets.length > 0 || myTickets.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Ingressos</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 100 }}>

        {!hasTickets ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>🎫</Text>
            <Text style={styles.emptyTitle}>Nenhum ingresso ainda</Text>
            <Text style={styles.emptySub}>Explore os eventos e garanta seu lugar!</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AgendaTab')}
              style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: 24 }}
            >
              <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>Ver Eventos</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Ingressos da sessão */}
            {sessionTickets.map(ticket => (
              <View key={ticket.id} style={styles.ticketCard}>
                <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.ticketGrad}>
                  <View style={styles.ticketAccent} />
                  <View style={styles.ticketHeader}>
                    <View style={styles.activeBadge}>
                      <View style={styles.activeDot} />
                      <Text style={styles.activeText}>ATIVO</Text>
                    </View>
                    <Text style={styles.ticketType}>{ticket.ticketTypeName}</Text>
                  </View>
                  <Text style={styles.ticketEvent}>{ticket.eventTitle}</Text>
                  <View style={styles.ticketMeta}>
                    <Text style={styles.ticketMetaText}>📅 {new Date(ticket.eventDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</Text>
                    <Text style={styles.ticketMetaText}>🕐 {ticket.eventTime}</Text>
                    <Text style={styles.ticketMetaText}>📍 {ticket.eventLocation}</Text>
                  </View>

                  {/* Divisor */}
                  <View style={styles.divider}>
                    <View style={styles.holeLeft} />
                    <View style={styles.dashedLine} />
                    <View style={styles.holeRight} />
                  </View>

                  {/* QR + Código */}
                  <View style={styles.ticketBottom}>
                    <View style={styles.qrMini}>
                      <Text style={{ fontSize: 36 }}>📲</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.codeLabel}>CÓDIGO</Text>
                      <Text style={styles.code}>{ticket.code}</Text>
                      <Text style={styles.codeHint}>Apresente na entrada</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}

            {/* Ingressos do banco */}
            {myTickets.map(ticket => (
              <View key={ticket.id} style={styles.ticketCard}>
                <LinearGradient
                  colors={ticket.status === 'used' ? ['#111', '#0a0a0a'] : ['#0d3d1a', '#051a0a']}
                  style={styles.ticketGrad}
                >
                  <View style={[styles.ticketAccent, { backgroundColor: ticket.status === 'used' ? Colors.textMuted : Colors.primary }]} />
                  <View style={styles.ticketHeader}>
                    <View style={[styles.activeBadge, { backgroundColor: ticket.status === 'used' ? Colors.border : Colors.primaryMuted }]}>
                      <Text style={[styles.activeText, { color: ticket.status === 'used' ? Colors.textMuted : Colors.primary }]}>
                        {ticket.status === 'used' ? 'UTILIZADO' : 'ATIVO'}
                      </Text>
                    </View>
                    <Text style={styles.ticketType}>{ticket.ticketTypeName}</Text>
                  </View>
                  <Text style={styles.ticketEvent}>{ticket.eventTitle}</Text>
                  <View style={styles.ticketMeta}>
                    <Text style={styles.ticketMetaText}>📅 {ticket.eventDate}</Text>
                    <Text style={styles.ticketMetaText}>📍 {ticket.eventLocation}</Text>
                  </View>
                  <View style={styles.divider}>
                    <View style={styles.holeLeft} />
                    <View style={styles.dashedLine} />
                    <View style={styles.holeRight} />
                  </View>
                  <View style={styles.ticketBottom}>
                    <View style={styles.qrMini}>
                      <Text style={{ fontSize: 36, opacity: ticket.status === 'used' ? 0.3 : 1 }}>📲</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.codeLabel}>CÓDIGO</Text>
                      <Text style={styles.code}>{ticket.code}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
  emptyBtn: { height: 52, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center' },
  emptyBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  ticketCard: { borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: `${Colors.gold}33`, marginBottom: Spacing.base },
  ticketGrad: { },
  ticketAccent: { height: 3, backgroundColor: Colors.gold },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.xl, paddingBottom: Spacing.sm },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.primaryMuted, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  activeText: { fontSize: 9, color: Colors.primary, fontWeight: '700', letterSpacing: 1.5 },
  ticketType: { fontSize: 12, color: Colors.gold, fontWeight: '600' },
  ticketEvent: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700', paddingHorizontal: Spacing.xl, marginBottom: 10 },
  ticketMeta: { paddingHorizontal: Spacing.xl, gap: 4, marginBottom: Spacing.base },
  ticketMetaText: { fontSize: 12, color: Colors.textSecondary },
  divider: { flexDirection: 'row', alignItems: 'center', marginHorizontal: -1 },
  holeLeft: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bg, marginLeft: -12 },
  dashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  holeRight: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bg, marginRight: -12 },
  ticketBottom: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: Spacing.xl },
  qrMini: { width: 80, height: 80, borderRadius: Radius.md, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  codeLabel: { fontSize: 9, color: Colors.textMuted, letterSpacing: 2, marginBottom: 4 },
  code: { fontSize: 20, color: Colors.gold, fontWeight: '700', letterSpacing: 3, marginBottom: 4 },
  codeHint: { fontSize: 11, color: Colors.textMuted },
});
