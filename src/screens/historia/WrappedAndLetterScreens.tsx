import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHistoriaStore } from '../../store/historiaStore';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, Radius } from '../../theme';

const { width: W } = Dimensions.get('window');

// ── WRAPPED ───────────────────────────────────────────────────
export function WrappedScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { wrapped, loadWrapped, passport } = useHistoriaStore();
  const { user } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => { loadWrapped(2025); }, []);

  if (!wrapped) return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: Colors.textMuted }}>Carregando retrospectiva...</Text>
    </View>
  );

  const SLIDES = [
    {
      id: 'welcome',
      gradient: ['#0d3d1a', '#051a0a'],
      accent: Colors.primary,
      content: (
        <View style={wStyles.slide}>
          <Text style={wStyles.slideYear}>{wrapped.year}</Text>
          <Text style={wStyles.slideEmoji}>🎭</Text>
          <Text style={wStyles.slideTitle}>Seu Ano{'\n'}na Mancha</Text>
          <Text style={wStyles.slideSub}>Uma retrospectiva da sua jornada em {wrapped.year}</Text>
          <View style={wStyles.userChip}>
            <Text style={wStyles.userChipText}>{user?.displayName ?? 'Torcedor'} 🐍</Text>
          </View>
        </View>
      ),
    },
    {
      id: 'events',
      gradient: ['#0d1a33', '#051020'],
      accent: '#4FC3F7',
      content: (
        <View style={wStyles.slide}>
          <Text style={wStyles.slideEmoji}>📅</Text>
          <Text style={[wStyles.slideBigNum, { color: '#4FC3F7' }]}>{wrapped.eventsAttended}</Text>
          <Text style={wStyles.slideTitle}>Eventos{'\n'}Participados</Text>
          <Text style={wStyles.slideSub}>Você não perdeu um só momento importante!</Text>
          <Text style={wStyles.slideDetail}>Primeiro evento: {wrapped.firstEvent}</Text>
        </View>
      ),
    },
    {
      id: 'photos',
      gradient: ['#1a0533', '#0d021a'],
      accent: '#FF4081',
      content: (
        <View style={wStyles.slide}>
          <Text style={wStyles.slideEmoji}>📸</Text>
          <Text style={[wStyles.slideBigNum, { color: '#FF4081' }]}>{wrapped.photosShared}</Text>
          <Text style={wStyles.slideTitle}>Fotos{'\n'}Compartilhadas</Text>
          <Text style={wStyles.slideSub}>Cada foto sua enriquece a história da Mancha!</Text>
          <View style={wStyles.statRow}>
            <View style={wStyles.statItem}>
              <Text style={[wStyles.statNum, { color: '#FF4081' }]}>{wrapped.likesReceived}</Text>
              <Text style={wStyles.statLabel}>Curtidas recebidas</Text>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 'sambas',
      gradient: ['#1a1000', '#0a0800'],
      accent: Colors.gold,
      content: (
        <View style={wStyles.slide}>
          <Text style={wStyles.slideEmoji}>🎵</Text>
          <Text style={[wStyles.slideBigNum, { color: Colors.gold }]}>{wrapped.sambasPlayed}</Text>
          <Text style={wStyles.slideTitle}>Sambas{'\n'}Ouvidos</Text>
          <Text style={wStyles.slideSub}>O samba da Mancha ficou no seu coração!</Text>
          <View style={wStyles.topCategory}>
            <Text style={wStyles.topCategoryLabel}>Categoria favorita</Text>
            <Text style={wStyles.topCategoryValue}>🎭 {wrapped.topCategory}</Text>
          </View>
        </View>
      ),
    },
    {
      id: 'xp',
      gradient: ['#0d0d2a', '#05050a'],
      accent: '#818CF8',
      content: (
        <View style={wStyles.slide}>
          <Text style={wStyles.slideEmoji}>⚡</Text>
          <Text style={[wStyles.slideBigNum, { color: '#818CF8' }]}>+{wrapped.totalXP}</Text>
          <Text style={wStyles.slideTitle}>XP Conquistado</Text>
          <Text style={wStyles.slideSub}>Você cresceu na sua jornada na Mancha!</Text>
          <View style={wStyles.statRow}>
            <View style={wStyles.statItem}>
              <Text style={[wStyles.statNum, { color: '#818CF8' }]}>{wrapped.achievementsUnlocked}</Text>
              <Text style={wStyles.statLabel}>Conquistas desbloqueadas</Text>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: 'finale',
      gradient: ['#0d3d1a', '#051a0a'],
      accent: Colors.primary,
      content: (
        <View style={wStyles.slide}>
          <Text style={{ fontSize: 72, marginBottom: Spacing.base }}>💚</Text>
          <Text style={wStyles.slideTitle}>Obrigado por fazer{'\n'}parte da Mancha!</Text>
          <Text style={wStyles.slideSub}>Sua história é parte da nossa história. Nos vemos no Anhembi em 2026! 🐍</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing.xl, width: '100%' }}
          >
            <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={wStyles.finaleBtn}>
              <Text style={wStyles.finaleBtnText}>Compartilhar Retrospectiva 📤</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  const slide = SLIDES[currentSlide];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={slide.gradient as any} style={{ flex: 1 }}>
        {/* Barra de progresso */}
        <View style={[wStyles.progressBar, { paddingTop: insets.top + 12 }]}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[wStyles.progressDot, { backgroundColor: i <= currentSlide ? slide.accent : Colors.border, flex: i === currentSlide ? 2 : 1 }]} />
          ))}
        </View>

        {/* Botão fechar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={[wStyles.closeBtn, { top: insets.top + 8 }]}>
          <Text style={{ fontSize: 18, color: Colors.textPrimary }}>✕</Text>
        </TouchableOpacity>

        {/* Conteúdo */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl }}>
          {slide.content}
        </View>

        {/* Navegação */}
        <View style={[wStyles.navRow, { paddingBottom: insets.bottom + 20 }]}>
          {currentSlide > 0 && (
            <TouchableOpacity onPress={() => setCurrentSlide(c => c - 1)} style={wStyles.navBtn}>
              <Text style={wStyles.navBtnText}>← Anterior</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          {currentSlide < SLIDES.length - 1 && (
            <TouchableOpacity onPress={() => setCurrentSlide(c => c + 1)} style={[wStyles.navBtn, { backgroundColor: slide.accent + '22', borderColor: slide.accent + '44' }]}>
              <Text style={[wStyles.navBtnText, { color: slide.accent }]}>Próximo →</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

// ── FUTURE LETTER ─────────────────────────────────────────────
export function FutureLetterScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { letters, addLetter } = useHistoriaStore();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [openYear, setOpenYear] = useState('2030');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) { Alert.alert('Atenção', 'Preencha o título e a mensagem.'); return; }
    const year = parseInt(openYear);
    if (isNaN(year) || year <= new Date().getFullYear()) { Alert.alert('Atenção', 'Escolha um ano futuro.'); return; }
    addLetter({
      userId: user?.id ?? '',
      title: title.trim(),
      content: content.trim(),
      openAt: new Date(year, 0, 1),
      theme: `Carnaval ${year}`,
    });
    setSubmitted(true);
  };

  if (submitted) return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl }}>
      <Text style={{ fontSize: 72, marginBottom: Spacing.xl }}>💌</Text>
      <Text style={lStyles.successTitle}>Carta Selada!</Text>
      <Text style={lStyles.successSub}>Sua mensagem ficará guardada até {openYear}. Uma surpresa para o seu eu do futuro!</Text>
      <View style={lStyles.sealedInfo}>
        <Text style={{ fontSize: 24 }}>⏳</Text>
        <View>
          <Text style={lStyles.sealedTitle}>Abre em {openYear}</Text>
          <Text style={lStyles.sealedSub}>Aguardando o futuro...</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ borderRadius: Radius.lg, overflow: 'hidden', width: '100%', marginTop: Spacing.xl }}>
        <LinearGradient colors={Colors.gradientGold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={lStyles.submitBtn}>
          <Text style={lStyles.submitBtnText}>Voltar à Minha História</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[lStyles.scroll, { paddingTop: insets.top + 16 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.xl }}>
            <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
          </TouchableOpacity>

          <Text style={lStyles.pageTitle}>💌 Carta para o Futuro</Text>
          <Text style={lStyles.pageSub}>Escreva uma mensagem para você mesmo. Ela ficará guardada até a data que você escolher.</Text>

          {/* Cartas existentes */}
          {letters.length > 0 && !showForm && (
            <View style={{ marginBottom: Spacing.xl }}>
              <Text style={lStyles.sectionTitle}>Suas cartas</Text>
              {letters.map(letter => (
                <View key={letter.id} style={lStyles.letterCard}>
                  <View style={lStyles.letterCardAccent} />
                  <View style={lStyles.letterCardHeader}>
                    <Text style={lStyles.letterCardTitle}>{letter.title}</Text>
                    <View style={lStyles.sealedBadge}>
                      <Text style={lStyles.sealedBadgeText}>🔒 {letter.openAt.getFullYear()}</Text>
                    </View>
                  </View>
                  <Text style={lStyles.letterCardSub}>Criada em {new Date(letter.createdAt).toLocaleDateString('pt-BR')}</Text>
                  {letter.isOpened
                    ? <Text style={lStyles.letterContent} numberOfLines={3}>{letter.content}</Text>
                    : <Text style={lStyles.letterSealed}>Esta carta está selada até {letter.openAt.getFullYear()}...</Text>
                  }
                </View>
              ))}
            </View>
          )}

          {!showForm ? (
            <TouchableOpacity onPress={() => setShowForm(true)} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
              <LinearGradient colors={Colors.gradientGold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={lStyles.submitBtn}>
                <Text style={lStyles.submitBtnText}>✍️ Escrever Nova Carta</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={lStyles.form}>
              <View style={lStyles.formAccent} />
              <Text style={lStyles.formTitle}>Nova Carta para o Futuro</Text>

              <Text style={lStyles.fieldLabel}>Título</Text>
              <TextInput value={title} onChangeText={setTitle} placeholder="Ex: Para mim em 2030..." placeholderTextColor={Colors.textMuted} style={lStyles.field} maxLength={60} />

              <Text style={lStyles.fieldLabel}>Sua mensagem</Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Escreva para o seu eu do futuro. Como você está se sentindo agora? O que deseja? O que quer lembrar?"
                placeholderTextColor={Colors.textMuted}
                style={[lStyles.field, lStyles.fieldMultiline]}
                multiline
                numberOfLines={8}
                maxLength={1000}
              />
              <Text style={lStyles.charCount}>{content.length}/1000</Text>

              <Text style={lStyles.fieldLabel}>Abrir em</Text>
              <TextInput value={openYear} onChangeText={setOpenYear} placeholder="Ex: 2030" placeholderTextColor={Colors.textMuted} style={lStyles.field} keyboardType="numeric" maxLength={4} />

              {/* Preview */}
              <View style={lStyles.preview}>
                <Text style={{ fontSize: 28 }}>💌</Text>
                <View style={{ flex: 1 }}>
                  <Text style={lStyles.previewText}>Esta carta ficará selada até <Text style={{ color: Colors.gold, fontWeight: '700' }}>{openYear || '...'}</Text></Text>
                  <Text style={lStyles.previewSub}>Uma surpresa para o seu eu do futuro!</Text>
                </View>
              </View>

              <TouchableOpacity onPress={handleSubmit} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing.sm }}>
                <LinearGradient colors={Colors.gradientGold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={lStyles.submitBtn}>
                  <Text style={lStyles.submitBtnText}>💌 Selar Carta</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const wStyles = StyleSheet.create({
  progressBar: { flexDirection: 'row', gap: 4, paddingHorizontal: Spacing.xl, paddingBottom: 8 },
  progressDot: { height: 3, borderRadius: 2 },
  closeBtn: { position: 'absolute', right: Spacing.xl, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  slide: { alignItems: 'center', width: '100%' },
  slideYear: { fontSize: 16, color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: 4, marginBottom: Spacing.base },
  slideEmoji: { fontSize: 80, marginBottom: Spacing.base },
  slideBigNum: { fontSize: 80, fontWeight: '900', lineHeight: 80, marginBottom: Spacing.sm },
  slideTitle: { fontSize: 32, color: Colors.textPrimary, fontWeight: '700', textAlign: 'center', lineHeight: 38, marginBottom: Spacing.base },
  slideSub: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xl },
  slideDetail: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', fontStyle: 'italic' },
  userChip: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.full, paddingHorizontal: 20, paddingVertical: 10 },
  userChipText: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
  statRow: { flexDirection: 'row', gap: 16, marginTop: Spacing.base },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 32, fontWeight: '700' },
  statLabel: { fontSize: 12, color: Colors.textMuted, textAlign: 'center' },
  topCategory: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.xl, padding: Spacing.xl, marginTop: Spacing.base },
  topCategoryLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  topCategoryValue: { fontSize: 22, color: Colors.textPrimary, fontWeight: '700' },
  navRow: { flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: 12 },
  navBtn: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.md, paddingHorizontal: 16, paddingVertical: 10 },
  navBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  finaleBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  finaleBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
});

