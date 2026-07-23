import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { Colors, Spacing, Radius } from '../theme';
import GlowBackground from '../components/GlowBackground';
import GlassCard from '../components/GlassCard';

const { width: W } = Dimensions.get('window');

const SETORES = [
  { emoji: '🥁', nome: 'Bateria Puro Balanço', desc: 'O coração pulsante da escola' },
  { emoji: '👘', nome: 'Baianas', desc: 'Tradição e elegância' },
  { emoji: '💃', nome: 'Passistas', desc: 'Ginga e alegria na avenida' },
  { emoji: '💑', nome: 'Casais', desc: 'Harmonia e sincronia' },
  { emoji: '🎩', nome: 'Comissão', desc: 'Frente de honra da escola' },
  { emoji: '🎨', nome: 'Alegoria', desc: 'Arte que ganha vida' },
  { emoji: '📋', nome: 'Diretoria', desc: 'Gestão e organização' },
  { emoji: '🤝', nome: 'Amigos', desc: 'A força da comunidade' },
];

const HISTORIA_PARAGRAFOS = [
  'A história da Escola de Samba Mancha Verde é a prova de que uma paixão verdadeira pode ultrapassar qualquer obstáculo. Nascida da união de milhares de palmeirenses apaixonados, a Mancha transformou o amor pelo Palmeiras em uma das maiores e mais respeitadas escolas de samba do Brasil.',
  'Tudo começou em 1995, quando, diante de um momento difícil para a torcida organizada, surgiu a ideia de manter viva sua identidade por meio da cultura, da música e do Carnaval. Assim nasceu o Grêmio Recreativo Cultural Escola de Samba Mancha Verde, levando para a avenida a mesma força, união e orgulho que sempre marcaram sua torcida.',
  'Já em 1996, a Mancha fez seu primeiro desfile oficial e mostrou que não estava ali apenas para participar, mas para fazer história. Com criatividade, organização e a dedicação de milhares de componentes e voluntários, a escola iniciou uma trajetória de crescimento constante, conquistando títulos, acessos e o respeito do público e dos jurados.',
  'Ao longo dos anos, a Mancha Verde consolidou um estilo próprio: desfiles grandiosos, sambas-enredo marcantes, alegorias imponentes e uma comunidade apaixonada que trabalha durante todo o ano para transformar sonhos em realidade na Avenida.',
  'Depois de uma caminhada construída com muito esforço, a escola alcançou o Grupo Especial do Carnaval de São Paulo, passando a competir entre as maiores agremiações do país.',
  'O grande momento veio em 2019, quando a Mancha Verde conquistou seu primeiro título do Grupo Especial, entrando definitivamente para a história do Carnaval paulistano. A conquista coroou décadas de dedicação de milhares de pessoas que acreditaram no projeto desde os primeiros passos.',
  'A excelência continuou nos anos seguintes e, em 2022, a escola voltou ao topo ao conquistar seu segundo campeonato do Grupo Especial, consolidando-se como uma potência do Carnaval brasileiro.',
  'Mais do que troféus, a Mancha Verde representa uma comunidade. São milhares de integrantes, famílias inteiras, ritmistas, passistas, baianas, compositores, carnavalescos, diretores e voluntários que dedicam tempo, talento e amor para manter viva essa tradição.',
  'Cada desfile é muito mais do que uma apresentação. É a celebração de uma história construída com trabalho, superação, respeito às suas raízes e um profundo sentimento de pertencimento.',
  'Hoje, a Escola de Samba Mancha Verde é reconhecida como uma das maiores escolas de samba de São Paulo, levando para a avenida espetáculos que emocionam o público e preservam a essência de sua comunidade.',
  'Sua história continua sendo escrita a cada ensaio, a cada samba composto, a cada fantasia confeccionada e a cada componente que veste o verde, branco e preto com orgulho.',
];

const ANOS_CHAVE = [
  { ano: '1995', label: 'Fundação' },
  { ano: '1996', label: 'Estreia' },
  { ano: '2019', label: '1º Título' },
  { ano: '2022', label: '2º Título' },
];

