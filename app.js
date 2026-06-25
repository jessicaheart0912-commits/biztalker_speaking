const USERS_KEY = 'biztalker_one_users';
const ACTIVE_USER_KEY = 'biztalker_one_active_user';
const PENDING_SUBSCRIPTION_KEY = 'biztalker_one_pending_subscription';

const PLAN_CATALOG = {
  Free: {
    name: 'Free',
    monthly: 0,
    annual: 0,
    tagline: '핵심 학습 흐름을 먼저 경험하는 체험 플랜',
    badge: 'Preview',
    features: ['모듈별 첫 레슨 체험', '하루 2회 AI 롤플레이', '퀴즈 · 말하기 · 오답노트', '학습 기록 저장'],
    aiDailyLimit: 2,
    lessonAccess: 'preview',
    recommendedUpgrade: 'Starter'
  },
  Starter: {
    name: 'Starter',
    monthly: 44900,
    annual: 449000,
    tagline: '실무 영어 감각을 안정적으로 쌓아가는 에센셜 플랜',
    badge: 'Essential',
    features: ['전체 커리큘럼 이용', '하루 8회 AI 롤플레이', '기본 코치 피드백', '진도 관리 및 복습 기록'],
    aiDailyLimit: 8,
    lessonAccess: 'full',
    recommendedUpgrade: 'Pro'
  },
  Pro: {
    name: 'Pro',
    monthly: 69900,
    annual: 699000,
    tagline: '가장 균형 있게 설계된 시그니처 트레이닝 플랜',
    badge: 'Most Popular',
    features: ['Starter의 모든 기능', '하루 25회 AI 롤플레이', '심화 시나리오와 확장형 대화', '약점 기반 맞춤 피드백'],
    aiDailyLimit: 25,
    lessonAccess: 'full',
    recommendedUpgrade: 'Executive'
  },
  Executive: {
    name: 'Executive',
    monthly: 89900,
    annual: 899000,
    tagline: '중요한 미팅과 협상까지 준비하는 프리미엄 플랜',
    badge: 'Premium',
    features: ['Pro의 모든 기능', 'AI 롤플레이 사실상 무제한', '고난도 협상·회의 코칭', '프리미엄 피드백 흐름'],
    aiDailyLimit: 9999,
    lessonAccess: 'full',
    recommendedUpgrade: 'Executive'
  }
};

let modules = JSON.parse(JSON.stringify(MODULES));
const defaultBrand = {
  appName: 'BizTalker One',
  headline: '회의, 협상, 네트워킹을 실전처럼 훈련하는 AI 비즈니스 영어',
  subline: '실제 업무 장면을 바탕으로 말하기, 롤플레이, 피드백, 복습까지 자연스럽게 이어지는 프리미엄 학습 경험'
};
const defaultAI = {
  mode: 'mock',
  endpoint: '',
  model: '',
  apiKey: '',
  systemPrompt: 'You are a professional business English coach for Korean business learners. Reply with: 1) one natural business response in English, 2) a precise Korean coaching note covering grammar, tone, clarity, and vocabulary, 3) one improved model sentence the learner can reuse, and 4) one short follow-up question to continue the roleplay.'
};

const state = {
  activeUser: loadActiveUser(),
  users: loadUsers(),
  currentModuleId: MODULES[0].id,
  currentLessonId: MODULES[0].lessons[0].id,
  view: 'dashboard',
  search: '',
  coachLog: [],
  deferredPrompt: null,
  pendingSubscription: loadPendingSubscription(),
  checkout: { plan: 'Pro', cycle: 'monthly', coupon: '', feedback: '' },
  paymentPreviewType: 'success'
};

