import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useSocioStore } from '../../store/socioStore';
import { supabase } from '../../services/supabase';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const { width: W } = Dimensions.get('window');

const BENEFICIOS_COMPARATIVO = [
  { label: 'Acesso ao app', free: true, premium: true },
  { label: 'Ver feed e Reels', free: true, premium: true },
  { label: 'Agenda de eventos', free: true, premium: true },
  { label: 'Curtir e comentar Reels', free: false, premium: true },
  { label: 'Enviar Cartões da Mancha', free: false, premium: true },
  { label: 'Minha História completa', free: false, premium: true },
  { label: '15% desconto na Loja', free: false, premium: true },
  { label: 'Pré-venda de ingressos', free: false, premium: true },
  { label: 'Pré-venda de fantasias', free: false, premium: true },
  { label: 'Bastidores exclusivos', free: false, premium: true },
  { label: 'Carteirinha digital oficial', free: false, premium: true },
  { label: 'QR Code de identificação', free: false, premium: true },
];

export default function SocioScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { membership } = useSocioStore();
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [daysUntilExpiry, setDaysUntilExpiry] = useState<number | null>(null);
  const isPremium = user?.isPremium ?? false;

  useEffect(() => {
    if (user?.id) {
      useAuthStore.getState().checkMembership(user.id);
      supabase
        .from('memberships')
        .select('expires_at, billing_cycle')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.expires_at) {
            const expiry = new Date(data.expires_at);
            const days = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            setExpiryDate(expiry.toLocaleDateString('pt-BR'));
            setDaysUntilExpiry(days);
            if (days <= 5 && days > 0) {
              Alert.alert(
                '⚠️ Assinatura expirando!',
                `Sua assinatura expira em ${days} dia${days !== 1 ? 's' : ''}. Renove para continuar com todos os benefícios!`,
                [
                  { text: 'Agora não' },
                  { text: 'Renovar', onPress: () => navigation.navigate('Plans') },
                ]
              );
            }
          }
        });
    }
  }, [user?.id]);

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <Image source={require('../../../assets/images/novo-logo.png')} style={styles.headerLogo} resizeMode="contain" />
          <View>
            <Text style={styles.headerTitle}>Sócio Mancha</Text>
            <Text style={styles.headerSub}>Mancha Verde Carnaval</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('MemberCard')} style={styles.carteirinhaBtn}>
            <Text style={styles.carteirinhaBtnText}>🪪 Carteirinha</Text>
          </TouchableOpacity>
        </View>

        {/* STATUS DO PLANO */}
        {isPremium ? (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 20 }}>
            <GlassCard style={{ position: 'relative', overflow: 'hidden' }}>
              <View style={styles.premiumAccent} />
              <View style={styles.premiumHeader}>
                <View style={styles.premiumIconWrap}>
                  <Text style={{ fontSize: 28 }}>💚</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.premiumPlanName}>Mancha Verde eu sou</Text>
                  <View style={styles.activeBadge}>
                    <View style={styles.activeDot} />
                    <Text style={styles.activeText}>ATIVO</Text>
                  </View>
                </View>
                <Text style={styles.memberNum}>{membership.memberNumber}</Text>
              </View>
              {expiryDate && (
                <View style={[styles.expiryRow, { backgroundColor: daysUntilExpiry !== null && daysUntilExpiry <= 5 ? 'rgba(255,90,90,0.1)' : 'rgba(0,255,133,0.08)', borderColor: daysUntilExpiry !== null && daysUntilExpiry <= 5 ? 'rgba(255,90,90,0.3)' : 'rgba(0,255,133,0.2)' }]}>
                  <Text style={[styles.expiryText, { color: daysUntilExpiry !== null && daysUntilExpiry <= 5 ? '#FF5A5A' : Colors.primaryBright }]}>
                    {daysUntilExpiry !== null && daysUntilExpiry <= 5 ? '⚠️' : '📅'} Vence em {expiryDate} · {daysUntilExpiry}d restantes
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Plans')}>
                    <Text style={styles.renewBtn}>Renovar →</Text>
                  </TouchableOpacity>
                </View>
              )}
            </GlassCard>
          </View>
        ) : (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 20 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Plans')} activeOpacity={0.9}>
              <LinearGradient colors={['#0A2E14', '#134227']} style={styles.upgradeCard}>
                <View style={styles.upgradeAccent} />
                <View style={{ flex: 1 }}>
                  <View style={styles.upgradeBadge}>
                    <Text style={styles.upgradeBadgeText}>💚 SEJA MEMBRO</Text>
                  </View>
                  <Text style={styles.upgradeTitle}>{'Torne-se membro\nMancha Verde eu sou'}</Text>
                  <Text style={styles.upgradeSub}>Acesso total · Reels · Cartões · e muito mais</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Image source={require('../../../assets/images/novo-logo.png')} style={{ width: 56, height: 56 }} resizeMode="contain" />
                  <Text style={styles.upgradePrice}>R$ 10/mês</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* COMPARATIVO DE BENEFÍCIOS */}
        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Comparativo de Benefícios</Text>
          <GlassCard noPadding intensity={22}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCol, { flex: 2 }]}>Benefício</Text>
              <Text style={styles.tableHeaderCol}>Free</Text>
              <Text style={[styles.tableHeaderCol, { color: Colors.primaryBright }]}>💚 Membro</Text>
            </View>
            {BENEFICIOS_COMPARATIVO.map((b, i) => (
              <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                <Text style={[styles.tableLabel, { flex: 2 }]}>{b.label}</Text>
                <Text style={[styles.tableCheck, { color: b.free ? Colors.primaryBright : '#FF5A5A' }]}>
                  {b.free ? '✓' : '✕'}
                </Text>
                <Text style={[styles.tableCheck, { color: b.premium ? Colors.primaryBright : '#FF5A5A' }]}>
                  {b.premium ? '✓' : '✕'}
                </Text>
              </View>
            ))}
          </GlassCard>
        </View>

        {/* BOTÃO ASSINAR / GERENCIAR */}
        <View style={{ paddingHorizontal: Spacing.xl }}>
          {isPremium ? (
            <View style={{ gap: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate('Plans')} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
                <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>🔄 Renovar / Trocar plano</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('MemberHistory')} style={styles.outlineBtn}>
                <Text style={styles.outlineBtnText}>📋 Histórico de pagamentos</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Plans')} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
              <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>💚 Assinar por R$10/mês</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 20 },
  headerLogo: { width: 40, height: 40 },
  headerTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '800' },
  headerSub: { fontSize: 11, color: Colors.textMuted },
  carteirinhaBtn: { marginLeft: 'auto' as any, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 7 },
  carteirinhaBtnText: { fontSize: 12, color: Colors.textPrimary, fontWeight: '600' },
  premiumAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primaryBright },
  premiumHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  premiumIconWrap: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  premiumPlanName: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primaryBright },
  activeText: { fontSize: 10, color: Colors.primaryBright, fontWeight: '700', letterSpacing: 1 },
  memberNum: { fontSize: 12, color: Colors.textMuted },
  expiryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 8 },
  expiryText: { fontSize: 12, fontWeight: '600', flex: 1 },
  renewBtn: { fontSize: 12, color: Colors.primaryBright, fontWeight: '700' },
  upgradeCard: { borderRadius: Radius.xl, padding: 22, flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 1, borderColor: 'rgba(0,255,133,0.2)', position: 'relative', overflow: 'hidden' },
  upgradeAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primaryBright },
  upgradeBadge: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 8 },
  upgradeBadgeText: { fontSize: 10, color: Colors.primaryBright, fontWeight: '700', letterSpacing: 1 },
  upgradeTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700', lineHeight: 24, marginBottom: 4 },
  upgradeSub: { fontSize: 12, color: Colors.textSecondary },
  upgradePrice: { fontSize: 13, color: Colors.primaryBright, fontWeight: '700', marginTop: 6 },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 12 },
  tableHeader: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.glassBorder, backgroundColor: 'rgba(0,255,133,0.05)' },
  tableHeaderCol: { flex: 1, fontSize: 11, color: Colors.textMuted, fontWeight: '700', textAlign: 'center', letterSpacing: 0.5 },
  tableRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center' },
  tableRowAlt: { backgroundColor: 'rgba(255,255,255,0.02)' },
  tableLabel: { fontSize: 13, color: Colors.textSecondary },
  tableCheck: { flex: 1, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  actionBtn: { height: 54, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 16, color: Colors.textInverse, fontWeight: '700' },
  outlineBtn: { height: 52, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  outlineBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
});
