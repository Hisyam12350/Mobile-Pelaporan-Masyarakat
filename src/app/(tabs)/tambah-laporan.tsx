import { API } from "@/constants/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

export default function AddReportScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [kategori, setKategori] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    judul: "",
    deskripsi: "",
    lokasi: "",
    kategori_id: "",
    status: "menunggu",
    image: null,
  });

  useEffect(() => {
    const functionTambahLaporan = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");

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

      fetch(API.kategori, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          setKategori(json.data || []);
        });
    };
    functionTambahLaporan();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, image: result.assets[0] });
    }
  };

  async function tambahLaporan() {
    const token = await AsyncStorage.getItem("token");

    if (!form.judul || !form.deskripsi || !form.lokasi || !form.kategori_id) {
      Alert.alert("Peringatan", "Semua field harus diisi!");
      return;
    }

    const formData = new FormData();
    formData.append("judul", form.judul);
    formData.append("deskripsi", form.deskripsi);
    formData.append("lokasi", form.lokasi);
    formData.append("kategori_id", String(form.kategori_id));
    formData.append("status", form.status);

    if (form.image) {
      formData.append("image", {
        uri: form.image.uri,
        name: form.image.fileName || "photo.jpg",
        type: form.image.type || "image/jpeg", // Perbaikan dari mimeType ke type agar garis merah hilang
      } as any);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", API.laporan);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("ngrok-skip-browser-warning", "true");

    xhr.onload = () => {
      console.log("Status:", xhr.status);
      console.log("Response:", xhr.responseText);
      try {
        const data = JSON.parse(xhr.responseText);
        if (data.ok) {
          Alert.alert("Berhasil!", "Data berhasil ditambahkan!");
          router.push("/(tabs)/profile");
        } else {
          Alert.alert("Gagal", data.message || "Terjadi kesalahan");
        }
      } catch (e) {
        console.log("Parse error:", xhr.responseText);
        Alert.alert("Error", "Response tidak valid dari server");
      }
    };

    xhr.onerror = () => {
      console.log("XHR Error:", xhr.responseText);
      Alert.alert("Error", "Tidak dapat terhubung ke server");
    };

    xhr.send(formData);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bagian Header */}
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Tambah Laporan</Text>
          <Text style={styles.subtitle}>
            Isi detail laporan pengaduan anda secara jelas agar segera
            ditindaklanjuti oleh petugas.
          </Text>
        </View>

        {/* Form Container */}
        <View style={styles.formCard}>
          {/* Input: Judul Laporan */}
          <Text style={styles.inputLabel}>Judul Laporan</Text>
          <TextInput
            placeholder="Contoh: Lampu Jalan Mati"
            placeholderTextColor="#94a3b8"
            value={form.judul}
            onChangeText={(text) => setForm({ ...form, judul: text })}
            style={styles.textInput}
          />

          {/* Input: Kategori */}
          <Text style={styles.inputLabel}>Kategori</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.kategori_id}
              onValueChange={(value) =>
                setForm({ ...form, kategori_id: value })
              }
              style={styles.pickerStyle}
              dropdownIconColor="#06B6D4"
            >
              <Picker.Item
                label="Pilih Kategori Masalah"
                value=""
                style={styles.pickerPlaceholder}
              />
              {kategori.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={item.nama_kategori}
                  value={item.id}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>
          </View>

          {/* Input: Lokasi */}
          <Text style={styles.inputLabel}>Lokasi Kejadian</Text>
          <TextInput
            placeholder="Contoh: Jl. Kebon Jeruk No. 5"
            placeholderTextColor="#94a3b8"
            value={form.lokasi}
            onChangeText={(text) => setForm({ ...form, lokasi: text })}
            style={styles.textInput}
          />

          {/* Input: Deskripsi */}
          <Text style={styles.inputLabel}>Deskripsi Lengkap</Text>
          <TextInput
            placeholder="Jelaskan kronologi atau detail masalah secara singkat dan jelas..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={5}
            value={form.deskripsi}
            onChangeText={(text) => setForm({ ...form, deskripsi: text })}
            style={styles.textAreaInput}
          />

          {/* Input: Unggah Gambar */}
          <Text style={styles.inputLabel}>Foto Bukti Kejadian</Text>
          <TouchableOpacity
            onPress={pickImage}
            style={[styles.uploadZone, form.image && styles.uploadZoneActive]}
          >
            {form.image ? (
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: form.image.uri }}
                  style={styles.previewImage}
                />
                <View style={styles.changeImageOverlay}>
                  <AntDesign name={"camera" as any} size={16} color="white" />
                  <Text style={styles.changeImageText}>Ubah Foto</Text>
                </View>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <AntDesign name={"camera" as any} size={32} color="#06B6D4" />
                <Text style={styles.uploadTextTitle}>Pilih Bukti Foto</Text>
                <Text style={styles.uploadTextSubtitle}>
                  Format JPG, PNG (Maks. 5MB)
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Tombol Kirim Utama */}
          <TouchableOpacity onPress={tambahLaporan} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Kirim Laporan Pengaduan</Text>
            <AntDesign
              name={"right" as any}
              size={18}
              color="white"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
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
    padding: 24,
    paddingBottom: 48,
  },
  headerSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },
  subtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 3,
  },
  inputLabel: {
    fontWeight: "700",
    color: "#1E293B",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    marginBottom: 18,
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    marginBottom: 18,
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
  },
  pickerStyle: {
    width: "100%",
    color: "#0F172A",
  },
  pickerPlaceholder: {
    fontSize: 15,
    color: "#94A3B8",
  },
  pickerItem: {
    fontSize: 15,
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    textAlignVertical: "top",
    minHeight: 120,
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    marginBottom: 18,
    lineHeight: 22,
  },
  uploadZone: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    minHeight: 140,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 24,
  },
  uploadZoneActive: {
    borderStyle: "solid",
    borderColor: "#E2E8F0",
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  uploadTextTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#06B6D4",
    marginTop: 8,
  },
  uploadTextSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  previewContainer: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  changeImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  changeImageText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  submitButton: {
    backgroundColor: "#06B6D4",
    flexDirection: "row",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#06B6D4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
