import { API, BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const [laporan, setLaporan] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("id");
      const role = await AsyncStorage.getItem("role");
      setUserId(userId);

      if (!token) {
        router.replace("/login");
        return;
      } else if (role === "admin") {
        router.replace("/admin/home");
        return;
      } else if (role === "super admin") {
        router.replace("/superAdmin/home");
        return;
      }

      fetch(API.userById(userId || "undefined"), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => {
          setUser(json.data[0]);
        });

      fetch(API.laporan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          setLaporan(json.data);
        });
    };
    fetchUserData();
  }, [id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F9FF" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F9FF" />

      {/* --- STICKY TOPBAR --- */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 24,
          paddingVertical: 16,
          backgroundColor: "#F0F9FF",
          borderBottomWidth: 1,
          borderColor: "#E2E8F0",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "900",
              color: "#0F172A",
              letterSpacing: -1,
            }}
          >
            LAPOR<Text style={{ color: "#06B6D4" }}>!</Text>
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: "#06B6D4",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Pengaduan Masyarakat
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ alignItems: "flex-end", marginRight: 12 }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "700",
                color: "#94A3B8",
                textTransform: "uppercase",
              }}
            >
              Warga
            </Text>
            <Text style={{ fontSize: 13, fontWeight: "900", color: "#0F172A" }}>
              {user?.username}
            </Text>
          </View>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: "white",
              overflow: "hidden",
              backgroundColor: "#CBD5E1",
            }}
          >
            <Image
              source={{
                uri: user?.fotoProfile
                  ? API.gambar(user.fotoProfile)
                  : "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg",
              }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* --- SCROLLABLE MAIN CONTENT --- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      >
        {/* --- HERO SECTION --- */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 32,
            padding: 24,
            shadowColor: "#06B6D4",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.05,
            shadowRadius: 20,
            elevation: 4,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            marginBottom: 32,
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#E0F2FE",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 99,
            }}
          >
            <Text
              style={{
                color: "#0369A1",
                fontSize: 10,
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              E-Reporting System
            </Text>
          </View>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "900",
              color: "#0F172A",
              marginTop: 16,
              lineHeight: 32,
            }}
          >
            Sampaikan Laporan{"\n"}
            <Text style={{ color: "#06B6D4" }}>Mudah & Cepat</Text>
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#64748B",
              marginTop: 12,
              lineHeight: 20,
              fontWeight: "500",
            }}
          >
            Suara Anda adalah awal perubahan. Laporkan kendala fasilitas publik
            di lingkungan Anda secara transparan.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/tambah-laporan" as any)}
            style={{
              backgroundColor: "#06B6D4",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 24,
              shadowColor: "#06B6D4",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>
              Buat Pengaduan Sekarang
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- SECTION TITLE: PENGADUAN TERBARU --- */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: "900", color: "#0F172A" }}>
              Pengaduan Terbaru
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#94A3B8",
                marginTop: 2,
                fontWeight: "500",
              }}
            >
              Pantau perkembangan laporan sekitar
            </Text>
          </View>
        </View>

        {/* --- LOOPING DATA KARTU LAPORAN --- */}
        <View style={{ gap: 20 }}>
          {laporan
            .sort(() => Math.random() - 0.5)
            .map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: 24,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.04,
                  shadowRadius: 12,
                  elevation: 2,
                }}
              >
                {/* Container Image */}
                <View
                  style={{ height: 180, width: "100%", position: "relative" }}
                >
                  <Image
                    source={{
                      uri: API.gambar(item.gambar),
                    }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      backgroundColor: "#06B6D4",
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 9,
                        fontWeight: "900",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {item.nama_kategori}
                    </Text>
                  </View>
                </View>

                {/* Konten Kartu */}
                <View style={{ padding: 20 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#94A3B8",
                      fontWeight: "700",
                      marginBottom: 6,
                    }}
                  >
                    👤 User #{item.id_user}
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "800",
                      color: "#0F172A",
                      lineHeight: 22,
                    }}
                    numberOfLines={2}
                  >
                    {item.judul}
                  </Text>

                  {/* Info Lokasi & Tanggal */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 14,
                      borderTopWidth: 1,
                      borderColor: "#F1F5F9",
                      paddingTop: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#64748B",
                        fontWeight: "600",
                      }}
                    >
                      📍 {item.lokasi}
                    </Text>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#94A3B8",
                        fontStyle: "italic",
                      }}
                    >
                      {new Date(item.create_at).toLocaleDateString("id-ID")}
                    </Text>
                  </View>

                  {/* Tombol Detail */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      router.push(`/detailLaporan/${item.id}` as any);
                    }}
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderWidth: 1,
                      borderColor: "#E2E8F0",
                      borderRadius: 12,
                      paddingVertical: 12,
                      alignItems: "center",
                      marginTop: 16,
                    }}
                  >
                    <Text
                      style={{
                        color: "#475569",
                        fontSize: 13,
                        fontWeight: "700",
                      }}
                    >
                      Detail Laporan
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
