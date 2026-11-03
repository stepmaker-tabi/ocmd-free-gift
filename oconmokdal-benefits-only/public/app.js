// Protected destinations and HTML are decrypted only after the master password succeeds.
const CONFIG = {
  benefits: [
    { title: '오리지널 코드 수익화 봇', action: '수익화 봇 사용하기' },
    { title: '오리지널 코드 한줄 챗봇', action: '한줄 챗봇 사용하기' },
    { title: '구매과정 망설임 봇', action: '구매 망설임 분석 봇 사용하기' },
    { title: '30일 콘텐츠 캘린더 프롬프트', action: '콘텐츠 캘린더 프롬프트 열기' }
  ]
};
let resourceUrl = null;
function clearResources() {
  if (resourceUrl) URL.revokeObjectURL(resourceUrl);
  resourceUrl = null;
  CONFIG.benefits.forEach(benefit => { delete benefit.url; delete benefit.html; });
}
async function unlockResources(password) {
  const response = await fetch('assets/benefits.enc.json', {cache:'no-store'});
  if (!response.ok) throw new Error('resource-load-failed');
  const payload = await response.json();
  const decode = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({name:'PBKDF2',salt:decode(payload.salt),iterations:payload.iterations,hash:'SHA-256'}, material, {name:'AES-GCM',length:256}, false, ['decrypt']);
  const plaintext = await crypto.subtle.decrypt({name:'AES-GCM',iv:decode(payload.iv)}, key, decode(payload.data));
  const resources = JSON.parse(new TextDecoder().decode(plaintext));
  clearResources();
  CONFIG.benefits = resources.benefits;
  resourceUrl = URL.createObjectURL(new Blob([CONFIG.benefits[3].html], {type:'text/html;charset=utf-8'}));
  CONFIG.benefits[3].url = resourceUrl;
  delete CONFIG.benefits[3].html;
}
let unlocked = false;
const $ = s => document.querySelector(s);
const form = $('#password-form'), input = $('#master-password'), message = $('#password-message');
function notify(text) {
  const el = $('#toast'); el.textContent = text; el.classList.add('visible');
  clearTimeout(notify.timer); notify.timer = setTimeout(() => el.classList.remove('visible'), 3500);
}
function setUnlocked(value, announce = true) {
  unlocked = value;
  if (!value) clearResources();
  $('#unlock').classList.toggle('open', value);
  form.hidden = value;
  $('.unlocked-actions').hidden = !value;
  $('#unlock-title').textContent = value ? '참여자 혜택 4종이 모두 열렸어요.' : '비밀번호 하나로, 혜택 4종을 한 번에.';
  $('#unlock-description').textContent = value ? '아래에서 원하는 혜택을 선택해 바로 시작해보세요.' : '특강에서 안내받은 비밀번호를 입력해주세요.';
  $('#gate-icon use').setAttribute('href', value ? '#check' : '#lock');
  $('.collection-status use').setAttribute('href', value ? '#check' : '#lock');
  $('#collection-status').textContent = value ? '참여자 혜택 전체 열림' : '비밀번호 입력 후 이용 가능';
  message.classList.remove('error');
  message.textContent = value ? '특강에 함께해주셔서 감사합니다.' : '한 번 입력하면 아래 모든 혜택을 이용할 수 있어요.';
  input.removeAttribute('aria-invalid'); input.value = '';
  document.querySelectorAll('.locked-benefit').forEach(button => {
    button.classList.toggle('is-open', value);
    button.querySelector('span').textContent = value ? CONFIG.benefits[Number(button.dataset.benefit)-1].action : (Number(button.dataset.benefit) === 4 ? '비밀번호 입력하고 열람하기' : '비밀번호 입력하고 사용하기');
    button.href = value ? CONFIG.benefits[Number(button.dataset.benefit)-1].url : '#unlock';
    if(value) {button.target = '_blank'; button.rel = 'noopener noreferrer';}
    else {button.removeAttribute('target'); button.removeAttribute('rel');}
  });
  if (announce) notify(value ? '혜택 4종이 열렸어요. 원하는 혜택을 선택해주세요.' : '모든 혜택을 다시 잠갔어요.');
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  const password = input.value.trim();
  if (!password) {
    message.textContent = '비밀번호를 입력해주세요.';
    message.classList.add('error'); input.setAttribute('aria-invalid','true'); input.focus(); return;
  }
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true; submit.setAttribute('aria-busy','true');
  try {
    await unlockResources(password);
    setUnlocked(true); $('.unlocked-actions a').focus({preventScroll:true});
  } catch (error) {
    console.error('Benefit unlock failed:', error.name, error.message);
    message.textContent = error.name === 'OperationError' ? '비밀번호를 다시 확인해주세요.' : '혜택을 불러오지 못했어요. 잠시 후 다시 시도해주세요.';
    message.classList.add('error'); input.setAttribute('aria-invalid','true'); input.focus();
  } finally {
    submit.disabled = false; submit.removeAttribute('aria-busy');
  }
});
$('#toggle-password').addEventListener('click', event => {
  const visible = input.type === 'password'; input.type = visible ? 'text' : 'password';
  event.currentTarget.setAttribute('aria-pressed', String(visible));
  event.currentTarget.setAttribute('aria-label', visible ? '비밀번호 숨기기' : '비밀번호 표시');
});
$('#relock').addEventListener('click', () => { setUnlocked(false); input.focus({preventScroll:true}); });
document.querySelectorAll('.locked-benefit').forEach(button => button.addEventListener('click', event => {
  if (!unlocked) {
    event.preventDefault();
    $('#unlock').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'center'});
    input.focus({preventScroll:true}); notify('공통 비밀번호를 입력하면 혜택 4종이 함께 열려요.');
  }
}));
document.querySelectorAll('.video-toggle').forEach(button => {
  const video = document.getElementById(button.dataset.video);
  function sync() { button.textContent = video.paused ? '재생하기' : '일시정지'; button.setAttribute('aria-label', (video.id === 'strategy-video' ? '수익화 전략 봇 영상 ' : '오리지널 코드 봇 영상 ') + (video.paused ? '재생' : '일시정지')); }
  button.addEventListener('click', () => { if (video.paused) video.play().catch(()=>{}); else video.pause(); });
  video.addEventListener('play', sync); video.addEventListener('pause', sync);
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) { video.autoplay = false; video.pause(); }
  sync();
});

// Illustrations pause off-screen and respect the visitor's motion preference.
const motionStages = document.querySelectorAll('.motion-stage');
const motionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.target.classList.toggle('in-view',entry.isIntersecting));
}, {threshold:0.15});
motionStages.forEach(stage => {
  motionObserver.observe(stage);
  const toggle = stage.querySelector('.motion-toggle');
  const name = stage.dataset.motion === 'decision' ? '구매 망설임' : '콘텐츠 캘린더';
  toggle.addEventListener('click', () => {
    const paused = stage.classList.toggle('is-paused');
    toggle.textContent = paused ? '재생하기' : '일시정지';
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.setAttribute('aria-label', name + ' 일러스트 ' + (paused ? '재생' : '일시정지'));
  });
});
