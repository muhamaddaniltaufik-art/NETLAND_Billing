let data = JSON.parse(localStorage.getItem('pelanggan') || '[]');

function simpan() {
    localStorage.setItem('pelanggan', JSON.stringify(data));
}

function statusPelanggan(dueDate) {
    const today = new Date().getDate();

    if (today <= dueDate) {
        return "Aktif";
    }

    if (today <= dueDate + 3) {
        return "Menunggak";
    }

    return "Suspend";
}

function render() {

    let keyword =
document.getElementById("search")
?.value
?.toLowerCase() || "";

let filter =
document.getElementById(
"filterStatus"
)?.value || "Semua";
    
    let html = '';

    data.forEach((p, i) => {

if(
 !p.nama.toLowerCase()
 .includes(keyword)
){
 return;
}
        
        let status = statusPelanggan(
            parseInt(p.dueDate)
        );

        if(
 filter !== "Semua" &&
 status !== filter
){
 return;
        }

        html += `
        <div class="customer-card">

<button onclick="lihatRiwayat(${i})">
Riwayat
</button>

<button onclick="invoice(${i})">
Invoice
</button>

            <h3>${p.nama}</h3>

            <p>WA : ${p.wa}</p>

            <p>Paket : ${p.paketNama}</p>

            <p>Tagihan :
            Rp ${parseInt(p.tagihan).toLocaleString('id-ID')}
            </p>

            <p>Jatuh Tempo :
            Tanggal ${p.dueDate}
            </p>

            <p>Status :
            <b>${status}</b>
            </p>

            <button onclick="bayar(${i})">
                Bayar
            </button>

            <button onclick="wa(${i})">
                WhatsApp
            </button>

            <button onclick="editData(${i})">
                Edit
            </button>

            <button onclick="hapus(${i})">
                Hapus
            </button>

        </div>
        `;
    });

    document.getElementById('list').innerHTML = html;

    simpan();
}

updateDashboard();

function tambah() {

    const paket = document.getElementById("paket");

    data.push({

        nama: document.getElementById("nama").value,

        wa: document.getElementById("wa").value,

        paketNama:
            paket.options[paket.selectedIndex].text,

        tagihan: paket.value,

        dueDate:
            document.getElementById("dueDate").value,

        paid: false
    });

    render();
}

function bayar(index) {

    data[index].paid = true;

    simpan();

    alert("Pembayaran berhasil dicatat");

    render();
}

function hapus(index) {

    if (confirm("Hapus pelanggan ini?")) {

        data.splice(index, 1);

        render();
    }
}

function editData(index) {

    let p = data[index];

    let nama =
        prompt("Nama", p.nama);

    if (nama === null) return;

    let wa =
        prompt("WhatsApp", p.wa);

    if (wa === null) return;

    p.nama = nama;
    p.wa = wa;

    render();
}

function wa(index) {

    let p = data[index];

    let pesan = `NETLAND.ID

Halo ${p.nama}

Tagihan internet Anda

Paket :
${p.paketNama}

Nominal :
Rp ${parseInt(p.tagihan).toLocaleString('id-ID')}

Jatuh Tempo :
Tanggal ${p.dueDate}

Terima kasih.`;

    window.open(
        "https://wa.me/" +
        p.wa +
        "?text=" +
        encodeURIComponent(pesan)
    );
}

render();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

function updateDashboard(){

 let total = data.length;

 let paid = 0;

 let late = 0;

 data.forEach(c=>{

   let status =
   statusPelanggan(c);

   if(status==="Lunas")
      paid++;

   if(
      status==="Menunggak" ||
      status==="Suspend"
   )
      late++;
 });

 document.getElementById(
 "totalCustomer"
 ).innerText = total;

 document.getElementById(
 "totalPaid"
 ).innerText = paid;

 document.getElementById(
 "totalLate"
 ).innerText = late;

 document.getElementById(
 "income"
 ).innerText =
 "Rp " +
 pendapatanBulanIni()
 .toLocaleString("id-ID");
}


function exportBackup(){

 const blob =
 new Blob(
 [JSON.stringify(data)],
 {type:'application/json'}
 );

 const a =
 document.createElement('a');

 a.href =
 URL.createObjectURL(blob);

 a.download =
 'netland_backup.json';

 a.click();
}

function restoreJSON(){

 const file =
 document.getElementById(
 'restoreFile'
 ).files[0];

 if(!file) return;

 const reader =
 new FileReader();

 reader.onload = ()=>{

   data =
   JSON.parse(
   reader.result
   );

   simpan();

   render();

   alert(
   "Restore berhasil"
   );
 };

 reader.readAsText(file);
}

function exportCSV(){

 let csv =
 "Nama,WA,Paket,Tagihan\\n";

 data.forEach(p=>{

 csv +=
 `${p.nama},
 ${p.wa},
 ${p.paketNama},
 ${p.tagihan}\\n`;
 });

 const blob =
 new Blob(
 [csv],
 {type:'text/csv'}
 );

 const a =
 document.createElement('a');

 a.href =
 URL.createObjectURL(blob);

 a.download =
 'pelanggan.csv';

 a.click();
}

function invoice(index){

 const p = data[index];

 const { jsPDF } =
 window.jspdf;

 const doc =
 new jsPDF();

 doc.text(
 "NETLAND.ID",
 20,
 20
 );

 doc.text(
 "Nama : "+p.nama,
 20,
 40
 );

 doc.text(
 "Paket : "+p.paketNama,
 20,
 50
 );

 doc.text(
 "Tagihan : Rp "+
 p.tagihan,
 20,
 60
 );

 doc.save(
 "invoice.pdf"
 );
}
