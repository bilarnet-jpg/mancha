import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, TextInput, Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCommunityStore } from '../../store/communityStore';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';
import { CATEGORY_CONFIG, CommunityPost } from '../../types/community';
import { Colors, Spacing, Radius } from '../../theme';
import PremiumGate from '../../components/PremiumGate';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const { width: W } = Dimensions.get('window');

const FILTERS = [
  { key: 'recent', label: 'Recentes' },
  { key: 'popular', label: 'Em alta' },
  { key: 'friends', label: '👥 Amigos' },
  { key: 'most_viewed', label: 'Mais vistos' },
];

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'Agora';
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d`;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

const formatCount = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}mil`;
  return `${n}`;
};

export default function CommunityScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { posts, reels, searchQuery, activeCategory, loadPosts, setCategory, setSearch, toggleLike, getFiltered } = useCommunityStore();
  const { user } = useAuthStore();
  const { friends, loadFriendships } = useSocialStore();
  const [activeTab, setActiveTab] = useState<'recent' | 'popular' | 'friends'>('recent');
  const [showSearch, setShowSearch] = useState(false);
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  useEffect(() => {
    if (user?.id) loadFriendships(user.id);
  }, [user?.id]);

  useEffect(() => { loadPosts(); }, []);

  const allPosts = getFiltered();
  const friendIds = friends.map(f => f.user_id === user?.id ? f.friend_id : f.user_id);
  const filtered = activeTab === 'friends'
    ? allPosts.filter(p => friendIds.includes(p.userId) || p.userId === user?.id)
    : allPosts;

  const handleShare = async (post: CommunityPost) => {
    await Share.share({
      title: post.title,
      message: `📸 ${post.title}\n${post.description}\n\nVeja no app Mancha Carnaval!`,
    });
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Comunidade</Text>
            <Text style={styles.headerSub}>Mancha Verde Paulistana</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={styles.iconBtn}>
              <Text style={{ fontSize: 17 }}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SubmitPost')} style={styles.iconBtn}>
              <Text style={{ fontSize: 17 }}>➕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showSearch && (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.base }}>
            <GlassCard noPadding intensity={30} borderRadius={Radius.full}>
              <View style={styles.searchInner}>
                <Text style={{ fontSize: 15 }}>🔍</Text>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearch}
                  placeholder="Buscar fotos, membros..."
                  placeholderTextColor={Colors.textTertiary}
                  style={styles.searchInput}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Text style={{ color: Colors.textTertiary }}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            </GlassCard>
          </View>
        )}

        {/* REELS — carrossel tela cheia ao tocar */}
        {!showSearch && reels.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>🎬 Reels</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ReelsViewer', { startIndex: 0 })}>
                <Text style={styles.seeAll}>Ver tudo →</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 10 }}>
              {reels.map((reel, index) => (
                <TouchableOpacity
                  key={reel.id}
                  onPress={() => navigation.navigate('ReelsViewer', { startIndex: index })}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={reel.gradientColors as any} style={styles.reelThumb}>
                    <View style={styles.reelPlayBadge}>
                      <Text style={{ fontSize: 11 }}>▶</Text>
                    </View>
                    <Text style={{ fontSize: 36 }}>{reel.videoEmoji}</Text>
                    <View style={styles.reelThumbBottom}>
                      <Text style={styles.reelThumbViews}>👁️ {formatCount(reel.views)}</Text>
                    </View>
                  </LinearGradient>
                  <Text style={styles.reelThumbName} numberOfLines={1}>{reel.userName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* FILTROS */}
        {!showSearch && (
          <View style={styles.filtersRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setCategory(f.key)}
                style={[styles.filterChip, activeCategory === f.key && styles.filterChipActive]}
              >
                <Text style={[styles.filterLabel, activeCategory === f.key && styles.filterLabelActive]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* FEED — estilo Instagram, um post por vez, vertical */}
        <View style={{ paddingHorizontal: Spacing.xl, gap: 16 }}>
          {filtered.map(post => {
            const isLiked = user ? post.likes.includes(user.id) : false;
            const cat = CATEGORY_CONFIG[post.category];
            return (
              <GlassCard key={post.id} noPadding intensity={25} style={{ overflow: 'hidden' }}>
                {/* Header do post */}
                <View style={styles.postHeader}>
                  <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: post.userId, displayName: post.userName })}>
                  <View style={styles.postAvatar}>
                    <Text style={styles.postAvatarText}>{post.userName.charAt(0)}</Text>
                  </View>
                </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Text style={styles.postAuthor}>{post.userName}</Text>
                      {post.isOfficial && <Text style={{ fontSize: 12 }}>✅</Text>}
                    </View>
                    <Text style={styles.postTime}>{formatDate(post.createdAt)} · {cat.emoji} {cat.label}</Text>
                  </View>
                </View>

                {/* Mídia */}
                <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post.id })} activeOpacity={0.95}>
                  <LinearGradient colors={['#134227', '#0A1F14']} style={styles.postMedia}>
                    <Text style={{ fontSize: 64, opacity: 0.5 }}>{cat.emoji}</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Ações */}
                <View style={styles.postActions}>
                  <View style={styles.postActionsLeft}>
                    <TouchableOpacity onPress={() => {
                      if (!user?.isPremium) { setShowPremiumGate(true); return; }
                      user && toggleLike(post.id, user.id);
                    }} style={styles.actionBtn}>
                      <Text style={{ fontSize: 22 }}>{isLiked ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post.id })} style={styles.actionBtn}>
                      <Text style={{ fontSize: 21 }}>💬</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleShare(post)} style={styles.actionBtn}>
                      <Text style={{ fontSize: 20 }}>📤</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Texto */}
                <View style={styles.postBody}>
                  <Text style={styles.postLikes}>{formatCount(post.likes.length)} curtidas</Text>
                  <Text style={styles.postCaption}>
                    <Text style={styles.postCaptionAuthor}>{post.userName} </Text>
                    {post.title}
                  </Text>
                  {post.commentsCount > 0 && (
                    <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post.id })}>
                      <Text style={styles.postViewComments}>Ver {post.commentsCount > 1 ? `os ${post.commentsCount} comentários` : 'o comentário'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </GlassCard>
            );
          })}
        </View>

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📸</Text>
            <Text style={styles.emptyTitle}>Nenhuma foto encontrada</Text>
            <Text style={styles.emptySub}>Seja o primeiro a contribuir!</Text>
          </View>
        )}
      </ScrollView>
      <PremiumGate
        visible={showPremiumGate}
        onClose={() => setShowPremiumGate(false)}
        onSubscribe={() => { setShowPremiumGate(false); navigation.navigate('SocioTab'); }}
        feature="Curtir posts da Comunidade"
        emoji="❤️"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.xl, marginBottom: Spacing.base },
  headerTitle: { fontSize: 26, color: Colors.textPrimary, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  searchInner: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, height: 46 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  seeAll: { fontSize: 12, color: Colors.primaryBright, fontWeight: '600' },
  reelThumb: { width: 108, height: 168, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 1, borderColor: Colors.glassBorder },
  reelPlayBadge: { position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  reelThumbBottom: { position: 'absolute', bottom: 10, left: 10 },
  reelThumbViews: { fontSize: 10, color: Colors.textPrimary, fontWeight: '600' },
  reelThumbName: { fontSize: 11, color: Colors.textSecondary, marginTop: 6, width: 108, textAlign: 'center' },
  filtersRow: { flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.xl, marginBottom: 18 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.glassLight },
  filterChipActive: { borderColor: 'rgba(0,255,133,0.4)', backgroundColor: Colors.primaryMuted },
  filterLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  filterLabelActive: { color: Colors.primaryBright, fontWeight: '700' },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  postAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', alignItems: 'center', justifyContent: 'center' },
  postAvatarText: { fontSize: 15, color: Colors.primaryBright, fontWeight: '700' },
  postAuthor: { fontSize: 13, color: Colors.textPrimary, fontWeight: '700' },
  postTime: { fontSize: 11, color: Colors.textTertiary, marginTop: 1 },
  postMedia: { height: 280, alignItems: 'center', justifyContent: 'center' },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingTop: 12 },
  postActionsLeft: { flexDirection: 'row', gap: 16 },
  actionBtn: { padding: 2 },
  postBody: { paddingHorizontal: 14, paddingBottom: 14, paddingTop: 6 },
  postLikes: { fontSize: 13, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  postCaption: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
  postCaptionAuthor: { fontWeight: '700', color: Colors.textPrimary },
  postViewComments: { fontSize: 12, color: Colors.textTertiary, marginTop: 6 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
  emptySub: { fontSize: 13, color: Colors.textTertiary },
});
