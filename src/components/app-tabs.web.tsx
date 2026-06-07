import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from "expo-router/ui";
import { AntDesign } from "@expo/vector-icons";
import { Pressable, View, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { Spacing } from "@/constants/theme";

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <CustomTabList>
          {/* TAB HOME (Kiri) */}
          <TabTrigger name="home" href="/home" asChild>
            <TabButton iconName="home">Home</TabButton>
          </TabTrigger>

          {/* TAB TAMBAH/PLUS (Tengah) */}
          <TabTrigger name="tambah-laporan" href="/tambah-laporan" asChild>
            <CenterAddButton iconName="plus" />
          </TabTrigger>

          {/* TAB PROFILE (Kanan) */}
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton iconName="user">Profile</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

// Komponen Tombol Tab Biasa (Home & Profile)
export function TabButton({
  children,
  isFocused,
  iconName,
  ...props
}: TabTriggerSlotProps & { iconName: any }) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.tabFlex, pressed && styles.pressed]}
    >
      <AntDesign
        name={iconName}
        size={24}
        color={isFocused ? "#06B6D4" : "#64748B"}
      />
      <ThemedText
        type="small"
        style={{
          marginTop: 4,
          fontSize: 11,
          fontWeight: isFocused ? "700" : "500",
          color: isFocused ? "#06B6D4" : "#64748B",
        }}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
}

// Komponen Khusus Tombol Tambah Laporan di Tengah (Bulat & Menonjol)
export function CenterAddButton({
  isFocused,
  iconName,
  ...props
}: TabTriggerSlotProps & { iconName: any }) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View
        style={[
          styles.plusButtonInner,
          { backgroundColor: isFocused ? "#0F172A" : "#06B6D4" },
        ]}
      >
        <AntDesign name={iconName} size={28} color="white" />
      </View>
    </Pressable>
  );
}

// Kontainer Utama yang Menempel di Pinggir Layar HP / Web bawah
export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0,
    zIndex: 999,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around", // Membagi rata Kiri, Tengah, Kanan
    width: "100%",
    paddingVertical: Spacing.two,
    backgroundColor: "#FFFFFF",
  },
  tabFlex: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  plusButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#06B6D4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pressed: {
    opacity: 0.7,
  },
});
