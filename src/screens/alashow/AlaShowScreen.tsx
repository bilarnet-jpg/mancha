import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform, Dimensions, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const { width: W } = Dimensions.get('window');

const SERVICOS = [
  { emoji: '💃', title: 'Carnaval Corporativo', desc: 'Transforme seu evento empresarial numa explosão de alegria e cores com nossa ala show.' },
  { emoji: '🎉', title: 'Festas e Comemorações', desc: 'Aniversários, formaturas, casamentos — levamos o melhor do carnaval para qualquer celebração.' },
  { emoji: '🎭', title: 'Shows e Festivais', desc: 'Apresentações temáticas completas com passistas, baianas, mestre-sala e porta-bandeira.' },
  { emoji: '📺', title: 'Produções Audiovisuais', desc: 'Clipes, comerciais, séries e filmes com a autenticidade do carnaval paulistano.' },
];

const PORTFOLIO = [
  { id: '1', emoji: '🎭', title: 'Carnaval 2024', subtitle: 'Apresentação no Anhembi', gradient: ['#134227', '#0A1F14'] },
  { id: '2', emoji: '💃', title: 'Evento Corporativo', subtitle: 'São Paulo · 500 convidados', gradient: ['#1a0533', '#0d021a'] },
  { id: '3', emoji: '🥁', title: 'Festival de Verão', subtitle: 'Guarujá · 2023', gradient: ['#1a1000', '#0a0800'] },
  { id: '4', emoji: '🎤', title: 'Show de Lançamento', subtitle: 'Teatro Municipal · 2023', gradient: ['#0d1a33', '#051020'] },
];

const DEPOIMENTOS = [
  { nome: 'Carlos Mendes', empresa: 'TechCorp Brasil', texto: 'A Ala Show da Mancha Verde transformou nosso evento corporativo. Profissionalismo e talento incomparáveis!', emoji: '⭐⭐⭐⭐⭐' },
  { nome: 'Ana Paula', empresa: 'Eventos Premium SP', texto: 'Contratamos para 3 eventos seguidos. A qualidade e a energia são sempre impressionantes.', emoji: '⭐⭐⭐⭐⭐' },
];

