import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHistoriaStore } from '../../store/historiaStore';
import { useAuthStore } from '../../store/authStore';
import { RARITY_COLORS, ALL_ACHIEVEMENTS, ParadeRole } from '../../types/historia';
import { Colors, Spacing, Radius } from '../../theme';

// ── TIMELINE ──────────────────────────────────────────────────
export function TimelineScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { timeline, parades } = useHistoriaStore();

  const TYPE_CONFIG: Record<string, { color: string; bg: string }> = {
    parade: { color: '#FF4081', bg: 'rgba(255,64,129,0.12)' },
    event: { color: Colors.primary, bg: Colors.primaryMuted },
    achievement: { color: Colors.gold, bg: Colors.goldMuted },
    photo: { color: '#4FC3F7', bg: 'rgba(79,195,247,0.12)' },
    memory: { color: '#9C27B0', bg: 'rgba(156,39,176,0.12)' },
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📅 Linha do Tempo</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 100 }}>
        <Text style={styles.headerSub}>Sua trajetória na Mancha Verde, ano a ano</Text>

        {timeline.map((yearGroup, gi) => (
          <View key={yearGroup.year} style={styles.yearGroup}>
            {/* Ano */}
            <View style={styles.yearHeader}>
              <Text style={styles.yearNum}>{yearGroup.year}</Text>
              <View style={styles.yearLine} />
              <Text style={styles.yearCount}>{yearGroup.entries.length} momento{yearGroup.entries.length !== 1 ? 's' : ''}</Text>
            </View>

            {/* Entradas */}
            {yearGroup.entries.map((entry, ei) => {
              const cfg = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.event;
              const isLast = ei === yearGroup.entries.length - 1;
              return (
                <View key={entry.id} style={styles.entryRow}>
                  {/* Linha vertical */}
                  <View style={styles.entryLine}>
                    <View style={[styles.entryDot, { backgroundColor: cfg.color }]} />
                    {!isLast && <View style={[styles.entryConnector, { backgroundColor: `${cfg.color}33` }]} />}
                  </View>
                  {/* Conteúdo */}
                  <View style={[styles.entryCard, { borderColor: `${cfg.color}33`, backgroundColor: cfg.bg }]}>
                    <View style={styles.entryHeader}>
                      <Text style={{ fontSize: 20 }}>{entry.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.entryTitle}>{entry.title}</Text>
                        <Text style={styles.entryDate}>{new Date(entry.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</Text>
                      </View>
                    </View>
                    <Text style={styles.entryDesc}>{entry.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {timeline.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📅</Text>
            <Text style={styles.emptyTitle}>Nenhum registro ainda</Text>
            <Text style={styles.emptySub}>Comece registrando seu primeiro desfile!</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Parades')} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: 20 }}>
              <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>Registrar Desfile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ── PARADES ───────────────────────────────────────────────────
export function ParadesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { parades, addParade, removeParade } = useHistoriaStore();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [year, setYear] = useState('');
  const [enredo, setEnredo] = useState('');
  const [ala, setAla] = useState('');
  const [role, setRole] = useState<ParadeRole>('componente');
  const [notes, setNotes] = useState('');

  const ROLES: { key: ParadeRole; label: string; emoji: string }[] = [
    { key: 'componente', label: 'Componente', emoji: '🎭' },
    { key: 'destaque', label: 'Destaque', emoji: '✨' },
    { key: 'bateria', label: 'Bateria', emoji: '🥁' },
    { key: 'comissao_frente', label: 'Comissão de Frente', emoji: '💃' },
    { key: 'direcao', label: 'Direção', emoji: '👔' },
    { key: 'outro', label: 'Outro', emoji: '🌟' },
  ];

  const handleAdd = () => {
    if (!year || !enredo || !ala) { Alert.alert('Atenção', 'Preencha ano, enredo e ala.'); return; }
    if (!user) return;
    addParade({ userId: user.id, year: parseInt(year), enredo, ala, role, notes, photoURLs: [] });
    setShowForm(false); setYear(''); setEnredo(''); setAla(''); setNotes('');
    Alert.alert('🎭 Desfile Registrado!', `Seu desfile de ${year} foi adicionado à sua história!`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎭 Meus Desfiles</Text>
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
              <Text style={styles.formTitle}>Registrar Novo Desfile</Text>
              <Text style={styles.fieldLabel}>Ano *</Text>
              <TextInput value={year} onChangeText={setYear} placeholder="Ex: 2025" placeholderTextColor={Colors.textMuted} style={styles.field} keyboardType="numeric" maxLength={4} />
              <Text style={styles.fieldLabel}>Enredo *</Text>
              <TextInput value={enredo} onChangeText={setEnredo} placeholder="Ex: Do Verde que Sangra, Nasce a Chama" placeholderTextColor={Colors.textMuted} style={styles.field} />
              <Text style={styles.fieldLabel}>Ala *</Text>
              <TextInput value={ala} onChangeText={setAla} placeholder="Ex: Ala das Deusas" placeholderTextColor={Colors.textMuted} style={styles.field} />
              <Text style={styles.fieldLabel}>Função</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: Spacing.base }}>
                {ROLES.map(r => (
                  <TouchableOpacity key={r.key} onPress={() => setRole(r.key)} style={[styles.roleChip, role === r.key && styles.roleChipActive]}>
                    <Text style={styles.roleEmoji}>{r.emoji}</Text>
                    <Text style={[styles.roleLabel, role === r.key && styles.roleLabelActive]}>{r.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.fieldLabel}>Observações</Text>
              <TextInput value={notes} onChangeText={setNotes} placeholder="Sua memória sobre este desfile..." placeholderTextColor={Colors.textMuted} style={[styles.field, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]} multiline />
              <TouchableOpacity onPress={handleAdd} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
                <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
                  <Text style={styles.submitBtnText}>🎭 Registrar Desfile</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de desfiles */}
          {parades.length === 0 && !showForm ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>🎭</Text>
              <Text style={styles.emptyTitle}>Nenhum desfile ainda</Text>
              <Text style={styles.emptySub}>Registre sua participação nos desfiles da Mancha Verde!</Text>
            </View>
          ) : (
            parades.map(parade => (
              <View key={parade.id} style={styles.paradeCard}>
                <LinearGradient colors={['#1a0533', '#0d021a']} style={styles.paradeGrad}>
                  <View style={styles.paradeAccent} />
                  <View style={styles.paradeHeader}>
                    <Text style={styles.paradeYear}>{parade.year}</Text>
                    <View style={styles.paradeRoleBadge}>
                      <Text style={styles.paradeRoleText}>{ROLES.find(r => r.key === parade.role)?.emoji} {ROLES.find(r => r.key === parade.role)?.label}</Text>
                    </View>
                    <TouchableOpacity onPress={() => Alert.alert('Remover', 'Remover este desfile?', [{ text: 'Cancelar' }, { text: 'Remover', style: 'destructive', onPress: () => removeParade(parade.id) }])}>
                      <Text style={{ color: Colors.textMuted, fontSize: 16 }}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.paradeEnredo}>{parade.enredo}</Text>
                  <Text style={styles.paradeAla}>🎭 {parade.ala}</Text>
                  {parade.notes && <Text style={styles.paradeNotes}>"{parade.notes}"</Text>}
                </LinearGradient>
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── ACHIEVEMENTS ──────────────────────────────────────────────
export function AchievementsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { achievements, getLockedAchievements } = useHistoriaStore();
  const locked = getLockedAchievements();
  const [activeTab, setActiveTab] = useState<'earned' | 'locked'>('earned');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏅 Conquistas</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('earned')} style={[styles.tab, activeTab === 'earned' && styles.tabActive]}>
          <Text style={[styles.tabText, activeTab === 'earned' && styles.tabTextActive]}>Conquistadas ({achievements.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('locked')} style={[styles.tab, activeTab === 'locked' && styles.tabActive]}>
          <Text style={[styles.tabText, activeTab === 'locked' && styles.tabTextActive]}>Bloqueadas ({locked.length})</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 100 }}>
        {activeTab === 'earned' ? (
          achievements.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>🏅</Text>
              <Text style={styles.emptyTitle}>Nenhuma conquista ainda</Text>
              <Text style={styles.emptySub}>Participe de eventos e registre sua história!</Text>
            </View>
          ) : (
            achievements.map(ach => (
              <View key={ach.id} style={[styles.achFullCard, { borderColor: `${RARITY_COLORS[ach.rarity]}44` }]}>
                <View style={[styles.achFullAccent, { backgroundColor: RARITY_COLORS[ach.rarity] }]} />
                <View style={styles.achFullHeader}>
                  <View style={[styles.achFullIcon, { backgroundColor: `${RARITY_COLORS[ach.rarity]}22` }]}>
                    <Text style={{ fontSize: 32 }}>{ach.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.achFullTitle}>{ach.title}</Text>
                    <Text style={styles.achFullDesc}>{ach.description}</Text>
                    <View style={[styles.rarityBadge, { backgroundColor: `${RARITY_COLORS[ach.rarity]}22` }]}>
                      <Text style={[styles.rarityBadgeText, { color: RARITY_COLORS[ach.rarity] }]}>{ach.rarity.toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={styles.xpBadge}>
                    <Text style={styles.xpBadgeText}>+{ach.xpReward}</Text>
                    <Text style={styles.xpBadgeLabel}>XP</Text>
                  </View>
                </View>
                <Text style={styles.achDate}>Desbloqueada em {new Date(ach.unlockedAt).toLocaleDateString('pt-BR')}</Text>
              </View>
            ))
          )
        ) : (
          locked.map(ach => (
            <View key={ach.key} style={[styles.achFullCard, styles.achFullCardLocked]}>
              <View style={styles.achFullHeader}>
                <View style={[styles.achFullIcon, { opacity: 0.3 }]}>
                  <Text style={{ fontSize: 32 }}>{ach.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.achFullTitle, { color: Colors.textMuted }]}>{ach.title}</Text>
                  <Text style={styles.achFullDesc}>{ach.description}</Text>
                  <View style={styles.requirementBadge}>
                    <Text style={styles.requirementText}>🔒 {ach.rarity}</Text>
                  </View>
                </View>
                <View style={[styles.xpBadge, { opacity: 0.4 }]}>
                  <Text style={styles.xpBadgeText}>+{ach.xpReward}</Text>
                  <Text style={styles.xpBadgeLabel}>XP</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  headerSub: { fontSize: 13, color: Colors.textMuted, marginBottom: Spacing.xl },
  yearGroup: { marginBottom: Spacing.xxl },
  yearHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.base },
  yearNum: { fontSize: 28, color: Colors.primary, fontWeight: '900', minWidth: 60 },
  yearLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  yearCount: { fontSize: 12, color: Colors.textMuted },
  entryRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.sm },
  entryLine: { alignItems: 'center', width: 20 },
  entryDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  entryConnector: { flex: 1, width: 2, marginTop: 4 },
  entryCard: { flex: 1, borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm },
  entryHeader: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  entryTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', flex: 1 },
  entryDate: { fontSize: 11, color: Colors.textMuted },
  entryDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  emptySub: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
  emptyBtn: { height: 48, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  emptyBtnText: { fontSize: 14, color: Colors.textInverse, fontWeight: '700' },
  form: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.xl, position: 'relative', overflow: 'hidden' },
  formAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#FF4081' },
  formTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  field: { backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.base, height: 50, fontSize: 14, color: Colors.textPrimary, marginBottom: Spacing.base },
  roleChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bg },
  roleChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  roleEmoji: { fontSize: 14 },
  roleLabel: { fontSize: 12, color: Colors.textSecondary },
  roleLabelActive: { color: Colors.primary, fontWeight: '600' },
  submitBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 14, color: Colors.textInverse, fontWeight: '700' },
  paradeCard: { borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.base },
  paradeGrad: { padding: Spacing.xl, position: 'relative' },
  paradeAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#FF4081' },
  paradeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  paradeYear: { fontSize: 26, color: '#FF408133', fontWeight: '900', flex: 1 },
  paradeRoleBadge: { backgroundColor: 'rgba(255,64,129,0.15)', borderWidth: 1, borderColor: 'rgba(255,64,129,0.3)', borderRadius: Radius.md, paddingHorizontal: 8, paddingVertical: 4 },
  paradeRoleText: { fontSize: 11, color: '#FF4081', fontWeight: '600' },
  paradeEnredo: { fontSize: 17, color: Colors.textPrimary, fontWeight: '700', marginBottom: 6, lineHeight: 22 },
  paradeAla: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  paradeNotes: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic', lineHeight: 20 },
  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: 8, marginBottom: Spacing.base },
  tab: { flex: 1, paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  tabActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  tabText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: Colors.primary, fontWeight: '600' },
  achFullCard: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.xl, padding: Spacing.base, marginBottom: Spacing.sm, position: 'relative', overflow: 'hidden' },
  achFullCardLocked: { opacity: 0.6 },
  achFullAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  achFullHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  achFullIcon: { width: 60, height: 60, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  achFullTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
  achFullDesc: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6, lineHeight: 18 },
  rarityBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start' },
  rarityBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  requirementBadge: { backgroundColor: Colors.border, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start' },
  requirementText: { fontSize: 9, color: Colors.textMuted, fontWeight: '600' },
  xpBadge: { alignItems: 'center', backgroundColor: Colors.primaryMuted, borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: `${Colors.primary}33` },
  xpBadgeText: { fontSize: 16, color: Colors.primary, fontWeight: '700' },
  xpBadgeLabel: { fontSize: 9, color: Colors.primary, letterSpacing: 1 },
  achDate: { fontSize: 11, color: Colors.textMuted, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.border },
});
