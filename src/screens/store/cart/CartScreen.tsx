import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStoreStore } from '../../../store/storeStore';
import { useAuthStore } from '../../../store/authStore';
import { CATEGORY_CONFIG } from '../../../types/store';
import { Colors, Spacing, Radius } from '../../../theme';

export default function CartScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { cart, removeFromCart, updateQty, clearCart, getCartTotal, getDiscount, getFinalTotal, applyCoupon, removeCoupon, appliedCoupon, createPixOrder } = useStoreStore();
  const { user } = useAuthStore();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const error = applyCoupon(couponInput.trim(), user?.isPremium ?? false);
    if (error) Alert.alert('Cupom inválido', error);
    else { Alert.alert('✅ Cupom aplicado!', `Desconto de ${appliedCoupon?.type === 'percent' ? `${appliedCoupon.value}%` : `R$ ${appliedCoupon?.value.toFixed(2)}`} aplicado.`); setCouponInput(''); }
  };

  const handleCheckout = () => {
    if (!user) { navigation.navigate('Login'); return; }
    if (cart.length === 0) return;
    const order = createPixOrder(user.id);
    navigation.navigate('StorePixPayment', { orderId: order.id });
  };

  if (cart.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carrinho</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.empty}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🛒</Text>
          <Text style={styles.emptyTitle}>Carrinho vazio</Text>
          <Text style={styles.emptySub}>Explore a loja e adicione produtos!</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: 24 }}>
            <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>Ver Produtos</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrinho ({cart.length})</Text>
        <TouchableOpacity onPress={() => Alert.alert('Limpar carrinho', 'Remover todos os itens?', [{ text: 'Cancelar' }, { text: 'Limpar', style: 'destructive', onPress: clearCart }])}>
          <Text style={{ color: Colors.red, fontSize: 13 }}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 200 }}>

        {/* Itens */}
        {cart.map((item, index) => {
          const cat = CATEGORY_CONFIG[item.product.category];
          return (
            <View key={`${item.product.id}-${index}`} style={styles.cartItem}>
              <LinearGradient colors={['#0d3d1a', '#051a0a']} style={styles.cartItemImg}>
                <Text style={{ fontSize: 32 }}>{cat.emoji}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.cartItemName} numberOfLines={2}>{item.product.name}</Text>
                {item.selectedSize && <Text style={styles.cartItemVariant}>Tamanho: {item.selectedSize}</Text>}
                {item.selectedColor && <Text style={styles.cartItemVariant}>Cor: {item.selectedColor}</Text>}
                <Text style={styles.cartItemPrice}>R$ {item.product.price.toFixed(2)}</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity onPress={() => updateQty(item.product.id, item.quantity - 1)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyNum}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQty(item.product.id, item.quantity + 1)} style={styles.qtyBtn}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.removeBtn}>
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.cartItemTotal}>R$ {(item.product.price * item.quantity).toFixed(2)}</Text>
            </View>
          );
        })}

        {/* Cupom */}
        <View style={styles.couponSection}>
          <Text style={styles.couponTitle}>🎟️ Cupom de Desconto</Text>
          {appliedCoupon ? (
            <View style={styles.appliedCoupon}>
              <View style={styles.appliedCouponInfo}>
                <Text style={styles.appliedCouponCode}>{appliedCoupon.code}</Text>
                <Text style={styles.appliedCouponValue}>
                  -{appliedCoupon.type === 'percent' ? `${appliedCoupon.value}%` : `R$ ${appliedCoupon.value.toFixed(2)}`}
                </Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <Text style={{ color: Colors.red, fontSize: 13 }}>Remover</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponInput}>
              <TextInput
                value={couponInput}
                onChangeText={setCouponInput}
                placeholder="Digite o cupom"
                placeholderTextColor={Colors.textMuted}
                style={styles.couponField}
                autoCapitalize="characters"
              />
              <TouchableOpacity onPress={handleApplyCoupon} style={styles.couponApplyBtn}>
                <Text style={styles.couponApplyText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Resumo */}
        <View style={styles.summary}>
          <View style={styles.summaryAccent} />
          <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>R$ {getCartTotal().toFixed(2)}</Text>
          </View>
          {getDiscount() > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: Colors.primary }]}>Desconto ({appliedCoupon?.code})</Text>
              <Text style={[styles.summaryValue, { color: Colors.primary }]}>-R$ {getDiscount().toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frete</Text>
            <Text style={[styles.summaryValue, { color: Colors.primary }]}>A calcular</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>R$ {getFinalTotal().toFixed(2)}</Text>
          </View>
          <Text style={styles.pixInfo}>💚 Pagamento via PIX — aprovação instantânea</Text>
        </View>
      </ScrollView>

      {/* Botão finalizar */}
      <View style={[styles.checkoutBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.checkoutInfo}>
          <Text style={styles.checkoutTotal}>R$ {getFinalTotal().toFixed(2)}</Text>
          <Text style={styles.checkoutItems}>{cart.reduce((s, i) => s + i.quantity, 0)} itens</Text>
        </View>
        <TouchableOpacity onPress={handleCheckout} style={{ flex: 1, borderRadius: Radius.lg, overflow: 'hidden' }} activeOpacity={0.85}>
          <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.checkoutBtn}>
            <Text style={styles.checkoutBtnText}>Finalizar Compra →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
  emptyBtn: { height: 52, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center' },
  emptyBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  cartItem: { flexDirection: 'row', gap: 12, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, alignItems: 'flex-start' },
  cartItemImg: { width: 72, height: 72, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cartItemName: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', lineHeight: 18, marginBottom: 3 },
  cartItemVariant: { fontSize: 11, color: Colors.textMuted, marginBottom: 3 },
  cartItemPrice: { fontSize: 14, color: Colors.primary, fontWeight: '700', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700' },
  qtyNum: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  removeBtn: { marginLeft: 4 },
  cartItemTotal: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700', alignSelf: 'flex-start' },
  couponSection: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.base },
  couponTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.sm },
  couponInput: { flexDirection: 'row', gap: 8 },
  couponField: { flex: 1, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, height: 44, fontSize: 14, color: Colors.textPrimary, letterSpacing: 1 },
  couponApplyBtn: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}44`, borderRadius: Radius.md, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', height: 44 },
  couponApplyText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  appliedCoupon: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appliedCouponInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  appliedCouponCode: { fontSize: 14, color: Colors.primary, fontWeight: '700', letterSpacing: 1 },
  appliedCouponValue: { fontSize: 13, color: Colors.primary },
  summary: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.xl, position: 'relative', overflow: 'hidden' },
  summaryAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primary },
  summaryTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10, marginTop: 4 },
  summaryTotalLabel: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700' },
  summaryTotalValue: { fontSize: 22, color: Colors.primary, fontWeight: '700' },
  pixInfo: { fontSize: 12, color: Colors.textMuted, marginTop: Spacing.sm, textAlign: 'center' },
  checkoutBar: { position: 'absolute', bottom: 80, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.bgCard, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.base, paddingHorizontal: Spacing.xl },
  checkoutInfo: { alignItems: 'center' },
  checkoutTotal: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
  checkoutItems: { fontSize: 10, color: Colors.textMuted },
  checkoutBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  checkoutBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
});
