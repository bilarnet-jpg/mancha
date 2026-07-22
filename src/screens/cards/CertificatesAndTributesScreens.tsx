import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Share, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCardsStore } from '../../store/cardsStore';
import { useAuthStore } from '../../store/authStore';
import { CERTIFICATE_CONFIG, CertificateType, CARD_CATEGORY_CONFIG } from '../../types/cards';
import { Colors, Spacing, Radius } from '../../theme';

// ── CERTIFICATES ──────────────────────────────────────────────
export function CertificatesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { myCertificates, issueCertificate } = useCardsStore();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [selectedType, setSelectedType] = useState<CertificateType>('participacao');
  const [eventName, setEventName] = useState('');

  const CERT_TYPES: CertificateType[] = ['participacao', 'destaque', 'guardiao', 'embaixador', 'colaborador'];

  const handleIssue = () => {
    if (!recipientName.trim()) { Alert.alert('Atenção', 'Digite o nome do destinatário.'); return; }
    if (!user) return;
    const cert = issueCertificate({
      userId: user.id,
      recipientName: recipientName.trim(),
      type: selectedType,
      eventName: eventName.trim() || undefined,
      issuerName: 'Mancha Verde Carnaval',
    });
    setShowForm(false);
    setRecipientName('');
    setEventName('');
    Alert.alert('🏅 Certificado Emitido!', `Certificado para ${cert.recipientName} gerado com sucesso!\n\nCódigo: ${cert.validationCode}`);
  };

  const handleShare = async (cert: any) => {
    const cfg = CERTIFICATE_CONFIG[cert.type];
    await Share.share({
      title: cfg.title,
      message: `🏅 ${cfg.title}\n\nConcedido a: ${cert.recipientName}\nPor: ${cert.issuerName}\nData: ${new Date(cert.issuedAt).toLocaleDateString('pt-BR')}\n\nCódigo de validação: ${cert.validationCode}\n\nMancha Verde Carnaval 🐍💚`,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏅 Certificados</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={{ color: Colors.primary, fontSize: 22 }}>{showForm ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 100 }}>

          {/* Formulário */}
          {showForm && (
            <View style={styles.form}>
              <View style={styles.formAccent} />
              <Text style={styles.formTitle}>Emitir Certificado</Text>
              <Text style={styles.fieldLabel}>Nome do destinatário *</Text>
              <TextInput value={recipientName} onChangeText={setRecipientName} placeholder="Nome completo" placeholderTextColor={Colors.textMuted} style={styles.field} />
              <Text style={styles.fieldLabel}>Tipo de certificado</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: Spacing.base }}>
                {CERT_TYPES.map(type => {
                  const cfg = CERTIFICATE_CONFIG[type];
                  const isSelected = selectedType === type;
                  return (
                    <TouchableOpacity key={type} onPress={() => setSelectedType(type)} style={[styles.certTypeChip, isSelected && { borderColor: cfg.color, backgroundColor: `${cfg.color}22` }]}>
                      <Text style={{ fontSize: 20 }}>{cfg.icon}</Text>
                      <Text style={[styles.certTypeLabel, isSelected && { color: cfg.color }]}>{cfg.title.split(' ').slice(0, 2).join(' ')}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Text style={styles.fieldLabel}>Evento relacionado (opcional)</Text>
              <TextInput value={eventName} onChangeText={setEventName} placeholder="Ex: Ensaio Técnico Janeiro 2026" placeholderTextColor={Colors.textMuted} style={styles.field} />
              <TouchableOpacity onPress={handleIssue} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
                <LinearGradient colors={Colors.gradientGold} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
                  <Text style={styles.submitBtnText}>🏅 Emitir Certificado</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de certificados */}
          {myCertificates.length === 0 && !showForm ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 56 }}>🏅</Text>
              <Text style={styles.emptyTitle}>Nenhum certificado ainda</Text>
              <Text style={styles.emptySub}>Emita certificados oficiais para membros da Mancha Verde!</Text>
            </View>
          ) : (
            myCertificates.map(cert => {
              const cfg = CERTIFICATE_CONFIG[cert.type];
              return (
                <View key={cert.id} style={[styles.certCard, { borderColor: `${cfg.color}44` }]}>
                  <LinearGradient colors={['#1a1000', '#0a0800']} style={styles.certCardGrad}>
                    <View style={[styles.certCardAccent, { backgroundColor: cfg.color }]} />
                    {/* Header */}
                    <View style={styles.certCardHeader}>
                      <View style={[styles.certIconWrap, { backgroundColor: `${cfg.color}22` }]}>
                        <Text style={{ fontSize: 32 }}>{cfg.icon}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.certTitle, { color: cfg.color }]}>{cfg.title}</Text>
                        <Text style={styles.certRecipient}>{cert.recipientName}</Text>
                      </View>
                      {cert.isOfficial && (
                        <View style={[styles.officialBadge, { backgroundColor: `${cfg.color}22`, borderColor: `${cfg.color}44` }]}>
                          <Text style={[styles.officialBadgeText, { color: cfg.color }]}>✓ OFICIAL</Text>
                        </View>
                      )}
                    </View>
                    {/* Descrição */}
                    <Text style={styles.certDesc}>{cfg.description}</Text>
                    {cert.eventName && (
                      <Text style={styles.certEvent}>📅 {cert.eventName}</Text>
                    )}
                    {/* Divisor */}
                    <View style={styles.certDivider}>
                      <View style={styles.certHoleL} />
                      <View style={styles.certDashedLine} />
                      <View style={styles.certHoleR} />
                    </View>
                    {/* Footer */}
                    <View style={styles.certFooter}>
                      <View>
                        <Text style={styles.certFooterLabel}>Emitido por</Text>
                        <Text style={styles.certFooterValue}>{cert.issuerName}</Text>
                        <Text style={styles.certFooterDate}>{new Date(cert.issuedAt).toLocaleDateString('pt-BR')}</Text>
                      </View>
                      <View style={styles.certCode}>
                        <Text style={styles.certCodeLabel}>CÓDIGO</Text>
                        <Text style={[styles.certCodeValue, { color: cfg.color }]}>{cert.validationCode}</Text>
                      </View>
                    </View>
                    {/* Ações */}
                    <TouchableOpacity onPress={() => handleShare(cert)} style={{ borderRadius: Radius.md, overflow: 'hidden', marginTop: Spacing.base }}>
                      <LinearGradient colors={[`${cfg.color}33`, `${cfg.color}22`]} style={styles.certShareBtn}>
                        <Text style={[styles.certShareBtnText, { color: cfg.color }]}>📤 Compartilhar Certificado</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── TRIBUTES (MURAL) ──────────────────────────────────────────
export function TributesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { tributes, addTribute, toggleTributeLike } = useCardsStore();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');

  const EMOJIS = ['❤️', '🎭', '🥁', '🏆', '🐍', '💚', '⭐', '🙏', '🎉', '👑'];

  const handleAdd = () => {
    if (!recipientName.trim() || !message.trim()) { Alert.alert('Atenção', 'Preencha todos os campos.'); return; }
    if (!user) return;
    addTribute({
      userId: user.id,
      userName: user.displayName,
      recipientName: recipientName.trim(),
      message: message.trim(),
      category: 'homenagem',
      emoji: selectedEmoji,
      isOfficial: false,
    });
    setShowForm(false);
    setRecipientName('');
    setMessage('');
    Alert.alert('❤️ Homenagem Publicada!', 'Sua mensagem foi adicionada ao Mural da Mancha Verde!');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>❤️ Mural de Homenagens</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <Text style={{ color: Colors.primary, fontSize: 22 }}>{showForm ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 100 }}>
          <Text style={styles.muralSub}>Um espaço para gratidão, reconhecimento e amor pela Mancha Verde 💚</Text>

          {showForm && (
            <View style={styles.form}>
              <View style={styles.formAccent} />
              <Text style={styles.formTitle}>Nova Homenagem</Text>
              <Text style={styles.fieldLabel}>Para quem é esta homenagem?</Text>
              <TextInput value={recipientName} onChangeText={setRecipientName} placeholder="Nome da pessoa ou grupo" placeholderTextColor={Colors.textMuted} style={styles.field} />
              <Text style={styles.fieldLabel}>Emoji</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: Spacing.base }}>
                {EMOJIS.map(e => (
                  <TouchableOpacity key={e} onPress={() => setSelectedEmoji(e)} style={[styles.emojiChip, selectedEmoji === e && styles.emojiChipActive]}>
                    <Text style={{ fontSize: 22 }}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.fieldLabel}>Sua mensagem</Text>
              <TextInput value={message} onChangeText={setMessage} placeholder="Expresse sua gratidão..." placeholderTextColor={Colors.textMuted} style={[styles.field, { height: 100, textAlignVertical: 'top', paddingTop: 10 }]} multiline maxLength={300} />
              <TouchableOpacity onPress={handleAdd} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing.sm }}>
                <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
                  <Text style={styles.submitBtnText}>❤️ Publicar Homenagem</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {tributes.map(tribute => (
            <View key={tribute.id} style={styles.tributeCard}>
              {tribute.isOfficial && <View style={styles.tributeAccent} />}
              <View style={styles.tributeHeader}>
                <View style={styles.tributeAvatar}>
                  <Text style={styles.tributeAvatarText}>{tribute.userName.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.tributeAuthor}>{tribute.userName}</Text>
                    {tribute.isOfficial && (
                      <View style={styles.officialBadge}>
                        <Text style={[styles.officialBadgeText, { color: Colors.primary }]}>✓ OFICIAL</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.tributeRecipient}>Para: {tribute.recipientName}</Text>
                </View>
                <Text style={{ fontSize: 28 }}>{tribute.emoji}</Text>
              </View>
              <Text style={styles.tributeMessage}>{tribute.message}</Text>
              <View style={styles.tributeFooter}>
                <Text style={styles.tributeDate}>{new Date(tribute.createdAt).toLocaleDateString('pt-BR')}</Text>
                <TouchableOpacity onPress={() => user && toggleTributeLike(tribute.id, user.id)} style={styles.likeBtn}>
                  <Text style={styles.likeBtnText}>
                    {user && tribute.likes.includes(user.id) ? '❤️' : '🤍'} {tribute.likes.length}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── MY CARDS ──────────────────────────────────────────────────
export function MyCardsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { myCards } = useCardsStore();
  const { user } = useAuthStore();

  const handleShare = async (card: any) => {
    await Share.share({
      title: `Meu cartão para ${card.recipientName}`,
      message: `💌 Cartão para: ${card.recipientName}\n\n"${card.message}"\n\nDe: ${user?.displayName}\n\nMancha Carnaval App 🐍💚`,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📬 Meus Cartões</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CreateCard')}>
          <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: '600' }}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 100 }}>
        {myCards.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 56 }}>💌</Text>
            <Text style={styles.emptyTitle}>Nenhum cartão ainda</Text>
            <Text style={styles.emptySub}>Crie seu primeiro cartão especial!</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CreateCard')} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: 20 }}>
              <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Criar Cartão</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          myCards.map(card => {
            const tpl = (require('../../types/cards')).MOCK_TEMPLATES.find((t: any) => t.id === card.templateId) ?? (require('../../types/cards')).MOCK_TEMPLATES[0];
            const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
              sent: { label: 'Enviado', color: Colors.primary },
              scheduled: { label: 'Agendado', color: Colors.gold },
              delivered: { label: 'Entregue', color: '#4FC3F7' },
              draft: { label: 'Rascunho', color: Colors.textMuted },
            };
            const status = STATUS_CONFIG[card.status] ?? STATUS_CONFIG.sent;
            return (
              <View key={card.id} style={styles.myCardItem}>
                <LinearGradient colors={tpl.gradient} style={styles.myCardPreview}>
                  <View style={[styles.formAccent, { backgroundColor: tpl.accentColor }]} />
                  <Text style={{ fontSize: 28 }}>{tpl.emoji}</Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <View style={styles.myCardHeader}>
                    <Text style={styles.myCardRecipient}>Para: {card.recipientName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${status.color}22`, borderColor: `${status.color}44` }]}>
                      <Text style={[styles.statusBadgeText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.myCardMsg} numberOfLines={2}>{card.message}</Text>
                  <Text style={styles.myCardDate}>{new Date(card.createdAt).toLocaleDateString('pt-BR')}</Text>
                  <TouchableOpacity onPress={() => handleShare(card)} style={styles.shareCardBtn}>
                    <Text style={styles.shareCardBtnText}>📤 Compartilhar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  muralSub: { fontSize: 13, color: Colors.textMuted, lineHeight: 20, marginBottom: Spacing.xl },
  form: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.xl, position: 'relative', overflow: 'hidden' },
  formAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primary },
  formTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  field: { backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, height: 50, fontSize: 14, color: Colors.textPrimary, marginBottom: Spacing.base },
  certTypeChip: { alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bg, minWidth: 80 },
  certTypeLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', textAlign: 'center' },
  submitBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  emptySub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
  certCard: { borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, marginBottom: Spacing.base },
  certCardGrad: { position: 'relative' },
  certCardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  certCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: Spacing.xl, paddingBottom: Spacing.base },
  certIconWrap: { width: 60, height: 60, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  certTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  certRecipient: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  officialBadge: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  officialBadgeText: { fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  certDesc: { fontSize: 13, color: Colors.textSecondary, paddingHorizontal: Spacing.xl, marginBottom: 6, lineHeight: 20 },
  certEvent: { fontSize: 12, color: Colors.textMuted, paddingHorizontal: Spacing.xl, marginBottom: Spacing.base },
  certDivider: { flexDirection: 'row', alignItems: 'center', marginHorizontal: -1 },
  certHoleL: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bg, marginLeft: -12 },
  certDashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  certHoleR: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.bg, marginRight: -12 },
  certFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', padding: Spacing.xl, paddingTop: Spacing.base },
  certFooterLabel: { fontSize: 10, color: Colors.textMuted, letterSpacing: 1, marginBottom: 2 },
  certFooterValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },
  certFooterDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  certCode: { alignItems: 'flex-end' },
  certCodeLabel: { fontSize: 9, color: Colors.textMuted, letterSpacing: 2, marginBottom: 4 },
  certCodeValue: { fontSize: 14, fontWeight: '700', letterSpacing: 2 },
  certShareBtn: { marginHorizontal: Spacing.xl, marginBottom: Spacing.base, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center' },
  certShareBtnText: { fontSize: 13, fontWeight: '600' },
  tributeCard: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.base, marginBottom: Spacing.sm, position: 'relative', overflow: 'hidden' },
  tributeAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primary },
  tributeHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: Spacing.sm },
  tributeAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}33`, alignItems: 'center', justifyContent: 'center' },
  tributeAvatarText: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
  tributeAuthor: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  tributeRecipient: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  tributeMessage: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.sm },
  tributeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tributeDate: { fontSize: 11, color: Colors.textMuted },
  likeBtn: { padding: 4 },
  likeBtnText: { fontSize: 14, color: Colors.textSecondary },
  emojiChip: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  emojiChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  myCardItem: { flexDirection: 'row', gap: 12, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm },
  myCardPreview: { width: 72, height: 72, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  myCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  myCardRecipient: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', flex: 1 },
  myCardMsg: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 4 },
  myCardDate: { fontSize: 11, color: Colors.textMuted, marginBottom: 6 },
  shareCardBtn: { alignSelf: 'flex-start', backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: `${Colors.primary}33`, borderRadius: Radius.md, paddingHorizontal: 8, paddingVertical: 4 },
  shareCardBtnText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  statusBadge: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  statusBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
});
