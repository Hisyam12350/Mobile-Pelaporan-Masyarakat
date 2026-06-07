import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");

      if (!token) {
        router.replace("/login");
        return;
      }

      if (role === "admin") {
        router.replace("/admin/home");
      } else if (role === "super admin") {
        router.replace("/superAdmin/home");
      } else {
        router.replace("/(tabs)/home");
      }
    };

    checkToken();
  }, []);

  const handleGetStarted = () => {
    // Memastikan path mengarah ke folder (tabs) dengan benar
    router.replace("/login");
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F0F9FF",
        }}
      >
        <ActivityIndicator size="large" color="#06B6D4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F0F9FF",
        }}
      >
        <ActivityIndicator size="large" color="#06B6D4" />
      </View>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Bagian Atas: Logo */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <AntDesign name={"rocket1" as any} size={20} color="#06B6D4" />
        </View>
        <Text style={styles.brandName}>SistemPengaduan</Text>
      </View>

      {/* 2. Bagian Tengah: Ilustrasi */}
      <View style={styles.heroContainer}>
        <View style={styles.illustrationCircle}>
          <AntDesign
            name={"customerservice" as any}
            size={80}
            color="#06B6D4"
          />
        </View>
      </View>

      {/* 3. Bagian Bawah: Teks & Tombol */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Laporkan Masalah di Sekitarmu dengan Mudah
        </Text>

        <Text style={styles.subtitle}>
          Suarakan aspirasi dan aduan Anda langsung kepada petugas. Pantau
          prosesnya secara real-time hingga selesai.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleGetStarted}
        >
          <Text style={styles.ctaButtonText}>Mulai Laporkan</Text>
          <AntDesign
            name={"arrowright" as any}
            size={18}
            color="#FFFFFF"
            style={{ marginLeft: 8 }}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logoBadge: {
    backgroundColor: "#ECFEFF",
    padding: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  brandName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  heroContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationCircle: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    backgroundColor: "#ECFEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  ctaButton: {
    backgroundColor: "#06B6D4",
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#06B6D4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
