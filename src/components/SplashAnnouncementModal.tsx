import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions, Modal,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabase';

const { width: W } = Dimensions.get('window');

interface SplashAnnouncement {
  id: string;
  title: string;
  message: string;
  emoji: string;
  accent_color: string;
  duration_seconds: number;
}

interface SplashScreenProps {
  onDismiss: () => void;
}

export default function SplashAnnouncementModal({ onDismiss }: SplashScreenProps) {
  const [announcement, setAnnouncement] = useState<SplashAnnouncement | null>(null);
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const countdownRef = useRef<any>(null);

  useEffect(() => {
    loadAnnouncement();
  }, []);

  const loadAnnouncement = async () => {
    try {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from('splash_announcements')
        .select('*')
        .eq('is_active', true)
        .or(`ends_at.is.null,ends_at.gt.${now}`)
        .lte('starts_at', now)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setAnnouncement(data);
        setCountdown(data.duration_seconds);
        setVisible(true);
        // Animar entrada
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 65, friction: 10 }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
        // Iniciar countdown
        countdownRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              handleDismiss();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        onDismiss();
      }
    } catch (e) {
      console.log('splash error:', e);
      onDismiss();
    }
  };

  const handleDismiss = () => {
    clearInterval(countdownRef.current);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0.85, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setVisible(false);
      onDismiss();
    });
  };

  if (!visible || !announcement) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={handleDismiss}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} />
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient colors={['#0A2E14', '#134227']} style={StyleSheet.absoluteFillObject} />
          
          {/* Accent top */}
          <View style={[styles.accent, { backgroundColor: announcement.accent_color }]} />
          
          {/* Glow */}
          <View style={[styles.glow, { backgroundColor: `${announcement.accent_color}15` }]} />

          {/* Emoji */}
          <View style={[styles.emojiWrap, { borderColor: `${announcement.accent_color}33`, backgroundColor: `${announcement.accent_color}15` }]}>
            <Text style={styles.emoji}>{announcement.emoji}</Text>
          </View>

          {/* Conteúdo */}
          <Text style={[styles.title, { color: announcement.accent_color }]}>{announcement.title}</Text>
          <Text style={styles.message}>{announcement.message}</Text>

          {/* Logo */}
          <View style={styles.divider} />
          <Text style={styles.brand}>💚 MANCHA VERDE CARNAVAL</Text>

          {/* Botão fechar */}
          <TouchableOpacity onPress={handleDismiss} style={[styles.closeBtn, { borderColor: `${announcement.accent_color}44`, backgroundColor: `${announcement.accent_color}15` }]}>
            <Text style={[styles.closeBtnText, { color: announcement.accent_color }]}>
              {countdown > 0 ? `Fechar em ${countdown}s` : 'Fechar'}
            </Text>
          </TouchableOpacity>

          {/* Skip */}
          <TouchableOpacity onPress={handleDismiss} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Pular →</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: {
    width: W - 56, borderRadius: 28,
    overflow: 'hidden', borderWidth: 1,
    borderColor: 'rgba(0,255,133,0.2)',
    padding: 28, alignItems: 'center',
    position: 'relative',
  },
  accent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  glow: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80 },
  emojiWrap: { width: 80, height: 80, borderRadius: 40, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emoji: { fontSize: 40 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 12, lineHeight: 28 },
  message: { fontSize: 15, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  divider: { width: 40, height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 16 },
  brand: { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, fontWeight: '700', marginBottom: 24 },
  closeBtn: { borderWidth: 1, borderRadius: 50, paddingHorizontal: 28, paddingVertical: 12, marginBottom: 12 },
  closeBtnText: { fontSize: 14, fontWeight: '700' },
  skipBtn: { padding: 8 },
  skipBtnText: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
});
