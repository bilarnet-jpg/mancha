import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_ADMIN_ORDERS, MOCK_ADMIN_STATS } from '../../types/admin';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const { width: W } = Dimensions.get('window');
const FILTERS = ['todos', 'loja', 'ingresso', 'socio'] as const;
const STATUS_FILTERS = ['todos', 'paid', 'pending', 'cancelled'] as const;

export default function AdminFinanceiro({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [typeFilter, setTypeFilter] = useState<typeof FILTERS[number]>('todos');
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_FILTERS[number]>('todos');

  const filtered = MOCK_ADMIN_ORDERS.filter(o => {
    const typeOk = typeFilter === 'todos' || o.type === typeFilter;
    const statusOk = statusFilter === 'todos' || o.status === statusFilter;
    return typeOk && statusOk;
  });

  const totalPago = MOCK_ADMIN_ORDERS.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0);
  const totalPendente = MOCK_ADMIN_ORDERS.filter(o => o.status === 'pending').reduce((sum, o) => sum + o.amount, 0);
  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  const STATUS_CONFIG: any = {
    paid: { label: 'Pago', color: Colors.primaryBright },
    pending: { label: 'Pendente', color: Colors.gold },
    cancelled: { label: 'Cancelado', color: '#FF5A5A' },
    refunded: { label: 'Reembolsado', color: '#818CF8' },
  };
  const TYPE_CONFIG: any = {
    loja: { emoji: '🛍️', label: 'Loja' },
    ingresso: { emoji: '🎟️', label: 'Ingresso' },
    socio: { emoji: '👑', label: 'Sócio' },
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💰 Financeiro</Text>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 20 }}>
          <View style={styles.resumoGrid}>
            <View style={[styles.resumoCard, { borderColor: 'rgba(0,255,133,0.3)' }]}>
              <LinearGradient colors={['rgba(0,255,133,0.12)', 'transparent']} style={StyleSheet.absoluteFillObject} />
              <Text style={styles.resumoEmoji}>💰</Text>
              <Text style={[styles.resumoVal, { color: Colors.primaryBright }]}>{formatCurrency(totalPago)}</Text>
              <Text style={styles.resumoLabel}>Total Recebido</Text>
            </View>
            <View style={[styles.resumoCard, { borderColor: 'rgba(255,216,116,0.3)' }]}>
              <LinearGradient colors={['rgba(255,216,116,0.12)', 'transparent']} style={StyleSheet.absoluteFillObject} />
              <Text style={styles.resumoEmoji}>⏳</Text>
              <Text style={[styles.resumoVal, { color: Colors.gold }]}>{formatCurrency(totalPendente)}</Text>
              <Text style={styles.resumoLabel}>Pendente</Text>
            </View>
          </View>
          <View style={styles.resumoGrid}>
            {[
              { val: MOCK_ADMIN_STATS.socioAtivos, label: 'Sócios Ativos', emoji: '👑', color: Colors.gold },
              { val: MOCK_ADMIN_ORDERS.filter(o => o.type === 'loja').length, label: 'Pedidos Loja', emoji: '🛍️', color: '#4FC3F7' },
              { val: MOCK_ADMIN_ORDERS.filter(o => o.type === 'ingresso').length, label: 'Ingressos', emoji: '🎟️', color: '#FF4081' },
              { val: MOCK_ADMIN_ORDERS.filter(o => o.status === 'pending').length, label: 'Pendentes', emoji: '⚠️', color: '#FF9800' },
            ].map((s, i) => (
              <GlassCard key={i} intensity={20} style={styles.miniStatCard} noPadding>
                <View style={{ padding: 12, alignItems: 'center', gap: 3 }}>
                  <Text style={{ fontSize: 20 }}>{s.emoji}</Text>
                  <Text style={[styles.miniStatVal, { color: s.color }]}>{s.val}</Text>
                  <Text style={styles.miniStatLabel}>{s.label}</Text>
                </View>
              </GlassCard>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 10 }}>
          <Text style={styles.filterLabel}>Tipo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {FILTERS.map(f => (
              <TouchableOpacity key={f} onPress={() => setTypeFilter(f)} style={[styles.filterChip, typeFilter === f && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, typeFilter === f && styles.filterChipTextActive]}>
                  {f === 'todos' ? 'Todos' : TYPE_CONFIG[f].emoji + ' ' + TYPE_CONFIG[f].label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 18 }}>
          <Text style={styles.filterLabel}>Status</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {STATUS_FILTERS.map(f => (
              <TouchableOpacity key={f} onPress={() => setStatusFilter(f)} style={[styles.filterChip, statusFilter === f && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, statusFilter === f && styles.filterChipTextActive]}>
                  {f === 'todos' ? 'Todos' : STATUS_CONFIG[f]?.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl }}>
          <Text style={styles.sectionTitle}>{filtered.length} pedido{filtered.length !== 1 ? 's' : ''}</Text>
          <View style={{ gap: 10 }}>
            {filtered.map(order => {
              const s = STATUS_CONFIG[order.status];
              const t = TYPE_CONFIG[order.type];
              return (
                <GlassCard key={order.id} intensity={22} noPadding>
                  <View style={styles.orderRow}>
                    <View style={[styles.orderTypeIcon, { backgroundColor: `${s.color}15` }]}>
                      <Text style={{ fontSize: 22 }}>{t.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.orderDesc}>{order.description}</Text>
                      <Text style={styles.orderUser}>👤 {order.userName}</Text>
                      <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 6 }}>
                      <Text style={[styles.orderAmount, { color: order.status === 'cancelled' ? Colors.textMuted : Colors.primaryBright }]}>
                        {formatCurrency(order.amount)}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: `${s.color}22`, borderColor: `${s.color}44` }]}>
                        <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
                      </View>
                    </View>
                  </View>
                </GlassCard>
              );
            })}
            {filtered.length === 0 && (
              <View style={styles.empty}>
                <Text style={{ fontSize: 40 }}>📭</Text>
                <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800' },
  resumoGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  resumoCard: { flex: 1, borderWidth: 1, borderRadius: Radius.xl, padding: 16, alignItems: 'center', gap: 4, overflow: 'hidden', backgroundColor: Colors.glassLight },
  resumoEmoji: { fontSize: 24 },
  resumoVal: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  resumoLabel: { fontSize: 11, color: Colors.textMuted },
  miniStatCard: { flex: 1 },
  miniStatVal: { fontSize: 18, fontWeight: '700' },
  miniStatLabel: { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },
  filterLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 8, fontWeight: '500' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.glassLight },
  filterChipActive: { borderColor: 'rgba(0,255,133,0.5)', backgroundColor: Colors.primaryMuted },
  filterChipText: { fontSize: 12, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.primaryBright, fontWeight: '600' },
  sectionTitle: { fontSize: 14, color: Colors.textMuted, marginBottom: 10 },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  orderTypeIcon: { width: 48, height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  orderDesc: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginBottom: 2 },
  orderUser: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  orderDate: { fontSize: 10, color: Colors.textMuted },
  orderAmount: { fontSize: 15, fontWeight: '700' },
  statusBadge: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
});
