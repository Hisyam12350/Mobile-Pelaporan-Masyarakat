export const BASE_URL = "https://meredith-toylike-jeana.ngrok-free.dev";

export const API = {
  // Auth
  login: `${BASE_URL}/api/login`,
  register: `${BASE_URL}/api/register`,

  // Users
  users: `${BASE_URL}/api/users`,
  userById: (id: string) => `${BASE_URL}/api/users/${id}`,
  editGambarUser: (id: string) => `${BASE_URL}/api/users/edit/${id}`,
  gantiPassword: (id: string) => `${BASE_URL}/api/users/ganti-password/${id}`,

  // Laporan
  laporan: `${BASE_URL}/api/laporan`,
  laporanById: (id: string) => `${BASE_URL}/api/laporan/${id}`,
  laporanByUser: (id: string) => `${BASE_URL}/api/laporan/user/${id}`,
  laporanTotal: `${BASE_URL}/api/laporan/total`,
  laporanTotalByUser: (id: string) => `${BASE_URL}/api/laporan/total/user/${id}`,
  laporanStatistik: `${BASE_URL}/api/laporan/statistik`,

  // Kategori
  kategori: `${BASE_URL}/api/kategori`,
  kategoriById: (id: string) => `${BASE_URL}/api/kategori/${id}`,

  // Komentar
  komentar: `${BASE_URL}/api/komentar`,
  komentarByLaporan: (id: string) => `${BASE_URL}/api/komentar/${id}`,
  komentarById: (id: string) => `${BASE_URL}/api/balasKomentar/${id}`,

  // Gambar
  gambar: (filename: string) => `${BASE_URL}/gambar/${filename}`,
};