function loadUsers(){
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}
function saveUsers(){ localStorage.setItem(USERS_KEY, JSON.stringify(state.users)); }
function loadActiveUser(){
  try { return JSON.parse(localStorage.getItem(ACTIVE_USER_KEY) || 'null'); } catch { return null; }
}
function saveActiveUser(){ localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(state.activeUser)); }
function loadPendingSubscription(){
  try { return JSON.parse(localStorage.getItem(PENDING_SUBSCRIPTION_KEY) || 'null'); } catch { return null; }
}
function savePendingSubscription(){
  if (state.pendingSubscription) localStorage.setItem(PENDING_SUBSCRIPTION_KEY, JSON.stringify(state.pendingSubscription));
  else localStorage.removeItem(PENDING_SUBSCRIPTION_KEY);
}
function defaultProgress(){
  return {
    completed:{}, quiz:{}, speaking:{}, roleplay:{}, wrongNotes:[], xp:0, streak:0,
    lastStudyDate:null, lastLessonKey:null, editedLessons:{},
    brand:{ ...defaultBrand },
    ai:{ ...defaultAI },
    subscription:null,
    planUsage:{ aiRoleplay:{ date:'', count:0 } }
  };
}
function ensureUser(name, role){
  let user = state.users.find(u => u.name === name.trim());
  if (!user) {
    user = { id: Date.now(), name: name.trim(), role: (role || 'Business Professional').trim(), progress: defaultProgress() };
    state.users.push(user);
  } else {
    user.role = role?.trim() || user.role || 'Business Professional';
    user.progress = user.progress || defaultProgress();
    user.progress.brand = { ...defaultBrand, ...(user.progress.brand || {}) };
    user.progress.ai = { ...defaultAI, ...(user.progress.ai || {}) };
    user.progress.subscription = user.progress.subscription || null;
    user.progress.planUsage = user.progress.planUsage || { aiRoleplay:{ date:'', count:0 } };
  }
  if (state.pendingSubscription) {
    user.progress.subscription = { ...(user.progress.subscription || {}), ...state.pendingSubscription };
    state.pendingSubscription = null;
    savePendingSubscription();
  }
  state.activeUser = user;
  saveUsers();
  saveActiveUser();
  hydrateEditedLessons();
}
function progress(){ return state.activeUser.progress; }
function brand(){ return progress().brand || (progress().brand = { ...defaultBrand }); }
function aiConfig(){ return progress().ai || (progress().ai = { ...defaultAI }); }
function subscription(){ return progress().subscription || null; }
function currentPlanName(){ return subscription()?.plan || 'Free'; }
function currentPlan(){ return PLAN_CATALOG[currentPlanName()] || PLAN_CATALOG.Free; }
function planUsage(){ return progress().planUsage || (progress().planUsage = { aiRoleplay:{ date:'', count:0 } }); }
function syncDailyUsage(){
  const usage = planUsage().aiRoleplay || (planUsage().aiRoleplay = { date:'', count:0 });
  const today = new Date().toISOString().slice(0,10);
  if (usage.date !== today) {
    usage.date = today;
    usage.count = 0;
  }
  return usage;
}
function remainingRoleplayCount(){
  const limit = currentPlan().aiDailyLimit;
  if (limit >= 9999) return '무제한';
  return Math.max(limit - syncDailyUsage().count, 0);
}
function consumeRoleplayAttempt(){
  const limit = currentPlan().aiDailyLimit;
  if (limit >= 9999) return true;
  const usage = syncDailyUsage();
  if (usage.count >= limit) return false;
  usage.count += 1;
  saveAll();
  return true;
}
function lessonAccessInfo(moduleId, lessonId){
  const planName = currentPlanName();
  if (planName !== 'Free') return { allowed:true, reason:'', recommended:'Starter' };
  const module = getModule(moduleId);
  const allowed = module?.lessons?.[0]?.id === lessonId;
  return allowed
    ? { allowed:true, reason:'', recommended:'Starter' }
    : { allowed:false, reason:'Free에서는 각 모듈의 첫 레슨까지 먼저 경험할 수 있습니다. 다음 레슨부터는 Starter 이상에서 이어집니다.', recommended:'Starter' };
}
function canUseAdvancedFeedback(){ return ['Pro','Executive'].includes(currentPlanName()); }
function canUsePremiumCoach(){ return currentPlanName() === 'Executive'; }
function beginFreePlan(){
  if (state.activeUser) {
    setView('learn');
    return;
  }
  document.getElementById('authPanel').classList.remove('hidden');
  switchAuthPane('signupPane');
}
function promptUpgrade(reason, recommendedPlan = currentPlan().recommendedUpgrade || 'Starter'){
  openCheckout(recommendedPlan, reason);
}
function getPaymentResultCopy(type, planName = state.checkout.plan || currentPlanName()){
  const plan = planName || 'Starter';
  return {
    success: {
      badge: '결제 완료',
      badgeClass: 'success',
      title: '결제가 정상적으로 확인되었습니다',
      description: `${plan} 플랜이 연결되었으며 바로 학습을 이어갈 수 있습니다.`,
      message: plan === 'Starter' ? '이제 전체 레슨과 더 넉넉한 AI 롤플레이가 열렸습니다. 오늘 바로 학습을 이어가며 실무 영어 루틴을 끊김 없이 시작해보세요.' : '이제 전체 학습 흐름과 선택한 플랜의 AI 훈련 범위가 열립니다. 오늘 학습을 이어가며 바로 실전 감각을 쌓아보세요.',
      next: plan === 'Starter' ? '다음 추천: 대시보드에서 전체 커리큘럼을 확인한 뒤, 바로 다음 레슨이나 AI 롤플레이로 이어가보세요.' : '다음 추천: 대시보드에서 현재 플랜을 확인한 뒤, 이어서 학습 또는 AI 롤플레이를 시작해보세요.',
      actions: [
        { label:'대시보드로 이동', action:'dashboard', primary:true },
        { label:'AI 롤플레이 시작', action:'coach', primary:false }
      ]
    },
    fail: {
      badge: '결제 실패',
      badgeClass: 'fail',
      title: '결제를 완료하지 못했습니다',
      description: '입력 정보 또는 결제 진행 상태를 다시 확인한 뒤 이어서 시도할 수 있습니다.',
      message: plan === 'Starter' ? '조금만 더 확인하면 전체 레슨과 확장된 AI 훈련이 바로 열립니다. 카드 정보, 인증 상태 또는 네트워크 상황을 점검한 뒤 다시 이어가보세요.' : '카드 정보, 한도, 인증 상태 또는 네트워크 상황에 따라 결제가 중단될 수 있습니다. 입력 내용을 그대로 유지한 채 다시 확인해보세요.',
      next: plan === 'Starter' ? '다음 추천: 같은 Starter 플랜으로 다시 시도해 전체 학습 흐름을 열어보세요.' : '다음 추천: 결제 정보를 다시 확인하고 같은 플랜으로 재시도하거나, 잠시 후 다시 진행해보세요.',
      actions: [
        { label:'다시 결제하기', action:'retry', primary:true },
        { label:'플랜 다시 보기', action:'pricing', primary:false }
      ]
    },
    cancel: {
      badge: '결제 취소',
      badgeClass: 'cancel',
      title: '결제가 취소되었습니다',
      description: '아직 결제는 이루어지지 않았으며, 원하실 때 다시 이어서 진행할 수 있습니다.',
      message: plan === 'Starter' ? '조금 더 둘러본 뒤 결정해도 괜찮습니다. 다만 Starter로 이어가면 전체 레슨과 더 넉넉한 AI 훈련이 바로 열리므로, 학습 흐름을 끊기지 않게 이어가기 좋습니다.' : '조금 더 둘러본 뒤 결정해도 괜찮습니다. 현재 열려 있는 기능으로 학습 흐름을 먼저 경험한 다음, 필요해질 때 자연스럽게 이어가실 수 있습니다.',
      next: plan === 'Starter' ? '다음 추천: Free와 Starter의 차이를 다시 보고, 필요해지는 순간 바로 이어가보세요.' : '다음 추천: 비교표에서 차이를 다시 확인하거나, 현재 플랜으로 학습을 이어가다가 필요한 시점에 다시 시작해보세요.',
      actions: [
        { label:'학습 계속하기', action:'continueLearning', primary:true },
        { label:'플랜 비교 다시 보기', action:'pricing', primary:false }
      ]
    }
  }[type] || null;
}
function renderPaymentResult(type, planName = state.checkout.plan || currentPlanName()){
  const copy = getPaymentResultCopy(type, planName);
  if (!copy) return;
  state.paymentPreviewType = type;
  document.getElementById('paymentResultTitle').textContent = copy.title;
  document.getElementById('paymentResultDescription').textContent = copy.description;
  const badge = document.getElementById('paymentResultBadge');
  badge.textContent = copy.badge;
  badge.className = `result-badge ${copy.badgeClass}`;
  document.getElementById('paymentResultMessage').textContent = copy.message;
  document.getElementById('paymentResultNext').textContent = copy.next;
  const actions = document.getElementById('paymentResultActions');
  actions.innerHTML = copy.actions.map(btn => `<button type="button" class="${btn.primary ? '' : 'ghost'}" data-payment-action="${btn.action}">${btn.label}</button>`).join('');
  actions.querySelectorAll('[data-payment-action]').forEach(btn => btn.addEventListener('click', () => handlePaymentResultAction(btn.dataset.paymentAction)));
}
function openPaymentResult(type, planName = state.checkout.plan || currentPlanName()){
  closeCheckout();
  renderPaymentResult(type, planName);
  document.getElementById('paymentResultModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closePaymentResult(){
  document.getElementById('paymentResultModal').classList.add('hidden');
  document.body.style.overflow = '';
}
function handlePaymentResultAction(action){
  const targetPlan = (state.checkout.plan && PLAN_CATALOG[state.checkout.plan] ? state.checkout.plan : 'Starter');
  if (action === 'dashboard') { closePaymentResult(); setView('dashboard'); return; }
  if (action === 'coach') { closePaymentResult(); setView('coach'); return; }
  if (action === 'retry') { closePaymentResult(); openCheckout(targetPlan, '결제 정보를 확인한 뒤 다시 진행해보세요.'); return; }
  if (action === 'pricing') { closePaymentResult(); document.getElementById('pricingSection').scrollIntoView({ behavior:'smooth' }); return; }
  if (action === 'continueLearning') { closePaymentResult(); if (state.activeUser) setView('learn'); else switchAuthPane('signupPane'); return; }
}
function handlePaymentResultFromQuery(){
  const params = new URLSearchParams(window.location.search);
  const result = params.get('payment');
  const plan = params.get('plan');
  if (!result || !['success','fail','cancel'].includes(result)) return;
  openPaymentResult(result, plan && PLAN_CATALOG[plan] ? plan : (state.checkout.plan || currentPlanName()));
}
function lessonKey(moduleId, lessonId){ return `${moduleId}__${lessonId}`; }
function getModule(moduleId = state.currentModuleId){ return modules.find(m => m.id === moduleId); }
function getLesson(moduleId = state.currentModuleId, lessonId = state.currentLessonId){ return getModule(moduleId).lessons.find(l => l.id === lessonId); }
function getAllLessons(){ return modules.flatMap(m => m.lessons.map(l => ({ moduleId:m.id, lessonId:l.id, module:m, lesson:l }))); }
function isDone(moduleId, lessonId){ return !!progress().completed[lessonKey(moduleId, lessonId)]; }
function completedCount(){ return Object.values(progress().completed || {}).filter(Boolean).length; }
function totalLessons(){ return getAllLessons().length; }
function progressPercent(){ return Math.round((completedCount()/totalLessons())*100) || 0; }
function avatar(name){ return (name || 'U').slice(0,2).toUpperCase(); }
function normalizeText(str){ return (str || '').toLowerCase().replace(/[^a-z0-9\s']/g, '').replace(/\s+/g, ' ').trim(); }
function similarity(expected, actual){
  const e = normalizeText(expected).split(' ').filter(Boolean);
  const a = normalizeText(actual).split(' ').filter(Boolean);
  if (!e.length || !a.length) return 0;
  let hits = 0;
  e.forEach(w => { if (a.includes(w)) hits += 1; });
  return Math.round((hits/e.length)*100);
}
function saveAll(){ saveUsers(); saveActiveUser(); }
function speak(text){
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = 0.92;
  speechSynthesis.speak(u);
}
function startVoiceCapture({ target, feedback, button, lang = 'en-US', onResult, onStartText = '듣는 중입니다...', onErrorText = '이 브라우저는 음성 인식을 지원하지 않습니다.' }){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
  const feedbackEl = typeof feedback === 'string' ? document.querySelector(feedback) : feedback;
  const buttonEl = typeof button === 'string' ? document.querySelector(button) : button;
  if (!SR) {
    if (feedbackEl) feedbackEl.textContent = onErrorText;
    return;
  }
  const rec = new SR();
  rec.lang = lang;
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  if (buttonEl) buttonEl.disabled = true;
  if (feedbackEl) feedbackEl.textContent = onStartText;
  rec.onresult = ev => {
    let transcript = '';
    for (let i = ev.resultIndex; i < ev.results.length; i += 1) {
      transcript += ev.results[i][0].transcript;
    }
    transcript = transcript.trim();
    if (targetEl) targetEl.value = transcript;
    if (typeof onResult === 'function') onResult(transcript, ev);
  };
  rec.onerror = e => {
    if (feedbackEl) feedbackEl.textContent = `음성 인식 오류: ${e.error}`;
    if (buttonEl) buttonEl.disabled = false;
  };
  rec.onend = () => {
    if (buttonEl) buttonEl.disabled = false;
  };
  rec.start();
}
function updateStudyMeta(){
  const today = new Date().toISOString().slice(0,10);
  if (progress().lastStudyDate === today) return;
  const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
  progress().streak = progress().lastStudyDate === yesterday ? (progress().streak || 0) + 1 : 1;
  progress().lastStudyDate = today;
}
function giveXp(amount){ progress().xp = (progress().xp || 0) + amount; updateStudyMeta(); saveAll(); }
function recommendLessons(){ return getAllLessons().filter(x => !isDone(x.moduleId, x.lessonId)).filter(x => lessonAccessInfo(x.moduleId, x.lessonId).allowed).slice(0,5); }
function hydrateEditedLessons(){
  modules = JSON.parse(JSON.stringify(MODULES));
  if (!state.activeUser) return;
  const edits = progress().editedLessons || {};
  Object.keys(edits).forEach(key => {
    const [moduleId, lessonId] = key.split('__');
    const lesson = getLesson(moduleId, lessonId);
    if (lesson) Object.assign(lesson, edits[key]);
  });
}
function renderAuth(){
  const loggedIn = !!state.activeUser;
  document.getElementById('landingShell').classList.toggle('hidden', loggedIn);
  document.getElementById('appShell').classList.toggle('hidden', !loggedIn);
  renderPendingSubscriptionHint();
  if (loggedIn) renderApp();
}
function renderSidebar(){
  document.getElementById('profileName').textContent = state.activeUser.name;
  document.getElementById('profileRole').textContent = state.activeUser.role;
  document.getElementById('profileXp').textContent = progress().xp || 0;
  document.getElementById('profileStreak').textContent = progress().streak || 0;
  document.getElementById('avatarBadge').textContent = avatar(state.activeUser.name);
  const sub = subscription();
  const subLabel = sub ? `${sub.plan} · ${sub.status === 'trial' ? '무료 체험 중' : '이용 중'}` : 'Free · 체험 중';
  document.getElementById('profileLine').textContent = `${state.activeUser.role} · ${subLabel}`;
  const q = state.search.trim().toLowerCase();
  document.getElementById('moduleMenu').innerHTML = modules.filter(m => {
    const hay = [m.title,m.titleEn,m.summary,...m.tags,...m.lessons.map(l => l.title + ' ' + l.titleEn + ' ' + l.expressions.map(e => e[0]).join(' '))].join(' ').toLowerCase();
    return !q || hay.includes(q);
  }).map(m => {
    const done = m.lessons.filter(l => isDone(m.id, l.id)).length;
    return `<div class="module-item ${m.id===state.currentModuleId?'active':''}" data-module="${m.id}"><div class="title">${m.emoji} ${m.title}</div><div class="sub">${m.titleEn}</div><div class="tiny">${m.lessons.length}개 중 ${done}개 완료</div></div>`;
  }).join('');
  document.querySelectorAll('.module-item').forEach(el => el.addEventListener('click', ()=> { const moduleId = el.dataset.module; setLesson(moduleId, getModule(moduleId).lessons[0].id); setView('learn'); }));
}
function renderDashboard(){
  document.title = brand().appName;
  document.querySelectorAll('.brand-lockup h1, .brand-lockup h2').forEach((el, idx) => {
    if (idx === 0) el.textContent = brand().appName;
  });
  document.getElementById('brandHeadline').textContent = brand().headline;
  document.getElementById('brandSubline').textContent = brand().subline;
  document.getElementById('heroTags').innerHTML = ['Desktop Web','Mobile Web','AI Roleplay','Bilingual','Premium Flow','Smart Review'].map(t => `<span class="pill">${t}</span>`).join('');
  document.getElementById('dashCompleted').textContent = completedCount();
  document.getElementById('dashWrong').textContent = (progress().wrongNotes || []).length;
  document.getElementById('dashSpeaking').textContent = Object.keys(progress().speaking || {}).length;
  document.getElementById('overallBar').style.width = `${progressPercent()}%`;
  document.getElementById('overallText').textContent = `총 ${totalLessons()}개 레슨 중 ${completedCount()}개 완료 · ${progressPercent()}% 진행 중`;
  document.getElementById('moduleProgress').innerHTML = modules.map(m => {
    const done = m.lessons.filter(l => isDone(m.id, l.id)).length;
    const pct = Math.round((done / m.lessons.length) * 100) || 0;
    return `<div class="info-card"><strong>${m.emoji} ${m.title}</strong><div class="muted">${m.lessons.length}개 중 ${done}개 완료</div><div class="progress-bar"><span style="width:${pct}%"></span></div></div>`;
  }).join('');
  const recs = recommendLessons();
  document.getElementById('recommendList').innerHTML = recs.length ? recs.map(r => `<div class="review-card"><strong>${r.module.emoji} ${r.module.title}</strong><div class="muted">${r.lesson.title}</div><div class="landing-actions"><button class="openRecBtn" data-key="${r.moduleId}__${r.lessonId}">이어서 학습하기</button></div></div>`).join('') : '<div class="muted">모든 레슨을 완료했습니다. 훌륭한 흐름입니다.</div>';
  document.querySelectorAll('.openRecBtn').forEach(btn => btn.addEventListener('click', ()=> { const [m,l] = btn.dataset.key.split('__'); setLesson(m,l); setView('learn'); }));
  const plan = currentPlan();
  const remaining = remainingRoleplayCount();
  const banner = document.getElementById('planBanner');
  if (banner) {
    const messageMap = {
      Free: { title:'조금 더 이어가면 학습 흐름이 훨씬 넓어집니다', body:`지금은 모듈별 첫 레슨과 하루 ${plan.aiDailyLimit}회의 AI 롤플레이로 핵심 감각을 경험하는 단계입니다. Starter로 이어가면 전체 레슨과 하루 8회의 AI 롤플레이가 열려 실무 영어 루틴을 끊김 없이 이어갈 수 있습니다.`, cta:'Starter로 전체 학습 열기' },
      Starter: { title:'전체 커리큘럼을 안정적으로 이어가는 단계입니다', body:`전체 레슨과 하루 ${plan.aiDailyLimit}회의 AI 롤플레이를 활용해 기본 실전 감각을 쌓을 수 있습니다. 더 깊은 맞춤 피드백이 필요해지면 Pro가 자연스럽게 이어집니다.`, cta:'Pro 살펴보기' },
      Pro: { title:'실전 대화 훈련을 본격적으로 확장하는 단계입니다', body:`하루 ${plan.aiDailyLimit}회의 AI 롤플레이와 심화 피드백으로 더 긴 대화 흐름을 다룰 수 있습니다. 고난도 코칭까지 준비하고 싶다면 Executive가 이어집니다.`, cta:'Executive 보기' },
      Executive: { title:'가장 깊이 있는 코칭 흐름으로 학습 중입니다', body:'중요한 회의와 협상 장면까지 대비할 수 있도록 프리미엄 코칭 흐름이 열려 있습니다.', cta:'' }
    };
    const copy = messageMap[currentPlanName()] || messageMap.Free;
    banner.innerHTML = `<div class="plan-banner-inner"><div><div class="eyebrow">현재 플랜 · ${currentPlanName()}</div><h3>${copy.title}</h3><p>${copy.body}</p></div><div class="plan-banner-side"><div class="plan-mini-stat"><span>오늘 남은 AI 롤플레이</span><strong>${remaining}${remaining === '무제한' ? '' : '회'}</strong></div>${copy.cta ? `<button class="pricing-cta small" data-upgrade-plan="${plan.recommendedUpgrade || 'Starter'}">${copy.cta}</button>` : '<div class="plan-badge-inline">Premium Coaching Active</div>'}</div></div>`;
    banner.querySelectorAll('[data-upgrade-plan]').forEach(btn => btn.addEventListener('click', ()=> openCheckout(btn.dataset.upgradePlan || 'Starter')));
  }
}
function renderLearnView(){
  const module = getModule();
  const lesson = getLesson();
  document.getElementById('moduleHeader').innerHTML = `<div class="module-head"><div class="pill-row"><span class="pill">${module.emoji} ${module.title}</span><span class="pill">${module.titleEn}</span></div><h3>${module.title}</h3><div class="muted">${module.summary}</div></div>`;
  document.getElementById('lessonTabs').innerHTML = module.lessons.map(l => { const access = lessonAccessInfo(module.id, l.id); return `<div class="lesson-item ${l.id===lesson.id?'active':''} ${access.allowed ? '' : 'locked'}" data-lesson="${l.id}"><div class="lesson-main">${isDone(module.id,l.id)?'✅ ':''}${l.title}${access.allowed ? '' : '<span class=\"lock-chip\">잠금</span>'}</div><div class="lesson-sub">${l.titleEn}</div><div class="tiny">표현 ${l.expressions.length}개 · 퀴즈 ${l.quiz.length}개${access.allowed ? '' : ' · Starter부터 열림'}</div></div>`; }).join('');
  document.querySelectorAll('.lesson-item').forEach(el => el.addEventListener('click', ()=> { const access = lessonAccessInfo(module.id, el.dataset.lesson); if (!access.allowed) { promptUpgrade(access.reason, access.recommended); return; } setLesson(module.id, el.dataset.lesson); }));

  const exprHtml = lesson.expressions.map((e, idx) => `<div class="expression-card"><div class="exp-top"><strong>${idx+1}. ${e[0]}</strong><button class="mini-btn speakExpBtn" data-text="${escapeAttr(e[0])}">🔊</button></div><div class="muted">${e[1]}</div></div>`).join('');
  const turns = lesson.scenario.turns.map(t => `<div class="role-line"><div class="tiny">${t.role}</div>${t.line}</div>`).join('');
  document.getElementById('lessonContent').innerHTML = `
    <div class="stack">
      <div class="coach-box"><strong>${lesson.scenario.title}</strong><div class="muted">${lesson.scenario.brief}</div></div>
      <div class="panel"><h3>핵심 표현</h3><div class="expression-grid">${exprHtml}</div><div class="landing-actions"><button id="playAllBtn">전체 듣기</button></div></div>
      <div class="panel"><h3>롤플레이 스크립트</h3><div class="stack">${turns}</div><textarea id="roleplayMemo" class="voice-answer-box" placeholder="마이크 버튼을 눌러 응답을 말해보세요." readonly>${progress().roleplay[lessonKey(module.id,lesson.id)] || ''}</textarea><div class="landing-actions"><button id="roleplayVoiceBtn">🎙️ 답변 말하기</button><button id="saveRoleplayBtn">메모 저장</button><button id="jumpCoachBtn" class="ghost">AI 롤플레이로 이어가기</button></div><div id="roleplayFeedback" class="feedback">직접 입력 대신 마이크로 답변을 말하면 자동으로 채워집니다.</div></div>
      <div class="panel"><h3>말하기 연습</h3><select id="speakTargetSelect">${lesson.expressions.map((e,i)=>`<option value="${i}">${e[0]}</option>`).join('')}<option value="target">대표 문장</option></select><div id="speakTargetBox" class="feedback"><strong>Target:</strong> ${lesson.expressions[0][0]}</div><div class="landing-actions"><button id="playTargetBtn">문장 듣기</button><button id="startSpeechBtn">말하기 시작</button></div><div id="speechFeedback" class="feedback">브라우저 음성 인식 기반으로 연습 결과를 확인할 수 있습니다.</div></div>
      <div class="panel"><h3>퀴즈</h3><div class="stack">${lesson.quiz.map((q, i) => `<div class="review-card"><strong>Q${i+1}. ${q.q}</strong><textarea class="quizInput voice-answer-box" data-idx="${i}" placeholder="마이크 버튼을 눌러 영어로 답해보세요." readonly></textarea><div class="landing-actions"><button class="quizVoiceBtn" data-idx="${i}">🎙️ 답변 말하기</button><button class="checkQuizBtn" data-idx="${i}">정답 확인</button></div><div class="feedback" id="quizFb_${i}">마이크 버튼으로 답변을 말한 뒤 정답을 확인하세요.</div></div>`).join('')}</div></div>
    </div>`;

  document.querySelectorAll('.speakExpBtn').forEach(btn => btn.addEventListener('click', ()=> speak(btn.dataset.text)));
  document.getElementById('playAllBtn').addEventListener('click', ()=> lesson.expressions.forEach((e, i) => setTimeout(()=> speak(e[0]), i*1700)));
  document.getElementById('roleplayVoiceBtn').addEventListener('click', ()=> startVoiceCapture({
    target: '#roleplayMemo',
    feedback: '#roleplayFeedback',
    button: '#roleplayVoiceBtn',
    onStartText: '응답을 듣고 있습니다. 영어로 자연스럽게 말해보세요...',
    onResult: transcript => {
      document.getElementById('roleplayFeedback').textContent = transcript ? '음성 답변이 입력되었습니다. 저장하거나 AI 롤플레이로 이어갈 수 있습니다.' : '음성이 감지되지 않았습니다. 다시 시도해보세요.';
    }
  }));
  document.getElementById('saveRoleplayBtn').addEventListener('click', ()=> {
    progress().roleplay[lessonKey(module.id, lesson.id)] = document.getElementById('roleplayMemo').value.trim();
    giveXp(5);
    document.getElementById('roleplayFeedback').textContent = '메모를 저장했습니다. XP +5';
    renderSidebar(); renderDashboard(); saveAll();
  });
  document.getElementById('jumpCoachBtn').addEventListener('click', ()=> setView('coach'));

  const speakTargetSelect = document.getElementById('speakTargetSelect');
  const getTarget = () => speakTargetSelect.value === 'target' ? lesson.speaking : lesson.expressions[Number(speakTargetSelect.value)][0];
  speakTargetSelect.addEventListener('change', ()=> document.getElementById('speakTargetBox').innerHTML = `<strong>Target:</strong> ${getTarget()}`);
  document.getElementById('playTargetBtn').addEventListener('click', ()=> speak(getTarget()));
  document.getElementById('startSpeechBtn').addEventListener('click', ()=> startSpeech(getTarget(), lessonKey(module.id, lesson.id)));

  document.querySelectorAll('.quizVoiceBtn').forEach(btn => btn.addEventListener('click', ()=> {
    const idx = Number(btn.dataset.idx);
    startVoiceCapture({
      target: `.quizInput[data-idx="${idx}"]`,
      feedback: `#quizFb_${idx}`,
      button: btn,
      onStartText: '퀴즈 답변을 듣고 있습니다. 영어로 또렷하게 말해보세요...',
      onResult: transcript => {
        document.getElementById(`quizFb_${idx}`).textContent = transcript ? '음성 답변이 입력되었습니다. 정답 확인을 눌러 채점해보세요.' : '음성이 감지되지 않았습니다. 다시 시도해보세요.';
      }
    });
  }));
  document.querySelectorAll('.checkQuizBtn').forEach(btn => btn.addEventListener('click', ()=> {
    const idx = Number(btn.dataset.idx);
    const input = document.querySelector(`.quizInput[data-idx="${idx}"]`).value;
    const expected = lesson.quiz[idx].a;
    const score = similarity(expected, input);
    progress().quiz[`${lessonKey(module.id, lesson.id)}__${idx}`] = { input, expected, score, at: new Date().toISOString() };
    if (score < 70) addWrongNote(module, lesson, lesson.quiz[idx].q, input, expected, score);
    if (score >= 85) { document.getElementById(`quizFb_${idx}`).innerHTML = `아주 좋습니다 ✅<br><strong>${expected}</strong>`; giveXp(8); }
    else if (score >= 55) { document.getElementById(`quizFb_${idx}`).innerHTML = `부분 정답입니다.<br><strong>${expected}</strong>`; giveXp(4); }
    else { document.getElementById(`quizFb_${idx}`).innerHTML = `오답노트에 저장했습니다.<br><strong>${expected}</strong>`; }
    saveAll(); renderDashboard(); renderReviewView(); renderSidebar();
  }));
}
function startSpeech(target, key){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const feedback = document.getElementById('speechFeedback');
  if (!SR) { feedback.textContent = '이 브라우저는 음성 인식을 지원하지 않습니다.'; return; }
  const rec = new SR();
  rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
  feedback.textContent = '듣는 중입니다...';
  rec.start();
  rec.onresult = ev => {
    const transcript = ev.results[0][0].transcript;
    const score = similarity(target, transcript);
    progress().speaking[key] = { target, transcript, score, at: new Date().toISOString() };
    if (score >= 85) giveXp(10); else if (score >= 60) giveXp(6);
    const tip = score >= 85 ? '아주 좋습니다!' : score >= 60 ? '좋아요. 몇 단어만 더 또렷하게 해보세요.' : '천천히 끊어서 다시 말해보세요.';
    feedback.innerHTML = `<strong>Target:</strong> ${target}<br><strong>You said:</strong> ${transcript}<br><strong>Match:</strong> ${score}%<br>${tip}`;
    saveAll(); renderDashboard(); renderReviewView(); renderSidebar();
  };
  rec.onerror = e => feedback.textContent = `음성 인식 오류: ${e.error}`;
}
function addWrongNote(module, lesson, question, yourAnswer, correctAnswer, score){
  progress().wrongNotes.unshift({ moduleId:module.id, lessonId:lesson.id, moduleTitle:module.title, lessonTitle:lesson.title, question, yourAnswer, correctAnswer, score, at:new Date().toISOString() });
  progress().wrongNotes = progress().wrongNotes.slice(0, 50);
}
function renderCoachView(){
  const lesson = getLesson();
  if (!state.coachLog.length || state.coachLog[0]?.lessonKey !== lessonKey(state.currentModuleId, state.currentLessonId)) {
    resetCoach();
  }
  document.getElementById('coachScenarioBox').innerHTML = `<strong>${lesson.scenario.title}</strong><div class="muted">${lesson.scenario.brief}</div><div class="muted">추천 표현: ${lesson.expressions.slice(0,3).map(e => e[0]).join(' / ')}</div>`;
  const usageHint = document.getElementById('coachUsageHint');
  if (usageHint) {
    const remaining = remainingRoleplayCount();
    usageHint.textContent = currentPlanName() === 'Executive' ? 'Executive 플랜에서는 프리미엄 코칭 흐름으로 이어집니다.' : `현재 플랜 ${currentPlanName()} · 오늘 남은 AI 롤플레이 ${remaining}${remaining === '무제한' ? '' : '회'}`;
  }
  const cfg = aiConfig();
  document.getElementById('aiModeSelect').value = cfg.mode;
  document.getElementById('aiEndpointInput').value = cfg.endpoint;
  document.getElementById('aiModelInput').value = cfg.model;
  document.getElementById('aiKeyInput').value = cfg.apiKey;
  document.getElementById('aiPromptInput').value = cfg.systemPrompt;
  renderCoachLog();
}
function resetCoach(){
  const lesson = getLesson();
  state.coachLog = [{ role:'coach', text:`Let’s begin the roleplay: ${lesson.scenario.titleEn}. Give your first polished response in English.`, lessonKey:lessonKey(state.currentModuleId, state.currentLessonId) }];
}
function renderCoachLog(){
  document.getElementById('coachLog').innerHTML = state.coachLog.map(item => `<div class="chat-bubble ${item.role==='user'?'user':''}"><div class="chat-role">${item.role==='user'?'You':'Coach'}</div>${escapeHtml(item.text)}</div>`).join('');
}
function buildMockCoachReply(userText){
  const lesson = getLesson();
  const text = (userText || '').trim();
  const normalized = normalizeText(text);
  const words = normalized.split(' ').filter(Boolean);
  const expressionMatches = lesson.expressions.filter(e => normalized.includes(normalizeText(e[0]).slice(0, Math.min(normalizeText(e[0]).length, 18))));
  const keywordMatches = lesson.expressions.filter(e => {
    const tokens = normalizeText(e[0]).split(' ').filter(Boolean).slice(0, 3);
    return tokens.some(token => token.length > 3 && normalized.includes(token));
  });
  const uniqueMatches = [...new Set([...expressionMatches, ...keywordMatches].map(e => e[0]))];
  const hasGreeting = /^(hi|hello|good morning|good afternoon|nice to meet you|thank you)/i.test(text);
  const hasBusinessTone = /(would|could|appreciate|glad|pleasure|align|discuss|timeline|follow up|partnership|meeting|proposal)/i.test(text);
  const startsUppercase = /^[A-Z]/.test(text);
  const endsCleanly = /[.!?]$/.test(text);
  const tooShort = words.length < 5;
  const tooLong = words.length > 22;
  const scoreBase = 48 + uniqueMatches.length * 14 + Math.min(words.length, 14) * 2;
  const scoreTone = hasBusinessTone ? 8 : 0;
  const scoreForm = (startsUppercase ? 3 : 0) + (endsCleanly ? 3 : 0);
  const score = Math.max(38, Math.min(98, scoreBase + scoreTone + scoreForm));

  const strengths = [];
  const corrections = [];
  const modelParts = [];

  if (uniqueMatches.length) strengths.push(`핵심 표현을 ${uniqueMatches.length}개 반영해 레슨 연결감이 좋습니다`);
  if (hasBusinessTone) strengths.push('비즈니스 상황에 맞는 톤이 비교적 잘 살아 있습니다');
  if (words.length >= 8 && words.length <= 18) strengths.push('문장 길이가 적절해 실제 대화에서 쓰기 좋습니다');
  if (!strengths.length) strengths.push('답변 의도는 분명하고 대화를 이어가려는 방향은 좋습니다');

  if (!startsUppercase) corrections.push('문장 첫 글자를 대문자로 시작하면 더 정돈되어 보입니다');
  if (!endsCleanly) corrections.push('문장 끝을 마침표나 물음표로 마무리하면 전달력이 좋아집니다');
  if (tooShort) corrections.push('한 문장만 더 덧붙여 목적이나 이유를 분명히 말하면 더 자연스럽습니다');
  if (tooLong) corrections.push('핵심 메시지와 이유를 1~2문장으로 나누면 더 명확합니다');
  if (!uniqueMatches.length) corrections.push(`레슨 표현인 "${lesson.expressions[0][0]}" 같은 문장을 직접 넣어보세요`);
  if (!hasBusinessTone) corrections.push('would, could, glad, appreciate 같은 표현을 넣으면 더 비즈니스답게 들립니다');

  const lead = hasGreeting ? text : `It's great to connect. ${text}`.trim();
  const cleanedLead = lead.replace(/\s+/g, ' ').trim();
  const primaryExpression = uniqueMatches[0] || lesson.expressions[0][0];
  const supportExpression = uniqueMatches[1] || lesson.expressions[Math.min(1, lesson.expressions.length - 1)][0];

  if (score >= 82) {
    modelParts.push(cleanedLead);
    modelParts.push(`Also, ${supportExpression.replace(/^[A-Z]/, c => c.toLowerCase())}`);
  } else if (score >= 66) {
    modelParts.push(`Nice to meet you. ${primaryExpression}`);
    modelParts.push('I would love to hear more about your priorities.');
  } else {
    modelParts.push(`Nice to meet you. ${primaryExpression}`);
    modelParts.push(`Also, ${supportExpression.replace(/^[A-Z]/, c => c.toLowerCase())}`);
  }

  const modelSentence = modelParts.join(' ').replace(/\.([^ ])/g, '. $1').trim();
  const followUp = lesson.scenario.turns.find(t => /\?/.test(t.line))?.line || `Could you tell me more about your main goal here today?`;
  const englishReply = score >= 82
    ? `Coach: That sounds strong. Now make it even smoother and keep the same professional tone. Follow-up: "${followUp}"`
    : score >= 66
      ? `Coach: Good direction. Add one clearer business phrase and a short reason. Follow-up: "${followUp}"`
      : `Coach: Let’s make it more practical. Start with one core lesson phrase, then add one simple follow-up line. Follow-up: "${followUp}"`;

  let feedback = `<strong>강점</strong><br>• ${strengths.slice(0,2).join('<br>• ')}`;
  feedback += `<br><br><strong>더 자연스럽게 다듬기</strong><br>• ${corrections.slice(0,3).join('<br>• ')}`;
  if (canUseAdvancedFeedback()) {
    const toneNote = hasBusinessTone ? '톤은 비교적 안정적입니다. 이제 목적과 이유를 더 또렷하게 붙여보세요.' : '톤은 조금 더 비즈니스답게 만들 여지가 있습니다. 요청, 목적, 후속 제안을 함께 말해보세요.';
    feedback += `<br><br><strong>정교한 코칭</strong><br>${toneNote}`;
  }
  if (canUsePremiumCoach()) {
    feedback += `<br><br><strong>Executive 메모</strong><br>첫 문장에서 핵심 목적을 먼저 말하고, 두 번째 문장에서 협업 또는 후속 행동을 제안하면 더 설득력 있게 들립니다.`;
  }
  feedback += `<br><br><strong>추천 교정 문장</strong><br>${escapeHtml(modelSentence)}`;

  return {
    reply: englishReply,
    feedback,
    score
  };
}
async function callRealAI(userText){
  const cfg = aiConfig();
  const lesson = getLesson();
  const messages = [
    { role:'system', content: cfg.systemPrompt },
    { role:'user', content: `Current lesson: ${lesson.title} / ${lesson.titleEn}\nScenario: ${lesson.scenario.brief}\nKey expressions: ${lesson.expressions.map(e => e[0]).join('; ')}\nLearner reply: ${userText}\nPlease respond as a business English roleplay partner and include one short coaching tip.` }
  ];
  const res = await fetch(cfg.endpoint, {
    method:'POST',
    headers:{ 'Content-Type':'application/json', ...(cfg.apiKey ? { 'Authorization': `Bearer ${cfg.apiKey}` } : {}) },
    body: JSON.stringify({ model: cfg.model, messages, temperature: 0.7 })
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content || data?.output_text || data?.reply || 'No reply returned.';
  const suffix = canUsePremiumCoach() ? ' 프리미엄 코칭 메모까지 함께 반영된 응답입니다.' : canUseAdvancedFeedback() ? ' 약점 기반 확장 피드백이 함께 열려 있습니다.' : '';
  return { reply, feedback:'실제 API 응답을 받았습니다. 아래 내용을 기준으로 문장 교정과 다음 답변까지 이어가보세요.' + suffix, score: 85 };
}
async function handleCoachReply(){
  const input = document.getElementById('coachInput');
  const userText = input.value.trim();
  if (!userText) return;
  if (!consumeRoleplayAttempt()) {
    const nextPlan = currentPlan().recommendedUpgrade || 'Starter';
    promptUpgrade(`오늘 제공된 Free AI 롤플레이를 모두 사용했습니다. Starter로 이어가면 더 많은 실전 대화를 바로 계속할 수 있습니다.`, nextPlan);
    return;
  }
  state.coachLog.push({ role:'user', text:userText, lessonKey:lessonKey(state.currentModuleId, state.currentLessonId) });
  renderCoachLog();
  document.getElementById('coachFeedback').textContent = '응답을 정리하고 있습니다...';
  const cfg = aiConfig();
  try {
    const result = cfg.mode === 'api' && cfg.endpoint && cfg.model ? await callRealAI(userText) : buildMockCoachReply(userText);
    state.coachLog.push({ role:'coach', text:result.reply, lessonKey:lessonKey(state.currentModuleId, state.currentLessonId) });
    document.getElementById('coachFeedback').innerHTML = `<strong>코치 피드백</strong><br>${result.feedback}`;
    if (result.score >= 78) giveXp(12); else giveXp(6);
  } catch (err) {
    const fallback = buildMockCoachReply(userText);
    state.coachLog.push({ role:'coach', text:fallback.reply, lessonKey:lessonKey(state.currentModuleId, state.currentLessonId) });
    document.getElementById('coachFeedback').innerHTML = `<strong>연결 안내</strong><br>기본 코치 모드로 이어서 진행합니다. (${escapeHtml(err.message)})`;
  }
  input.value = '';
  saveAll();
  renderCoachLog();
  renderDashboard();
  renderSidebar();
}
function renderReviewView(){
  const wrongs = progress().wrongNotes || [];
  document.getElementById('wrongNoteList').innerHTML = wrongs.length ? wrongs.map((w, idx) => `<div class="review-card"><strong>${w.moduleTitle} · ${w.lessonTitle}</strong><div class="muted">Q: ${w.question}</div><div class="muted">내 답: ${w.yourAnswer || '(빈칸)'}</div><div class="muted">정답: ${w.correctAnswer}</div><div class="tiny">Score ${w.score}%</div><div class="landing-actions"><button class="retryWrongBtn" data-key="${w.moduleId}__${w.lessonId}">레슨 열기</button><button class="ghost deleteWrongBtn" data-idx="${idx}">삭제</button></div></div>`).join('') : '<div class="muted">오답노트가 비어 있습니다.</div>';
  document.querySelectorAll('.retryWrongBtn').forEach(btn => btn.addEventListener('click', ()=> { const [m,l] = btn.dataset.key.split('__'); setLesson(m,l); setView('learn'); }));
  document.querySelectorAll('.deleteWrongBtn').forEach(btn => btn.addEventListener('click', ()=> { progress().wrongNotes.splice(Number(btn.dataset.idx), 1); saveAll(); renderReviewView(); renderDashboard(); }));
  const ranking = [...state.users].sort((a,b) => (b.progress?.xp || 0) - (a.progress?.xp || 0));
  document.getElementById('scoreBoard').innerHTML = ranking.map((u, i) => `<div class="info-card"><strong>#${i+1} ${u.name}</strong><div class="muted">${u.role} · XP ${u.progress?.xp || 0} · 완료 레슨 ${Object.values(u.progress?.completed || {}).filter(Boolean).length}</div></div>`).join('');
}
function renderAdminView(){
  const lesson = getLesson();
  document.getElementById('brandNameInput').value = brand().appName;
  document.getElementById('brandHeadlineInput').value = brand().headline;
  document.getElementById('brandSublineInput').value = brand().subline;
  document.getElementById('adminLessonTitle').value = lesson.title;
  document.getElementById('adminSpeaking').value = lesson.speaking;
  document.getElementById('adminExpression').value = '';
  document.getElementById('adminPreview').innerHTML = lesson.expressions.map(e => `<div class="info-card"><strong>${e[0]}</strong><div class="muted">${e[1]}</div></div>`).join('');
}
function saveBrand(){
  brand().appName = document.getElementById('brandNameInput').value.trim() || defaultBrand.appName;
  brand().headline = document.getElementById('brandHeadlineInput').value.trim() || defaultBrand.headline;
  brand().subline = document.getElementById('brandSublineInput').value.trim() || defaultBrand.subline;
  saveAll();
  document.getElementById('brandFeedback').textContent = '브랜드 문구를 저장했습니다.';
  renderDashboard();
}
function saveLessonEdit(){
  const module = getModule();
  const lesson = getLesson();
  lesson.title = document.getElementById('adminLessonTitle').value.trim() || lesson.title;
  lesson.speaking = document.getElementById('adminSpeaking').value.trim() || lesson.speaking;
  progress().editedLessons[lessonKey(module.id, lesson.id)] = { title: lesson.title, speaking: lesson.speaking, expressions: lesson.expressions };
  saveAll();
  document.getElementById('adminFeedback').textContent = '현재 레슨을 저장했습니다.';
  renderLearnView();
  renderAdminView();
}
function addExpression(){
  const raw = document.getElementById('adminExpression').value.trim();
  if (!raw.includes('|')) { document.getElementById('adminFeedback').textContent = '영문 | 한국어 형식으로 입력해 주세요.'; return; }
  const [en, ko] = raw.split('|').map(s => s.trim());
  const module = getModule();
  const lesson = getLesson();
  lesson.expressions.push([en, ko]);
  progress().editedLessons[lessonKey(module.id, lesson.id)] = { title: lesson.title, speaking: lesson.speaking, expressions: lesson.expressions };
  saveAll();
  document.getElementById('adminFeedback').textContent = '표현을 추가했습니다.';
  renderLearnView();
  renderAdminView();
}
function saveAIConfig(){
  aiConfig().mode = document.getElementById('aiModeSelect').value;
  aiConfig().endpoint = document.getElementById('aiEndpointInput').value.trim();
  aiConfig().model = document.getElementById('aiModelInput').value.trim();
  aiConfig().apiKey = document.getElementById('aiKeyInput').value.trim();
  aiConfig().systemPrompt = document.getElementById('aiPromptInput').value.trim() || defaultAI.systemPrompt;
  saveAll();
  document.getElementById('aiConfigFeedback').textContent = 'AI 설정을 저장했습니다.';
}
function testAIConfig(){
  const cfg = aiConfig();
  if (cfg.mode === 'mock') {
    document.getElementById('aiConfigFeedback').textContent = '현재 기본 코치 모드가 활성화되어 있어 바로 테스트할 수 있습니다.';
    return;
  }
  if (!cfg.endpoint || !cfg.model) {
    document.getElementById('aiConfigFeedback').textContent = 'Endpoint와 Model을 입력해 주세요.';
    return;
  }
  document.getElementById('aiConfigFeedback').textContent = '설정이 준비되었습니다. 실제 호출은 대화 전송 시점에 진행됩니다.';
}
function exportAll(){
  const blob = new Blob([JSON.stringify({ users: state.users, activeUser: state.activeUser?.name || null }, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'biztalker-one-data.json';
  a.click();
  URL.revokeObjectURL(url);
}
function importAll(file){
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state.users = parsed.users || [];
      saveUsers();
      state.activeUser = state.users.find(u => u.name === parsed.activeUser) || state.users[0] || null;
      saveActiveUser();
      hydrateEditedLessons();
      renderAuth();
      alert('데이터를 불러왔습니다.');
    } catch {
      alert('파일 형식을 확인해 주세요.');
    }
  };
  reader.readAsText(file);
}
function setView(view){
  state.view = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`${view}View`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
  const titles = { dashboard:'대시보드', learn:'학습', coach:'AI 롤플레이', review:'오답노트', admin:'브랜드/콘텐츠', mobile:'배포준비' };
  document.getElementById('pageTitle').textContent = titles[view] || '대시보드';
  if (view === 'coach') renderCoachView();
  if (view === 'review') renderReviewView();
  if (view === 'admin') renderAdminView();
}
function setLesson(moduleId, lessonId){
  const access = lessonAccessInfo(moduleId, lessonId);
  if (!access.allowed) {
    promptUpgrade(access.reason, access.recommended);
    return;
  }
  state.currentModuleId = moduleId;
  state.currentLessonId = lessonId;
  progress().lastLessonKey = lessonKey(moduleId, lessonId);
  saveAll();
  renderSidebar();
  renderLearnView();
  renderCoachView();
}
function markCurrentLessonDone(){
  progress().completed[lessonKey(state.currentModuleId, state.currentLessonId)] = true;
  giveXp(15);
  saveAll();
  renderDashboard(); renderSidebar(); renderLearnView(); renderReviewView();
}
function renderApp(){
  renderSidebar();
  renderDashboard();
  renderLearnView();
  renderCoachView();
  renderReviewView();
  renderAdminView();
  setView(state.view);
}
function escapeAttr(str){ return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }
function escapeHtml(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function registerSW(){ if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{}); }

function renderPendingSubscriptionHint(){
  const note = document.querySelector('#authPanel .tiny-note');
  if (!note) return;
  const pending = state.pendingSubscription;
  if (pending) {
    note.innerHTML = `선택한 플랜: <strong>${pending.plan}</strong> · 7일 무료 체험이 준비되었습니다. 계정을 만들면 구독 정보가 연결됩니다.`;
  } else {
    note.textContent = '현재 버전은 브라우저 기반 학습 기록을 사용합니다.';
  }
}
function formatPrice(value){
  return `₩${Number(value || 0).toLocaleString('ko-KR')}`;
}
function getCheckoutMeta(){
  const plan = PLAN_CATALOG[state.checkout.plan] && PLAN_CATALOG[state.checkout.plan].monthly > 0 ? PLAN_CATALOG[state.checkout.plan] : PLAN_CATALOG.Pro;
  const cycle = 'monthly';
  const basePrice = plan.monthly;
  const cycleLabel = '정기 구독';
  const coupon = (state.checkout.coupon || '').trim().toUpperCase();
  let discountRate = 0;
  if (coupon === 'BIZ10') discountRate = 0.10;
  if (coupon === 'BIZ15') discountRate = 0.15;
  const discount = Math.round(basePrice * discountRate);
  const total = Math.max(0, basePrice - discount);
  return { plan, cycle, cycleLabel, basePrice, discountRate, discount, total, coupon };
}
function renderCheckout(){
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  const cards = document.getElementById('checkoutPlanCards');
  const summary = document.getElementById('checkoutSummary');
  const feedback = document.getElementById('checkoutFeedback');
  const nameInput = document.getElementById('checkoutName');
  const emailInput = document.getElementById('checkoutEmail');
  const couponInput = document.getElementById('checkoutCoupon');
  if (state.activeUser && !nameInput.value) nameInput.value = state.activeUser.name || '';
  if (!couponInput.dataset.bound) {
    couponInput.addEventListener('input', e => { state.checkout.coupon = e.target.value; renderCheckout(); });
    couponInput.dataset.bound = '1';
  }
  if (state.activeUser && !emailInput.value && state.activeUser.email) emailInput.value = state.activeUser.email;
  couponInput.value = state.checkout.coupon || '';
  cards.innerHTML = Object.values(PLAN_CATALOG).filter(plan => plan.monthly > 0).map(plan => {
    const price = plan.monthly;
    return `<button type="button" class="checkout-plan-card ${plan.name === state.checkout.plan ? 'active' : ''}" data-plan-card="${plan.name}"><div class="top"><div class="title">${plan.name}</div><div class="pill">${plan.badge}</div></div><div class="desc">${plan.tagline}</div><div class="price">${formatPrice(price)}<span class="tiny"> / 월</span></div></button>`;
  }).join('');
  document.querySelectorAll('[data-plan-card]').forEach(btn => btn.addEventListener('click', () => {
    state.checkout.plan = btn.dataset.planCard;
    state.checkout.feedback = '';
    renderCheckout();
  }));
  document.querySelectorAll('.billing-btn').forEach(btn => {
    btn.classList.add('active');
  });
  const meta = getCheckoutMeta();
  summary.innerHTML = `
    <div class="summary-row"><span>선택 플랜</span><strong>${meta.plan.name}</strong></div>
    <div class="summary-row"><span>구독 방식</span><strong>${meta.cycleLabel}</strong></div>
    <div class="summary-row"><span>정기 이용 금액</span><strong>${formatPrice(meta.basePrice)}</strong></div>
    <div class="summary-row"><span>7일 무료 체험</span><strong>첫 7일 0원</strong></div>
    <div class="summary-row"><span>프로모션 혜택</span><strong>${meta.discount ? '- ' + formatPrice(meta.discount) : '적용 없음'}</strong></div>
    <div class="summary-row"><span>체험 종료 후 결제 예정</span><strong class="summary-total">${formatPrice(meta.total)}</strong></div>
    <div class="summary-note">${meta.plan.name === 'Starter' ? 'Starter를 시작하면 전체 레슨과 더 넉넉한 AI 훈련 흐름이 바로 열립니다.' : '가입일 기준 7일간 충분히 경험한 뒤 이용을 이어갈 수 있습니다.'}</div>
  `;
  const btn = document.getElementById('confirmCheckoutBtn');
  if (meta.plan.name === 'Starter') {
    btn.textContent = state.activeUser ? 'Starter로 이어서 전체 학습 열기' : 'Starter 무료 체험 시작하고 전체 학습 열기';
  } else {
    btn.textContent = state.activeUser ? `${meta.plan.name} 플랜 시작하기` : '7일 무료 체험 신청하고 계정 만들기';
  }
  const defaultFeedback = meta.plan.name === 'Starter'
    ? '지금 Starter로 이어가면 전체 커리큘럼과 하루 8회의 AI 롤플레이가 바로 열립니다. 테스트용 쿠폰: <strong>BIZ10</strong>, <strong>BIZ15</strong>'
    : '필요한 시점에 자연스럽게 이어갈 수 있도록 준비된 테스트 흐름입니다. 테스트용 쿠폰: <strong>BIZ10</strong>, <strong>BIZ15</strong>';
  feedback.innerHTML = state.checkout.feedback || defaultFeedback;
}
function openCheckout(plan = 'Pro', message = ''){
  state.checkout.plan = PLAN_CATALOG[plan] && PLAN_CATALOG[plan].monthly > 0 ? plan : 'Pro';
  state.checkout.cycle = 'monthly';
  state.checkout.feedback = message || '';
  state.checkout.coupon = '';
  renderCheckout();
  document.getElementById('checkoutModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeCheckout(){
  document.getElementById('checkoutModal').classList.add('hidden');
  document.body.style.overflow = '';
}
function confirmCheckout(){
  const name = document.getElementById('checkoutName').value.trim();
  const email = document.getElementById('checkoutEmail').value.trim();
  const cardNumber = document.getElementById('checkoutCardNumber').value.replace(/\s+/g,'');
  const expiry = document.getElementById('checkoutExpiry').value.trim();
  const cvc = document.getElementById('checkoutCvc').value.trim();
  const agree = document.getElementById('checkoutAgree').checked;
  if (!name) { state.checkout.feedback = '이름을 입력해 주세요.'; return renderCheckout(); }
  if (!/^.+@.+\..+$/.test(email)) { state.checkout.feedback = '업무용 이메일 형식을 확인해 주세요.'; return renderCheckout(); }
  if (!/^\d{12,19}$/.test(cardNumber)) { state.checkout.feedback = '카드 번호를 12~19자리 숫자로 입력해 주세요.'; return renderCheckout(); }
  if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiry)) { state.checkout.feedback = '유효기간을 MM/YY 형식으로 입력해 주세요.'; return renderCheckout(); }
  if (!/^\d{3,4}$/.test(cvc)) { state.checkout.feedback = 'CVC를 3~4자리로 입력해 주세요.'; return renderCheckout(); }
  if (!agree) { state.checkout.feedback = '무료 체험 및 전환 조건에 동의해 주세요.'; return renderCheckout(); }
  const meta = getCheckoutMeta();
  const subscriptionData = {
    plan: meta.plan.name,
    cycle: meta.cycle,
    amount: meta.total,
    email,
    coupon: meta.coupon || '',
    status: 'trial',
    startedAt: new Date().toISOString(),
    trialEndsAt: new Date(Date.now() + 7 * 86400000).toISOString()
  };
  if (state.activeUser) {
    progress().subscription = subscriptionData;
    state.activeUser.email = email;
    saveAll();
    renderSidebar();
    renderDashboard();
    state.checkout.feedback = `${meta.plan.name} 플랜의 7일 무료 체험이 시작되었습니다. 곧바로 학습을 이어가실 수 있습니다.`;
    renderCheckout();
    setTimeout(() => { openPaymentResult('success', meta.plan.name); }, 450);
    return;
  }
  state.pendingSubscription = subscriptionData;
  savePendingSubscription();
  state.checkout.feedback = `${meta.plan.name} 플랜 선택이 저장되었습니다. 계정을 만들면 구독 정보가 연결됩니다.`;
  renderCheckout();
  document.getElementById('signupName').value = name;
  document.getElementById('loginName').value = name;
  setTimeout(() => {
    openPaymentResult('success', meta.plan.name);
    switchAuthPane('signupPane');
    renderPendingSubscriptionHint();
  }, 450);
}

function bindEvents(){
  document.getElementById('openLoginBtn').addEventListener('click', ()=> document.getElementById('authPanel').classList.remove('hidden'));
  document.getElementById('openSignupBtn').addEventListener('click', ()=> { document.getElementById('authPanel').classList.remove('hidden'); switchAuthPane('signupPane'); });
  document.getElementById('heroStartBtn').addEventListener('click', ()=> document.getElementById('authPanel').classList.remove('hidden'));
  document.getElementById('heroLearnMoreBtn').addEventListener('click', ()=> document.getElementById('pricingSection').scrollIntoView({ behavior:'smooth' }));
  document.querySelectorAll('.auth-tab').forEach(btn => btn.addEventListener('click', ()=> switchAuthPane(btn.dataset.pane)));
  document.getElementById('loginBtn').addEventListener('click', ()=> {
    const name = document.getElementById('loginName').value.trim();
    const role = document.getElementById('loginRole').value.trim();
    if (!name) return alert('이름을 입력해 주세요.');
    ensureUser(name, role);
    renderAuth();
  });
  document.getElementById('signupBtn').addEventListener('click', ()=> {
    const name = document.getElementById('signupName').value.trim();
    const role = document.getElementById('signupRole').value.trim();
    if (!name) return alert('이름을 입력해 주세요.');
    ensureUser(name, role);
    renderAuth();
  });
  document.querySelectorAll('.pricing-cta').forEach(btn => btn.addEventListener('click', ()=> { const plan = btn.dataset.plan || 'Pro'; if (plan === 'Free') { beginFreePlan(); return; } openCheckout(plan); }));
  document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckout);
  document.getElementById('confirmCheckoutBtn').addEventListener('click', confirmCheckout);
  document.getElementById('closePaymentResultBtn').addEventListener('click', closePaymentResult);
  document.getElementById('paymentResultModal').addEventListener('click', e => { if (e.target.id === 'paymentResultModal') closePaymentResult(); });
  document.querySelectorAll('[data-preview-payment]').forEach(btn => btn.addEventListener('click', ()=> openPaymentResult(btn.dataset.previewPayment || 'success', state.checkout.plan || 'Starter')));
  document.getElementById('checkoutModal').addEventListener('click', e => { if (e.target.id === 'checkoutModal') closeCheckout(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCheckout(); closePaymentResult(); } });
  document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', ()=> setView(btn.dataset.view)));
  document.getElementById('searchBox').addEventListener('input', e => { state.search = e.target.value; renderSidebar(); });
  document.getElementById('continueBtn').addEventListener('click', ()=> {
    const key = progress().lastLessonKey;
    if (key) {
      const [m,l] = key.split('__');
      setLesson(m,l);
    }
    setView('learn');
  });
  document.getElementById('openCoachBtn').addEventListener('click', ()=> setView('coach'));
  document.getElementById('coachVoiceBtn').addEventListener('click', ()=> startVoiceCapture({
    target: '#coachInput',
    feedback: '#coachFeedback',
    button: '#coachVoiceBtn',
    onStartText: '답변을 듣고 있습니다. 영어로 자연스럽게 말해보세요...',
    onResult: transcript => {
      document.getElementById('coachFeedback').textContent = transcript ? '음성 답변이 입력되었습니다. 응답 보내기를 눌러 이어가세요.' : '음성이 감지되지 않았습니다. 다시 시도해보세요.';
    }
  }));
  document.getElementById('coachReplyBtn').addEventListener('click', handleCoachReply);
  document.getElementById('coachHintBtn').addEventListener('click', ()=> {
    const lesson = getLesson();
    document.getElementById('coachFeedback').innerHTML = `<strong>추천 표현</strong><br>${lesson.expressions.slice(0,4).map(e => `• ${e[0]} — ${e[1]}`).join('<br>')}`;
  });
  document.getElementById('coachResetBtn').addEventListener('click', ()=> { resetCoach(); renderCoachLog(); document.getElementById('coachFeedback').textContent = '대화를 초기화했습니다.'; });
  document.getElementById('saveAiConfigBtn').addEventListener('click', saveAIConfig);
  document.getElementById('testAiConfigBtn').addEventListener('click', testAIConfig);
  document.getElementById('saveBrandBtn').addEventListener('click', saveBrand);
  document.getElementById('saveAdminBtn').addEventListener('click', saveLessonEdit);
  document.getElementById('addExpressionBtn').addEventListener('click', addExpression);
  document.getElementById('exportDataBtn').addEventListener('click', exportAll);
  document.getElementById('importDataInput').addEventListener('change', e => { if (e.target.files[0]) importAll(e.target.files[0]); });
  document.getElementById('logoutBtn').addEventListener('click', ()=> { state.activeUser = null; saveActiveUser(); renderAuth(); });
  document.getElementById('markLessonDoneBtn').addEventListener('click', markCurrentLessonDone);
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); state.deferredPrompt = e; document.getElementById('installBtn').classList.remove('hidden'); });
  document.getElementById('installBtn').addEventListener('click', async ()=> { if (!state.deferredPrompt) return; state.deferredPrompt.prompt(); await state.deferredPrompt.userChoice; state.deferredPrompt = null; document.getElementById('installBtn').classList.add('hidden'); });
}
function switchAuthPane(id){
  document.querySelectorAll('.auth-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.pane === id));
  document.querySelectorAll('.auth-pane').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('authPanel').classList.remove('hidden');
}

bindEvents();
renderAuth();
handlePaymentResultFromQuery();
registerSW();