import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '../theme';
import GlowBackground from '../components/GlowBackground';
import GlassCard from '../components/GlassCard';

export default function SetorPlaceholderScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { setorNome, setorEmoji } = route.params ?? { setorNome: 'Setor', setorEmoji: '🎭' };

  const isBateria = setorNome === 'Bateria Puro Balanço';

  const EQUIPE_BATERIA = [
    { emoji: '🥇', label: 'Mestre', nome: '@fel.cabral', url: 'https://www.instagram.com/fel.cabral/' },
    { emoji: '🥇', label: 'Mestre', nome: '@vinyrezende', url: 'https://www.instagram.com/vinyrezende/' },
    { emoji: '👑', label: 'Rainha', nome: '@araujovivianne', url: 'https://www.instagram.com/araujovivianne/' },
    { emoji: '👑', label: 'Princesa', nome: '@dudaserdan', url: 'https://www.instagram.com/dudaserdan/' },
  ];

  if (isBateria) {
    return (
      <View style={styles.container}>
        <GlowBackground />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 60 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'center', paddingHorizontal: Spacing.xl }}>
            <Image source={require('../../assets/images/bateria-puro-balanco.png')} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.bateriaTitle}>BATERIA PURO BALANÇO</Text>

            <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/bateriapurobalanco/')} style={styles.instaBtn}>
              <Text style={styles.instaBtnText}>📸 @bateriapurobalanco</Text>
            </TouchableOpacity>

            <GlassCard style={{ width: '100%', marginTop: 24 }}>
              <Text style={styles.perfilTitle}>Perfil Oficial Puro Balanço</Text>
              <View style={styles.perfilRow}>
                <Text style={{ fontSize: 18 }}>🥁</Text>
                <Text style={styles.perfilText}>
                  Bateria da{' '}
                  <Text style={styles.perfilLink} onPress={() => Linking.openURL('https://www.instagram.com/manchacarnaval/')}>
                    @manchacarnaval
                  </Text>
                </Text>
              </View>

              <View style={{ height: 16 }} />

              {EQUIPE_BATERIA.map((pessoa, i) => (
                <TouchableOpacity key={i} onPress={() => Linking.openURL(pessoa.url)} style={styles.equipeRow}>
                  <Text style={{ fontSize: 18 }}>{pessoa.emoji}</Text>
                  <Text style={styles.equipeLabel}>{pessoa.label}</Text>
                  <Text style={styles.equipeNome}>{pessoa.nome}</Text>
                </TouchableOpacity>
              ))}
            </GlassCard>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlowBackground />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <LinearGradient colors={Colors.gradientPrimary as any} style={styles.iconWrap}>
          <Text style={{ fontSize: 44 }}>{setorEmoji}</Text>
        </LinearGradient>
        <Text style={styles.setorNome}>{setorNome}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🚧 EM BREVE</Text>
        </View>
        <Text style={styles.desc}>
          Estamos preparando um conteúdo especial sobre este setor.{'\n'}
          Volte em breve para conhecer mais sobre a {setorNome} da Mancha Verde!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: Spacing.xl, marginBottom: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, marginTop: -60 },
  bateriaTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '800', letterSpacing: 1, textAlign: 'center', marginBottom: 16 },
  instaBtn: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.full, paddingHorizontal: 20, paddingVertical: 10 },
  instaBtnText: { fontSize: 14, color: Colors.primaryBright, fontWeight: '700' },
  perfilTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700', marginBottom: 14 },
  perfilRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  perfilText: { fontSize: 14, color: Colors.textSecondary },
  perfilLink: { color: Colors.primaryBright, fontWeight: '700' },
  equipeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  equipeLabel: { fontSize: 13, color: Colors.textMuted, width: 60 },
  equipeNome: { fontSize: 14, color: Colors.primaryBright, fontWeight: '700' },
  logoImage: { width: 140, height: 140, marginBottom: 24, borderRadius: 20 },
  iconWrap: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  setorNome: { fontSize: 26, color: Colors.textPrimary, fontWeight: '800', marginBottom: 14, textAlign: 'center' },
  badge: { backgroundColor: Colors.goldMuted, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 20 },
  badgeText: { fontSize: 12, color: Colors.gold, fontWeight: '700', letterSpacing: 1 },
  desc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
