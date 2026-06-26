import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '../../theme';
import GlowBackground from '../../components/GlowBackground';
import GlassCard from '../../components/GlassCard';
import { useAuthStore } from '../../store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors as ThemeColors } from '../../theme';

interface ScanResult {
  userId: string;
  qrCode: string;
  name: string;
  initial: string;
  plan: string;
  isValid: boolean;
  checkinTime: string;
}

// Validação do QR Code — extrai dados do próprio QR Code
const validateQRCode = (data: string): ScanResult | null => {
  const parts = data.split(':');
  if (parts[0] !== 'MANCHA' || parts.length < 3) return null;
  const qrCode = parts[1];
  const userId = parts[2];
  // Nome vem do QR Code (parte 4), não do usuário logado
  const name = parts[3] ? decodeURIComponent(parts[3]) : 'Sócio Mancha Verde';
  const initial = name.charAt(0).toUpperCase();
  return {
    userId,
    qrCode,
    name,
    initial,
    plan: qrCode.startsWith('MV-OURO') ? 'Plano Ouro 👑' : qrCode.startsWith('MV-PRATA') ? 'Plano Prata 🥈' : 'Plano Free 🎟️',
    isValid: true,
    checkinTime: new Date().toLocaleTimeString('pt-BR'),
  };
};

