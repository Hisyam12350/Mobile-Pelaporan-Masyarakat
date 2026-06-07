import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { API } from "@/constants/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Peringatan", "Email dan Password Tidak Boleh Kosong");
      return;
    }

    try {
      const res = await fetch(API.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.token) {
        const payload: any = jwtDecode(data.token);

        Alert.alert("Berhasil!", "Login Berhasil!");

        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("role", data.role ?? "");
        
        if (payload.id) {
          await AsyncStorage.setItem("id", payload.id.toString());
        }

        router.push({ pathname: "/(tabs)/home" } as any);
      } else {
        Alert.alert(
          "Gagal Login",
          data.message || "Email atau password salah!",
        );
      }
    } catch (error) {
      console.error(error);

      Alert.alert("Terjadi Kesalahan", "Tidak dapat terhubung ke server.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F9FF" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F9FF" />

      <View style={{ flex: 1, padding: 28, justifyContent: "space-between" }}>
        {/* TOP SECTION: BRANDING */}
        <View style={{ marginTop: 40 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          ></View>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "900",
              color: "#0F172A",
              letterSpacing: -0.5,
              textTransform: "uppercase",
              lineHeight: 36,
            }}
          >
            Pengaduan{"\n"}Masyarakat
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#64748B",
              marginTop: 8,
              fontWeight: "500",
              lineHeight: 20,
            }}
          >
            Masuk untuk memantau, membuat, dan mengawal laporan Anda dengan
            mudah.
          </Text>
        </View>

        {/* MIDDLE SECTION: CARD FORM */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 32,
            padding: 24,
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.06,
            shadowRadius: 24,
            elevation: 5,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
        >
          {/* INPUT EMAIL */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "900",
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 8,
                marginLeft: 4,
              }}
            >
              Email Address
            </Text>
            <TextInput
              style={{
                backgroundColor: "#F8FAFC",
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 16,
                fontSize: 14,
                fontWeight: "600",
                color: "#0F172A",
              }}
              placeholder="contoh@mail.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* INPUT PASSWORD */}
          <View style={{ marginBottom: 28 }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "900",
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 8,
                marginLeft: 4,
              }}
            >
              Kata Sandi
            </Text>
            <TextInput
              style={{
                backgroundColor: "#F8FAFC",
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 16,
                fontSize: 14,
                fontWeight: "600",
                color: "#0F172A",
              }}
              placeholder="Masukkan kata sandi"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* CUSTOM BUTTON (Pengganti <Button /> bawaan) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogin}
            style={{
              backgroundColor: "#06B6D4",
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#06B6D4",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 13,
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Masuk Sekarang
            </Text>
          </TouchableOpacity>
        </View>

        {/* BOTTOM SECTION: FOOTER INFO */}
        <View
          style={{
            backgroundColor: "#0F172A",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderRadius: 20,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "#94A3B8",
              fontSize: 11,
              fontWeight: "600",
              textAlign: "center",
              lineHeight: 16,
            }}
          >
            Belum punya akun? Silakan melakukan pendaftaran langsung melalui{" "}
            <Text style={{ color: "#06B6D4", fontWeight: "800" }}>
              Kantor Kelurahan
            </Text>{" "}
            terdekat.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
