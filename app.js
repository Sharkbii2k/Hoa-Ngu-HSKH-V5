
const $ = (s)=>document.querySelector(s);
const $$ = (s)=>document.querySelectorAll(s);

$$('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    $$('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    $$('.auth-form').forEach(f=>f.classList.remove('active'));
    document.getElementById(btn.dataset.tab + 'Form').classList.add('active');
  });
});

function toast(msg){
  $('#notice').textContent = msg;
}

const auth = firebase.auth();
const db = firebase.firestore();
$('#registerBtn').addEventListener('click', async () => {
  const email = $('#registerEmail')?.value?.trim();
  const password = $('#registerPassword')?.value?.trim();

  if (!email || !password) {
    toast('Vui lòng nhập email và mật khẩu.');
    return;
  }

  try {
    const userCred = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCred.user.uid;

    // kiểm tra đã có admin chưa
    const adminSnap = await db.collection('users').where('role', '==', 'admin').limit(1).get();
    const role = adminSnap.empty ? 'admin' : 'user';

    await db.collection('users').doc(uid).set({
      email,
      role,
      status: 'active',
      vipLevels: role === 'admin' ? ['HSK1','HSK2','HSK3','HSK4','HSK5','HSK6','HSK7','HSK8','HSK9','HSKK'] : ['HSK1'],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    toast(role === 'admin' ? 'Đăng ký thành công. Đây là tài khoản Admin đầu tiên.' : 'Đăng ký thành công.');
  } catch (err) {
    toast(err.message || 'Đăng ký thất bại.');
  }
});

$('#loginBtn').addEventListener('click', async () => {
  const email = $('#loginEmail')?.value?.trim();
  const password = $('#loginPassword')?.value?.trim();

  if (!email || !password) {
    toast('Vui lòng nhập email và mật khẩu.');
    return;
  }

  try {
    const userCred = await auth.signInWithEmailAndPassword(email, password);
    const uid = userCred.user.uid;

    const doc = await db.collection('users').doc(uid).get();
    const profile = doc.exists ? doc.data() : null;

    if (profile && profile.status === 'locked') {
      await auth.signOut();
      toast('Tài khoản của bạn đang bị khóa.');
      return;
    }

    toast(profile?.role === 'admin' ? 'Đăng nhập Admin thành công.' : 'Đăng nhập thành công.');
  } catch (err) {
    toast('Sai email hoặc mật khẩu.');
  }
});

function getChineseVoice() {
  const voices = speechSynthesis.getVoices();

  return voices.find(v =>
    v.lang.toLowerCase().includes("zh") ||
    /ting|mei|siri/i.test(v.name)
  ) || null;
}
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);

  utter.lang = "zh-CN";
  utter.rate = 0.9;
  utter.pitch = 1;

  const voice = getChineseVoice();
  if (voice) utter.voice = voice;

  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}
$('#playSampleBtn').addEventListener('click', ()=> speak('你好，欢迎使用花语HSK。'));
$$('[data-speak]').forEach(btn => btn.addEventListener('click', ()=> speak(btn.dataset.speak)));

function initSakura(){
  const layer = document.getElementById('sakuraLayer');
  const count = window.innerWidth < 520 ? 16 : 28;
  for(let i=0;i<count;i++){
    const p = document.createElement('span');
    p.className = 'petal';
    p.style.left = Math.random()*100 + 'vw';
    p.style.animationDuration = (10 + Math.random()*10) + 's';
    p.style.animationDelay = (-Math.random()*8) + 's';
    p.style.opacity = (0.4 + Math.random()*0.45).toFixed(2);
    p.style.transform = 'scale(' + (0.7 + Math.random()*0.8).toFixed(2) + ')';
    layer.appendChild(p);
  }
}
initSakura();
window.speechSynthesis?.addEventListener?.('voiceschanged', ()=>{});
speechSynthesis.onvoiceschanged = () => {
  console.log("Voices loaded:", speechSynthesis.getVoices());
};
document.body.addEventListener("click", () => {
  speechSynthesis.getVoices();
}, { once: true });