export default function AdminScanner({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [eventName, setEventName] = useState('Ensaio Técnico — Jun 2026');

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    Vibration.vibrate(100);

    const scanResult = validateQRCode(data);
    if (scanResult) {
      setResult(scanResult);
      setScanCount(prev => prev + 1);
    } else {
      Alert.alert('QR Code inválido', 'Este QR Code não é reconhecido pelo sistema da Mancha Verde.', [
        { text: 'Tentar novamente', onPress: () => setScanned(false) },
      ]);
    }
  };

  const handleNextScan = () => {
    setScanned(false);
    setResult(null);
  };

  if (!permission) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <GlowBackground />
        <Text style={{ color: Colors.textMuted }}>Carregando câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl }]}>
        <GlowBackground />
        <Text style={{ fontSize: 48, marginBottom: 20 }}>📷</Text>
        <Text style={styles.permTitle}>Permissão de câmera necessária</Text>
        <Text style={styles.permSub}>Para escanear QR Codes dos sócios, precisamos acessar sua câmera.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permBtn}>
          <Text style={styles.permBtnText}>Permitir acesso à câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: Colors.textMuted }}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlowBackground />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>📷 Scanner QR Code</Text>
          <Text style={styles.headerSub}>{eventName}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{scanCount} ✓</Text>
        </View>
      </View>

      {result ? (
        /* RESULTADO DO SCAN */
        <View style={styles.resultContainer}>
          <GlassCard style={[styles.resultCard, { borderColor: result.isValid ? 'rgba(0,255,133,0.4)' : 'rgba(255,90,90,0.4)' }]}>
            <View style={[styles.resultAccent, { backgroundColor: result.isValid ? Colors.primaryBright : '#FF5A5A' }]} />

            {/* Avatar + validação */}
            <View style={styles.resultAvatarWrap}>
              <LinearGradient colors={['#3DFFA0', '#00C46A']} style={styles.resultAvatar}>
                <Text style={styles.resultAvatarText}>{result.initial}</Text>
              </LinearGradient>
              <View style={[styles.resultCheckBadge, { backgroundColor: result.isValid ? Colors.primaryBright : '#FF5A5A' }]}>
                <Text style={{ fontSize: 14, color: '#fff' }}>{result.isValid ? '✓' : '✕'}</Text>
              </View>
            </View>

            <Text style={[styles.resultStatus, { color: result.isValid ? Colors.primaryBright : '#FF5A5A' }]}>
              {result.isValid ? 'SÓCIO VÁLIDO' : 'INVÁLIDO'}
            </Text>

            <Text style={styles.resultName}>{result.name}</Text>
            <Text style={styles.resultPlan}>{result.plan}</Text>

            <View style={styles.resultDetails}>
              <View style={styles.resultDetailItem}>
                <Text style={styles.resultDetailLabel}>Código</Text>
                <Text style={styles.resultDetailVal}>{result.qrCode}</Text>
              </View>
              <View style={styles.resultDetailItem}>
                <Text style={styles.resultDetailLabel}>Check-in</Text>
                <Text style={styles.resultDetailVal}>{result.checkinTime}</Text>
              </View>
              <View style={styles.resultDetailItem}>
                <Text style={styles.resultDetailLabel}>Evento</Text>
                <Text style={styles.resultDetailVal}>{eventName}</Text>
              </View>
            </View>

            {result.isValid && (
              <View style={styles.xpBadge}>
                <Text style={styles.xpBadgeText}>+50 XP adicionado ao torcedor! ⚡</Text>
              </View>
            )}
          </GlassCard>

          <TouchableOpacity onPress={handleNextScan} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>📷 Escanear próximo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* CÂMERA */
        <View style={styles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />

          {/* Overlay com moldura */}
          <View style={styles.overlay}>
            <View style={styles.overlayTop} />
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                <View style={styles.scanLine} />
              </View>
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom}>
              <Text style={styles.scanHint}>Aponte para o QR Code da carteirinha do sócio</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const FRAME_SIZE = 260;
const CORNER_SIZE = 24;
const CORNER_WIDTH = 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, paddingBottom: 16, zIndex: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '800' },
  headerSub: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  countBadge: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6 },
  countText: { fontSize: 13, color: Colors.primaryBright, fontWeight: '700' },
  cameraContainer: { flex: 1, position: 'relative' },
  overlay: { flex: 1 },
  overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayMiddle: { flexDirection: 'row', height: FRAME_SIZE },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', paddingTop: 24 },
  scanHint: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', paddingHorizontal: 40 },
  scanFrame: { width: FRAME_SIZE, height: FRAME_SIZE, position: 'relative' },
  corner: { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE, borderColor: Colors.primaryBright },
  cornerTL: { top: 0, left: 0, borderTopWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH },
  cornerTR: { top: 0, right: 0, borderTopWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH },
  scanLine: { position: 'absolute', top: '50%', left: 8, right: 8, height: 2, backgroundColor: Colors.primaryBright, opacity: 0.8 },
  resultContainer: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: 20, paddingBottom: 40 },
  resultCard: { position: 'relative', overflow: 'hidden', alignItems: 'center', paddingVertical: 30 },
  resultAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  resultAvatarWrap: { position: 'relative', marginBottom: 16 },
  resultAvatar: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  resultAvatarText: { fontSize: 40, color: '#052D18', fontWeight: '800' },
  resultCheckBadge: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0A1F14' },
  resultStatus: { fontSize: 16, fontWeight: '800', letterSpacing: 2, marginBottom: 12 },
  resultName: { fontSize: 22, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  resultPlan: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
  resultDetails: { width: '100%', gap: 12, marginBottom: 20 },
  resultDetailItem: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 8, backgroundColor: Colors.glassLight, borderRadius: Radius.md },
  resultDetailLabel: { fontSize: 12, color: Colors.textMuted },
  resultDetailVal: { fontSize: 12, color: Colors.textPrimary, fontWeight: '600' },
  xpBadge: { backgroundColor: 'rgba(0,255,133,0.12)', borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 8 },
  xpBadgeText: { fontSize: 12, color: Colors.primaryBright, fontWeight: '600' },
  nextBtn: { marginTop: 20, backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.lg, height: 54, alignItems: 'center', justifyContent: 'center' },
  nextBtnText: { fontSize: 16, color: Colors.primaryBright, fontWeight: '700' },
  permTitle: { fontSize: 20, color: Colors.textPrimary, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  permSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  permBtn: { backgroundColor: Colors.primaryMuted, borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)', borderRadius: Radius.lg, paddingHorizontal: 24, paddingVertical: 14 },
  permBtnText: { fontSize: 15, color: Colors.primaryBright, fontWeight: '700' },
});
