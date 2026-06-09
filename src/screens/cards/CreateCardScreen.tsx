import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Share, Alert, KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCardsStore } from '../../store/cardsStore';
import { useAuthStore } from '../../store/authStore';
import { MOCK_TEMPLATES, CARD_CATEGORY_CONFIG } from '../../types/cards';
import { Colors, Spacing, Radius } from '../../theme';

const { width: W } = Dimensions.get('window');

export default function CreateCardScreen({ route, navigation }: any) {
  const { templateId } = route.params ?? {};
  const insets = useSafeAreaInsets();
  const { createCard, selectTemplate, selectedTemplate } = useCardsStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState<'template' | 'customize' | 'preview' | 'success'>(templateId ? 'customize' : 'template');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [createdCard, setCreatedCard] = useState<any>(null);

  useEffect(() => {
    if (templateId) selectTemplate(templateId);
  }, [templateId]);

  const template = selectedTemplate ?? MOCK_TEMPLATES[0];
  const cat = CARD_CATEGORY_CONFIG[template.category];

  const DEFAULT_MESSAGES: Record<string, string> = {
    aniversario: `Feliz Aniversário! 🎂\n\nQue seu novo ciclo seja repleto de alegria, samba e muito axé!\n\nCom carinho,`,
    carnaval: `Que o samba te guie e a Mancha te abrace! 🎭\n\nBoa sorte no desfile, que seja inesquecível!\n\nCom axé,`,
    homenagem: `Quero expressar minha gratidão e admiração por você.\n\nObrigado por fazer parte da nossa história! ❤️\n\nCom respeito,`,
    data_especial: `Um momento especial merece uma mensagem especial! 🎉\n\nQue essa data seja memorável!\n\nCom carinho,`,
    evento: `Você está convidado para um momento especial! 🎤\n\nSua presença fará toda a diferença!\n\nAté lá,`,
    certificado: `É com muito orgulho que reconhecemos sua contribuição.\n\nObrigado por fazer parte da Mancha! 🏅`,
  };

  useEffect(() => {
    if (message === '') setMessage(DEFAULT_MESSAGES[template.category] ?? '');
  }, [template]);

  const handleCreate = () => {
    if (!recipientName.trim()) { Alert.alert('Atenção', 'Digite o nome do destinatário.'); return; }
    if (!message.trim()) { Alert.alert('Atenção', 'Escreva uma mensagem.'); return; }
    if (!user) return;
    const card = createCard({
      userId: user.id,
      templateId: template.id,
      category: template.category,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim() || undefined,
      message: message.trim(),
      senderName: user.displayName,
      isPublic,
    });
    setCreatedCard(card);
    setStep('success');
  };

  const handleShare = async () => {
    await Share.share({
      title: `Cartão da Mancha para ${recipientName}`,
      message: `💌 ${cat.emoji} ${template.name}\n\nPara: ${recipientName}\n\n"${message}"\n\nDe: ${user?.displayName}\n\nMancha Carnaval App 🐍💚`,
    });
  };

  // ── STEP: TEMPLATE ─────────────────────────────────────────
  if (step === 'template') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Escolher Template</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 60 }}>
          <View style={styles.templatesGrid}>
            {MOCK_TEMPLATES.map(tpl => (
              <TouchableOpacity
                key={tpl.id}
                onPress={() => { selectTemplate(tpl.id); setStep('customize'); setMessage(DEFAULT_MESSAGES[tpl.category] ?? ''); }}
                style={styles.templateCard}
                activeOpacity={0.85}
              >
                <LinearGradient colors={tpl.gradient as any} style={styles.templateGrad}>
                  <View style={[styles.templateAccent, { backgroundColor: tpl.accentColor }]} />
                  {tpl.isPremium && <View style={styles.premiumBadge}><Text style={styles.premiumText}>👑 PRO</Text></View>}
                  <Text style={{ fontSize: 40 }}>{tpl.emoji}</Text>
                  <Text style={[styles.templateCat, { color: tpl.accentColor }]}>{CARD_CATEGORY_CONFIG[tpl.category]?.label?.toUpperCase()}</Text>
                  <Text style={styles.templateName}>{tpl.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── STEP: SUCCESS ──────────────────────────────────────────
  if (step === 'success') {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl }}>
        <Text style={{ fontSize: 80, marginBottom: Spacing.xl }}>💌</Text>
        <Text style={styles.successTitle}>Cartão Enviado!</Text>
        <Text style={styles.successSub}>Seu cartão para <Text style={{ color: Colors.primary, fontWeight: '700' }}>{recipientName}</Text> foi criado com sucesso!</Text>

        <View style={styles.successCard}>
          <LinearGradient colors={template.gradient as any} style={styles.successCardGrad}>
            <View style={[styles.templateAccent, { backgroundColor: template.accentColor }]} />
            <Text style={{ fontSize: 40, marginBottom: 8 }}>{template.emoji}</Text>
            <Text style={styles.successCardRecipient}>Para: {recipientName}</Text>
            <Text style={styles.successCardMsg} numberOfLines={3}>{message}</Text>
            <Text style={styles.successCardSender}>— {user?.displayName}</Text>
          </LinearGradient>
        </View>

        <View style={{ gap: 10, width: '100%' }}>
          <TouchableOpacity onPress={handleShare} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
            <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>📤 Compartilhar Cartão</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MyCards')} style={styles.outlineBtn}>
            <Text style={styles.outlineBtnText}>📬 Ver Meus Cartões</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setStep('template'); setRecipientName(''); setMessage(''); }} style={styles.ghostBtn}>
            <Text style={styles.ghostBtnText}>Criar Outro Cartão</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── STEP: CUSTOMIZE + PREVIEW ─────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.customizeScroll, { paddingTop: insets.top + 16 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => setStep('template')} style={{ marginBottom: Spacing.xl }}>
            <Text style={{ color: Colors.primary, fontSize: 15 }}>← Trocar template</Text>
          </TouchableOpacity>

          {/* Preview do cartão */}
          <View style={styles.cardPreview}>
            <LinearGradient colors={template.gradient as any} style={styles.cardPreviewGrad}>
              <View style={[styles.templateAccent, { backgroundColor: template.accentColor }]} />
              <View style={styles.cardPreviewGlow} />
              <Text style={{ fontSize: 52, marginBottom: 10 }}>{template.emoji}</Text>
              <View style={[styles.cardPreviewCatBadge, { backgroundColor: `${template.accentColor}22`, borderColor: `${template.accentColor}44` }]}>
                <Text style={[styles.cardPreviewCatText, { color: template.accentColor }]}>{cat.emoji} {cat.label.toUpperCase()}</Text>
              </View>
              <Text style={styles.cardPreviewRecipient}>{recipientName || 'Nome do Destinatário'}</Text>
              <Text style={styles.cardPreviewMessage} numberOfLines={4}>{message || 'Sua mensagem aparecerá aqui...'}</Text>
              <Text style={styles.cardPreviewSender}>— {user?.displayName ?? 'Seu nome'}</Text>
            </LinearGradient>
          </View>

          <Text style={styles.sectionTitle}>✏️ Personalizar</Text>

          <Text style={styles.fieldLabel}>Para quem é este cartão? *</Text>
          <TextInput value={recipientName} onChangeText={setRecipientName} placeholder="Nome do destinatário" placeholderTextColor={Colors.textMuted} style={styles.field} maxLength={50} />

          <Text style={styles.fieldLabel}>E-mail (opcional)</Text>
          <TextInput value={recipientEmail} onChangeText={setRecipientEmail} placeholder="email@exemplo.com" placeholderTextColor={Colors.textMuted} style={styles.field} keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.fieldLabel}>Mensagem *</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Escreva sua mensagem..."
            placeholderTextColor={Colors.textMuted}
            style={[styles.field, styles.fieldMultiline]}
            multiline
            numberOfLines={6}
            maxLength={500}
          />
          <Text style={styles.charCount}>{message.length}/500</Text>

          <View style={styles.publicRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Tornar público no Mural</Text>
              <Text style={styles.fieldSub}>Outros membros poderão ver esta homenagem</Text>
            </View>
            <TouchableOpacity onPress={() => setIsPublic(!isPublic)} style={[styles.toggle, isPublic && styles.toggleActive]}>
              <View style={[styles.toggleThumb, isPublic && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleCreate} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing.base }}>
            <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>💌 Criar e Enviar Cartão</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  templatesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  templateCard: { width: (W - Spacing.xl * 2 - 12) / 2, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  templateGrad: { height: 160, alignItems: 'center', justifyContent: 'center', position: 'relative', gap: 4 },
  templateAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  premiumBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: Colors.goldMuted, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  premiumText: { fontSize: 9, color: Colors.gold, fontWeight: '700' },
  templateCat: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5 },
  templateName: { fontSize: 12, color: Colors.textPrimary, fontWeight: '600', textAlign: 'center', paddingHorizontal: 8 },
  customizeScroll: { paddingHorizontal: Spacing.xl, paddingBottom: 60 },
  cardPreview: { borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl },
  cardPreviewGrad: { padding: Spacing.xl, alignItems: 'center', position: 'relative', minHeight: 220 },
  cardPreviewGlow: { position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)' },
  cardPreviewCatBadge: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 12 },
  cardPreviewCatText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  cardPreviewRecipient: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  cardPreviewMessage: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 12, fontStyle: 'italic' },
  cardPreviewSender: { fontSize: 13, color: Colors.textMuted },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  fieldSub: { fontSize: 11, color: Colors.textMuted },
  field: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, height: 50, fontSize: 14, color: Colors.textPrimary, marginBottom: Spacing.base },
  fieldMultiline: { height: 140, textAlignVertical: 'top', paddingTop: 12 },
  charCount: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', marginTop: -10, marginBottom: Spacing.base },
  publicRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.base },
  toggle: { width: 48, height: 28, borderRadius: 14, backgroundColor: Colors.border, justifyContent: 'center', padding: 2 },
  toggleActive: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}44` },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.textMuted },
  toggleThumbActive: { backgroundColor: Colors.primary, alignSelf: 'flex-end' },
  actionBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  outlineBtn: { height: 52, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.primary, borderRadius: Radius.lg },
  outlineBtnText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  ghostBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  ghostBtnText: { fontSize: 14, color: Colors.textMuted },
  successTitle: { fontSize: 26, color: Colors.textPrimary, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  successSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  successCard: { width: '100%', borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.xl },
  successCardGrad: { padding: Spacing.xl, alignItems: 'center', position: 'relative' },
  successCardRecipient: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700', marginBottom: 10 },
  successCardMsg: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, fontStyle: 'italic', marginBottom: 10 },
  successCardSender: { fontSize: 13, color: Colors.textMuted },
});
