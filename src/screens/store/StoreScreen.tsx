import React, { useEffect, useState } from 'react';
import {
  View, Text, Linking, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStoreStore } from '../../store/storeStore';
import { useAuthStore } from '../../store/authStore';
import { CATEGORY_CONFIG, ProductCategory } from '../../types/store';
import { Colors, Spacing, Radius } from '../../theme';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - Spacing.xl * 2 - 12) / 2;

const CATEGORIES = [
  { key: 'all', label: 'Tudo', emoji: '🛍️' },
  { key: 'fantasias', label: 'Fantasias', emoji: '🎭' },
  { key: 'camisetas', label: 'Camisetas', emoji: '👕' },
  { key: 'bones', label: 'Bonés', emoji: '🧢' },
  { key: 'acessorios', label: 'Acessórios', emoji: '🎒' },
  { key: 'colecionaveis', label: 'Colecionáveis', emoji: '🏆' },
  { key: 'premium', label: 'Premium', emoji: '⭐' },
];

export default function StoreScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { products, featuredProducts, activeCategory, searchQuery, isLoading, loadProducts, setCategory, setSearch, getFiltered, getCartCount, toggleFavorite, isFavorite } = useStoreStore();
  const { user } = useAuthStore();

  useEffect(() => { loadProducts(); }, []);

  const filtered = getFiltered();
  const cartCount = getCartCount();
  const fantasias = products.filter(p => p.category === 'fantasias');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Loja Oficial</Text>
          <Text style={styles.headerSub}>Produtos exclusivos da Mancha Verde</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartBtn}>
          <Text style={{ fontSize: 22 }}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Busca */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearch}
            placeholder="Buscar produtos..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: Colors.textMuted, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Banner Destaque */}
        {searchQuery === '' && activeCategory === 'all' && (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl }}>
            <TouchableOpacity
              onPress={() => { setCategory('fantasias'); }}
              activeOpacity={0.9}
            >
              <LinearGradient colors={['#1a0533', '#0d3d1a']} style={styles.heroBanner}>
                <View style={styles.heroBannerAccent} />
                <View style={{ flex: 1 }}>
                  <View style={styles.heroBannerBadge}>
                    <Text style={styles.heroBannerBadgeText}>🎭 NOVO</Text>
                  </View>
                  <Text style={styles.heroBannerTitle}>Fantasias{'\n'}Carnaval 2026</Text>
                  <Text style={styles.heroBannerSub}>Reserve a sua agora</Text>
                  <View style={styles.heroBannerBtn}>
                    <Text style={styles.heroBannerBtnText}>Ver Fantasias →</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 72, opacity: 0.8 }}>🎭</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Categorias */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 8, marginBottom: Spacing.xl }}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setCategory(cat.key)}
              style={[styles.catChip, activeCategory === cat.key && styles.catChipActive]}
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={[styles.catLabel, activeCategory === cat.key && styles.catLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Destaques */}
        {searchQuery === '' && activeCategory === 'all' && featuredProducts.length > 0 && (
          <View style={{ marginBottom: Spacing.xl }}>
            <Text style={styles.sectionTitle}>⭐ Destaques</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 12 }}>
              {featuredProducts.map(product => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                  style={styles.featuredCard}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.featuredImg}>
                    <Text style={{ fontSize: 52 }}>{CATEGORY_CONFIG[product.category].emoji}</Text>
                    {product.originalPrice && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </Text>
                      </View>
                    )}
                    {product.isPremiumOnly && (
                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumBadgeText}>👑 PRO</Text>
                      </View>
                    )}
                  </LinearGradient>
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredName} numberOfLines={2}>{product.name}</Text>
                    <View style={styles.featuredPriceRow}>
                      {product.originalPrice && (
                        <Text style={styles.originalPrice}>R$ {product.originalPrice.toFixed(2)}</Text>
                      )}
                      <Text style={styles.featuredPrice}>R$ {product.price.toFixed(2)}</Text>
                    </View>
                    {product.stock <= 10 && (
                      <Text style={styles.lowStock}>⚠️ Últimas {product.stock} unidades</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Grid de produtos */}
        <View style={{ paddingHorizontal: Spacing.xl }}>
          <Text style={styles.sectionTitle}>
            {activeCategory === 'all' ? '🛍️ Todos os Produtos' : `${CATEGORY_CONFIG[activeCategory as ProductCategory]?.emoji ?? ''} ${CATEGORY_CONFIG[activeCategory as ProductCategory]?.label ?? ''}`}
            <Text style={{ fontSize: 13, color: Colors.textMuted }}> ({filtered.length})</Text>
          </Text>
          <View style={styles.grid}>
            {filtered.map(product => {
              const fav = isFavorite(product.id);
              return (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                  style={styles.gridCard}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.gridImg}>
                    <Text style={{ fontSize: 40 }}>{CATEGORY_CONFIG[product.category].emoji}</Text>
                    {product.originalPrice && (
                      <View style={styles.discountBadgeSmall}>
                        <Text style={styles.discountTextSmall}>
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => toggleFavorite(product.id)}
                      style={styles.favBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={{ fontSize: 16 }}>{fav ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                  <View style={styles.gridInfo}>
                    <Text style={styles.gridName} numberOfLines={2}>{product.name}</Text>
                    {product.originalPrice && (
                      <Text style={styles.gridOriginalPrice}>R$ {product.originalPrice.toFixed(2)}</Text>
                    )}
                    <Text style={styles.gridPrice}>R$ {product.price.toFixed(2)}</Text>
                    {product.isPremiumOnly && (
                      <Text style={styles.gridPremium}>👑 Exclusivo Premium</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>🔍</Text>
              <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
              <Text style={styles.emptySub}>Tente outra busca ou categoria</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontSize: 28, color: Colors.textPrimary, fontWeight: '700' },
  headerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  siteBanner: { marginHorizontal: Spacing.xl, marginBottom: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.lg, padding: 14, gap: 12 },
  siteBannerTitle: { fontSize: 14, color: Colors.primaryBright, fontWeight: '700', marginBottom: 2 },
  siteBannerSub: { fontSize: 11, color: Colors.textSecondary },
  cartBtn: { position: 'relative', padding: 8 },
  cartBadge: { position: 'absolute', top: 2, right: 2, backgroundColor: Colors.red, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, paddingHorizontal: Spacing.base, height: 48, marginHorizontal: Spacing.xl, marginBottom: Spacing.base },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  heroBanner: { borderRadius: Radius.xl, padding: Spacing.xl, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FF408133', position: 'relative', overflow: 'hidden', minHeight: 140 },
  heroBannerAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#FF4081' },
  heroBannerBadge: { backgroundColor: '#FF408122', borderWidth: 1, borderColor: '#FF408144', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 8 },
  heroBannerBadgeText: { fontSize: 10, color: '#FF4081', fontWeight: '700', letterSpacing: 1.5 },
  heroBannerTitle: { fontSize: 24, color: Colors.textPrimary, fontWeight: '700', lineHeight: 28, marginBottom: 4 },
  heroBannerSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 14 },
  heroBannerBtn: { backgroundColor: '#FF408122', borderWidth: 1, borderColor: '#FF408144', borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' },
  heroBannerBtnText: { fontSize: 13, color: '#FF4081', fontWeight: '600' },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgCard },
  catChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  catEmoji: { fontSize: 13 },
  catLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  catLabelActive: { color: Colors.primary, fontWeight: '600' },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', paddingHorizontal: Spacing.xl, marginBottom: Spacing.base },
  featuredCard: { width: W * 0.5, backgroundColor: Colors.bgCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  featuredImg: { height: 160, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  featuredInfo: { padding: Spacing.md },
  featuredName: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginBottom: 6, lineHeight: 18 },
  featuredPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  originalPrice: { fontSize: 11, color: Colors.textMuted, textDecorationLine: 'line-through' },
  featuredPrice: { fontSize: 16, color: Colors.primary, fontWeight: '700' },
  lowStock: { fontSize: 10, color: Colors.red, marginTop: 4 },
  discountBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: Colors.red, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3 },
  discountText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  premiumBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: Colors.goldMuted, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3 },
  premiumBadgeText: { fontSize: 9, color: Colors.gold, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCard: { width: CARD_W, backgroundColor: Colors.bgCard, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  gridImg: { height: 130, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  gridInfo: { padding: Spacing.sm },
  gridName: { fontSize: 12, color: Colors.textPrimary, fontWeight: '500', lineHeight: 17, marginBottom: 4 },
  gridOriginalPrice: { fontSize: 10, color: Colors.textMuted, textDecorationLine: 'line-through' },
  gridPrice: { fontSize: 15, color: Colors.primary, fontWeight: '700' },
  gridPremium: { fontSize: 9, color: Colors.gold, marginTop: 2 },
  discountBadgeSmall: { position: 'absolute', top: 6, left: 6, backgroundColor: Colors.red, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  discountTextSmall: { fontSize: 9, color: '#fff', fontWeight: '700' },
  favBtn: { position: 'absolute', top: 6, right: 6 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
  emptySub: { fontSize: 13, color: Colors.textMuted },
});
