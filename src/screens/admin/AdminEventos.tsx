import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../services/supabase';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';
import { CATEGORY_CONFIG, EventCategory } from '../../types/events';

interface EventRow {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: string;
}

export default function AdminEventos({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Campos do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('evento');
  const [dateBR, setDateBR] = useState(''); // formato DD/MM/AAAA
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isFree, setIsFree] = useState(true);

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    setLoading(true);
    const { data } = await supabase.from('mancha_events').select('id, title, date, time, location, category, status').order('date', { ascending: true });
    if (data) setEvents(data);
    setLoading(false);
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setCategory('evento');
    setDateBR(''); setTime(''); setLocation(''); setAddress(''); setCity('São Paulo');
    setIsFeatured(false); setIsFree(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !dateBR.trim() || !time.trim() || !location.trim()) {
      Alert.alert('Atenção', 'Preencha ao menos: título, data, horário e local.');
      return;
    }

    // Converter DD/MM/AAAA -> AAAA-MM-DD
    const parts = dateBR.trim().split('/');
    if (parts.length !== 3 || parts[0].length !== 2 || parts[1].length !== 2 || parts[2].length !== 4) {
      Alert.alert('Data inválida', 'Use o formato DD/MM/AAAA, ex: 15/09/2026');
      return;
    }
    const [dd, mm, yyyy] = parts;
    const dateISO = `${yyyy}-${mm}-${dd}`;

    setSaving(true);
    const { error } = await supabase.from('mancha_events').insert({
      title: title.trim(),
      description: description.trim(),
      category,
      date: dateISO,
      time,
      location: location.trim(),
      address: address.trim(),
      city: city.trim(),
      is_featured: isFeatured,
      is_free: isFree,
      status: 'active',
    });
    setSaving(false);
    if (error) {
      Alert.alert('Erro ao salvar', error.message);
      return;
    }
    Alert.alert('✅ Evento criado!', '', [{ text: 'OK', onPress: () => { setShowForm(false); resetForm(); loadEvents(); } }]);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Excluir evento', `Tem certeza que deseja excluir "${title}"?`, [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        await supabase.from('mancha_events').delete().eq('id', id);
        loadEvents();
      }},
    ]);
  };

  const formatDate = (d: string) => {
    const [year, month, day] = d.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📅 Gerenciar Eventos</Text>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 20 }}>
          <TouchableOpacity onPress={() => setShowForm(!showForm)} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
            <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addBtn}>
              <Text style={styles.addBtnText}>{showForm ? '✕ Cancelar' : '+ Novo Evento'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {showForm && (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 24 }}>
            <GlassCard>
              <Text style={styles.label}>Título *</Text>
              <TextInput value={title} onChangeText={setTitle} placeholder="Ex: Ensaio Técnico" placeholderTextColor={Colors.textMuted} style={styles.input} />

              <Text style={styles.label}>Descrição</Text>
              <TextInput value={description} onChangeText={setDescription} placeholder="Detalhes do evento..." placeholderTextColor={Colors.textMuted} style={[styles.input, { height: 80, textAlignVertical: 'top' }]} multiline />

              <Text style={styles.label}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                {(Object.keys(CATEGORY_CONFIG) as EventCategory[]).map(cat => (
                  <TouchableOpacity key={cat} onPress={() => setCategory(cat)} style={[styles.catChip, category === cat && styles.catChipActive]}>
                    <Text style={styles.catChipText}>{CATEGORY_CONFIG[cat].emoji} {CATEGORY_CONFIG[cat].label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Data * (DD/MM/AAAA)</Text>
                  <TextInput value={dateBR} onChangeText={setDateBR} placeholder="15/09/2026" placeholderTextColor={Colors.textMuted} style={styles.input} keyboardType="numbers-and-punctuation" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Horário *</Text>
                  <TextInput value={time} onChangeText={setTime} placeholder="20:00" placeholderTextColor={Colors.textMuted} style={styles.input} />
                </View>
              </View>

              <Text style={styles.label}>Local *</Text>
              <TextInput value={location} onChangeText={setLocation} placeholder="Quadra da Mancha Verde" placeholderTextColor={Colors.textMuted} style={styles.input} />

              <Text style={styles.label}>Endereço</Text>
              <TextInput value={address} onChangeText={setAddress} placeholder="Rua Cantareira, 520" placeholderTextColor={Colors.textMuted} style={styles.input} />

              <Text style={styles.label}>Cidade</Text>
              <TextInput value={city} onChangeText={setCity} placeholder="São Paulo" placeholderTextColor={Colors.textMuted} style={styles.input} />

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Destacar na Agenda</Text>
                <Switch value={isFeatured} onValueChange={setIsFeatured} trackColor={{ true: Colors.primaryBright }} />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Evento gratuito</Text>
                <Switch value={isFree} onValueChange={setIsFree} trackColor={{ true: Colors.primaryBright }} />
              </View>

              <TouchableOpacity onPress={handleSave} disabled={saving} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: 18 }}>
                <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : '✓ Criar Evento'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </GlassCard>
          </View>
        )}

        <View style={{ paddingHorizontal: Spacing.xl, gap: 10 }}>
          {loading ? (
            <Text style={{ color: Colors.textMuted, textAlign: 'center', paddingTop: 20 }}>Carregando...</Text>
          ) : events.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 36 }}>📅</Text>
              <Text style={styles.emptyText}>Nenhum evento cadastrado ainda</Text>
            </View>
          ) : events.map(ev => (
            <GlassCard key={ev.id} intensity={22} noPadding>
              <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.evTitle}>{CATEGORY_CONFIG[ev.category as EventCategory]?.emoji ?? '🎉'} {ev.title}</Text>
                  <Text style={styles.evInfo}>{formatDate(ev.date)} às {ev.time} · {ev.location}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(ev.id, ev.title)} style={styles.deleteBtn}>
                  <Text style={{ fontSize: 14 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 18 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '800', flex: 1 },
  addBtn: { height: 48, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { fontSize: 14, color: Colors.textInverse, fontWeight: '700' },
  label: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 10, color: Colors.textPrimary, fontSize: 14 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.glassLight, marginRight: 8 },
  catChipActive: { borderColor: Colors.primaryBright, backgroundColor: Colors.primaryMuted },
  catChipText: { fontSize: 12, color: Colors.textPrimary },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  switchLabel: { fontSize: 13, color: Colors.textPrimary },
  saveBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { fontSize: 14, color: Colors.textInverse, fontWeight: '700' },
  evTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  evInfo: { fontSize: 12, color: Colors.textMuted },
  deleteBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,90,90,0.15)', alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingVertical: 50, gap: 10 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
});
