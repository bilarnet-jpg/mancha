import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Share, TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCommunityStore } from '../../store/communityStore';
import { useAuthStore } from '../../store/authStore';
import { CATEGORY_CONFIG, MOCK_POSTS, PostCategory } from '../../types/community';
import { Colors, Spacing, Radius } from '../../theme';

// ── POST DETAIL ───────────────────────────────────────────────
export function PostDetailScreen({ route, navigation }: any) {
  const { postId } = route.params;
  const insets = useSafeAreaInsets();
  const { toggleLike } = useCommunityStore();
  const { user } = useAuthStore();
  const post = MOCK_POSTS.find(p => p.id === postId);

  if (!post) return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: Colors.textMuted }}>Post não encontrado.</Text>
    </View>
  );

  const isLiked = user ? post.likes.includes(user.id) : false;
  const cat = CATEGORY_CONFIG[post.category];

  const handleShare = async () => {
    await Share.share({
      title: post.title,
      message: `📸 ${post.title}\n${post.description}\n\nVeja no app Mancha Carnaval! 🐍💚`,
    });
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Imagem hero */}
        <View style={styles.hero}>
          <LinearGradient colors={['#0d3d1a', '#1a5c2a', '#051a0a']} style={StyleSheet.absoluteFillObject} />
          <Text style={{ fontSize: 120, opacity: 0.4 }}>{cat.emoji}</Text>
          {post.isOfficial && (
            <View style={styles.officialBanner}>
              <Text style={styles.officialBannerText}>✓ CONTEÚDO OFICIAL</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: insets.top + 12 }]}>
            <Text style={{ fontSize: 18, color: Colors.textPrimary }}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={[styles.shareBtn, { top: insets.top + 12 }]}>
            <Text style={{ fontSize: 16 }}>📤</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <View style={styles.content}>
          {/* Autor */}
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorAvatarText}>{post.userName.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.authorName}>{post.userName}</Text>
              <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
            </View>
            <View style={[styles.catBadge, { backgroundColor: `${cat.color}22`, borderColor: `${cat.color}44` }]}>
              <Text style={[styles.catBadgeText, { color: cat.color }]}>{cat.emoji} {cat.label}</Text>
            </View>
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.description}>{post.description}</Text>

          {post.relatedYear && (
            <View style={styles.yearBadge}>
              <Text style={styles.yearBadgeText}>📅 Carnaval {post.relatedYear}</Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              onPress={() => user && toggleLike(post.id, user.id)}
              style={[styles.statBtn, isLiked && styles.statBtnActive]}
            >
              <Text style={styles.statBtnText}>{isLiked ? '❤️' : '🤍'} {post.likes.length} curtidas</Text>
            </TouchableOpacity>
            <View style={styles.statInfo}>
              <Text style={styles.statInfoText}>👁️ {post.views} visualizações</Text>
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statInfoText}>💬 {post.commentsCount} comentários</Text>
            </View>
          </View>

          {/* Comentários — estrutura preparada */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsSectionTitle}>💬 Comentários</Text>
            <View style={styles.commentsPlaceholder}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>💬</Text>
              <Text style={styles.commentsPlaceholderText}>Comentários em breve</Text>
              <Text style={styles.commentsPlaceholderSub}>Esta funcionalidade estará disponível na próxima atualização.</Text>
            </View>
          </View>

          {/* Compartilhar */}
          <TouchableOpacity onPress={handleShare} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing.base }}>
            <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.shareFullBtn}>
              <Text style={styles.shareFullBtnText}>📤 Compartilhar este Momento</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ── SUBMIT POST ───────────────────────────────────────────────
