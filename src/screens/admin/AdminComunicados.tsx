import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

interface Comunicado {
  id: string; title: string; message: string; emoji: string;
  accent_color: string; duration_seconds: number; is_active: boolean;
  starts_at: string; ends_at?: string; createdAt: string;
}

const MOCK_COMUNICADOS: Comunicado[] = [
  { id: 'c1', title: 'Samba-Enredo 2027 Definido!', message: 'A comunidade votou e o resultado saiu!', emoji: '🏆', accent_color: '#FFD874', duration_seconds: 6, is_active: true, starts_at: '2026-06-19T00:00:00Z', createdAt: '2026-06-19T10:00:00Z' },
  { id: 'c2', title: 'Show de Lançamento 2027', message: 'Dia 20 de novembro, Sambódromo do Anhembi!', emoji: '🎤', accent_color: '#00FF85', duration_seconds: 5, is_active: false, starts_at: '2026-11-01T00:00:00Z', createdAt: '2026-06-18T08:00:00Z' },
];

const ACCENT_OPTIONS = ['#00FF85', '#FFD874', '#FF4081', '#4FC3F7', '#818CF8', '#FF9800'];
const EMOJI_OPTIONS = ['📣', '🏆', '🎤', '🎭', '🥁', '💚', '🌟', '🎉', '📅', '👑', '💃'];

