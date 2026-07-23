import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Animated, Dimensions, Modal, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { Colors, Spacing, Radius } from '../theme';

const { width: W, height: H } = Dimensions.get('window');
const STORAGE_KEY = 'mancha_daily_splash_last_shown';

const SLIDES = [
  {
    image: require('../../assets/images/card-historia.png'),
    phrase: 'Verdadeiro orgulho\nde um povo',
    emoji: '💚',
  },
  {
    image: require('../../assets/images/card-avenida.png'),
    phrase: 'Cada desfile,\numa história',
    emoji: '🥁',
  },
  {
    image: require('../../assets/images/banner-mancha.png'),
    phrase: 'Somos Mancha,\nsomos família',
    emoji: '🐍',
  },
  {
    image: require('../../assets/images/serdan/foto02.png'),
    phrase: 'Tradição que\natravessa gerações',
    emoji: '👑',
  },
];

const SLIDE_DURATION = 4200;

interface DailySplashProps {
  onDismiss: () => void;
}

export default function DailySplashModal({ onDismiss }: DailySplashProps) {
  const [fontsLoaded] = useFonts({ DancingScript_700Bold });
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(24)).current;
  const zoomAnim = useRef(new Animated.Value(1)).current;
  const dotPulseAnim = useRef(new Animated.Value(1)).current;
  const emojiFloatAnim = useRef(new Animated.Value(0)).current;

  const timerRef = useRef<any>(null);

  useEffect(() => {
    checkShouldShow();
    return () => clearTimeout(timerRef.current);
  }, []);

  const checkShouldShow = async () => {
    try {
      const lastShown = await AsyncStorage.getItem(STORAGE_KEY);
      const today = new Date().toDateString();
      if (lastShown !== today) {
        setVisible(true);
        await AsyncStorage.setItem(STORAGE_KEY, today);
        startSlideshow();
      } else {
        onDismiss();
      }
    } catch (e) {
      onDismiss();
    } finally {
      setChecked(true);
    }
  };

  const animateSlideIn = () => {
    // Reset
    textFadeAnim.setValue(0);
    textSlideAnim.setValue(24);
    zoomAnim.setValue(1);
    emojiFloatAnim.setValue(0);

    // Fundo aparece com fade
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    // Ken Burns: zoom lento e contínuo na imagem
    Animated.timing(zoomAnim, {
      toValue: 1.18,
      duration: SLIDE_DURATION + 600,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // Texto sobe suavemente enquanto aparece
    Animated.parallel([
      Animated.timing(textFadeAnim, { toValue: 1, duration: 700, delay: 250, useNativeDriver: true }),
      Animated.spring(textSlideAnim, { toValue: 0, delay: 250, useNativeDriver: true, friction: 8, tension: 40 }),
    ]).start();

    // Emoji flutuando suavemente pra cima e pra baixo (loop)
    Animated.loop(
      Animated.sequence([
        Animated.timing(emojiFloatAnim, { toValue: -8, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(emojiFloatAnim, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // Pulso suave no indicador ativo
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulseAnim, { toValue: 1.4, duration: 700, useNativeDriver: true }),
        Animated.timing(dotPulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  };

  const startSlideshow = () => {
    animateSlideIn();
    scheduleNext(0);
  };

  const scheduleNext = (index: number) => {
    timerRef.current = setTimeout(() => {
      if (index >= SLIDES.length - 1) {
        handleDismiss();
        return;
      }
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(textFadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start(() => {
        setSlideIndex(index + 1);
        animateSlideIn();
        scheduleNext(index + 1);
      });
    }, SLIDE_DURATION);
  };

  const handleDismiss = () => {
    clearTimeout(timerRef.current);
    Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
      setVisible(false);
      onDismiss();
    });
  };

  if (!checked || !visible) return null;

  const slide = SLIDES[slideIndex];

  return (
    <Modal visible={visible} transparent={false} animationType="fade">
      <View style={styles.container}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim }]}>
          <Animated.Image
            source={slide.image}
            style={[styles.bgImage, { transform: [{ scale: zoomAnim }] }]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(10,31,20,0.25)', 'rgba(10,31,20,0.55)', 'rgba(10,31,20,0.97)']}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        <View style={styles.content}>
          <Animated.Text
            style={[
              styles.phrase,
              fontsLoaded && { fontFamily: 'DancingScript_700Bold' },
              { opacity: textFadeAnim, transform: [{ translateY: textSlideAnim }] },
            ]}
          >
            {slide.phrase}
          </Animated.Text>

          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  i === slideIndex && styles.dotActive,
                  i === slideIndex && { transform: [{ scaleX: dotPulseAnim }] },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={handleDismiss} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Pular →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  bgImage: { width: W, height: H },
  content: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 80, paddingHorizontal: Spacing.xl },
  phrase: { fontSize: 40, color: '#fff', fontWeight: '800', textAlign: 'center', lineHeight: 48, marginBottom: 30, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 10 },
  dotsRow: { flexDirection: 'row', gap: 8, marginBottom: 30 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: Colors.primaryBright, width: 24 },
  skipBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  skipBtnText: { fontSize: 13, color: '#fff', fontWeight: '600' },
});
