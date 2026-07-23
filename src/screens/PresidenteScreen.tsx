import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, Dimensions, TextInput, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import { Colors, Spacing, Radius } from '../theme';
import GlowBackground from '../components/GlowBackground';
import GlassCard from '../components/GlassCard';

const { width: W } = Dimensions.get('window');

const GALLERY_PHOTOS = [
  require('../../assets/images/serdan/foto01.png'),
  require('../../assets/images/serdan/foto02.png'),
  require('../../assets/images/serdan/foto03.png'),
  require('../../assets/images/serdan/foto04.png'),
  require('../../assets/images/serdan/foto05.png'),
  require('../../assets/images/serdan/foto06.png'),
  require('../../assets/images/serdan/foto07.png'),
  require('../../assets/images/serdan/foto08.png'),
  require('../../assets/images/serdan/foto09.png'),
  require('../../assets/images/serdan/foto10.png'),
  require('../../assets/images/serdan/foto11.png'),
];

const HERO_PHOTO = require('../../assets/images/serdan/foto02.png');

const TIMELINE = [
  { year: '1967', title: 'Nascimento', text: 'Nascimento de Paulo Rogério de Aquino, conhecido nacionalmente como Paulo Serdan.' },
  { year: '1993', title: 'Presidência da Torcida', text: 'Assume a presidência da Torcida Mancha Verde. Sua gestão marcou uma grande expansão da organizada, aumentando o número de associados, fortalecendo a estrutura administrativa e ampliando a presença da Mancha em todo o Brasil.' },
  { year: '1995', title: 'Fundação da Escola', text: 'Após a extinção jurídica da antiga torcida organizada por decisão da Justiça, participa da criação do Grêmio Recreativo Cultural Escola de Samba Mancha Verde, garantindo que a história e a identidade da Mancha continuassem através do Carnaval.' },
  { year: '1996', title: 'Estreia no Carnaval', text: 'Primeiro desfile oficial da Mancha Verde no Carnaval de São Paulo. A escola conquista o vice-campeonato em sua estreia e inicia uma trajetória de crescimento constante.' },
  { year: '1997', title: 'Primeiro Título', text: 'Primeiro título no Carnaval como bloco carnavalesco.' },
  { year: '1998', title: 'Bicampeonato', text: 'Bicampeonato dos blocos carnavalescos.' },
  { year: '2000', title: 'Estreia como Escola', text: 'A Mancha Verde estreia oficialmente como Escola de Samba, iniciando sua caminhada rumo ao Grupo Especial.' },
  { year: '2001–2006', title: 'Acessos Sucessivos', text: 'A escola conquista sucessivos acessos entre os grupos do Carnaval paulistano, consolidando-se entre as principais agremiações da cidade.' },
  { year: '2015', title: 'Centenário Palmeiras', text: 'A Mancha Verde realiza um dos desfiles mais marcantes de sua história, homenageando o centenário da Sociedade Esportiva Palmeiras.' },
  { year: '2019', title: 'Grupo Especial', text: 'Conquista o primeiro título do Grupo Especial do Carnaval de São Paulo, um marco histórico para a escola.' },
  { year: '2022', title: 'Bicampeonato Especial', text: 'A Mancha Verde conquista seu segundo campeonato do Grupo Especial, consolidando-se entre as grandes escolas do Carnaval paulista.' },
  { year: 'Hoje', title: 'Presidente de Honra', text: 'Permanece como uma das figuras mais conhecidas da história da Mancha Verde, sendo reconhecido como Presidente de Honra da escola de samba e um dos principais responsáveis por sua consolidação ao longo das últimas décadas.' },
];

interface Homenagem {
  id: string;
  user_name: string;
  message: string;
  created_at: string;
}

