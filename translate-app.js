const fs = require('fs');
const path = require('path');

const appFile = path.join(__dirname, 'app.html');
let content = fs.readFileSync(appFile, 'utf8');

// 1. Inject i18n.js script and language toggle button
if (!content.includes('i18n.js')) {
  content = content.replace(
    /<script>/g,
    '<script src="i18n.js"></script>\n<script>'
  );
}

if (!content.includes('toggleLanguage()')) {
  content = content.replace(
    /<button class="bic" onclick="toggleTheme\(\)" aria-label="Toggle theme">/g,
    `<button class="bic" onclick="toggleLanguage()" aria-label="Toggle language" title="Switch Language" style="display:flex;align-items:center;gap:4px">
          <i data-lucide="globe" style="width:18px;height:18px"></i> <span style="font-size:12px;font-weight:bold" id="lang-ind">EN</span>
        </button>
        <button class="bic" onclick="toggleTheme()" aria-label="Toggle theme">`
  );
}

// Add event listener to update language indicator
if (!content.includes("document.getElementById('lang-ind')")) {
  content = content.replace(
    /function toggleTheme\(\)\{/g,
    `window.addEventListener('languageChanged', function() {
  document.getElementById('lang-ind').textContent = currentLang.toUpperCase();
  render(); // trigger re-render of dynamic tables
});
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('lang-ind').textContent = currentLang.toUpperCase();
});\nfunction toggleTheme(){`
  );
}

// 2. Replace static text with data-i18n attributes
const staticReplacements = [
  // Navbar / Sidebar
  ['<title>FinTrack — Financial Tracker</title>', '<title data-i18n="app_title">FinTrack — Financial Tracker</title>'],
  ['<div class="nt">Dashboard</div>', '<div class="nt" data-i18n="nav_dashboard">Dashboard</div>'],
  ['<div class="nt">Transaction</div>', '<div class="nt" data-i18n="nav_transaction">Transaction</div>'],
  ['<div class="nt">Bank &amp; Wallet</div>', '<div class="nt" data-i18n="nav_accounts">Bank &amp; Wallet</div>'],
  ['<div class="nt">Income</div>', '<div class="nt" data-i18n="nav_income">Income</div>'],
  ['<div class="nt">Outcome</div>', '<div class="nt" data-i18n="nav_outcome">Outcome</div>'],
  ['<div class="nt">Projected Income</div>', '<div class="nt" data-i18n="nav_proj_in">Projected Income</div>'],
  ['<div class="nt">Projected Expense</div>', '<div class="nt" data-i18n="nav_proj_out">Projected Expense</div>'], // Actually it's Outcome but let's match
  ['<div class="nt">Projected Outcome</div>', '<div class="nt" data-i18n="nav_proj_out">Projected Outcome</div>'],
  ['<div class="nt">Report</div>', '<div class="nt" data-i18n="nav_report">Report</div>'],
  ['<button class="btn bg bsm" onclick="doLogout()"><i data-lucide="log-out"></i>Logout</button>', '<button class="btn bg bsm" onclick="doLogout()"><i data-lucide="log-out"></i><span data-i18n="logout">Logout</span></button>'],
  
  // Dashboard Header
  ['<div class="pgtit" id="ptitle">Dashboard</div>', '<div class="pgtit" id="ptitle" data-i18n="nav_dashboard">Dashboard</div>'],
  ['<div class="pgsub" id="psub">Ringkasan keuangan Anda</div>', '<div class="pgsub" id="psub" data-i18n="dash_desc">Your financial summary</div>'],
  ['<button class="btn bp bsm" onclick="openModalTrx()"><i data-lucide="plus"></i>Add Transaction</button>', '<button class="btn bp bsm" onclick="openModalTrx()"><i data-lucide="plus"></i><span data-i18n="add_transaction">Add Transaction</span></button>'],

  // Modals
  ['<span id="mtrx-ttl">Add Transaction</span>', '<span id="mtrx-ttl" data-i18n="add_transaction">Add Transaction</span>'],
  ['<label class="fl">Description</label>', '<label class="fl" data-i18n="desc">Description</label>'],
  ['<label class="fl">Amount (Rp)</label>', '<label class="fl" data-i18n="amount">Amount (Rp)</label>'],
  ['<label class="fl">Type</label>', '<label class="fl" data-i18n="type">Type</label>'],
  ['<option value="income">Income</option>', '<option value="income" data-i18n="income">Income</option>'],
  ['<option value="expense">Expense</option>', '<option value="expense" data-i18n="expense">Expense</option>'],
  ['<option value="projected_income">Projected Income</option>', '<option value="projected_income" data-i18n="nav_proj_in">Projected Income</option>'],
  ['<option value="projected_expense">Projected Expense</option>', '<option value="projected_expense" data-i18n="nav_proj_out">Projected Expense</option>'],
  ['<label class="fl">Account / Wallet</label>', '<label class="fl" data-i18n="nav_accounts">Account / Wallet</label>'],
  ['<label class="fl">Category</label>', '<label class="fl" data-i18n="category">Category</label>'],
  ['<label class="fl">Custom Category</label>', '<label class="fl" data-i18n="custom_cat">Custom Category</label>'],
  ['<label class="fl">Date</label>', '<label class="fl" data-i18n="date">Date</label>'],
  ['<label class="fl">Note <span class="fh">(optional)</span></label>', '<label class="fl"><span data-i18n="note">Note</span> <span class="fh" data-i18n="optional">(optional)</span></label>'],
  ['<input class="fi" id="f-note" placeholder="Note...">', '<input class="fi" id="f-note" placeholder="Note..." data-i18n="note">'],
  ['<label class="cb"><input type="checkbox" id="f-rec" onchange="toggleRec()"> Recurring Transaction</label>', '<label class="cb"><input type="checkbox" id="f-rec" onchange="toggleRec()"> <span data-i18n="recurrence">Recurring Transaction</span></label>'],
  ['<label class="fl">Frequency</label>', '<label class="fl" data-i18n="recurrence">Frequency</label>'],
  ['<label class="fl">Number of Days</label>', '<label class="fl" data-i18n="days_count">Number of Days</label>'],
  ['<label class="fl">Limit <span class="fh">(optional, e.g. 12x)</span></label>', '<label class="fl"><span data-i18n="limit">Limit</span> <span class="fh">(optional, e.g. 12x)</span></label>'],
  ['<label class="fl">End Date <span class="fh">(optional)</span></label>', '<label class="fl"><span data-i18n="end_date">End Date</span> <span class="fh" data-i18n="optional">(optional)</span></label>'],
  ['>Cancel</button>', ' data-i18n="cancel">Cancel</button>'],
  ['>Save</button>', ' data-i18n="save">Save</button>'],
  ['<span id="macc-ttl">Add Account / Wallet</span>', '<span id="macc-ttl" data-i18n="add_account">Add Account / Wallet</span>'],
  ['<label class="fl">Name</label>', '<label class="fl" data-i18n="desc">Name</label>'], // Use desc or add a new one
  ['<label class="fl">Initial Balance</label>', '<label class="fl" data-i18n="amount">Initial Balance</label>'],

  // Dash Cards
  ['>Total Balance</div>', ' data-i18n="total_balance">Total Balance</div>'],
  ['>All accounts</div>', ' data-i18n="all_accounts">All accounts</div>'],
  ['<div style="font-size:var(--sm);font-weight:600">Accounts &amp; Wallets</div>', '<div style="font-size:var(--sm);font-weight:600" data-i18n="nav_accounts">Accounts &amp; Wallets</div>'],
  ['>See All</button>', ' data-i18n="all">See All</button>'],
  ['<div class="ct">Projected Income</div>', '<div class="ct" data-i18n="nav_proj_in">Projected Income</div>'],
  ['<div class="ct">Projected Expense</div>', '<div class="ct" data-i18n="nav_proj_out">Projected Expense</div>'],

  // Report Static
  ['<div class="ct">Expense by Category</div>', '<div class="ct" data-i18n="exp_by_cat">Expense by Category</div>'],
  ['<div class="ct">Income by Category</div>', '<div class="ct" data-i18n="inc_by_cat">Income by Category</div>'],
  ['<div class="ct">Expense by Account</div>', '<div class="ct" data-i18n="exp_by_acc">Expense by Account</div>'],
  ['<div class="cs">Which account is most used</div>', '<div class="cs" data-i18n="acc_most_used">Which account is most used</div>']
];

for (const [search, replace] of staticReplacements) {
  content = content.replace(search, replace);
}

// 3. Dynamic JS text replacements with t()
// Table Headers
content = content.replace(/<th>Description<\/th>/g, `<th>'+t('desc')+'</th>`);
content = content.replace(/<th>Account<\/th>/g, `<th>'+t('account')+'</th>`);
content = content.replace(/<th>Category<\/th>/g, `<th>'+t('category')+'</th>`);
content = content.replace(/<th>Type<\/th>/g, `<th>'+t('type')+'</th>`);
content = content.replace(/<th>Date<\/th>/g, `<th>'+t('date')+'</th>`);
content = content.replace(/<th>Amount<\/th>/g, `<th>'+t('amount')+'</th>`);
content = content.replace(/<th>Action<\/th>/g, `<th>'+t('action')+'</th>`);
content = content.replace(/<th>Note<\/th>/g, `<th>'+t('note')+'</th>`);
content = content.replace(/<th>Recurrence<\/th>/g, `<th>'+t('recurrence')+'</th>`);
content = content.replace(/<th>Start<\/th>/g, `<th>'+t('start')+'</th>`);
content = content.replace(/<th>Limit<\/th>/g, `<th>'+t('limit')+'</th>`);
content = content.replace(/<th>Per Period<\/th>/g, `<th>'+t('per_period')+'</th>`);

// Empty states in functions
content = content.replace(/<h3>No accounts yet<\/h3><p>Add an account or wallet first<\/p>/g, `<h3>'+t('no_accounts')+'</h3><p>'+t('add_acc_first')+'</p>`);
content = content.replace(/<h3>No transactions yet<\/h3><p>Click Add Transaction to start<\/p>/g, `<h3>'+t('no_trx')+'</h3><p>'+t('click_add_trx')+'</p>`);
content = content.replace(/<h3>No data yet<\/h3><p>Add with button above<\/p>/g, `<h3>'+t('no_data')+'</h3>`);
content = content.replace(/<h3>No data yet<\/h3>/g, `<h3>'+t('no_data')+'</h3>`);
content = content.replace(/<h3>No expenses from any account<\/h3>/g, `<h3>'+t('no_exp_acc')+'</h3>`);
content = content.replace(/'Lihat Riwayat'/g, "t('recent_trx')");
content = content.replace(/Logout from/g, "'+t('logout_confirm')+'");
content = content.replace(/Data exported/g, "'+t('data_exported')+'");

// Prompts
content = content.replace(/'Hapus akun "' \+ \(a\?a\.name:'ini'\) \+ '" beserta ' \+ linked\.length \+ ' transaksi terkait\?'/g, "t('delete_acc_confirm', {name: a?a.name:'this', count: linked.length})");
content = content.replace(/'Hapus akun "' \+ \(a\?a\.name:'ini'\) \+ '"\?'/g, "t('delete_acc_confirm', {name: a?a.name:'this', count: 0})");
content = content.replace(/'Hapus transaksi ini\?'/g, "t('delete_trx_confirm')");

// vmeta mapping
content = content.replace(
  /var vmeta=\{[\s\S]*?dashboard:\['Dashboard','Your financial summary'\],[\s\S]*?\};/,
  `var vmeta={
  dashboard:['nav_dashboard','dash_desc'],
  akun:['nav_accounts','acc_desc'],
  pemasukan:['nav_income','inc_desc'],
  pengeluaran:['nav_outcome','out_desc'],
  cp:['nav_proj_in','pi_desc'],
  ck:['nav_proj_out','po_desc'],
  laporan:['nav_report','rep_desc'],
};`
);

// update gv() to use t() for m[0] and m[1]
content = content.replace(/document\.getElementById\('ptitle'\)\.textContent=m\[0\];/g, "document.getElementById('ptitle').textContent=t(m[0]);");
content = content.replace(/document\.getElementById\('psub'\)\.textContent=m\[1\];/g, "document.getElementById('psub').textContent=t(m[1]);");

// typeInfo using t()
content = content.replace(
  /function typeInfo\(t\)\{ var m=\{income:\['Income','bsuc'\],expense:\['Expense','berr'\],projected_income:\['Projected In','bgld'\],projected_expense:\['Projected Out','bora'\]\}; return m\[t\]\|\|\[t,'bpri'\]; \}/g,
  `function typeInfo(t){ var m={income:[t('income'),'bsuc'],expense:[t('expense'),'berr'],projected_income:[t('projected_income'),'bgld'],projected_expense:[t('projected_expense'),'bora']}; return m[t]||[t,'bpri']; }`
);

fs.writeFileSync(appFile, content, 'utf8');
console.log('Done transforming app.html');
