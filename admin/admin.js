const ADMIN={user:'admin',pass:'dfc2026'};
const $=s=>document.querySelector(s);
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

let updates=store.get('dfc_u',[{t:'Prayer Kesha',d:'Friday, 7pm, Mainhall',i:'assets/updates/sun.jpeg'},{t:'The Fruit of the spirit',d:'Wednesday, 5:50pm, LH 24', i:'assets/updates/sun1.jpeg'},{t:'Evangelism',d:'Friday, 6:50pm, Pavilion', i:'assets/updates/sun4.jpeg'},{t:'Intercessory Prayers',d:'Sunday, 7am, Mainhall', i:'assets/updates/sun3.jpeg'}]);
let albums=store.get('dfc_a',[{t:'Creative Night',i:'assets/images/img15.jpg',g:'https://photos.app.goo.gl/YNw3VYgW5zLePnJZ9'}]);

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;w'}[c]));

function isAdmin(){try{return sessionStorage.getItem('dfc_admin')==='1'}catch(e){return false}}
function setAdmin(v){try{sessionStorage.setItem('dfc_admin',v?'1':'0')}catch(e){}}

function checkAuthState(){
  if(isAdmin()){
    $('#loginCard').classList.add('hidden');
    $('#panelCard').classList.remove('hidden');
    listAdmin();
  } else {
    $('#loginCard').classList.remove('hidden');
    $('#panelCard').classList.add('hidden');
  }
}

$('#lf').onsubmit=e=>{
  e.preventDefault();
  if($('#lu').value===ADMIN.user&&$('#lp').value===ADMIN.pass){
    setAdmin(true);
    $('#lp').value='';
    $('#lm').textContent='';
    checkAuthState();
  } else {
    $('#lm').textContent='Wrong username or password.';
  }
};

$('#out').onclick=()=>{
  setAdmin(false);
  checkAuthState();
};

function listAdmin(){
  $('#ul').innerHTML=updates.map((u,i)=>`<div class="row"><span>${esc(u.t)}</span><button data-u="${i}">Delete</button></div>`).join('');
  $('#al').innerHTML=albums.map((u,i)=>`<div class="row"><span>${esc(u.t)}</span><button data-a="${i}">Delete</button></div>`).join('');
}

$('#panelCard').addEventListener('click',e=>{
  const d=e.target.dataset;
  if(d.u!==undefined) updates.splice(+d.u,1);
  else if(d.a!==undefined) albums.splice(+d.a,1);
  else return;
  save();
});

function save(){
  store.set('dfc_u',updates);
  store.set('dfc_a',albums);
  listAdmin();
}

$('#uf').onsubmit=e=>{
  e.preventDefault();
  updates.unshift({t:$('#ut').value,d:$('#ud').value,i:$('#ui').value});
  e.target.reset();
  save();
};

$('#af').onsubmit=e=>{
  e.preventDefault();
  albums.unshift({t:$('#at').value,i:$('#ai').value,g:$('#ag').value});
  e.target.reset();
  save();
};

// Initialize state on load
checkAuthState();