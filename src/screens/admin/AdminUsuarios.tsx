import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_ADMIN_USERS, AdminUser, AdminRole } from '../../types/admin';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const ROLE_CONFIG: Record<AdminRole, { label: string; color: string; emoji: string }> = {
  super_admin: { label: 'Super Admin', color: Colors.gold, emoji: '👑' },
  financeiro: { label: 'Financeiro', color: '#4FC3F7', emoji: '💰' },
  conteudo: { label: 'Conteúdo', color: Colors.primaryBright, emoji: '📸' },
  moderacao: { label: 'Moderação', color: '#FF9800', emoji: '🛡️' },
  comercial: { label: 'Comercial', color: '#FF4081', emoji: '💼' },
};

export default function AdminUsuarios({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filtered = users.filter(u =>
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleBlock = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    Alert.alert(
      user.isBlocked ? 'Desbloquear usuário' : 'Bloquear usuário',
      `${user.isBlocked ? 'Desbloquear' : 'Bloquear'} ${user.displayName}?`,
      [
        { text: 'Cancelar' },
        { text: user.isBlocked ? 'Desbloquear' : 'Bloquear', style: user.isBlocked ? 'default' : 'destructive',
          onPress: () => { setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u)); setSelectedUser(prev => prev?.id === userId ? { ...prev, isBlocked: !prev.isBlocked } : prev); }
        },
      ]
    );
  };

  const handleChangeRole = (userId: string, newRole: AdminRole) => {
    Alert.alert('Alterar função', `Definir como ${ROLE_CONFIG[newRole].label}?`, [
      { text: 'Cancelar' },
      { text: 'Confirmar', onPress: () => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setSelectedUser(prev => prev?.id === userId ? { ...prev, role: newRole } : prev);
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 110 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { if (selectedUser) setSelectedUser(null); else navigation.goBack(); }} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>👥 {selectedUser ? 'Perfil' : 'Usuários'}</Text>
        </View>

        {selectedUser ? (
          <View style={{ paddingHorizontal: Spacing.xl }}>
            <GlassCard style={{ alignItems: 'center', marginBottom: 16 }}>
              <LinearGradient colors={selectedUser.isPremium ? Colors.gradientGold as any : Colors.gradientPrimary as any} style={styles.detailAvatar}>
                <Text style={styles.detailAvatarText}>{selectedUser.displayName.charAt(0)}</Text>
              </LinearGradient>
              <Text style={styles.detailName}>{selectedUser.displayName}</Text>
              <Text style={styles.detailEmail}>{selectedUser.email}</Text>
              <View style={styles.detailBadges}>
                <View style={[styles.roleBadge, { borderColor: `${ROLE_CONFIG[selectedUser.role].color}44`, backgroundColor: `${ROLE_CONFIG[selectedUser.role].color}15` }]}>
                  <Text style={[styles.roleBadgeText, { color: ROLE_CONFIG[selectedUser.role].color }]}>{ROLE_CONFIG[selectedUser.role].emoji} {ROLE_CONFIG[selectedUser.role].label}</Text>
                </View>
                {selectedUser.isBlocked && <View style={styles.blockedBadge}><Text style={styles.blockedBadgeText}>🚫 Bloqueado</Text></View>}
              </View>
            </GlassCard>

            <Text style={styles.sectionTitle}>Função no painel</Text>
            <View style={{ gap: 8, marginBottom: 16 }}>
              {(Object.keys(ROLE_CONFIG) as AdminRole[]).map(role => (
                <TouchableOpacity key={role} onPress={() => handleChangeRole(selectedUser.id, role)} style={[styles.roleOption, selectedUser.role === role && styles.roleOptionActive]}>
                  <Text style={{ fontSize: 20 }}>{ROLE_CONFIG[role].emoji}</Text>
                  <Text style={{ flex: 1, fontSize: 14, color: Colors.textPrimary }}>{ROLE_CONFIG[role].label}</Text>
                  {selectedUser.role === role && <Text style={{ color: Colors.primaryBright }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={() => handleToggleBlock(selectedUser.id)} style={[styles.blockBtn, selectedUser.isBlocked && styles.unblockBtn]}>
              <Text style={[styles.blockBtnText, selectedUser.isBlocked && styles.unblockBtnText]}>
                {selectedUser.isBlocked ? '✓ Desbloquear' : '🚫 Bloquear Usuário'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ paddingHorizontal: Spacing.xl }}>
            <GlassCard noPadding intensity={30} borderRadius={Radius.full} style={{ marginBottom: 18 }}>
              <View style={styles.searchInner}>
                <Text style={{ fontSize: 15 }}>🔍</Text>
                <TextInput value={search} onChangeText={setSearch} placeholder="Buscar por nome ou email..." placeholderTextColor={Colors.textTertiary} style={styles.searchInput} />
                {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Text style={{ color: Colors.textTertiary }}>✕</Text></TouchableOpacity>}
              </View>
            </GlassCard>
            <View style={{ gap: 10 }}>
              {filtered.map(user => {
                const role = ROLE_CONFIG[user.role];
                return (
                  <TouchableOpacity key={user.id} onPress={() => setSelectedUser(user)} activeOpacity={0.85}>
                    <GlassCard intensity={22} noPadding>
                      <View style={styles.userRow}>
                        <LinearGradient colors={user.isPremium ? Colors.gradientGold as any : Colors.gradientPrimary as any} style={styles.userAvatar}>
                          <Text style={styles.userAvatarText}>{user.displayName.charAt(0)}</Text>
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={styles.userName}>{user.displayName}</Text>
                            {user.isBlocked && <Text style={{ fontSize: 12 }}>🚫</Text>}
                          </View>
                          <Text style={styles.userEmail}>{user.email}</Text>
                        </View>
                        <View style={[styles.roleBadge, { borderColor: `${role.color}44`, backgroundColor: `${role.color}15` }]}>
                          <Text style={[styles.roleBadgeText, { color: role.color }]}>{role.emoji}</Text>
                        </View>
                      </View>
                    </GlassCard>
                  </TouchableOpacity>
                );
              })}
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
  headerTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800' },
  searchInner: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, height: 46 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  userAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  userAvatarText: { fontSize: 18, color: Colors.textInverse, fontWeight: '700' },
  userName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  userEmail: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  roleBadge: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  roleBadgeText: { fontSize: 11, fontWeight: '700' },
  detailAvatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  detailAvatarText: { fontSize: 34, color: Colors.textInverse, fontWeight: '700' },
  detailName: { fontSize: 22, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  detailEmail: { fontSize: 14, color: Colors.textMuted, marginBottom: 14 },
  detailBadges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  blockedBadge: { backgroundColor: 'rgba(255,90,90,0.15)', borderWidth: 1, borderColor: 'rgba(255,90,90,0.3)', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  blockedBadgeText: { fontSize: 11, color: '#FF5A5A', fontWeight: '700' },
  sectionTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 10 },
  roleOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.glassBorder, backgroundColor: Colors.glassLight },
  roleOptionActive: { borderColor: 'rgba(0,255,133,0.5)', backgroundColor: Colors.primaryMuted },
  blockBtn: { height: 52, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: '#FF5A5A', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  blockBtnText: { fontSize: 15, color: '#FF5A5A', fontWeight: '600' },
  unblockBtn: { borderColor: Colors.primaryBright, backgroundColor: Colors.primaryMuted },
  unblockBtnText: { color: Colors.primaryBright },
});
