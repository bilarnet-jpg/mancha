import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../services/supabase';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';
import { CARD_CATEGORY_CONFIG, CardCategory } from '../../types/cards';

export default function AdminCardTemplates({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [category, setCategory] = useState<CardCategory>('aniversario');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => { loadTemplates(); }, []);

  const loadTemplates = async () => {
    setLoading(true);
    const { data } = await supabase.from('card_templates').select('*').order('created_at', { ascending: false });
    setTemplates(data ?? []);
    setLoading(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      aspect: [4, 5],
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setName(''); setDescription(''); setIsPremium(false); setImageUri(null); setCategory('aniversario');
  };

  const handleSave = async () => {
    if (!name.trim() || !imageUri) {
      Alert.alert('Atenção', 'Escolha uma imagem e preencha o nome do modelo.');
      return;
    }
    setSaving(true);
    try {
      const fileExt = imageUri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const fileName = `card-${Date.now()}.${fileExt}`;
      const contentType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;

      const response = await fetch(imageUri);
      const arrayBuffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('card-templates')
        .upload(fileName, arrayBuffer, { contentType });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('card-templates').getPublicUrl(fileName);

      const { error: insertError } = await supabase.from('card_templates').insert({
        category,
        name: name.trim(),
        description: description.trim(),
        image_url: urlData.publicUrl,
        is_premium: isPremium,
      });

      if (insertError) throw insertError;

      setSaving(false);
      setShowForm(false);
      resetForm();
      Alert.alert('✅ Modelo adicionado!');
      loadTemplates();
    } catch (e: any) {
      setSaving(false);
      Alert.alert('Erro ao salvar', e?.message ?? 'Não foi possível fazer upload da imagem.');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Excluir modelo', `Remover "${name}"?`, [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        await supabase.from('card_templates').delete().eq('id', id);
        loadTemplates();
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 120 }}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💌 Modelos de Cartões</Text>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 20 }}>
          <TouchableOpacity onPress={() => setShowForm(!showForm)} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
            <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addBtn}>
              <Text style={styles.addBtnText}>{showForm ? '✕ Cancelar' : '+ Novo Modelo'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {showForm && (
          <View style={{ paddingHorizontal: Spacing.xl, marginBottom: 24 }}>
            <GlassCard>
              <Text style={styles.label}>Imagem do cartão *</Text>
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={{ fontSize: 28 }}>🖼️</Text>
                    <Text style={styles.imagePlaceholderText}>Toque para escolher a imagem</Text>
                  </View>
                )}
              </TouchableOpacity>

              <Text style={styles.label}>Tema</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                {(Object.keys(CARD_CATEGORY_CONFIG) as CardCategory[]).filter(c => c !== 'certificado').map(cat => (
                  <TouchableOpacity key={cat} onPress={() => setCategory(cat)} style={[styles.catChip, category === cat && styles.catChipActive]}>
                    <Text style={styles.catChipText}>{CARD_CATEGORY_CONFIG[cat].emoji} {CARD_CATEGORY_CONFIG[cat].label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Nome do modelo *</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Ex: Feliz Aniversário Dourado" placeholderTextColor={Colors.textMuted} style={styles.input} />

              <Text style={styles.label}>Descrição</Text>
              <TextInput value={description} onChangeText={setDescription} placeholder="Breve descrição do modelo..." placeholderTextColor={Colors.textMuted} style={styles.input} />

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Modelo Premium</Text>
                <Switch value={isPremium} onValueChange={setIsPremium} trackColor={{ true: Colors.primaryBright }} />
              </View>

              <TouchableOpacity onPress={handleSave} disabled={saving} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: 18 }}>
                <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>{saving ? 'Enviando...' : '✓ Salvar Modelo'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </GlassCard>
          </View>
        )}

        <View style={{ paddingHorizontal: Spacing.xl, gap: 10 }}>
          {loading ? (
            <Text style={{ color: Colors.textMuted, textAlign: 'center', paddingTop: 20 }}>Carregando...</Text>
          ) : templates.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 36 }}>💌</Text>
              <Text style={styles.emptyText}>Nenhum modelo cadastrado ainda</Text>
            </View>
          ) : templates.map(tpl => (
            <GlassCard key={tpl.id} intensity={22} noPadding>
              <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: tpl.image_url }} style={styles.thumbImage} resizeMode="cover" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.tplName}>{tpl.name}</Text>
                  <Text style={styles.tplInfo}>{CARD_CATEGORY_CONFIG[tpl.category as CardCategory]?.label} {tpl.is_premium ? '· 👑 Premium' : ''}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(tpl.id, tpl.name)} style={styles.deleteBtn}>
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
  imagePicker: { borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.glassBorder },
  previewImage: { width: '100%', height: 180 },
  imagePlaceholder: { height: 180, backgroundColor: Colors.glassLight, alignItems: 'center', justifyContent: 'center', gap: 8 },
  imagePlaceholderText: { fontSize: 12, color: Colors.textMuted },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.glassLight, marginRight: 8 },
  catChipActive: { borderColor: Colors.primaryBright, backgroundColor: Colors.primaryMuted },
  catChipText: { fontSize: 12, color: Colors.textPrimary },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  switchLabel: { fontSize: 13, color: Colors.textPrimary },
  saveBtn: { height: 50, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { fontSize: 14, color: Colors.textInverse, fontWeight: '700' },
  thumbImage: { width: 50, height: 50, borderRadius: Radius.md },
  tplName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  tplInfo: { fontSize: 12, color: Colors.textMuted },
  deleteBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,90,90,0.15)', alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingVertical: 50, gap: 10 },
  emptyText: { fontSize: 14, color: Colors.textMuted },
});
