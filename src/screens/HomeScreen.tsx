import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { Colors, Spacing, Radius } from '../theme';
import GlowBackground from '../components/GlowBackground';
import GlassCard from '../components/GlassCard';
import PillButton from '../components/PillButton';

const { width: W } = Dimensions.get('window');

const QUICK = [
  { id: '1', label: 'Sambas', color: '#00FF85', bg: 'rgba(0,255,133,0.15)', emoji: '🎵' },
  { id: '2', label: 'Agenda', color: '#4FC3F7', bg: 'rgba(79,195,247,0.15)', emoji: '📅' },
  { id: '3', label: 'Loja', color: '#FFD874', bg: 'rgba(255,216,116,0.15)', emoji: '🛍️' },
  { id: '4', label: 'Galeria', color: '#FF4081', bg: 'rgba(255,64,129,0.15)', emoji: '📸' },
];

const EVENTS = [
  { id: '1', day: '15', month: 'JAN', title: 'Ensaio na Quadra', local: 'Rua Cantareira, 520', emoji: '🥁' },
  { id: '2', day: '22', month: 'JAN', title: 'Show de Lançamento', local: 'Sambódromo do Anhembi', emoji: '🎤' },
];

const NEWS = [
  { id: '1', tag: 'CARNAVAL', title: 'Mancha Verde anuncia samba-enredo para 2026', time: 'Há 1 hora' },
  { id: '2', tag: 'PALMEIRAS', title: 'Palmeiras goleia e torcida celebra no Allianz', time: 'Há 3 horas' },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
};

