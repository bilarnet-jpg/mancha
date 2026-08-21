import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../services/supabase';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

export default function AdminSambas({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'atual' | 'historico' | 'enquete'>('atual');

  // Samba Atual
  const [atualId, setAtualId] = useState<string | null>(null);
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [composers, setComposers] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [youtubeId, setYoutubeId] = useState('');

  // Enquete
  const [pollId, setPollId] = useState<string | null>(null);
  const [pollOptions, setPollOptions] = useState<any[]>([]);
  const [showOptionForm, setShowOptionForm] = useState(false);
  const [oTitle, setOTitle] = useState('');
  const [oComposers, setOComposers] = useState('');
  const [oDescription, setODescription] = useState('');
  const [oEmoji, setOEmoji] = useState('🎭');
  const [oLyrics, setOLyrics] = useState('');
  const [oYoutubeId, setOYoutubeId] = useState('');

  // Histórico
  const [historico, setHistorico] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hYear, setHYear] = useState('');
  const [hTitle, setHTitle] = useState('');
  const [hComposers, setHComposers] = useState('');
  const [hYoutubeId, setHYoutubeId] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: atual } = await supabase.from('samba_atual').select('*').eq('is_active', true).order('year', { ascending: false }).limit(1).maybeSingle();
    if (atual) {
      setAtualId(atual.id);
      setYear(String(atual.year));
      setTitle(atual.title);
      setComposers(atual.composers);
      setLyrics(atual.lyrics);
      setYoutubeId(atual.youtube_id ?? '');
    }

    const { data: hist } = await supabase.from('sambas_historico').select('*').order('year', { ascending: false });
    setHistorico(hist ?? []);

    const { data: poll } = await supabase.from('samba_poll').select('*, samba_poll_options(*)').eq('is_open', true).order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (poll) {
      setPollId(poll.id);
      setPollOptions(poll.samba_poll_options ?? []);
    }

    setLoading(false);
  };

  const handleAddOption = async () => {
    if (!pollId) { Alert.alert('Atenção', 'Nenhuma enquete aberta encontrada.'); return; }
    if (!oTitle.trim() || !oComposers.trim() || !oDescription.trim()) {
      Alert.alert('Atenção', 'Preencha ao menos: título, compositores e descrição.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('samba_poll_options').insert({
      poll_id: pollId,
      title: oTitle.trim(),
      composers: oComposers.trim(),
      description: oDescription.trim(),
      emoji: oEmoji.trim() || '🎭',
      lyrics: oLyrics.trim() || null,
      youtube_id: oYoutubeId.trim() || null,
    });
    setSaving(false);
    if (error) { Alert.alert('Erro ao salvar', error.message); return; }
    setOTitle(''); setOComposers(''); setODescription(''); setOEmoji('🎭'); setOLyrics(''); setOYoutubeId('');
    setShowOptionForm(false);
    Alert.alert('✅ Opção adicionada à enquete!');
    loadData();
  };

  const handleDeleteOption = (id: string, title: string) => {
    Alert.alert('Excluir opção', `Remover "${title}" da enquete?`, [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        await supabase.from('samba_poll_options').delete().eq('id', id);
        loadData();
      }},
    ]);
  };

  const handleSaveAtual = async () => {
    if (!title.trim() || !composers.trim() || !year.trim()) {
      Alert.alert('Atenção', 'Preencha ao menos: ano, título e compositores.');
      return;
    }
    setSaving(true);
    const payload = {
      year: parseInt(year, 10),
      title: title.trim(),
      composers: composers.trim(),
      lyrics: lyrics.trim(),
      youtube_id: youtubeId.trim() || null,
    };

    let error;
    if (atualId) {
      ({ error } = await supabase.from('samba_atual').update(payload).eq('id', atualId));
    } else {
      ({ error } = await supabase.from('samba_atual').insert({ ...payload, is_active: true }));
    }

    setSaving(false);
    if (error) { Alert.alert('Erro ao salvar', error.message); return; }
    Alert.alert('✅ Samba Atual atualizado!');
    loadData();
  };

  const handleAddHistorico = async () => {
    if (!hYear.trim() || !hTitle.trim() || !hComposers.trim() || !hYoutubeId.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('sambas_historico').insert({
      year: parseInt(hYear, 10),
      title: hTitle.trim(),
      composers: hComposers.trim(),
      youtube_id: hYoutubeId.trim(),
    });
    setSaving(false);
    if (error) { Alert.alert('Erro ao salvar', error.message); return; }
    setHYear(''); setHTitle(''); setHComposers(''); setHYoutubeId('');
    setShowAddForm(false);
    Alert.alert('✅ Samba adicionado ao histórico!');
    loadData();
  };

  const handleDeleteHistorico = (id: string, title: string) => {
    Alert.alert('Excluir', `Remover "${title}" do histórico?`, [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        await supabase.from('sambas_historico').delete().eq('id', id);
        loadData();
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🎵 Sambas-Enredo</Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setTab('atual')} style={[styles.tab, tab === 'atual' && styles.tabActive]}>
            <Text style={[styles.tabText, tab === 'atual' && styles.tabTextActive]}>Samba Atual</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('historico')} style={[styles.tab, tab === 'historico' && styles.tabActive]}>
            <Text style={[styles.tabText, tab === 'historico' && styles.tabTextActive]}>Histórico ({historico.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('enquete')} style={[styles.tab, tab === 'enquete' && styles.tabActive]}>
            <Text style={[styles.tabText, tab === 'enquete' && styles.tabTextActive]}>Enquete ({pollOptions.length})</Text>
          </TouchableOpacity>
        </View>

        {tab === 'atual' && (
          <View style={{ paddingHorizontal: Spacing.xl }}>
            <GlassCard>
              <Text style={styles.label}>Ano *</Text>
              <TextInput value={year} onChangeText={setYear} placeholder="2026" placeholderTextColor={Colors.textMuted} style={styles.input} keyboardType="number-pad" />

              <Text style={styles.label}>Título *</Text>
              <TextInput value={title} onChangeText={setTitle} placeholder="Nome do samba-enredo" placeholderTextColor={Colors.textMuted} style={styles.input} />

              <Text style={styles.label}>Compositores *</Text>
              <TextInput value={composers} onChangeText={setComposers} placeholder="Grupo Mancha Verde" placeholderTextColor={Colors.textMuted} style={styles.input} />

              <Text style={styles.label}>Letra</Text>
              <TextInput value={lyrics} onChangeText={setLyrics} placeholder="Letra completa do samba..." placeholderTextColor={Colors.textMuted} style={[styles.input, { height: 120, textAlignVertical: 'top' }]} multiline />

              <Text style={styles.label}>ID do vídeo no YouTube</Text>
              <TextInput value={youtubeId} onChangeText={setYoutubeId} placeholder="Ex: uObSmyGrzBM" placeholderTextColor={Colors.textMuted} style={styles.input} autoCapitalize="none" />
              <Text style={styles.hint}>É o código que vem depois de "v=" no link do YouTube.</Text>

              <TouchableOpacity onPress={handleSaveAtual} disabled={saving} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: 18 }}>
                <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : '✓ Salvar Samba Atual'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </GlassCard>
          </View>
        )}

        {tab === 'historico' && (
          <View style={{ paddingHorizontal: Spacing.xl }}>
            <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginBottom: 16 }}>
              <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addBtn}>
                <Text style={styles.addBtnText}>{showAddForm ? '✕ Cancelar' : '+ Adicionar Samba ao Histórico'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {showAddForm && (
              <GlassCard style={{ marginBottom: 20 }}>
                <Text style={styles.label}>Ano *</Text>
                <TextInput value={hYear} onChangeText={setHYear} placeholder="2025" placeholderTextColor={Colors.textMuted} style={styles.input} keyboardType="number-pad" />

                <Text style={styles.label}>Título *</Text>
                <TextInput value={hTitle} onChangeText={setHTitle} placeholder="Nome do samba-enredo" placeholderTextColor={Colors.textMuted} style={styles.input} />

                <Text style={styles.label}>Compositores *</Text>
                <TextInput value={hComposers} onChangeText={setHComposers} placeholder="Grupo Mancha Verde" placeholderTextColor={Colors.textMuted} style={styles.input} />

                <Text style={styles.label}>ID do vídeo no YouTube *</Text>
                <TextInput value={hYoutubeId} onChangeText={setHYoutubeId} placeholder="Ex: JrzgHn-Ec3c" placeholderTextColor={Colors.textMuted} style={styles.input} autoCapitalize="none" />

                <TouchableOpacity onPress={handleAddHistorico} disabled={saving} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: 18 }}>
                  <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : '✓ Adicionar'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </GlassCard>
            )}

            <View style={{ gap: 10 }}>
              {loading ? (
                <Text style={{ color: Colors.textMuted, textAlign: 'center', paddingVertical: 20 }}>Carregando...</Text>
              ) : historico.map(samba => (
                <GlassCard key={samba.id} intensity={22} noPadding>
                  <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.hTitle}>{samba.year} — {samba.title}</Text>
                      <Text style={styles.hInfo}>{samba.composers}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteHistorico(samba.id, samba.title)} style={styles.deleteBtn}>
                      <Text style={{ fontSize: 14 }}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ))}
            </View>
          </View>
        )}
        {tab === 'enquete' && (
          <View style={{ paddingHorizontal: Spacing.xl }}>
            <TouchableOpacity onPress={() => setShowOptionForm(!showOptionForm)} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginBottom: 16 }}>
              <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addBtn}>
                <Text style={styles.addBtnText}>{showOptionForm ? '✕ Cancelar' : '+ Adicionar Opção à Enquete'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {showOptionForm && (
              <GlassCard style={{ marginBottom: 20 }}>
                <Text style={styles.label}>Emoji</Text>
                <TextInput value={oEmoji} onChangeText={setOEmoji} placeholder="🎭" placeholderTextColor={Colors.textMuted} style={styles.input} />

                <Text style={styles.label}>Título *</Text>
                <TextInput value={oTitle} onChangeText={setOTitle} placeholder="Nome do enredo concorrente" placeholderTextColor={Colors.textMuted} style={styles.input} />

                <Text style={styles.label}>Compositores *</Text>
                <TextInput value={oComposers} onChangeText={setOComposers} placeholder="Ala dos Compositores" placeholderTextColor={Colors.textMuted} style={styles.input} />

                <Text style={styles.label}>Descrição *</Text>
                <TextInput value={oDescription} onChangeText={setODescription} placeholder="Sobre o que é o enredo..." placeholderTextColor={Colors.textMuted} style={[styles.input, { height: 70, textAlignVertical: 'top' }]} multiline />

                <Text style={styles.label}>Letra (opcional)</Text>
                <TextInput value={oLyrics} onChangeText={setOLyrics} placeholder="Letra do samba, se já tiver..." placeholderTextColor={Colors.textMuted} style={[styles.input, { height: 100, textAlignVertical: 'top' }]} multiline />
                <Text style={styles.hint}>Deixe em branco se ainda não tiver a letra pronta.</Text>

                <Text style={styles.label}>ID do vídeo no YouTube (opcional)</Text>
                <TextInput value={oYoutubeId} onChangeText={setOYoutubeId} placeholder="Ex: uObSmyGrzBM" placeholderTextColor={Colors.textMuted} style={styles.input} autoCapitalize="none" />
                <Text style={styles.hint}>Deixe em branco se ainda não tiver vídeo.</Text>

                <TouchableOpacity onPress={handleAddOption} disabled={saving} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: 18 }}>
                  <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : '✓ Adicionar à Enquete'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </GlassCard>
            )}

            <View style={{ gap: 10 }}>
              {loading ? (
                <Text style={{ color: Colors.textMuted, textAlign: 'center', paddingVertical: 20 }}>Carregando...</Text>
              ) : pollOptions.length === 0 ? (
                <Text style={{ color: Colors.textMuted, textAlign: 'center', paddingVertical: 20 }}>Nenhuma opção cadastrada ainda.</Text>
              ) : pollOptions.map(opt => (
                <GlassCard key={opt.id} intensity={22} noPadding>
                  <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, marginRight: 10 }}>{opt.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.hTitle}>{opt.title}</Text>
                      <Text style={styles.hInfo}>{opt.composers}</Text>
                      <Text style={styles.hInfo}>{opt.lyrics ? '📝 Com letra' : '📝 Sem letra'} · {opt.youtube_id ? '🎬 Com vídeo' : '🎬 Sem vídeo'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteOption(opt.id, opt.title)} style={styles.deleteBtn}>
                      <Text style={{ fontSize: 14 }}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 18 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '800', flex: 1 },
  tabs: { flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: 8, marginBottom: 18 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', backgroundColor: Colors.glassLight },
  tabActive: { borderColor: 'rgba(0,255,133,0.5)', backgroundColor: Colors.primaryMuted },
  tabText: { fontSize: 12, color: Colors.textSecondary },
  tabTextActive: { color: Colors.primaryBright, fontWeight: '600' },
  label: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 10, color: Colors.textPrimary, fontSize: 14 },
  hint: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  saveBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { fontSize: 14, color: Colors.textInverse, fontWeight: '700' },
  addBtn: { height: 48, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { fontSize: 14, color: Colors.textInverse, fontWeight: '700' },
  hTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  hInfo: { fontSize: 12, color: Colors.textMuted },
  deleteBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,90,90,0.15)', alignItems: 'center', justifyContent: 'center' },
});
