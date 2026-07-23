import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import {
  MOCK_ADMIN_STATS, MOCK_ADMIN_ORDERS, MOCK_ADMIN_POSTS,
  MOCK_ALA_SHOW_REQUESTS, AdminRole,
} from '../../types/admin';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const { width: W } = Dimensions.get('window');

const ROLE_CONFIG: Record<AdminRole, { label: string; color: string; emoji: string }> = {
  super_admin: { label: 'Super Admin', color: Colors.gold, emoji: '👑' },
  financeiro: { label: 'Financeiro', color: '#4FC3F7', emoji: '💰' },
  conteudo: { label: 'Conteúdo', color: Colors.primaryBright, emoji: '📸' },
  moderacao: { label: 'Moderação', color: '#FF9800', emoji: '🛡️' },
  comercial: { label: 'Comercial', color: '#FF4081', emoji: '💼' },
};

const MODULES = [
  { key: 'homenagens_presidente', emoji: '👑', title: 'Homenagens ao Presidente', sub: 'Moderar mensagens do mural', screen: 'AdminHomenagensPresidente', roles: ['super_admin', 'moderacao', 'conteudo'] },
  { key: 'memberships', emoji: '💚', title: 'Assinaturas', sub: 'Ativar planos e gerenciar pagamentos', screen: 'AdminMemberships', roles: ['super_admin', 'financeiro'] },
  { key: 'scanner', emoji: '📷', title: 'Scanner QR Code', sub: 'Escanear carteirinha de sócios', screen: 'AdminScanner', roles: ['super_admin', 'moderacao', 'comercial', 'conteudo', 'financeiro'] },
  { key: 'financeiro', emoji: '💰', title: 'Financeiro', sub: 'Vendas, pedidos, receita', screen: 'AdminFinanceiro', roles: ['super_admin', 'financeiro'] },
  { key: 'usuarios', emoji: '👥', title: 'Usuários', sub: 'Membros, bloqueios, roles', screen: 'AdminUsuarios', roles: ['super_admin'] },
  { key: 'moderacao', emoji: '🛡️', title: 'Moderação', sub: 'Posts e reels pendentes', screen: 'AdminModeracao', roles: ['super_admin', 'moderacao', 'conteudo'] },
  { key: 'alashow', emoji: '💃', title: 'Ala Show', sub: 'Solicitações de orçamento', screen: 'AdminAlaShow', roles: ['super_admin', 'comercial'] },
  { key: 'comunicados', emoji: '📣', title: 'Comunicados', sub: 'Splash e notificações', screen: 'AdminComunicados', roles: ['super_admin', 'conteudo'] },
];

