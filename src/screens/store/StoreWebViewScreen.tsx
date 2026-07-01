import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '../../theme';

const STORE_URL = 'https://manchaverde.lojavirtuolpro.com';

export default function StoreWebViewScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(STORE_URL);
  const [canGoBack, setCanGoBack] = useState(false);
  const [error, setError] = useState(false);

  const handleOpenBrowser = () => Linking.openURL(currentUrl);

  const handleGoBack = () => {
    if (canGoBack) webViewRef.current?.goBack();
    else navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🛍️ Loja Oficial</Text>
          <Text style={styles.headerSub}>manchaverde.lojavirtuolpro.com</Text>
        </View>
        <TouchableOpacity onPress={handleOpenBrowser} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>🌐</Text>
        </TouchableOpacity>
      </View>

      {/* WEBVIEW */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text>
          <Text style={styles.errorTitle}>Não foi possível carregar</Text>
          <Text style={styles.errorSub}>Verifique sua conexão com a internet</Text>
          <TouchableOpacity onPress={() => { setError(false); webViewRef.current?.reload(); }} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>↻ Tentar novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenBrowser} style={styles.browserBtn}>
            <Text style={styles.browserBtnText}>🌐 Abrir no navegador</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: STORE_URL }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
          onNavigationStateChange={state => {
            setCanGoBack(state.canGoBack);
            setCurrentUrl(state.url);
          }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          allowsBackForwardNavigationGestures
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        />
      )}

      {/* LOADING */}
      {loading && !error && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={Colors.primaryBright} size="large" />
          <Text style={styles.loadingText}>Carregando loja...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 12,
    backgroundColor: '#0A1F14',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,255,133,0.15)',
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.glassLight,
    borderWidth: 1, borderColor: Colors.glassBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  headerBtnText: { fontSize: 16, color: Colors.primaryBright },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700' },
  headerSub: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  loadingText: { fontSize: 14, color: Colors.textMuted },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 10,
  },
  errorTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '700' },
  errorSub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginBottom: 10 },
  retryBtn: {
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1, borderColor: 'rgba(0,255,133,0.3)',
    borderRadius: Radius.lg,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  retryBtnText: { fontSize: 14, color: Colors.primaryBright, fontWeight: '700' },
  browserBtn: {
    borderWidth: 1, borderColor: Colors.glassBorder,
    borderRadius: Radius.lg,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  browserBtnText: { fontSize: 14, color: Colors.textSecondary },
});
