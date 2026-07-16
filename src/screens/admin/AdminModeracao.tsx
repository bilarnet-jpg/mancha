import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AdminPost } from '../../types/admin';
import { supabase } from '../../services/supabase';
import React, { useState, useEffect } from 'react';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

export default function AdminModeracao({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
      setPosts(data.map(p => ({
        id: p.id,
        userId: p.user_id,
        userName: p.user_name,
        title: p.title,
        description: p.description ?? '',
        category: p.category,
        mediaType: p.media_type ?? 'photo',
        status: p.is_approved ? 'approved' : 'pending',
        createdAt: p.created_at,
        reportCount: 0,
      })));
    }
    setLoading(false);
  };

  const filtered = posts.filter(p => p.status === activeTab);
  const pendingCount = posts.filter(p => p.status === 'pending').length;

  const handleApprove = async (id: string) => {
    await supabase.from('posts').update({ is_approved: true }).eq('id', id);
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  };
  const handleReject = (id: string) => Alert.alert('Reprovar post', 'Tem certeza?', [
    { text: 'Cancelar' },
    { text: 'Reprovar', style: 'destructive', onPress: async () => {
      await supabase.from('posts').update({ is_approved: false }).eq('id', id);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    }},
  ]);

  const CATEGORY_CONFIG: any = {
    carnaval: { label: 'Carnaval', emoji: '🎭' },
    ensaio: { label: 'Ensaio', emoji: '🥁' },
    show: { label: 'Show', emoji: '🎤' },
    evento: { label: 'Evento', emoji: '🎉' },
    bastidores: { label: 'Bastidores', emoji: '🎬' },
  };

  const formatDate = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🛡️ Moderação</Text>
          {pendingCount > 0 && <View style={styles.pendingBadge}><Text style={styles.pendingBadgeText}>{pendingCount}</Text></View>}
        </View>

        <View style={styles.tabs}>
          {[
            { key: 'pending', label: `Pendentes (${posts.filter(p => p.status === 'pending').length})` },
            { key: 'approved', label: `Aprovados (${posts.filter(p => p.status === 'approved').length})` },
            { key: 'rejected', label: `Reprovados (${posts.filter(p => p.status === 'rejected').length})` },
          ].map(tab => (
            <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key as any)} style={[styles.tab, activeTab === tab.key && styles.tabActive]}>
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, gap: 12 }}>
          {loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ color: Colors.textMuted }}>Carregando...</Text>
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>{activeTab === 'pending' ? '✅' : activeTab === 'approved' ? '📸' : '🚫'}</Text>
              <Text style={styles.emptyTitle}>{activeTab === 'pending' ? 'Nenhum post pendente!' : 'Nenhum post aqui'}</Text>
            </View>
          ) : filtered.map(post => {
            const cat = CATEGORY_CONFIG[post.category] ?? { label: post.category, emoji: '📸' };
            return (
              <GlassCard key={post.id} intensity={25} noPadding>
                <View style={styles.postHeader}>
                  <View style={styles.postAvatar}><Text style={styles.postAvatarText}>{post.userName.charAt(0)}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.postAuthor}>{post.userName}</Text>
                    <Text style={styles.postMeta}>{formatDate(post.createdAt)} · {cat.emoji} {cat.label}</Text>
                  </View>
                  <View style={styles.mediaTypeBadge}><Text style={styles.mediaTypeText}>{post.mediaType === 'photo' ? '📸' : '🎥'}</Text></View>
                </View>
                <View style={styles.postBody}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postDesc}>{post.description}</Text>
                  {post.reportCount > 0 && (
                    <View style={styles.reportBadge}><Text style={styles.reportText}>⚠️ {post.reportCount} denúncia{post.reportCount !== 1 ? 's' : ''}</Text></View>
                  )}
                </View>
                {activeTab === 'pending' && (
                  <View style={styles.postActions}>
                    <TouchableOpacity onPress={() => handleReject(post.id)} style={styles.rejectBtn}>
                      <Text style={styles.rejectBtnText}>✕ Reprovar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleApprove(post.id)} style={{ flex: 1, borderRadius: Radius.md, overflow: 'hidden' }}>
                      <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.approveBtn}>
                        <Text style={styles.approveBtnText}>✓ Aprovar</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
                {activeTab !== 'pending' && (
                  <View style={[styles.statusBar, { backgroundColor: activeTab === 'approved' ? 'rgba(0,255,133,0.1)' : 'rgba(255,90,90,0.1)' }]}>
                    <Text style={{ fontSize: 12, color: activeTab === 'approved' ? Colors.primaryBright : '#FF5A5A', fontWeight: '600' }}>
                      {activeTab === 'approved' ? '✓ Aprovado' : '✕ Reprovado'}
                    </Text>
                  </View>
                )}
              </GlassCard>
            );
          })}
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
  pendingBadge: { backgroundColor: '#FF5A5A', borderRadius: Radius.full, minWidth: 26, height: 26, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  pendingBadgeText: { fontSize: 13, color: '#fff', fontWeight: '700' },
  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: 8, marginBottom: 18 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', backgroundColor: Colors.glassLight },
  tabActive: { borderColor: 'rgba(0,255,133,0.5)', backgroundColor: Colors.primaryMuted },
  tabText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500', textAlign: 'center' },
  tabTextActive: { color: Colors.primaryBright, fontWeight: '600' },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, paddingBottom: 0 },
  postAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  postAvatarText: { fontSize: 15, color: Colors.primaryBright, fontWeight: '700' },
  postAuthor: { fontSize: 13, color: Colors.textPrimary, fontWeight: '700' },
  postMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  mediaTypeBadge: { backgroundColor: Colors.glassLight, borderRadius: Radius.md, padding: 6 },
  mediaTypeText: { fontSize: 16 },
  postBody: { padding: 14 },
  postTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
  postDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  reportBadge: { marginTop: 8, backgroundColor: 'rgba(255,90,90,0.12)', borderWidth: 1, borderColor: 'rgba(255,90,90,0.3)', borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  reportText: { fontSize: 12, color: '#FF5A5A', fontWeight: '600' },
  postActions: { flexDirection: 'row', gap: 10, padding: 14, paddingTop: 0 },
  rejectBtn: { flex: 1, height: 42, borderRadius: Radius.md, borderWidth: 1.5, borderColor: '#FF5A5A', alignItems: 'center', justifyContent: 'center' },
  rejectBtnText: { fontSize: 13, color: '#FF5A5A', fontWeight: '600' },
  approveBtn: { height: 42, alignItems: 'center', justifyContent: 'center' },
  approveBtnText: { fontSize: 13, color: Colors.textInverse, fontWeight: '700' },
  statusBar: { padding: 10, alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 15, color: Colors.textMuted },
});
