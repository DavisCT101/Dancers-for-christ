/* Shared data layer used by BOTH index.html (website) and admin.html (admin).
   Today it saves to the browser (localStorage). To go live on all devices, replace get/set with calls to a backend (Firebase, Supabase, your own API). */
const DFC={
 get(k,d){try{const v=JSON.parse(localStorage.getItem('dfc_'+k));return v==null?d:v}catch(e){return d}},
 set(k,v){try{localStorage.setItem('dfc_'+k,JSON.stringify(v))}catch(e){alert('Browser storage is full. Use image links or smaller pictures.')}},
 esc:s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 safe:u=>{u=String(u||'').trim().replace(/\\/g,'/');if(/^data:image\/(jpeg|png|webp|gif);base64,[\w+\/=]+$/.test(u))return u;return /^(https?:\/\/[^\s'"]+|[\w\-. ()%\/]+)$/.test(u)?(/%/.test(u)?u:encodeURI(u)):''},
 admin(){return DFC.get('admin',{user:'admin',pass:'dfc2026',name:'DFC Admin',email:'',phone:'',role:'Administrator'})},
 resize(file,max=900){return new Promise(res=>{const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const s=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*s;c.height=i.height*s;c.getContext('2d').drawImage(i,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.72))};i.src=r.result};r.readAsDataURL(file)})},
 defaults:{
  u:[{t:'Worship rehearsal',d:'Monday, 6pm, Assembly Hall'},{t:'Choreography workshop',d:'Wednesday, 5pm, Main hall'},{t:'Campus outreach flashmob',d:'Friday, 1pm, Campus square'},{t:'Sunday service ministration',d:'Sunday, 9am'}],
  a:[{t:'Flashmob 2026',g:'https://photos.app.goo.gl/YNw3VYgW5zLePnJZ9'}],
  hero:Array.from({length:18},(_,i)=>`assets/images/img (${i+1}).jpg`)
 }
};
