import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Perbaikan import
import { API } from "@/constants/api";
import { useRouter } from "expo-router"; // Perbaikan import router agar aman
import { Image } from "expo-image";

const { width } = Dimensions.get("window");
const gridWidth = width / 3;

export default function ProfileTikTokStyle() {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [users, setUsers] = useState<any>(null);
  const [laporan, setLaporan] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("semua"); // State Tab Tambahan agar filter berfungsi

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    nomor_telepon: "",
    alamat: "",
    bio: "",
    image: null,
  });

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");
      const storedId = await AsyncStorage.getItem("id");

      if (!token) {
        router.replace("/login");
        return;
      }

      if (role === "admin") {
        router.replace(`/admin/profile/${storedId}` as any);
        return;
      } else if (role === "super admin") {
        router.replace(`/superAdmin/profile/${storedId}` as any);
        return;
      }

      // Fetch data User
      fetch(API.userById(storedId!), {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((json) => {
          if (json.data && json.data.length > 0) {
            setUsers(json.data[0]);
            // Isi form default untuk edit profile
            setForm({
              username: json.data[0].username || "",
              email: json.data[0].email || "",
              password: "",
              nomor_telepon: json.data[0].nomor_telepon || "",
              alamat: json.data[0].alamat || "",
              bio: json.data[0].bio || "",
              image: null,
            });
          } else {
            router.replace("/login");
          }
        })
        .catch(() => router.replace("/login"));

      // Fetch laporan oleh user terkait
      fetch(API.laporanByUser(storedId!), {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.data) setLaporan(json.data);
        })
        .catch((err) => console.log("Error fetch laporan:", err));
    };

    init();
  }, []);

  // Filter logic yang sudah diperbaiki dari state 'laporan'
  const filteredLaporan = laporan.filter((item) => {
    const statusLower = item.status?.toLowerCase() || "";
    if (activeTab === "proses") return statusLower.includes("proses");
    if (activeTab === "selesai") return statusLower.includes("selesai");
    return true;
  });

  async function handleLogout() {
    await AsyncStorage.clear();
    router.replace("/login");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar Utama */}
      <View style={styles.topHeader}>
        <Text style={styles.topHeaderTitle}>Profil Saya</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <AntDesign name={"logout" as any} size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* --- DATA USER (ALA TIKTOK) --- */}
        <View
          style={{ alignItems: "center", marginTop: 10, paddingHorizontal: 32 }}
        >
          {/* Avatar Bulat Besar */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: users?.fotoProfile
                  ? API.gambar(users.fotoProfile)
                  : "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg",
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>

          {/* Nama Pengguna */}
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#0F172A" }}>
            @{users?.username || "user"}
          </Text>

          {/* Angka Statistik (Diperbaiki dari variabel laporan asli) */}
          <View style={{ flexDirection: "row", marginVertical: 16, gap: 32 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.statCount}>{laporan.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={[
                  styles.statCount,
                  {
                    color: "#A16207",
                    backgroundColor: "#FEF08A",
                    paddingHorizontal: 8,
                    borderRadius: 6,
                  },
                ]}
              >
                {
                  laporan.filter((l) =>
                    l.status?.toLowerCase().includes("proses"),
                  ).length
                }
              </Text>
              <Text style={styles.statLabel}>Proses</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={[
                  styles.statCount,
                  {
                    color: "#15803D",
                    backgroundColor: "#DCFCE7",
                    paddingHorizontal: 8,
                    borderRadius: 6,
                  },
                ]}
              >
                {
                  laporan.filter((l) =>
                    l.status?.toLowerCase().includes("selesai"),
                  ).length
                }
              </Text>
              <Text style={styles.statLabel}>Selesai</Text>
            </View>
          </View>

          {/* Tombol Edit Profile & Bio */}
          <TouchableOpacity
            onPress={() => setEditOpen(true)}
            style={styles.editProfileButton}
          >
            <Text style={{ fontWeight: "700", color: "#0F172A", fontSize: 14 }}>
              Edit profil
            </Text>
          </TouchableOpacity>

          <Text style={styles.bioText}>
            {users?.bio || "Belum ada bio pengaduan."}
          </Text>
        </View>

        {/* --- TAB NAVIGASI GRID (ALA TIKTOK) --- */}
        <View style={styles.tabBarContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("semua")}
            style={[
              styles.tabItem,
              activeTab === "semua" && styles.tabItemActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "semua" && styles.tabTextActive,
              ]}
            >
              Semua
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("proses")}
            style={[
              styles.tabItem,
              activeTab === "proses" && styles.tabItemActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "proses" && styles.tabTextActive,
              ]}
            >
              Proses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("selesai")}
            style={[
              styles.tabItem,
              activeTab === "selesai" && styles.tabItemActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "selesai" && styles.tabTextActive,
              ]}
            >
              Selesai
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- GRID GALERI FOTO LAPORAN --- */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {filteredLaporan.length === 0 ? (
            <View style={{ width: width, padding: 60, alignItems: "center" }}>
              <AntDesign name={"inbox" as any} size={40} color="#94A3B8" />
              <Text
                style={{
                  color: "#94A3B8",
                  fontSize: 14,
                  fontWeight: "500",
                  marginTop: 8,
                }}
              >
                Tidak ada laporan di kategori ini
              </Text>
            </View>
          ) : (
            filteredLaporan.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/detailLaporan/${item.id}` as any)} // Opsional: Navigasi ke detail jika ditekan
                style={{
                  width: gridWidth,
                  height: gridWidth,
                  padding: 1,
                  position: "relative",
                }}
                activeOpacity={0.9}
              >
                <Image
                  source={{
                    uri: item.gambar
                      ? API.gambar(item.gambar)
                      : "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg",
                  }}
                  style={{ width: "100%", height: "100%" }} // Ditambahkan style agar gambar terlihat!
                />

                {/* Tanda Kecil Status Laporan di Pojok Bawah Gambar */}
                <View style={styles.badgeStatusGrid}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: item.status
                        ?.toLowerCase()
                        .includes("selesai")
                        ? "#10B981"
                        : "#FBBF24",
                    }}
                  />
                  <Text
                    style={{ color: "white", fontSize: 9, fontWeight: "700" }}
                  >
                    {item.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  topHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  logoutButton: {
    padding: 6,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statCount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  editProfileButton: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 4,
  },
  bioText: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    marginTop: 14,
    lineHeight: 18,
  },
  tabBarContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginTop: 24,
    marginBottom: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabItemActive: {
    borderBottomColor: "#06B6D4", // Warna aksen Cyan milikmu
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#06B6D4",
    fontWeight: "700",
  },
  badgeStatusGrid: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
