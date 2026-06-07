import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Image, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEventsStore } from '../../store/eventsStore';
import { CATEGORY_CONFIG, EventCategory } from '../../types/events';
import { Colors, Spacing, Radius } from '../../theme';

const { width: W } = Dimensions.get('window');

const CATEGORIES = [
  { key: 'all', label: 'Todos', emoji: '📋' },
  { key: 'carnaval', label: 'Carnaval', emoji: '🎭' },
  { key: 'ensaio', label: 'Ensaios', emoji: '🥁' },
  { key: 'show', label: 'Shows', emoji: '🎤' },
  { key: 'evento', label: 'Eventos', emoji: '🎉' },
  { key: 'reuniao', label: 'Reuniões', emoji: '🤝' },
];

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getDayMonth = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    day: d.toLocaleDateString('pt-BR', { day: '2-digit' }),
    month: d.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
    weekday: d.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase(),
  };
};

export default function EventsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { events, featuredEvents, activeCategory, isLoading, loadEvents, loadFeatured, setCategory, getFilteredEvents } = useEventsStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();
    loadFeatured();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadEvents(), loadFeatured()]);
    setRefreshing(false);
  };

  const filtered = getFilteredEvents();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agenda</Text>
        <Text style={styles.headerSub}>Eventos oficiais da Mancha Verde</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* DESTAQUES */}
        {featuredEvents.length > 0 && activeCategory === 'all' && (
          <View style={{ marginBottom: Spacing.xl }}>
            <Text style={styles.sectionTitle}>⭐ Destaques</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 12 }}>
              {featuredEvents.map(event => {
                const cat = CATEGORY_CONFIG[event.category];
                const dm = getDayMonth(event.date);
                return (
                  <TouchableOpacity key={event.id} onPress={() => navigation.navigate('EventDetail', { eventId: event.id })} activeOpacity={0.9} style={styles.featuredCard}>
                    <LinearGradient colors={['#0d3d1a', '#051a0a']} style={StyleSheet.absoluteFillObject} />
                    <View style={[styles.featuredAccent, { backgroundColor: cat.color }]} />
                    <View style={styles.featuredCatBadge}>
                      <Text style={[styles.featuredCatText, { color: cat.color }]}>{cat.emoji} {cat.label.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.featuredTitle} numberOfLines={2}>{event.title}</Text>
                    <View style={styles.featuredMeta}>
                      <Text style={styles.featuredMetaText}>📅 {formatDate(event.date)} · {event.time}</Text>
                      <Text style={styles.featuredMetaText}>📍 {event.location}</Text>
                    </View>
                    <View style={styles.featuredFooter}>
                      <View style={styles.confirmedBadge}>
                        <Text style={styles.confirmedText}>👥 {event.confirmedCount} confirmados</Text>
                      </View>
                      <View style={[styles.priceBadge, { backgroundColor: event.isFree ? Colors.primaryMuted : Colors.goldMuted }]}>
                        <Text style={[styles.priceText, { color: event.isFree ? Colors.primary : Colors.gold }]}>
                          {event.isFree ? 'GRATUITO' : 'PAGO'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* CATEGORIAS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: 8, marginBottom: Spacing.base }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setCategory(cat.key)}
              style={[styles.catChip, activeCategory === cat.key && styles.catChipActive]}
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={[styles.catLabel, activeCategory === cat.key && styles.catLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LISTA */}
        <View style={{ paddingHorizontal: Spacing.xl }}>
          <Text style={[styles.sectionTitle, { marginBottom: Spacing.base }]}>
            {filtered.length} evento{filtered.length !== 1 ? 's' : ''}
          </Text>
          {filtered.map(event => {
            const cat = CATEGORY_CONFIG[event.category];
            const dm = getDayMonth(event.date);
            return (
              <TouchableOpacity
                key={event.id}
                onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
                activeOpacity={0.8}
                style={styles.eventCard}
              >
                {/* Data */}
                <View style={[styles.datebox, { borderColor: `${cat.color}44`, backgroundColor: `${cat.color}11` }]}>
                  <Text style={[styles.dateWeekday, { color: cat.color }]}>{dm.weekday}</Text>
                  <Text style={[styles.dateDay, { color: cat.color }]}>{dm.day}</Text>
                  <Text style={[styles.dateMonth, { color: cat.color }]}>{dm.month}</Text>
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <View style={styles.eventCatRow}>
                    <View style={[styles.catMini, { backgroundColor: `${cat.color}22`, borderColor: `${cat.color}44` }]}>
                      <Text style={[styles.catMiniText, { color: cat.color }]}>{cat.emoji} {cat.label}</Text>
                    </View>
                    {event.isFeatured && <Text style={styles.starBadge}>⭐</Text>}
                  </View>
                  <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
                  <Text style={styles.eventTime}>🕐 {event.time}{event.endTime ? ` — ${event.endTime}` : ''}</Text>
                  <Text style={styles.eventLocation} numberOfLines={1}>📍 {event.location}</Text>
                  <View style={styles.eventFooter}>
                    <Text style={styles.confirmedSmall}>👥 {event.confirmedCount}</Text>
                    <View style={[styles.priceMini, { backgroundColor: event.isFree ? Colors.primaryMuted : Colors.goldMuted }]}>
                      <Text style={[styles.priceMiniText, { color: event.isFree ? Colors.primary : Colors.gold }]}>
                        {event.isFree ? 'GRATUITO' : 'VER INGRESSOS'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.base, paddingTop: Spacing.sm },
  headerTitle: { fontSize: 28, color: Colors.textPrimary, fontWeight: '700' },
  headerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', paddingHorizontal: Spacing.xl },
  featuredCard: { width: W * 0.78, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, padding: Spacing.xl, position: 'relative', minHeight: 180 },
  featuredAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  featuredCatBadge: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 10 },
  featuredCatText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  featuredTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700', lineHeight: 24, marginBottom: 10 },
  featuredMeta: { gap: 4, marginBottom: 14 },
  featuredMetaText: { fontSize: 12, color: Colors.textSecondary },
  featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  confirmedBadge: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 },
  confirmedText: { fontSize: 11, color: Colors.textSecondary },
  priceBadge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 },
  priceText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bgCard },
  catChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryMuted },
  catEmoji: { fontSize: 13 },
  catLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  catLabelActive: { color: Colors.primary, fontWeight: '600' },
  eventCard: { flexDirection: 'row', gap: 14, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.sm },
  datebox: { width: 54, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, gap: 1 },
  dateWeekday: { fontSize: 9, fontWeight: '600', letterSpacing: 1 },
  dateDay: { fontSize: 22, fontWeight: '700', lineHeight: 26 },
  dateMonth: { fontSize: 9, fontWeight: '600', letterSpacing: 1 },
  eventCatRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  catMini: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  catMiniText: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  starBadge: { fontSize: 12 },
  eventTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', lineHeight: 20, marginBottom: 4 },
  eventTime: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  eventLocation: { fontSize: 11, color: Colors.textMuted, marginBottom: 8 },
  eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  confirmedSmall: { fontSize: 11, color: Colors.textMuted },
  priceMini: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3 },
  priceMiniText: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
});
