import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '../theme';
import GlowBackground from '../components/GlowBackground';
import GlassCard from '../components/GlassCard';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { useAuthStore } from '../store/authStore';
import { useSocialStore } from '../store/socialStore';

const WHATSAPP_NUMBER = '5511952651000';

export default function ComunidadeInfoScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });
  const { user } = useAuthStore();
  const { getProfile } = useSocialStore();
  const [expandedBeneficios, setExpandedBeneficios] = useState(false);
  const [expandedDeveres, setExpandedDeveres] = useState(false);

  const handleParticipar = async () => {
    let cidade = '';
    try {
      if (user?.id) {
        const profile = await getProfile(user.id);
        cidade = profile?.city ?? '';
      }
    } catch (e) {}

    const linhas = [
      'Olá! Quero participar da Ala da Comunidade da Mancha Verde! 💚',
      '',
      `Nome completo: ${user?.displayName ?? '—'}`,
      `Email: ${user?.email ?? '—'}`,
      cidade ? `Cidade: ${cidade}` : null,
      '',
      'Já li os Benefícios e Deveres da Ala e estou de acordo.',
    ].filter(Boolean);

    const msg = encodeURIComponent(linhas.join('\n'));
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`);
  };

  const BENEFICIOS = [
    { emoji: '🎭', title: 'Desfile oficial', desc: 'Participe do desfile da Mancha Verde na avenida' },
    { emoji: '👥', title: 'Comunidade unida', desc: 'Faça parte de um grupo apaixonado pelo carnaval' },
    { emoji: '🥁', title: 'Ensaios exclusivos', desc: 'Acesso aos ensaios técnicos da escola' },
    { emoji: '💚', title: 'Sinta-se em casa', desc: 'Acolhimento e tradição da torcida mais querida' },
  ];

  const BENEFICIOS_TEXTO = `Ao fazer parte da Ala da Comunidade você terá:

- Carteirinha exclusiva da Ala;
- Acesso gratuito aos ensaios (domingos e quintas-feiras);
- Camiseta exclusiva da ala;
- Fantasia gratuita para o desfile de 2027.

*mediante cumprimento da frequência exigida.`;

  const DEVERES_TEXTO = `Para garantir sua fantasia e permanecer na Ala, é necessário:

- Participar da reunião de Integração;
- Comparecer em 80% dos ensaios da Comunidade;
- Registrar presença em cada ensaio na Sala da Ala da Comunidade;
- Participar efetivamente dos ensaios (cantando, dançando e respeitando as orientações);
- Retirar a fantasia na data marcada e mantê-la em bom estado até o desfile;
- Fazer a devolução da fantasia após o desfile na quadra da Escola;
- Participar do grupo oficial da Escola no WhatsApp: (11) 95265-1000`;

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
            <Text style={[styles.introTitle, fontsLoaded && { fontFamily: 'DancingScript_700Bold' }]}>
              {'Ala da Comunidade\nEssa é a nossa diferença'}
            </Text>
            <Text style={styles.introText}>
              A Ala da Comunidade é o pulmão da Escola.{'\n\n'}
              É formada por componentes que vivem a rotina da quadra, participam dos ensaios e constroem o espetáculo com dedicação e amor.{'\n\n'}
              Aqui não é apenas desfilar.{'\n'}
              É compromisso e união.{'\n\n'}
              Ser Comunidade é ser Mancha de verdade.
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

          {/* BENEFÍCIOS E DEVERES */}
          <TouchableOpacity onPress={() => setExpandedBeneficios(!expandedBeneficios)} activeOpacity={0.85}>
            <GlassCard style={{ marginBottom: 12 }}>
              <View style={styles.expandableHeader}>
                <Text style={styles.expandableTitle}>🎁 Benefícios</Text>
                <Text style={styles.expandableArrow}>{expandedBeneficios ? '︿' : '﹀'}</Text>
              </View>
              {expandedBeneficios && (
                <Text style={styles.expandableText}>{BENEFICIOS_TEXTO}</Text>
              )}
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setExpandedDeveres(!expandedDeveres)} activeOpacity={0.85}>
            <GlassCard style={{ marginBottom: 24 }}>
              <View style={styles.expandableHeader}>
                <Text style={styles.expandableTitle}>📌 Deveres</Text>
                <Text style={styles.expandableArrow}>{expandedDeveres ? '︿' : '﹀'}</Text>
              </View>
              {expandedDeveres && (
                <Text style={styles.expandableText}>{DEVERES_TEXTO}</Text>
              )}
            </GlassCard>
          </TouchableOpacity>

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
  introTitle: { fontSize: 30, color: Colors.primaryBright, fontWeight: '800', marginBottom: 16, textAlign: 'center', lineHeight: 36 },
  introText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, textAlign: 'center' },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 12 },
  beneficioRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  beneficioIcon: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  beneficioTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', marginBottom: 2 },
  beneficioDesc: { fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
  expandableHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expandableTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700' },
  expandableArrow: { fontSize: 16, color: Colors.primaryBright },
  expandableText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 22, marginTop: 14 },
  comoTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: 12, color: Colors.primaryBright, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  actionBtn: { height: 54, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 16, color: Colors.textInverse, fontWeight: '700' },
});
