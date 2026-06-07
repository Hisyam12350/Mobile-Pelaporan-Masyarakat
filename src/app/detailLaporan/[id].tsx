import { API } from "@/constants/api";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [laporan, setLaporan] = useState(null);
  const [komentar, setKomentar] = useState([]);
  const [isi, setIsi] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchDataLaporan = async () => {
      if (!id) return;
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");
      const storedUserId = await AsyncStorage.getItem("id");
      setCurrentUserId(storedUserId);

      if (!token) {
        router.replace("/login");
        return;
      }
      if (role === "admin") {
        router.replace(`/admin/laporan/${id}`);
        return;
      }

      fetch(API.laporanById((id as string) || "laporan tidak di temukan"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.data) {
            setLaporan(json.data[0]);
          }
        });

      fetch(API.komentarByLaporan(id as string), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => {
          console.log("komentar:", json);
          setKomentar(json.data || []);
        });
    };
    fetchDataLaporan();
  }, [id]);

  const handleAddComment = async () => {
    if (!isi.trim()) return;
    const token = await AsyncStorage.getItem("token");

    fetch(API.komentar, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_laporan: id,
        id_user: currentUserId,
        isi,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setIsi("");
        // refresh komentar
        fetch(API.komentarByLaporan(id as string), {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((json) => setKomentar(json.data || []));
      })
      .catch(() => Alert.alert("Error", "Gagal mengirim komentar"));
  };

  const getStatusStyles = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "";

    if (normalizedStatus.includes("proses")) {
      return {
        bg: "#FEF08A", // Kuning muda
        text: "#A16207", // Kuning tua
      };
    } else if (normalizedStatus.includes("ditolak")) {
      return {
        bg: "#FECACA", // Merah muda
        text: "#B91C1C", // Merah tua
      };
    } else if (normalizedStatus.includes("selesai")) {
      return {
        bg: "#DCFCE7", // Hijau muda
        text: "#15803D", // Hijau tua
      };
    } else {
      // Default: Menunggu / Status lainnya
      return {
        bg: "#DBEAFE", // Biru muda
        text: "#1D4ED8", // Biru tua
      };
    }
  };

  const statusStyle = getStatusStyles(laporan?.status);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tombol Kembali */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name={"arrow-left" as any} size={16} color="#06B6D4" />
          <Text style={styles.backButtonText}>Kembali ke daftar</Text>
        </TouchableOpacity>

        {/* CARD UTAMA LAPORAN */}
        <View style={styles.mainCard}>
          {/* Gambar Laporan */}
          <Image
            source={{
              uri: API.gambar(laporan?.gambar),
            }}
            style={styles.reportImage}
            resizeMode="cover"
          />

          <View style={styles.cardContent}>
            {/* Judul Laporan */}
            <Text style={styles.reportTitle}>{laporan?.judul}</Text>

            {/* Metadata / Badges */}
            <View style={styles.metaContainer}>
              {/* Badge Kategori (Cyan) */}
              <View style={styles.badgeCategory}>
                <Text style={styles.badgeTextCategory}>
                  {laporan?.nama_kategori}
                </Text>
              </View>

              {/* Badge Status (Dinamis sesuai Logika) */}
              <View
                style={[
                  styles.badgeStatus,
                  { backgroundColor: statusStyle.bg },
                ]}
              >
                <Text
                  style={[styles.badgeTextStatus, { color: statusStyle.text }]}
                >
                  {laporan?.status}
                </Text>
              </View>
            </View>

            <Text style={styles.dateText}>
              Dibuat pada:{" "}
              {new Date(laporan?.create_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>

            {/* Bagian Lokasi */}
            <View style={styles.locationBox}>
              <View style={styles.locationHeader}>
                <AntDesign
                  name={"environment" as any}
                  size={14}
                  color="#64748B"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.locationTitle}>Lokasi</Text>
              </View>
              <Text style={styles.locationDetail}>{laporan?.lokasi}</Text>
            </View>

            {/* Deskripsi */}
            <Text style={styles.descriptionText}>{laporan?.deskripsi}</Text>
          </View>
        </View>

        {/* BAGIAN KOMENTAR */}
        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>
            Komentar ({komentar?.length || 0})
          </Text>

          {/* List Komentar */}
          {komentar?.map((item) => (
            <View key={item.id} style={styles.commentCard}>
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
                    uri: item?.fotoProfile
                      ? API.gambar(item.fotoProfile)
                      : "https://i.pinimg.com/736x/96/e2/a7/96e2a7d987ce19f693d39f131cda092a.jpg",
                  }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.commentHeader}>
                <Text style={styles.commentUser}>{item.username}</Text>
                <Text style={styles.commentDate}>
                  {new Date(item.create_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </Text>
              </View>
              <Text style={styles.commentBody}>{item.isi_komentar}</Text>
            </View>
          ))}

          {/* Form Tulis Komentar */}
          <View style={styles.formCommentCard}>
            <TextInput
              placeholder="Tulis tanggapan atau komentar..."
              placeholderTextColor="#94a3b8"
              value={isi}
              onChangeText={setIsi}
              multiline
              numberOfLines={4}
              style={styles.commentInput}
            />

            <TouchableOpacity
              onPress={handleAddComment}
              style={styles.submitCommentButton}
            >
              <Text style={styles.submitButtonText}>Kirim Komentar</Text>
              <AntDesign
                name={"message1" as any}
                size={16}
                color="white"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#06B6D4",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 28,
  },
  reportImage: {
    width: "100%",
    height: 220,
  },
  cardContent: {
    padding: 20,
  },
  reportTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  badgeCategory: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 50,
    backgroundColor: "#ECFEFF",
  },
  badgeTextCategory: {
    color: "#0891B2",
    fontSize: 12,
    fontWeight: "700",
  },
  badgeStatus: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 50,
  },
  badgeTextStatus: {
    fontSize: 12,
    fontWeight: "700",
  },
  dateText: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 20,
  },
  locationBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationTitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  locationDetail: {
    color: "#0F172A",
    fontWeight: "600",
    fontSize: 14,
  },
  descriptionText: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 24,
  },
  commentSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  commentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  commentUser: {
    fontWeight: "700",
    color: "#0F172A",
    fontSize: 14,
  },
  commentDate: {
    color: "#94A3B8",
    fontSize: 11,
  },
  commentBody: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 20,
  },
  formCommentCard: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  commentInput: {
    minHeight: 80,
    textAlignVertical: "top",
    color: "#0F172A",
    fontSize: 14,
    lineHeight: 20,
  },
  submitCommentButton: {
    backgroundColor: "#06B6D4",
    flexDirection: "row",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
