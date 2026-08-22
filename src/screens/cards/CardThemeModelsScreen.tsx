import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCardsStore } from '../../store/cardsStore';
import { CARD_CATEGORY_CONFIG, CardCategory } from '../../types/cards';
import { Colors, Spacing, Radius } from '../../theme';

const { width: W } = Dimensions.get('window');

export default function CardThemeModelsScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { category } = route.params as { category: CardCategory };
  const { templates, loadTemplates } = useCardsStore();

  useEffect(() => { loadTemplates(); }, []);

  const filtered = templates.filter(t => t.category === category);
  const catConfig = CARD_CATEGORY_CONFIG[category];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{catConfig?.label ?? 'Modelos'}</Text>
        </View>

        <Text style={styles.subTitle}>Escolha o modelo que combina com sua mensagem</Text>

        <View style={styles.grid}>
          {filtered.map(template => (
            <TouchableOpacity
              key={template.id}
              onPress={() => navigation.navigate('CreateCard', { templateId: template.id })}
              style={styles.card}
              activeOpacity={0.9}
            >
              {template.imageUrl ? (
                <View style={styles.cardGrad}>
                  <Image source={{ uri: template.imageUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                  <View style={styles.imageOverlay} />
                  {template.isPremium && (
                    <View style={styles.premiumBadge}><Text style={{ fontSize: 10 }}>👑</Text></View>
                  )}
                  <Text style={styles.cardName}>{template.name}</Text>
                </View>
              ) : (
                <LinearGradient colors={template.gradient as any} style={styles.cardGrad}>
                  <View style={[styles.accent, { backgroundColor: template.accentColor }]} />
                  {template.isPremium && (
                    <View style={styles.premiumBadge}><Text style={{ fontSize: 10 }}>👑</Text></View>
                  )}
                  <Text style={styles.emoji}>{template.emoji}</Text>
                  <Text style={styles.cardName}>{template.name}</Text>
                </LinearGradient>
              )}
              <View style={styles.cardInfo}>
                <Text style={styles.cardDesc} numberOfLines={2}>{template.description}</Text>
                <View style={[styles.useBtn, { backgroundColor: `${template.accentColor}22`, borderColor: `${template.accentColor}44` }]}>
                  <Text style={[styles.useBtnText, { color: template.accentColor }]}>Usar este modelo →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 36 }}>💌</Text>
            <Text style={styles.emptyText}>Nenhum modelo disponível ainda para este tema.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 6 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '800', flex: 1 },
  subTitle: { fontSize: 13, color: Colors.textSecondary, paddingHorizontal: Spacing.xl, marginBottom: 20 },
  grid: { paddingHorizontal: Spacing.xl, gap: 16 },
  card: { borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.glassBorder },
  cardGrad: { height: 160, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  accent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  premiumBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 48, marginBottom: 10 },
  cardName: { fontSize: 16, color: '#fff', fontWeight: '800', textAlign: 'center', paddingHorizontal: 20 },
  cardInfo: { padding: 16, backgroundColor: Colors.glassLight },
  cardDesc: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },
  useBtn: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1 },
  useBtnText: { fontSize: 12, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 40 },
});
