import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { Colors, Spacing, Radius } from '../theme';

const { width: W } = Dimensions.get('window');

const QUICK = [
  { id: '1', label: 'Sambas', color: Colors.primary, bg: Colors.primaryMuted, emoji: '🎵' },
  { id: '2', label: 'Agenda', color: '#4FC3F7', bg: 'rgba(79,195,247,0.12)', emoji: '📅' },
  { id: '3', label: 'Loja', color: Colors.gold, bg: Colors.goldMuted, emoji: '🛍️' },
  { id: '4', label: 'Ingressos', color: Colors.red, bg: Colors.redMuted, emoji: '🎫' },
  { id: '5', label: 'Galeria', color: '#FF4081', bg: 'rgba(255,64,129,0.12)', emoji: '📸' },
  { id: '6', label: 'Premium', color: Colors.gold, bg: Colors.goldMuted, emoji: '👑' },
];

const EVENTS = [
  { id: '1', day: '15', month: 'JAN', title: 'Ensaio na Quadra', local: 'Rua Cantareira, 520', emoji: '🥁' },
  { id: '2', day: '22', month: 'JAN', title: 'Show de Lançamento', local: 'Sambódromo do Anhembi', emoji: '🎤' },
];

const NEWS = [
  { id: '1', tag: 'CARNAVAL', color: Colors.primary, title: 'Mancha Verde anuncia samba-enredo para 2026', time: 'Há 1 hora' },
  { id: '2', tag: 'PALMEIRAS', color: Colors.primary, title: 'Palmeiras goleia e torcida celebra no Allianz', time: 'Há 3 horas' },
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* HERO */}
        <LinearGradient colors={Colors.gradientHero} style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}, {user?.displayName?.split(' ')[0] ?? 'Torcedor'} 🐍</Text>
              <Text style={styles.heroTitle}>Mancha Verde{'\n'}Paulistana</Text>
            </View>
            <View style={styles.heroRight}>
              <TouchableOpacity onPress={logout} style={styles.avatarBtn}>
                <Text style={styles.avatarText}>{user?.displayName?.charAt(0)?.toUpperCase() ?? 'M'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsRow}>
            {[
              { icon: '🪙', val: user?.coins ?? 50, label: 'Moedas' },
              { icon: '⚡', val: user?.xp ?? 0, label: 'XP' },
              { icon: '🏅', val: 0, label: 'Conquistas' },
            ].map((s, i) => (
              <View key={i} style={styles.statChip}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* MINHA HISTÓRIA */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => navigation.navigate('MinhaHistoria')} activeOpacity={0.9}>
            <LinearGradient colors={['#0d3d1a', '#1a5c2a', '#051a0a']} style={styles.historiaCard}>
              <View style={styles.historiaAccent} />
              <View style={styles.historiaGlow} />
              <View style={{ flex: 1 }}>
                <View style={styles.historiaBadge}>
                  <Text style={styles.historiaBadgeText}>⭐ NOVO</Text>
                </View>
                <Text style={styles.historiaTitle}>Minha História{'\n'}na Mancha</Text>
                <Text style={styles.historiaSub}>"Sua trajetória faz parte{'\n'}da nossa história."</Text>
                <View style={styles.historiaBtn}>
                  <Text style={styles.historiaBtnText}>Construir Minha História →</Text>
                </View>
              </View>
              <View style={styles.historiaEmojis}>
                <Text style={{ fontSize: 32 }}>🎭</Text>
                <Text style={{ fontSize: 24 }}>🏅</Text>
                <Text style={{ fontSize: 28 }}>📅</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* SAMBA DO ANO */}
        <View style={styles.section}>
          <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.sambaCard}>
            <View style={styles.sambaAccent} />
            <View style={styles.sambaBadge}><Text style={styles.sambaBadgeText}>🎵 SAMBA 2025</Text></View>
            <Text style={styles.sambaTitle}>"Do Verde que Sangra,{'\n'}Nasce a Chama"</Text>
            <Text style={styles.sambaComposer}>Grupo Mancha Verde · 2025</Text>
            <TouchableOpacity style={{ borderRadius: Radius.md, overflow: 'hidden', alignSelf: 'flex-start' }}>
              <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sambaPlayBtn}>
                <Text style={styles.sambaPlayText}>▶ Ouvir Samba</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.sambaLogoWrap}>
              <Image source={require('../../assets/images/logo.png')} style={{ width: 70, height: 70 }} resizeMode="contain" />
            </View>
          </LinearGradient>
        </View>

        {/* ACESSO RÁPIDO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso Rápido</Text>
          <View style={styles.quickGrid}>
            {QUICK.map((item, i) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                style={styles.quickCard}
                onPress={() => {
                  if (i === 1) navigation.navigate('AgendaTab');
                  else if (i === 2) navigation.navigate('LojaTab');
                  else if (i === 4) navigation.navigate('ComunidadeTab');
                }}
              >
                <View style={[styles.quickIcon, { backgroundColor: item.bg }]}>
                  <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* PRÓXIMOS EVENTOS */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AgendaTab')}>
              <Text style={styles.seeAll}>Ver agenda →</Text>
            </TouchableOpacity>
          </View>
          {EVENTS.map(event => (
            <View key={event.id} style={styles.eventItem}>
              <View style={styles.eventDate}>
                <Text style={styles.eventDay}>{event.day}</Text>
                <Text style={styles.eventMonth}>{event.month}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>{event.emoji} {event.title}</Text>
                <Text style={styles.eventLocal}>{event.local}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* NOTÍCIAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas Notícias</Text>
          {NEWS.map(news => (
            <View key={news.id} style={styles.newsItem}>
              <View style={[styles.newsTag, { backgroundColor: `${news.color}22`, borderColor: `${news.color}44` }]}>
                <Text style={[styles.newsTagText, { color: news.color }]}>{news.tag}</Text>
              </View>
              <Text style={styles.newsTitle}>{news.title}</Text>
              <Text style={styles.newsTime}>{news.time}</Text>
            </View>
          ))}
        </View>

        {/* PREMIUM */}
        {!user?.isPremium && (
          <View style={[styles.section, { marginBottom: 0 }]}>
            <TouchableOpacity activeOpacity={0.9} style={{ borderRadius: Radius.xl, overflow: 'hidden' }}>
              <LinearGradient colors={Colors.gradientGold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.premiumBanner}>
                <View>
                  <Text style={styles.premiumLabel}>EXCLUSIVO</Text>
                  <Text style={styles.premiumTitle}>Torne-se Premium 👑</Text>
                  <Text style={styles.premiumSub}>Conteúdo exclusivo + sem anúncios</Text>
                </View>
                <View style={styles.premiumCta}>
                  <Text style={styles.premiumCtaText}>Ver planos</Text>
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
  hero: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xl },
  heroRight: { flexDirection: 'row', gap: 10, marginTop: 4 },
  greeting: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  heroTitle: { fontSize: 28, color: Colors.textPrimary, lineHeight: 32, fontWeight: '900' },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0d3d1a', borderWidth: 1.5, borderColor: Colors.goldBorder, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, color: Colors.gold, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: { flex: 1, backgroundColor: '#0d0d0d', borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', gap: 2 },
  statIcon: { fontSize: 14 },
  statVal: { fontSize: 16, color: Colors.primary, fontWeight: '700' },
  statLabel: { fontSize: 10, color: Colors.textMuted },
  section: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xxl },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  seeAll: { fontSize: 13, color: Colors.primary },
  historiaCard: { borderRadius: Radius.xl, padding: Spacing.xl, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: `${Colors.primary}33`, position: 'relative', overflow: 'hidden', minHeight: 160 },
  historiaAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primary },
  historiaGlow: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(0,255,133,0.08)' },
  historiaBadge: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}44`, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 10 },
  historiaBadgeText: { fontSize: 9, color: Colors.primary, fontWeight: '700', letterSpacing: 1.5 },
  historiaTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '700', lineHeight: 26, marginBottom: 6 },
  historiaSub: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 16, fontStyle: 'italic' },
  historiaBtn: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}44`, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 7, alignSelf: 'flex-start' },
  historiaBtnText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  historiaEmojis: { gap: 8, alignItems: 'center' },
  sambaCard: { borderRadius: Radius.xl, borderWidth: 1, borderColor: 'rgba(255,215,0,0.2)', padding: Spacing.xl, overflow: 'hidden', position: 'relative' },
  sambaAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.gold },
  sambaBadge: { backgroundColor: Colors.goldMuted, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.sm, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 12 },
  sambaBadgeText: { fontSize: 11, color: Colors.gold, fontWeight: '600', letterSpacing: 1 },
  sambaTitle: { fontSize: 20, color: Colors.textPrimary, lineHeight: 26, marginBottom: 6, fontWeight: '700' },
  sambaComposer: { fontSize: 12, color: Colors.textMuted, marginBottom: 18 },
  sambaPlayBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, paddingHorizontal: 18 },
  sambaPlayText: { fontSize: 13, color: Colors.textInverse, fontWeight: '700' },
  sambaLogoWrap: { position: 'absolute', right: 14, bottom: 14, opacity: 0.1 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: { width: (W - Spacing.xl * 2 - 20) / 3, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', gap: 8 },
  quickIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 12, color: Colors.textPrimary, fontWeight: '500' },
  eventItem: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.sm },
  eventDate: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.2)', alignItems: 'center', justifyContent: 'center' },
  eventDay: { fontSize: 18, color: Colors.primary, fontWeight: '700', lineHeight: 20 },
  eventMonth: { fontSize: 9, color: Colors.primary, fontWeight: '600', letterSpacing: 1 },
  eventTitle: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginBottom: 2 },
  eventLocal: { fontSize: 11, color: Colors.textMuted },
  newsItem: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.sm },
  newsTag: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 8 },
  newsTagText: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5 },
  newsTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500', lineHeight: 20, marginBottom: 6 },
  newsTime: { fontSize: 11, color: Colors.textMuted },
  premiumBanner: { borderRadius: Radius.xl, padding: Spacing.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  premiumLabel: { fontSize: 9, color: 'rgba(10,10,10,0.6)', fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  premiumTitle: { fontSize: 18, color: Colors.textInverse, fontWeight: '700' },
  premiumSub: { fontSize: 11, color: 'rgba(10,10,10,0.6)', marginTop: 2 },
  premiumCta: { backgroundColor: Colors.textInverse, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 10 },
  premiumCtaText: { fontSize: 12, color: Colors.gold, fontWeight: '700' },
});