export default function NossaEscolaScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });

  const handleSetorPress = (setor: typeof SETORES[0]) => {
    navigation.navigate('SetorPlaceholder', { setorNome: setor.nome, setorEmoji: setor.emoji });
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* HERO */}
        <View style={styles.hero}>
          <Image source={require('../../assets/images/card-historia.png')} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient colors={['transparent', 'rgba(10,31,20,0.75)', Colors.bg]} style={styles.heroGradient} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: insets.top + 12 }]}>
            <Text style={{ fontSize: 16, color: '#fff' }}>←</Text>
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Image source={require('../../assets/images/novo-logo.png')} style={styles.heroLogo} resizeMode="contain" />
            <Text style={styles.heroTitle}>Escola de Samba{'\n'}Mancha Verde</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, marginTop: 20 }}>

          {/* SLOGAN MANUSCRITO */}
          <Text style={[styles.slogan, fontsLoaded && { fontFamily: 'DancingScript_700Bold' }]}>
            {'Uma História de Paixão,\nResistência e Glória'}
          </Text>

          {/* ANOS-CHAVE */}
          <View style={styles.anosRow}>
            {ANOS_CHAVE.map((item, i) => (
              <View key={i} style={styles.anoChip}>
                <Text style={styles.anoChipYear}>{item.ano}</Text>
                <Text style={styles.anoChipLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* HISTÓRIA */}
          <GlassCard style={{ marginBottom: 24, marginTop: 24 }}>
            <Text style={styles.sectionTitle}>📖 Nossa História</Text>
            {HISTORIA_PARAGRAFOS.map((p, i) => (
              <Text key={i} style={[styles.paragrafo, i === HISTORIA_PARAGRAFOS.length - 1 && { marginBottom: 0 }]}>
                {p}
              </Text>
            ))}
          </GlassCard>

          {/* FRASE DE ENCERRAMENTO */}
          <View style={styles.closingCard}>
            <View style={styles.closingAccent} />
            <Text style={styles.closingText}>Porque a Mancha Verde é mais do que uma escola de samba.</Text>
            <View style={{ height: 12 }} />
            <Text style={[styles.closingWord, fontsLoaded && { fontFamily: 'DancingScript_700Bold' }]}>É uma família.</Text>
            <Text style={[styles.closingWord, fontsLoaded && { fontFamily: 'DancingScript_700Bold' }]}>É uma tradição.</Text>
            <Text style={[styles.closingWord, fontsLoaded && { fontFamily: 'DancingScript_700Bold' }]}>É um legado.</Text>
            <View style={{ height: 14 }} />
            <Text style={styles.closingFinal}>E esse legado continua desfilando rumo ao futuro. 💚</Text>
          </View>

          {/* NOSSOS SETORES */}
          <Text style={[styles.sectionTitle, { marginTop: 28, marginBottom: 16 }]}>🎭 Nossos Setores</Text>
          <View style={styles.setoresGrid}>
            {SETORES.map((setor, i) => (
              <TouchableOpacity key={i} onPress={() => handleSetorPress(setor)} activeOpacity={0.85} style={styles.setorCard}>
                <LinearGradient colors={['#0A2E14', '#134227']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.setorAccent} />
                <Text style={{ fontSize: 30, marginBottom: 8 }}>{setor.emoji}</Text>
                <Text style={styles.setorNome}>{setor.nome}</Text>
                <Text style={styles.setorDesc}>{setor.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  hero: { height: 340, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 220 },
  backBtn: { position: 'absolute', left: Spacing.xl, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  heroContent: { position: 'absolute', bottom: 20, left: Spacing.xl, right: Spacing.xl, alignItems: 'center' },
  heroLogo: { width: 70, height: 70, marginBottom: 12 },
  heroTitle: { fontSize: 24, color: '#fff', fontWeight: '800', textAlign: 'center', lineHeight: 30, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
  slogan: { fontSize: 30, color: Colors.primaryBright, fontWeight: '800', textAlign: 'center', lineHeight: 36 },
  anosRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  anoChip: { alignItems: 'center', backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.lg, paddingVertical: 12, paddingHorizontal: 10, flex: 1, marginHorizontal: 3 },
  anoChipYear: { fontSize: 16, color: Colors.primaryBright, fontWeight: '800' },
  anoChipLabel: { fontSize: 9, color: Colors.textMuted, marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 17, color: Colors.textPrimary, fontWeight: '700', marginBottom: 14 },
  paragrafo: { fontSize: 14, color: Colors.textSecondary, lineHeight: 23, marginBottom: 16 },
  closingCard: { backgroundColor: '#0A2E14', borderRadius: Radius.xl, padding: 28, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(0,255,133,0.2)', position: 'relative', overflow: 'hidden' },
  closingAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primaryBright },
  closingText: { fontSize: 15, color: Colors.textPrimary, textAlign: 'center', fontWeight: '600', lineHeight: 22 },
  closingWord: { fontSize: 26, color: Colors.primaryBright, textAlign: 'center', lineHeight: 32 },
  closingFinal: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', fontStyle: 'italic' },
  setoresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  setorCard: { width: (W - Spacing.xl * 2 - 12) / 2, borderRadius: Radius.lg, padding: 16, borderWidth: 1, borderColor: 'rgba(0,255,133,0.15)', overflow: 'hidden', position: 'relative', marginBottom: 4 },
  setorAccent: { position: 'absolute', top: 0, left: 0, width: 3, bottom: 0, backgroundColor: Colors.primaryBright },
  setorNome: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  setorDesc: { fontSize: 11, color: Colors.textMuted, lineHeight: 15 },
});