const lStyles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: 60 },
  pageTitle: { fontSize: 26, color: Colors.textPrimary, fontWeight: '700', marginBottom: 6 },
  pageSub: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  letterCard: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.sm, position: 'relative', overflow: 'hidden' },
  letterCardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.gold },
  letterCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  letterCardTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', flex: 1 },
  sealedBadge: { backgroundColor: Colors.goldMuted, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.md, paddingHorizontal: 8, paddingVertical: 4 },
  sealedBadgeText: { fontSize: 11, color: Colors.gold, fontWeight: '600' },
  letterCardSub: { fontSize: 11, color: Colors.textMuted, marginBottom: 8 },
  letterContent: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  letterSealed: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic' },
  form: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.xl, padding: Spacing.xl, position: 'relative', overflow: 'hidden' },
  formAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.gold },
  formTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  field: { backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, height: 50, fontSize: 14, color: Colors.textPrimary, marginBottom: Spacing.base },
  fieldMultiline: { height: 160, textAlignVertical: 'top', paddingTop: 12 },
  charCount: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', marginTop: -10, marginBottom: Spacing.base },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.goldMuted, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.base },
  previewText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  previewSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  submitBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  successTitle: { fontSize: 26, color: Colors.textPrimary, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  successSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  sealedInfo: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.lg, padding: Spacing.base, width: '100%' },
  sealedTitle: { fontSize: 15, color: Colors.gold, fontWeight: '700' },
  sealedSub: { fontSize: 12, color: Colors.textMuted },
});
