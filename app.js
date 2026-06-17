
let data=JSON.parse(localStorage.getItem('pelanggan')||'[]');
function render(){
let html='';
data.forEach((p,i)=>{
html+=`<li>${p.nama} - Rp${p.tagihan}
<button onclick="wa(${i})">WA</button></li>`;
});
document.getElementById('list').innerHTML=html;
localStorage.setItem('pelanggan',JSON.stringify(data));
}
function tambah(){
data.push({
nama:nama.value,
wa:wa.value,
tagihan:paket.value
});
render();
}
function wa(i){
let p=data[i];
let msg=`NETLAND.ID\nTagihan internet Anda Rp${p.tagihan}`;
window.open('https://wa.me/'+p.wa+'?text='+encodeURIComponent(msg));
}
render();
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js');}
