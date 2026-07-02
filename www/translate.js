const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'app.html');
let content = fs.readFileSync(appFile, 'utf8');

const replacements = [
  [/Pemasukan/g, 'Income'],
  [/Pengeluaran/g, 'Expense'],
  [/Calon Income/g, 'Projected Income'],
  [/Calon Expense/g, 'Projected Expense'],
  [/Total Saldo/g, 'Total Balance'],
  [/Semua rekening/g, 'All accounts'],
  [/Transaksi Terakhir/g, 'Recent Transactions'],
  [/Aktivitas terbaru/g, 'Recent activity'],
  [/Rekening &amp; Dompet/g, 'Accounts &amp; Wallets'],
  [/Rekening \/ Dompet/g, 'Account / Wallet'],
  [/Kelola semua akun keuangan Anda/g, 'Manage all your financial accounts'],
  [/Tambah Akun/g, 'Add Account'],
  [/Tambah Transaksi/g, 'Add Transaction'],
  [/Tambah Rekening/g, 'Add Account'],
  [/Tambah/g, 'Add'],
  [/Uang masuk yang sudah diterima/g, 'Income that has been received'],
  [/Expense yang sudah terjadi/g, 'Expenses that have occurred'],
  [/Template pemasukan — bisa berulang otomatis/g, 'Income template — can repeat automatically'],
  [/Langganan, cicilan, hutang — bisa berulang otomatis/g, 'Subscriptions, installments, debt — can repeat automatically'],
  [/Deskripsi/g, 'Description'],
  [/Akun/g, 'Account'],
  [/Kategori/g, 'Category'],
  [/Jenis/g, 'Type'],
  [/Tanggal/g, 'Date'],
  [/Jumlah/g, 'Amount'],
  [/Catatan/g, 'Note'],
  [/Aksi/g, 'Action'],
  [/Pengulangan/g, 'Recurrence'],
  [/Mulai/g, 'Start'],
  [/Batas/g, 'Limit'],
  [/Per Periode/g, 'Per Period'],
  [/Expense per Category/g, 'Expense by Category'],
  [/Income per Category/g, 'Income by Category'],
  [/Expense per Account/g, 'Expense by Account'],
  [/Rekening mana paling banyak digunakan/g, 'Which account is used most'],
  [/Kategori Kustom/g, 'Custom Category'],
  [/Jumlah Hari/g, 'Number of Days'],
  [/Tanggal Berakhir/g, 'End Date'],
  [/opsional/g, 'optional'],
  [/Batal/g, 'Cancel'],
  [/Simpan/g, 'Save'],
  [/Hapus/g, 'Delete'],
  [/Belum ada transaksi/g, 'No transactions yet'],
  [/Belum ada akun/g, 'No accounts yet'],
  [/Belum ada data/g, 'No data yet'],
  [/Laporan/g, 'Report'],
  [/Semua/g, 'All'],
  [/Total Income/g, 'Total Income'],
  [/Total Expense/g, 'Total Expense'],
  [/Calon Masuk/g, 'Projected In'],
  [/Calon Keluar/g, 'Projected Out'],
  [/pemasukan/g, 'income'],
  [/pengeluaran/g, 'expense'],
  [/calon_income/g, 'projected_income'],
  [/calon_expense/g, 'projected_expense'],
  [/Hari Ini/g, 'Today'],
  [/Bulan Ini/g, 'This Month'],
  [/Bulan Lalu/g, 'Last Month'],
  [/Tahun Ini/g, 'This Year'],
  [/Rekening/g, 'Account'],
  [/Dompet/g, 'Wallet'],
  [/Tunai/g, 'Cash'],
  [/Keluar dari/g, 'Logout from'],
  [/Klik Add Transaksi untuk mulai/g, 'Click Add Transaction to start'],
  [/Klik Add untuk mulai/g, 'Click Add to start'],
  [/Tambah rekening atau dompet dulu/g, 'Add account or wallet first'],
  [/Tutup/g, 'Close'],
  [/Berikutnya:/g, 'Next:'],
  [/Sekali/g, 'Once'],
  [/Tanpa batas/g, 'Unlimited'],
  [/Data diekspor/g, 'Data exported'],
  [/Gaji Diterima/g, 'Salary Received'],
  [/Gaji Bulanan/g, 'Monthly Salary'],
  [/Makan Siang/g, 'Lunch'],
  [/Makanan/g, 'Food'],
  [/Gaji/g, 'Salary'],
  [/Langganan/g, 'Subscription'],
  [/pemasukan/g, 'income'],
  [/pengeluaran/g, 'expense'],
  [/calon_income/g, 'projected_income'],
  [/calon_expense/g, 'projected_expense'],
  [/Tabungan/g, 'Savings']
];

let newContent = content;
for (const [regex, replacement] of replacements) {
  newContent = newContent.replace(regex, replacement);
}

// Ensure the HTML title is updated
newContent = newContent.replace(/<title>FinTrack — Pencatat Keuangan<\/title>/g, '<title>FinTrack — Financial Tracker</title>');

fs.writeFileSync(appFile, newContent, 'utf8');
console.log('Translations applied to app.html');
