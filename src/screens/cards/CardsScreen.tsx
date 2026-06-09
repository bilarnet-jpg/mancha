import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCardsStore } from '../../store/cardsStore';
import { useAuthStore } from '../../store/authStore';
import { CARD_CATEGORY_CONFIG, CardCategory } from '../../types/cards';
import { Colors, Spacing, Radius } from '../../theme';

const { width: W } = Dimensions.get('window');

const CATEGORIES = [
  { key: 'all', label: 'Todos', emoji: '💌' },
  { key: 'aniversario', label: 'Aniversário', emoji: '🎂' },
  { key: 'carnaval', label: 'Carnaval', emoji: '🎭' },
  { key: 'homenagem', label: 'Homenagem', emoji: '❤️' },
  { key: 'data_especial', label: 'Datas', emoji: '🎉' },
  { key: 'evento', label: 'Eventos', emoji: '🎤' },
  { key: 'certificado', label: 'Certificados', emoji: '🏅' },
];

export default function CardsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { templates, tributes, activeCategory, myCards, loadTemplates, loadTributes, setCategory, getFilteredTemplates, toggleTributeLike } = useCardsStore();
  const { user } = useAuthStore();

  useEffect(() => { loadTemplates(); loadTributes(); }, []);

  const filtered = getFilteredTemplates();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Cartões da Mancha</Text>
          <Text style={styles.headerSub}>Compartilhe emoção, alegria e axé</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('MyCards')} style={styles.myCardsBtn}>
          <Text style={styles.myCardsBtnText}>Meus Cartões</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* HERO */}
        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}>
          <LinearGradient colors={['#1a0533', '#0d3d1a']} style={styles.heroBanner}>
            <View style={styles.heroBannerAccent} />
            <View style={styles.heroBannerGlow} />
            <View style={{ flex: 1 }}>
              <View style={styles.heroBannerBadge}>
                <Text style={styles.heroBannerBadgeText}>💌 NOVO</Text>
              </View>
              <Text style={styles.heroBannerTitle}>Crie um cartão{'\n'}especial agora</Text>
              <Text style={styles.heroBannerSub}>Templates exclusivos da Mancha Verde</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('CreateCard')}
                style={{ borderRadius: Radius.lg, overflow: 'hidden', alignSelf: 'flex-start', marginTop: Spacing.base }}
              >
                <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.heroBannerBtn}>
                  <Text style={styles.heroBannerBtnText}>Criar Cartão →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 72 }}>💌</Text>
          </LinearGradient>
        </View>

        {/* CATEGORIAS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 8, marginBottom: Spacing.xl }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setCategory(cat.key as CardCategory | 'all')}
              style={[styles.catChip, activeCategory === cat.key && styles.catChipActive]}
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={[styles.catLabel, activeCategory === cat.key && styles.catLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CERTIFICADOS */}
        {(activeCategory === 'all' || activeCategory === 'certificado') && (
          <View style={{ marginBottom: Spacing.xl }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏅 Certificados Digitais</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Certificates')}>
                <Text style={styles.seeAll}>Ver todos →</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Certificates')} style={{ paddingHorizontal: Spacing.xl }} activeOpacity={0.9}>
              <LinearGradient colors={['#1a1000', '#0a0800']} style={styles.certBanner}>
                <View style={styles.certBannerAccent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.certBannerTitle}>Emita certificados{'\n'}oficiais da Mancha</Text>
                  <Text style={styles.certBannerSub}>Participação · Destaque · Embaixador</Text>
                </View>
                <Text style={{ fontSize: 52 }}>🏅</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* TEMPLATES */}
        <View style={{ marginBottom: Spacing.xl }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeCategory === 'all' ? '✨ Templates' : `${CARD_CATEGORY_CONFIG[activeCategory as CardCategory]?.emoji ?? ''} ${CARD_CATEGORY_CONFIG[activeCategory as CardCategory]?.label ?? 'Templates'}`}
            </Text>
            <Text style={styles.countLabel}>{filtered.length} templates</Text>
          </View>
          <View style={styles.templatesGrid}>
            {filtered.map(template => (
              <TouchableOpacity
                key={template.id}
                onPress={() => navigation.navigate('CreateCard', { templateId: template.id })}
                style={styles.templateCard}
                activeOpacity={0.85}
              >
                <LinearGradient colors={template.gradient as any} style={styles.templateGrad}>
                  <View style={[styles.templateAccent, { backgroundColor: template.accentColor }]} />
                  {template.isPremium && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumBadgeText}>👑 PRO</Text>
                    </View>
                  )}
                  <Text style={styles.templateEmoji}>{template.emoji}</Text>
                  <Text style={[styles.templateCat, { color: template.accentColor }]}>
                    {CARD_CATEGORY_CONFIG[template.category]?.label?.toUpperCase()}
                  </Text>
                  <Text style={styles.templateName}>{template.name}</Text>
                </LinearGradient>
                <View style={styles.templateInfo}>
                  <Text style={styles.templateDesc} numberOfLines={1}>{template.description}</Text>
                  <View style={[styles.useBtn, { backgroundColor: `${template.accentColor}22`, borderColor: `${template.accentColor}44` }]}>
                    <Text style={[styles.useBtnText, { color: template.accentColor }]}>Usar →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* MURAL DE HOMENAGENS */}
        {(activeCategory === 'all' || activeCategory === 'homenagem') && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>❤️ Mural de Homenagens</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Tributes')}>
                <Text style={styles.seeAll}>Ver mural →</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: Spacing.xl, gap: 10 }}>
              {tributes.slice(0, 3).map(tribute => (
                <View key={tribute.id} style={styles.tributeCard}>
                  {tribute.isOfficial && <View style={styles.tributeAccent} />}
                  <View style={styles.tributeHeader}>
                    <View style={styles.tributeAvatar}>
                      <Text style={styles.tributeAvatarText}>{tribute.userName.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.tributeAuthor}>{tribute.userName}</Text>
                        {tribute.isOfficial && (
                          <View style={styles.officialBadge}>
                            <Text style={styles.officialBadgeText}>✓ OFICIAL</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.tributeRecipient}>Para: {tribute.recipientName}</Text>
                    </View>
                    <Text style={{ fontSize: 24 }}>{tribute.emoji}</Text>
                  </View>
                  <Text style={styles.tributeMessage}>{tribute.message}</Text>
                  <TouchableOpacity
                    onPress={() => user && toggleTributeLike(tribute.id, user.id)}
                    style={styles.tributeLike}
                  >
                    <Text style={styles.tributeLikeText}>
                      {user && tribute.likes.includes(user.id) ? '❤️' : '🤍'} {tribute.likes.length}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => navigation.navigate('Tributes')}
                style={styles.addTributeBtn}
              >
                <Text style={styles.addTributeBtnText}>+ Adicionar Homenagem</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontSize: 26, color: Colors.textPrimary, fontWeight: '700' },
  headerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  myCardsBtn: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}44`, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 7, marginTop: 4 },
  myCardsBtnText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  heroBanner: { borderRadius: Radius.xl, padding: Spacing.xl, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#9C27B033', position: 'relative', overflow: 'hidden', minHeight: 160 },
  heroBannerAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#9C27B0' },
  heroBannerGlow: { position: 'absolute', top: -40, right: 60, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(156,39,176,0.1)' },
  heroBannerBadge: { backgroundColor: 'rgba(156,39,176,0.2)', borderWidth: 1, borderColor: 'rgba(156,39,176,0.4)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 10 },
  heroBannerBadgeText: { fontSize: 10, color: '#9C27B0', fontWeight: '700', letterSpacing: 1.5 },
  heroBannerTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '700', lineHeight: 28, marginBottom: 4 },
  heroBannerSub: { fontSize: 13, color: Colors.textSecondary },
  heroBannerBtn: { paddingHorizontal: 16, paddingVertical: 10 },
  heroBannerBtnText: { fontSize: 13, color: Colors.textInverse, fontWeight: '700' },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgCard },
  catChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  catEmoji: { fontSize: 13 },
  catLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  catLabelActive: { color: Colors.primary, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, marginBottom: Spacing.base },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
  seeAll: { fontSize: 13, color: Colors.primary },
  countLabel: { fontSize: 12, color: Colors.textMuted },
  certBanner: { borderRadius: Radius.xl, padding: Spacing.xl, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.goldBorder, position: 'relative', overflow: 'hidden' },
  certBannerAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.gold },
  certBannerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700', lineHeight: 24, marginBottom: 4 },
  certBannerSub: { fontSize: 13, color: Colors.textSecondary },
  templatesGrid: { paddingHorizontal: Spacing.xl, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  templateCard: { width: (W - Spacing.xl * 2 - 12) / 2, backgroundColor: Colors.bgCard, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  templateGrad: { height: 160, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  templateAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  premiumBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: Colors.goldMuted, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  premiumBadgeText: { fontSize: 9, color: Colors.gold, fontWeight: '700' },
  templateEmoji: { fontSize: 44, marginBottom: 6 },
  templateCat: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  templateName: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', textAlign: 'center', paddingHorizontal: 8 },
  templateInfo: { padding: Spacing.sm, gap: 8 },
  templateDesc: { fontSize: 11, color: Colors.textMuted },
  useBtn: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  useBtnText: { fontSize: 11, fontWeight: '600' },
  tributeCard: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.base, position: 'relative', overflow: 'hidden' },
  tributeAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primary },
  tributeHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: Spacing.sm },
  tributeAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}33`, alignItems: 'center', justifyContent: 'center' },
  tributeAvatarText: { fontSize: 16, color: Colors.primary, fontWeight: '700' },
  tributeAuthor: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },
  tributeRecipient: { fontSize: 11, color: Colors.textMuted },
  officialBadge: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}33`, borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1 },
  officialBadgeText: { fontSize: 8, color: Colors.primary, fontWeight: '700', letterSpacing: 1 },
  tributeMessage: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.sm },
  tributeLike: { alignSelf: 'flex-start' },
  tributeLikeText: { fontSize: 13, color: Colors.textSecondary },
  addTributeBtn: { backgroundColor: Colors.bgCard, borderWidth: 1.5, borderColor: Colors.border, borderStyle: 'dashed', borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center' },
  addTributeBtnText: { fontSize: 14, color: Colors.textMuted },
});
