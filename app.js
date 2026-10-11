(function(){
"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- tabs ---------- */
function show(tab){
  $$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  $$(".panel").forEach(p=>p.classList.toggle("active",p.id===tab));
  if(history.replaceState) history.replaceState(null,"","#"+tab);
}
$$(".tab").forEach(b=>b.addEventListener("click",()=>show(b.dataset.tab)));
const h=location.hash.slice(1); if(["quiz","lint","uth","guide"].includes(h)) show(h);

/* ---------- 习惯体检 ---------- */
// 每题: 文本, 选项[文本, 扣分], 药方
const Q=[
 ["你会用 #互关 #蓝V互关 #互粉 #激活账号 这类标签吗？",[["从不",0],["偶尔",8],["经常",15]],"删掉互关/激活类标签：X 官方说刷互关不会被推，反而算「互动作弊」。"],
 ["一条推文一般带几个标签？",[["0–2 个",0],["3–5 个",5],["6 个以上",10]],"每条最多 1–2 个和内容相关的标签，堆标签会被当成垃圾信息。"],
 ["参加过互赞群、互关团、互刷评论吗？",[["没有",0],["以前有",6],["正在参加",15]],"退出互赞/互关团。X 2026 年 9 月还起诉过协同刷互动的账号。"],
 ["会短时间内大量关注、再取关吗？",[["不会",0],["偶尔",6],["经常",12]],"停止关注再取关（follow churn），这是官方点名的垃圾号手法。"],
 ["发帖会用擦边、成人暗示的图或标签吗？",[["不会",0],["偶尔",8],["经常",14]],"擦边内容会被打上 NSFW 标签，不再推荐给陌生人，日常号和擦边内容最好分开。"],
 ["会把同一句话复制到很多人的评论区吗？",[["不会",0],["偶尔",6],["经常",12]],"每条评论都要和原帖相关、不重复，复制粘贴评论会被折叠甚至限流。"],
 ["文案里写「点赞转发抽奖」「评论区扣 1」吗？",[["不写",0],["偶尔",4],["经常",8]],"把指令改成自然提问：「你们会选哪个？」比「评论区扣1」更好也更安全。"],
 ["两条主帖之间一般隔多久？",[["2 小时以上",0],["半小时到 2 小时",4],["经常连发",8]],"主帖间隔 2–3 小时以上：同一作者短时间连发，后面的会被降权。"],
 ["推文结尾会抛一个好回答的问题吗？",[["经常",0],["偶尔",3],["从不",6]],"回复的权重是点赞的 10 倍，结尾加个二选一或关心粉丝的问题。"],
 ["发完帖 1 小时内会回复评论吗？",[["会",0],["有时",3],["基本不回",6]],"发帖后 1 小时内回复前几十条评论，让对话继续下去。"],
 ["用过来路不明的「自动涨粉 / 自动发帖」工具或给过别人密码吗？",[["没有",0],["用过",8],["正在用",12]],"撤销不认识的第三方授权（设置→安全→应用和会话），开两步验证，别把密码给涨粉工具。"],
 ["最近一个月发帖频率？",[["每天都发",0],["每周几条",2],["断更很久",6]],"保持稳定更新，断更后先用老粉爱互动的内容把活跃度拉回来。"]
];
const form=$("#quizForm");
form.innerHTML=Q.map((q,i)=>`<div class="q"><p>${i+1}. ${esc(q[0])}</p><div class="opts">${q[1].map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}" ${j===0?"":""}><span>${esc(o[0])}</span></label>`).join("")}</div></div>`).join("");
let lastScore=null;
$("#quizBtn").addEventListener("click",e=>{
  e.preventDefault();
  let score=100, fixes=[], missing=0;
  Q.forEach((q,i)=>{
    const c=form.querySelector(`input[name=q${i}]:checked`);
    if(!c){missing++;return;}
    const pen=q[1][+c.value][1];
    if(pen>0){score-=pen;fixes.push([pen,q[2]]);}
  });
  if(missing){alert(`还有 ${missing} 题没选哦 🥕`);return;}
  score=Math.max(0,Math.round(score));
  fixes.sort((a,b)=>b[0]-a[0]);
  const [title,desc]= score>=90?["健康宝宝 🌟","账号习惯很好！流量不高多半是内容或时机问题，试试在提问、关心粉丝上多下功夫。"]
    : score>=75?["小感冒 🤧","有几处小毛病，照着药方改，一两周就能看到变化。"]
    : score>=55?["需要调理 🩹","有几个习惯很可能在拖累推荐，优先改掉排在前面的几条。"]
    :["赶紧就医 🚑","多个高风险习惯叠在一起，很可能已经被降权。先停掉互刷和标签，再去「官方报告解读」查一查。"];
  lastScore={score,title};
  $("#scoreNum").textContent=score;
  $(".score-ring").style.setProperty("--p",score);
  $("#scoreTitle").textContent=title;
  $("#scoreDesc").textContent=desc;
  $("#fixList").innerHTML=(fixes.length?fixes.slice(0,5).map(f=>`<li>${esc(f[1])}</li>`).join(""):"<li>保持现在的节奏，多发能让人想回复、想转给朋友的内容。</li>");
  $("#quizResult").classList.remove("hidden");
  $("#shareImg").classList.add("hidden");$("#shareTip").classList.add("hidden");
  $("#quizResult").scrollIntoView({behavior:"smooth",block:"start"});
});

/* 分享卡片（canvas 本地生成） */
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function drawCarrot(ctx,cx,cy,s){
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-0.2);ctx.scale(s,s);
  ctx.fillStyle="#6cbf5a";ctx.beginPath();ctx.ellipse(-8,-48,8,20,-0.4,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(8,-50,8,22,0.4,0,7);ctx.fill();
  ctx.fillStyle="#ff9a3c";ctx.beginPath();ctx.moveTo(-30,-30);ctx.quadraticCurveTo(0,-44,30,-30);ctx.quadraticCurveTo(26,10,0,60);ctx.quadraticCurveTo(-26,10,-30,-30);ctx.fill();
  ctx.fillStyle="#3b2a20";ctx.beginPath();ctx.arc(-10,-18,4.5,0,7);ctx.arc(10,-18,4.5,0,7);ctx.fill();
  ctx.strokeStyle="#3b2a20";ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(0,-8,6,0.2,Math.PI-0.2);ctx.stroke();
  ctx.fillStyle="rgba(255,150,140,.8)";ctx.beginPath();ctx.ellipse(-20,-8,6,3.5,0,0,7);ctx.ellipse(20,-8,6,3.5,0,0,7);ctx.fill();
  ctx.restore();
}
$("#cardBtn").addEventListener("click",()=>{
  if(!lastScore) return;
  const cv=$("#shareCanvas"),ctx=cv.getContext("2d"),W=cv.width,H=cv.height;
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#fff8ee");g.addColorStop(1,"#ffe1cc");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle="#fffdf9";roundRect(ctx,70,150,W-140,H-300,60);ctx.fill();
  const font='"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans CJK SC",sans-serif';
  ctx.textAlign="center";ctx.fillStyle="#e5701a";ctx.font=`700 40px ${font}`;ctx.fillText("萝卜的推特流量体检 🥕",W/2,100);
  drawCarrot(ctx,W/2,350,2.4);
  ctx.fillStyle="#8a7366";ctx.font=`500 44px ${font}`;ctx.fillText("我的账号健康分",W/2,560);
  ctx.fillStyle="#e5701a";ctx.font=`800 240px ${font}`;ctx.fillText(String(lastScore.score),W/2,800);
  ctx.fillStyle="#4a3428";ctx.font=`700 64px ${font}`;ctx.fillText(lastScore.title,W/2,920);
  ctx.fillStyle="#8a7366";ctx.font=`400 36px ${font}`;
  ctx.fillText("免费 · 离线 · 不要密码",W/2,1010);ctx.fillText("你也来测测？",W/2,1060);
  ctx.fillStyle="#e5701a";ctx.font=`600 36px ${font}`;ctx.fillText("by 萝卜 @wutujiang1999",W/2,H-80);
  const url=cv.toDataURL("image/png");
  const img=$("#shareImg");img.src=url;img.classList.remove("hidden");$("#shareTip").classList.remove("hidden");
});

/* ---------- 发推前检查 ---------- */
const RISK_TAGS=/(互关|互粉|回关|秒回关|蓝v互关|蓝V互关|互赞|互推|激活账号|涨粉|求关注|关注必回|f4f|follow\s*back|followback|follow4follow|like4like|l4l|ifb)/i;
const ADULT=/(唾液|约炮|福利姬|裸|成人|涩涩|色色|18\+|r18|nsfw|onlyfans|fansone|看片|飞机杯|情趣)/i;
const BAIT=/(点赞.{0,4}转发|转发.{0,4}抽|评论区.{0,4}(扣|打)|扣\s*1|关注.{0,4}(抽|送)|帮.{0,2}转|求转发|三连|like\s*and\s*(rt|retweet)|rt\s*to\s*win)/i;
const MONEY=/(稳赚|保本|日入|躺赚|带单|返利|返佣|高收益|空投|私信领|加v|加微|vx|wx|飞机号|tg号|telegram|代充|翻倍)/i;
const QUESTION=/[？?]|(吗|呢|哪个|哪张|还是|怎么|你们觉得|你们会)/;
function lint(text){
  const t=text.trim(), out=[];
  if(!t){return [{lv:"warn",h:"还没写内容",d:"把推文粘贴进来再检查。"}];}
  const tags=(t.match(/[#＃][^\s#＃]+/g)||[]);
  const mentions=(t.match(/@\w+/g)||[]);
  const links=(t.match(/https?:\/\/\S+/g)||[]);
  const textOnly=t.replace(/https?:\/\/\S+/g,"").replace(/[#＃][^\s#＃]+/g,"").replace(/@\w+/g,"").trim();
  const risky=tags.filter(x=>RISK_TAGS.test(x));
  if(risky.length) out.push({lv:"bad",h:"互关 / 涨粉类标签："+risky.join(" "),d:"官方把互关、互赞算作「互动作弊」，刷互关不会被推，建议全部删掉。"});
  if(tags.length>2) out.push({lv:"warn",h:`标签有 ${tags.length} 个`,d:"每条 0–2 个、和内容相关就够了，堆标签容易被当成垃圾信息。"});
  if(ADULT.test(t)) out.push({lv:"bad",h:"有成人 / 擦边暗示词",d:"容易被打上 NSFW 标签：不推荐给陌生人、对未成年和未登录用户隐藏。"});
  if(BAIT.test(t)) out.push({lv:"warn",h:"指令式诱导互动",d:"「点赞转发抽奖」「评论区扣1」这类写法，官方说相关曝光不计入分成。改成自然提问更好。"});
  if(MONEY.test(t)) out.push({lv:"bad",h:"有收益承诺 / 引流加好友类词",d:"「稳赚、带单、加V、代充」等很像诈骗和引流号话术，容易被举报（举报权重 −234）。"});
  if(mentions.length>1) out.push({lv:"warn",h:`@ 了 ${mentions.length} 个人`,d:"一次 @ 一串人像群发，建议每条最多 @ 1 个真正相关的人。"});
  if(links.length && textOnly.length<15) out.push({lv:"warn",h:"几乎只有一个链接",d:"光秃秃的链接没人想点。先用两三句话说清楚它对读者有什么用。"});
  if(textOnly.length>0 && textOnly.length<6 && !links.length) out.push({lv:"warn",h:"内容太短",d:"「早」「来了」这类低信息内容很难拿到推荐，加一句感受或一个问题吧。"});
  if(/(.)\1{5,}/.test(textOnly)) out.push({lv:"warn",h:"重复字符太多",d:"一长串重复的表情或字，看起来像刷屏。"});
  if(!QUESTION.test(textOnly)) out.push({lv:"warn",h:"没有给粉丝留回复的口子",d:"回复的权重是点赞的 10 倍，结尾加个二选一或「你们呢？」试试。"});
  else out.push({lv:"good",h:"有提问 👍",d:"好回答的问题最容易带来回复。"});
  if(!out.some(o=>o.lv==="bad")) out.push({lv:"good",h:"没发现高风险写法",d:"再选个粉丝活跃的时段发，发完 1 小时内回回评论。"});
  return out;
}
$("#lintBtn").addEventListener("click",()=>{
  const r=lint($("#lintText").value);
  const bad=r.filter(x=>x.lv==="bad").length, warn=r.filter(x=>x.lv==="warn").length;
  $("#lintTitle").textContent= bad?`⚠️ 发现 ${bad} 个高风险、${warn} 个可优化`: warn?`🙂 没有高风险，${warn} 处可以更好`:"🌟 很棒，可以发啦";
  $("#lintList").innerHTML=r.map(x=>`<li class="${x.lv}"><b>${esc(x.h)}</b>${esc(x.d)}</li>`).join("");
  $("#lintResult").classList.remove("hidden");
});
$("#lintDemo").addEventListener("click",()=>{$("#lintText").value="今天降温啦 宝宝们记得加衣服 点赞转发抽一个人送奶茶 #蓝v互关 #激活账号 #互粉 #日常 @a @b";$("#lintBtn").click();});

/* ---------- 官方报告解读 ---------- */
function zhLabel(code){
  const L=window.LUOBO_LABELS[code]; if(L) return L;
  for(const [re,zh,fix] of window.LUOBO_KEYWORDS) if(re.test(code)) return {zh:"（萝卜根据名字推测）"+zh,fix};
  return {zh:"萝卜还没收录这个标签，先看下面的英文原文。",fix:"可以把英文说明复制给萝卜或任意翻译工具。"};
}
function zhEffect(en){
  const hits=window.LUOBO_EFFECT.filter(([re])=>re.test(en||"")).map(x=>x[1]);
  return hits.length?hits.join("；"):"";
}
function labelCard(l,kind){
  const z=zhLabel(l.label), part=kind==="post"?+l.posts||0:+l.days||0, total=kind==="post"?+l.totalPostsInMonth||0:+l.daysInPeriod||0;
  const pct=total>0?Math.min(100,part/total*100):0;
  const stat=kind==="post"?`${part} / ${total} 条帖子 · ${esc(l.percentageOfPosts||pct.toFixed(1)+"%")}`:`${part} / ${total} 天 · ${esc(l.percentageOfDays||pct.toFixed(1)+"%")}`;
  const ze=zhEffect(l.effect);
  return `<div class="label-card"><span class="code">${esc(l.label)}</span> <div class="tiny" style="margin-top:6px"><b>${stat}</b></div>
  <div class="bar"><i style="width:${pct}%"></i></div>
  <p><b>是什么：</b>${esc(z.zh)}</p>${ze?`<p><b>影响：</b>${esc(ze)}</p>`:""}
  <p><b>萝卜建议：</b>${esc(z.fix)}</p>
  <p class="tiny">原文：${esc(l.about||"")} ${esc(l.effect||"")}</p></div>`;
}
function renderUth(raw,isSample){
  const box=$("#uthResult");
  let r; try{ r=typeof raw==="string"?JSON.parse(raw):raw; }catch(e){ box.innerHTML="<p>😵 这不是有效的 JSON 文件，请确认下载的是 Under the Hood 报告。</p>";box.classList.remove("hidden");return; }
  if(!r||typeof r!=="object"||(!("postLabels" in r)&&!("accountLabels" in r))){box.innerHTML="<p>😵 文件里没找到 postLabels / accountLabels，看起来不是 Under the Hood 报告。</p>";box.classList.remove("hidden");return;}
  const pl=Array.isArray(r.postLabels)?r.postLabels.filter(x=>x&&x.label):[], al=Array.isArray(r.accountLabels)?r.accountLabels.filter(x=>x&&x.label):[];
  const p=r.period||{};
  const verdict= !pl.length&&!al.length?"🌟 这个月没有任何降低可见度的标签，流量问题不在「被限流」，重点优化内容和发帖时间吧。"
    : al.length?"🚑 账号整体被打了标签，这比单条帖子更影响流量，优先处理下面的账号标签。"
    : "🩹 只有部分帖子被打了标签，账号整体没问题。看看是哪类内容，下次避开就好。";
  box.innerHTML=`${isSample?'<p class="tip">这是 X 开源代码里的官方<b>示例报告</b>，不是真实账号数据。</p>':""}
  <h3>报告概览</h3>
  <p>统计周期：${esc(p.startDate||"?")} 至 ${esc(p.endDate||"?")}（${esc(p.timezone||"UTC")}）<br>本期帖子数：${esc(r.postCount??"?")}　生成时间：${esc(r.generatedAt||"?")}</p>
  <p class="tip">${verdict}</p>
  <h3>帖子标签（${pl.length}）</h3>${pl.length?pl.map(l=>labelCard(l,"post")).join(""):"<p class='muted'>✅ 本期没有</p>"}
  <h3>账号标签（${al.length}）</h3>${al.length?al.map(l=>labelCard(l,"acct")).join(""):"<p class='muted'>✅ 本期没有</p>"}
  <p class="tiny">报告只覆盖已经结束的月份，大约在月底后 10 天生成；最近几天的变化要等下一期。</p>`;
  box.classList.remove("hidden");box.scrollIntoView({behavior:"smooth",block:"start"});
}
$("#uthFile").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>renderUth(rd.result,false);rd.readAsText(f);});
$("#uthParse").addEventListener("click",()=>renderUth($("#uthText").value,false));
$("#uthDemo").addEventListener("click",()=>renderUth(window.LUOBO_SAMPLE,true));

window.__luobo={lint,renderUth};
})();
