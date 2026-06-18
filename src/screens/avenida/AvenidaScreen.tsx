import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAvenidaStore } from '../../store/avenidaStore';
import { useAuthStore } from '../../store/authStore';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const { width: W } = Dimensions.get('window');

export default function AvenidaScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { sambaAtual, historico, poll, loadData, vote, hasVoted, getVotedOption, getTotalVotes, getPercentage, getWinningOption } = useAvenidaStore();
  const { user } = useAuthStore();
  const [justVoted, setJustVoted] = useState(false);

  useEffect(() => { loadData(); }, []);

  const userVoted = user ? hasVoted(user.id) : false;
  const votedOptionId = user ? getVotedOption(user.id) : null;
  const totalVotes = getTotalVotes();
  const winningId = getWinningOption();

  const handleVote = (optionId: string) => {
    if (!user) { navigation.navigate('Login'); return; }
    if (userVoted) return;
    const success = vote(optionId, user.id);
    if (success) {
      setJustVoted(true);
      Alert.alert('🎉 Voto registrado!', 'Obrigado por participar da escolha do próximo samba-enredo da Mancha Verde!');
    }
  };

  const daysUntilClose = Math.max(0, Math.ceil((new Date(poll.closesAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Mancha na Avenida</Text>
            <Text style={styles.headerSub}>A história contada em samba</Text>
          </View>
        </View>

        {/* ENQUETE DE VOTAÇÃO — destaque no topo */}
        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 28 }}>
          <GlassCard style={{ position: 'relative' }}>
            <View style={styles.pollAccent} />
            <View style={styles.pollHeaderRow}>
              <View style={styles.pollBadge}>
                <Text style={styles.pollBadgeText}>🗳️ ENQUETE ABERTA</Text>
              </View>
              {poll.isOpen && (
                <Text style={styles.pollDaysLeft}>{daysUntilClose}d restantes</Text>
              )}
            </View>
            <Text style={styles.pollTitle}>{poll.title}</Text>
            <Text style={styles.pollSubtitle}>{poll.subtitle}</Text>

            <View style={{ gap: 10, marginTop: 16 }}>
              {poll.options.map(option => {
                const pct = getPercentage(option.id);
                const isVotedOption = votedOptionId === option.id;
                const isWinning = winningId === option.id && (userVoted || totalVotes > 0);
                const showResults = userVoted;

                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => handleVote(option.id)}
                    disabled={userVoted}
                    activeOpacity={0.8}
                    style={[
                      styles.pollOption,
                      isVotedOption && styles.pollOptionVoted,
                    ]}
                  >
                    {showResults && (
                      <View style={[styles.pollProgressBg, { width: `${pct}%` }, isVotedOption && styles.pollProgressVoted]} />
                    )}
                    <View style={styles.pollOptionContent}>
                      <View style={styles.pollOptionHeader}>
                        <Text style={{ fontSize: 22 }}>{option.emoji}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.pollOptionTitle}>{option.title}</Text>
                          <Text style={styles.pollOptionComposers}>{option.composers}</Text>
                        </View>
                        {isVotedOption && <Text style={{ fontSize: 16 }}>✅</Text>}
                        {showResults && (
                          <Text style={[styles.pollPercent, isWinning && { color: Colors.primaryBright }]}>{pct}%</Text>
                        )}
                      </View>
                      {!showResults && (
                        <Text style={styles.pollOptionDesc}>{option.description}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.pollFooter}>
              <Text style={styles.pollFooterText}>
                {userVoted
                  ? `✅ Você votou · ${totalVotes} voto${totalVotes !== 1 ? 's' : ''} no total`
                  : `${totalVotes} voto${totalVotes !== 1 ? 's' : ''} até agora · toque para votar`}
              </Text>
            </View>
          </GlassCard>
        </View>

        {/* SAMBA ATUAL — destaque grande */}
        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 28 }}>
          <Text style={styles.sectionTitle}>🎵 Samba-Enredo Atual</Text>
          <View style={styles.currentSambaWrap}>
            <LinearGradient colors={['#134227', '#1a5c2a', '#0A1F14']} style={styles.currentSambaGrad}>
              <View style={styles.currentSambaGlow} />
              <View style={styles.currentSambaYearBadge}>
                <Text style={styles.currentSambaYearText}>CARNAVAL {sambaAtual.year}</Text>
              </View>
              <Text style={styles.currentSambaTitle}>"{sambaAtual.title}"</Text>
              <Text style={styles.currentSambaComposers}>{sambaAtual.composers}</Text>

              <View style={styles.lyricsBox}>
                <Text style={styles.lyricsText}>{sambaAtual.lyrics}</Text>
              </View>

              {sambaAtual.youtubeId && (
                <View style={styles.currentPlayerWrap}>
                  <YoutubePlayer
                    height={(W - Spacing.xl * 2 - 48) * 0.5625}
                    width={W - Spacing.xl * 2 - 48}
                    videoId={sambaAtual.youtubeId}
                    play={false}
                  />
                </View>
              )}
            </LinearGradient>
          </View>
        </View>

        {/* HISTÓRICO — vídeos do YouTube */}
        <View style={{ paddingHorizontal: Spacing.xl }}>
          <Text style={styles.sectionTitle}>📼 Sambas de Anos Anteriores</Text>
          <View style={{ gap: 14 }}>
            {historico.map(samba => (
              <TouchableOpacity
                key={samba.id}
                onPress={() => navigation.navigate('SambaVideo', { sambaId: samba.id })}
                activeOpacity={0.85}
              >
                <GlassCard noPadding intensity={25}>
                  <View style={styles.historicoThumbWrap}>
                    <Image
                      source={{ uri: `https://img.youtube.com/vi/${samba.youtubeId}/hqdefault.jpg` }}
                      style={styles.historicoThumb}
                      resizeMode="cover"
                    />
                    <View style={styles.thumbOverlay} />
                    <View style={styles.playOverlay}>
                      <View style={styles.playOverlayCircle}>
                        <Text style={{ fontSize: 20, color: '#fff' }}>▶</Text>
                      </View>
                    </View>
                    <View style={styles.historicoYearBadge}>
                      <Text style={styles.historicoYearText}>{samba.year}</Text>
                    </View>
                  </View>
                  <View style={styles.historicoInfo}>
                    <Text style={styles.historicoTitle} numberOfLines={2}>{samba.title}</Text>
                    <Text style={styles.historicoComposers}>{samba.composers}</Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14, letterSpacing: -0.2 },

  pollAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.gold, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  pollHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  pollBadge: { backgroundColor: Colors.goldMuted, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5 },
  pollBadgeText: { fontSize: 10, color: Colors.gold, fontWeight: '700', letterSpacing: 1 },
  pollDaysLeft: { fontSize: 11, color: Colors.textTertiary },
  pollTitle: { fontSize: 19, color: Colors.textPrimary, fontWeight: '800', marginBottom: 6, letterSpacing: -0.3 },
  pollSubtitle: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },

  pollOption: { borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.glassLight, overflow: 'hidden', position: 'relative' },
  pollOptionVoted: { borderColor: 'rgba(0,255,133,0.4)' },
  pollProgressBg: { position: 'absolute', top: 0, left: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.06)' },
  pollProgressVoted: { backgroundColor: 'rgba(0,255,133,0.12)' },
  pollOptionContent: { padding: 14 },
  pollOptionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pollOptionTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', marginBottom: 2 },
  pollOptionComposers: { fontSize: 11, color: Colors.textTertiary },
  pollOptionDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginTop: 8 },
  pollPercent: { fontSize: 16, color: Colors.textPrimary, fontWeight: '800' },
  pollFooter: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.glassBorder },
  pollFooterText: { fontSize: 11, color: Colors.textTertiary, textAlign: 'center' },

  currentSambaWrap: { borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,255,133,0.25)' },
  currentSambaGrad: { padding: 24, position: 'relative' },
  currentSambaGlow: { position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(0,255,133,0.12)' },
  currentSambaYearBadge: { backgroundColor: 'rgba(0,255,133,0.15)', borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 16 },
  currentSambaYearText: { fontSize: 11, color: Colors.primaryBright, fontWeight: '700', letterSpacing: 1.5 },
  currentSambaTitle: { fontSize: 24, color: Colors.textPrimary, fontWeight: '800', lineHeight: 30, marginBottom: 8 },
  currentSambaComposers: { fontSize: 13, color: Colors.textSecondary, marginBottom: 20 },
  currentPlayerWrap: { borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,255,133,0.2)' },
  lyricsBox: { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: Radius.lg, padding: 16, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: Colors.primaryBright },
  lyricsText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 24, fontStyle: 'italic' },
  playFullBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(0,255,133,0.12)', borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.full, paddingVertical: 12, paddingHorizontal: 18, alignSelf: 'flex-start' },
  playIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryBright, alignItems: 'center', justifyContent: 'center' },
  playFullText: { fontSize: 14, color: Colors.primaryBright, fontWeight: '700' },

  historicoThumbWrap: { height: 180, position: 'relative', backgroundColor: Colors.bgElevated },
  historicoThumb: { width: '100%', height: '100%' },
  thumbOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,31,20,0.25)' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  playOverlayCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(0,0,0,0.45)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center' },
  historicoYearBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(10,31,20,0.85)', borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 5 },
  historicoYearText: { fontSize: 13, color: Colors.primaryBright, fontWeight: '800' },
  historicoInfo: { padding: 16 },
  historicoTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700', lineHeight: 20, marginBottom: 4 },
  historicoComposers: { fontSize: 12, color: Colors.textTertiary, marginBottom: 8 },
});
