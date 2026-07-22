import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '../theme';
import GlowBackground from '../components/GlowBackground';
import GlassCard from '../components/GlassCard';

const WHATSAPP_NUMBER = '5511999999999'; // TROCAR pelo WhatsApp real da Mancha Verde

export default function ComunidadeInfoScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const handleParticipar = () => {
    const msg = encodeURIComponent('Olá! Quero saber como participar da Ala da Comunidade da Mancha Verde! 💚');
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`);
  };

  const BENEFICIOS = [
    { emoji: '🎭', title: 'Desfile oficial', desc: 'Participe do desfile da Mancha Verde na avenida' },
    { emoji: '👥', title: 'Comunidade unida', desc: 'Faça parte de um grupo apaixonado pelo carnaval' },
    { emoji: '🥁', title: 'Ensaios exclusivos', desc: 'Acesso aos ensaios técnicos da escola' },
    { emoji: '💚', title: 'Sinta-se em casa', desc: 'Acolhimento e tradição da torcida mais querida' },
  ];

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 60 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ala da Comunidade</Text>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl }}>

          {/* LOGO */}
          <View style={styles.logoWrap}>
            <Image
              source={require('../../assets/images/logo-ala-comunidade.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* INTRO */}
          <GlassCard style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={styles.introTitle}>Faça parte da Mancha Verde!</Text>
            <Text style={styles.introText}>
              A Ala da Comunidade é o coração da Mancha Verde Carnaval — o espaço aberto para
              todo torcedor que quer viver o carnaval de verdade, desfilar com orgulho e fazer
              parte da maior torcida organizada do Palmeiras.
            </Text>
          </GlassCard>

          {/* BENEFÍCIOS */}
          <Text style={styles.sectionTitle}>Por que participar?</Text>
          <View style={{ gap: 12, marginBottom: 24 }}>
            {BENEFICIOS.map((b, i) => (
              <GlassCard key={i} intensity={22} noPadding>
                <View style={styles.beneficioRow}>
                  <View style={styles.beneficioIcon}>
                    <Text style={{ fontSize: 24 }}>{b.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.beneficioTitle}>{b.title}</Text>
                    <Text style={styles.beneficioDesc}>{b.desc}</Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>

          {/* COMO PARTICIPAR */}
          <GlassCard style={{ marginBottom: 24 }}>
            <Text style={styles.comoTitle}>📋 Como participar</Text>
            {[
              'Entre em contato pelo WhatsApp abaixo',
              'Nossa equipe vai te dar todas as informações',
              'Compareça aos ensaios e se torne um componente',
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </GlassCard>

          {/* BOTÃO WHATSAPP */}
          <TouchableOpacity onPress={handleParticipar} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
            <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>💬 Quero Participar</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '800' },
  logoWrap: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 220, height: 220 },
  introTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  introText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, textAlign: 'center' },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 12 },
  beneficioRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  beneficioIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  beneficioTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', marginBottom: 2 },
  beneficioDesc: { fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
  comoTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: 12, color: Colors.primaryBright, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  actionBtn: { height: 54, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 16, color: Colors.textInverse, fontWeight: '700' },
});