export default function PresidenteScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });
  const { user } = useAuthStore();
  const [homenagens, setHomenagens] = useState<Homenagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [zoomPhoto, setZoomPhoto] = useState<any>(null);

  useEffect(() => {
    loadHomenagens();
  }, []);

  const loadHomenagens = async () => {
    const { data } = await supabase
      .from('presidente_homenagens')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    if (data) setHomenagens(data);
  };

  const handleEnviarHomenagem = async () => {
    if (!novaMensagem.trim()) {
      Alert.alert('Atenção', 'Escreva sua homenagem antes de enviar.');
      return;
    }
    if (!user) { Alert.alert('Atenção', 'Você precisa estar logado.'); return; }

    setEnviando(true);
    const { error } = await supabase.from('presidente_homenagens').insert({
      user_id: user.id,
      user_name: user.displayName,
      message: novaMensagem.trim(),
      is_approved: false,
    });
    setEnviando(false);

    if (error) {
      Alert.alert('Erro', 'Não foi possível enviar sua homenagem.');
      return;
    }

    setNovaMensagem('');
    Alert.alert('✅ Homenagem enviada!', 'Sua mensagem está em análise e será publicada em breve no mural.');
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* HERO */}
        <View style={styles.hero}>
          <TouchableOpacity onPress={() => setZoomPhoto(HERO_PHOTO)} activeOpacity={0.9} style={StyleSheet.absoluteFillObject}>
            <Image source={HERO_PHOTO} style={styles.heroImage} resizeMode="cover" />
          </TouchableOpacity>
          <LinearGradient colors={['transparent', 'rgba(10,31,20,0.7)', Colors.bg]} style={styles.heroGradient} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: insets.top + 12 }]}>
            <Text style={{ fontSize: 16, color: '#fff' }}>←</Text>
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <Text style={styles.heroName}>Paulo Serdan</Text>
            <Text style={styles.heroRole}>Presidente de Honra · Mancha Verde</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, marginTop: 20 }}>

          {/* SLOGAN */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={[styles.slogan, fontsLoaded && { fontFamily: 'DancingScript_700Bold' }]}>
              {'Uma História de Paixão,\nLiderança e Mancha Verde'}
            </Text>
            <Text style={styles.subSlogan}>
              "Mais que um presidente. Um dos grandes responsáveis por transformar a paixão de
              milhares de palmeirenses em um legado que atravessa gerações."
            </Text>
          </View>

          {/* BIOGRAFIA */}
          <GlassCard style={{ marginBottom: 24 }}>
            <Text style={styles.sectionTitle}>📖 Biografia</Text>
            <Text style={styles.bioText}>
              Paulo Rogério de Aquino (Paulo Serdan) é um dos maiores nomes da história da Mancha
              Verde. Presidente da torcida na década de 1990, liderou sua expansão nacional e foi
              um dos idealizadores da Escola de Samba Mancha Verde, fundada em 1995. Sob sua
              liderança e influência, a agremiação cresceu ano após ano, alcançando o Grupo
              Especial e conquistando títulos históricos no Carnaval de São Paulo, tornando-se uma
              referência tanto nas arquibancadas quanto na avenida.
            </Text>
          </GlassCard>

          {/* GALERIA */}
          <Text style={styles.sectionTitle}>📸 Galeria</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, marginBottom: 24 }}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / (W * 0.7));
              setGalleryIndex(idx);
            }}
          >
            {GALLERY_PHOTOS.map((photo, i) => (
              <TouchableOpacity key={i} onPress={() => setZoomPhoto(photo)} activeOpacity={0.85}>
                <View style={styles.galleryItem}>
                  <Image source={photo} style={styles.galleryImage} resizeMode="cover" />
                  <View style={styles.zoomHint}>
                    <Text style={{ fontSize: 14 }}>🔍</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* LINHA DO TEMPO */}
          <Text style={styles.sectionTitle}>🕒 Linha do Tempo</Text>
          <View style={{ marginBottom: 24 }}>
            {TIMELINE.map((item, i) => (
              <View key={i} style={styles.timelineItem}>
                <View style={styles.timelineMarkerCol}>
                  <View style={styles.timelineDot} />
                  {i < TIMELINE.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={{ flex: 1, paddingBottom: 20 }}>
                  <Text style={styles.timelineYear}>{item.year}</Text>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* MURAL DE HOMENAGENS */}
          <Text style={styles.sectionTitle}>❤️ Mural de Homenagens</Text>

          <GlassCard style={{ marginBottom: 16 }}>
            <Text style={styles.mensagemLabel}>Deixe sua homenagem</Text>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <TextInput
                value={novaMensagem}
                onChangeText={setNovaMensagem}
                placeholder="Escreva uma mensagem de carinho para o Presidente Serdan..."
                placeholderTextColor={Colors.textMuted}
                style={styles.mensagemInput}
                multiline
                maxLength={280}
              />
            </KeyboardAvoidingView>
            <Text style={styles.charCount}>{novaMensagem.length}/280</Text>
            <TouchableOpacity onPress={handleEnviarHomenagem} disabled={enviando} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
              <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.enviarBtn}>
                <Text style={styles.enviarBtnText}>{enviando ? '⏳ Enviando...' : '💌 Enviar Homenagem'}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.moderacaoNote}>Sua mensagem passará por aprovação antes de aparecer no mural.</Text>
          </GlassCard>

          <View style={{ gap: 12 }}>
            {homenagens.length === 0 ? (
              <View style={styles.emptyMural}>
                <Text style={{ fontSize: 36 }}>💌</Text>
                <Text style={styles.emptyMuralText}>Seja o primeiro a homenagear o Presidente!</Text>
              </View>
            ) : (
              homenagens.map((h) => (
                <GlassCard key={h.id} intensity={22} noPadding>
                  <View style={{ padding: 14 }}>
                    <View style={styles.homenagemHeader}>
                      <LinearGradient colors={Colors.gradientPrimary as any} style={styles.homenagemAvatar}>
                        <Text style={styles.homenagemAvatarText}>{h.user_name?.charAt(0)?.toUpperCase() ?? 'M'}</Text>
                      </LinearGradient>
                      <Text style={styles.homenagemNome}>{h.user_name}</Text>
                    </View>
                    <Text style={styles.homenagemMsg}>{h.message}</Text>
                  </View>
                </GlassCard>
              ))
            )}
          </View>

        </View>
      </ScrollView>

      {/* MODAL DE ZOOM */}
      <Modal visible={!!zoomPhoto} transparent animationType="fade" onRequestClose={() => setZoomPhoto(null)}>
        <TouchableOpacity
          style={styles.zoomOverlay}
          activeOpacity={1}
          onPress={() => setZoomPhoto(null)}
        >
          <TouchableOpacity onPress={() => setZoomPhoto(null)} style={[styles.zoomCloseBtn, { top: insets.top + 16 }]}>
            <Text style={{ fontSize: 20, color: '#fff' }}>✕</Text>
          </TouchableOpacity>
          {zoomPhoto && (
            <Image source={zoomPhoto} style={styles.zoomImage} resizeMode="contain" />
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  hero: { height: 380, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 },
  backBtn: { position: 'absolute', left: Spacing.xl, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  heroContent: { position: 'absolute', bottom: 20, left: Spacing.xl, right: Spacing.xl },
  heroName: { fontSize: 28, color: '#fff', fontWeight: '800', marginBottom: 4 },
  heroRole: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  slogan: { fontSize: 26, color: Colors.primaryBright, fontWeight: '800', textAlign: 'center', lineHeight: 32, marginBottom: 12 },
  subSlogan: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, fontStyle: 'italic' },
  sectionTitle: { fontSize: 17, color: Colors.textPrimary, fontWeight: '700', marginBottom: 14 },
  bioText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 23 },
  galleryItem: { width: W * 0.65, height: 220, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.glassBorder },
  galleryImage: { width: '100%', height: '100%' },
  timelineItem: { flexDirection: 'row', gap: 14 },
  timelineMarkerCol: { alignItems: 'center', width: 20 },
  timelineDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.primaryBright, marginTop: 4 },
  timelineLine: { width: 2, flex: 1, backgroundColor: 'rgba(0,255,133,0.25)', marginTop: 4 },
  timelineYear: { fontSize: 13, color: Colors.primaryBright, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
  timelineTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700', marginBottom: 6 },
  timelineText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  mensagemLabel: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', marginBottom: 10 },
  mensagemInput: { backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.md, padding: 12, fontSize: 14, color: Colors.textPrimary, minHeight: 80, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', marginTop: 6, marginBottom: 12 },
  enviarBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  enviarBtnText: { fontSize: 14, color: Colors.textInverse, fontWeight: '700' },
  moderacaoNote: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 10 },
  emptyMural: { alignItems: 'center', paddingVertical: 30, gap: 10 },
  emptyMuralText: { fontSize: 13, color: Colors.textMuted },
  homenagemHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  homenagemAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  homenagemAvatarText: { fontSize: 13, color: Colors.textInverse, fontWeight: '700' },
  homenagemNome: { fontSize: 13, color: Colors.textPrimary, fontWeight: '700' },
  homenagemMsg: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  zoomHint: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 14, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  zoomOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  zoomCloseBtn: { position: 'absolute', right: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  zoomImage: { width: W, height: '80%' },
});