export default function AdminComunicados({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [comunicados, setComunicados] = useState<Comunicado[]>(MOCK_COMUNICADOS);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('📣');
  const [accentColor, setAccentColor] = useState('#00FF85');
  const [duration, setDuration] = useState('5');

  const handleCreate = () => {
    if (!title.trim() || !message.trim()) { Alert.alert('Atenção', 'Preencha título e mensagem.'); return; }
    const novo: Comunicado = { id: `c-${Date.now()}`, title: title.trim(), message: message.trim(), emoji, accent_color: accentColor, duration_seconds: parseInt(duration) || 5, is_active: true, starts_at: new Date().toISOString(), createdAt: new Date().toISOString() };
    setComunicados(prev => [novo, ...prev]);
    setShowForm(false); setTitle(''); setMessage('');
    Alert.alert('✅ Comunicado criado!', 'O splash será exibido para os usuários ao fazer login.');
  };

  const handleToggleActive = (id: string) => setComunicados(prev => prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
  const handleDelete = (id: string) => Alert.alert('Remover', 'Tem certeza?', [
    { text: 'Cancelar' },
    { text: 'Remover', style: 'destructive', onPress: () => setComunicados(prev => prev.filter(c => c.id !== id)) },
  ]);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <View style={styles.container}>
      <GlowBackground />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>📣 Comunicados</Text>
            <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.addBtn}>
              <Text style={styles.addBtnText}>{showForm ? '✕' : '+ Novo'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: Spacing.xl }}>
            {showForm && (
              <GlassCard style={{ marginBottom: 20 }}>
                <Text style={styles.formTitle}>Novo Comunicado</Text>
                <View style={[styles.preview, { borderColor: `${accentColor}44` }]}>
                  <View style={[styles.previewAccent, { backgroundColor: accentColor }]} />
                  <Text style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</Text>
                  <Text style={[styles.previewTitle, { color: accentColor }]}>{title || 'Título...'}</Text>
                  <Text style={styles.previewMsg}>{message || 'Mensagem...'}</Text>
                  <Text style={styles.previewDuration}>Fecha em {duration}s</Text>
                </View>
                <Text style={styles.fieldLabel}>Emoji</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: Spacing.base }}>
                  {EMOJI_OPTIONS.map(e => (
                    <TouchableOpacity key={e} onPress={() => setEmoji(e)} style={[styles.emojiChip, emoji === e && styles.emojiChipActive]}>
                      <Text style={{ fontSize: 22 }}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <Text style={styles.fieldLabel}>Cor de destaque</Text>
                <View style={styles.colorRow}>
                  {ACCENT_OPTIONS.map(opt => (
                    <TouchableOpacity key={opt} onPress={() => setAccentColor(opt)} style={[styles.colorChip, { backgroundColor: opt }, accentColor === opt && styles.colorChipActive]} />
                  ))}
                </View>
                <Text style={styles.fieldLabel}>Título *</Text>
                <TextInput value={title} onChangeText={setTitle} placeholder="Ex: Samba 2027 Definido!" placeholderTextColor={Colors.textMuted} style={styles.field} maxLength={60} />
                <Text style={styles.fieldLabel}>Mensagem *</Text>
                <TextInput value={message} onChangeText={setMessage} placeholder="Mensagem para os torcedores..." placeholderTextColor={Colors.textMuted} style={[styles.field, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]} multiline maxLength={200} />
                <Text style={styles.fieldLabel}>Duração (segundos)</Text>
                <TextInput value={duration} onChangeText={setDuration} placeholder="5" placeholderTextColor={Colors.textMuted} style={styles.field} keyboardType="numeric" maxLength={2} />
                <TouchableOpacity onPress={handleCreate} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing.sm }}>
                  <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
                    <Text style={styles.submitBtnText}>📣 Publicar Comunicado</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </GlassCard>
            )}

            <Text style={styles.sectionTitle}>Comunicados ({comunicados.length})</Text>
            <View style={{ gap: 12 }}>
              {comunicados.map(com => (
                <GlassCard key={com.id} intensity={22} noPadding>
                  <View style={[styles.comAccent, { backgroundColor: com.accent_color }]} />
                  <View style={styles.comContent}>
                    <View style={styles.comHeader}>
                      <Text style={{ fontSize: 24 }}>{com.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.comTitle}>{com.title}</Text>
                        <Text style={styles.comDate}>{formatDate(com.createdAt)}</Text>
                      </View>
                      <View style={[styles.activeBadge, { backgroundColor: com.is_active ? 'rgba(0,255,133,0.15)' : 'rgba(255,255,255,0.05)', borderColor: com.is_active ? 'rgba(0,255,133,0.3)' : Colors.glassBorder }]}>
                        <Text style={[styles.activeText, { color: com.is_active ? Colors.primaryBright : Colors.textMuted }]}>{com.is_active ? '● Ativo' : '○ Inativo'}</Text>
                      </View>
                    </View>
                    <Text style={styles.comMsg} numberOfLines={2}>{com.message}</Text>
                    <View style={styles.comMeta}>
                      <Text style={styles.comMetaText}>⏱️ {com.duration_seconds}s</Text>
                      <Text style={styles.comMetaText}>📅 {formatDate(com.starts_at)}</Text>
                    </View>
                    <View style={styles.comActions}>
                      <TouchableOpacity onPress={() => handleToggleActive(com.id)} style={[styles.comBtn, { borderColor: com.is_active ? '#FF5A5A' : 'rgba(0,255,133,0.4)' }]}>
                        <Text style={[styles.comBtnText, { color: com.is_active ? '#FF5A5A' : Colors.primaryBright }]}>{com.is_active ? '⏸ Pausar' : '▶ Ativar'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(com.id)} style={[styles.comBtn, { borderColor: 'rgba(255,90,90,0.3)' }]}>
                        <Text style={[styles.comBtnText, { color: '#FF5A5A' }]}>🗑️ Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 18 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800', flex: 1 },
  addBtn: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 7 },
  addBtnText: { fontSize: 13, color: Colors.primaryBright, fontWeight: '600' },
  formTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 16 },
  preview: { borderWidth: 1, borderRadius: Radius.lg, padding: 20, alignItems: 'center', marginBottom: 20, backgroundColor: Colors.glassLight, position: 'relative', overflow: 'hidden' },
  previewAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  previewTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  previewMsg: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 10 },
  previewDuration: { fontSize: 11, color: Colors.textMuted },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  field: { backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.md, paddingHorizontal: Spacing.base, height: 50, fontSize: 14, color: Colors.textPrimary, marginBottom: Spacing.base },
  emojiChip: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  emojiChipActive: { borderColor: 'rgba(0,255,133,0.5)', backgroundColor: Colors.primaryMuted },
  colorRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.base },
  colorChip: { width: 32, height: 32, borderRadius: 16 },
  colorChipActive: { borderWidth: 3, borderColor: '#fff' },
  submitBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  sectionTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 12 },
  comAccent: { height: 2 },
  comContent: { padding: 14 },
  comHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  comTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', marginBottom: 2 },
  comDate: { fontSize: 11, color: Colors.textMuted },
  activeBadge: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 4 },
  activeText: { fontSize: 11, fontWeight: '600' },
  comMsg: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  comMeta: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  comMetaText: { fontSize: 11, color: Colors.textMuted },
  comActions: { flexDirection: 'row', gap: 8 },
  comBtn: { flex: 1, height: 36, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  comBtnText: { fontSize: 12, fontWeight: '600' },
});