// Template do email automático (HTML) — plugar no Resend/SendGrid quando decidir o serviço
const generateEmailHTML = (nome: string, evento: string, data: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #f5f5f0; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0A1F14, #134227); padding: 40px; text-align: center; }
    .header-title { color: #00FF85; font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0; }
    .header-sub { color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 6px; letter-spacing: 3px; }
    .divider { height: 3px; background: linear-gradient(90deg, #00FF85, #FFD874); }
    .body { padding: 40px; }
    .greeting { font-size: 20px; color: #1a1a1a; margin-bottom: 20px; }
    .text { font-size: 15px; color: #444; line-height: 1.8; margin-bottom: 16px; }
    .highlight { background: #f0faf4; border-left: 4px solid #00C46A; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0; }
    .highlight p { margin: 4px 0; color: #1a1a1a; font-size: 14px; }
    .highlight strong { color: #00C46A; }
    .section-title { font-size: 16px; color: #134227; font-weight: bold; margin: 28px 0 12px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    .servico { display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start; }
    .servico-emoji { font-size: 22px; }
    .servico-text strong { color: #1a1a1a; font-size: 14px; }
    .servico-text p { color: #666; font-size: 13px; margin: 2px 0 0; }
    .video-btn { display: inline-block; background: #134227; color: #00FF85; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; margin: 4px 6px 4px 0; font-weight: bold; }
    .prazo { background: #fff8e8; border: 1px solid #FFD874; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center; }
    .prazo strong { color: #B8860B; font-size: 15px; }
    .prazo p { color: #666; font-size: 13px; margin: 4px 0 0; }
    .footer { background: #0A1F14; padding: 30px 40px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.5); font-size: 12px; margin: 4px 0; }
    .footer strong { color: #00FF85; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p class="header-title">MANCHA VERDE</p>
      <p class="header-sub">ESCOLA DE SAMBA · ALA SHOW</p>
    </div>
    <div class="divider"></div>
    <div class="body">
      <p class="greeting">Olá, ${nome}! 🎭</p>
      <p class="text">Muito obrigado pelo seu interesse em contratar a <strong>Ala Show da Mancha Verde Paulistana</strong>! Recebemos sua solicitação e estamos muito animados com a possibilidade de levar a magia do nosso carnaval para o seu evento.</p>

      <div class="highlight">
        <p><strong>Evento:</strong> ${evento}</p>
        <p><strong>Data solicitada:</strong> ${data}</p>
        <p><strong>Status:</strong> Solicitação recebida ✅</p>
      </div>

      <p class="section-title">Sobre a Ala Show</p>
      <p class="text">A Ala Show da Mancha Verde é formada pelos melhores talentos do carnaval paulistano — passistas premiadas, baianas, mestre-sala, porta-bandeira e nossa famosa bateria mirim. Somos referência em apresentações para eventos corporativos, festivais, produções audiovisuais e celebrações especiais.</p>

      <p class="section-title">Nossos Serviços</p>
      <div class="servico"><span class="servico-emoji">💃</span><div class="servico-text"><strong>Carnaval Corporativo</strong><p>Transforme seu evento empresarial numa explosão de alegria</p></div></div>
      <div class="servico"><span class="servico-emoji">🎉</span><div class="servico-text"><strong>Festas e Comemorações</strong><p>Aniversários, formaturas, casamentos e mais</p></div></div>
      <div class="servico"><span class="servico-emoji">🎭</span><div class="servico-text"><strong>Shows e Festivais</strong><p>Apresentações temáticas completas com todo o elenco</p></div></div>
      <div class="servico"><span class="servico-emoji">📺</span><div class="servico-text"><strong>Produções Audiovisuais</strong><p>Clipes, comerciais, séries e filmes</p></div></div>

      <p class="section-title">Veja Nossas Apresentações</p>
      <p class="text">Conheça um pouco do nosso trabalho nos vídeos oficiais do canal Mancha Carnaval:</p>
      <a href="https://www.youtube.com/@ManchaCarnavalOficial/videos" class="video-btn">▶ Canal Oficial YouTube</a>
      <a href="https://www.youtube.com/watch?v=uObSmyGrzBM" class="video-btn">▶ Samba 2026</a>
      <a href="https://www.youtube.com/watch?v=jZzshxC2Nzs" class="video-btn">▶ Tricampeonato 2023</a>

      <div class="prazo">
        <strong>⏰ Retornaremos em até 2 dias úteis</strong>
        <p>Nossa equipe comercial analisará sua solicitação e entrará em contato com uma proposta personalizada.</p>
      </div>

      <p class="text">Qualquer dúvida, estamos à disposição. Até breve!</p>
      <p class="text">Com muito axé e carnaval,<br><strong>Equipe Mancha Verde Paulistana 🐍💚</strong></p>
    </div>
    <div class="footer">
      <p><strong>Mancha Verde Paulistana</strong></p>
      <p>Escola de Samba · São Paulo · Brasil</p>
      <p style="margin-top: 12px; font-size: 10px;">Você recebeu este email porque solicitou informações sobre a Ala Show através do app Mancha Carnaval.</p>
    </div>
  </div>
</body>
</html>
`;

export default function AlaShowScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [nome, setNome] = useState(user?.displayName ?? '');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [evento, setEvento] = useState('');
  const [data, setData] = useState('');
  const [convidados, setConvidados] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nome.trim() || !email.trim() || !evento.trim() || !data.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, email, tipo de evento e data.');
      return;
    }
    setLoading(true);

    // MOCK — quando integrar com Resend/SendGrid:
    // 1. Chamar edge function do Supabase que dispara o email
    // 2. Passar o HTML gerado por generateEmailHTML(nome, evento, data)
    // 3. Salvar a solicitação na tabela `ala_show_requests` do Supabase
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl }}>
        <GlowBackground />
        <Text style={{ fontSize: 72, marginBottom: Spacing.xl }}>💌</Text>
        <Text style={styles.successTitle}>Solicitação Enviada!</Text>
        <Text style={styles.successSub}>Enviamos um email para <Text style={{ color: Colors.primaryBright, fontWeight: '700' }}>{email}</Text> com todos os detalhes da Ala Show. Retornaremos em até 2 dias úteis!</Text>

        <GlassCard style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: Spacing.xl }}>
          <Text style={{ fontSize: 28 }}>⏰</Text>
          <View>
            <Text style={styles.prazoTitle}>Prazo de resposta</Text>
            <Text style={styles.prazoSub}>Até 2 dias úteis · Verifique seu email</Text>
          </View>
        </GlassCard>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ borderRadius: Radius.lg, overflow: 'hidden', width: '100%' }}
        >
          <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Voltar ao App</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlowBackground />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

          {/* HERO */}
          <LinearGradient colors={['#134227', '#1a5c2a', '#0A1F14']} style={styles.hero}>
            <View style={styles.heroGlow} />
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { top: insets.top + 12 }]}>
              <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
            </TouchableOpacity>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>💃 ALA SHOW</Text>
            </View>
            <Text style={styles.heroTitle}>Mancha Verde{'\n'}na sua Festa</Text>
            <Text style={styles.heroSub}>Leve a magia do carnaval paulistano para o seu evento. Profissionalismo, talento e muita alegria!</Text>
            <View style={styles.heroStats}>
              {[
                { val: '30+', label: 'Anos de história' },
                { val: '500+', label: 'Eventos realizados' },
                { val: '100%', label: 'Satisfação' },
              ].map((s, i) => (
                <View key={i} style={styles.heroStat}>
                  <Text style={styles.heroStatVal}>{s.val}</Text>
                  <Text style={styles.heroStatLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          <View style={{ paddingHorizontal: Spacing.xl }}>

            {/* SERVIÇOS */}
            <Text style={[styles.sectionTitle, { marginTop: 28 }]}>O que oferecemos</Text>
            <View style={{ gap: 10, marginBottom: 28 }}>
              {SERVICOS.map((s, i) => (
                <GlassCard key={i} intensity={25} noPadding>
                  <View style={styles.servicoRow}>
                    <View style={styles.servicoIconWrap}>
                      <Text style={{ fontSize: 26 }}>{s.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.servicoTitle}>{s.title}</Text>
                      <Text style={styles.servicoDesc}>{s.desc}</Text>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>

            {/* PORTFÓLIO */}
            <Text style={styles.sectionTitle}>Portfólio</Text>
            <Text style={styles.sectionSub}>Alguns dos eventos onde já levamos nossa magia</Text>
            <View style={styles.portfolioGrid}>
              {PORTFOLIO.map(item => (
                <View key={item.id} style={styles.portfolioCard}>
                  <LinearGradient colors={item.gradient as any} style={styles.portfolioGrad}>
                    <Text style={{ fontSize: 36 }}>{item.emoji}</Text>
                    <Text style={styles.portfolioTitle}>{item.title}</Text>
                    <Text style={styles.portfolioSub}>{item.subtitle}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>

            {/* VÍDEOS */}
            <TouchableOpacity
              onPress={() => Linking.openURL('https://www.youtube.com/@ManchaCarnavalOficial/videos')}
              style={{ marginBottom: 28 }}
            >
              <GlassCard style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={styles.ytIconWrap}>
                  <Text style={{ fontSize: 28 }}>▶</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.ytTitle}>Ver nosso canal no YouTube</Text>
                  <Text style={styles.ytSub}>Apresentações, ensaios e muito mais</Text>
                </View>
                <Text style={{ color: Colors.primaryBright, fontSize: 18 }}>→</Text>
              </GlassCard>
            </TouchableOpacity>

            {/* DEPOIMENTOS */}
            <Text style={styles.sectionTitle}>O que dizem sobre nós</Text>
            <View style={{ gap: 10, marginBottom: 28 }}>
              {DEPOIMENTOS.map((d, i) => (
                <GlassCard key={i} intensity={20}>
                  <Text style={styles.depoimentoStars}>{d.emoji}</Text>
                  <Text style={styles.depoimentoTexto}>"{d.texto}"</Text>
                  <Text style={styles.depoimentoNome}>{d.nome} · {d.empresa}</Text>
                </GlassCard>
              ))}
            </View>

            {/* FORMULÁRIO */}
            <View style={styles.formHeader}>
              <View style={styles.formAccent} />
              <Text style={styles.formTitle}>Solicitar Orçamento</Text>
              <Text style={styles.formSub}>Preencha o formulário e enviaremos um email completo com todos os detalhes. Retorno em até 2 dias úteis!</Text>
            </View>

            <Text style={styles.fieldLabel}>Seu nome *</Text>
            <TextInput value={nome} onChangeText={setNome} placeholder="Nome completo" placeholderTextColor={Colors.textMuted} style={styles.field} />

            <Text style={styles.fieldLabel}>Email *</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="seu@email.com" placeholderTextColor={Colors.textMuted} style={styles.field} keyboardType="email-address" autoCapitalize="none" />

            <Text style={styles.fieldLabel}>Telefone / WhatsApp</Text>
            <TextInput value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" placeholderTextColor={Colors.textMuted} style={styles.field} keyboardType="phone-pad" />

            <Text style={styles.fieldLabel}>Empresa / Organização</Text>
            <TextInput value={empresa} onChangeText={setEmpresa} placeholder="Nome da empresa (opcional)" placeholderTextColor={Colors.textMuted} style={styles.field} />

            <Text style={styles.fieldLabel}>Tipo de evento *</Text>
            <TextInput value={evento} onChangeText={setEvento} placeholder="Ex: Festa corporativa, casamento, show..." placeholderTextColor={Colors.textMuted} style={styles.field} />

            <Text style={styles.fieldLabel}>Data do evento *</Text>
            <TextInput value={data} onChangeText={setData} placeholder="Ex: 15/03/2027" placeholderTextColor={Colors.textMuted} style={styles.field} />

            <Text style={styles.fieldLabel}>Número estimado de convidados</Text>
            <TextInput value={convidados} onChangeText={setConvidados} placeholder="Ex: 200 pessoas" placeholderTextColor={Colors.textMuted} style={styles.field} keyboardType="numeric" />

            <Text style={styles.fieldLabel}>Mensagem / Detalhes adicionais</Text>
            <TextInput
              value={mensagem}
              onChangeText={setMensagem}
              placeholder="Conte mais sobre seu evento, local, horário, expectativas..."
              placeholderTextColor={Colors.textMuted}
              style={[styles.field, styles.fieldMultiline]}
              multiline
              numberOfLines={5}
              maxLength={600}
            />
            <Text style={styles.charCount}>{mensagem.length}/600</Text>

            <GlassCard intensity={20} style={{ flexDirection: 'row', gap: 10, marginBottom: Spacing.xl }}>
              <Text style={{ fontSize: 18 }}>📧</Text>
              <Text style={styles.emailInfoText}>Ao enviar, você receberá um email detalhado sobre a Ala Show com links do YouTube, informações completas e confirmação da sua solicitação.</Text>
            </GlassCard>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={{ borderRadius: Radius.lg, overflow: 'hidden', marginBottom: 40 }}
            >
              <LinearGradient colors={Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>{loading ? 'Enviando...' : '💌 Enviar Solicitação'}</Text>
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
  hero: { paddingTop: 100, paddingBottom: 36, paddingHorizontal: Spacing.xl, position: 'relative' },
  heroGlow: { position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(0,255,133,0.12)' },
  backBtn: { position: 'absolute', left: Spacing.xl, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  heroBadge: { backgroundColor: 'rgba(0,255,133,0.15)', borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 16 },
  heroBadgeText: { fontSize: 11, color: Colors.primaryBright, fontWeight: '700', letterSpacing: 1.5 },
  heroTitle: { fontSize: 34, color: Colors.textPrimary, fontWeight: '900', lineHeight: 38, marginBottom: 12, letterSpacing: -0.5 },
  heroSub: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 28 },
  heroStats: { flexDirection: 'row', gap: 0 },
  heroStat: { flex: 1, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', paddingVertical: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  heroStatVal: { fontSize: 22, color: Colors.primaryBright, fontWeight: '800' },
  heroStatLabel: { fontSize: 10, color: Colors.textTertiary, marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700', marginBottom: 6, letterSpacing: -0.2 },
  sectionSub: { fontSize: 13, color: Colors.textMuted, marginBottom: 14 },
  servicoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 16 },
  servicoIconWrap: { width: 50, height: 50, borderRadius: Radius.md, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  servicoTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  servicoDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  portfolioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  portfolioCard: { width: (W - Spacing.xl * 2 - 10) / 2, borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.glassBorder },
  portfolioGrad: { height: 130, alignItems: 'center', justifyContent: 'center', gap: 6 },
  portfolioTitle: { fontSize: 13, color: Colors.textPrimary, fontWeight: '700', textAlign: 'center' },
  portfolioSub: { fontSize: 10, color: Colors.textTertiary, textAlign: 'center' },
  ytIconWrap: { width: 52, height: 52, borderRadius: Radius.md, backgroundColor: 'rgba(255,0,0,0.15)', alignItems: 'center', justifyContent: 'center' },
  ytTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', marginBottom: 2 },
  ytSub: { fontSize: 12, color: Colors.textMuted },
  depoimentoStars: { fontSize: 13, marginBottom: 8 },
  depoimentoTexto: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, fontStyle: 'italic', marginBottom: 10 },
  depoimentoNome: { fontSize: 12, color: Colors.primaryBright, fontWeight: '600' },
  formHeader: { position: 'relative', marginBottom: 20 },
  formAccent: { position: 'absolute', top: 0, left: -Spacing.xl, right: -Spacing.xl, height: 2, backgroundColor: Colors.primaryBright },
  formTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', marginTop: 16, marginBottom: 6 },
  formSub: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 8, marginTop: 4 },
  field: { backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, borderRadius: Radius.md, paddingHorizontal: Spacing.base, height: 50, fontSize: 14, color: Colors.textPrimary, marginBottom: Spacing.base },
  fieldMultiline: { height: 130, textAlignVertical: 'top', paddingTop: 12 },
  charCount: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', marginTop: -12, marginBottom: Spacing.base },
  emailInfoText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 19 },
  actionBtn: { height: 54, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 16, color: Colors.textInverse, fontWeight: '700' },
  successTitle: { fontSize: 26, color: Colors.textPrimary, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  successSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  prazoTitle: { fontSize: 15, color: Colors.gold, fontWeight: '700' },
  prazoSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
});
