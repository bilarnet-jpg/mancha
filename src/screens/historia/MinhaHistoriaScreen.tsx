import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHistoriaStore } from '../../store/historiaStore';
import { useAuthStore } from '../../store/authStore';
import { getLevelInfo, RARITY_COLORS, ALL_ACHIEVEMENTS } from '../../types/historia';
import { Colors, Spacing, Radius } from '../../theme';
import PremiumGate from '../../components/PremiumGate';

const { width: W } = Dimensions.get('window');

export default function MinhaHistoriaScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { passport, parades, achievements, timeline, loadData, getProgressToNextLevel, getLockedAchievements } = useHistoriaStore();

  const [showPremiumGate, setShowPremiumGate] = useState(false);
  useEffect(() => { if (user) loadData(user.id); }, [user]);

  const levelInfo = getLevelInfo(passport.xp);
  const progress = getProgressToNextLevel();
  const lockedAchievements = getLockedAchievements();
  const yearsInMancha = new Date().getFullYear() - passport.yearJoined;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* HERO — PASSAPORTE */}
        <LinearGradient colors={['#0d3d1a', '#1a5c2a', '#051a0a']} style={styles.hero}>
          <View style={styles.heroGlow} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: 12 }]}>
            <Text style={{ fontSize: 18, color: Colors.textPrimary }}>←</Text>
          </TouchableOpacity>

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>⭐ MINHA HISTÓRIA NA MANCHA</Text>
          </View>

          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.displayName?.charAt(0)?.toUpperCase() ?? 'M'}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{levelInfo.emoji}</Text>
            </View>
          </View>

          <Text style={styles.heroName}>{user?.displayName ?? 'Torcedor'}</Text>
          <Text style={styles.heroLevel}>{levelInfo.name} · {levelInfo.emoji}</Text>
          <Text style={styles.heroYears}>
            {yearsInMancha <= 0 ? 'Novo membro' : `${yearsInMancha} ano${yearsInMancha > 1 ? 's' : ''} de Mancha`} 🐍
          </Text>

          {/* XP Bar */}
          <View style={styles.xpWrap}>
            <View style={styles.xpBarBg}>
              <View style={[styles.xpBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.xpText}>{passport.xp} XP · {progress}% para próximo nível</Text>
          </View>

          {/* Stats rápidos */}
          <View style={styles.statsRow}>
            {[
              { icon: '🎭', val: passport.paradesCount, label: 'Desfiles' },
              { icon: '📅', val: passport.eventsAttended, label: 'Eventos' },
              { icon: '📸', val: passport.photosApproved, label: 'Fotos' },
              { icon: '❤️', val: passport.likesReceived, label: 'Curtidas' },
            ].map((s, i) => (
              <View key={i} style={styles.statChip}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* MÓDULOS */}
        <View style={styles.modules}>

          {/* Linha do Tempo */}
          <TouchableOpacity onPress={() => navigation.navigate('Timeline')} style={styles.moduleCard} activeOpacity={0.85}>
            <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.moduleGrad}>
              <View style={styles.moduleAccent} />
              <Text style={styles.moduleEmoji}>📅</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.moduleTitle}>Linha do Tempo</Text>
                <Text style={styles.moduleSub}>{timeline.length} anos registrados</Text>
              </View>
              <Text style={styles.moduleArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Meus Desfiles */}
          <TouchableOpacity onPress={() => {
          if (!user?.isPremium) { setShowPremiumGate(true); return; }
          navigation.navigate('Parades');
        }} style={styles.moduleCard} activeOpacity={0.85}>
            <LinearGradient colors={['#1a0533', '#0d021a']} style={styles.moduleGrad}>
              <View style={[styles.moduleAccent, { backgroundColor: '#FF4081' }]} />
              <Text style={styles.moduleEmoji}>🎭</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.moduleTitle}>Meus Desfiles</Text>
                <Text style={styles.moduleSub}>{parades.length} desfile{parades.length !== 1 ? 's' : ''} registrado{parades.length !== 1 ? 's' : ''}</Text>
              </View>
              <Text style={styles.moduleArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Conquistas */}
          <TouchableOpacity onPress={() => navigation.navigate('Achievements')} style={styles.moduleCard} activeOpacity={0.85}>
            <LinearGradient colors={['#1a1000', '#0a0800']} style={styles.moduleGrad}>
              <View style={[styles.moduleAccent, { backgroundColor: Colors.gold }]} />
              <Text style={styles.moduleEmoji}>🏅</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.moduleTitle}>Conquistas</Text>
                <Text style={styles.moduleSub}>{achievements.length}/{ALL_ACHIEVEMENTS.length} desbloqueadas</Text>
              </View>
              <Text style={styles.moduleArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Retrospectiva */}
          <TouchableOpacity onPress={() => {
          if (!user?.isPremium) { setShowPremiumGate(true); return; }
          navigation.navigate('Wrapped');
        }} style={styles.moduleCard} activeOpacity={0.85}>
            <LinearGradient colors={['#0d0d2a', '#05050a']} style={styles.moduleGrad}>
              <View style={[styles.moduleAccent, { backgroundColor: '#818CF8' }]} />
              <Text style={styles.moduleEmoji}>✨</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.moduleTitle}>Retrospectiva 2025</Text>
                <Text style={styles.moduleSub}>Seu ano em resumo</Text>
              </View>
              <Text style={styles.moduleArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Carta para o Futuro */}
          <TouchableOpacity onPress={() => {
          if (!user?.isPremium) { setShowPremiumGate(true); return; }
          navigation.navigate('FutureLetter');
        }} style={styles.moduleCard} activeOpacity={0.85}>
            <LinearGradient colors={['#1a0d00', '#0a0700']} style={styles.moduleGrad}>
              <View style={[styles.moduleAccent, { backgroundColor: Colors.gold }]} />
              <Text style={styles.moduleEmoji}>💌</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.moduleTitle}>Carta para o Futuro</Text>
                <Text style={styles.moduleSub}>Mensagem para você mesmo</Text>
              </View>
              <Text style={styles.moduleArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* CONQUISTAS RECENTES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏅 Conquistas Recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Achievements')}>
              <Text style={styles.seeAll}>Ver todas →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {achievements.map(ach => (
              <View key={ach.id} style={[styles.achCard, { borderColor: `${RARITY_COLORS[ach.rarity]}44` }]}>
                <View style={[styles.achIconWrap, { backgroundColor: `${RARITY_COLORS[ach.rarity]}22` }]}>
                  <Text style={{ fontSize: 28 }}>{ach.icon}</Text>
                </View>
                <Text style={styles.achTitle} numberOfLines={2}>{ach.title}</Text>
                <View style={[styles.achRarity, { backgroundColor: `${RARITY_COLORS[ach.rarity]}22` }]}>
                  <Text style={[styles.achRarityText, { color: RARITY_COLORS[ach.rarity] }]}>{ach.rarity}</Text>
                </View>
              </View>
            ))}
            {lockedAchievements.slice(0, 2).map(ach => (
              <View key={ach.key} style={[styles.achCard, styles.achCardLocked]}>
                <View style={styles.achIconWrap}>
                  <Text style={{ fontSize: 28, opacity: 0.3 }}>{ach.icon}</Text>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
                <Text style={[styles.achTitle, { color: Colors.textMuted }]} numberOfLines={2}>{ach.title}</Text>
                <View style={styles.achRarity}>
                  <Text style={styles.achRarityText}>{ach.rarity}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ÚLTIMO DESFILE */}
        {parades.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎭 Último Desfile</Text>
            <TouchableOpacity onPress={() => {
          if (!user?.isPremium) { setShowPremiumGate(true); return; }
          navigation.navigate('Parades');
        }} style={styles.lastParadeCard} activeOpacity={0.85}>
              <LinearGradient colors={['#1a0533', '#0d021a']} style={styles.lastParadeGrad}>
                <View style={styles.lastParadeAccent} />
                <View style={styles.lastParadeYear}>
                  <Text style={styles.lastParadeYearText}>{parades[0].year}</Text>
                </View>
                <Text style={styles.lastParadeEnredo} numberOfLines={2}>{parades[0].enredo}</Text>
                <Text style={styles.lastParadeAla}>{parades[0].ala} · {parades[0].role}</Text>
                {parades[0].notes && (
                  <Text style={styles.lastParadeNotes} numberOfLines={2}>"{parades[0].notes}"</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* MEMÓRIA DO DIA */}
        <View style={[styles.section, { marginBottom: 0 }]}>
          <View style={styles.memoryCard}>
            <View style={styles.memoryCardAccent} />
            <Text style={styles.memoryIcon}>📅</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.memoryTitle}>Memória do Dia</Text>
              <Text style={styles.memorySub}>Há 3 anos você participou do seu primeiro ensaio na Quadra da Mancha Verde. Uma noite inesquecível!</Text>
            </View>
          </View>
        </View>

      </ScrollView>
      <PremiumGate
        visible={showPremiumGate}
        onClose={() => setShowPremiumGate(false)}
        onSubscribe={() => { setShowPremiumGate(false); navigation.navigate('SocioTab'); }}
        feature="Minha História na Mancha"
        emoji="🎭"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  hero: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl, paddingTop: Spacing.base, position: 'relative', overflow: 'hidden' },
  heroGlow: { position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(0,255,133,0.08)' },
  backBtn: { position: 'absolute', left: Spacing.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  heroBadge: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}44`, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 5, alignSelf: 'center', marginBottom: Spacing.xl, marginTop: 40 },
  heroBadgeText: { fontSize: 10, color: Colors.primary, fontWeight: '700', letterSpacing: 1.5 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#0d3d1a', borderWidth: 2, borderColor: Colors.goldBorder, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: Spacing.base, position: 'relative' },
  avatarText: { fontSize: 36, color: Colors.gold, fontWeight: '700' },
  levelBadge: { position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.goldBorder, alignItems: 'center', justifyContent: 'center' },
  levelBadgeText: { fontSize: 14 },
  heroName: { fontSize: 22, color: Colors.textPrimary, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  heroLevel: { fontSize: 14, color: Colors.gold, textAlign: 'center', marginBottom: 4 },
  heroYears: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  xpWrap: { marginBottom: Spacing.xl },
  xpBarBg: { height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  xpBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  xpText: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', gap: 2 },
  statIcon: { fontSize: 16 },
  statVal: { fontSize: 16, color: Colors.primary, fontWeight: '700' },
  statLabel: { fontSize: 9, color: Colors.textMuted, letterSpacing: 0.5 },
  modules: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, gap: Spacing.sm },
  moduleCard: { borderRadius: Radius.lg, overflow: 'hidden' },
  moduleGrad: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: Spacing.base, position: 'relative' },
  moduleAccent: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, backgroundColor: Colors.primary },
  moduleEmoji: { fontSize: 28, width: 40, textAlign: 'center' },
  moduleTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600' },
  moduleSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  moduleArrow: { fontSize: 18, color: Colors.textMuted },
  section: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xxl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
  seeAll: { fontSize: 13, color: Colors.primary },
  achCard: { width: 110, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.sm, alignItems: 'center', gap: 6 },
  achCardLocked: { opacity: 0.5 },
  achIconWrap: { width: 56, height: 56, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  lockIcon: { position: 'absolute', bottom: 0, right: 0, fontSize: 12 },
  achTitle: { fontSize: 11, color: Colors.textPrimary, fontWeight: '500', textAlign: 'center', lineHeight: 15 },
  achRarity: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  achRarityText: { fontSize: 9, color: Colors.textMuted, fontWeight: '600', letterSpacing: 0.5 },
  lastParadeCard: { borderRadius: Radius.xl, overflow: 'hidden' },
  lastParadeGrad: { padding: Spacing.xl, position: 'relative' },
  lastParadeAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#FF4081' },
  lastParadeYear: { marginBottom: 8 },
  lastParadeYearText: { fontSize: 42, color: '#FF408133', fontWeight: '900', lineHeight: 44 },
  lastParadeEnredo: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700', lineHeight: 24, marginBottom: 6 },
  lastParadeAla: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  lastParadeNotes: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic', lineHeight: 20 },
  memoryCard: { flexDirection: 'row', gap: 12, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.xl, padding: Spacing.base, position: 'relative', overflow: 'hidden' },
  memoryCardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.gold },
  memoryIcon: { fontSize: 28 },
  memoryTitle: { fontSize: 14, color: Colors.gold, fontWeight: '600', marginBottom: 4 },
  memorySub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
});
