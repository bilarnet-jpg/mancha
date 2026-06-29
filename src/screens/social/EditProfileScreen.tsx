import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useSocialStore } from '../../store/socialStore';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const ALAS_SUGERIDAS = [
  'Bateria', 'Passistas', 'Comissão de Frente', 'Baianas',
  'Mestre-Sala', 'Porta-Bandeira', 'Destaque', 'Componente',
  'Diretoria', 'Ala das Crianças',
];

export default function EditProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { getProfile, updateProfile } = useSocialStore();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [selectedAlas, setSelectedAlas] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getProfile(user.id).then(profile => {
        if (profile) {
          setDisplayName(profile.display_name ?? user.displayName);
          setBio(profile.bio ?? '');
          setCity(profile.city ?? '');
          setSelectedAlas(profile.alas ?? []);
        }
      });
    }
  }, [user?.id]);

  const toggleAla = (ala: string) => {
    setSelectedAlas(prev =>
      prev.includes(ala) ? prev.filter(a => a !== ala) : [...prev, ala]
    );
  };

  const handleSave = async () => {
    if (!displayName.trim()) { Alert.alert('Atenção', 'O nome não pode estar vazio.'); return; }
    if (!user?.id) return;
    setSaving(true);
    await updateProfile(user.id, {
      display_name: displayName.trim(),
      bio: bio.trim(),
      city: city.trim(),
      alas: selectedAlas,
    });
    setSaving(false);
    Alert.alert('✅ Perfil atualizado!', '', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 60 }}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>✏️ Editar Perfil</Text>
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              <Text style={[styles.saveBtn, { opacity: saving ? 0.5 : 1 }]}>{saving ? 'Salvando...' : 'Salvar'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: Spacing.xl }}>

            <Text style={styles.fieldLabel}>Nome</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Seu nome"
              placeholderTextColor={Colors.textMuted}
              style={styles.field}
              maxLength={50}
            />

            <Text style={styles.fieldLabel}>Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Conte um pouco sobre você..."
              placeholderTextColor={Colors.textMuted}
              style={[styles.field, { height: 90, textAlignVertical: 'top', paddingTop: 12 }]}
              multiline
              maxLength={150}
            />
            <Text style={styles.charCount}>{bio.length}/150</Text>

            <Text style={styles.fieldLabel}>Cidade</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Ex: São Paulo"
              placeholderTextColor={Colors.textMuted}
              style={styles.field}
              maxLength={50}
            />

            <Text style={styles.fieldLabel}>Minhas Alas</Text>
            <Text style={styles.fieldSub}>Selecione as alas em que você já desfilou</Text>
            <View style={styles.alasGrid}>
              {ALAS_SUGERIDAS.map(ala => (
                <TouchableOpacity
                  key={ala}
                  onPress={() => toggleAla(ala)}
                  style={[styles.alaChip, selectedAlas.includes(ala) && styles.alaChipActive]}
                >
                  <Text style={[styles.alaChipText, selectedAlas.includes(ala) && styles.alaChipTextActive]}>
                    {ala}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleSave} disabled={saving} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginTop: 24 }}>
              <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveFullBtn}>
                <Text style={styles.saveFullBtnText}>{saving ? '⏳ Salvando...' : '✅ Salvar Perfil'}</Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, marginBottom: 24 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  saveBtn: { fontSize: 15, color: Colors.primaryBright, fontWeight: '700' },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8 },
  fieldSub: { fontSize: 11, color: Colors.textMuted, marginBottom: 10, marginTop: -4 },
  field: { backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.md, paddingHorizontal: Spacing.base, height: 50, fontSize: 14, color: Colors.textPrimary, marginBottom: Spacing.base },
  charCount: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', marginTop: -10, marginBottom: Spacing.base },
  alasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  alaChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.glassLight },
  alaChipActive: { borderColor: 'rgba(0,255,133,0.5)', backgroundColor: Colors.primaryMuted },
  alaChipText: { fontSize: 13, color: Colors.textSecondary },
  alaChipTextActive: { color: Colors.primaryBright, fontWeight: '600' },
  saveFullBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  saveFullBtnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
});
