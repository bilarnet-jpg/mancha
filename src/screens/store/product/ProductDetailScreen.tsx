import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStoreStore } from '../../../store/storeStore';
import { CATEGORY_CONFIG, MOCK_PRODUCTS } from '../../../types/store';
import { Colors, Spacing, Radius } from '../../../theme';

const { width: W } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }: any) {
  const { productId } = route.params;
  const insets = useSafeAreaInsets();
  const { addToCart, toggleFavorite, isFavorite, getCartCount } = useStoreStore();
  const product = MOCK_PRODUCTS.find(p => p.id === productId);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const cartCount = getCartCount();

  if (!product) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Colors.textMuted }}>Produto não encontrado.</Text>
      </View>
    );
  }

  const cat = CATEGORY_CONFIG[product.category];
  const fav = isFavorite(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      Alert.alert('Selecione um tamanho', 'Por favor selecione o tamanho antes de adicionar ao carrinho.');
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    Alert.alert('✅ Adicionado!', `${product.name} foi adicionado ao carrinho.`, [
      { text: 'Continuar', style: 'cancel' },
      { text: 'Ver Carrinho', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const related = MOCK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Imagem hero */}
        <View style={styles.hero}>
          <LinearGradient colors={['#0d3d1a', '#1a5c2a', '#051a0a']} style={StyleSheet.absoluteFillObject} />
          <Text style={{ fontSize: 110, opacity: 0.8 }}>{cat.emoji}</Text>
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
          {product.isPremiumOnly && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>👑 EXCLUSIVO PREMIUM</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: insets.top + 12 }]}>
            <Text style={{ fontSize: 18, color: Colors.textPrimary }}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={[styles.cartBtn, { top: insets.top + 12 }]}>
            <Text style={{ fontSize: 20 }}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Categoria */}
          <View style={[styles.catBadge, { backgroundColor: `${cat.color}22`, borderColor: `${cat.color}44` }]}>
            <Text style={[styles.catBadgeText, { color: cat.color }]}>{cat.emoji} {cat.label.toUpperCase()}</Text>
          </View>

          {/* Nome e preço */}
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.priceRow}>
            <View>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>R$ {product.originalPrice.toFixed(2)}</Text>
              )}
              <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(product.id)} style={styles.favBtn}>
              <Text style={{ fontSize: 28 }}>{fav ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          {/* Estoque */}
          <View style={[styles.stockBadge, { backgroundColor: product.stock > 10 ? Colors.primaryMuted : Colors.redMuted, borderColor: product.stock > 10 ? `${Colors.primary}44` : `${Colors.red}44` }]}>
            <Text style={[styles.stockText, { color: product.stock > 10 ? Colors.primary : Colors.red }]}>
              {product.stock > 10 ? `✅ Em estoque (${product.stock} unidades)` : product.stock > 0 ? `⚠️ Últimas ${product.stock} unidades!` : '❌ Esgotado'}
            </Text>
          </View>

          {/* Tamanhos */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tamanho</Text>
              <View style={styles.sizesRow}>
                {product.sizes.map(size => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    style={[styles.sizeChip, selectedSize === size && styles.sizeChipActive]}
                  >
                    <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.sizeGuide}>
                <Text style={styles.sizeGuideText}>📏 Guia de medidas</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Cores */}
          {product.colors && product.colors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cor</Text>
              <View style={styles.colorsRow}>
                {product.colors.map(color => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    style={[styles.colorChip, selectedColor === color && styles.colorChipActive]}
                  >
                    <Text style={[styles.colorText, selectedColor === color && styles.colorTextActive]}>{color}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Descrição */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {product.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* SKU */}
          <Text style={styles.sku}>SKU: {product.sku}</Text>

          {/* Relacionados */}
          {related.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Você também pode gostar</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {related.map(rel => (
                  <TouchableOpacity
                    key={rel.id}
                    onPress={() => navigation.replace('ProductDetail', { productId: rel.id })}
                    style={styles.relatedCard}
                  >
                    <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.relatedImg}>
                      <Text style={{ fontSize: 30 }}>{CATEGORY_CONFIG[rel.category].emoji}</Text>
                    </LinearGradient>
                    <Text style={styles.relatedName} numberOfLines={2}>{rel.name}</Text>
                    <Text style={styles.relatedPrice}>R$ {rel.price.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botão fixo */}
      <View style={[styles.buyBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.buyInfo}>
          <Text style={styles.buyInfoPrice}>R$ {product.price.toFixed(2)}</Text>
          <Text style={styles.buyInfoPix}>via PIX</Text>
        </View>
        <TouchableOpacity
          onPress={handleAddToCart}
          disabled={product.stock === 0}
          style={{ flex: 1, borderRadius: Radius.lg, overflow: 'hidden' }}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={product.stock === 0 ? ['#333', '#222'] : Colors.gradientPrimary}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.buyBtn}
          >
            <Text style={[styles.buyBtnText, { color: product.stock === 0 ? Colors.textMuted : Colors.textInverse }]}>
              {product.stock === 0 ? '❌ Esgotado' : '🛒 Adicionar ao Carrinho'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 320, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  discountBadge: { position: 'absolute', top: 60, left: Spacing.xl, backgroundColor: Colors.red, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 6 },
  discountText: { fontSize: 14, color: '#fff', fontWeight: '700' },
  premiumBadge: { position: 'absolute', bottom: 20, left: Spacing.xl, backgroundColor: Colors.goldMuted, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 5 },
  premiumText: { fontSize: 11, color: Colors.gold, fontWeight: '700' },
  backBtn: { position: 'absolute', left: Spacing.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  cartBtn: { position: 'absolute', right: Spacing.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  cartBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: Colors.red, borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.base },
  catBadge: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 10 },
  catBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  name: { fontSize: 24, color: Colors.textPrimary, fontWeight: '700', lineHeight: 30, marginBottom: Spacing.base },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.base },
  originalPrice: { fontSize: 13, color: Colors.textMuted, textDecorationLine: 'line-through', marginBottom: 2 },
  price: { fontSize: 28, color: Colors.primary, fontWeight: '700' },
  favBtn: { padding: 4 },
  stockBadge: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start', marginBottom: Spacing.xl },
  stockText: { fontSize: 13, fontWeight: '500' },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  sizesRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 8 },
  sizeChip: { width: 52, height: 52, borderRadius: Radius.md, backgroundColor: Colors.bgCard, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  sizeChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  sizeText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  sizeTextActive: { color: Colors.primary },
  sizeGuide: { alignSelf: 'flex-start' },
  sizeGuideText: { fontSize: 12, color: Colors.primary },
  colorsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colorChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.md, backgroundColor: Colors.bgCard, borderWidth: 1.5, borderColor: Colors.border },
  colorChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  colorText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  colorTextActive: { color: Colors.primary },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 24 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.base },
  tag: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 11, color: Colors.textMuted },
  sku: { fontSize: 11, color: Colors.textMuted, marginBottom: Spacing.xl },
  relatedCard: { width: 130 },
  relatedImg: { height: 100, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: 6, borderWidth: 1, borderColor: Colors.border },
  relatedName: { fontSize: 11, color: Colors.textPrimary, fontWeight: '500', lineHeight: 15, marginBottom: 4 },
  relatedPrice: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  buyBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.bgCard, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.base, paddingHorizontal: Spacing.xl },
  buyInfo: { alignItems: 'center' },
  buyInfoPrice: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
  buyInfoPix: { fontSize: 10, color: Colors.textMuted },
  buyBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  buyBtnText: { fontSize: 15, fontWeight: '700' },
});
