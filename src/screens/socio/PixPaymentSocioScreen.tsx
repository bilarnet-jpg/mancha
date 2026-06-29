import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Linking, Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';

const PIX_KEY = '11999999999'; // TROCAR pela chave PIX real da Mancha Verde
const WHATSAPP_NUMBER = '5511999999999'; // TROCAR pelo WhatsApp real da Mancha Verde

export default function PixPaymentSocioScreen({ route, navigation }: any) {
  const { billingCycle, amount } = route.params ?? { billingCycle: 'monthly', amount: 10 };
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const pixCode = `00020126580014BR.GOV.BCB.PIX0136${PIX_KEY}5204000053039865406${amount.toFixed(2).replace('.', '')}5802BR5920MANCHA VERDE CARNAVAL6009SAO PAULO62140510SOCIO${Date.now().toString().slice(-6)}6304`;

  const handleCopyPix = () => {
    Clipboard.setString(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Olá! Sou ${user?.displayName} (${user?.email}) e acabei de realizar o pagamento do plano *Mancha Verde eu sou* (${billingCycle === 'monthly' ? 'R$10/mês' : 'R$100/ano'}).\n\nSegue o comprovante em anexo! 🐍💚`
    );
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`);
  };

  const handleSimulate = () => {
    Alert.alert(
      '🧪 Simular Pagamento',
      'Isso é apenas para testes. Em produção, o pagamento será verificado pelo admin após o comprovante.',
      [
        { text: 'Cancelar' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setSimulating(true);
            await new Promise(r => setTimeout(r, 1500));
            // Ativar premium no store local
            if (user) {
              useAuthStore.setState({ user: { ...user, isPremium: true, isAdmin: user.isAdmin } });
            }
            setSimulating(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
            Alert.alert('🎉 Bem-vindo!', 'Você agora é membro Mancha Verde eu sou! Aproveite todos os benefícios!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <GlowBackground />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 60 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>💰 Pagamento PIX</Text>
        </View>

        <View style={{ paddingHorizontal: Spacing.xl }}>

          {/* RESUMO */}
          <GlassCard style={{ marginBottom: 20, alignItems: 'center' }}>
            <View style={styles.resumoAccent} />
            <Text style={styles.resumoLabel}>PLANO SELECIONADO</Text>
            <Text style={styles.resumoPlano}>💚 Mancha Verde eu sou</Text>
            <Text style={styles.resumoValor}>
              R$ {billingCycle === 'monthly' ? '10,00' : '100,00'}
            </Text>
            <Text style={styles.resumoPeriodo}>
              {billingCycle === 'monthly' ? 'Cobrança mensal' : 'Cobrança anual · Economia de R$20!'}
            </Text>
          </GlassCard>

          {/* QR CODE PIX */}
          <GlassCard style={{ marginBottom: 20, alignItems: 'center' }}>
            <Text style={styles.qrTitle}>QR Code PIX</Text>
            <Text style={styles.qrSub}>Abra o app do seu banco e escaneie</Text>
            <View style={styles.qrBox}>
              <QRCode
                value={pixCode}
                size={200}
                color={Colors.textPrimary}
                backgroundColor="transparent"
              />
            </View>
            <View style={styles.pixKeyRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pixKeyLabel}>Chave PIX</Text>
                <Text style={styles.pixKeyValue}>{PIX_KEY}</Text>
              </View>
            </View>
          </GlassCard>

          {/* COPIAR PIX */}
          <TouchableOpacity onPress={handleCopyPix} style={{ borderRadius: Radius.lg, overflow: 'hidden', marginBottom: 12 }}>
            <LinearGradient colors={copied ? ['#00C46A', '#00FF85'] : Colors.gradientPrimary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>{copied ? '✓ Código PIX Copiado!' : '📋 Copiar Código PIX'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* INSTRUÇÕES */}
          <GlassCard style={{ marginBottom: 20 }}>
            <Text style={styles.instrTitle}>Como pagar:</Text>
            {[
              'Abra o app do seu banco',
              'Acesse a opção PIX',
              'Escaneie o QR Code ou cole o código PIX',
              `Confirme o valor de R$ ${billingCycle === 'monthly' ? '10,00' : '100,00'}`,
              'Após o pagamento, envie o comprovante pelo WhatsApp',
            ].map((step, i) => (
              <View key={i} style={styles.instrRow}>
                <View style={styles.instrNum}>
                  <Text style={styles.instrNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.instrText}>{step}</Text>
              </View>
            ))}
          </GlassCard>

          {/* ENVIAR COMPROVANTE */}
          <TouchableOpacity onPress={handleWhatsApp} style={styles.whatsappBtn}>
            <Text style={{ fontSize: 22 }}>💬</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.whatsappBtnTitle}>Já paguei!</Text>
              <Text style={styles.whatsappBtnSub}>Enviar comprovante pelo WhatsApp</Text>
            </View>
            <Text style={{ color: '#25D366', fontSize: 16 }}>→</Text>
          </TouchableOpacity>

          {/* SIMULAÇÃO — só pra testes */}
          <TouchableOpacity onPress={handleSimulate} disabled={simulating} style={styles.simulateBtn}>
            <Text style={styles.simulateBtnText}>
              {simulating ? '⏳ Processando...' : '🧪 Simular pagamento (apenas testes)'}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, marginBottom: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, color: Colors.textPrimary, fontWeight: '800' },
  resumoAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primaryBright, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  resumoLabel: { fontSize: 10, color: Colors.textMuted, letterSpacing: 1.5, fontWeight: '700', marginBottom: 8 },
  resumoPlano: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', marginBottom: 6 },
  resumoValor: { fontSize: 42, color: Colors.primaryBright, fontWeight: '900', letterSpacing: -1 },
  resumoPeriodo: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  qrTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  qrSub: { fontSize: 12, color: Colors.textMuted, marginBottom: 20 },
  qrBox: { padding: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.glassBorder, marginBottom: 20 },
  pixKeyRow: { width: '100%', backgroundColor: Colors.glassLight, borderRadius: Radius.md, padding: 14, borderWidth: 1, borderColor: Colors.glassBorder },
  pixKeyLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 4, letterSpacing: 1 },
  pixKeyValue: { fontSize: 16, color: Colors.primaryBright, fontWeight: '700' },
  actionBtn: { height: 54, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 16, color: Colors.textInverse, fontWeight: '700' },
  instrTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700', marginBottom: 14 },
  instrRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  instrNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', alignItems: 'center', justifyContent: 'center' },
  instrNumText: { fontSize: 12, color: Colors.primaryBright, fontWeight: '700' },
  instrText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  whatsappBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(37,211,102,0.1)', borderWidth: 1, borderColor: 'rgba(37,211,102,0.3)', borderRadius: Radius.lg, padding: 16, marginBottom: 12 },
  whatsappBtnTitle: { fontSize: 15, color: '#25D366', fontWeight: '700' },
  whatsappBtnSub: { fontSize: 12, color: Colors.textMuted },
  simulateBtn: { padding: 16, alignItems: 'center' },
  simulateBtnText: { fontSize: 12, color: Colors.textMuted },
});