export function SubmitPostScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { submitPost } = useCommunityStore();
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PostCategory>('carnaval');
  const [year, setYear] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [submitted, setSubmitted] = useState(false);

  const CATEGORIES_LIST: PostCategory[] = ['carnaval', 'ensaio', 'show', 'evento', 'bastidores', 'premiacao', 'viagem', 'comemoracao'];

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Atenção', 'Preencha o título e a descrição.');
      return;
    }
    if (!user) { navigation.navigate('Login'); return; }
    submitPost({
      userId: user.id,
      userName: user.displayName,
      title: title.trim(),
      description: description.trim(),
      mediaType,
      mediaURL: '',
      category,
      relatedYear: year ? parseInt(year) : undefined,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl }}>
        <Text style={{ fontSize: 72, marginBottom: Spacing.xl }}>🎉</Text>
        <Text style={styles.successTitle}>Enviado com Sucesso!</Text>
        <Text style={styles.successSub}>Sua contribuição está em análise. Em breve nossa equipe irá revisá-la e publicar na galeria.</Text>
        <View style={styles.pendingInfo}>
          <Text style={styles.pendingIcon}>⏳</Text>
          <View>
            <Text style={styles.pendingTitle}>Em análise</Text>
            <Text style={styles.pendingSub}>Prazo: até 48 horas</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ borderRadius: Radius.lg, overflow: 'hidden', width: '100%', marginTop: Spacing.xl }}>
          <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.shareFullBtn}>
            <Text style={styles.shareFullBtnText}>Voltar à Comunidade</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.submitScroll, { paddingTop: insets.top + 16 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.xl }}>
            <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.submitTitle}>📤 Enviar Conteúdo</Text>
          <Text style={styles.submitSub}>Compartilhe seus momentos com a comunidade da Mancha Verde.</Text>

          {/* Tipo de mídia */}
          <Text style={styles.fieldLabel}>Tipo de conteúdo</Text>
          <View style={styles.mediaTypeRow}>
            {(['photo', 'video'] as const).map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setMediaType(type)}
                style={[styles.mediaTypeBtn, mediaType === type && styles.mediaTypeBtnActive]}
              >
                <Text style={{ fontSize: 24, marginBottom: 4 }}>{type === 'photo' ? '📸' : '🎥'}</Text>
                <Text style={[styles.mediaTypeBtnText, mediaType === type && styles.mediaTypeBtnTextActive]}>
                  {type === 'photo' ? 'Foto' : 'Vídeo'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Upload simulado */}
          <TouchableOpacity style={styles.uploadArea}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>📁</Text>
            <Text style={styles.uploadAreaTitle}>Toque para selecionar</Text>
            <Text style={styles.uploadAreaSub}>{mediaType === 'photo' ? 'JPG, PNG até 10MB' : 'MP4 até 100MB'}</Text>
          </TouchableOpacity>

          {/* Título */}
          <Text style={styles.fieldLabel}>Título *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Meu primeiro desfile pela Mancha!"
            placeholderTextColor={Colors.textMuted}
            style={styles.field}
            maxLength={80}
          />

          {/* Descrição */}
          <Text style={styles.fieldLabel}>Descrição *</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Conte a história por trás desta foto..."
            placeholderTextColor={Colors.textMuted}
            style={[styles.field, styles.fieldMultiline]}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>

          {/* Categoria */}
          <Text style={styles.fieldLabel}>Categoria</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES_LIST.map(cat => {
              const cfg = CATEGORY_CONFIG[cat];
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[styles.categoryOption, category === cat && styles.categoryOptionActive]}
                >
                  <Text style={styles.categoryOptionEmoji}>{cfg.emoji}</Text>
                  <Text style={[styles.categoryOptionLabel, category === cat && styles.categoryOptionLabelActive]}>{cfg.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Ano */}
          <Text style={styles.fieldLabel}>Ano relacionado (opcional)</Text>
          <TextInput
            value={year}
            onChangeText={setYear}
            placeholder="Ex: 2023"
            placeholderTextColor={Colors.textMuted}
            style={styles.field}
            keyboardType="numeric"
            maxLength={4}
          />

          {/* Info moderação */}
          <View style={styles.moderationInfo}>
            <Text style={{ fontSize: 18 }}>ℹ️</Text>
            <Text style={styles.moderationText}>Todo conteúdo passa por revisão antes de ser publicado. Prazo: até 48 horas.</Text>
          </View>

          {/* Botão enviar */}
          <TouchableOpacity onPress={handleSubmit} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing.base }}>
            <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.shareFullBtn}>
              <Text style={styles.shareFullBtnText}>📤 Enviar para Análise</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── RANKING ───────────────────────────────────────────────────
