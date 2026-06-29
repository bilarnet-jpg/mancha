import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, ActivityIndicator, Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore, UserProfile } from '../../store/socialStore';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const { width: W } = Dimensions.get('window');

export default function ProfileScreen({ route, navigation }: any) {
  const { userId } = route.params ?? {};
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { getProfile, updateProfile, uploadAvatar, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend, getFriendshipStatus, loadFriendships, pendingReceived } = useSocialStore();

  const isOwnProfile = !userId || userId === user?.id;
  const targetUserId = userId ?? user?.id ?? '';

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [friendshipId, setFriendshipId] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
    if (user?.id) loadFriendships(user.id);
  }, [targetUserId]);

  const loadProfile = async () => {
    setLoading(true);
    const data = await getProfile(targetUserId);
    // Buscar nome do post se disponível via route params
    const routeDisplayName = route.params?.displayName;
    setProfile(data ?? {
      id: targetUserId,
      display_name: isOwnProfile
        ? (user?.displayName ?? 'Torcedor')
        : (routeDisplayName ?? 'Sócio Mancha Verde'),
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
      Alert.alert('✅ Solicitação enviada!', 'Aguarde a confirmação.');
      loadFriendships(user.id);
    } else if (friendshipStatus === 'pending_received') {
      const pending = pendingReceived.find(f => f.user_id === targetUserId);
      if (pending) { await acceptFriendRequest(pending.id); loadFriendships(user.id); }
    } else if (friendshipStatus === 'accepted') {
      Alert.alert('Remover amigo', 'Deseja desfazer a amizade?', [
        { text: 'Cancelar' },
        { text: 'Remover', style: 'destructive', onPress: async () => {
          const { useSocialStore: ss } = require('../../store/socialStore');
          const f = ss.getState().friends.find((f: any) => (f.user_id === user.id && f.friend_id === targetUserId) || (f.user_id === targetUserId && f.friend_id === user.id));
          if (f) { await removeFriend(f.id); loadFriendships(user.id); }
        }},
      ]);
    }
  };

  const FRIEND_BTN: Record<string, { label: string; color: string; bg: string }> = {
    none: { label: '➕ Adicionar amigo', color: Colors.primaryBright, bg: Colors.primaryMuted },
    pending_sent: { label: '⏳ Solicitação enviada', color: Colors.textMuted, bg: Colors.glassLight },
    pending_received: { label: '✓ Aceitar amizade', color: Colors.gold, bg: Colors.goldMuted },
    accepted: { label: '✓ Amigos', color: Colors.primaryBright, bg: Colors.primaryMuted },
  };

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={Colors.primaryBright} />
    </View>
  );

  const btnConfig = FRIEND_BTN[friendshipStatus] ?? FRIEND_BTN.none;

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* HEADER */}
        <LinearGradient colors={['#134227', '#0A1F14']} style={[styles.hero, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>

          {/* AVATAR */}
          <TouchableOpacity onPress={handlePickAvatar} disabled={!isOwnProfile} activeOpacity={0.85}>
            <View style={styles.avatarWrap}>
              {uploadingAvatar ? (
                <ActivityIndicator color={Colors.primaryBright} size="large" />
              ) : profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
              ) : (
                <LinearGradient colors={Colors.gradientPrimary as any} style={styles.avatar}>
                  <Text style={styles.avatarInitial}>{profile?.display_name?.charAt(0)?.toUpperCase() ?? 'M'}</Text>
                </LinearGradient>
              )}
              {isOwnProfile && (
                <View style={styles.editAvatarBadge}>
                  <Text style={{ fontSize: 12 }}>📷</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.heroName}>{profile?.display_name ?? 'Torcedor'}</Text>
          {profile?.city && <Text style={styles.heroCity}>📍 {profile.city}</Text>}
          {profile?.bio && <Text style={styles.heroBio}>{profile.bio}</Text>}

          {/* AÇÕES */}
          {!isOwnProfile && (
            <TouchableOpacity
              onPress={handleFriendAction}
              disabled={friendshipStatus === 'pending_sent'}
              style={[styles.friendBtn, { backgroundColor: btnConfig.bg, borderColor: `${btnConfig.color}44` }]}
            >
              <Text style={[styles.friendBtnText, { color: btnConfig.color }]}>{btnConfig.label}</Text>
            </TouchableOpacity>
          )}

          {isOwnProfile && (
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnText}>✏️ Editar perfil</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* ALAS */}
        {profile?.alas && profile.alas.length > 0 && (
          <View style={{ paddingHorizontal: Spacing.xl, marginTop: 20 }}>
            <Text style={styles.sectionTitle}>🎭 Alas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {profile.alas.map((ala, i) => (
                <View key={i} style={styles.alaChip}>
                  <Text style={styles.alaChipText}>{ala}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* STATS */}
        <View style={{ paddingHorizontal: Spacing.xl, marginTop: 20 }}>
          <View style={styles.statsRow}>
            {[
              { val: useSocialStore.getState().friends.length, label: 'Amigos' },
              { val: 0, label: 'Posts' },
              { val: 0, label: 'Curtidas' },
            ].map((s, i) => (
              <GlassCard key={i} intensity={20} style={{ flex: 1 }} noPadding>
                <View style={{ padding: 14, alignItems: 'center' }}>
                  <Text style={styles.statVal}>{s.val}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </GlassCard>
            ))}
          </View>
        </View>

        {/* AMIGOS PENDENTES — só no próprio perfil */}
        {isOwnProfile && useSocialStore.getState().pendingReceived.length > 0 && (
          <View style={{ paddingHorizontal: Spacing.xl, marginTop: 20 }}>
            <Text style={styles.sectionTitle}>👥 Solicitações de amizade</Text>
            <View style={{ gap: 10 }}>
              {useSocialStore.getState().pendingReceived.map(req => (
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
  backBtn: { position: 'absolute', top: 64, left: Spacing.xl, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { position: 'relative', marginBottom: 14, marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.primaryBright },
  avatarInitial: { fontSize: 42, color: Colors.textInverse, fontWeight: '800' },
  editAvatarBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primaryBright, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.bg },
  heroName: { fontSize: 24, color: Colors.textPrimary, fontWeight: '800', marginBottom: 4 },
  heroCity: { fontSize: 13, color: Colors.textMuted, marginBottom: 6 },
  heroBio: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  friendBtn: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 20, paddingVertical: 10 },
  friendBtnText: { fontSize: 14, fontWeight: '700' },
  editBtn: { backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.full, paddingHorizontal: 20, paddingVertical: 10 },
  editBtnText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 12 },
  alaChip: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 8 },
  alaChipText: { fontSize: 13, color: Colors.primaryBright, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statVal: { fontSize: 22, color: Colors.primaryBright, fontWeight: '800' },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
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
