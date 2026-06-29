import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../services/supabase';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

interface MembershipRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan: string;
  billing_cycle: string;
  amount: number;
  status: string;
  created_at: string;
  activated_at?: string;
  expires_at?: string;
}

export default function AdminMemberships({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('membership_requests')
      .select('*')
      .order('created_at', { ascending: false });
    console.log('Requests:', JSON.stringify(data));
    console.log('Error:', JSON.stringify(error));
    if (data) setRequests(data);
    setLoading(false);
  };

  const handleActivate = (req: MembershipRequest) => {
    Alert.alert(
      'Ativar Plano',
      `Ativar plano ${req.billing_cycle === 'monthly' ? 'Mensal' : 'Anual'} para ${req.user_name}?\n\nVálido por ${req.billing_cycle === 'monthly' ? '30 dias' : '365 dias'} a partir de agora.`,
      [
        { text: 'Cancelar' },
        {
          text: 'Ativar',
          onPress: async () => {
            const expiresAt = new Date();
            if (req.billing_cycle === 'monthly') {
              expiresAt.setDate(expiresAt.getDate() + 30);
            } else {
              expiresAt.setDate(expiresAt.getDate() + 365);
            }

            // Atualizar solicitação
            await supabase.from('membership_requests').update({
              status: 'approved',
              activated_at: new Date().toISOString(),
              expires_at: expiresAt.toISOString(),
            }).eq('id', req.id);

            // Criar assinatura ativa
            await supabase.from('memberships').insert({
              user_id: req.user_id,
              plan: req.plan,
              billing_cycle: req.billing_cycle,
              amount: req.amount,
              started_at: new Date().toISOString(),
              expires_at: expiresAt.toISOString(),
              is_active: true,
            });

            Alert.alert('✅ Plano ativado!', `Acesso liberado até ${expiresAt.toLocaleDateString('pt-BR')}`);
            loadRequests();
          },
        },
      ]
    );
  };

  const handleReject = (req: MembershipRequest) => {
    Alert.alert('Rejeitar solicitação', `Rejeitar solicitação de ${req.user_name}?`, [
      { text: 'Cancelar' },
      {
        text: 'Rejeitar',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('membership_requests').update({ status: 'rejected' }).eq('id', req.id);
          loadRequests();
        },
      },
    ]);
  };

  const filtered = requests.filter(r => r.status === activeFilter);
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💚 Assinaturas</Text>
          {pendingCount > 0 && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{pendingCount}</Text>
            </View>
          )}
        </View>

        {/* STATS */}
        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 18 }}>
          <View style={styles.statsRow}>
            {[
              { val: requests.filter(r => r.status === 'pending').length, label: 'Pendentes', color: Colors.gold },
              { val: requests.filter(r => r.status === 'approved').length, label: 'Ativos', color: Colors.primaryBright },
              { val: requests.filter(r => r.status === 'rejected').length, label: 'Rejeitados', color: '#FF5A5A' },
            ].map((s, i) => (
              <GlassCard key={i} intensity={20} noPadding style={{ flex: 1 }}>
                <View style={{ padding: 12, alignItems: 'center' }}>
                  <Text style={[{ fontSize: 22, fontWeight: '800' }, { color: s.color }]}>{s.val}</Text>
                  <Text style={{ fontSize: 10, color: Colors.textMuted, marginTop: 2 }}>{s.label}</Text>
                </View>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          {[
            { key: 'pending', label: 'Pendentes' },
            { key: 'approved', label: 'Aprovados' },
            { key: 'rejected', label: 'Rejeitados' },
          ].map(tab => (
            <TouchableOpacity key={tab.key} onPress={() => setActiveFilter(tab.key as any)} style={[styles.tab, activeFilter === tab.key && styles.tabActive]}>
              <Text style={[styles.tabText, activeFilter === tab.key && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, gap: 12 }}>
          {loading ? (
            <Text style={{ color: Colors.textMuted, textAlign: 'center', paddingTop: 40 }}>Carregando...</Text>
          ) : filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 40 }}>📭</Text>
              <Text style={styles.emptyText}>Nenhuma solicitação {activeFilter === 'pending' ? 'pendente' : activeFilter === 'approved' ? 'aprovada' : 'rejeitada'}</Text>
            </View>
          ) : filtered.map(req => (
            <GlassCard key={req.id} intensity={22} noPadding>
              <View style={styles.reqContent}>
                <View style={styles.reqHeader}>
                  <View style={styles.reqAvatar}>
                    <Text style={styles.reqAvatarText}>{req.user_name?.charAt(0) ?? 'M'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reqName}>{req.user_name}</Text>
                    <Text style={styles.reqEmail}>{req.user_email}</Text>
                  </View>
                  <View style={[styles.cycleBadge, { backgroundColor: req.billing_cycle === 'monthly' ? Colors.primaryMuted : Colors.goldMuted, borderColor: req.billing_cycle === 'monthly' ? 'rgba(0,255,133,0.3)' : Colors.goldBorder }]}>
                    <Text style={[styles.cycleBadgeText, { color: req.billing_cycle === 'monthly' ? Colors.primaryBright : Colors.gold }]}>
                      {req.billing_cycle === 'monthly' ? 'Mensal' : 'Anual'}
                    </Text>
                  </View>
                </View>

                <View style={styles.reqDetails}>
                  <View style={styles.reqDetailItem}>
                    <Text style={styles.reqDetailLabel}>Valor</Text>
                    <Text style={styles.reqDetailVal}>R$ {req.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.reqDetailItem}>
                    <Text style={styles.reqDetailLabel}>Solicitado em</Text>
                    <Text style={styles.reqDetailVal}>{formatDate(req.created_at)}</Text>
                  </View>
                  {req.expires_at && (
                    <View style={styles.reqDetailItem}>
                      <Text style={styles.reqDetailLabel}>Válido até</Text>
                      <Text style={[styles.reqDetailVal, { color: Colors.primaryBright }]}>{formatDate(req.expires_at)}</Text>
                    </View>
                  )}
                </View>

                {req.status === 'pending' && (
                  <View style={styles.reqActions}>
                    <TouchableOpacity onPress={() => handleReject(req)} style={styles.rejectBtn}>
                      <Text style={styles.rejectBtnText}>✕ Rejeitar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleActivate(req)} style={{ flex: 1, borderRadius: Radius.md, overflow: 'hidden' }}>
                      <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.activateBtn}>
                        <Text style={styles.activateBtnText}>✓ Ativar Plano</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}

                {req.status === 'approved' && (
                  <View style={[styles.statusBar, { backgroundColor: 'rgba(0,255,133,0.1)' }]}>
                    <Text style={{ fontSize: 12, color: Colors.primaryBright, fontWeight: '600' }}>✓ Plano ativo até {req.expires_at ? formatDate(req.expires_at) : '—'}</Text>
                  </View>
                )}

                {req.status === 'rejected' && (
                  <View style={[styles.statusBar, { backgroundColor: 'rgba(255,90,90,0.1)' }]}>
                    <Text style={{ fontSize: 12, color: '#FF5A5A', fontWeight: '600' }}>✕ Solicitação rejeitada</Text>
                  </View>
                )}
              </View>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 18 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800', flex: 1 },
  pendingBadge: { backgroundColor: Colors.gold, borderRadius: Radius.full, minWidth: 26, height: 26, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  pendingBadgeText: { fontSize: 13, color: Colors.textInverse, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10 },
  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: 8, marginBottom: 18 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', backgroundColor: Colors.glassLight },
  tabActive: { borderColor: 'rgba(0,255,133,0.5)', backgroundColor: Colors.primaryMuted },
  tabText: { fontSize: 12, color: Colors.textSecondary },
  tabTextActive: { color: Colors.primaryBright, fontWeight: '600' },
  reqContent: { padding: 14 },
  reqHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  reqAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  reqAvatarText: { fontSize: 18, color: Colors.primaryBright, fontWeight: '700' },
  reqName: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700' },
  reqEmail: { fontSize: 11, color: Colors.textMuted },
  cycleBadge: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 8, paddingVertical: 4 },
  cycleBadgeText: { fontSize: 11, fontWeight: '700' },
  reqDetails: { gap: 8, marginBottom: 14 },
  reqDetailItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.glassBorder },
  reqDetailLabel: { fontSize: 12, color: Colors.textMuted },
  reqDetailVal: { fontSize: 12, color: Colors.textPrimary, fontWeight: '600' },
  reqActions: { flexDirection: 'row', gap: 10 },
  rejectBtn: { flex: 1, height: 42, borderRadius: Radius.md, borderWidth: 1.5, borderColor: '#FF5A5A', alignItems: 'center', justifyContent: 'center' },
  rejectBtnText: { fontSize: 13, color: '#FF5A5A', fontWeight: '600' },
  activateBtn: { height: 42, alignItems: 'center', justifyContent: 'center' },
  activateBtnText: { fontSize: 13, color: Colors.textInverse, fontWeight: '700' },
  statusBar: { padding: 10, alignItems: 'center', borderRadius: Radius.md },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
});
