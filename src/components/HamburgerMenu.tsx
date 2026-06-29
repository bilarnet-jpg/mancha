import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions, TouchableWithoutFeedback, ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { Colors, Spacing, Radius } from '../theme';

const { width: W, height: H } = Dimensions.get('window');
const MENU_WIDTH = W * 0.78;

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: any;
}

const MENU_ITEMS = [
  { emoji: '👤', label: 'Meu Perfil', screen: 'Profile' },
  { emoji: '🏠', label: 'Início', screen: null },
  { emoji: '🎭', label: 'Minha História', screen: 'MinhaHistoria' },
  { emoji: '🎵', label: 'Mancha na Avenida', screen: 'Avenida' },
  { emoji: '💌', label: 'Cartões da Mancha', screen: 'CardsMain' },
  { emoji: '💃', label: 'Contrate a Ala Show', screen: 'AlaShow' },
  { emoji: '🛍️', label: 'Loja', screen: 'LojaTab' },
  { emoji: '👑', label: 'Sócio Mancha', screen: 'SocioTab' },
  { emoji: '📅', label: 'Agenda', screen: 'AgendaTab' },
  { emoji: '📸', label: 'Comunidade', screen: 'ManchaTab' },
];

export default function HamburgerMenu({ isOpen, onClose, navigation }: HamburgerMenuProps) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const slideAnim = useRef(new Animated.Value(MENU_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: MENU_WIDTH, useNativeDriver: true, tension: 65, friction: 11 }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [isOpen]);

  const handleNavigate = (screen: string | null) => {
    onClose();
    if (!screen) return;
    setTimeout(() => {
      if (screen === 'LojaTab' || screen === 'AgendaTab' || screen === 'ManchaTab') {
        navigation.navigate(screen);
      } else {
        navigation.navigate(screen);
      }
    }, 200);
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => logout(), 300);
  };

  if (!isOpen && slideAnim._value === MENU_WIDTH) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Overlay escuro */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={styles.drawerTint} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 30 }}>

          {/* HEADER DO MENU */}
          <View style={styles.menuHeader}>
            <LinearGradient colors={user?.isPremium ? Colors.gradientGold as any : Colors.gradientPrimary as any} style={styles.menuAvatar}>
              <Text style={styles.menuAvatarText}>{user?.displayName?.charAt(0)?.toUpperCase() ?? 'M'}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuName}>{user?.displayName ?? 'Torcedor'}</Text>
              <Text style={styles.menuEmail} numberOfLines={1}>{user?.email ?? ''}</Text>
              <View style={styles.menuPlanBadge}>
                <Text style={[styles.menuPlanText, { color: user?.isPremium ? Colors.gold : Colors.primaryBright }]}>
                  {user?.isPremium ? '👑 Plano Ouro' : '🎟️ Plano Free'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ fontSize: 18, color: Colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* LINKS RÁPIDOS */}
          <Text style={styles.menuSectionLabel}>NAVEGAÇÃO</Text>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleNavigate(item.screen)}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
              </View>
              <Text style={styles.menuItemLabel}>{item.label}</Text>
              <Text style={{ color: Colors.textMuted, fontSize: 14 }}>→</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.divider} />

          {/* PAINEL ADMIN — só para admins */}
          {(user as any)?.isAdmin && (
          <><Text style={styles.menuSectionLabel}>ADMINISTRAÇÃO</Text>
          <TouchableOpacity
            onPress={() => handleNavigate('AdminDashboard')}
            style={styles.adminMenuItem}
            activeOpacity={0.8}
          >
            <LinearGradient colors={Colors.gradientGold as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.adminMenuGrad}>
              <Text style={{ fontSize: 20 }}>⚙️</Text>
              <Text style={styles.adminMenuLabel}>Painel de Administração</Text>
              <Text style={{ fontSize: 14, color: Colors.textInverse }}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.divider} />
          </>)}

          <View style={styles.divider} />

          {/* SAIR */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutItem} activeOpacity={0.7}>
            <View style={[styles.menuItemIcon, { backgroundColor: 'rgba(255,90,90,0.12)' }]}>
              <Text style={{ fontSize: 18 }}>🚪</Text>
            </View>
            <Text style={[styles.menuItemLabel, { color: '#FF5A5A' }]}>Sair da conta</Text>
          </TouchableOpacity>

          {/* VERSÃO */}
          <Text style={styles.versionText}>Mancha Carnaval · v1.0.0</Text>

        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  drawer: {
    position: 'absolute', top: 0, right: 0, bottom: 0,
    width: MENU_WIDTH,
    borderLeftWidth: 1,
    borderLeftColor: Colors.glassBorder,
    overflow: 'hidden',
  },
  drawerTint: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(10,31,20,0.55)',
  },
  menuHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 20 },
  menuAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  menuAvatarText: { fontSize: 22, color: Colors.textInverse, fontWeight: '800' },
  menuName: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 2 },
  menuEmail: { fontSize: 11, color: Colors.textMuted, marginBottom: 6 },
  menuPlanBadge: { backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  menuPlanText: { fontSize: 10, fontWeight: '600' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.glassLight, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: Colors.glassBorder, marginVertical: 16, marginHorizontal: Spacing.xl },
  menuSectionLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '700', letterSpacing: 1.5, paddingHorizontal: Spacing.xl, marginBottom: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: Spacing.xl, paddingVertical: 13 },
  menuItemIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.glassLight, alignItems: 'center', justifyContent: 'center' },
  menuItemLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  adminMenuItem: { marginHorizontal: Spacing.xl, borderRadius: Radius.lg, overflow: 'hidden', marginBottom: 4 },
  adminMenuGrad: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  adminMenuLabel: { flex: 1, fontSize: 14, color: Colors.textInverse, fontWeight: '700' },
  logoutItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: Spacing.xl, paddingVertical: 13 },
  versionText: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 20 },
});
