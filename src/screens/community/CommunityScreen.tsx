import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, TextInput, Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCommunityStore } from '../../store/communityStore';
import { useAuthStore } from '../../store/authStore';
import { CATEGORY_CONFIG, BADGES, CommunityPost } from '../../types/community';
import { Colors, Spacing, Radius } from '../../theme';

const { width: W } = Dimensions.get('window');

const CATEGORIES = [
  { key: 'all', label: 'Tudo', emoji: '📸' },
  { key: 'carnaval', label: 'Carnaval', emoji: '🎭' },
  { key: 'ensaio', label: 'Ensaios', emoji: '🥁' },
  { key: 'show', label: 'Shows', emoji: '🎤' },
  { key: 'bastidores', label: 'Bastidores', emoji: '🎬' },
  { key: 'premiacao', label: 'Premiação', emoji: '🏆' },
];

const FILTERS = [
  { key: 'recent', label: 'Recentes' },
  { key: 'popular', label: 'Populares' },
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

export default function CommunityScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { posts, featuredPosts, ranking, activeCategory, activeFilter, searchQuery, loadPosts, setCategory, setFilter, setSearch, toggleLike, getFiltered } = useCommunityStore();
  const { user } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => { loadPosts(); }, []);

  const filtered = getFiltered();

  const handleShare = async (post: CommunityPost) => {
    await Share.share({
      title: post.title,
      message: `📸 ${post.title}\n${post.description}\n\nVeja no app Mancha Carnaval! 🐍💚`,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Comunidade</Text>
          <Text style={styles.headerSub}>Galeria da Mancha Verde</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={styles.headerBtn}>
            <Text style={{ fontSize: 18 }}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SubmitPost')} style={styles.uploadBtn}>
            <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.uploadBtnGrad}>
              <Text style={styles.uploadBtnText}>+ Enviar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Busca */}
      {showSearch && (
        <View style={styles.searchWrap}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearch}
            placeholder="Buscar fotos, membros..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: Colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Destaques */}
        {!showSearch && featuredPosts.length > 0 && activeCategory === 'all' && (
          <View style={{ marginBottom: Spacing.xl }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Destaques da Semana</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 12 }}>
              {featuredPosts.map(post => (
                <TouchableOpacity
                  key={post.id}
                  onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
                  style={styles.featuredCard}
                  activeOpacity={0.9}
                >
                  <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.featuredImg}>
                    <Text style={{ fontSize: 52, opacity: 0.6 }}>{CATEGORY_CONFIG[post.category].emoji}</Text>
                    {post.isOfficial && (
                      <View style={styles.officialBadge}>
                        <Text style={styles.officialBadgeText}>✓ OFICIAL</Text>
                      </View>
                    )}
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.featuredOverlay} />
                    <View style={styles.featuredContent}>
                      <Text style={styles.featuredTitle} numberOfLines={2}>{post.title}</Text>
                      <View style={styles.featuredMeta}>
                        <Text style={styles.featuredMetaText}>❤️ {post.likes.length}</Text>
                        <Text style={styles.featuredMetaText}>👁️ {post.views}</Text>
                        <Text style={styles.featuredMetaText}>{formatDate(post.createdAt)}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categorias */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 8, marginBottom: Spacing.base }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setCategory(cat.key)}
              style={[styles.catChip, activeCategory === cat.key && styles.catChipActive]}
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={[styles.catLabel, activeCategory === cat.key && styles.catLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filtros */}
        <View style={styles.filtersRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
            >
              <Text style={[styles.filterLabel, activeFilter === f.key && styles.filterLabelActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.countLabel}>{filtered.length} posts</Text>
        </View>

        {/* Grid de posts */}
        <View style={styles.grid}>
          {filtered.map((post, index) => {
            const isLiked = user ? post.likes.includes(user.id) : false;
            const isWide = index % 5 === 0;
            return (
              <TouchableOpacity
                key={post.id}
                onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
                style={[styles.gridItem, isWide && styles.gridItemWide]}
                activeOpacity={0.85}
              >
                <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.gridImg}>
                  <Text style={{ fontSize: isWide ? 52 : 36, opacity: 0.5 }}>{CATEGORY_CONFIG[post.category].emoji}</Text>
                  {post.isOfficial && <View style={styles.gridOfficialDot} />}
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gridOverlay} />
                  <View style={styles.gridBottom}>
                    {isWide && <Text style={styles.gridTitle} numberOfLines={1}>{post.title}</Text>}
                    <View style={styles.gridMeta}>
                      <TouchableOpacity
                        onPress={() => user && toggleLike(post.id, user.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.gridLike}>{isLiked ? '❤️' : '🤍'} {post.likes.length}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleShare(post)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Text style={{ fontSize: 14 }}>📤</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
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

        {/* Ranking */}
        {activeCategory === 'all' && !showSearch && (
          <View style={{ marginTop: Spacing.xxl }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏆 Top Colaboradores</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Ranking')}>
                <Text style={styles.seeAll}>Ver todos →</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: Spacing.xl, gap: 8 }}>
              {ranking.slice(0, 3).map((profile, i) => (
                <View key={profile.userId} style={styles.rankItem}>
                  <View style={[styles.rankNum, { backgroundColor: i === 0 ? Colors.goldMuted : i === 1 ? 'rgba(192,192,192,0.15)' : 'rgba(205,127,50,0.15)' }]}>
                    <Text style={[styles.rankNumText, { color: i === 0 ? Colors.gold : i === 1 ? '#C0C0C0' : '#CD7F32' }]}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rankName}>{profile.displayName}</Text>
                    <Text style={styles.rankCity}>{profile.city}</Text>
                  </View>
                  <View style={styles.rankStats}>
                    <Text style={styles.rankStatText}>📸 {profile.postsCount}</Text>
                    <Text style={styles.rankStatText}>❤️ {profile.likesReceived}</Text>
                  </View>
                  <View style={styles.rankBadges}>
                    {profile.badges.slice(0, 2).map(b => (
                      <Text key={b} style={{ fontSize: 16 }}>{BADGES[b].icon}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* CTA Enviar */}
        {!showSearch && (
          <View style={{ paddingHorizontal: Spacing.xl, marginTop: Spacing.xxl }}>
            <TouchableOpacity onPress={() => navigation.navigate('SubmitPost')} activeOpacity={0.9}>
              <LinearGradient colors={['#0d3d1a', '#1a5c2a']} style={styles.ctaCard}>
                <View style={styles.ctaAccent} />
                <Text style={{ fontSize: 36, marginBottom: 10 }}>📤</Text>
                <Text style={styles.ctaTitle}>Compartilhe seu Momento</Text>
                <Text style={styles.ctaSub}>Envie suas fotos e faça parte da história da Mancha Verde!</Text>
                <View style={styles.ctaBtn}>
                  <Text style={styles.ctaBtnText}>Enviar Foto ou Vídeo →</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontSize: 28, color: Colors.textPrimary, fontWeight: '700' },
  headerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  uploadBtn: { borderRadius: Radius.full, overflow: 'hidden' },
  uploadBtnGrad: { paddingHorizontal: 14, paddingVertical: 9 },
  uploadBtnText: { fontSize: 13, color: Colors.textInverse, fontWeight: '700' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, paddingHorizontal: Spacing.base, height: 46, marginHorizontal: Spacing.xl, marginBottom: Spacing.base },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, marginBottom: Spacing.base },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
  seeAll: { fontSize: 13, color: Colors.primary },
  featuredCard: { width: W * 0.72, height: 200, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  featuredImg: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  featuredOverlay: { ...StyleSheet.absoluteFillObject },
  featuredContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.base },
  featuredTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 6 },
  featuredMeta: { flexDirection: 'row', gap: 12 },
  featuredMetaText: { fontSize: 12, color: Colors.textSecondary },
  officialBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}44`, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3 },
  officialBadgeText: { fontSize: 9, color: Colors.primary, fontWeight: '700', letterSpacing: 1 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgCard },
  catChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  catEmoji: { fontSize: 13 },
  catLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  catLabelActive: { color: Colors.primary, fontWeight: '600' },
  filtersRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: Spacing.xl, marginBottom: Spacing.base },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgCard },
  filterChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  filterLabel: { fontSize: 12, color: Colors.textSecondary },
  filterLabelActive: { color: Colors.primary, fontWeight: '600' },
  countLabel: { fontSize: 12, color: Colors.textMuted, marginLeft: 'auto' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.xl, gap: 3 },
  gridItem: { width: (W - Spacing.xl * 2 - 6) / 3, height: (W - Spacing.xl * 2 - 6) / 3, borderRadius: Radius.sm, overflow: 'hidden' },
  gridItemWide: { width: (W - Spacing.xl * 2 - 3) / 1.5, height: (W - Spacing.xl * 2 - 3) / 2 },
  gridImg: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  gridOverlay: { ...StyleSheet.absoluteFillObject },
  gridOfficialDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  gridBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 6 },
  gridTitle: { fontSize: 11, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
  gridMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gridLike: { fontSize: 12, color: Colors.textPrimary },
  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
  emptySub: { fontSize: 13, color: Colors.textMuted },
  rankItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base },
  rankNum: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rankNumText: { fontSize: 20 },
  rankName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  rankCity: { fontSize: 11, color: Colors.textMuted },
  rankStats: { flexDirection: 'row', gap: 8 },
  rankStatText: { fontSize: 12, color: Colors.textSecondary },
  rankBadges: { flexDirection: 'row', gap: 4 },
  ctaCard: { borderRadius: Radius.xl, padding: Spacing.xl, borderWidth: 1, borderColor: `${Colors.primary}33`, position: 'relative', overflow: 'hidden', alignItems: 'center' },
  ctaAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primary },
  ctaTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  ctaSub: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  ctaBtn: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}44`, borderRadius: Radius.md, paddingHorizontal: 20, paddingVertical: 10 },
  ctaBtnText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
});
