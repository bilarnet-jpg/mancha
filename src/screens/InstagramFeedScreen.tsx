import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../theme';

const INSTAGRAM_URL = 'https://instagram.com/MANCHACARNAVAL';

const HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #0A1F14; padding: 12px; }
  </style>
</head>
<body>
  <script src="https://elfsightcdn.com/platform.js" async></script>
  <div class="elfsight-app-55bf5f4a-ed7f-4cc9-9cf5-8688fbfe12df" data-elfsight-app-lazy></div>
</body>
</html>
`;

export default function InstagramFeedScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 16, color: Colors.primaryBright }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>📸 Instagram Oficial</Text>
          <Text style={styles.headerSub}>@manchacarnaval</Text>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL(INSTAGRAM_URL)} style={styles.openBtn}>
          <Text style={{ fontSize: 16 }}>🔗</Text>
        </TouchableOpacity>
      </View>

      <WebView
        source={{ uri: 'https://55bf5f4aed7f4cc99cf58688fbfe12df.elf.site' }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled
        domStorageEnabled
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={Colors.primaryBright} size="large" />
          <Text style={styles.loadingText}>Carregando posts...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.xl, paddingBottom: 14, backgroundColor: '#0A1F14', borderBottomWidth: 1, borderBottomColor: 'rgba(0,255,133,0.15)' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '700' },
  headerSub: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  openBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.glassLight, borderWidth: 1, borderColor: Colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  webview: { flex: 1, backgroundColor: Colors.bg },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', gap: 14 },
  loadingText: { fontSize: 13, color: Colors.textMuted },
});
