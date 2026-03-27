
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

$('#loginBtn').addEventListener('click', ()=>{
  toast('V5 đang chờ bạn cắm Firebase. Sau đó sẽ đăng nhập và đồng bộ đa thiết bị.');
});

$('#registerBtn').addEventListener('click', ()=>{
  toast('V5 đang chờ firebaseConfig. Khi cắm xong, tài khoản đầu tiên có thể bootstrap quyền admin.');
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
