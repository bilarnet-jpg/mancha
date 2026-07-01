import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, ActivityIndicator, Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore, UserProfile } from '../../store/socialStore';
import { useSocioStore } from '../../store/socioStore';
import { supabase } from '../../services/supabase';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const { width: W } = Dimensions.get('window');

export default function ProfileScreen({ route, navigation }: any) {
  const { userId, displayName: routeDisplayName } = route.params ?? {};
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { getProfile, updateProfile, uploadAvatar, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend, getFriendshipStatus, loadFriendships, pendingReceived, friends } = useSocialStore();
  const { membership, getPlanConfig } = useSocioStore();

  const isOwnProfile = !userId || userId === user?.id;
  const targetUserId = userId ?? user?.id ?? '';
  const planConfig = getPlanConfig();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number | null>(null);

  useEffect(() => {
    loadProfile();
    if (user?.id) {
      loadFriendships(user.id);
      // Buscar data de vencimento e membro desde
      if (isOwnProfile) {
        supabase.from('memberships').select('expires_at, started_at').eq('user_id', user.id).eq('is_active', true).maybeSingle()
          .then(({ data }) => {
            if (data?.expires_at) {
              const expiry = new Date(data.expires_at);
              const days = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              setExpiryDate(expiry.toLocaleDateString('pt-BR'));
              setDaysUntilExpiry(days);
            }
            if (data?.started_at) setMemberSince(new Date(data.started_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }));
          });
      }
    }
  }, [targetUserId]);

  const loadProfile = async () => {
    setLoading(true);
    const data = await getProfile(targetUserId);
    setProfile(data ?? {
      id: targetUserId,
      display_name: isOwnProfile ? (user?.displayName ?? 'Torcedor') : (routeDisplayName ?? 'Sócio Mancha Verde'),
      bio: '',
      city: '',
      avatar_url: undefined,
    });
    setLoading(false);
  };

  const friendshipStatus = isOwnProfile ? 'self' : getFriendshipStatus(user?.id ?? '', targetUserId);

  const handlePickAvatar = async () => {
    if (!isOwnProfile) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setUploadingAvatar(true);
      const url = await uploadAvatar(targetUserId, result.assets[0].uri);
      if (url) {
        await updateProfile(targetUserId, { avatar_url: url });
        setProfile(prev => prev ? { ...prev, avatar_url: url } : prev);
      }
      setUploadingAvatar(false);
    }
  };

  const handleFriendAction = async () => {
    if (!user?.id) return;
    if (friendshipStatus === 'none') {
      await sendFriendRequest(user.id, targetUserId);
      Alert.alert('✅ Solicitação enviada!');
      loadFriendships(user.id);
    } else if (friendshipStatus === 'pending_received') {
      const pending = pendingReceived.find(f => f.user_id === targetUserId);
      if (pending) { await acceptFriendRequest(pending.id); loadFriendships(user.id); }
    } else if (friendshipStatus === 'accepted') {
      Alert.alert('Remover amigo', 'Deseja desfazer a amizade?', [
        { text: 'Cancelar' },
        { text: 'Remover', style: 'destructive', onPress: async () => {
          const f = friends.find((f: any) => (f.user_id === user.id && f.friend_id === targetUserId) || (f.user_id === targetUserId && f.friend_id === user.id));
          if (f) { await removeFriend(f.id); loadFriendships(user.id); }
        }},
      ]);
    }
  };

  const FRIEND_BTN: Record<string, { label: string; color: string; bg: string; border: string }> = {
    none: { label: '➕ Adicionar amigo', color: Colors.primaryBright, bg: Colors.primaryMuted, border: 'rgba(0,255,133,0.3)' },
    pending_sent: { label: '⏳ Solicitação enviada', color: Colors.textMuted, bg: Colors.glassLight, border: Colors.glassBorder },
    pending_received: { label: '✓ Aceitar amizade', color: Colors.gold, bg: Colors.goldMuted, border: Colors.goldBorder },
    accepted: { label: '✓ Amigos', color: Colors.primaryBright, bg: Colors.primaryMuted, border: 'rgba(0,255,133,0.3)' },
  };

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <GlowBackground /><ActivityIndicator color={Colors.primaryBright} size="large" />
    </View>
  );

  const btnConfig = FRIEND_BTN[friendshipStatus] ?? FRIEND_BTN.none;
  const isPremium = isOwnProfile ? (user?.isPremium ?? false) : false;

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* HERO */}
        <LinearGradient colors={['#134227', '#0A1F14']} style={[styles.hero, { paddingTop: insets.top + 60 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: insets.top + 12 }]}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>

          {/* AVATAR */}
          <TouchableOpacity onPress={handlePickAvatar} disabled={!isOwnProfile} activeOpacity={0.85}>
            <View style={styles.avatarWrap}>
              {uploadingAvatar ? (
                <View style={styles.avatarPlaceholder}><ActivityIndicator color={Colors.primaryBright} size="large" /></View>
              ) : profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
              ) : (
                <LinearGradient colors={planConfig.gradient as any} style={styles.avatar}>
                  <Text style={styles.avatarInitial}>{profile?.display_name?.charAt(0)?.toUpperCase() ?? 'M'}</Text>
                </LinearGradient>
              )}
              {isOwnProfile && (
                <View style={styles.editAvatarBadge}><Text style={{ fontSize: 12 }}>📷</Text></View>
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.heroName}>{profile?.display_name ?? 'Torcedor'}</Text>
          {profile?.city ? <Text style={styles.heroCity}>📍 {profile.city}</Text> : null}
          {profile?.bio ? <Text style={styles.heroBio}>{profile.bio}</Text> : null}

          {/* PLANO BADGE */}
          {isOwnProfile && (
            <View style={[styles.planBadge, { backgroundColor: isPremium ? Colors.primaryMuted : Colors.glassLight, borderColor: isPremium ? 'rgba(0,255,133,0.4)' : Colors.glassBorder }]}>
              <Text style={[styles.planBadgeText, { color: isPremium ? Colors.primaryBright : Colors.textMuted }]}>
                {isPremium ? '💚 Mancha Verde eu sou' : '🎟️ Plano Free'}
              </Text>
            </View>
          )}

          {/* AÇÕES */}
          {!isOwnProfile && (
            <TouchableOpacity onPress={handleFriendAction} disabled={friendshipStatus === 'pending_sent'} style={[styles.friendBtn, { backgroundColor: btnConfig.bg, borderColor: btnConfig.border }]}>
              <Text style={[styles.friendBtnText, { color: btnConfig.color }]}>{btnConfig.label}</Text>
            </TouchableOpacity>
          )}
          {isOwnProfile && (
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.editBtn}>
              <Text style={styles.editBtnText}>✏️ Editar perfil</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* STATS */}
        <View style={{ paddingHorizontal: Spacing.xl, marginTop: 20, marginBottom: 20 }}>
          <View style={styles.statsRow}>
            {[
              { val: friends.length, label: 'Amigos', emoji: '👥' },
              { val: 0, label: 'Posts', emoji: '📸' },
              { val: 0, label: 'Check-ins', emoji: '📍' },
            ].map((s, i) => (
              <GlassCard key={i} intensity={20} noPadding style={{ flex: 1 }}>
                <View style={{ padding: 14, alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 20 }}>{s.emoji}</Text>
                  <Text style={styles.statVal}>{s.val}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* CARTEIRINHA DIGITAL — só no próprio perfil */}
        {isOwnProfile && (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>🪪 Carteirinha Digital</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SocioTab', { screen: 'MemberCard' } as any)} activeOpacity={0.9}>
              <LinearGradient colors={planConfig.gradient as any} style={styles.cardPreview}>
                <View style={styles.cardAccent} />
                <View style={styles.cardShine} />
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardOrg}>MANCHA VERDE CARNAVAL</Text>
                    <Text style={styles.cardPlan}>{isPremium ? '💚 MANCHA VERDE EU SOU' : '🎟️ PLANO FREE'}</Text>
                  </View>
                  <Image source={require('../../../assets/images/novo-logo.png')} style={{ width: 36, height: 36 }} resizeMode="contain" />
                </View>
                <Text style={styles.cardName}>{profile?.display_name?.toUpperCase() ?? 'TORCEDOR'}</Text>
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.cardInfoLabel}>Nº DO ASSOCIADO</Text>
                    <Text style={styles.cardInfoVal}>{membership.memberNumber}</Text>
                  </View>
                  {expiryDate && (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.cardInfoLabel}>VALIDADE</Text>
                      <Text style={styles.cardInfoVal}>{expiryDate}</Text>
                    </View>
                  )}
                  <View style={styles.cardQR}>
                    <QRCode value={`MANCHA:${membership.qrCode}:${user?.id ?? ''}:${encodeURIComponent(profile?.display_name ?? '')}`} size={52} color="#fff" backgroundColor="transparent" />
                  </View>
                </View>
                <Text style={styles.cardHint}>Toque para ver a carteirinha completa →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* INFORMAÇÕES PESSOAIS — só no próprio perfil */}
        {isOwnProfile && (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 20 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📋 Informações</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.editLink}>Editar →</Text>
              </TouchableOpacity>
            </View>
            <GlassCard intensity={22} style={{ gap: 14 }}>
              {[
                { label: 'Nome', val: profile?.display_name ?? '—', emoji: '👤' },
                { label: 'Email', val: user?.email ?? '—', emoji: '📧' },
                { label: 'Cidade', val: profile?.city || '—', emoji: '📍' },
                { label: 'Plano', val: isPremium ? 'Mancha Verde eu sou' : 'Free', emoji: '💚' },
                { label: 'Membro desde', val: memberSince ?? '—', emoji: '📅' },
                { label: 'Próximo vencimento', val: expiryDate ?? (isPremium ? '—' : 'Sem plano ativo'), emoji: expiryDate && daysUntilExpiry !== null && daysUntilExpiry <= 5 ? '⚠️' : '🗓️' },
              ].map((item, i) => (
                <View key={i} style={styles.infoRow}>
                  <Text style={{ fontSize: 16, width: 28 }}>{item.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoVal}>{item.val}</Text>
                  </View>
                </View>
              ))}
            </GlassCard>
          </View>
        )}

        {/* ALAS */}
        {profile?.alas && profile.alas.length > 0 && (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>🎭 Minhas Alas</Text>
            <View style={styles.alasWrap}>
              {profile.alas.map((ala, i) => (
                <View key={i} style={styles.alaChip}>
                  <Text style={styles.alaChipText}>{ala}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* SOLICITAÇÕES PENDENTES */}
        {isOwnProfile && pendingReceived.length > 0 && (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>👥 Solicitações de amizade ({pendingReceived.length})</Text>
            <View style={{ gap: 10 }}>
              {pendingReceived.map(req => (
                <GlassCard key={req.id} intensity={22} noPadding>
                  <View style={styles.reqRow}>
                    <LinearGradient colors={Colors.gradientPrimary as any} style={styles.reqAvatar}>
                      <Text style={styles.reqAvatarText}>{req.user_id.charAt(0).toUpperCase()}</Text>
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reqName}>Novo torcedor</Text>
                      <Text style={styles.reqSub}>Quer ser seu amigo na Mancha</Text>
                    </View>
                    <View style={{ gap: 6 }}>
                      <TouchableOpacity onPress={() => acceptFriendRequest(req.id).then(() => loadFriendships(user?.id ?? ''))} style={styles.acceptBtn}>
                        <Text style={styles.acceptBtnText}>✓</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => declineFriendRequest(req.id).then(() => loadFriendships(user?.id ?? ''))} style={styles.declineBtn}>
                        <Text style={styles.declineBtnText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  hero: { alignItems: 'center', paddingBottom: 28, paddingHorizontal: Spacing.xl, position: 'relative' },
  backBtn: { position: 'absolute', left: Spacing.xl, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.primaryBright },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.glassLight, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 42, color: Colors.textInverse, fontWeight: '800' },
  editAvatarBadge: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.primaryBright, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bg },
  heroName: { fontSize: 24, color: Colors.textPrimary, fontWeight: '800', marginBottom: 4 },
  heroCity: { fontSize: 13, color: Colors.textMuted, marginBottom: 6 },
  heroBio: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 10 },
  planBadge: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 14 },
  planBadgeText: { fontSize: 12, fontWeight: '700' },
  friendBtn: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 24, paddingVertical: 10 },
  friendBtnText: { fontSize: 14, fontWeight: '700' },
  editBtn: { backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.full, paddingHorizontal: 20, paddingVertical: 10 },
  editBtnText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statVal: { fontSize: 20, color: Colors.primaryBright, fontWeight: '800' },
  statLabel: { fontSize: 11, color: Colors.textMuted },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  editLink: { fontSize: 13, color: Colors.primaryBright, fontWeight: '600' },
  cardPreview: { borderRadius: Radius.xl, padding: 20, position: 'relative', overflow: 'hidden' },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: 'rgba(255,255,255,0.5)' },
  cardShine: { position: 'absolute', top: -60, right: -60, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.05)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cardOrg: { fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, fontWeight: '700', marginBottom: 4 },
  cardPlan: { fontSize: 11, color: '#fff', fontWeight: '700' },
  cardName: { fontSize: 22, color: '#fff', fontWeight: '800', marginBottom: 16, letterSpacing: 0.5 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardInfoLabel: { fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, fontWeight: '600', marginBottom: 3 },
  cardInfoVal: { fontSize: 13, color: '#fff', fontWeight: '700' },
  cardQR: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.md, padding: 6 },
  cardHint: { fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'right', marginTop: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 2, letterSpacing: 0.5 },
  infoVal: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  alasWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  alaChip: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 8 },
  alaChipText: { fontSize: 13, color: Colors.primaryBright, fontWeight: '600' },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  reqAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  reqAvatarText: { fontSize: 18, color: Colors.textInverse, fontWeight: '700' },
  reqName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  reqSub: { fontSize: 12, color: Colors.textMuted },
  acceptBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  acceptBtnText: { fontSize: 16, color: Colors.primaryBright },
  declineBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,90,90,0.15)', alignItems: 'center', justifyContent: 'center' },
  declineBtnText: { fontSize: 16, color: '#FF5A5A' },
});
