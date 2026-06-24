import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_ALA_SHOW_REQUESTS, AdminAlaShowRequest } from '../../types/admin';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const STATUS_CONFIG: any = {
  novo: { label: 'Novo', color: Colors.primaryBright, emoji: '🆕' },
  em_contato: { label: 'Em contato', color: Colors.gold, emoji: '📞' },
  fechado: { label: 'Fechado', color: '#4FC3F7', emoji: '✅' },
  cancelado: { label: 'Cancelado', color: '#FF5A5A', emoji: '✕' },
};

export default function AdminAlaShow({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<AdminAlaShowRequest[]>(MOCK_ALA_SHOW_REQUESTS);
  const [selected, setSelected] = useState<AdminAlaShowRequest | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('todos');

  const filtered = requests.filter(r => activeFilter === 'todos' || r.status === activeFilter);
  const novos = requests.filter(r => r.status === 'novo').length;

  const handleChangeStatus = (id: string, newStatus: AdminAlaShowRequest['status']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setSelected(prev => prev?.id === id ? { ...prev, status: newStatus } : prev);
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { if (selected) setSelected(null); else navigation.goBack(); }} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💃 Ala Show</Text>
          {novos > 0 && <View style={styles.novoBadge}><Text style={styles.novoBadgeText}>{novos} novo{novos !== 1 ? 's' : ''}</Text></View>}
        </View>

        {selected ? (
          <View style={{ paddingHorizontal: Spacing.xl }}>
            <GlassCard style={{ marginBottom: 16 }}>
              <View style={styles.detailHeader}>
                <View style={styles.detailAvatar}><Text style={styles.detailAvatarText}>{selected.nome.charAt(0)}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailName}>{selected.nome}</Text>
                  {selected.empresa && <Text style={styles.detailEmpresa}>{selected.empresa}</Text>}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${STATUS_CONFIG[selected.status].color}22`, borderColor: `${STATUS_CONFIG[selected.status].color}44` }]}>
                  <Text style={[styles.statusText, { color: STATUS_CONFIG[selected.status].color }]}>{STATUS_CONFIG[selected.status].emoji} {STATUS_CONFIG[selected.status].label}</Text>
                </View>
              </View>
              {[
                { label: 'Email', val: selected.email, emoji: '📧' },
                { label: 'Telefone', val: selected.telefone ?? '—', emoji: '📱' },
                { label: 'Evento', val: selected.evento, emoji: '🎭' },
                { label: 'Data', val: selected.data, emoji: '📅' },
                { label: 'Convidados', val: selected.convidados ?? '—', emoji: '👥' },
              ].map((item, i) => (
                <View key={i} style={styles.detailItem}>
                  <Text style={styles.detailItemEmoji}>{item.emoji}</Text>
                  <View>
                    <Text style={styles.detailItemLabel}>{item.label}</Text>
                    <Text style={styles.detailItemVal}>{item.val}</Text>
                  </View>
                </View>
              ))}
              {selected.mensagem && (
                <View style={styles.mensagemBox}>
                  <Text style={styles.mensagemLabel}>Mensagem</Text>
                  <Text style={styles.mensagemText}>{selected.mensagem}</Text>
                </View>
              )}
            </GlassCard>

            <Text style={styles.sectionTitle}>Contato</Text>
            <View style={{ gap: 10, marginBottom: 20 }}>
              <TouchableOpacity onPress={() => Linking.openURL(`mailto:${selected.email}`)} style={styles.contactBtn}>
                <Text style={{ fontSize: 18 }}>📧</Text>
                <Text style={styles.contactBtnText}>Enviar Email</Text>
              </TouchableOpacity>
              {selected.telefone && (
                <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/55${selected.telefone?.replace(/\D/g, '')}`)} style={[styles.contactBtn, { borderColor: 'rgba(37,211,102,0.4)' }]}>
                  <Text style={{ fontSize: 18 }}>💬</Text>
                  <Text style={[styles.contactBtnText, { color: '#25D366' }]}>WhatsApp</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.sectionTitle}>Atualizar status</Text>
            <View style={{ gap: 8 }}>
              {(Object.keys(STATUS_CONFIG) as AdminAlaShowRequest['status'][]).map(status => (
                <TouchableOpacity key={status} onPress={() => handleChangeStatus(selected.id, status)} style={[styles.statusOption, selected.status === status && { borderColor: `${STATUS_CONFIG[status].color}66`, backgroundColor: `${STATUS_CONFIG[status].color}15` }]}>
                  <Text style={{ fontSize: 18 }}>{STATUS_CONFIG[status].emoji}</Text>
                  <Text style={[{ flex: 1, fontSize: 14, color: Colors.textSecondary }, selected.status === status && { color: STATUS_CONFIG[status].color }]}>{STATUS_CONFIG[status].label}</Text>
                  {selected.status === status && <Text style={{ color: STATUS_CONFIG[status].color }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ paddingHorizontal: Spacing.xl }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 18 }}>
              {(['todos', 'novo', 'em_contato', 'fechado', 'cancelado'] as const).map(f => (
                <TouchableOpacity key={f} onPress={() => setActiveFilter(f)} style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}>
                  <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                    {f === 'todos' ? 'Todos' : `${STATUS_CONFIG[f].emoji} ${STATUS_CONFIG[f].label}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ gap: 10 }}>
              {filtered.map(req => (
                <TouchableOpacity key={req.id} onPress={() => setSelected(req)} activeOpacity={0.85}>
                  <GlassCard intensity={22} noPadding>
                    <View style={styles.reqRow}>
                      <View style={styles.reqAvatar}><Text style={styles.reqAvatarText}>{req.nome.charAt(0)}</Text></View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reqNome}>{req.nome}</Text>
                        {req.empresa && <Text style={styles.reqEmpresa}>{req.empresa}</Text>}
                        <Text style={styles.reqEvento}>🎭 {req.evento} · 📅 {req.data}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: `${STATUS_CONFIG[req.status].color}22`, borderColor: `${STATUS_CONFIG[req.status].color}44` }]}>
                        <Text style={[styles.statusText, { color: STATUS_CONFIG[req.status].color }]}>{STATUS_CONFIG[req.status].emoji}</Text>
                      </View>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
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
  headerTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800', flex: 1 },
  novoBadge: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  novoBadgeText: { fontSize: 11, color: Colors.primaryBright, fontWeight: '700' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.glassLight },
  filterChipActive: { borderColor: 'rgba(0,255,133,0.5)', backgroundColor: Colors.primaryMuted },
  filterChipText: { fontSize: 12, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.primaryBright, fontWeight: '600' },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  reqAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,64,129,0.2)', alignItems: 'center', justifyContent: 'center' },
  reqAvatarText: { fontSize: 18, color: '#FF4081', fontWeight: '700' },
  reqNome: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', marginBottom: 2 },
  reqEmpresa: { fontSize: 12, color: Colors.textMuted, marginBottom: 2 },
  reqEvento: { fontSize: 11, color: Colors.textSecondary },
  statusBadge: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  detailAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,64,129,0.2)', alignItems: 'center', justifyContent: 'center' },
  detailAvatarText: { fontSize: 22, color: '#FF4081', fontWeight: '700' },
  detailName: { fontSize: 17, color: Colors.textPrimary, fontWeight: '700' },
  detailEmpresa: { fontSize: 12, color: Colors.textMuted },
  detailItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  detailItemEmoji: { fontSize: 16, width: 24 },
  detailItemLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 2 },
  detailItemVal: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  mensagemBox: { marginTop: 10, backgroundColor: Colors.glassLight, borderRadius: Radius.lg, padding: 14, borderWidth: 1, borderColor: Colors.glassBorder },
  mensagemLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 6, fontWeight: '600' },
  mensagemText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.glassLight },
  contactBtnText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  statusOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.glassLight },
  sectionTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 10 },
});