export default function AdminDashboard({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const stats = MOCK_ADMIN_STATS;
  const userRole: AdminRole = (user as any)?.role ?? 'super_admin';
  const roleCfg = ROLE_CONFIG[userRole];

  const pendingOrders = MOCK_ADMIN_ORDERS.filter(o => o.status === 'pending').length;
  const pendingPosts = MOCK_ADMIN_POSTS.filter(p => p.status === 'pending').length;
  const newAlaShow = MOCK_ALA_SHOW_REQUESTS.filter(r => r.status === 'novo').length;
  const visibleModules = MODULES.filter(m => m.roles.includes(userRole));

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Painel Admin</Text>
            <Text style={styles.headerSub}>Mancha Verde Carnaval</Text>
          </View>
          <View style={[styles.roleBadge, { borderColor: `${roleCfg.color}44`, backgroundColor: `${roleCfg.color}15` }]}>
            <Text style={[styles.roleBadgeText, { color: roleCfg.color }]}>{roleCfg.emoji} {roleCfg.label}</Text>
          </View>
        </View>

        {(pendingPosts > 0 || pendingOrders > 0 || newAlaShow > 0) && (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 18 }}>
            <GlassCard intensity={20} style={{ borderColor: 'rgba(255,152,0,0.3)', borderWidth: 1 }}>
              <Text style={styles.alertTitle}>⚠️ Requer atenção</Text>
              <View style={{ gap: 6, marginTop: 8 }}>
                {pendingPosts > 0 && (
                  <TouchableOpacity onPress={() => navigation.navigate('AdminModeracao')} style={styles.alertRow}>
                    <Text style={styles.alertText}>🛡️ {pendingPosts} posts aguardando moderação</Text>
                    <Text style={styles.alertArrow}>→</Text>
                  </TouchableOpacity>
                )}
                {pendingOrders > 0 && (
                  <TouchableOpacity onPress={() => navigation.navigate('AdminFinanceiro')} style={styles.alertRow}>
                    <Text style={styles.alertText}>💰 {pendingOrders} pedidos pendentes</Text>
                    <Text style={styles.alertArrow}>→</Text>
                  </TouchableOpacity>
                )}
                {newAlaShow > 0 && (
                  <TouchableOpacity onPress={() => navigation.navigate('AdminAlaShow')} style={styles.alertRow}>
                    <Text style={styles.alertText}>💃 {newAlaShow} novas solicitações de Ala Show</Text>
                    <Text style={styles.alertArrow}>→</Text>
                  </TouchableOpacity>
                )}
              </View>
            </GlassCard>
          </View>
        )}

        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 18 }}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          <View style={styles.statsGrid}>
            {[
              { val: stats.totalUsers.toLocaleString('pt-BR'), label: 'Membros', sub: `+${stats.newUsersToday} hoje`, color: Colors.primaryBright, emoji: '👥' },
              { val: stats.socioAtivos.toLocaleString('pt-BR'), label: 'Sócios Ativos', sub: 'Planos pagos', color: Colors.gold, emoji: '👑' },
              { val: formatCurrency(stats.totalRevenue), label: 'Receita Total', sub: `${formatCurrency(stats.revenueToday)} hoje`, color: '#4FC3F7', emoji: '💰' },
              { val: stats.activeUsers.toLocaleString('pt-BR'), label: 'Usuários Ativos', sub: 'Últimas 24h', color: '#818CF8', emoji: '📱' },
            ].map((s, i) => (
              <GlassCard key={i} intensity={25} style={styles.statCard} noPadding>
                <View style={styles.statCardInner}>
                  <Text style={styles.statEmoji}>{s.emoji}</Text>
                  <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                  <Text style={styles.statSub}>{s.sub}</Text>
                </View>
              </GlassCard>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 18 }}>
          <Text style={styles.sectionTitle}>Módulos</Text>
          <View style={{ gap: 10 }}>
            {visibleModules.map(mod => (
              <TouchableOpacity key={mod.key} onPress={() => navigation.navigate(mod.screen)} activeOpacity={0.85}>
                <GlassCard intensity={25} noPadding>
                  <View style={styles.moduleRow}>
                    <View style={styles.moduleIconWrap}>
                      <Text style={{ fontSize: 24 }}>{mod.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.moduleTitle}>{mod.title}</Text>
                      <Text style={styles.moduleSub}>{mod.sub}</Text>
                    </View>
                    {mod.key === 'moderacao' && pendingPosts > 0 && (
                      <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>{pendingPosts}</Text></View>
                    )}
                    {mod.key === 'financeiro' && pendingOrders > 0 && (
                      <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>{pendingOrders}</Text></View>
                    )}
                    {mod.key === 'alashow' && newAlaShow > 0 && (
                      <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>{newAlaShow}</Text></View>
                    )}
                    <Text style={styles.moduleArrow}>→</Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl }}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          <View style={{ gap: 8 }}>
            {MOCK_ADMIN_ORDERS.slice(0, 4).map(order => {
              const STATUS: any = {
                paid: { label: 'Pago', color: Colors.primaryBright },
                pending: { label: 'Pendente', color: Colors.gold },
                cancelled: { label: 'Cancelado', color: '#FF5A5A' },
                refunded: { label: 'Reembolsado', color: '#818CF8' },
              };
              const TYPE: any = { loja: '🛍️', ingresso: '🎟️', socio: '👑' };
              const s = STATUS[order.status];
              return (
                <GlassCard key={order.id} intensity={20} noPadding>
                  <View style={styles.activityRow}>
                    <Text style={{ fontSize: 22 }}>{TYPE[order.type]}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activityDesc}>{order.description}</Text>
                      <Text style={styles.activityUser}>{order.userName}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Text style={styles.activityAmount}>R$ {order.amount.toFixed(2)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: `${s.color}22` }]}>
                        <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
                      </View>
                    </View>
                  </View>
                </GlassCard>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 18 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800' },
  headerSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  roleBadge: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5 },
  roleBadgeText: { fontSize: 11, fontWeight: '700' },
  alertTitle: { fontSize: 13, color: '#FF9800', fontWeight: '700' },
  alertRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  alertText: { fontSize: 13, color: Colors.textSecondary },
  alertArrow: { fontSize: 14, color: Colors.primaryBright },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: (W - Spacing.xl * 2 - 10) / 2 },
  statCardInner: { padding: 16, alignItems: 'center', gap: 4 },
  statEmoji: { fontSize: 24, marginBottom: 4 },
  statVal: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: Colors.textPrimary, fontWeight: '600' },
  statSub: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  moduleRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  moduleIconWrap: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.glassLight, alignItems: 'center', justifyContent: 'center' },
  moduleTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600' },
  moduleSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  moduleArrow: { fontSize: 18, color: Colors.textMuted },
  notifBadge: { backgroundColor: '#FF5A5A', borderRadius: Radius.full, minWidth: 22, height: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  notifBadgeText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  activityDesc: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500', marginBottom: 2 },
  activityUser: { fontSize: 11, color: Colors.textMuted },
  activityAmount: { fontSize: 14, color: Colors.primaryBright, fontWeight: '700' },
  statusBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: '600' },
});
