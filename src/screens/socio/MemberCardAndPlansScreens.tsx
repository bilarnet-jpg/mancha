import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Share, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { useSocioStore } from '../../store/socioStore';
import { useAuthStore } from '../../store/authStore';
import { PLANS, MembershipPlan } from '../../types/socio';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const { width: W } = Dimensions.get('window');

// ── MEMBER CARD ───────────────────────────────────────────────
export function MemberCardScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { membership, getPlanConfig, getDaysUntilExpiry } = useSocioStore();
  const { user } = useAuthStore();
  const [showBack, setShowBack] = useState(false);
  const planConfig = getPlanConfig();
  const daysLeft = getDaysUntilExpiry();

  const handleShare = async () => {
    await Share.share({
      title: 'Minha Carteirinha Sócio Mancha',
      message: `💚 Sócio Mancha Verde Carnaval\n\n👑 Plano: ${planConfig.name}\n🪪 Nº: ${membership.memberNumber}\n👤 ${user?.displayName}\n\nOrgulho de ser Mancha! 💚`,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={[cardStyles.scroll, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.xl }}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={cardStyles.pageTitle}>💳 Carteirinha Digital</Text>
        <Text style={cardStyles.pageSub}>Sua identidade oficial na Mancha Verde</Text>

        {/* TOGGLE FRENTE/VERSO */}
        <View style={cardStyles.toggleRow}>
          <TouchableOpacity onPress={() => setShowBack(false)} style={[cardStyles.toggleBtn, !showBack && cardStyles.toggleBtnActive]}>
            <Text style={[cardStyles.toggleText, !showBack && cardStyles.toggleTextActive]}>Frente</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowBack(true)} style={[cardStyles.toggleBtn, showBack && cardStyles.toggleBtnActive]}>
            <Text style={[cardStyles.toggleText, showBack && cardStyles.toggleTextActive]}>Verso</Text>
          </TouchableOpacity>
        </View>

        {/* CARTEIRINHA */}
        <TouchableOpacity onPress={() => setShowBack(!showBack)} activeOpacity={0.95} style={cardStyles.cardWrap}>
          {!showBack ? (
            // FRENTE
            <LinearGradient colors={planConfig.gradient as any} style={cardStyles.card}>
              <View style={[cardStyles.cardAccent, { backgroundColor: planConfig.color }]} />
              {/* Brilho */}
              <View style={cardStyles.shine1} />
              <View style={cardStyles.shine2} />
              {/* Header */}
              <View style={cardStyles.cardHeader}>
                <View>
                  <Text style={cardStyles.cardOrg}>MANCHA VERDE CARNAVAL</Text>
                  <Text style={cardStyles.cardSub}>Programa Sócio Mancha</Text>
                </View>
                <Text style={{ fontSize: 28 }}>💚</Text>
              </View>
              {/* Plan badge */}
              <View style={[cardStyles.planBadge, { backgroundColor: `${planConfig.color}22`, borderColor: `${planConfig.color}66` }]}>
                <Text style={[cardStyles.planBadgeText, { color: planConfig.color }]}>
                  {planConfig.emoji} {planConfig.name.toUpperCase()}
                </Text>
              </View>
              {/* Foto + Nome */}
              <View style={cardStyles.memberRow}>
                <LinearGradient
                  colors={planConfig.gradient as any}
                  style={cardStyles.memberAvatar}
                >
                  <View style={cardStyles.memberAvatarInner}>
                    <Text style={cardStyles.memberAvatarText}>
                      {user?.displayName?.charAt(0)?.toUpperCase() ?? 'M'}
                    </Text>
                  </View>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={cardStyles.cardNameLabel}>NOME DO ASSOCIADO</Text>
                  <Text style={cardStyles.cardName}>{user?.displayName?.toUpperCase() ?? 'TORCEDOR'}</Text>
                  {user?.email && (
                    <Text style={cardStyles.cardEmail} numberOfLines={1}>{user.email}</Text>
                  )}
                </View>
              </View>
              {/* Info */}
              <View style={cardStyles.cardInfo}>
                <View>
                  <Text style={cardStyles.cardInfoLabel}>NÚMERO DO ASSOCIADO</Text>
                  <Text style={[cardStyles.cardInfoValue, { color: planConfig.color }]}>{membership.memberNumber}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={cardStyles.cardInfoLabel}>VALIDADE</Text>
                  <Text style={cardStyles.cardInfoValue}>{new Date(membership.expiryDate).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })}</Text>
                </View>
              </View>
              {/* Chip decorativo */}
              <View style={[cardStyles.chip, { borderColor: `${planConfig.color}44` }]}>
                <View style={cardStyles.chipLines}>
                  {[0,1,2].map(i => <View key={i} style={[cardStyles.chipLine, { backgroundColor: `${planConfig.color}66` }]} />)}
                </View>
              </View>
              <Text style={cardStyles.cardHint}>Toque para ver o verso</Text>
            </LinearGradient>
          ) : (
            // VERSO
            <LinearGradient colors={planConfig.gradient as any} style={cardStyles.card}>
              {/* Watermark logo de fundo */}
              <View style={[cardStyles.cardAccent, { backgroundColor: planConfig.color }]} />
              {/* Tarja magnética */}
              <View style={cardStyles.magneticStripe} />
              {/* QR Code */}
              <View style={cardStyles.qrSection}>
                <View style={cardStyles.qrBox}>
                  <QRCode
                    value={`MANCHA:${membership.qrCode}:${user?.id ?? 'guest'}:${encodeURIComponent(user?.displayName ?? 'Socio')}`}
                    size={88}
                    color="#FFFFFF"
                    backgroundColor="transparent"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={cardStyles.qrTitle}>QR Code de Identificação</Text>
                  <Text style={cardStyles.qrSub}>Apresente na entrada de eventos e estabelecimentos parceiros</Text>
                  <Text style={[cardStyles.qrCode, { color: planConfig.color }]}>{membership.qrCode}</Text>
                </View>
              </View>
              {/* Benefícios resumo */}
              <View style={cardStyles.backBenefits}>
                <Text style={cardStyles.backBenefitsTitle}>BENEFÍCIOS ATIVOS</Text>
                <Text style={[cardStyles.backBenefitsValue, { color: planConfig.color }]}>
                  {planConfig.discountStore > 0 ? `${planConfig.discountStore}% na Loja · ` : ''}{planConfig.discountEvents > 0 ? `${planConfig.discountEvents}% em Eventos` : 'Acesso Básico'}
                </Text>
              </View>
              {/* Footer */}
              <View style={cardStyles.cardFooter}>
                <Text style={cardStyles.footerText}>Mancha Verde Carnaval · manchacarnaval.app</Text>
                <Text style={[cardStyles.footerValid, { color: planConfig.color }]}>Status: ATIVO · {daysLeft}d restantes</Text>
              </View>
            </LinearGradient>
          )}
        </TouchableOpacity>

        {/* AÇÕES */}
        <View style={cardStyles.actions}>
          <TouchableOpacity onPress={handleShare} style={{ flex: 1, borderRadius: Radius.lg, overflow: 'hidden' }}>
            <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={cardStyles.actionBtn}>
              <Text style={cardStyles.actionBtnText}>📤 Compartilhar</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Download', 'Funcionalidade de download em breve!')} style={[cardStyles.outlineBtn, { borderColor: planConfig.color }]}>
            <Text style={[cardStyles.outlineBtnText, { color: planConfig.color }]}>⬇️ Salvar</Text>
          </TouchableOpacity>
        </View>

        {/* INFO ADICIONAL */}
        <View style={cardStyles.infoCard}>
          <View style={[cardStyles.infoAccent, { backgroundColor: planConfig.color }]} />
          <Text style={cardStyles.infoTitle}>Informações do Plano</Text>
          {[
            { label: 'Plano', value: planConfig.name },
            { label: 'Status', value: 'Ativo' },
            { label: 'Início', value: new Date(membership.startDate).toLocaleDateString('pt-BR') },
            { label: 'Vencimento', value: new Date(membership.expiryDate).toLocaleDateString('pt-BR') },
            { label: 'Renovação', value: membership.autoRenew ? 'Automática' : 'Manual' },
            { label: 'Membro desde', value: new Date(membership.joinedAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) },
          ].map((item, i) => (
            <View key={i} style={cardStyles.infoRow}>
              <Text style={cardStyles.infoLabel}>{item.label}</Text>
              <Text style={cardStyles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ── PLANS ─────────────────────────────────────────────────────
export function PlansScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const isPremium = user?.isPremium ?? false;

  const monthlyPrice = 10;
  const yearlyPrice = 100;
  const yearlyMonthly = (yearlyPrice / 12).toFixed(2);
  const savings = ((monthlyPrice * 12) - yearlyPrice);

  const FEATURES = [
    { emoji: '🎬', label: 'Curtir e comentar nos Reels' },
    { emoji: '💌', label: 'Enviar Cartões da Mancha' },
    { emoji: '🎭', label: 'Minha História completa' },
    { emoji: '🛍️', label: '15% de desconto na Loja' },
    { emoji: '🎟️', label: 'Pré-venda de ingressos' },
    { emoji: '🎭', label: 'Pré-venda de fantasias' },
    { emoji: '🎬', label: 'Bastidores exclusivos' },
    { emoji: '🪪', label: 'Carteirinha digital oficial' },
    { emoji: '📷', label: 'QR Code de identificação' },
    { emoji: '🏅', label: 'Badge exclusivo no perfil' },
  ];

  const FREE_RESTRICTIONS = [
    { emoji: '🔒', label: 'Não pode curtir/comentar Reels' },
    { emoji: '🔒', label: 'Não pode enviar Cartões da Mancha' },
    { emoji: '🔒', label: 'Minha História limitada' },
    { emoji: '🔒', label: 'Sem descontos na Loja' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>

        {/* HEADER */}
        <View style={planStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={planStyles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={planStyles.headerTitle}>Planos</Text>
            <Text style={planStyles.headerSub}>Mancha Verde Carnaval</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl }}>

          {/* HERO */}
          <View style={planStyles.hero}>
            <Text style={{ fontSize: 52, marginBottom: 12 }}>💚</Text>
            <Text style={planStyles.heroTitle}>{'Mancha Verde\neu sou'}</Text>
            <Text style={planStyles.heroSub}>Acesso total ao app + todos os benefícios exclusivos do verdadeiro torcedor da Mancha Verde!</Text>
          </View>

          {/* TOGGLE MENSAL/ANUAL */}
          <View style={planStyles.cycleToggle}>
            <TouchableOpacity
              onPress={() => setBillingCycle('monthly')}
              style={[planStyles.cycleBtn, billingCycle === 'monthly' && planStyles.cycleBtnActive]}
            >
              <Text style={[planStyles.cycleBtnText, billingCycle === 'monthly' && planStyles.cycleBtnTextActive]}>Mensal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBillingCycle('yearly')}
              style={[planStyles.cycleBtn, billingCycle === 'yearly' && planStyles.cycleBtnActive]}
            >
              <Text style={[planStyles.cycleBtnText, billingCycle === 'yearly' && planStyles.cycleBtnTextActive]}>Anual</Text>
              <View style={planStyles.savingsBadge}>
                <Text style={planStyles.savingsBadgeText}>-{Math.round((savings / (monthlyPrice * 12)) * 100)}%</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* CARD DO PLANO */}
          <View style={planStyles.planCard}>
            <LinearGradient colors={['#134227', '#0A1F14']} style={StyleSheet.absoluteFillObject} />
            <View style={planStyles.planCardAccent} />
            <View style={planStyles.planCardGlow} />

            <View style={planStyles.priceRow}>
              <Text style={planStyles.currency}>R$</Text>
              <Text style={planStyles.price}>
                {billingCycle === 'monthly' ? monthlyPrice : yearlyMonthly}
              </Text>
              <Text style={planStyles.pricePeriod}>/mês</Text>
            </View>

            {billingCycle === 'yearly' && (
              <View style={planStyles.yearlyInfo}>
                <Text style={planStyles.yearlyInfoText}>
                  Cobrado R${yearlyPrice}/ano · Economia de R${savings}!
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                if (isPremium) return;
                navigation.navigate('PixPaymentSocio', { billingCycle, amount: billingCycle === 'monthly' ? monthlyPrice : yearlyPrice });
              }}
              style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: 20 }}
            >
              <LinearGradient colors={isPremium ? ['#134227', '#0A1F14'] : Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={planStyles.subscribeBtn}>
                <Text style={planStyles.subscribeBtnText}>
                  {isPremium ? '✓ Plano Ativo' : `💚 Assinar por R$${billingCycle === 'monthly' ? monthlyPrice + '/mês' : yearlyPrice + '/ano'}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={planStyles.cancelText}>Cancele quando quiser · Sem taxa</Text>
          </View>

          {/* BENEFÍCIOS */}
          <Text style={planStyles.sectionTitle}>✅ O que você ganha</Text>
          <GlassCard style={{ marginBottom: 24, gap: 12 }}>
            {FEATURES.map((f, i) => (
              <View key={i} style={planStyles.featureRow}>
                <View style={planStyles.featureIcon}>
                  <Text style={{ fontSize: 16 }}>{f.emoji}</Text>
                </View>
                <Text style={planStyles.featureLabel}>{f.label}</Text>
                <Text style={{ color: Colors.primaryBright, fontSize: 16 }}>✓</Text>
              </View>
            ))}
          </GlassCard>

          {/* RESTRIÇÕES FREE */}
          <Text style={planStyles.sectionTitle}>🔒 Plano Free (limitado)</Text>
          <GlassCard style={{ marginBottom: 24, gap: 12, borderColor: 'rgba(255,90,90,0.2)' }}>
            {FREE_RESTRICTIONS.map((f, i) => (
              <View key={i} style={planStyles.featureRow}>
                <View style={[planStyles.featureIcon, { backgroundColor: 'rgba(255,90,90,0.1)' }]}>
                  <Text style={{ fontSize: 16 }}>{f.emoji}</Text>
                </View>
                <Text style={[planStyles.featureLabel, { color: Colors.textMuted }]}>{f.label}</Text>
                <Text style={{ color: '#FF5A5A', fontSize: 14 }}>✕</Text>
              </View>
            ))}
          </GlassCard>

        </View>
      </ScrollView>
    </View>
  );
}


export function PremiumContentScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { getAvailableContent, canAccessContent } = useSocioStore();
  const available = getAvailableContent();

  const TYPE_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
    video: { label: 'Vídeo', emoji: '🎬', color: '#FF4081' },
    foto: { label: 'Galeria', emoji: '📸', color: '#4FC3F7' },
    audio: { label: 'Áudio', emoji: '🎵', color: Colors.primary },
    documento: { label: 'Documento', emoji: '📄', color: Colors.gold },
    bastidores: { label: 'Bastidores', emoji: '🎭', color: '#9C27B0' },
  };

  return (
    <View style={[{ flex: 1, backgroundColor: Colors.bg }, { paddingTop: insets.top }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.base }}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: Colors.textPrimary, fontWeight: '700' }}>🎬 Conteúdo Exclusivo</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 100 }}>
        {available.map(content => {
          const typeCfg = TYPE_CONFIG[content.type] ?? TYPE_CONFIG.video;
          return (
            <TouchableOpacity key={content.id} style={pcStyles.card} activeOpacity={0.85}>
              <LinearGradient colors={['#0d3d1a', '#051a0a']} style={pcStyles.thumb}>
                <Text style={{ fontSize: 44 }}>{typeCfg.emoji}</Text>
                {content.isNew && (
                  <View style={pcStyles.newBadge}><Text style={pcStyles.newBadgeText}>NOVO</Text></View>
                )}
                {content.duration && (
                  <View style={pcStyles.duration}><Text style={pcStyles.durationText}>{content.duration}</Text></View>
                )}
                <View style={[pcStyles.typeBadge, { backgroundColor: `${typeCfg.color}22`, borderColor: `${typeCfg.color}44` }]}>
                  <Text style={[pcStyles.typeBadgeText, { color: typeCfg.color }]}>{typeCfg.label.toUpperCase()}</Text>
                </View>
              </LinearGradient>
              <View style={pcStyles.info}>
                <Text style={pcStyles.title}>{content.title}</Text>
                <Text style={pcStyles.desc} numberOfLines={2}>{content.description}</Text>
                <View style={pcStyles.meta}>
                  <Text style={pcStyles.metaText}>👁️ {content.views.toLocaleString('pt-BR')} visualizações</Text>
                  <Text style={pcStyles.metaText}>{new Date(content.publishedAt).toLocaleDateString('pt-BR')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        {available.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 80, gap: 10 }}>
            <Text style={{ fontSize: 48 }}>🔒</Text>
            <Text style={{ fontSize: 16, color: Colors.textPrimary, fontWeight: '700' }}>Conteúdo bloqueado</Text>
            <Text style={{ fontSize: 13, color: Colors.textMuted, textAlign: 'center' }}>Faça upgrade do plano para acessar conteúdos exclusivos</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ── HISTORY ───────────────────────────────────────────────────
export function MemberHistoryScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { history } = useSocioStore();

  return (
    <View style={[{ flex: 1, backgroundColor: Colors.bg }, { paddingTop: insets.top }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: Spacing.base }}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: Colors.textPrimary, fontWeight: '700' }}>📋 Histórico</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 100 }}>
        {history.map(item => (
          <View key={item.id} style={histStyles.item}>
            <View style={histStyles.iconWrap}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={histStyles.title}>{item.title}</Text>
              <Text style={histStyles.desc}>{item.description}</Text>
              <Text style={histStyles.date}>{new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
            </View>
            {item.value && (
              <Text style={[histStyles.value, { color: item.value > 0 ? Colors.red : Colors.primary }]}>
                {item.value > 0 ? `R$ ${item.value.toFixed(2)}` : `-R$ ${Math.abs(item.value).toFixed(2)}`}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: 60 },
  pageTitle: { fontSize: 26, color: Colors.textPrimary, fontWeight: '700', marginBottom: 6 },
  pageSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: Spacing.xl },
  toggleRow: { flexDirection: 'row', backgroundColor: Colors.bgCard, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, padding: 4, marginBottom: Spacing.xl, alignSelf: 'center' },
  toggleBtn: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: Radius.full },
  toggleBtnActive: { backgroundColor: Colors.primary },
  toggleText: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  toggleTextActive: { color: Colors.textInverse },
  cardWrap: { marginBottom: Spacing.xl },
  card: { borderRadius: Radius.xl, padding: Spacing.xl, position: 'relative', overflow: 'hidden', minHeight: 220 },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  shine1: { position: 'absolute', top: -80, right: -80, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.04)' },
  shine2: { position: 'absolute', bottom: -60, left: -60, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.02)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.base },
  cardOrg: { fontSize: 10, color: Colors.textMuted, fontWeight: '700', letterSpacing: 1.5 },
  cardSub: { fontSize: 9, color: Colors.textMuted, marginTop: 2 },
  planBadge: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: Spacing.base },
  planBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  memberAvatar: { width: 56, height: 56, borderRadius: 28, padding: 2 },
  memberAvatarInner: { flex: 1, borderRadius: 26, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  memberAvatarText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  cardNameLabel: { fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, fontWeight: '600', marginBottom: 3 },
  cardName: { fontSize: 24, color: Colors.textPrimary, fontWeight: '700', letterSpacing: 2, marginBottom: Spacing.xl },
  cardInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  cardEmail: { fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  cardInfoLabel: { fontSize: 9, color: Colors.textMuted, letterSpacing: 2, marginBottom: 4 },
  cardInfoValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', letterSpacing: 1 },
  chip: { width: 44, height: 32, borderRadius: 6, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', paddingHorizontal: 6, marginBottom: 6 },
  chipLines: { gap: 4 },
  chipLine: { height: 1, borderRadius: 1 },
  cardHint: { fontSize: 10, color: Colors.textMuted, textAlign: 'right' },
  magneticStripe: { height: 44, backgroundColor: 'rgba(0,0,0,0.5)', marginHorizontal: -Spacing.xl, marginBottom: Spacing.xl },
  qrSection: { flexDirection: 'row', gap: 14, alignItems: 'flex-start', marginBottom: Spacing.base },
  qrBox: { width: 100, height: 100, borderRadius: Radius.lg, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  qrTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', marginBottom: 6 },
  qrSub: { fontSize: 11, color: Colors.textSecondary, lineHeight: 16, marginBottom: 8 },
  qrCode: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  backBenefits: { marginBottom: Spacing.xl },
  backBenefitsTitle: { fontSize: 9, color: Colors.textMuted, letterSpacing: 2, marginBottom: 4 },
  backBenefitsValue: { fontSize: 13, fontWeight: '600' },
  cardFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: Spacing.sm },
  footerText: { fontSize: 9, color: Colors.textMuted, marginBottom: 2 },
  footerValid: { fontSize: 10, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12, marginBottom: Spacing.xl },
  actionBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  outlineBtn: { height: 52, flex: 0.5, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: Radius.lg },
  outlineBtnText: { fontSize: 14, fontWeight: '600' },
  infoCard: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.xl, position: 'relative', overflow: 'hidden' },
  infoAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  infoTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoLabel: { fontSize: 13, color: Colors.textSecondary },
  infoValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
});

const planStyles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800' },
  headerSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  hero: { alignItems: 'center', paddingVertical: 24, marginBottom: 8 },
  heroTitle: { fontSize: 32, color: Colors.textPrimary, fontWeight: '900', textAlign: 'center', lineHeight: 36, marginBottom: 12, letterSpacing: -0.5 },
  heroSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  cycleToggle: { flexDirection: 'row', backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.full, padding: 4, marginBottom: 20 },
  cycleBtn: { flex: 1, paddingVertical: 10, borderRadius: Radius.full, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  cycleBtnActive: { backgroundColor: Colors.primaryBright },
  cycleBtnText: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  cycleBtnTextActive: { color: Colors.textInverse },
  savingsBadge: { backgroundColor: '#FF4081', borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2 },
  savingsBadgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  planCard: { borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', padding: 28, alignItems: 'center', marginBottom: 28, position: 'relative' },
  planCardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primaryBright },
  planCardGlow: { position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(0,255,133,0.08)' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 8 },
  currency: { fontSize: 22, color: Colors.textSecondary, fontWeight: '600', marginBottom: 8 },
  price: { fontSize: 64, color: Colors.primaryBright, fontWeight: '900', lineHeight: 68, letterSpacing: -2 },
  pricePeriod: { fontSize: 16, color: Colors.textMuted, marginBottom: 12 },
  yearlyInfo: { backgroundColor: 'rgba(0,255,133,0.1)', borderWidth: 1, borderColor: 'rgba(0,255,133,0.2)', borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6 },
  yearlyInfoText: { fontSize: 12, color: Colors.primaryBright, fontWeight: '600' },
  subscribeBtn: { height: 54, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center' },
  subscribeBtnText: { fontSize: 16, color: Colors.textInverse, fontWeight: '700' },
  cancelText: { fontSize: 11, color: Colors.textMuted, marginTop: 12 },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  featureLabel: { flex: 1, fontSize: 14, color: Colors.textPrimary },
});


const pcStyles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.base },
  thumb: { height: 160, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  newBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: Colors.red, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  newBadgeText: { fontSize: 9, color: '#fff', fontWeight: '700', letterSpacing: 1 },
  duration: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  durationText: { fontSize: 10, color: Colors.textPrimary },
  typeBadge: { position: 'absolute', top: 10, right: 10, borderWidth: 1, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  typeBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  info: { padding: Spacing.base },
  title: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
  desc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  metaText: { fontSize: 11, color: Colors.textMuted },
});

const histStyles = StyleSheet.create({
  item: { flexDirection: 'row', gap: 12, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.sm },
  iconWrap: { width: 44, height: 44, borderRadius: Radius.md, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginBottom: 2 },
  desc: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  date: { fontSize: 10, color: Colors.textMuted },
  value: { fontSize: 14, fontWeight: '700', alignSelf: 'flex-start' },
});
