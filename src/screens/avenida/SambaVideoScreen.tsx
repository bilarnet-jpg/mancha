import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAvenidaStore } from '../../store/avenidaStore';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const { width: W } = Dimensions.get('window');

export default function SambaVideoScreen({ route, navigation }: any) {
  const { sambaId } = route.params;
  const insets = useSafeAreaInsets();
  const { historico } = useAvenidaStore();
  const samba = historico.find(s => s.id === sambaId);

  if (!samba) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Colors.textMuted }}>Vídeo não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.playerWrap}>
          <YoutubePlayer
            height={W * 0.5625}
            width={W}
            videoId={samba.youtubeId}
            play={false}
          />
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl }}>
          <View style={styles.yearRow}>
            <View style={styles.yearBadge}>
              <Text style={styles.yearBadgeText}>CARNAVAL {samba.year}</Text>
            </View>
            {samba.isChampion && (
              <View style={styles.championBadge}>
                <Text style={styles.championBadgeText}>🏆 CAMPEÃO</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{samba.title}</Text>
          <Text style={styles.composers}>{samba.composers}</Text>

          {samba.placement && (
            <GlassCard intensity={20} style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 28 }}>{samba.isChampion ? '🏆' : '🎭'}</Text>
              <View>
                <Text style={styles.placementLabel}>Resultado</Text>
                <Text style={styles.placementValue}>{samba.placement}</Text>
              </View>
            </GlassCard>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: Spacing.xl, marginBottom: 12 },
  backBtn: { alignSelf: 'flex-start' },
  playerWrap: { width: W, backgroundColor: '#000' },
  yearRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  yearBadge: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5 },
  yearBadgeText: { fontSize: 11, color: Colors.primaryBright, fontWeight: '700', letterSpacing: 1 },
  championBadge: { backgroundColor: Colors.goldMuted, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5 },
  championBadgeText: { fontSize: 11, color: Colors.gold, fontWeight: '700', letterSpacing: 1 },
  title: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800', lineHeight: 28, marginBottom: 6 },
  composers: { fontSize: 14, color: Colors.textSecondary },
  placementLabel: { fontSize: 11, color: Colors.textTertiary, marginBottom: 2 },
  placementValue: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700' },
});
