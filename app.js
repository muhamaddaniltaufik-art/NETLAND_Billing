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

    let html = '';

    data.forEach((p, i) => {

        let status = statusPelanggan(
            parseInt(p.dueDate)
        );

        html += `
        <div class="customer-card">

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