export default function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100, paddingHorizontal: Spacing.xl }}>

        {/* HEADER */}
        <Text style={styles.greeting}>{getGreeting()}, <Text style={styles.greetingName}>{user?.displayName?.split(' ')[0] ?? 'Torcedor'}</Text></Text>
        <View style={styles.titleRow}>
          <Image source={require('../../assets/images/logo.png')} style={styles.titleLogo} resizeMode="contain" />
          <Text style={styles.bigTitle}>Mancha Verde{'\n'}<Text style={styles.bigTitleAccent}>Carnaval</Text></Text>
        </View>

        {/* HERO STATS */}
        <GlassCard style={{ marginBottom: 18 }}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>SÓCIO MANCHA</Text>
              <Text style={styles.heroSub}>Plano {user?.isPremium ? 'Ouro 🥇' : 'Free 🌱'}</Text>
            </View>
            <TouchableOpacity onPress={logout} style={styles.avatarRing}>
              <Text style={styles.avatarText}>{user?.displayName?.charAt(0)?.toUpperCase() ?? 'M'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            {[
              { val: user?.xp ?? 0, label: 'XP' },
              { val: user?.coins ?? 50, label: 'Moedas' },
              { val: 0, label: 'Conquistas' },
            ].map((s, i) => (
              <View key={i} style={styles.statPill}>
                <Text style={styles.statNum}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* MINHA HISTÓRIA */}
        <TouchableOpacity onPress={() => navigation.navigate('MinhaHistoria')} activeOpacity={0.9}>
          <GlassCard style={{ marginBottom: 14, position: 'relative' }}>
            <Text style={styles.historiaFloatEmoji}>🎭</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⭐ NOVO</Text>
            </View>
            <Text style={styles.historiaTitle}>Minha História{'\n'}na Mancha</Text>
            <Text style={styles.historiaSub}>"Sua trajetória faz parte{'\n'}da nossa história."</Text>
            <PillButton label="Construir Minha História →" variant="primary" />
          </GlassCard>
        </TouchableOpacity>

        {/* CARTÕES DA MANCHA */}
        <TouchableOpacity onPress={() => navigation.navigate('CardsMain')} activeOpacity={0.9}>
          <GlassCard style={{ marginBottom: 18, flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
            <View style={styles.cartoesAccent} />
            <View style={{ flex: 1 }}>
              <View style={styles.cartoesBadge}>
                <Text style={styles.cartoesBadgeText}>💌 NOVO</Text>
              </View>
              <Text style={styles.cartoesTitle}>Cartões da{'\n'}Mancha</Text>
              <Text style={styles.cartoesSub}>Compartilhe emoção, alegria e axé</Text>
            </View>
            <Text style={{ fontSize: 44 }}>💌</Text>
          </GlassCard>
        </TouchableOpacity>

        {/* ACESSO RÁPIDO */}
        <Text style={styles.sectionTitle}>Acesso rápido</Text>
        <View style={styles.quickGrid}>
          {QUICK.map((item, i) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={styles.quickWrap}
              onPress={() => {
                if (i === 1) navigation.navigate('AgendaTab');
                else if (i === 2) navigation.navigate('LojaTab');
                else if (i === 3) navigation.navigate('ManchaTab');
              }}
            >
              <GlassCard noPadding intensity={30} borderRadius={Radius.lg} style={styles.quickCard}>
                <View style={styles.quickInner}>
                  <View style={[styles.quickIcon, { backgroundColor: item.bg }]}>
                    <Text style={{ fontSize: 19 }}>{item.emoji}</Text>
                  </View>
                  <Text style={styles.quickLabel}>{item.label}</Text>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* SAMBA DO ANO */}
        <Text style={styles.sectionTitle}>Samba do ano</Text>
        <GlassCard style={{ marginBottom: 4, position: 'relative' }}>
          <View style={styles.vinyl} />
          <Text style={styles.sambaTag}>SAMBA 2026</Text>
          <Text style={styles.sambaTitle}>"Do Verde que Sangra,{'\n'}Nasce a Chama"</Text>
          <Text style={styles.sambaSub}>Grupo Mancha Verde · 2025</Text>
          <View style={styles.playRow}>
            <View style={styles.playBtn}>
              <Text style={{ fontSize: 16, color: Colors.textInverse }}>▶</Text>
            </View>
            <View style={styles.waveform}>
              {[8, 16, 10, 20, 14, 18, 8, 12].map((h, i) => (
                <View key={i} style={[styles.waveBar, { height: h }]} />
              ))}
            </View>
          </View>
        </GlassCard>

        {/* PRÓXIMOS EVENTOS */}
        <View style={styles.labelRow}>
          <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Próximos eventos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AgendaTab')}>
            <Text style={styles.seeAll}>Ver agenda →</Text>
          </TouchableOpacity>
        </View>
        {EVENTS.map(event => (
          <GlassCard key={event.id} intensity={25} style={styles.eventCard} noPadding>
            <View style={styles.eventInner}>
              <View style={styles.eventDate}>
                <Text style={styles.eventDay}>{event.day}</Text>
                <Text style={styles.eventMonth}>{event.month}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{event.emoji} {event.title}</Text>
                <Text style={styles.eventLocal}>{event.local}</Text>
              </View>
            </View>
          </GlassCard>
        ))}

        {/* NOTÍCIAS */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Últimas notícias</Text>
        {NEWS.map(news => (
          <GlassCard key={news.id} intensity={25} style={styles.newsCard} noPadding>
            <View style={styles.newsInner}>
              <View style={styles.newsTag}>
                <Text style={styles.newsTagText}>{news.tag}</Text>
              </View>
              <Text style={styles.newsTitle}>{news.title}</Text>
              <Text style={styles.newsTime}>{news.time}</Text>
            </View>
          </GlassCard>
        ))}

        {/* PREMIUM */}
        {!user?.isPremium && (
          <TouchableOpacity activeOpacity={0.9} style={{ marginTop: 28 }} onPress={() => navigation.navigate('SocioMain')}>
            <LinearGradient colors={Colors.gradientGold as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.premiumBanner}>
              <View>
                <Text style={styles.premiumLabel}>EXCLUSIVO</Text>
                <Text style={styles.premiumTitle}>Torne-se Premium 👑</Text>
                <Text style={styles.premiumSub}>Conteúdo exclusivo + benefícios</Text>
              </View>
              <View style={styles.premiumCta}>
                <Text style={styles.premiumCtaText}>Ver planos</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  greeting: { fontSize: 13, color: Colors.textTertiary, marginBottom: 6 },
  greetingName: { color: Colors.primaryBright, fontWeight: '600' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 },
  titleLogo: { width: 44, height: 44 },
  bigTitle: { fontSize: 30, color: Colors.textPrimary, fontWeight: '800', lineHeight: 34, letterSpacing: -0.5 },
  bigTitleAccent: { color: Colors.primaryBright },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  heroLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: Colors.primaryBright, textTransform: 'uppercase' },
  heroSub: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  avatarRing: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.primaryBright, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 17, fontWeight: '700', color: Colors.textInverse },
  statsRow: { flexDirection: 'row', gap: 10 },
  statPill: { flex: 1, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.lg, paddingVertical: 14, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.3 },
  statLabel: { fontSize: 10, color: Colors.textTertiary, marginTop: 3, fontWeight: '500' },
  historiaFloatEmoji: { position: 'absolute', right: 20, top: 20, fontSize: 28, opacity: 0.5 },
  badge: { flexDirection: 'row', backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5, alignSelf: 'flex-start', marginBottom: 14 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: Colors.primaryBright },
  historiaTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, lineHeight: 26, marginBottom: 8, letterSpacing: -0.3 },
  historiaSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 20, fontStyle: 'italic' },
  cartoesAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#C77DD8', borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  cartoesBadge: { backgroundColor: 'rgba(156,39,176,0.2)', borderWidth: 1, borderColor: 'rgba(156,39,176,0.4)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 8 },
  cartoesBadgeText: { fontSize: 10, color: '#C77DD8', fontWeight: '700', letterSpacing: 1.5 },
  cartoesTitle: { fontSize: 19, color: Colors.textPrimary, fontWeight: '700', lineHeight: 24, marginBottom: 4 },
  cartoesSub: { fontSize: 12, color: Colors.textSecondary },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14, letterSpacing: -0.2 },
  quickGrid: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  quickWrap: { flex: 1 },
  quickCard: { flex: 1 },
  quickInner: { paddingVertical: 16, paddingHorizontal: 6, alignItems: 'center' },
  quickIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500' },
  vinyl: { position: 'absolute', right: 22, top: 22, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.bgElevated, borderWidth: 2, borderColor: Colors.glassBorderStrong, alignItems: 'center', justifyContent: 'center' },
  sambaTag: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: Colors.gold, marginBottom: 10 },
  sambaTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, lineHeight: 23, marginBottom: 6, maxWidth: 240 },
  sambaSub: { fontSize: 12, color: Colors.textTertiary, marginBottom: 18 },
  playRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryBright, alignItems: 'center', justifyContent: 'center' },
  waveform: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 24 },
  waveBar: { width: 3, backgroundColor: Colors.glassBorderStrong, borderRadius: 2 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  seeAll: { fontSize: 12, color: Colors.primaryBright, fontWeight: '600' },
  eventCard: { marginBottom: 10 },
  eventInner: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  eventDate: { width: 50, height: 50, borderRadius: 16, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.25)', alignItems: 'center', justifyContent: 'center' },
  eventDay: { fontSize: 17, fontWeight: '800', color: Colors.primaryBright, lineHeight: 19 },
  eventMonth: { fontSize: 8, fontWeight: '700', letterSpacing: 1, color: Colors.primaryBright },
  eventTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  eventLocal: { fontSize: 11, color: Colors.textTertiary },
  newsCard: { marginBottom: 10 },
  newsInner: { padding: 16 },
  newsTag: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.25)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 8 },
  newsTagText: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, color: Colors.primaryBright },
  newsTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500', lineHeight: 20, marginBottom: 6 },
  newsTime: { fontSize: 11, color: Colors.textTertiary },
  premiumBanner: { borderRadius: Radius.xl, padding: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  premiumLabel: { fontSize: 9, color: 'rgba(10,10,10,0.6)', fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  premiumTitle: { fontSize: 18, color: Colors.textInverse, fontWeight: '700' },
  premiumSub: { fontSize: 11, color: 'rgba(10,10,10,0.6)', marginTop: 2 },
  premiumCta: { backgroundColor: Colors.textInverse, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 10 },
  premiumCtaText: { fontSize: 12, color: Colors.gold, fontWeight: '700' },
});
