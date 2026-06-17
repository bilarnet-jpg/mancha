import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSocioStore } from '../../store/socioStore';
import { useAuthStore } from '../../store/authStore';
import { PLANS, MOCK_PREMIUM_CONTENT } from '../../types/socio';
import { Colors, Spacing, Radius } from '../../theme';

const { width: W } = Dimensions.get('window');

export default function SocioScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { membership, benefits, history, loadData, getActiveBenefits, getAvailableContent, getPlanConfig, getDaysUntilExpiry, getMemberSince } = useSocioStore();
  const { user } = useAuthStore();

  useEffect(() => { if (user) loadData(user.id); }, [user]);

  const planConfig = getPlanConfig();
  const activeBenefits = getActiveBenefits();
  const availableContent = getAvailableContent();
  const daysLeft = getDaysUntilExpiry();
  const memberSince = getMemberSince();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* HERO */}
        <LinearGradient colors={planConfig.gradient as any} style={styles.hero}>
          <View style={[styles.heroGlow, { backgroundColor: `${planConfig.color}15` }]} />
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>SÓCIO MANCHA</Text>
              <Text style={[styles.heroTitle, { color: planConfig.color }]}>
                {planConfig.emoji} {planConfig.name}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('MemberCard')} style={[styles.cardBtn, { borderColor: `${planConfig.color}44` }]}>
              <Text style={{ fontSize: 18 }}>💳</Text>
              <Text style={[styles.cardBtnText, { color: planConfig.color }]}>Carteirinha</Text>
            </TouchableOpacity>
          </View>

          {/* Status */}
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, { backgroundColor: `${Colors.primary}22`, borderColor: `${Colors.primary}44` }]}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ATIVO</Text>
            </View>
            <Text style={styles.memberNum}>{membership.memberNumber}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { icon: '📅', val: memberSince, label: 'Membro desde' },
              { icon: '⏳', val: `${daysLeft}d`, label: 'Dias restantes' },
              { icon: '🏅', val: activeBenefits.length, label: 'Benefícios' },
            ].map((s, i) => (
              <View key={i} style={styles.statChip}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={[styles.statVal, { color: planConfig.color }]}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* CARTEIRINHA PREVIEW */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => navigation.navigate('MemberCard')} activeOpacity={0.9}>
            <LinearGradient colors={planConfig.gradient as any} style={styles.cardPreview}>
              <View style={[styles.cardPreviewAccent, { backgroundColor: planConfig.color }]} />
              <View style={styles.cardPreviewShine} />
              <View style={styles.cardPreviewTop}>
                <Text style={styles.cardPreviewLogo}>🐍</Text>
                <Text style={styles.cardPreviewOrg}>MANCHA VERDE PAULISTANA</Text>
                <Text style={[styles.cardPreviewPlan, { color: planConfig.color }]}>{planConfig.emoji} {planConfig.name.toUpperCase()}</Text>
              </View>
              <Text style={styles.cardPreviewName}>{user?.displayName ?? 'Torcedor'}</Text>
              <View style={styles.cardPreviewBottom}>
                <View>
                  <Text style={styles.cardPreviewNumLabel}>Nº DO ASSOCIADO</Text>
                  <Text style={[styles.cardPreviewNum, { color: planConfig.color }]}>{membership.memberNumber}</Text>
                </View>
                <View style={styles.cardPreviewQR}>
                  <Text style={{ fontSize: 32 }}>📱</Text>
                </View>
              </View>
              <Text style={styles.cardPreviewHint}>Toque para ver a carteirinha completa →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* BENEFÍCIOS ATIVOS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ Meus Benefícios</Text>
            <Text style={styles.countLabel}>{activeBenefits.length} ativos</Text>
          </View>
          <View style={styles.benefitsGrid}>
            {activeBenefits.map(benefit => (
              <View key={benefit.id} style={styles.benefitCard}>
                <Text style={{ fontSize: 28, marginBottom: 6 }}>{benefit.icon}</Text>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDesc} numberOfLines={2}>{benefit.description}</Text>
                {benefit.discountValue && (
                  <View style={[styles.discountBadge, { backgroundColor: `${planConfig.color}22`, borderColor: `${planConfig.color}44` }]}>
                    <Text style={[styles.discountBadgeText, { color: planConfig.color }]}>-{benefit.discountValue}%</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* CONTEÚDO PREMIUM */}
        {availableContent.length > 0 && (
          <View style={{ marginBottom: Spacing.xl }}>
            <View style={[styles.sectionHeader, { paddingHorizontal: Spacing.xl }]}>
              <Text style={styles.sectionTitle}>🎬 Conteúdo Exclusivo</Text>
              <TouchableOpacity onPress={() => navigation.navigate('PremiumContent')}>
                <Text style={styles.seeAll}>Ver tudo →</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 12 }}>
              {availableContent.map(content => (
                <TouchableOpacity key={content.id} style={styles.contentCard} activeOpacity={0.85}>
                  <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.contentImg}>
                    <Text style={{ fontSize: 36 }}>
                      {content.type === 'video' ? '🎬' : content.type === 'foto' ? '📸' : content.type === 'audio' ? '🎵' : '📄'}
                    </Text>
                    {content.isNew && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>NOVO</Text>
                      </View>
                    )}
                    {content.duration && (
                      <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>{content.duration}</Text>
                      </View>
                    )}
                  </LinearGradient>
                  <View style={styles.contentInfo}>
                    <Text style={styles.contentTitle} numberOfLines={2}>{content.title}</Text>
                    <Text style={styles.contentViews}>👁️ {content.views.toLocaleString('pt-BR')}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* UPGRADE */}
        {membership.plan !== 'diamante' && (
          <View style={styles.section}>
            <TouchableOpacity onPress={() => navigation.navigate('Plans')} activeOpacity={0.9}>
              <LinearGradient colors={['#0d0d2a', '#05050a']} style={styles.upgradeCard}>
                <View style={styles.upgradeAccent} />
                <View style={styles.upgradeGlow} />
                <View style={{ flex: 1 }}>
                  <View style={styles.upgradeBadge}>
                    <Text style={styles.upgradeBadgeText}>💎 UPGRADE DISPONÍVEL</Text>
                  </View>
                  <Text style={styles.upgradeTitle}>Desbloqueie o{'\n'}Mancha Diamante</Text>
                  <Text style={styles.upgradeSub}>20% na loja · Camarote VIP · Meet & Greet</Text>
                </View>
                <View style={styles.upgradeRight}>
                  <Text style={{ fontSize: 52 }}>💎</Text>
                  <Text style={styles.upgradePrice}>R$ 79,90/mês</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* HISTÓRICO */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 Histórico</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MemberHistory')}>
              <Text style={styles.seeAll}>Ver tudo →</Text>
            </TouchableOpacity>
          </View>
          {history.slice(0, 3).map(item => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyDesc}>{item.description}</Text>
                <Text style={styles.historyDate}>{new Date(item.date).toLocaleDateString('pt-BR')}</Text>
              </View>
              {item.value && (
                <Text style={[styles.historyValue, { color: item.value > 0 ? Colors.red : Colors.primary }]}>
                  {item.value > 0 ? `R$ ${item.value.toFixed(2)}` : `-R$ ${Math.abs(item.value).toFixed(2)}`}
                </Text>
              )}
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  hero: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl, paddingTop: Spacing.base, position: 'relative', overflow: 'hidden' },
  heroGlow: { position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: 100 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.base },
  heroLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  heroTitle: { fontSize: 24, fontWeight: '700' },
  cardBtn: { borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.sm, alignItems: 'center', gap: 4 },
  cardBtnText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.base },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  statusText: { fontSize: 10, color: Colors.primary, fontWeight: '700', letterSpacing: 1.5 },
  memberNum: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', gap: 2 },
  statIcon: { fontSize: 14 },
  statVal: { fontSize: 13, fontWeight: '700' },
  statLabel: { fontSize: 9, color: Colors.textMuted, letterSpacing: 0.3, textAlign: 'center' },
  section: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xxl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
  countLabel: { fontSize: 12, color: Colors.textMuted },
  seeAll: { fontSize: 13, color: Colors.primary },
  cardPreview: { borderRadius: Radius.xl, padding: Spacing.xl, position: 'relative', overflow: 'hidden', minHeight: 180 },
  cardPreviewAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  cardPreviewShine: { position: 'absolute', top: -100, right: -100, width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(255,255,255,0.03)' },
  cardPreviewTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.xl },
  cardPreviewLogo: { fontSize: 20 },
  cardPreviewOrg: { flex: 1, fontSize: 10, color: Colors.textMuted, fontWeight: '700', letterSpacing: 1 },
  cardPreviewPlan: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  cardPreviewName: { fontSize: 22, color: Colors.textPrimary, fontWeight: '700', marginBottom: Spacing.xl },
  cardPreviewBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  cardPreviewNumLabel: { fontSize: 9, color: Colors.textMuted, letterSpacing: 2, marginBottom: 4 },
  cardPreviewNum: { fontSize: 15, fontWeight: '700', letterSpacing: 2 },
  cardPreviewQR: { width: 52, height: 52, borderRadius: Radius.md, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  cardPreviewHint: { fontSize: 11, color: Colors.textMuted, textAlign: 'right' },
  benefitsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  benefitCard: { width: (W - Spacing.xl * 2 - 10) / 2, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base },
  benefitTitle: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
  benefitDesc: { fontSize: 11, color: Colors.textMuted, lineHeight: 16, marginBottom: 6 },
  discountBadge: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  discountBadgeText: { fontSize: 11, fontWeight: '700' },
  contentCard: { width: W * 0.55, backgroundColor: Colors.bgCard, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  contentImg: { height: 140, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  newBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: Colors.red, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  newBadgeText: { fontSize: 9, color: '#fff', fontWeight: '700', letterSpacing: 1 },
  durationBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  durationText: { fontSize: 10, color: Colors.textPrimary, fontWeight: '500' },
  contentInfo: { padding: Spacing.sm },
  contentTitle: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', lineHeight: 18, marginBottom: 4 },
  contentViews: { fontSize: 11, color: Colors.textMuted },
  upgradeCard: { borderRadius: Radius.xl, padding: Spacing.xl, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#818CF833', position: 'relative', overflow: 'hidden' },
  upgradeAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#818CF8' },
  upgradeGlow: { position: 'absolute', top: -40, right: 40, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(129,140,248,0.08)' },
  upgradeBadge: { backgroundColor: 'rgba(129,140,248,0.15)', borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 10 },
  upgradeBadgeText: { fontSize: 10, color: '#818CF8', fontWeight: '700', letterSpacing: 1 },
  upgradeTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', lineHeight: 26, marginBottom: 6 },
  upgradeSub: { fontSize: 12, color: Colors.textSecondary },
  upgradeRight: { alignItems: 'center', gap: 6 },
  upgradePrice: { fontSize: 12, color: '#818CF8', fontWeight: '600' },
  historyItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.sm },
  historyIcon: { width: 44, height: 44, borderRadius: Radius.md, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  historyTitle: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginBottom: 2 },
  historyDesc: { fontSize: 11, color: Colors.textSecondary, marginBottom: 2 },
  historyDate: { fontSize: 10, color: Colors.textMuted },
  historyValue: { fontSize: 14, fontWeight: '700', alignSelf: 'flex-start' },
});
