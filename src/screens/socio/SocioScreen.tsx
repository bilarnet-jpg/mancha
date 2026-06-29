import React, { useEffect, useState } from 'react';
import {
  View, Text, Alert, Image, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSocioStore } from '../../store/socioStore';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase';
import { PLANS, MOCK_PREMIUM_CONTENT } from '../../types/socio';
import { Colors, Spacing, Radius } from '../../theme';

const { width: W } = Dimensions.get('window');

export default function SocioScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { membership, benefits, history, loadData, getActiveBenefits, getAvailableContent, getPlanConfig, getDaysUntilExpiry, getMemberSince } = useSocioStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      useAuthStore.getState().checkMembership(user.id);
      // Buscar data real de vencimento
      supabase
        .from('memberships')
        .select('expires_at')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.expires_at) {
            const expiry = new Date(data.expires_at);
            const now = new Date();
            const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            setExpiryDate(expiry.toLocaleDateString('pt-BR'));
            setDaysUntilExpiry(days);
            // Alerta se faltar 5 dias ou menos
            if (days <= 5 && days > 0) {
              Alert.alert(
                '⚠️ Assinatura expirando!',
                `Sua assinatura expira em ${days} dia${days !== 1 ? 's' : ''}. Efetue o pagamento para continuar usufruindo dos benefícios!`,
                [
                  { text: 'Agora não' },
                  { text: 'Renovar agora', onPress: () => navigation.navigate('Plans') },
                ]
              );
            }
          }
        });
    }
  }, [user?.id]);

  useEffect(() => { if (user) loadData(user.id); }, [user]);

  const planConfig = getPlanConfig();
  const activeBenefits = getActiveBenefits();
  const availableContent = getAvailableContent();
  const daysLeft = getDaysUntilExpiry();
  const [expiryDate, setExpiryDate] = React.useState<string | null>(null);
  const [daysUntilExpiry, setDaysUntilExpiry] = React.useState<number | null>(null);
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

          {/* Vencimento */}
          {expiryDate && user?.isPremium && (
            <View style={[styles.expiryBadge, { backgroundColor: daysUntilExpiry !== null && daysUntilExpiry <= 5 ? 'rgba(255,90,90,0.15)' : 'rgba(0,255,133,0.1)', borderColor: daysUntilExpiry !== null && daysUntilExpiry <= 5 ? 'rgba(255,90,90,0.4)' : 'rgba(0,255,133,0.3)' }]}>
              <Text style={[styles.expiryText, { color: daysUntilExpiry !== null && daysUntilExpiry <= 5 ? '#FF5A5A' : Colors.primaryBright }]}>
                {daysUntilExpiry !== null && daysUntilExpiry <= 5 ? '⚠️' : '📅'} Vence em {expiryDate} · {daysUntilExpiry}d restantes
              </Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { icon: '📅', val: memberSince, label: 'Membro desde' },
              { icon: '⏳', val: daysUntilExpiry !== null ? `${daysUntilExpiry}d` : `${daysLeft}d`, label: 'Dias restantes' },
              { icon: '🏅', val: activeBenefits.length, label: 'Benefícios' },
            ].map((s, i) => (
              <View key={i} style={[styles.statChip, i === 1 && daysUntilExpiry !== null && daysUntilExpiry <= 5 && { borderColor: 'rgba(255,90,90,0.4)', backgroundColor: 'rgba(255,90,90,0.1)' }]}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={[styles.statVal, { color: i === 1 && daysUntilExpiry !== null && daysUntilExpiry <= 5 ? '#FF5A5A' : planConfig.color }]}>{s.val}</Text>
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
                <Text style={styles.cardPreviewLogo}>💚</Text>
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
              <LinearGradient colors={['#0A2E14', '#134227']} style={styles.upgradeCard}>
                <View style={[styles.upgradeAccent, { backgroundColor: Colors.primaryBright }]} />
                <View style={[styles.upgradeGlow, { backgroundColor: 'rgba(0,255,133,0.08)' }]} />
                <View style={{ flex: 1 }}>
                  <View style={[styles.upgradeBadge, { backgroundColor: 'rgba(0,255,133,0.15)', borderColor: 'rgba(0,255,133,0.3)' }]}>
                    <Text style={[styles.upgradeBadgeText, { color: Colors.primaryBright }]}>💚 SEJA MEMBRO</Text>
                  </View>
                  <Text style={styles.upgradeTitle}>{'Torne-se membro e\ndiga Mancha Verde\nEu Sou'}</Text>
                  <Text style={styles.upgradeSub}>Acesso total · Reels · Cartões · Minha História</Text>
                </View>
                <View style={styles.upgradeRight}>
                  <Image source={require('../../../assets/images/novo-logo.png')} style={{ width: 60, height: 60 }} resizeMode="contain" />
                  <Text style={[styles.upgradePrice, { color: Colors.primaryBright }]}>R$ 10/mês</Text>
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
  expiryBadge: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 7, marginBottom: 12, alignSelf: 'flex-start' },
  expiryText: { fontSize: 12, fontWeight: '600' },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  statusText: { fontSize: 10, color: Colors.primary, fontWeight: '700', letterSpacing: 1.5 },
  memberNum: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: { flex: 1, backgroundColor: 'rgba(0,255,133,0.08)', borderWidth: 1, borderColor: 'rgba(0,255,133,0.15)', borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', gap: 2 },
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
