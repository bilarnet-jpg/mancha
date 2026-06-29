import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Share, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCommunityStore } from '../../store/communityStore';
import { useAuthStore } from '../../store/authStore';
import { Reel } from '../../types/community';
import { Colors, Spacing, Radius } from '../../theme';
import PremiumGate from '../../components/PremiumGate';

const { width: W, height: H } = Dimensions.get('window');

const formatCount = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}mil`;
  return `${n}`;
};

export default function ReelsViewerScreen({ route, navigation }: any) {
  const { startIndex = 0 } = route.params ?? {};
  const insets = useSafeAreaInsets();
  const { reels, toggleReelLike, getCommentsFor, addComment } = useCommunityStore();
  const { user } = useAuthStore();
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [commentsOpenFor, setCommentsOpenFor] = useState<string | null>(null);
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState('');
  const [commentText, setCommentText] = useState('');

  const handleShare = async (reel: Reel) => {
    await Share.share({
      title: `Reel de ${reel.userName}`,
      message: `🎬 ${reel.caption}\n\nVeja no app Mancha Carnaval!`,
    });
  };

  const handleSendComment = (reelId: string) => {
    if (!commentText.trim() || !user) return;
    addComment(reelId, user.id, user.displayName, commentText.trim());
    setCommentText('');
  };

  const renderItem = ({ item, index }: { item: Reel; index: number }) => {
    const isLiked = user ? item.likes.includes(user.id) : false;
    const commentsVisible = commentsOpenFor === item.id;
    const comments = getCommentsFor(item.id);

    return (
      <View style={{ width: W, height: H }}>
        <LinearGradient colors={item.gradientColors as any} style={StyleSheet.absoluteFillObject} />
        <View style={styles.centerEmoji}>
          <Text style={{ fontSize: 110, opacity: 0.55 }}>{item.videoEmoji}</Text>
        </View>

        {/* Topo */}
        <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Text style={{ fontSize: 18, color: '#fff' }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>Reels</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Info inferior esquerda */}
        <View style={[styles.bottomInfo, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
            </View>
            <Text style={styles.authorName}>{item.userName}</Text>
          </View>
          <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
          {item.music && (
            <View style={styles.musicRow}>
              <Text style={{ fontSize: 12 }}>🎵</Text>
              <Text style={styles.musicText} numberOfLines={1}>{item.music}</Text>
            </View>
          )}
        </View>

        {/* Ações direita */}
        <View style={[styles.rightActions, { bottom: insets.bottom + 100 }]}>
          <TouchableOpacity onPress={() => {
                      if (!user?.isPremium) { setPremiumFeature('Curtir Reels'); setShowPremiumGate(true); return; }
                      user && toggleReelLike(item.id, user.id);
                    }} style={styles.rightActionItem}>
            <Text style={{ fontSize: 30 }}>{isLiked ? '❤️' : '🤍'}</Text>
            <Text style={styles.rightActionLabel}>{formatCount(item.likes.length)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
                      if (!user?.isPremium) { setPremiumFeature('Comentar nos Reels'); setShowPremiumGate(true); return; }
                      setCommentsOpenFor(item.id);
                    }} style={styles.rightActionItem}>
            <Text style={{ fontSize: 28 }}>💬</Text>
            <Text style={styles.rightActionLabel}>{formatCount(item.commentsCount)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleShare(item)} style={styles.rightActionItem}>
            <Text style={{ fontSize: 26 }}>📤</Text>
            <Text style={styles.rightActionLabel}>{formatCount(item.shares)}</Text>
          </TouchableOpacity>
          <View style={styles.rightActionItem}>
            <Text style={{ fontSize: 24 }}>👁️</Text>
            <Text style={styles.rightActionLabel}>{formatCount(item.views)}</Text>
          </View>
        </View>

        {/* Painel de comentários */}
        {commentsVisible && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.commentsOverlay}
          >
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setCommentsOpenFor(null)} />
            <View style={[styles.commentsPanel, { paddingBottom: insets.bottom + 12 }]}>
              <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
              <View style={styles.commentsPanelTint} />
              <View style={styles.commentsHandle} />
              <Text style={styles.commentsTitle}>{comments.length} comentários</Text>
              <View style={{ maxHeight: 280 }}>
                {comments.length === 0 ? (
                  <Text style={styles.noComments}>Seja o primeiro a comentar!</Text>
                ) : (
                  comments.map(c => (
                    <View key={c.id} style={styles.commentRow}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>{c.userName.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.commentAuthor}>{c.userName}</Text>
                        <Text style={styles.commentText}>{c.text}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
              <View style={styles.commentInputRow}>
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Adicione um comentário..."
                  placeholderTextColor={Colors.textTertiary}
                  style={styles.commentInput}
                />
                <TouchableOpacity onPress={() => handleSendComment(item.id)} style={styles.sendBtn}>
                  <Text style={{ fontSize: 14, color: Colors.primaryBright, fontWeight: '700' }}>Enviar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <FlatList
        data={reels}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        initialScrollIndex={startIndex}
        getItemLayout={(_, index) => ({ length: H, offset: H * index, index })}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / H);
          setActiveIndex(index);
          setCommentsOpenFor(null);
        }}
      />
      <PremiumGate
        visible={showPremiumGate}
        onClose={() => setShowPremiumGate(false)}
        onSubscribe={() => { setShowPremiumGate(false); navigation.navigate('SocioTab'); }}
        feature={premiumFeature}
        emoji="🎬"
      />
      <PremiumGate
        visible={showPremiumGate}
        onClose={() => setShowPremiumGate(false)}
        onSubscribe={() => { setShowPremiumGate(false); navigation.navigate('SocioTab'); }}
        feature={premiumFeature}
        emoji="🎬"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centerEmoji: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontSize: 16, color: '#fff', fontWeight: '700' },
  bottomInfo: { position: 'absolute', left: Spacing.xl, right: 90, bottom: 0 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, color: '#fff', fontWeight: '700' },
  authorName: { fontSize: 14, color: '#fff', fontWeight: '700' },
  caption: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 19, marginBottom: 8 },
  musicRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  musicText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', flex: 1 },
  rightActions: { position: 'absolute', right: Spacing.base, alignItems: 'center', gap: 22 },
  rightActionItem: { alignItems: 'center', gap: 4 },
  rightActionLabel: { fontSize: 11, color: '#fff', fontWeight: '600' },
  commentsOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end' },
  commentsPanel: { maxHeight: H * 0.6, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.xl, overflow: 'hidden' },
  commentsPanelTint: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(13,40,24,0.45)' },
  commentsHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', alignSelf: 'center', marginBottom: 14 },
  commentsTitle: { fontSize: 14, color: '#fff', fontWeight: '700', marginBottom: 14 },
  noComments: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center', paddingVertical: 20 },
  commentRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  commentAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,255,133,0.2)', alignItems: 'center', justifyContent: 'center' },
  commentAvatarText: { fontSize: 12, color: Colors.primaryBright, fontWeight: '700' },
  commentAuthor: { fontSize: 12, color: '#fff', fontWeight: '700', marginBottom: 2 },
  commentText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 18 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 14 },
  commentInput: { flex: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.full, paddingHorizontal: 16, fontSize: 13, color: '#fff' },
  sendBtn: { paddingHorizontal: 8 },
});
