import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../services/supabase';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

interface Homenagem {
  id: string;
  user_name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export default function AdminHomenagensPresidente({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [homenagens, setHomenagens] = useState<Homenagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => { loadHomenagens(); }, []);

  const loadHomenagens = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('presidente_homenagens')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setHomenagens(data);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    await supabase.from('presidente_homenagens').update({ is_approved: true }).eq('id', id);
    setHomenagens(prev => prev.map(h => h.id === id ? { ...h, is_approved: true } : h));
  };

  const handleReject = (id: string) => {
    Alert.alert('Remover homenagem', 'Tem certeza que deseja remover esta mensagem?', [
      { text: 'Cancelar' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
        await supabase.from('presidente_homenagens').delete().eq('id', id);
        setHomenagens(prev => prev.filter(h => h.id !== id));
      }},
    ]);
  };

  const filtered = homenagens.filter(h => activeTab === 'pending' ? !h.is_approved : h.is_approved);
  const pendingCount = homenagens.filter(h => !h.is_approved).length;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>👑 Homenagens ao Presidente</Text>
          {pendingCount > 0 && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{pendingCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setActiveTab('pending')} style={[styles.tab, activeTab === 'pending' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>Pendentes ({homenagens.filter(h => !h.is_approved).length})</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('approved')} style={[styles.tab, activeTab === 'approved' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'approved' && styles.tabTextActive]}>Aprovadas ({homenagens.filter(h => h.is_approved).length})</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, gap: 12 }}>
          {loading ? (
            <Text style={{ color: Colors.textMuted, textAlign: 'center', paddingTop: 40 }}>Carregando...</Text>
          ) : filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 40 }}>💌</Text>
              <Text style={styles.emptyText}>Nenhuma homenagem {activeTab === 'pending' ? 'pendente' : 'aprovada'}</Text>
            </View>
          ) : filtered.map(h => (
            <GlassCard key={h.id} intensity={22} noPadding>
              <View style={{ padding: 14 }}>
                <View style={styles.msgHeader}>
                  <View style={styles.msgAvatar}>
                    <Text style={styles.msgAvatarText}>{h.user_name?.charAt(0)?.toUpperCase() ?? 'M'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.msgNome}>{h.user_name}</Text>
                    <Text style={styles.msgData}>{formatDate(h.created_at)}</Text>
                  </View>
                </View>
                <Text style={styles.msgTexto}>{h.message}</Text>

                {activeTab === 'pending' && (
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleReject(h.id)} style={styles.rejectBtn}>
                      <Text style={styles.rejectBtnText}>✕ Remover</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleApprove(h.id)} style={{ flex: 1, borderRadius: Radius.md, overflow: 'hidden' }}>
                      <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.approveBtn}>
                        <Text style={styles.approveBtnText}>✓ Aprovar</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
                {activeTab === 'approved' && (
                  <TouchableOpacity onPress={() => handleReject(h.id)} style={[styles.rejectBtn, { marginTop: 10 }]}>
                    <Text style={styles.rejectBtnText}>🗑️ Remover do mural</Text>
                  </TouchableOpacity>
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
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '800', flex: 1 },
  pendingBadge: { backgroundColor: Colors.gold, borderRadius: Radius.full, minWidth: 26, height: 26, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  pendingBadgeText: { fontSize: 13, color: Colors.textInverse, fontWeight: '700' },
  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: 8, marginBottom: 18 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', backgroundColor: Colors.glassLight },
  tabActive: { borderColor: 'rgba(0,255,133,0.5)', backgroundColor: Colors.primaryMuted },
  tabText: { fontSize: 12, color: Colors.textSecondary },
  tabTextActive: { color: Colors.primaryBright, fontWeight: '600' },
  msgHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  msgAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  msgAvatarText: { fontSize: 14, color: Colors.primaryBright, fontWeight: '700' },
  msgNome: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700' },
  msgData: { fontSize: 11, color: Colors.textMuted },
  msgTexto: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10 },
  rejectBtn: { flex: 1, height: 40, borderRadius: Radius.md, borderWidth: 1.5, borderColor: '#FF5A5A', alignItems: 'center', justifyContent: 'center' },
  rejectBtnText: { fontSize: 12, color: '#FF5A5A', fontWeight: '600' },
  approveBtn: { height: 40, alignItems: 'center', justifyContent: 'center' },
  approveBtnText: { fontSize: 12, color: Colors.textInverse, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
});