export function RankingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { ranking } = useCommunityStore();
  const { BADGES } = require('../../types/community');

  return (
    <View style={[{ flex: 1, backgroundColor: Colors.bg }, { paddingTop: insets.top }]}>
      <View style={styles.rankHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.rankTitle}>🏆 Hall dos Colaboradores</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 100 }}>
        <Text style={styles.rankSubtitle}>Os membros que mais contribuem com a memória da Mancha Verde</Text>

        {ranking.map((profile, i) => (
          <View key={profile.userId} style={[styles.rankCard, i === 0 && styles.rankCardFirst]}>
            {i === 0 && <View style={styles.rankCardAccent} />}
            <View style={styles.rankCardHeader}>
              <View style={[styles.rankPosition, {
                backgroundColor: i === 0 ? Colors.goldMuted : i === 1 ? 'rgba(192,192,192,0.15)' : i === 2 ? 'rgba(205,127,50,0.15)' : Colors.bgCard,
                borderColor: i === 0 ? Colors.goldBorder : Colors.border,
              }]}>
                <Text style={{ fontSize: i < 3 ? 20 : 14, fontWeight: '700', color: i === 0 ? Colors.gold : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : Colors.textMuted }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </Text>
              </View>
              <View style={styles.rankAvatar}>
                <Text style={styles.rankAvatarText}>{profile.displayName.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rankCardName}>{profile.displayName}</Text>
                <Text style={styles.rankCardCity}>{profile.city}</Text>
              </View>
            </View>
            <View style={styles.rankCardStats}>
              <View style={styles.rankStatBox}>
                <Text style={styles.rankStatNum}>{profile.postsCount}</Text>
                <Text style={styles.rankStatLbl}>Fotos</Text>
              </View>
              <View style={styles.rankStatBox}>
                <Text style={styles.rankStatNum}>{profile.likesReceived}</Text>
                <Text style={styles.rankStatLbl}>Curtidas</Text>
              </View>
              <View style={[styles.rankStatBox, { flex: 2 }]}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {profile.badges.length === 0 ? (
                    <Text style={{ fontSize: 12, color: Colors.textMuted }}>Sem conquistas ainda</Text>
                  ) : (
                    profile.badges.map(b => (
                      <View key={b} style={styles.badgeChip}>
                        <Text style={{ fontSize: 14 }}>{BADGES[b]?.icon}</Text>
                      </View>
                    ))
                  )}
                </View>
                <Text style={styles.rankStatLbl}>Conquistas</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 300, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  backBtn: { position: 'absolute', left: Spacing.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  shareBtn: { position: 'absolute', right: Spacing.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  officialBanner: { position: 'absolute', bottom: 16, left: 0, right: 0, alignItems: 'center' },
  officialBannerText: { fontSize: 10, color: Colors.primary, fontWeight: '700', letterSpacing: 2, backgroundColor: Colors.primaryMuted, paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1, borderColor: `${Colors.primary}44` },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.base },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.base },
  authorAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}33`, alignItems: 'center', justifyContent: 'center' },
  authorAvatarText: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
  authorName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  postDate: { fontSize: 11, color: Colors.textMuted },
  catBadge: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3 },
  catBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  title: { fontSize: 22, color: Colors.textPrimary, fontWeight: '700', lineHeight: 28, marginBottom: 10 },
  description: { fontSize: 15, color: Colors.textSecondary, lineHeight: 24, marginBottom: Spacing.base },
  yearBadge: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}33`, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: Spacing.base },
  yearBadgeText: { fontSize: 13, color: Colors.primary, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.xl, flexWrap: 'wrap' },
  statBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 8 },
  statBtnActive: { backgroundColor: Colors.redMuted, borderColor: `${Colors.red}44` },
  statBtnText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  statInfo: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 8 },
  statInfoText: { fontSize: 12, color: Colors.textSecondary },
  commentsSection: { marginBottom: Spacing.xl },
  commentsSectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  commentsPlaceholder: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center' },
  commentsPlaceholderText: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
  commentsPlaceholderSub: { fontSize: 12, color: Colors.textMuted, textAlign: 'center' },
  shareFullBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  shareFullBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  submitScroll: { paddingHorizontal: Spacing.xl, paddingBottom: 60 },
  submitTitle: { fontSize: 26, color: Colors.textPrimary, fontWeight: '700', marginBottom: 6 },
  submitSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.xl },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  field: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, height: 52, fontSize: 14, color: Colors.textPrimary, marginBottom: Spacing.base },
  fieldMultiline: { height: 110, textAlignVertical: 'top', paddingTop: 12 },
  charCount: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', marginTop: -12, marginBottom: Spacing.base },
  mediaTypeRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.xl },
  mediaTypeBtn: { flex: 1, backgroundColor: Colors.bgCard, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center' },
  mediaTypeBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  mediaTypeBtnText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  mediaTypeBtnTextActive: { color: Colors.primary },
  uploadArea: { backgroundColor: Colors.bgCard, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', borderRadius: Radius.xl, padding: Spacing.xxl, alignItems: 'center', marginBottom: Spacing.xl },
  uploadAreaTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
  uploadAreaSub: { fontSize: 12, color: Colors.textMuted },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.base },
  categoryOption: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgCard },
  categoryOptionActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  categoryOptionEmoji: { fontSize: 14 },
  categoryOptionLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  categoryOptionLabelActive: { color: Colors.primary },
  moderationInfo: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.base, marginBottom: Spacing.base },
  moderationText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  successTitle: { fontSize: 24, color: Colors.textPrimary, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  successSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  pendingInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, width: '100%' },
  pendingIcon: { fontSize: 28 },
  pendingTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  pendingSub: { fontSize: 12, color: Colors.textMuted },
  rankHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  rankTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  rankSubtitle: { fontSize: 13, color: Colors.textMuted, lineHeight: 20, marginBottom: Spacing.xl },
  rankCard: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.base, marginBottom: Spacing.sm, position: 'relative', overflow: 'hidden' },
  rankCardFirst: { borderColor: Colors.goldBorder },
  rankCardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.gold },
  rankCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.sm },
  rankPosition: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  rankAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}33`, alignItems: 'center', justifyContent: 'center' },
  rankAvatarText: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
  rankCardName: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600' },
  rankCardCity: { fontSize: 12, color: Colors.textMuted },
  rankCardStats: { flexDirection: 'row', gap: 8 },
  rankStatBox: { flex: 1, backgroundColor: Colors.bg, borderRadius: Radius.md, padding: 8, alignItems: 'center', gap: 2 },
  rankStatNum: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
  rankStatLbl: { fontSize: 9, color: Colors.textMuted, letterSpacing: 0.5 },
  badgeChip: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
});
