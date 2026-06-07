import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Share, Linking, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEventsStore } from '../../store/eventsStore';
import { useAuthStore } from '../../store/authStore';
import { CATEGORY_CONFIG, MOCK_TICKET_TYPES } from '../../types/events';
import { Colors, Spacing, Radius } from '../../theme';

const { width: W } = Dimensions.get('window');

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
};

export default function EventDetailScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const insets = useSafeAreaInsets();
  const { selectedEvent, isLoading, selectEvent, buyFreeTicket, buyPixTicket, setCurrentOrder } = useEventsStore();
  const { user } = useAuthStore();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => { selectEvent(eventId); }, [eventId]);

  if (!selectedEvent || isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Colors.textMuted, fontSize: 16 }}>Carregando...</Text>
      </View>
    );
  }

  const event = selectedEvent;
  const cat = CATEGORY_CONFIG[event.category];
  const ticketTypes = MOCK_TICKET_TYPES.filter(t => t.eventId === eventId);
  const selected = ticketTypes.find(t => t.id === selectedTicket);

  const handleShare = async () => {
    await Share.share({
      title: event.title,
      message: `🎭 ${event.title}\n📅 ${formatDate(event.date)} às ${event.time}\n📍 ${event.location}\n\nVeja no app Mancha Carnaval!`,
    });
  };

  const handleMaps = () => {
    if (event.mapsURL) Linking.openURL(event.mapsURL);
    else Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(event.address + ', ' + event.city)}`);
  };

  const handleBuy = async () => {
    if (!user || !selectedTicket) return;
    setBuying(true);
    try {
      if (selected?.price === 0) {
        const order = await buyFreeTicket(user.id, event.id, selectedTicket, user.displayName);
        setCurrentOrder(order);
        navigation.navigate('TicketSuccess', { orderId: order.id });
      } else {
        const order = await buyPixTicket(user.id, event.id, selectedTicket, user.displayName);
        setCurrentOrder(order);
        navigation.navigate('PixPayment', { orderId: order.id });
      }
    } finally {
      setBuying(false);
    }
  };

  const availableTickets = ticketTypes.filter(t => t.isActive && t.sold < t.quantity);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* HERO BANNER */}
        <View style={styles.hero}>
          <LinearGradient colors={['#0d3d1a', '#1a5c2a', '#051a0a']} style={StyleSheet.absoluteFillObject} />
          <View style={[styles.heroAccent, { backgroundColor: cat.color }]} />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 72 }}>{cat.emoji}</Text>
          </View>
          <LinearGradient colors={['transparent', Colors.bg]} style={styles.heroOverlay} />

          {/* Botão voltar */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: insets.top + 12 }]}>
            <Text style={{ fontSize: 18, color: Colors.textPrimary }}>←</Text>
          </TouchableOpacity>

          {/* Botão compartilhar */}
          <TouchableOpacity onPress={handleShare} style={[styles.shareBtn, { top: insets.top + 12 }]}>
            <Text style={{ fontSize: 16 }}>📤</Text>
          </TouchableOpacity>
        </View>

        {/* CONTEÚDO */}
        <View style={styles.content}>
          {/* Categoria */}
          <View style={[styles.catBadge, { backgroundColor: `${cat.color}22`, borderColor: `${cat.color}44` }]}>
            <Text style={[styles.catBadgeText, { color: cat.color }]}>{cat.emoji} {cat.label.toUpperCase()}</Text>
          </View>

          <Text style={styles.title}>{event.title}</Text>

          {/* Info rápida */}
          <View style={styles.infoGrid}>
            <InfoItem icon="📅" label="Data" value={formatDate(event.date)} />
            <InfoItem icon="🕐" label="Horário" value={`${event.time}${event.endTime ? ` — ${event.endTime}` : ''}`} />
            <InfoItem icon="📍" label="Local" value={event.location} />
            <InfoItem icon="🏙️" label="Endereço" value={event.address} />
            {event.capacity && <InfoItem icon="👥" label="Capacidade" value={`${event.capacity.toLocaleString('pt-BR')} pessoas`} />}
            <InfoItem icon="✅" label="Confirmados" value={`${event.confirmedCount.toLocaleString('pt-BR')} pessoas`} />
          </View>

          {/* Descrição */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o Evento</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Mapa */}
          <TouchableOpacity onPress={handleMaps} style={styles.mapsBtn}>
            <LinearGradient colors={['#0d1a33', '#051020']} style={styles.mapsBtnInner}>
              <Text style={{ fontSize: 24 }}>🗺️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.mapsBtnTitle}>Ver no Mapa</Text>
                <Text style={styles.mapsBtnSub}>{event.address}, {event.city}</Text>
              </View>
              <Text style={{ fontSize: 18, color: '#4FC3F7' }}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* INGRESSOS */}
          {availableTickets.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎫 Ingressos Disponíveis</Text>
              {availableTickets.map(ticket => {
                const isSelected = selectedTicket === ticket.id;
                const remaining = ticket.quantity - ticket.sold;
                const isLow = remaining <= 50;
                return (
                  <TouchableOpacity
                    key={ticket.id}
                    onPress={() => setSelectedTicket(ticket.id)}
                    style={[styles.ticketCard, isSelected && styles.ticketCardSelected]}
                    activeOpacity={0.8}
                  >
                    {isSelected && <View style={styles.ticketSelectedAccent} />}
                    <View style={styles.ticketHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.ticketName}>{ticket.name}</Text>
                        <Text style={styles.ticketDesc}>{ticket.description}</Text>
                      </View>
                      <View style={styles.ticketPriceWrap}>
                        <Text style={styles.ticketPrice}>
                          {ticket.price === 0 ? 'GRÁTIS' : `R$ ${ticket.price.toFixed(2)}`}
                        </Text>
                        {ticket.lot > 1 && <Text style={styles.ticketLot}>{ticket.lot}º Lote</Text>}
                      </View>
                    </View>
                    {ticket.benefits && (
                      <View style={styles.benefitsRow}>
                        {ticket.benefits.map((b, i) => (
                          <View key={i} style={styles.benefitChip}>
                            <Text style={styles.benefitText}>✓ {b}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    <View style={styles.ticketFooter}>
                      {isLow && <Text style={styles.lowStock}>⚠️ Apenas {remaining} restantes!</Text>}
                      {isSelected && <Text style={styles.selectedLabel}>✓ Selecionado</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* BOTÃO COMPRAR FIXO */}
      {availableTickets.length > 0 && (
        <View style={[styles.buyBar, { paddingBottom: insets.bottom + 12 }]}>
          {selected && (
            <View style={styles.selectedSummary}>
              <Text style={styles.selectedSummaryName}>{selected.name}</Text>
              <Text style={styles.selectedSummaryPrice}>
                {selected.price === 0 ? 'Gratuito' : `R$ ${selected.price.toFixed(2)}`}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={handleBuy}
            disabled={!selectedTicket || buying}
            style={{ borderRadius: Radius.lg, overflow: 'hidden', flex: 1 }}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={selectedTicket ? Colors.gradientPrimary : ['#333', '#222']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.buyBtn}
            >
              <Text style={[styles.buyBtnText, { color: selectedTicket ? Colors.textInverse : Colors.textMuted }]}>
                {buying ? 'Processando...' : !selectedTicket ? 'Selecione um ingresso' : selected?.price === 0 ? '🎫 Garantir Ingresso Grátis' : '💳 Comprar via PIX'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 280, position: 'relative', overflow: 'hidden' },
  heroAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  backBtn: { position: 'absolute', left: Spacing.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  shareBtn: { position: 'absolute', right: Spacing.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.base },
  catBadge: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 10 },
  catBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  title: { fontSize: 26, color: Colors.textPrimary, fontWeight: '700', lineHeight: 32, marginBottom: Spacing.xl },
  infoGrid: { gap: 10, marginBottom: Spacing.xl },
  infoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md },
  infoIcon: { fontSize: 20, width: 28 },
  infoLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  infoValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', marginBottom: Spacing.base },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 24 },
  mapsBtn: { borderRadius: Radius.lg, overflow: 'hidden', marginBottom: Spacing.xl },
  mapsBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: Spacing.base, borderWidth: 1, borderColor: '#4FC3F733', borderRadius: Radius.lg },
  mapsBtnTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  mapsBtnSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  ticketCard: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.sm, position: 'relative', overflow: 'hidden' },
  ticketCardSelected: { borderColor: Colors.primary, backgroundColor: 'rgba(0,255,133,0.06)' },
  ticketSelectedAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primary },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  ticketName: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 2 },
  ticketDesc: { fontSize: 12, color: Colors.textMuted },
  ticketPriceWrap: { alignItems: 'flex-end' },
  ticketPrice: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
  ticketLot: { fontSize: 10, color: Colors.gold, fontWeight: '600' },
  benefitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  benefitChip: { backgroundColor: Colors.primaryMuted, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3 },
  benefitText: { fontSize: 10, color: Colors.primary, fontWeight: '500' },
  ticketFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lowStock: { fontSize: 11, color: Colors.red },
  selectedLabel: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  buyBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.bgCard, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.base, paddingHorizontal: Spacing.xl, gap: 10 },
  selectedSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectedSummaryName: { fontSize: 13, color: Colors.textSecondary },
  selectedSummaryPrice: { fontSize: 16, color: Colors.primary, fontWeight: '700' },
  buyBtn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  buyBtnText: { fontSize: 15, fontWeight: '700' },
});
