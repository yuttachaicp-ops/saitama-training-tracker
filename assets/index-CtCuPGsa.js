(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function a(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=a(n);fetch(n.href,i)}})();const Ut=["อา.","จ.","อ.","พ.","พฤ.","ศ.","ส."],la=["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"],ca=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];function fe(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),s=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${s}`}function ct(t){const[e,a,s]=String(t).split("-").map(Number);return new Date(e,(a||1)-1,s||1,12,0,0,0)}function _(){return fe(new Date)}function G(t,e){const a=ct(t);return a.setDate(a.getDate()+e),fe(a)}function ft(t,e){const a=ct(e).getTime()-ct(t).getTime();return Math.round(a/864e5)}function Gt(t){return ct(t).getDay()}function ye(t){return(Gt(t)+6)%7}function Et(t){return G(t,-ye(t))}function Y(t,e=!0){const a=ct(t),s=`${a.getDate()} ${ca[a.getMonth()]}`;return e?`${s} ${a.getFullYear()+543}`:s}function H(t){return`${Ut[Gt(t)]} ${Y(t)}`}function F(t){t=Math.max(0,Math.round(t||0));const e=Math.floor(t/3600),a=Math.floor(t%3600/60),s=t%60,n=i=>String(i).padStart(2,"0");return e>0?`${e}:${n(a)}:${n(s)}`:`${n(a)}:${n(s)}`}function dt(t){t=Math.max(0,Math.round(t||0));const e=Math.floor(t/3600),a=Math.round(t%3600/60);return e>0?a>0?`${e} ชม. ${a} นาที`:`${e} ชม.`:a>0?`${a} นาที`:t>0?`${t} วินาที`:"0 นาที"}function qt(t){if(!isFinite(t)||t<=0)return"—";const e=Math.floor(t/60),a=Math.round(t%60);return`${e}:${String(a).padStart(2,"0")}`}function $e(t){const e=Et(t);return Array.from({length:7},(a,s)=>G(e,s))}const we=1;function da(){return{name:"นักฝึก",gender:"male",age:26,heightCm:187,weightKg:74,level:"beginner",goals:"เพิ่มความแข็งแรง เพิ่มความอึด และสร้างความสม่ำเสมอ",sessionMinutes:60,daysPerWeek:6,equipment:"bodyweight"}}function oa(){return{theme:"dark",startDate:Et(_()),difficulty:"standard",restSeconds:60,distanceUnit:"km",workoutTime:"05:00",reminderEnabled:!1}}function ht(){return{schemaVersion:we,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),profile:da(),settings:oa(),programOverrides:{},sessions:{},achievements:{},lastBackup:null}}const ke={easy:.8,standard:1,hard:1.2},ua={beginner:"เริ่มต้น",intermediate:"ปานกลาง",advanced:"ขั้นสูง"},va={easy:"เบา (ลดจำนวนครั้ง 20%)",standard:"มาตรฐาน (ตามโปรแกรม)",hard:"หนัก (เพิ่มจำนวนครั้ง 20%)"},xe="saitama-training-tracker/v1",Me="saitama-training-tracker/backup";let tt=!0;function pa(){return tt}function ma(){try{const t="__stt_probe__";localStorage.setItem(t,"1"),localStorage.removeItem(t),tt=!0}catch{tt=!1}return tt}function Se(t){const e=ht();if(!t||typeof t!="object")return e;const a={...e,...t,schemaVersion:we,profile:{...e.profile,...t.profile||{}},settings:{...e.settings,...t.settings||{}},programOverrides:t.programOverrides||{},sessions:t.sessions&&typeof t.sessions=="object"?t.sessions:{},achievements:t.achievements&&typeof t.achievements=="object"?t.achievements:{}};for(const[s,n]of Object.entries(a.sessions))!n||typeof n!="object"||!n.date?delete a.sessions[s]:Array.isArray(n.exercises)||(n.exercises=n.exercises?[]:[]);return a}function ha(){if(ma(),!tt)return ht();try{const t=localStorage.getItem(xe);return t?Se(JSON.parse(t)):ht()}catch(t){return console.error("[storage] อ่านข้อมูลไม่สำเร็จ ใช้ค่าเริ่มต้นแทน",t),ht()}}function _e(t){if(!tt)return!1;try{return t.updatedAt=new Date().toISOString(),localStorage.setItem(xe,JSON.stringify(t)),!0}catch(e){return console.error("[storage] บันทึกข้อมูลไม่สำเร็จ",e),tt=!1,!1}}function Ee(t){try{return localStorage.setItem(Me,JSON.stringify({at:new Date().toISOString(),data:t})),!0}catch{return!1}}function ga(){try{const t=localStorage.getItem(Me);return t?JSON.parse(t):null}catch{return null}}function ba(t){if(!t||typeof t!="object")return{ok:!1,error:"ไฟล์ไม่ใช่ JSON ที่ถูกต้อง"};if(!t.profile&&!t.sessions&&!t.settings)return{ok:!1,error:"ไม่พบข้อมูลของแอปในไฟล์นี้"};try{return{ok:!0,data:Se(t)}}catch{return{ok:!1,error:"โครงสร้างข้อมูลในไฟล์เสียหาย"}}}let z=ha();const Ct=new Set;function T(){return z}function fa(t){return Ct.add(t),()=>Ct.delete(t)}function Le(t){for(const e of Ct)try{e(z,t)}catch(a){console.error("[state] subscriber error",a)}}function N(t,e={}){try{t(z)}catch(s){return console.error("[state] mutator error",s),!1}const a=_e(z);return e.silent||Le(e.reason||"update"),a}function Lt(t,e="replace"){z=t,_e(z),Le(e)}function Oe(){Ee(z);const t=ht();t.lastBackup=new Date().toISOString(),Lt(t,"reset-all")}function qe(t){Ee(z),N(e=>{e.sessions={},e.achievements={},e.programOverrides={},e.lastBackup=new Date().toISOString(),t&&(e.settings.startDate=t)},{reason:"reset-program"})}const De=pa,je=ga,Bt=ba;function K(t){return z.sessions[t]||null}function Jt(t){N(e=>{e.sessions[t.date]=t},{reason:"session"})}function yt(t){N(e=>{delete e.sessions[t]},{reason:"session-delete"})}function ya(){return Object.values(z.sessions).sort((t,e)=>t.date<e.date?1:-1)}const $a=Object.freeze(Object.defineProperty({__proto__:null,allSessions:ya,deleteSession:yt,getData:T,getSession:K,putSession:Jt,readBackup:je,replace:Lt,resetAll:Oe,resetProgram:qe,storageAvailable:De,subscribe:fa,update:N,validateImport:Bt},Symbol.toStringTag,{value:"Module"})),Ae=window.matchMedia("(prefers-color-scheme: dark)");let Kt="dark";function wa(t){return t==="system"?Ae.matches?"dark":"light":t==="light"?"light":"dark"}function Z(t){Kt=t||"dark";const e=wa(Kt);document.documentElement.setAttribute("data-theme",e);const a=document.querySelector('meta[name="theme-color"]');a&&a.setAttribute("content",e==="dark"?"#111318":"#f4f5f7")}function ka(t,e){Z(t),Ae.addEventListener("change",()=>{Kt==="system"&&(Z("system"),e==null||e())})}const Ne=new Map;let Pe=null,Ft=null,kt=null;function Te(t,e){Ne.set(t,e)}function Re(t){Pe=t}function Ie(){const t=location.hash.replace(/^#/,"")||"/",[e,a]=t.split("?"),s={};return new URLSearchParams(a||"").forEach((n,i)=>{s[i]=n}),{path:e||"/",params:s}}function D(t,e={}){const a=new URLSearchParams(e).toString(),s=`#${t}${a?`?${a}`:""}`;location.hash===s?$t():location.hash=s}function xa(){return Ft}function Ce(t){kt=t}function $t(){const{path:t,params:e}=Ie();Ft={path:t,params:e};const a=Ne.get(t)||Pe;if(a){try{a(e)}catch(s){console.error("[router] render error",t,s);const n=document.getElementById("view");n&&(n.innerHTML=`<div class="page"><div class="card"><b>เกิดข้อผิดพลาดในการแสดงหน้านี้</b><p class="small muted mt-8">${String(s.message||s)}</p></div></div>`)}kt==null||kt(Ft),window.scrollTo({top:0,behavior:"instant"in window?"instant":"auto"})}}function Be(){window.addEventListener("hashchange",$t),location.hash||(location.hash="#/"),$t()}const Ma=Object.freeze(Object.defineProperty({__proto__:null,currentRoute:xa,defineRoute:Te,navigate:D,onRouteChange:Ce,parseHash:Ie,render:$t,setNotFound:Re,start:Be},Symbol.toStringTag,{value:"Module"})),y=(t,e="")=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${e}>${t}</svg>`,Ht={home:y('<path d="M3 10.5 12 3.5l9 7V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),calendar:y('<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>'),chart:y('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),settings:y('<circle cx="12" cy="12" r="3.2"/><path d="M19.4 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.5 1z"/>'),dumbbell:y('<path d="M6 7v10M3.5 9.5v5M18 7v10M20.5 9.5v5M6 12h12"/>'),run:y('<circle cx="15.5" cy="4.6" r="1.9"/><path d="M12.4 21.5l1.6-5.1-3-2.6-.9 4M14 16.4l-3.6-2.9 1.1-4.6 3.3-1.3 2.4 3.3 2.6 1.1M11.5 7.9 8.2 9.2l-1 3.1M5.5 20.5l2.3-3.4"/>'),check:y('<path d="M4.5 12.5 9.5 17.5 19.5 6.8"/>','stroke-width="2.6"'),play:y('<path d="M7 4.6 19.2 12 7 19.4z" fill="currentColor"/>'),pause:y('<rect x="6.5" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" stroke="none"/>'),stop:y('<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>'),plus:y('<path d="M12 5v14M5 12h14"/>'),minus:y('<path d="M5 12h14"/>'),left:y('<path d="M15 5 8 12l7 7"/>'),right:y('<path d="M9 5l7 7-7 7"/>'),down:y('<path d="M5 9l7 7 7-7"/>'),sun:y('<circle cx="12" cy="12" r="4"/><path d="M12 2v2.2M12 19.8V22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2 12h2.2M19.8 12H22M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/>'),moon:y('<path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z"/>'),monitor:y('<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8.5 21h7M12 17v4"/>'),trophy:y('<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5.5H4.5v1A3.5 3.5 0 0 0 8 10M17 5.5h2.5v1A3.5 3.5 0 0 1 16 10M9.5 20h5M12 14v6"/>'),clock:y('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.3 2"/>'),flame:y('<path d="M12 22a6 6 0 0 0 6-6c0-4-3-5.5-3.5-9-2 1.5-2.5 3.5-2 5.5-1.2-.6-1.8-2-1.8-3.4C8.4 10.6 6 12.8 6 16a6 6 0 0 0 6 6z"/>'),ruler:y('<path d="M3.8 14.2 14.2 3.8l6 6L9.8 20.2z"/><path d="M8 8l2 2M11 5l2 2M5 11l2 2"/>'),history:y('<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1M3.5 4.5V9H8"/><path d="M12 7.5V12l3 1.8"/>'),bell:y('<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9z"/><path d="M13.7 19a2 2 0 0 1-3.4 0"/>'),download:y('<path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4 19.5h16"/>'),upload:y('<path d="M12 15.5v-11M7.5 8.5 12 4l4.5 4.5M4 19.5h16"/>'),trash:y('<path d="M4 6.5h16M9.5 6.5V4.2h5v2.3M6.5 6.5l.9 13a1.5 1.5 0 0 0 1.5 1.3h6.2a1.5 1.5 0 0 0 1.5-1.3l.9-13"/><path d="M10 10.5v6.5M14 10.5v6.5"/>'),edit:y('<path d="M4 20h4.2L19 9.2a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14.5 7.5l2 2"/>'),info:y('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.3"/>'),alert:y('<path d="M12 3.5 22 20H2z"/><path d="M12 9.5v4M12 16.8v.3"/>'),x:y('<path d="M6 6l12 12M18 6 6 18"/>'),target:y('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),search:y('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),filter:y('<path d="M3.5 5.5h17l-6.5 7.5V20l-4-2v-5z"/>'),save:y('<path d="M5 4h11l3 3v13H5z"/><path d="M8.5 4v5h7V4M8.5 20v-5h7v5"/>'),refresh:y('<path d="M20.5 12a8.5 8.5 0 1 1-2.5-6M20.5 3.5V9H15"/>'),book:y('<path d="M4 4.5h6a3 3 0 0 1 3 3V21a2.4 2.4 0 0 0-2.4-2.4H4z"/><path d="M20 4.5h-6a3 3 0 0 0-3 3V21a2.4 2.4 0 0 1 2.4-2.4H20z"/>'),heart:y('<path d="M12 20.2 4.6 13A4.5 4.5 0 0 1 12 7.8 4.5 4.5 0 0 1 19.4 13z"/>'),lock:y('<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/>'),user:y('<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>'),road:y('<path d="M8 3 5 21M16 3l3 18M12 4v3M12 11v3M12 18v3"/>')},x=t=>`<svg viewBox="0 0 48 32" width="44" height="29" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`,ce={pushup:x('<circle cx="9" cy="12" r="2.6"/><path d="M12 13h20l6 5"/><path d="M14 13v8M30 13v8"/><path d="M38 18l3 3"/>'),incline_pushup:x('<circle cx="8" cy="17" r="2.6"/><path d="M11 17.5 32 10"/><path d="M13 18v6M29 11v13"/><path d="M34 8h10v4"/>'),squat:x('<circle cx="18" cy="6" r="2.8"/><path d="M18 9v7l-6 5v5"/><path d="M18 16l6 5v5"/><path d="M18 11l-6 2"/>'),glute_bridge:x('<circle cx="7" cy="20" r="2.6"/><path d="M10 20 20 11l8 9"/><path d="M28 20v6"/><path d="M4 27h40"/>'),dead_bug:x('<circle cx="10" cy="20" r="2.6"/><path d="M13 21h18"/><path d="M16 21 13 11M31 21l4-9"/><path d="M26 21l2 7"/><path d="M4 27h40"/>'),calf_raise:x('<circle cx="24" cy="5" r="2.8"/><path d="M24 8v12"/><path d="M24 20v5l4 2"/><path d="M24 11l-6 3M24 11l6 3"/><path d="M8 27h32"/>'),reverse_lunge:x('<circle cx="20" cy="5" r="2.8"/><path d="M20 8v9"/><path d="M20 17l-4 5v5"/><path d="M20 17l8 4 4 6"/><path d="M6 27h36"/>'),hip_hinge:x('<circle cx="12" cy="11" r="2.8"/><path d="M15 12h10l3 8"/><path d="M28 20v6"/><path d="M15 14l-3 6"/><path d="M6 27h36"/>'),bird_dog:x('<circle cx="12" cy="11" r="2.6"/><path d="M15 12h14"/><path d="M29 12v9M18 12v9"/><path d="M15 12 7 7M29 16l8-5"/><path d="M4 24h40"/>'),plank:x('<circle cx="9" cy="13" r="2.6"/><path d="M12 14h22l5 7"/><path d="M14 14v7h-3"/><path d="M4 24h40"/>'),stretch:x('<circle cx="14" cy="7" r="2.8"/><path d="M14 10v8l-5 8"/><path d="M14 18l9 8"/><path d="M14 12l-6-3M14 12l10-4"/>'),run:x('<circle cx="30" cy="6" r="2.8"/><path d="M28 10 22 14l1 6-4 7"/><path d="M23 20l6 2 2 6"/><path d="M26 12l6 1 3 4"/><path d="M20 13l-6 2"/>'),walk:x('<circle cx="26" cy="6" r="2.8"/><path d="M26 9v8"/><path d="M26 17l-5 9M26 17l5 9"/><path d="M26 12l-6 3M26 12l6 2"/>'),march:x('<circle cx="24" cy="5" r="2.6"/><path d="M24 8v9"/><path d="M24 17l-6 3 2 7M24 17l4 4v6"/><path d="M24 11l-5 4M24 11l5-2"/><path d="M8 28h32"/>'),arm_circles:x('<circle cx="20" cy="6" r="2.6"/><path d="M20 9v10l-3 8M20 19l3 8"/><path d="M20 12l6-3"/><path d="M32 4a7 7 0 1 1-5 12" stroke-dasharray="3 3"/><path d="M28 14l-1 3 3 .5"/>'),torso_twist:x('<circle cx="24" cy="5" r="2.6"/><path d="M24 8v10"/><path d="M24 18l-4 9M24 18l4 9"/><path d="M14 12h20"/><path d="M14 12l3-3M14 12l3 3M34 12l-3-3M34 12l-3 3"/>'),hip_circles:x('<circle cx="24" cy="5" r="2.6"/><path d="M24 8v8"/><ellipse cx="24" cy="18" rx="8" ry="4" stroke-dasharray="3 3"/><path d="M21 21l-2 6M27 21l2 6"/><path d="M24 11l-5 2M24 11l5 2"/>'),leg_swings:x('<circle cx="24" cy="5" r="2.6"/><path d="M24 8v10"/><path d="M24 18v9"/><path d="M24 18l9 4" stroke-dasharray="3 2"/><path d="M24 18l-8 5" stroke-dasharray="3 2"/><path d="M38 14v10"/>'),ankle_circles:x('<path d="M20 6v12l-4 6h12"/><ellipse cx="26" cy="25" rx="7" ry="3.5" stroke-dasharray="3 3"/><path d="M14 6h12"/>'),cat_cow:x('<circle cx="12" cy="12" r="2.6"/><path d="M15 13c6-5 14-5 18 1"/><path d="M33 14v9M18 12v11"/><path d="M4 25h40"/>'),quad_stretch:x('<circle cx="22" cy="5" r="2.6"/><path d="M22 8v9"/><path d="M22 17v10"/><path d="M22 17l6 2-4 6"/><path d="M22 11l6 6"/><path d="M8 28h32"/>'),hamstring_stretch:x('<circle cx="14" cy="8" r="2.6"/><path d="M17 10l4 5"/><path d="M21 15h13"/><path d="M21 15l-3 11"/><path d="M17 11l6 5"/><path d="M6 27h36"/>'),calf_stretch:x('<circle cx="16" cy="7" r="2.6"/><path d="M16 10v8"/><path d="M16 18l-7 8M16 18l7 8"/><path d="M16 12l10-2"/><path d="M30 4v22"/><path d="M4 26h26"/>'),figure_four:x('<circle cx="9" cy="16" r="2.6"/><path d="M12 17h10"/><path d="M22 17l5-7M22 17l6 6"/><path d="M24 13l7 3"/><path d="M4 26h40"/>'),chest_stretch:x('<circle cx="24" cy="5" r="2.6"/><path d="M24 8v10"/><path d="M24 18l-4 9M24 18l4 9"/><path d="M24 11l-9-4M24 11l9-4"/><path d="M15 7l-2 3M33 7l2 3"/>'),child_pose:x('<path d="M10 22h8l12-8"/><circle cx="8" cy="21" r="2.6"/><path d="M30 14l4 8h-6"/><path d="M12 22c4-6 10-8 16-8"/><path d="M4 25h40"/>'),breathe:x('<circle cx="24" cy="16" r="8" stroke-dasharray="4 3"/><path d="M24 20v-9M24 11l-3 3M24 11l3 3"/>'),rest:x('<path d="M16 8h10l-10 12h10"/><path d="M30 14h6l-6 7h6"/>')};function u(t,e=""){const a=Ht[t]||Ht.info;return e?a.replace("<svg ",`<svg class="${e}" `):a}function C(t){return ce[t]||ce.stretch}const Ke=[{path:"/",label:"หน้าหลัก",icon:"home"},{path:"/workout",label:"ฝึกวันนี้",icon:"dumbbell"},{path:"/program",label:"โปรแกรม",icon:"calendar"},{path:"/stats",label:"สถิติ",icon:"chart"},{path:"/settings",label:"ตั้งค่า",icon:"settings"}],Sa=[{path:"/warmup",label:"วอร์มอัป & ยืดเหยียด",icon:"heart"},{path:"/running",label:"บันทึกการวิ่ง",icon:"run"},{path:"/history",label:"ประวัติการฝึก",icon:"history"},{path:"/achievements",label:"ความสำเร็จ",icon:"trophy"},{path:"/guide",label:"คำแนะนำความปลอดภัย",icon:"book"}];function _a(){const t=e=>`<button class="side-link" data-nav="${e.path}">${u(e.icon)}<span>${e.label}</span></button>`;return`
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">${Ht.dumbbell}</div>
        <div>
          <div class="brand-name">Saitama</div>
          <div class="brand-sub">Training Tracker</div>
        </div>
      </div>
      ${Ke.map(t).join("")}
      <div class="side-divider"></div>
      ${Sa.map(t).join("")}
      <div class="side-foot">
        เครื่องมือติดตามการฝึก ไม่ใช่คำแนะนำทางการแพทย์
      </div>
    </aside>`}function Ea(){return`
    <nav class="bottom-nav">
      ${Ke.map(t=>`<button class="bn-item" data-nav="${t.path}">${u(t.icon)}<span>${t.label}</span></button>`).join("")}
    </nav>`}function Wt(t){t.querySelectorAll("[data-nav]").forEach(e=>{e.addEventListener("click",()=>D(e.dataset.nav))})}function La(t){document.querySelectorAll("[data-nav]").forEach(e=>{const a=e.dataset.nav,s=a===t||a!=="/"&&t.startsWith(a);e.classList.toggle("active",s)})}const Oa=()=>document.getElementById("toast-root");function $(t,e="ok",a=2600){var n;const s=document.createElement("div");s.className=`toast ${e}`,s.innerHTML=`${u(e==="err"?"alert":"check")}<span>${t}</span>`,(n=Oa())==null||n.appendChild(s),setTimeout(()=>{s.style.transition="opacity .25s, transform .25s",s.style.opacity="0",s.style.transform="translateY(8px)",setTimeout(()=>s.remove(),260)},a)}let xt=null,de=null;function Dt(){return typeof Notification!="undefined"}function Yt(){return Dt()?Notification.permission:"unsupported"}async function qa(){if(!Dt())return"unsupported";try{return await Notification.requestPermission()}catch{return"denied"}}function Da(t){const e=`${_()} ${t}`;if(de===e)return;de=e;const a="ถึงเวลาฝึกตามโปรแกรมแล้ว เปิดแอปเพื่อเริ่มได้เลย";if(Yt()==="granted")try{new Notification("Saitama Training Tracker",{body:a});return}catch{}$(a,"ok",6e3)}function Fe(){He(),xt=setInterval(()=>{const{settings:t}=T();if(!t.reminderEnabled)return;const e=new Date,a=`${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}`;a===t.workoutTime&&Da(a)},2e4)}function He(){xt&&clearInterval(xt),xt=null}function W(t){return String(t!=null?t:"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ja(t,{size:e=118,stroke:a=11,label:s,caption:n,ok:i=!1}={}){const r=(e-a)/2,l=2*Math.PI*r,c=Math.max(0,Math.min(1,t||0)),d=l*(1-c);return`
    <div class="ring" style="width:${e}px;height:${e}px">
      <svg width="${e}" height="${e}">
        <circle class="track" cx="${e/2}" cy="${e/2}" r="${r}" stroke-width="${a}"/>
        <circle class="bar ${i?"ok":""}" cx="${e/2}" cy="${e/2}" r="${r}"
          stroke-width="${a}" stroke-dasharray="${l.toFixed(1)}" stroke-dashoffset="${d.toFixed(1)}"/>
      </svg>
      <div class="ring-label">
        <div class="ring-value">${s!=null?s:Math.round(c*100)+"%"}</div>
        ${n?`<div class="ring-cap">${n}</div>`:""}
      </div>
    </div>`}function wt(t,e=!1){const a=Math.max(0,Math.min(1,t||0));return`<div class="bar-track"><div class="bar-fill ${e?"ok":""}" style="width:${(a*100).toFixed(1)}%"></div></div>`}function P(t,e,a,s=""){return`
    <div class="stat">
      <div class="stat-top">${u(t)}<span>${e}</span></div>
      <div class="stat-value">${a}${s?`<span class="stat-unit">${s}</span>`:""}</div>
    </div>`}function st(t,e,a="chart",s=""){return`
    <div class="empty">
      ${u(a)}
      <div class="empty-title">${t}</div>
      <div class="small">${e}</div>
      ${s?`<div class="mt-14">${s}</div>`:""}
    </div>`}function E(t,e="info"){return`<div class="note ${e==="warn"?"note-warn":""}">${u(e==="warn"?"alert":"info")}<div>${t}</div></div>`}function Aa(t,e,a="data-pill"){return`<div class="pills">${t.map(s=>`<button class="pill ${String(s.value)===String(e)?"active":""}" ${a}="${s.value}">${s.label}</button>`).join("")}</div>`}function ot(t,e,a="data-seg"){return`<div class="seg">${t.map(s=>`<button class="${String(s.value)===String(e)?"active":""}" ${a}="${s.value}">${s.label}</button>`).join("")}</div>`}function Vt(t,e,{min:a=0,max:s=999,step:n=1}={}){return`
    <div class="stepper" data-stepper="${t}" data-min="${a}" data-max="${s}" data-step="${n}">
      <button type="button" data-dec aria-label="ลด">−</button>
      <input type="number" value="${e}" inputmode="numeric" aria-label="${t}"/>
      <button type="button" data-inc aria-label="เพิ่ม">+</button>
    </div>`}function We(t,e){t.querySelectorAll("[data-stepper]").forEach(a=>{const s=a.querySelector("input"),n=Number(a.dataset.min),i=Number(a.dataset.max),r=Number(a.dataset.step)||1,l=a.dataset.stepper,c=d=>{const o=Math.max(n,Math.min(i,Math.round(Number(d)||0)));s.value=o,e==null||e(l,o,a)};a.querySelector("[data-dec]").addEventListener("click",()=>c(Number(s.value)-r)),a.querySelector("[data-inc]").addEventListener("click",()=>c(Number(s.value)+r)),s.addEventListener("change",()=>c(s.value))})}const q={REPS:"reps",REPS_SIDE:"reps_side",SECONDS:"seconds"},B={pushup:{id:"pushup",name:"วิดพื้น",en:"Push-up",icon:"pushup",unit:q.REPS,muscles:"อก ไหล่ หลังแขน แกนกลางลำตัว",how:["วางมือกว้างกว่าหัวไหล่เล็กน้อย ปลายนิ้วชี้ไปข้างหน้า","เกร็งหน้าท้องและก้น ให้ลำตัวเป็นเส้นตรงจากหัวถึงส้นเท้า","ลดตัวลงจนหน้าอกห่างพื้นประมาณ 1 กำปั้น ศอกทำมุมราว 45 องศากับลำตัว","ดันตัวขึ้นจนแขนเหยียดเกือบสุด หายใจออกตอนดัน"],caution:"อย่าให้สะโพกตกหรือยกสูงเกินไป ถ้าข้อมือเจ็บให้กำหมัดหรือใช้ที่จับวิดพื้น",easier:"เริ่มจากวิดพื้นเอียง (มือวางบนโต๊ะ) หรือคุกเข่า"},incline_pushup:{id:"incline_pushup",name:"วิดพื้นเอียง / คุกเข่า",en:"Incline or Knee Push-up",icon:"incline_pushup",unit:q.REPS,muscles:"อก ไหล่ หลังแขน",how:["วางมือบนโต๊ะ ขอบเตียง หรือขั้นบันได ที่สูงพอให้ควบคุมได้","ลำตัวเป็นเส้นตรง เกร็งแกนกลางไว้ตลอด","ลดตัวลงช้า ๆ 2 วินาที แล้วดันขึ้น 1 วินาที","ยิ่งมือวางต่ำลง ยิ่งหนักขึ้น — ค่อย ๆ ลดความสูงเมื่อแข็งแรงขึ้น"],caution:"เลือกความสูงที่ทำได้ครบเซตโดยฟอร์มยังดี ไม่ต้องรีบลดความสูง",easier:"ยกมือขึ้นไปวางบนพื้นผิวที่สูงกว่าเดิม"},squat:{id:"squat",name:"สควอต",en:"Bodyweight Squat",icon:"squat",unit:q.REPS,muscles:"ต้นขาหน้า ก้น ต้นขาหลัง",how:["ยืนเท้ากว้างเท่าหัวไหล่ ปลายเท้าเฉียงออกเล็กน้อย","ดันสะโพกไปข้างหลังพร้อมย่อเข่า เหมือนกำลังนั่งเก้าอี้","ลงจนต้นขาขนานพื้นเท่าที่ทำได้โดยหลังไม่งอ ส้นเท้าติดพื้นตลอด","ดันพื้นขึ้นมายืน บีบก้นตอนบนสุด"],caution:"ถ้าเข่าเจ็บให้ลดระยะย่อลง และดูว่าเข่าไม่บิดเข้าด้านใน",easier:"นั่งลงบนเก้าอี้แล้วลุกขึ้น (Box Squat)"},glute_bridge:{id:"glute_bridge",name:"พับสะโพก (Glute Bridge)",en:"Glute Bridge",icon:"glute_bridge",unit:q.REPS,muscles:"ก้น ต้นขาหลัง หลังล่าง",how:["นอนหงาย ชันเข่า วางเท้าห่างจากก้นประมาณ 1 ฝ่ามือ","เกร็งหน้าท้อง แล้วดันสะโพกขึ้นด้วยแรงจากก้น","ค้างบนสุด 1–2 วินาที ให้ลำตัวเป็นเส้นตรงจากเข่าถึงไหล่","ลดลงช้า ๆ โดยไม่ให้ก้นแตะพื้นเต็มที่ระหว่างครั้ง"],caution:"อย่าแอ่นหลังล่างเพื่อดันให้สูงขึ้น ใช้แรงก้นเป็นหลัก",easier:"ลดระยะยกลง และหยุดพักระหว่างครั้ง"},dead_bug:{id:"dead_bug",name:"Dead Bug",en:"Dead Bug",icon:"dead_bug",unit:q.REPS_SIDE,muscles:"แกนกลางลำตัว หน้าท้องส่วนลึก",how:["นอนหงาย ยกแขนตรงขึ้นเหนืออก ยกขาขึ้นงอเข่า 90 องศา","กดหลังล่างให้แนบพื้นตลอดเวลา","ค่อย ๆ ยืดแขนข้างหนึ่งไปด้านหลังพร้อมเหยียดขาฝั่งตรงข้ามออก","กลับสู่ท่าเริ่ม แล้วสลับข้าง นับเป็น 1 ครั้งต่อข้าง"],caution:"ถ้าหลังล่างลอยจากพื้น ให้ลดระยะเหยียดลง",easier:"ขยับเฉพาะขา หรือเฉพาะแขน ทีละอย่าง"},calf_raise:{id:"calf_raise",name:"เขย่งน่อง",en:"Calf Raise",icon:"calf_raise",unit:q.REPS,muscles:"น่อง ข้อเท้า",how:["ยืนตรง เท้าห่างกันเท่าสะโพก จับผนังเบา ๆ เพื่อทรงตัว","เขย่งส้นเท้าขึ้นสูงที่สุดเท่าที่ทำได้","ค้าง 1 วินาที แล้วลดลงช้า ๆ 2 วินาที","ทำต่อเนื่องโดยไม่กระแทก"],caution:"ถ้าเอ็นร้อยหวายตึงมาก ให้ลดระยะและยืดหลังฝึก",easier:"ทำโดยจับที่มั่นคงตลอดเวลา"},reverse_lunge:{id:"reverse_lunge",name:"ก้าวขาถอยหลัง",en:"Reverse Lunge",icon:"reverse_lunge",unit:q.REPS_SIDE,muscles:"ต้นขาหน้า ก้น การทรงตัว",how:["ยืนตรง มือเท้าสะโพกหรือกางออกเพื่อทรงตัว","ก้าวเท้าข้างหนึ่งถอยหลัง แล้วย่อลงจนเข่าหลังเกือบแตะพื้น","เข่าหน้าอยู่เหนือข้อเท้า ลำตัวตั้งตรง","ดันเท้าหน้ากลับมายืน แล้วสลับข้าง"],caution:"ถ้าทรงตัวไม่ดี ให้จับผนังหรือเก้าอี้ไว้",easier:"ลดระยะย่อลง หรือทำ Split Squat โดยไม่ต้องก้าว"},hip_hinge:{id:"hip_hinge",name:"พับสะโพกยืน (Hip Hinge)",en:"Standing Hip Hinge",icon:"hip_hinge",unit:q.REPS,muscles:"ต้นขาหลัง ก้น หลังล่าง",how:["ยืนเท้ากว้างเท่าสะโพก เข่างอเล็กน้อยและคงไว้","ดันสะโพกไปด้านหลัง ก้มลำตัวลงโดยหลังตรงเสมอ","รู้สึกตึงที่ต้นขาหลัง ลงเท่าที่หลังยังตรงอยู่","บีบก้นเพื่อดันสะโพกกลับมายืนตรง"],caution:"ห้ามงอหลัง — ถ้าหลังเริ่มโค้งให้หยุดที่ระยะนั้น",easier:"ใช้ไม้กวาดทาบหลังเป็นแนวอ้างอิงให้หลังตรง"},bird_dog:{id:"bird_dog",name:"Bird Dog",en:"Bird Dog",icon:"bird_dog",unit:q.REPS_SIDE,muscles:"แกนกลางลำตัว หลัง ก้น",how:["คุกเข่าสี่ขา มือใต้ไหล่ เข่าใต้สะโพก","เกร็งหน้าท้อง หลังเป็นเส้นตรง","เหยียดแขนข้างหนึ่งไปข้างหน้าพร้อมเหยียดขาฝั่งตรงข้ามไปข้างหลัง","ค้าง 2 วินาที กลับท่าเริ่ม แล้วสลับข้าง"],caution:"อย่าบิดสะโพก ให้สะโพกขนานพื้นตลอด",easier:"ยกเฉพาะแขน หรือเฉพาะขา ทีละอย่าง"},plank:{id:"plank",name:"แพลงก์",en:"Plank",icon:"plank",unit:q.SECONDS,muscles:"แกนกลางลำตัว ไหล่ ก้น",how:["วางศอกใต้หัวไหล่ ปลายเท้ายันพื้น","เกร็งหน้าท้องและก้น ลำตัวเป็นเส้นตรง","มองพื้นตรงหน้ามือ คอไม่เงย","หายใจสม่ำเสมอ ห้ามกลั้นหายใจ"],caution:"ถ้าหลังล่างเริ่มแอ่นหรือสั่นมาก ให้หยุดแล้วพัก คุณภาพสำคัญกว่าเวลา",easier:"แพลงก์โดยวางเข่าลงพื้น หรือวางศอกบนโต๊ะ"},stretch:{id:"stretch",name:"ยืดเหยียด",en:"Stretching",icon:"stretch",unit:q.SECONDS,muscles:"ทั้งตัว",how:["ยืดกล้ามเนื้อมัดใหญ่ทีละมัด มัดละ 20–30 วินาที","ยืดจนรู้สึกตึงพอดี ไม่ถึงกับเจ็บ","หายใจเข้าออกช้า ๆ ห้ามเด้งหรือกระตุก"],caution:"วันพักควรยืดแบบเบา ๆ ไม่ต้องฝืน",easier:"—"}},Na=["เดินอยู่กับที่หรือเดินเร็ว 3 นาที","หมุนไหล่ไปหน้า-หลัง อย่างละ 10 รอบ","หมุนสะโพกและข้อเท้า ข้างละ 10 รอบ","สควอตเปล่า 10 ครั้ง และ Glute Bridge 10 ครั้ง"],Pa=["เดินช้า ๆ ให้ชีพจรลดลง 2–3 นาที","ยืดต้นขาหน้า ต้นขาหลัง น่อง ข้างละ 20–30 วินาที","ยืดอกและไหล่ 20–30 วินาที","หายใจลึก ๆ 5 รอบ"];function ut(t){const e=(t==null?void 0:t.unit)||q.REPS;return e===q.SECONDS?"วินาที":e===q.REPS_SIDE?"ครั้ง/ข้าง":"ครั้ง"}const S=12,Xt={1:{pushup:[6,6],squat:[10,10],sets:2,focus:"สร้างพื้นฐานให้แข็งแรง"},2:{pushup:[8,8],squat:[12,12],sets:2,focus:"เพิ่มปริมาณอย่างค่อยเป็นค่อยไป"},3:{pushup:[8,10],squat:[15,15],sets:2,focus:"คุ้นเคยกับฟอร์มที่ถูกต้อง"},4:{pushup:[8,8],squat:[12,12],sets:2,deload:!0,focus:"สัปดาห์ฟื้นตัว ลดความหนัก"},5:{pushup:[8,10],squat:[15,15],sets:3,focus:"เพิ่มเป็น 3 เซต"},6:{pushup:[10,12],squat:[15,15],sets:3,focus:"เพิ่มความแข็งแรงต่อเนื่อง"},7:{pushup:[12,12],squat:[18,18],sets:3,focus:"ท้าทายขึ้นอีกขั้น"},8:{pushup:[10,10],squat:[15,15],sets:2,deload:!0,focus:"สัปดาห์ฟื้นตัว ลดความหนัก"},9:{pushup:[12,12],squat:[20,20],sets:3,focus:"กลับเข้าสู่ปริมาณเต็ม"},10:{pushup:[12,15],squat:[20,20],sets:3,focus:"สะสมความอึด"},11:{pushup:[15,15],squat:[20,25],sets:3,focus:"เข้าใกล้เป้าหมาย"},12:{pushup:[15,20],squat:[25,25],sets:3,focus:"สัปดาห์สุดท้าย เก็บให้ครบ"}},Ta={glute_bridge:[12,15],calf_raise:[12,20],dead_bug:[8,12],bird_dog:[8,12],reverse_lunge:[6,10],hip_hinge:[10,15],incline_pushup:[8,20],plank:[15,40]},At={runningA_rounds:[6,12],runningB_minutes:[20,35],longRun_km:[2,6]};function lt(t){var e;return!!((e=Xt[t])!=null&&e.deload)}function Qt(t){var e;return((e=Xt[t])==null?void 0:e.focus)||""}function Ra(t){return lt(t)?Math.max(1,t-2):t}function Mt(t,[e,a],s=1){const n=Ra(t),i=e+(a-e)*(n-1)/(S-1);return Math.max(s,Math.round(i/s)*s)}function oe(t,e,a=1){var n;const s=(n=ke[e])!=null?n:1;return Math.max(a,Math.round(t*s))}function Ia(t,e,a){const s=t.unit,n=e===a?`${e}`:`${e}–${a}`;return s===q.SECONDS?`${n} วินาที`:s===q.REPS_SIDE?`${n} ครั้ง/ข้าง`:`${n} ครั้ง`}function Ca(t,e,a,s,n){const i=Xt[t],r=(s==null?void 0:s.difficulty)||"standard",l=i.sets;return a.map(c=>{const d=B[c];let o,p;if(c==="pushup")[o,p]=i.pushup;else if(c==="squat")[o,p]=i.squat;else{const w=c==="plank"?5:1;o=Mt(t,Ta[c]||[8,12],w),p=o}o=oe(o,r,d.unit===q.SECONDS?10:1),p=oe(p,r,d.unit===q.SECONDS?10:1);let v=o,f=l;const h=n==null?void 0:n[`${t}:${e}:${c}`];return h&&(Number.isFinite(h.reps)&&(v=h.reps,o=h.reps,p=h.reps),Number.isFinite(h.sets)&&(f=h.sets)),{id:c,name:d.name,icon:d.icon,unit:d.unit,reps:v,repsHigh:p,repsLabel:Ia(d,o,p),sets:f,customized:!!h}})}function Ba(t,e,a){var r;const s=(a==null?void 0:a.difficulty)||"standard",n=(r=ke[s])!=null?r:1;if(e==="RunningA"){const l=Math.max(3,Math.round(Mt(t,At.runningA_rounds)*n));return{mode:"intervals",rounds:l,runMin:1,walkMin:2,estMinutes:l*3+8,summary:`วิ่ง 1 นาที / เดิน 2 นาที × ${l} รอบ`,note:"เน้นสร้างพื้นฐานความอึด ควรยังพูดเป็นประโยคสั้น ๆ ได้ระหว่างวิ่ง"}}if(e==="RunningB"){const l=Math.max(10,Math.round(Mt(t,At.runningB_minutes)*n));return{mode:"easy",minutes:l,estMinutes:l+8,summary:`วิ่งเบาหรือเดินเร็วต่อเนื่อง ${l} นาที`,note:"เน้นความต่อเนื่อง ไม่ต้องเร่งความเร็ว"}}const i=Math.max(1,Math.round(Mt(t,At.longRun_km,1)*n*2)/2);return{mode:"long",distanceKm:i,estMinutes:Math.round(i*9)+10,summary:`วิ่งหรือเดินระยะยาว ประมาณ ${i} กม.`,note:"สลับวิ่ง-เดินได้ตามสภาพร่างกาย เป้าหมายคือระยะทางและความต่อเนื่อง"}}const Ka=[{planKey:"StrengthA",type:"strength",title:"Strength A",subtitle:"ฝึกความแข็งแรง — ทั้งตัว",exercises:["pushup","squat","glute_bridge","dead_bug","calf_raise"]},{planKey:"RunningA",type:"running",title:"Running A",subtitle:"วิ่งสลับเดิน — สร้างพื้นฐาน"},{planKey:"StrengthB",type:"strength",title:"Strength B",subtitle:"ฝึกความแข็งแรง — แกนกลางและขา",exercises:["incline_pushup","reverse_lunge","hip_hinge","bird_dog","plank"]},{planKey:"RunningB",type:"running",title:"Running B",subtitle:"วิ่งเบา — เน้นความต่อเนื่อง"},{planKey:"StrengthC",type:"strength",title:"Strength C",subtitle:"ฝึกความแข็งแรง — เก็บรายละเอียด",exercises:["pushup","squat","reverse_lunge","glute_bridge","plank"]},{planKey:"LongRun",type:"running",title:"Long Run / Walk",subtitle:"ระยะยาว — เน้นความอึด"},{planKey:"Rest",type:"rest",title:"วันพัก",subtitle:"ฟื้นตัว — ยืดเหยียดเบา ๆ ได้"}];function X(t,e,a,s){var r;const n=Ka[e];if(!n)return null;const i={week:t,dayIndex:e,planKey:n.planKey,type:n.type,title:n.title,subtitle:n.subtitle,deload:lt(t)};if(n.type==="strength"){const l=Ca(t,n.planKey,n.exercises,a,s),c=l.reduce((p,v)=>p+v.sets,0),d=(r=a==null?void 0:a.restSeconds)!=null?r:60,o=Math.round(c*(45+d)/60)+10;return{...i,exercises:l,estMinutes:o,restSeconds:d}}if(n.type==="running"){const l=Ba(t,n.planKey,a);return{...i,run:l,estMinutes:l.estMinutes}}return{...i,estMinutes:15,restActivities:["เดินเบา ๆ 10–15 นาที","ยืดเหยียดกล้ามเนื้อมัดใหญ่ มัดละ 20–30 วินาที","นอนให้พอ — การฟื้นตัวคือส่วนหนึ่งของการฝึก"]}}function Ve(t,e,a){return Array.from({length:7},(s,n)=>X(t,n,e,a))}function U(t,e){const a=ft(e,t),s=Math.floor(a/7)+1,n=a>=0?a%7:ye(t);return{week:s,dayIndex:n,offsetDays:a,inProgram:a>=0&&s>=1&&s<=S}}function ze(t){return(t-1)*7}function Zt(t,e){const a={date:t,week:e.week,planKey:e.planKey,type:e.type,title:e.title,status:"in_progress",startedAt:new Date().toISOString(),completedAt:null,elapsedSec:0,exercises:[],run:null,rpe:null,note:""};return e.type==="strength"&&(a.exercises=e.exercises.map(s=>({id:s.id,name:s.name,icon:s.icon,unit:s.unit,targetReps:s.reps,targetSets:s.sets,repsDone:Array.from({length:s.sets},()=>null),done:!1}))),a}function Fa(t){if(!t)return 0;if(t.type==="strength"){const e=t.exercises.length||1;return t.exercises.filter(s=>s.done).length/e}return t.type==="running"?t.status==="completed"?1:t.run?.5:0:t.status==="completed"?1:0}function jt(t){return!t||t.type!=="strength"?0:t.exercises.reduce((e,a)=>a.unit===q.SECONDS?e:e+a.repsDone.reduce((s,n)=>s+(Number(n)||0),0),0)}function Ue(t){var e;return t?t.type==="running"?Number((e=t.run)==null?void 0:e.durationSec)||0:Number(t.elapsedSec)||0:0}function Ge(t){var e;return!t||t.type!=="running"?0:Number((e=t.run)==null?void 0:e.distanceKm)||0}function Ha(t,e=_()){const a=t.settings.startDate,s=ft(a,e);if(s<0)return 0;const n=Math.min(s,S*7-1);let i=0;for(let r=0;r<=n;r++)r%7!==6&&i++;return i}const Je=S*6;function gt(t){return Object.values(t.sessions).filter(e=>e.status==="completed"&&e.type!=="rest").length}function Wa(t){return Math.min(1,gt(t)/Je)}function Ye(t){const e=Ha(t);if(e<=0)return 0;const a=Object.values(t.sessions).filter(s=>s.status!=="completed"||s.type==="rest"?!1:ft(t.settings.startDate,s.date)<=ft(t.settings.startDate,_())).length;return Math.min(1,a/e)}function Ot(t){const e=t.settings.startDate;let a=_(),s=0;for(let n=0;n<400;n++){const i=U(a,e);if(!i.inProgram)break;const r=X(i.week,i.dayIndex,t.settings,t.programOverrides),l=t.sessions[a];if(r&&r.type==="rest"){a=G(a,-1);continue}if(l&&l.status==="completed")s++;else if(a!==_())break;a=G(a,-1)}return s}function Xe(t){const e=Object.values(t.sessions).filter(n=>n.status==="completed"&&n.type!=="rest").map(n=>n.date).sort();if(!e.length)return 0;let a=1,s=1;for(let n=1;n<e.length;n++){const i=ft(e[n-1],e[n]);i===1||i===2?s++:s=1,a=Math.max(a,s)}return a}function Va(t){return Object.values(t.sessions).filter(e=>e.status==="completed").reduce((e,a)=>e+Ue(a),0)}function St(t){return Object.values(t.sessions).filter(e=>e.status==="completed").reduce((e,a)=>e+Ge(a),0)}function Qe(t){return Object.values(t.sessions).filter(e=>e.type==="running"&&e.status==="completed"&&e.run).sort((e,a)=>e.date<a.date?-1:1)}function Ze(t){const e=Qe(t),a=e.reduce((i,r)=>i+(Number(r.run.distanceKm)||0),0),s=e.reduce((i,r)=>i+(Number(r.run.durationSec)||0),0),n=e.reduce((i,r)=>Math.max(i,Number(r.run.distanceKm)||0),0);return{count:e.length,totalKm:a,totalSec:s,bestKm:n,avgPaceSec:a>0?s/a:0}}function _t(t){var a;const e={};for(const s of Object.values(t.sessions))if(!(s.type!=="strength"||!Array.isArray(s.exercises)))for(const n of s.exercises){const i=n.repsDone.reduce((r,l)=>Math.max(r,Number(l)||0),0);i>0&&i>(((a=e[n.id])==null?void 0:a.value)||0)&&(e[n.id]={value:i,date:s.date,unit:n.unit,name:n.name})}return e}function za(t,e){const a=[];for(const s of Object.values(t.sessions)){if(s.type!=="strength"||s.status!=="completed")continue;const n=(s.exercises||[]).find(r=>r.id===e);if(!n)continue;const i=n.repsDone.reduce((r,l)=>Math.max(r,Number(l)||0),0);i>0&&a.push({date:s.date,value:i})}return a.sort((s,n)=>s.date<n.date?-1:1)}function Ua(t){const e=Array.from({length:S},(a,s)=>({week:s+1,value:0}));for(const a of Object.values(t.sessions)){if(a.type!=="running"||a.status!=="completed"||!a.run)continue;const s=U(a.date,t.settings.startDate);s.week>=1&&s.week<=S&&(e[s.week-1].value+=Number(a.run.distanceKm)||0)}return e}function te(t){const e=Array.from({length:S},(a,s)=>({week:s+1,value:0}));for(const a of Object.values(t.sessions)){if(a.status!=="completed"||a.type==="rest")continue;const s=U(a.date,t.settings.startDate);s.week>=1&&s.week<=S&&(e[s.week-1].value+=1)}return e}function ue(t,e){if(e==="all")return t;const a=Number(e)||7,s=G(_(),-(a-1));return t.filter(n=>n.date>=s)}function Ga(t){const e=_(),a=U(e,t.settings.startDate),s=Math.min(Math.max(a.week,1),S),n=a.inProgram?X(a.week,a.dayIndex,t.settings,t.programOverrides):null;return{today:e,loc:a,plan:n,week:s,notStarted:a.offsetDays<0,finished:a.week>S,session:t.sessions[e]||null,programPct:Wa(t),completedDays:gt(t),totalDays:Je,streak:Ot(t),totalSeconds:Va(t),totalKm:St(t),successRate:Ye(t),weeksLeft:Math.max(0,S-s)}}function Ja(t,e){return{title:`สวัสดี ${e.profile.name}`,subtitle:H(_()),right:`<button class="icon-btn" data-toggle-theme aria-label="สลับธีม">${u(e.settings.theme==="light"?"moon":"sun")}</button>`}}function Ya(t,e){var c,d;if(t.notStarted)return`<div class="today-card">
      <div class="today-type">
        <div class="ex-icon">${u("calendar")}</div>
        <div class="grow">
          <div class="bold">โปรแกรมยังไม่เริ่ม</div>
          <div class="small muted">จะเริ่มวันที่ ${H(e.settings.startDate)}</div>
        </div>
      </div>
      <button class="btn btn-ghost btn-block mt-14" data-nav="/settings">เปลี่ยนวันเริ่มโปรแกรม</button>
    </div>`;if(t.finished)return`<div class="today-card">
      <div class="today-type">
        <div class="ex-icon">${u("trophy")}</div>
        <div class="grow">
          <div class="bold">จบโปรแกรม 12 สัปดาห์แล้ว</div>
          <div class="small muted">ฝึกสำเร็จ ${t.completedDays} จาก ${t.totalDays} วัน</div>
        </div>
      </div>
      <div class="row mt-14" style="gap:10px">
        <button class="btn btn-ghost grow" data-nav="/stats">ดูสถิติ</button>
        <button class="btn btn-primary grow" data-nav="/settings">เริ่มรอบใหม่</button>
      </div>
    </div>`;const a=t.plan,s=t.session,n=(s==null?void 0:s.status)==="completed",i=s&&s.status==="in_progress";if(a.type==="rest")return`<div class="today-card">
      <div class="today-type">
        <div class="ex-icon">${C("rest")}</div>
        <div class="grow">
          <div class="bold">วันนี้: วันพัก</div>
          <div class="small muted">ฟื้นตัวคือส่วนหนึ่งของการฝึก</div>
        </div>
        ${n?`<span class="badge badge-success">${u("check")} บันทึกแล้ว</span>`:""}
      </div>
      <ul class="small muted mt-14" style="margin:0;padding-left:18px;line-height:1.8">
        ${a.restActivities.map(o=>`<li>${o}</li>`).join("")}
      </ul>
      <button class="btn ${n?"btn-ghost":"btn-primary"} btn-block mt-14" data-nav="/workout">
        ${u(n?"edit":"check")} ${n?"แก้ไขบันทึกวันพัก":"บันทึกกิจกรรมวันพัก"}
      </button>
    </div>`;const r=a.type==="running"?a.run.summary:`${a.exercises.length} ท่า · ประมาณ ${a.estMinutes} นาที`,l=a.type==="running"?"/running":"/workout";return`<div class="today-card">
    <div class="today-type">
      <div class="ex-icon">${C(a.type==="running"?"run":"pushup")}</div>
      <div class="grow">
        <div class="bold">วันนี้: ${a.title}</div>
        <div class="small muted">${r}</div>
      </div>
      ${n?`<span class="badge badge-success">${u("check")} สำเร็จ</span>`:i?'<span class="badge badge-warn">กำลังทำ</span>':""}
    </div>

    ${a.type==="strength"?`<div class="mt-14">${wt((((c=s==null?void 0:s.exercises)==null?void 0:c.filter(o=>o.done).length)||0)/(a.exercises.length||1),n)}
           <div class="small muted mt-8">ทำแล้ว ${((d=s==null?void 0:s.exercises)==null?void 0:d.filter(o=>o.done).length)||0} จาก ${a.exercises.length} ท่า</div></div>`:""}

    <div class="row mt-14" style="gap:10px">
      <button class="btn btn-ghost" data-nav="/warmup" title="วอร์มอัปก่อนฝึก">
        ${u("heart")} วอร์มอัป
      </button>
      <button class="btn ${n?"btn-ghost":"btn-primary"} grow" data-nav="${l}">
        ${u(n?"edit":"play")}
        ${n?"ดู / แก้ไขผล":i?"ฝึกต่อ":"เริ่มฝึกวันนี้"}
      </button>
    </div>
  </div>`}function Xa(t){const e=$e(_()),a=_();return`<div class="week-dots">
    ${e.map(s=>{const n=U(s,t.settings.startDate),i=n.inProgram?X(n.week,n.dayIndex,t.settings,t.programOverrides):null,r=t.sessions[s],l=s===a,c=(r==null?void 0:r.status)==="completed",d=(i==null?void 0:i.type)==="rest",o=!c&&!d&&s<a&&n.inProgram,p=["wd",c?"done":"",d?"rest":"",l?"today":"",o?"missed":""].filter(Boolean).join(" "),v=c?u("check"):d?"":o?"!":String(ct(s).getDate());return`<div class="${p}" title="${H(s)}">
          <div class="wd-day">${Ut[Gt(s)]}</div>
          <div class="wd-mark">${v}</div>
        </div>`}).join("")}
  </div>`}function Qa(t,e){const a=Ga(e),s=a.week,n=Qt(s);return`<div class="page">
    <div class="hero">
      <div class="hero-left">
        ${ja(a.programPct,{size:124,caption:"ความคืบหน้า",ok:a.programPct>=1})}
        <div>
          <div class="small muted">สัปดาห์ที่</div>
          <div class="hero-week">${Math.min(s,S)} <span>/ ${S}</span></div>
          <div class="small muted mt-8">
            ${a.finished?"จบโปรแกรมแล้ว":`เหลืออีก ${a.weeksLeft} สัปดาห์`}
          </div>
          ${lt(s)&&!a.finished?'<span class="badge badge-warn mt-8">สัปดาห์ฟื้นตัว (Deload)</span>':""}
        </div>
      </div>
      <div class="hero-side">
        <div class="mini-stat">${u("calendar")}<div class="grow"><div class="tiny muted">ฝึกสำเร็จ</div><b>${a.completedDays} / ${a.totalDays} วัน</b></div></div>
        <div class="mini-stat">${u("flame")}<div class="grow"><div class="tiny muted">ฝึกต่อเนื่อง</div><b>${a.streak} วัน</b></div></div>
        <div class="mini-stat">${u("clock")}<div class="grow"><div class="tiny muted">เวลาฝึกสะสม</div><b>${dt(a.totalSeconds)}</b></div></div>
      </div>
    </div>

    ${n&&!a.finished?`<p class="small muted mt-14">โฟกัสสัปดาห์นี้: ${n}</p>`:""}

    <div class="section-title">การฝึกวันนี้</div>
    ${Ya(a,e)}

    <div class="section-title">
      สัปดาห์นี้
      <button class="link" data-nav="/program">ดูทั้งโปรแกรม</button>
    </div>
    ${Xa(e)}

    <div class="section-title">ภาพรวม</div>
    <div class="grid g2">
      ${P("target","อัตราการฝึกสำเร็จ",Math.round(a.successRate*100),"%")}
      ${P("road","ระยะทางวิ่งสะสม",a.totalKm.toFixed(1),"กม.")}
      ${P("flame","สตรีคดีที่สุด",Xe(e),"วัน")}
      ${P("trophy","ความสำเร็จที่ปลดล็อก",Object.keys(e.achievements).length,"รายการ")}
    </div>

    <div class="section-title">ทางลัด</div>
    <div class="grid g4">
      <button class="card card-click center shortcut" data-nav="/warmup">
        ${u("heart")}<div class="small bold mt-8">วอร์มอัป & ยืดเหยียด</div>
      </button>
      <button class="card card-click center shortcut" data-nav="/running">
        ${u("run")}<div class="small bold mt-8">บันทึกการวิ่ง</div>
      </button>
      <button class="card card-click center shortcut" data-nav="/history">
        ${u("history")}<div class="small bold mt-8">ประวัติการฝึก</div>
      </button>
      <button class="card card-click center shortcut" data-nav="/achievements">
        ${u("trophy")}<div class="small bold mt-8">ความสำเร็จ</div>
      </button>
    </div>

    <div class="mt-20">
      ${E('วอร์มอัปก่อนฝึกทุกครั้ง และคูลดาวน์หลังฝึก หากเจ็บแปลบ เจ็บข้อ หรือเหนื่อยผิดปกติ ให้หยุดและพัก — แอปนี้เป็นเครื่องมือติดตามผล ไม่ใช่คำแนะนำทางการแพทย์ <button class="link" data-nav="/guide" style="background:none;border:none;padding:0;cursor:pointer">อ่านคำแนะนำ</button>')}
    </div>
  </div>`}function Za(t,e,a){var s;(s=document.querySelector("[data-toggle-theme]"))==null||s.addEventListener("click",()=>{const i=T().settings.theme==="light"?"dark":"light";N(r=>{r.settings.theme=i}),Z(i),a.rerender()}),t.querySelectorAll(".wd").forEach((n,i)=>{n.addEventListener("click",()=>{const r=$e(_());D("/workout",{date:r[i]})})})}const ta=Object.freeze(Object.defineProperty({__proto__:null,addDays:G,header:Ja,mount:Za,view:Qa},Symbol.toStringTag,{value:"Module"})),ee=()=>document.getElementById("modal-root");let bt=null;function at(){const t=ee();t&&(t.innerHTML=""),bt&&(document.removeEventListener("keydown",bt),bt=null),document.body.style.overflow=""}function Q(t){var i,r,l;const e=ee();if(!e)return;at();const a=t.actions||[];e.innerHTML=`
    <div class="modal-backdrop" data-backdrop>
      <div class="modal" role="dialog" aria-modal="true">
        ${t.title?`<div class="row-between" style="margin-bottom:12px">
                 <div>
                   <div class="modal-title">${t.title}</div>
                   ${t.subtitle?`<div class="small muted">${t.subtitle}</div>`:""}
                 </div>
                 <button class="icon-btn" data-close aria-label="ปิด">${u("x")}</button>
               </div>`:""}
        <div data-modal-body>${t.body||""}</div>
        ${a.length?`<div class="modal-actions">${a.map((c,d)=>`<button class="btn ${c.cls||"btn-ghost"}" data-act="${d}">${c.label}</button>`).join("")}</div>`:""}
      </div>
    </div>`,document.body.style.overflow="hidden";const s=e.querySelector("[data-backdrop]");t.dismissible!==!1?(s.addEventListener("click",c=>{c.target===s&&at()}),(i=e.querySelector("[data-close]"))==null||i.addEventListener("click",at),bt=c=>{c.key==="Escape"&&at()},document.addEventListener("keydown",bt)):(r=e.querySelector("[data-close]"))==null||r.remove(),e.querySelectorAll("[data-act]").forEach(c=>{c.addEventListener("click",()=>{var p;const d=a[Number(c.dataset.act)];((p=d==null?void 0:d.onClick)==null?void 0:p.call(d,e.querySelector("[data-modal-body]")))||at()})}),(l=t.onMount)==null||l.call(t,e.querySelector("[data-modal-body]"),{close:at})}function V({title:t,message:e,confirmLabel:a="ยืนยัน",cancelLabel:s="ยกเลิก",danger:n=!1}){return new Promise(i=>{Q({title:t,body:`<p class="small muted" style="line-height:1.6">${e}</p>`,actions:[{label:s,cls:"btn-ghost",onClick:()=>i(!1)},{label:a,cls:"btn-primary",onClick:()=>i(!0)}]});const r=ee(),l=new MutationObserver(()=>{r.querySelector(".modal-backdrop")||(l.disconnect(),i(!1))});l.observe(r,{childList:!0,subtree:!0})})}const it=[{id:"first_workout",name:"ก้าวแรก",desc:"ฝึกสำเร็จเป็นครั้งแรก",icon:"play",test:t=>gt(t)>=1},{id:"streak_3",name:"ต่อเนื่อง 3 วัน",desc:"ฝึกต่อเนื่องครบ 3 วัน",icon:"flame",test:t=>Ot(t)>=3},{id:"streak_7",name:"ต่อเนื่อง 7 วัน",desc:"ฝึกต่อเนื่องครบ 7 วัน",icon:"flame",test:t=>Ot(t)>=7},{id:"first_run",name:"วิ่งครั้งแรก",desc:"บันทึกการวิ่งเป็นครั้งแรก",icon:"run",test:t=>Qe(t).length>=1},{id:"club_5k",name:"5 KM Club",desc:"วิ่งสะสมครบ 5 กิโลเมตร",icon:"road",test:t=>St(t)>=5},{id:"club_10k",name:"10 KM Club",desc:"วิ่งสะสมครบ 10 กิโลเมตร",icon:"road",test:t=>St(t)>=10},{id:"club_25k",name:"25 KM Club",desc:"วิ่งสะสมครบ 25 กิโลเมตร",icon:"road",test:t=>St(t)>=25},{id:"pushup_15",name:"วิดพื้น 15 ครั้ง",desc:"ทำวิดพื้นได้ 15 ครั้งในหนึ่งเซต",icon:"dumbbell",test:t=>{var e;return(((e=_t(t).pushup)==null?void 0:e.value)||0)>=15}},{id:"pushup_25",name:"วิดพื้น 25 ครั้ง",desc:"ทำวิดพื้นได้ 25 ครั้งในหนึ่งเซต",icon:"dumbbell",test:t=>{var e;return(((e=_t(t).pushup)==null?void 0:e.value)||0)>=25}},{id:"plank_60",name:"แพลงก์ 1 นาที",desc:"ค้างแพลงก์ได้ 60 วินาที",icon:"clock",test:t=>{var e;return(((e=_t(t).plank)==null?void 0:e.value)||0)>=60}},{id:"week_complete",name:"ครบหนึ่งสัปดาห์",desc:"ฝึกครบทั้ง 6 วันในสัปดาห์เดียว",icon:"calendar",test:t=>te(t).some(e=>e.value>=6)},{id:"half_way",name:"ครึ่งทาง",desc:"ฝึกสำเร็จครบ 36 วัน",icon:"target",test:t=>gt(t)>=36},{id:"program_complete",name:"จบโปรแกรม 12 สัปดาห์",desc:`ฝึกสำเร็จครบ ${S*6} วัน`,icon:"trophy",test:t=>gt(t)>=S*6}];function ea(t){const e=[];for(const a of it){if(t.achievements[a.id])continue;let s=!1;try{s=a.test(t)}catch(n){console.error("[achievements] test error",a.id,n)}s&&(t.achievements[a.id]=new Date().toISOString(),e.push(a))}return e}const I={id:null,running:!1,date:null,tick:0};function rt(){I.id&&clearInterval(I.id),I.id=null,I.running=!1}function aa(t){const e=K(t);e&&N(a=>{a.sessions[t]=e},{silent:!0})}function Nt(t,e){rt(),I.running=!0,I.date=t,I.id=setInterval(()=>{const a=K(t);if(!a||a.status==="completed"){rt();return}a.elapsedSec=(a.elapsedSec||0)+1,I.tick++,I.tick%10===0&&aa(t),e==null||e(a.elapsedSec)},1e3)}function ts(t,e){const a=t.date||_();return{title:"การฝึกประจำวัน",subtitle:H(a),back:"/",right:`<button class="icon-btn" data-warmup aria-label="วอร์มอัปและยืดเหยียด">${u("heart")}</button>`}}function es(t,e){return`<div class="page">
    <div class="card">
      <b>วันที่นี้อยู่นอกช่วงโปรแกรม 12 สัปดาห์</b>
      <p class="small muted mt-8">
        ${e.offsetDays<0?"โปรแกรมยังไม่เริ่มในวันนี้":`โปรแกรมมีทั้งหมด ${S} สัปดาห์`}
      </p>
      <div class="row mt-14" style="gap:10px">
        <button class="btn btn-ghost grow" data-nav="/">กลับหน้าหลัก</button>
        <button class="btn btn-primary grow" data-nav="/settings">ตั้งค่าโปรแกรม</button>
      </div>
    </div>
  </div>`}function as(t,e,a){const s=(a==null?void 0:a.status)==="completed";return`<div class="page">
    <div class="card card-lg">
      <div class="today-type">
        <div class="ex-icon">${C("rest")}</div>
        <div class="grow">
          <div class="bold">วันพัก</div>
          <div class="small muted">สัปดาห์ที่ ${e.week} · วันอาทิตย์</div>
        </div>
        ${s?`<span class="badge badge-success">${u("check")} บันทึกแล้ว</span>`:""}
      </div>
      <ul class="small muted mt-14" style="margin:0;padding-left:18px;line-height:1.9">
        ${e.restActivities.map(n=>`<li>${n}</li>`).join("")}
      </ul>
    </div>

    <div class="card mt-14">
      <label class="label">บันทึกกิจกรรมวันพัก (ไม่บังคับ)</label>
      <textarea class="textarea" data-rest-note placeholder="เช่น ยืดเหยียด 10 นาที เดินเล่นตอนเย็น">${W((a==null?void 0:a.note)||"")}</textarea>
      <div class="row mt-14" style="gap:10px">
        ${s?`<button class="btn btn-ghost grow" data-rest-delete>${u("trash")} ลบบันทึก</button>`:""}
        <button class="btn btn-primary grow" data-rest-save>${u("save")} บันทึก</button>
      </div>
    </div>

    ${E("วันพักคือส่วนหนึ่งของโปรแกรม ไม่ต้องรู้สึกผิดที่ไม่ได้ฝึก กล้ามเนื้อเติบโตตอนพัก")}
  </div>`}function ss(t,e){const a=B[t.id];return t.repsDone.filter(s=>Number(s)>0).length,`
    <div class="ex-row ${t.done?"done":""}" data-ex="${e}">
      <div class="ex-icon">${C(t.icon)}</div>
      <div class="grow">
        <div class="ex-name">${t.name}</div>
        <div class="ex-meta">
          เป้าหมาย ${t.targetReps} ${ut(a)} × ${t.targetSets} เซต
        </div>
        <div class="set-chips">
          ${t.repsDone.map((s,n)=>`<button class="set-chip ${Number(s)>0?"on":""}" data-set="${e}:${n}">
                   เซต ${n+1}<br><b>${Number(s)>0?s:"—"}</b>
                 </button>`).join("")}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center">
        <button class="check ${t.done?"on":""}" data-check="${e}" aria-label="ทำสำเร็จ">${u("check")}</button>
        <button class="icon-btn" style="width:28px;height:28px;flex:0 0 28px" data-detail="${e}" aria-label="รายละเอียดท่า">${u("info")}</button>
      </div>
    </div>`}function ns(t,e,a,s){var d;const n=!!a,i=(a==null?void 0:a.status)==="completed",r=Fa(a),l=a?a.exercises.filter(o=>o.done).length:0,c=a?a.exercises:e.exercises.map(o=>({id:o.id,name:o.name,icon:o.icon,unit:o.unit,targetReps:o.reps,targetSets:o.sets,repsDone:Array.from({length:o.sets},()=>null),done:!1}));return`<div class="page">
    ${e.deload?`<div class="mt-8">${E("สัปดาห์นี้เป็นสัปดาห์ฟื้นตัว (Deload) — ตั้งใจลดความหนักลงเพื่อให้ร่างกายซ่อมแซมตัวเอง","warn")}</div>`:""}

    <div class="timer-box">
      <div>
        <div class="small muted">${e.title} · สัปดาห์ที่ ${e.week}</div>
        <div class="timer-val" data-timer>${F((a==null?void 0:a.elapsedSec)||0)}</div>
        <div class="small muted">ทำแล้ว ${l} / ${c.length} ท่า · ประมาณ ${e.estMinutes} นาที</div>
      </div>
      <div class="row" style="gap:8px">
        ${i?`<span class="badge badge-success">${u("check")} ฝึกสำเร็จแล้ว</span>`:n?`<button class="btn btn-ghost" data-toggle-timer>${u(I.running?"pause":"play")} <span>${I.running?"พัก":"ฝึกต่อ"}</span></button>`:`<button class="btn btn-primary" data-start>${u("play")} เริ่มฝึก</button>`}
      </div>
    </div>

    <div class="mt-14">${wt(r,i)}</div>

    <div class="section-title">ท่าออกกำลังกาย</div>
    <div class="card">
      ${c.map((o,p)=>ss(o,p)).join("")}
      <div class="small muted mt-14 center">
        ${u("clock")} พักระหว่างเซต ${e.restSeconds} วินาที
        <button class="link" data-rest-start style="background:none;border:none;cursor:pointer;margin-left:6px">เริ่มจับเวลาพัก</button>
      </div>
    </div>

    ${n&&!i?`<div class="card mt-14">
            <div class="card-head">${u("heart")} ความรู้สึกหลังฝึก</div>
            ${ot([{value:1,label:"สบาย"},{value:2,label:"กำลังดี"},{value:3,label:"เหนื่อย"},{value:4,label:"หนักมาก"},{value:5,label:"ล้าเกินไป"}],(d=a==null?void 0:a.rpe)!=null?d:"","data-rpe")}
            <label class="label mt-14">หมายเหตุ</label>
            <textarea class="textarea" data-note placeholder="เช่น ไหล่ตึงเล็กน้อย ลดจำนวนครั้งลง 2 ครั้ง">${W((a==null?void 0:a.note)||"")}</textarea>
          </div>`:""}

    ${n?`<div class="row mt-14" style="gap:10px">
             <button class="btn btn-ghost" data-reset>${u("refresh")} รีเซ็ต</button>
             <button class="btn ${i?"btn-ghost":"btn-primary"} grow" data-finish>
               ${u("save")} ${i?"บันทึกการแก้ไข":"บันทึกผลการฝึก"}
             </button>
           </div>`:`<div class="mt-14">${E("กดเริ่มฝึกเพื่อเริ่มจับเวลา จากนั้นบันทึกจำนวนครั้งที่ทำได้จริงในแต่ละเซต ทำไม่ครบตามเป้าก็บันทึกได้ — ความสม่ำเสมอสำคัญกว่าตัวเลข")}</div>`}

    ${i?`<div class="card mt-14">
            <div class="card-head">${u("check")} สรุปผล</div>
            <div class="grid g3">
              <div><div class="tiny muted">เวลาที่ใช้</div><b>${F(a.elapsedSec)}</b></div>
              <div><div class="tiny muted">จำนวนครั้งรวม</div><b>${jt(a)}</b></div>
              <div><div class="tiny muted">ท่าที่ทำครบ</div><b>${l}/${c.length}</b></div>
            </div>
            ${a.note?`<p class="small muted mt-14">${W(a.note)}</p>`:""}
          </div>`:""}
  </div>`}function is(t,e){const a=t.date||_(),s=U(a,e.settings.startDate);if(!s.inProgram)return es(a,s);const n=X(s.week,s.dayIndex,e.settings,e.programOverrides),i=e.sessions[a]||null;return n.type==="running"?(setTimeout(()=>D("/running",{date:a}),0),'<div class="page"><div class="card center small muted">กำลังเปิดหน้าบันทึกการวิ่ง…</div></div>'):n.type==="rest"?as(a,n,i):ns(a,n,i)}function Pt(t,e){let a=K(t);return a||(a=Zt(t,e),Jt(a)),a}function rs(t,e,a){const s=K(t);if(!s)return;const n=s.exercises[e],i=B[n.id],r=ut(i);Q({title:n.name,subtitle:`เป้าหมาย ${n.targetReps} ${r} × ${n.targetSets} เซต`,body:`
      <p class="small muted" style="margin-bottom:12px">บันทึกจำนวนที่ทำได้จริง ไม่ต้องตรงกับเป้าหมายก็ได้</p>
      ${n.repsDone.map((l,c)=>`
        <div class="row-between" style="padding:7px 0">
          <span class="small bold">เซต ${c+1}</span>
          ${Vt(`set${c}`,Number(l)||n.targetReps,{min:0,max:i.unit===q.SECONDS?600:300,step:i.unit===q.SECONDS?5:1})}
        </div>`).join("")}
      <button class="btn btn-ghost btn-block btn-sm mt-8" data-fill>ใส่ค่าตามเป้าหมายทุกเซต</button>
    `,onMount:l=>{var c;We(l),(c=l.querySelector("[data-fill]"))==null||c.addEventListener("click",()=>{l.querySelectorAll("[data-stepper] input").forEach(d=>{d.value=n.targetReps})})},actions:[{label:"ยกเลิก",cls:"btn-ghost"},{label:"บันทึก",cls:"btn-primary",onClick:l=>{const c=[...l.querySelectorAll("[data-stepper] input")].map(d=>Math.max(0,Number(d.value)||0));N(d=>{const o=d.sessions[t];o.exercises[e].repsDone=c,o.exercises[e].done=c.every(p=>p>0)}),a()}}]})}function ls(t){const e=B[t];e&&Q({title:e.name,subtitle:`${e.en} · ${e.muscles}`,body:`
      <div class="ex-hero">${C(e.icon)}</div>
      <div class="label">วิธีทำ</div>
      <ol class="small muted" style="margin:0 0 14px;padding-left:18px;line-height:1.85">
        ${e.how.map(a=>`<li>${a}</li>`).join("")}
      </ol>
      ${E(e.caution,"warn")}
      ${e.easier&&e.easier!=="—"?`<div class="mt-14">${E(`ถ้ายังหนักเกินไป: ${e.easier}`)}</div>`:""}
    `,actions:[{label:"เข้าใจแล้ว",cls:"btn-primary"}]})}function ve(t){const e=document.createElement("div");e.className="rest-overlay";let a=t;e.innerHTML=`
    <div>
      <div class="small muted">พักระหว่างเซต</div>
      <div class="rest-count">${a}</div>
      <div class="row mt-20" style="gap:10px;justify-content:center">
        <button class="btn btn-ghost" data-add>+20 วินาที</button>
        <button class="btn btn-primary" data-skip>ข้าม</button>
      </div>
    </div>`,document.body.appendChild(e);const s=e.querySelector(".rest-count"),n=setInterval(()=>{a--,s.textContent=a,a<=0&&(clearInterval(n),e.remove(),$("หมดเวลาพัก เริ่มเซตถัดไปได้","ok",2e3))},1e3);e.querySelector("[data-add]").addEventListener("click",()=>{a+=20,s.textContent=a}),e.querySelector("[data-skip]").addEventListener("click",()=>{clearInterval(n),e.remove()})}function cs(t,e,a){var d,o,p,v,f,h,w,L;const s=T(),n=e.date||_(),i=U(n,s.settings.startDate);if((d=document.querySelector("[data-warmup]"))==null||d.addEventListener("click",()=>D("/warmup",{r:"warmup",from:"/workout"})),!i.inProgram)return;const r=X(i.week,i.dayIndex,s.settings,s.programOverrides);if(r.type==="running")return;if(r.type==="rest"){(o=t.querySelector("[data-rest-save]"))==null||o.addEventListener("click",()=>{const b=t.querySelector("[data-rest-note]").value.trim(),m=K(n)||Zt(n,r);m.note=b,m.status="completed",m.completedAt=new Date().toISOString(),Jt(m),$("บันทึกวันพักแล้ว"),a.rerender()}),(p=t.querySelector("[data-rest-delete]"))==null||p.addEventListener("click",async()=>{await V({title:"ลบบันทึกวันพัก",message:"ต้องการลบบันทึกของวันนี้ใช่หรือไม่",confirmLabel:"ลบ"})&&(yt(n),$("ลบแล้ว"),a.rerender())});return}const l=t.querySelector("[data-timer]");I.date&&I.date!==n&&rt(),I.running&&I.date===n&&Nt(n,b=>{l&&(l.textContent=F(b))}),(v=t.querySelector("[data-start]"))==null||v.addEventListener("click",()=>{Pt(n,r),Nt(n,b=>{const m=document.querySelector("[data-timer]");m&&(m.textContent=F(b))}),$("เริ่มจับเวลาแล้ว"),a.rerender()}),(f=t.querySelector("[data-toggle-timer]"))==null||f.addEventListener("click",()=>{I.running?(rt(),aa(n),$("พักการจับเวลา")):(Nt(n,b=>{const m=document.querySelector("[data-timer]");m&&(m.textContent=F(b))}),$("จับเวลาต่อ")),a.rerender()}),t.querySelectorAll("[data-check]").forEach(b=>{b.addEventListener("click",()=>{const m=Number(b.dataset.check),g=!Pt(n,r).exercises[m].done;N(R=>{const A=R.sessions[n].exercises[m];A.done=g,g&&A.repsDone.every(mt=>!mt)&&(A.repsDone=A.repsDone.map(()=>A.targetReps))});const k=K(n).exercises.filter(R=>!R.done).length;a.rerender(),g&&k>0&&ve(r.restSeconds),g&&k===0&&$("ทำครบทุกท่าแล้ว กดบันทึกผลได้เลย")})}),t.querySelectorAll("[data-set]").forEach(b=>{b.addEventListener("click",()=>{const[m]=b.dataset.set.split(":").map(Number);Pt(n,r),rs(n,m,a.rerender)})}),t.querySelectorAll("[data-detail]").forEach(b=>{b.addEventListener("click",()=>{const m=Number(b.dataset.detail),O=K(n),g=O?O.exercises:r.exercises;ls(g[m].id)})}),(h=t.querySelector("[data-rest-start]"))==null||h.addEventListener("click",()=>{ve(r.restSeconds)}),t.querySelectorAll("[data-rpe]").forEach(b=>{b.addEventListener("click",()=>{const m=Number(b.dataset.rpe);N(O=>{O.sessions[n]&&(O.sessions[n].rpe=m)}),t.querySelectorAll("[data-rpe]").forEach(O=>O.classList.remove("active")),b.classList.add("active"),m>=5&&$("ถ้ารู้สึกล้าเกินไป ลดจำนวนครั้งลงหรือพักเพิ่มหนึ่งวันได้","ok",4200)})});const c=t.querySelector("[data-note]");c==null||c.addEventListener("change",()=>{N(b=>{b.sessions[n]&&(b.sessions[n].note=c.value)},{silent:!0})}),(w=t.querySelector("[data-reset]"))==null||w.addEventListener("click",async()=>{await V({title:"รีเซ็ตการฝึกวันนี้",message:"ข้อมูลที่บันทึกไว้ของวันนี้จะถูกลบทั้งหมด การกระทำนี้ย้อนกลับไม่ได้",confirmLabel:"รีเซ็ต",danger:!0})&&(rt(),yt(n),$("รีเซ็ตแล้ว"),a.rerender())}),(L=t.querySelector("[data-finish]"))==null||L.addEventListener("click",async()=>{const b=K(n);if(!b)return;const m=b.exercises.filter(g=>!g.done).length;if(m>0&&!await V({title:"ยังทำไม่ครบทุกท่า",message:`เหลืออีก ${m} ท่าที่ยังไม่ได้ทำเครื่องหมาย ต้องการบันทึกผลเท่าที่ทำได้เลยไหม`,confirmLabel:"บันทึกเลย"}))return;c&&N(g=>{g.sessions[n].note=c.value},{silent:!0}),rt();let O=[];N(g=>{const k=g.sessions[n];k.status="completed",k.completedAt=new Date().toISOString(),O=ea(g)}),ds(t,n,O)})}function ds(t,e,a,s){const n=K(e);t.innerHTML=`
    <div class="page">
      <div class="done-screen">
        <div class="done-badge">${u("check")}</div>
        <h2>บันทึกผลการฝึกแล้ว</h2>
        <p class="small muted mt-8">${H(e)} · ${n.title}</p>
      </div>
      <div class="grid g3 mt-20">
        <div class="stat"><div class="stat-top">${u("clock")}<span>เวลาที่ใช้</span></div><div class="stat-value">${F(n.elapsedSec)}</div></div>
        <div class="stat"><div class="stat-top">${u("dumbbell")}<span>จำนวนครั้งรวม</span></div><div class="stat-value">${jt(n)}</div></div>
        <div class="stat"><div class="stat-top">${u("check")}<span>ท่าที่ทำครบ</span></div><div class="stat-value">${n.exercises.filter(i=>i.done).length}/${n.exercises.length}</div></div>
      </div>
      ${a.length?`<div class="card mt-14" style="border-color:var(--primary)">
              <div class="card-head">${u("trophy")} ปลดล็อกความสำเร็จใหม่</div>
              ${a.map(i=>`<div class="row" style="padding:6px 0">${u("trophy")}<div><b>${i.name}</b><div class="tiny muted">${i.desc}</div></div></div>`).join("")}
            </div>`:""}
      <div class="mt-14">${E("อย่าลืมคูลดาวน์: เดินช้า ๆ 2–3 นาที แล้วยืดกล้ามเนื้อมัดใหญ่ ข้างละ 20–30 วินาที")}</div>
      <button class="btn btn-primary btn-block mt-14" data-nav="/warmup?r=cooldown">
        ${u("heart")} เริ่มคูลดาวน์พร้อมจับเวลา
      </button>
      <div class="row mt-14" style="gap:10px">
        <button class="btn btn-ghost grow" data-nav="/stats">ดูสถิติ</button>
        <button class="btn btn-ghost grow" data-nav="/">กลับหน้าหลัก</button>
      </div>
    </div>`,t.querySelectorAll("[data-nav]").forEach(i=>i.addEventListener("click",()=>D(i.dataset.nav))),a.length?$(`ปลดล็อก: ${a.map(i=>i.name).join(", ")}`,"ok",4e3):$("บันทึกผลการฝึกเรียบร้อย")}const os=Object.freeze(Object.defineProperty({__proto__:null,fmtDurationTh:dt,header:ts,mount:cs,view:is},Symbol.toStringTag,{value:"Module"})),zt=[{value:"RunningA",label:"Running A"},{value:"RunningB",label:"Running B"},{value:"LongRun",label:"Long Run"}],j={id:null,running:!1,sec:0,date:null};function nt(){j.id&&clearInterval(j.id),j.id=null,j.running=!1}function us(t){const e=t.date||_();return{title:"บันทึกการวิ่ง",subtitle:H(e),back:"/"}}function vs(t,e){var f,h,w,L,b,m,O,g,k,R,A;const a=t.date||_(),s=U(a,e.settings.startDate),n=s.inProgram?X(s.week,s.dayIndex,e.settings,e.programOverrides):null,i=e.sessions[a]||null,r=i&&i.type!=="running",l=i&&i.type==="running"?i:null,c=(l==null?void 0:l.status)==="completed",d=(n==null?void 0:n.type)==="running"?n.planKey:null,o=(l==null?void 0:l.planKey)||d||"RunningB",p=(l==null?void 0:l.run)||{};j.date!==a&&(nt(),j.sec=Number(p.durationSec)||0,j.date=a);const v=Ze(e);return`<div class="page">
    ${r?`<div class="mt-8">${E(`วันที่นี้มีบันทึกการฝึก "${W(i.title)}" อยู่แล้ว หนึ่งวันเก็บได้หนึ่งบันทึก หากต้องการบันทึกการวิ่งของวันนี้ ให้ลบบันทึกเดิมในหน้าประวัติก่อน`,"warn")}</div>`:""}

    ${(n==null?void 0:n.type)==="running"?`<div class="card card-lg">
            <div class="today-type">
              <div class="ex-icon">${C("run")}</div>
              <div class="grow">
                <div class="bold">${n.title} · สัปดาห์ที่ ${n.week}</div>
                <div class="small muted">${n.run.summary}</div>
              </div>
              ${c?`<span class="badge badge-success">${u("check")} สำเร็จ</span>`:""}
            </div>
            <p class="small muted mt-14">${n.run.note}</p>
          </div>`:`<div class="card">${E("วันนี้ไม่ใช่วันวิ่งตามโปรแกรม แต่บันทึกการวิ่งเพิ่มเติมได้")}</div>`}

    <div class="section-title">ประเภทการฝึก</div>
    ${ot(zt,o,"data-rtype")}

    <div class="timer-box mt-14">
      <div>
        <div class="small muted">เวลาที่ใช้</div>
        <div class="timer-val" data-rtimer>${F(j.sec)}</div>
      </div>
      <div class="row" style="gap:8px">
        <button class="btn btn-ghost" data-rtoggle ${r?"disabled":""}>
          ${u(j.running?"pause":"play")} <span>${j.running?"พัก":j.sec>0?"ต่อ":"เริ่ม"}</span>
        </button>
        <button class="btn btn-ghost" data-rclear ${r?"disabled":""}>${u("refresh")}</button>
      </div>
    </div>

    <div class="card mt-14">
      <div class="card-head">${u("ruler")} ข้อมูลการวิ่ง</div>
      <p class="tiny muted" style="margin-bottom:12px">
        แอปนี้ไม่ใช้ GPS — กรอกระยะทางจากลู่วิ่ง นาฬิกา หรือแอปแผนที่ที่คุณใช้
      </p>

      <div class="grid g2">
        <div class="field">
          <label>ระยะทาง (กม.)</label>
          <input class="input" type="number" step="0.1" min="0" data-f="distanceKm"
                 value="${(f=p.distanceKm)!=null?f:""}" placeholder="เช่น 2.8"/>
        </div>
        <div class="field">
          <label>เวลา (นาที)</label>
          <input class="input" type="number" step="1" min="0" data-f="durationMin"
                 value="${p.durationSec?Math.round(p.durationSec/60):""}" placeholder="เช่น 24"/>
        </div>
        <div class="field">
          <label>จำนวนรอบ (ถ้าวิ่งสลับเดิน)</label>
          <input class="input" type="number" step="1" min="0" data-f="rounds"
                 value="${(L=p.rounds)!=null?L:(w=(h=n==null?void 0:n.run)==null?void 0:h.rounds)!=null?w:""}"/>
        </div>
        <div class="field">
          <label>เวลาวิ่ง / เดิน ต่อรอบ (นาที)</label>
          <div class="row" style="gap:8px">
            <input class="input" type="number" step="0.5" min="0" data-f="runMin"
                   value="${(O=p.runMin)!=null?O:(m=(b=n==null?void 0:n.run)==null?void 0:b.runMin)!=null?m:""}" placeholder="วิ่ง"/>
            <input class="input" type="number" step="0.5" min="0" data-f="walkMin"
                   value="${(R=p.walkMin)!=null?R:(k=(g=n==null?void 0:n.run)==null?void 0:g.walkMin)!=null?k:""}" placeholder="เดิน"/>
          </div>
        </div>
      </div>

      <div class="row-between card-flat" style="padding:12px;border-radius:12px;margin-top:4px">
        <span class="small muted">Pace เฉลี่ย</span>
        <b data-pace>—</b>
      </div>

      <label class="label mt-14">ความรู้สึกหลังวิ่ง</label>
      ${ot([{value:1,label:"สบาย"},{value:2,label:"กำลังดี"},{value:3,label:"เหนื่อย"},{value:4,label:"หนักมาก"}],(A=l==null?void 0:l.rpe)!=null?A:"","data-rfeel")}

      <label class="label mt-14">หมายเหตุ</label>
      <textarea class="textarea" data-f="note" placeholder="เช่น อากาศร้อน เดินมากกว่าที่ตั้งใจ">${W((l==null?void 0:l.note)||"")}</textarea>

      <div class="row mt-14" style="gap:10px">
        ${l?`<button class="btn btn-ghost" data-rdelete>${u("trash")} ลบ</button>`:""}
        <button class="btn btn-primary grow" data-rsave ${r?"disabled":""}>
          ${u("save")} ${c?"บันทึกการแก้ไข":"บันทึกผลการวิ่ง"}
        </button>
      </div>
    </div>

    <div class="section-title">สถิติการวิ่งทั้งหมด</div>
    ${v.count===0?`<div class="card">${E("ยังไม่มีข้อมูลการวิ่ง เมื่อบันทึกครั้งแรกแล้วสถิติจะแสดงที่นี่")}</div>`:`<div class="grid g2">
            ${P("road","ระยะทางสะสม",v.totalKm.toFixed(1),"กม.")}
            ${P("clock","เวลาวิ่งสะสม",dt(v.totalSec),"")}
            ${P("target","Pace เฉลี่ย",qt(v.avgPaceSec),"/กม.")}
            ${P("trophy","ระยะไกลสุด",v.bestKm.toFixed(1),"กม.")}
          </div>
          <div class="small muted mt-8 center">วิ่งมาแล้ว ${v.count} ครั้ง</div>`}
  </div>`}function ps(t,e,a){var h,w,L,b,m,O;const s=e.date||_(),i=T().sessions[s],r=i&&i.type!=="running";t.querySelector("[data-rtimer]");const l=t.querySelector("[data-pace]"),c=g=>t.querySelector(`[data-f="${g}"]`);let d=(i==null?void 0:i.planKey)||((h=t.querySelector("[data-rtype].active"))==null?void 0:h.dataset.rtype)||"RunningB",o=(w=i==null?void 0:i.rpe)!=null?w:null;function p(){var k;const g=Number((k=c("durationMin"))==null?void 0:k.value);return g>0?Math.round(g*60):j.sec}function v(){var R;const g=Number((R=c("distanceKm"))==null?void 0:R.value)||0,k=p();l.textContent=g>0&&k>0?`${qt(k/g)} /กม.`:"—"}v(),["distanceKm","durationMin"].forEach(g=>{var k;(k=c(g))==null||k.addEventListener("input",v)}),j.running&&(nt(),f());function f(){j.running=!0,j.id=setInterval(()=>{j.sec++;const g=document.querySelector("[data-rtimer]");g&&(g.textContent=F(j.sec));const k=document.querySelector('[data-f="durationMin"]');k&&!k.value&&v()},1e3)}(L=t.querySelector("[data-rtoggle]"))==null||L.addEventListener("click",()=>{r||(j.running?(nt(),!c("durationMin").value&&j.sec>0&&(c("durationMin").value=Math.max(1,Math.round(j.sec/60)),v()),$("หยุดจับเวลา")):(f(),$("เริ่มจับเวลา")),a.rerender())}),(b=t.querySelector("[data-rclear]"))==null||b.addEventListener("click",()=>{nt(),j.sec=0,a.rerender()}),t.querySelectorAll("[data-rtype]").forEach(g=>{g.addEventListener("click",()=>{d=g.dataset.rtype,t.querySelectorAll("[data-rtype]").forEach(k=>k.classList.remove("active")),g.classList.add("active")})}),t.querySelectorAll("[data-rfeel]").forEach(g=>{g.addEventListener("click",()=>{o=Number(g.dataset.rfeel),t.querySelectorAll("[data-rfeel]").forEach(k=>k.classList.remove("active")),g.classList.add("active")})}),(m=t.querySelector("[data-rsave]"))==null||m.addEventListener("click",()=>{var re,le;if(r)return;const g=Number(c("distanceKm").value)||0,k=p();if(g<=0&&k<=0){$("กรอกระยะทางหรือเวลาอย่างน้อยหนึ่งอย่าง","err");return}const R=U(s,T().settings.startDate);R.inProgram&&X(R.week,R.dayIndex,T().settings,T().programOverrides);const A=K(s)||Zt(s,{week:R.inProgram?R.week:0,planKey:d,type:"running",title:((re=zt.find(J=>J.value===d))==null?void 0:re.label)||"Running"});A.type="running",A.planKey=d,A.title=((le=zt.find(J=>J.value===d))==null?void 0:le.label)||"Running",A.week=R.inProgram?R.week:A.week,A.run={distanceKm:g,durationSec:k,rounds:Number(c("rounds").value)||0,runMin:Number(c("runMin").value)||0,walkMin:Number(c("walkMin").value)||0,paceSec:g>0&&k>0?k/g:0},A.rpe=o,A.note=c("note").value.trim(),A.status="completed",A.completedAt=new Date().toISOString(),nt();let mt=[];N(J=>{J.sessions[s]=A,mt=ea(J)}),mt.length?$(`ปลดล็อก: ${mt.map(J=>J.name).join(", ")}`,"ok",4e3):$("บันทึกผลการวิ่งเรียบร้อย"),D("/")}),(O=t.querySelector("[data-rdelete]"))==null||O.addEventListener("click",async()=>{await V({title:"ลบบันทึกการวิ่ง",message:"ต้องการลบบันทึกการวิ่งของวันนี้ใช่หรือไม่ การกระทำนี้ย้อนกลับไม่ได้",confirmLabel:"ลบ",danger:!0})&&(nt(),j.sec=0,yt(s),$("ลบแล้ว"),a.rerender())})}const ms=Object.freeze(Object.defineProperty({__proto__:null,header:us,mount:ps,view:vs},Symbol.toStringTag,{value:"Module"}));function ae(t){const e=U(_(),t.settings.startDate);return Math.min(Math.max(e.week,1),S)}function hs(t,e){const a=Number(t.week)||ae(e);return{title:"โปรแกรม 12 สัปดาห์",subtitle:`สัปดาห์ที่ ${a} · ${Qt(a)}`,back:"/"}}function pe(t,e,a){return G(t.settings.startDate,ze(e)+a)}function gs(t,e,a){const s=t.sessions[e],n=_();return(s==null?void 0:s.status)==="completed"?"completed":a.type==="rest"?"rest":e===n?"today":e<n?"missed":"upcoming"}const bs={completed:'<span class="badge badge-success">สำเร็จ</span>',today:'<span class="badge badge-primary">วันนี้</span>',missed:'<span class="badge badge-warn">ยังไม่ได้ฝึก</span>',upcoming:'<span class="badge">รออยู่</span>',rest:'<span class="badge">วันพัก</span>'};function fs(t,e){const a=Math.min(Math.max(Number(t.week)||ae(e),1),S),s=Ve(a,e.settings,e.programOverrides),n=te(e),i=s.filter((r,l)=>{var d;if(r.type==="rest")return!1;const c=pe(e,a,l);return((d=e.sessions[c])==null?void 0:d.status)==="completed"}).length;return`<div class="page">
    <div class="card card-lg">
      <div class="row-between">
        <div>
          <div class="small muted">สัปดาห์</div>
          <div class="hero-week">${a} <span>/ ${S}</span></div>
        </div>
        <div class="row" style="gap:8px">
          <button class="icon-btn" data-week-prev ${a<=1?"disabled":""}>${u("left")}</button>
          <button class="icon-btn" data-week-next ${a>=S?"disabled":""}>${u("right")}</button>
        </div>
      </div>
      <p class="small muted mt-8">${Qt(a)}</p>
      ${lt(a)?'<span class="badge badge-warn mt-8">สัปดาห์ฟื้นตัว (Deload)</span>':""}
      <div class="mt-14">${wt(i/6,i>=6)}</div>
      <div class="small muted mt-8">ฝึกสำเร็จ ${i} / 6 วันของสัปดาห์นี้</div>
    </div>

    <div class="section-title">เลือกสัปดาห์</div>
    <div class="week-strip">
      ${Array.from({length:S},(r,l)=>{var o;const c=l+1,d=((o=n[l])==null?void 0:o.value)>=6;return`<button class="wk ${c===a?"active":""} ${lt(c)?"deload":""} ${d?"done":""}" data-week="${c}">
          W${c}${lt(c)?"<small>deload</small>":"<small>&nbsp;</small>"}
        </button>`}).join("")}
    </div>

    <div class="section-title">ตารางประจำสัปดาห์</div>
    <div class="grid" style="gap:9px">
      ${s.map((r,l)=>{const c=pe(e,a,l),d=gs(e,c,r),o=r.type==="strength"?r.exercises.map(p=>p.name).join(" · "):r.type==="running"?r.run.summary:"ฟื้นตัว · ยืดเหยียดเบา ๆ";return`<button class="day-card s-${d}" data-day="${l}">
            <div class="day-dow">
              <b>${Ut[(l+1)%7]}</b>
              <span>${Y(c,!1)}</span>
            </div>
            <div class="ex-icon" style="width:38px;height:38px;flex:0 0 38px">
              ${C(r.type==="running"?"run":r.type==="rest"?"rest":"pushup")}
            </div>
            <div class="grow">
              <div class="bold small">${r.title}</div>
              <div class="tiny muted" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o}</div>
            </div>
            ${bs[d]}
          </button>`}).join("")}
    </div>

    <div class="mt-20">
      ${E("กดที่วันใดก็ได้เพื่อดูรายละเอียด ปรับจำนวนครั้งและเซตของสัปดาห์นั้นได้ตามความพร้อมของร่างกาย ไม่จำเป็นต้องเพิ่มความหนักถ้ายังไม่ไหว")}
    </div>
  </div>`}function ys(t,e,a,s){const i=Ve(e,t.settings,t.programOverrides)[a],r=G(t.settings.startDate,ze(e)+a),l=t.sessions[r];let c="";i.type==="strength"?c=`
      <p class="small muted" style="margin-bottom:12px">ปรับจำนวนครั้ง/เซตได้ ค่าที่ปรับจะใช้กับสัปดาห์ที่ ${e} เท่านั้น</p>
      ${i.exercises.map((d,o)=>`
        <div class="ex-row" style="align-items:flex-start">
          <div class="ex-icon">${C(d.icon)}</div>
          <div class="grow">
            <div class="ex-name">${d.name}${d.customized?' <span class="badge badge-primary">ปรับแล้ว</span>':""}</div>
            <div class="ex-meta">แนะนำ ${d.repsLabel} × ${d.sets} เซต</div>
            <div class="row mt-8 wrap" style="gap:10px">
              <div><div class="tiny muted">${ut(B[d.id])}</div>${Vt(`reps:${d.id}`,d.reps,{min:1,max:300,step:B[d.id].unit==="seconds"?5:1})}</div>
              <div><div class="tiny muted">เซต</div>${Vt(`sets:${d.id}`,d.sets,{min:1,max:8})}</div>
            </div>
          </div>
        </div>`).join("")}
      <button class="btn btn-ghost btn-block btn-sm mt-14" data-reset-week>คืนค่าตามโปรแกรมเดิม</button>`:i.type==="running"?c=`
      <div class="card card-flat">
        <div class="bold">${i.run.summary}</div>
        <p class="small muted mt-8">${i.run.note}</p>
        <div class="small muted mt-8">เวลาโดยประมาณ ${i.estMinutes} นาที</div>
      </div>`:c=`<ul class="small muted" style="margin:0;padding-left:18px;line-height:1.9">
      ${i.restActivities.map(d=>`<li>${d}</li>`).join("")}
    </ul>`,Q({title:`${la[(a+1)%7]} · ${i.title}`,subtitle:`${Y(r)}${(l==null?void 0:l.status)==="completed"?" · ฝึกสำเร็จแล้ว":""}`,body:c,onMount:d=>{var o;We(d,(p,v)=>{const[f,h]=p.split(":");N(w=>{const L=`${e}:${i.planKey}:${h}`,b=w.programOverrides[L]||{};w.programOverrides[L]={...b,[f]:v}})}),(o=d.querySelector("[data-reset-week]"))==null||o.addEventListener("click",()=>{N(p=>{for(const v of Object.keys(p.programOverrides))v.startsWith(`${e}:${i.planKey}:`)&&delete p.programOverrides[v]}),$("คืนค่าตามโปรแกรมเดิมแล้ว"),s()})},actions:[{label:"ปิด",cls:"btn-ghost",onClick:()=>s()},{label:i.type==="rest"?"บันทึกวันพัก":"ไปที่หน้าฝึก",cls:"btn-primary",onClick:()=>{D(i.type==="running"?"/running":"/workout",{date:r})}}]})}function $s(t,e,a){var i,r;const s=T(),n=Math.min(Math.max(Number(e.week)||ae(s),1),S);(i=t.querySelector("[data-week-prev]"))==null||i.addEventListener("click",()=>{n>1&&D("/program",{week:n-1})}),(r=t.querySelector("[data-week-next]"))==null||r.addEventListener("click",()=>{n<S&&D("/program",{week:n+1})}),t.querySelectorAll("[data-week]").forEach(l=>{l.addEventListener("click",()=>D("/program",{week:Number(l.dataset.week)}))}),t.querySelectorAll("[data-day]").forEach(l=>{l.addEventListener("click",()=>ys(T(),n,Number(l.dataset.day),a.rerender))})}const ws=Object.freeze(Object.defineProperty({__proto__:null,header:hs,mount:$s,view:fs},Symbol.toStringTag,{value:"Module"})),vt=360,pt=132,M={l:30,r:8,t:12,b:22};function sa(t){if(t<=0)return 10;const e=Math.floor(Math.log10(t)),a=Math.pow(10,e),s=t/a;return(s<=1?1:s<=2?2:s<=5?5:10)*a}function ks(t){return t>=1e3?(t/1e3).toFixed(t%1e3===0?0:1)+"k":Number.isInteger(t)?String(t):t.toFixed(1)}function na(t,e=3){const a=pt-M.t-M.b;let s="";for(let n=0;n<=e;n++){const i=t/e*n,r=M.t+a-a*n/e;s+=`<line class="grid-line" x1="${M.l}" y1="${r.toFixed(1)}" x2="${vt-M.r}" y2="${r.toFixed(1)}"/>`,s+=`<text class="axis-text" x="${M.l-6}" y="${(r+3.5).toFixed(1)}" text-anchor="end">${ks(i)}</text>`}return s}function ia(t){if(!t.length)return"";const e=vt-M.l-M.r;return(t.length<=3?t.map((s,n)=>n):[0,Math.floor((t.length-1)/2),t.length-1]).map(s=>{var r;const n=t.length===1?M.l+e/2:M.l+e*s/(t.length-1),i=s===0?"start":s===t.length-1?"end":"middle";return`<text class="axis-text" x="${n.toFixed(1)}" y="${pt-6}" text-anchor="${i}">${(r=t[s].label)!=null?r:""}</text>`}).join("")}function me(t,{color:e="var(--primary)",fill:a=!0}={}){if(!t||t.length===0)return"";const s=vt-M.l-M.r,n=pt-M.t-M.b,i=sa(Math.max(...t.map(o=>o.value),1)),r=t.map((o,p)=>{const v=t.length===1?M.l+s/2:M.l+s*p/(t.length-1),f=M.t+n-n*Math.min(o.value,i)/i;return[v,f]}),l=r.map(([o,p],v)=>`${v===0?"M":"L"}${o.toFixed(1)},${p.toFixed(1)}`).join(" "),c=a?`<path d="${l} L${r[r.length-1][0].toFixed(1)},${(M.t+n).toFixed(1)} L${r[0][0].toFixed(1)},${(M.t+n).toFixed(1)} Z" fill="${e}" opacity="0.12"/>`:"",d=r.map(([o,p])=>`<circle class="dot" cx="${o.toFixed(1)}" cy="${p.toFixed(1)}" r="3.2" fill="${e}"/>`).join("");return`<svg class="chart" viewBox="0 0 ${vt} ${pt}" style="width:100%;height:auto" role="img">
    ${na(i)}
    ${c}
    <path class="ln" d="${l}" stroke="${e}"/>
    ${d}
    ${ia(t)}
  </svg>`}function he(t,{color:e="var(--primary)",highlightIndex:a=-1}={}){if(!t||t.length===0)return"";const s=vt-M.l-M.r,n=pt-M.t-M.b,i=sa(Math.max(...t.map(d=>d.value),1)),r=s/t.length,l=Math.max(3,Math.min(22,r*.6)),c=t.map((d,o)=>{const p=n*Math.min(d.value,i)/i,v=M.l+r*o+(r-l)/2,f=M.t+n-p,h=a>=0&&o!==a?.42:1;return`<rect class="bar-rect" x="${v.toFixed(1)}" y="${f.toFixed(1)}" width="${l.toFixed(1)}" height="${Math.max(0,p).toFixed(1)}" fill="${e}" opacity="${h}"/>`}).join("");return`<svg class="chart" viewBox="0 0 ${vt} ${pt}" style="width:100%;height:auto" role="img">
    ${na(i)}
    ${c}
    ${ia(t)}
  </svg>`}const ge=[{value:"7",label:"7 วัน"},{value:"30",label:"30 วัน"},{value:"84",label:"12 สัปดาห์"},{value:"all",label:"ทั้งหมด"}],xs=["pushup","squat","plank","reverse_lunge"];function Ms(){return{title:"สถิติ",subtitle:"ความก้าวหน้าจากข้อมูลจริง",back:"/"}}function Ss(t,e){const a=t.range||"30",s=t.ex&&B[t.ex]?t.ex:"pushup",n=Object.values(e.sessions).filter(m=>m.status==="completed"),i=ue(n,a),r=i.filter(m=>m.type!=="rest"),l=i.reduce((m,O)=>m+Ue(O),0),c=i.reduce((m,O)=>m+Ge(O),0),d=ue(za(e,s),a).map(m=>({label:Y(m.date,!1),value:m.value})),o=Ua(e),p=te(e),v=o.some(m=>m.value>0),f=p.some(m=>m.value>0);let h=0;const w=o.map(m=>(h+=m.value,{label:`W${m.week}`,value:Number(h.toFixed(2))})),L=_t(e),b=Ze(e);return n.length===0?`<div class="page">
      ${ot(ge,a,"data-range")}
      <div class="card mt-14">
        ${st("ยังไม่มีข้อมูลสถิติ","เมื่อคุณบันทึกการฝึกครั้งแรก กราฟและตัวเลขทั้งหมดจะถูกคำนวณจากข้อมูลจริงของคุณ","chart",'<button class="btn btn-primary" data-nav="/workout">เริ่มฝึกวันนี้</button>')}
      </div>
    </div>`:`<div class="page">
    ${ot(ge,a,"data-range")}

    <div class="section-title">ภาพรวมการฝึก</div>
    <div class="grid g2">
      ${P("calendar","วันที่ออกกำลังกาย",r.length,"วัน")}
      ${P("target","อัตราการฝึกสำเร็จ",Math.round(Ye(e)*100),"%")}
      ${P("clock","เวลาฝึกสะสม",dt(l),"")}
      ${P("flame","ฝึกต่อเนื่องขณะนี้",Ot(e),"วัน")}
      ${P("trophy","สตรีคดีที่สุด",Xe(e),"วัน")}
      ${P("road","ระยะทางวิ่ง",c.toFixed(1),"กม.")}
    </div>

    <div class="section-title">ความสำเร็จรายสัปดาห์</div>
    <div class="card">
      ${f?`${he(p.map(m=>({label:`W${m.week}`,value:m.value})),{color:"var(--success)"})}
            <div class="legend"><span><i style="background:var(--success)"></i>จำนวนวันที่ฝึกสำเร็จ (เต็ม 6 วัน/สัปดาห์)</span></div>`:st("ยังไม่มีสัปดาห์ที่บันทึก","บันทึกการฝึกเพื่อดูกราฟรายสัปดาห์","calendar")}
    </div>

    <div class="section-title">พัฒนาการความแข็งแรง</div>
    ${Aa(xs.map(m=>({value:m,label:B[m].name})),s,"data-ex")}
    <div class="card mt-14">
      ${d.length?`${me(d,{color:"var(--primary)"})}
             <div class="legend">
               <span><i style="background:var(--primary)"></i>${B[s].name} — จำนวนที่ดีที่สุดในหนึ่งเซต (${ut(B[s])})</span>
             </div>
             ${L[s]?`<div class="row-between card-flat mt-14" style="padding:11px;border-radius:12px">
                      <span class="small muted">สถิติดีที่สุด</span>
                      <b>${L[s].value} ${ut(B[s])} · ${Y(L[s].date)}</b>
                    </div>`:""}`:st("ยังไม่มีข้อมูลของท่านี้","บันทึกจำนวนครั้งที่ทำได้ในหน้าฝึกประจำวัน แล้วกราฟจะขึ้นที่นี่","dumbbell")}
    </div>

    <div class="section-title">การวิ่ง</div>
    ${v?`<div class="grid g2">
             ${P("road","ระยะทางสะสมทั้งหมด",b.totalKm.toFixed(1),"กม.")}
             ${P("clock","เวลาวิ่งสะสม",dt(b.totalSec),"")}
             ${P("target","Pace เฉลี่ย",qt(b.avgPaceSec),"/กม.")}
             ${P("trophy","ระยะไกลสุด",b.bestKm.toFixed(1),"กม.")}
           </div>
           <div class="card mt-14">
             <div class="card-head">${u("chart")} ระยะทางรายสัปดาห์ (กม.)</div>
             ${he(o.map(m=>({label:`W${m.week}`,value:Number(m.value.toFixed(2))})),{color:"var(--info)"})}
           </div>
           <div class="card mt-14">
             <div class="card-head">${u("road")} ระยะทางสะสม (กม.)</div>
             ${me(w,{color:"var(--success)"})}
           </div>`:`<div class="card">${st("ยังไม่มีข้อมูลการวิ่ง","บันทึกการวิ่งครั้งแรกเพื่อเริ่มเก็บสถิติระยะทางและ pace","run",'<button class="btn btn-primary" data-nav="/running">บันทึกการวิ่ง</button>')}</div>`}

    <div class="section-title">สถิติส่วนตัวที่ดีที่สุด</div>
    <div class="card">
      ${Object.keys(L).length?Object.values(L).sort((m,O)=>O.value-m.value).map(m=>`<div class="row-between" style="padding:9px 0;border-bottom:1px solid var(--line)">
                  <span class="small">${m.name}</span>
                  <span><b>${m.value}</b> <span class="tiny muted">${m.unit===q.SECONDS?"วินาที":m.unit===q.REPS_SIDE?"ครั้ง/ข้าง":"ครั้ง"} · ${Y(m.date)}</span></span>
                </div>`).join(""):st("ยังไม่มีสถิติส่วนตัว","บันทึกจำนวนครั้งที่ทำได้เพื่อเริ่มเก็บสถิติ","trophy")}
    </div>

    <div class="mt-20">
      ${E(`กราฟทั้งหมดคำนวณจากเซสชันที่บันทึกไว้จริงเท่านั้น ไม่มีข้อมูลตัวอย่าง โปรแกรมทั้งหมดมี ${S} สัปดาห์`)}
    </div>
  </div>`}function _s(t,e){const a=e.range||"30",s=e.ex||"pushup";t.querySelectorAll("[data-range]").forEach(n=>{n.addEventListener("click",()=>D("/stats",{range:n.dataset.range,ex:s}))}),t.querySelectorAll("[data-ex]").forEach(n=>{n.addEventListener("click",()=>D("/stats",{range:a,ex:n.dataset.ex}))})}const Es=Object.freeze(Object.defineProperty({__proto__:null,addDays:G,header:Ms,mount:_s,todayKey:_,view:Ss},Symbol.toStringTag,{value:"Module"})),Ls=[{value:"all",label:"ทั้งหมด"},{value:"strength",label:"ฝึกกล้ามเนื้อ"},{value:"running",label:"การวิ่ง"},{value:"rest",label:"วันพัก"}],Os={1:"สบาย",2:"กำลังดี",3:"เหนื่อย",4:"หนักมาก",5:"ล้าเกินไป"};function qs(){return{title:"ประวัติการฝึก",subtitle:"ย้อนดู แก้ไข หรือลบบันทึกได้",back:"/"}}function Ds(t,{type:e,q:a,from:s,to:n}){return!(e!=="all"&&t.type!==e||s&&t.date<s||n&&t.date>n||a&&![t.title,t.note||"",Y(t.date),...(t.exercises||[]).map(r=>r.name)].join(" ").toLowerCase().includes(a.toLowerCase()))}function js(t,e){const a={type:t.type||"all",q:t.q||"",from:t.from||"",to:t.to||""},s=Object.values(e.sessions).sort((i,r)=>i.date<r.date?1:-1).filter(i=>Ds(i,a)),n=Object.keys(e.sessions).length;return`<div class="page">
    <div class="card">
      <div class="row" style="gap:10px">
        <div class="grow" style="position:relative">
          <input class="input" data-q placeholder="ค้นหาจากชื่อท่า วันที่ หรือหมายเหตุ" value="${W(a.q)}"/>
        </div>
        <button class="icon-btn" data-adv aria-label="ตัวกรองเพิ่มเติม">${u("filter")}</button>
      </div>
      <div class="pills mt-14">
        ${Ls.map(i=>`<button class="pill ${i.value===a.type?"active":""}" data-type="${i.value}">${i.label}</button>`).join("")}
      </div>
      <div class="grid g2 mt-14 ${a.from||a.to?"":"hidden"}" data-range-box>
        <div class="field" style="margin:0">
          <label>ตั้งแต่วันที่</label>
          <input class="input" type="date" data-from value="${a.from}"/>
        </div>
        <div class="field" style="margin:0">
          <label>ถึงวันที่</label>
          <input class="input" type="date" data-to value="${a.to}"/>
        </div>
      </div>
      ${a.q||a.type!=="all"||a.from||a.to?'<button class="btn btn-ghost btn-sm btn-block mt-14" data-clear>ล้างตัวกรอง</button>':""}
    </div>

    <div class="section-title">
      ${s.length} รายการ
      <span class="muted tiny">จากทั้งหมด ${n}</span>
    </div>

    ${s.length===0?`<div class="card">${st(n===0?"ยังไม่มีประวัติการฝึก":"ไม่พบรายการที่ตรงกับตัวกรอง",n===0?"เมื่อบันทึกการฝึกครั้งแรก รายการจะแสดงที่นี่":"ลองเปลี่ยนคำค้นหรือล้างตัวกรอง","history",n===0?'<button class="btn btn-primary" data-nav="/workout">เริ่มฝึกวันนี้</button>':"")}</div>`:s.map(As).join("")}

    ${s.length?`<div class="mt-20">${E("กดที่รายการเพื่อดูรายละเอียด แก้ไข หรือลบ")}</div>`:""}
  </div>`}function As(t){var a,s;const e=t.type==="strength"?`${t.exercises.filter(n=>n.done).length}/${t.exercises.length} ท่า · ${jt(t)} ครั้ง`:t.type==="running"?`${(((a=t.run)==null?void 0:a.distanceKm)||0).toFixed(1)} กม. · ${F(((s=t.run)==null?void 0:s.durationSec)||0)}`:t.note?W(t.note).slice(0,60):"วันพัก";return`<button class="hist-row" data-open="${t.date}">
    <div class="ex-icon" style="width:40px;height:40px;flex:0 0 40px">
      ${C(t.type==="running"?"run":t.type==="rest"?"rest":"pushup")}
    </div>
    <div class="grow">
      <div class="small bold">${H(t.date)}</div>
      <div class="tiny muted">${W(t.title)} · ${e}</div>
    </div>
    ${t.status==="completed"?`<span class="badge badge-success">${u("check")}</span>`:'<span class="badge badge-warn">ค้างอยู่</span>'}
    ${u("right")}
  </button>`}function Ns(t){if(t.type==="strength")return`
      <div class="grid g3" style="margin-bottom:14px">
        <div><div class="tiny muted">เวลาที่ใช้</div><b>${F(t.elapsedSec||0)}</b></div>
        <div><div class="tiny muted">จำนวนครั้งรวม</div><b>${jt(t)}</b></div>
        <div><div class="tiny muted">ท่าที่ทำครบ</div><b>${t.exercises.filter(e=>e.done).length}/${t.exercises.length}</b></div>
      </div>
      ${t.exercises.map(e=>`<div class="row-between" style="padding:8px 0;border-bottom:1px solid var(--line)">
            <span class="small">${e.name} ${e.done?'<span class="badge badge-success">ครบ</span>':""}</span>
            <span class="small muted">${e.repsDone.map(a=>a||"—").join(" / ")} ${ut(B[e.id])}</span>
          </div>`).join("")}`;if(t.type==="running"){const e=t.run||{};return`<div class="grid g2" style="gap:10px">
      <div><div class="tiny muted">ระยะทาง</div><b>${(e.distanceKm||0).toFixed(2)} กม.</b></div>
      <div><div class="tiny muted">เวลา</div><b>${F(e.durationSec||0)}</b></div>
      <div><div class="tiny muted">Pace เฉลี่ย</div><b>${e.distanceKm>0?`${qt(e.durationSec/e.distanceKm)} /กม.`:"—"}</b></div>
      <div><div class="tiny muted">จำนวนรอบ</div><b>${e.rounds||"—"}</b></div>
    </div>`}return'<p class="small muted">บันทึกวันพัก</p>'}function Ps(t,e){const a=K(t);a&&Q({title:a.title,subtitle:H(a.date),body:`
      ${Ns(a)}
      ${a.rpe?`<div class="mt-14 small muted">ความรู้สึก: <b>${Os[a.rpe]||a.rpe}</b></div>`:""}
      ${a.note?`<div class="mt-8 small muted">หมายเหตุ: ${W(a.note)}</div>`:""}
      <button class="btn btn-ghost btn-block btn-sm mt-14" data-del>${u("trash")} ลบรายการนี้</button>
    `,onMount:(s,n)=>{s.querySelector("[data-del]").addEventListener("click",async()=>{n.close(),await V({title:"ลบบันทึกการฝึก",message:`ต้องการลบบันทึกของวันที่ ${H(t)} ใช่หรือไม่ การกระทำนี้ย้อนกลับไม่ได้`,confirmLabel:"ลบ",danger:!0})&&(yt(t),$("ลบรายการแล้ว"),e())})},actions:[{label:"ปิด",cls:"btn-ghost"},{label:"แก้ไข",cls:"btn-primary",onClick:()=>D(a.type==="running"?"/running":"/workout",{date:t})}]})}function Ts(t,e,a){var l,c,d,o;const s={type:e.type||"all",q:e.q||"",from:e.from||"",to:e.to||""},n=p=>{const v={...s,...p},f={};for(const[h,w]of Object.entries(v))w&&w!=="all"&&(f[h]=w);D("/history",f)};t.querySelectorAll("[data-type]").forEach(p=>p.addEventListener("click",()=>n({type:p.dataset.type})));const i=t.querySelector("[data-q]");let r=null;i==null||i.addEventListener("input",()=>{clearTimeout(r),r=setTimeout(()=>n({q:i.value.trim()}),420)}),i==null||i.addEventListener("keydown",p=>{p.key==="Enter"&&(clearTimeout(r),n({q:i.value.trim()}))}),(l=t.querySelector("[data-adv]"))==null||l.addEventListener("click",()=>{var p;(p=t.querySelector("[data-range-box]"))==null||p.classList.toggle("hidden")}),(c=t.querySelector("[data-from]"))==null||c.addEventListener("change",p=>n({from:p.target.value})),(d=t.querySelector("[data-to]"))==null||d.addEventListener("change",p=>n({to:p.target.value})),(o=t.querySelector("[data-clear]"))==null||o.addEventListener("click",()=>D("/history")),t.querySelectorAll("[data-open]").forEach(p=>p.addEventListener("click",()=>Ps(p.dataset.open,a.rerender)))}const Rs=Object.freeze(Object.defineProperty({__proto__:null,header:qs,mount:Ts,view:js},Symbol.toStringTag,{value:"Module"}));function Is(t,e){return{title:"ความสำเร็จ",subtitle:`ปลดล็อกแล้ว ${Object.keys(e.achievements).length} จาก ${it.length} รายการ`,back:"/"}}function Cs(t,e){const a=e.achievements||{},s=Object.keys(a).length;return`<div class="page">
    <div class="card card-lg">
      <div class="row-between">
        <div>
          <div class="small muted">ความคืบหน้า</div>
          <div class="hero-week">${s} <span>/ ${it.length}</span></div>
        </div>
        <div style="color:var(--primary)">${u("trophy")}</div>
      </div>
      <div class="mt-14">${wt(s/it.length,s===it.length)}</div>
    </div>

    <div class="section-title">รายการทั้งหมด</div>
    <div class="grid" style="gap:9px">
      ${it.map(n=>{const i=a[n.id];return`<div class="ach ${i?"unlocked":"locked"}">
          <div class="ach-ic">${u(i?n.icon:"lock")}</div>
          <div class="grow">
            <div class="small bold">${n.name}</div>
            <div class="tiny muted">${n.desc}</div>
          </div>
          ${i?`<span class="badge badge-success">${Y(i.slice(0,10))}</span>`:'<span class="badge">ยังไม่ปลดล็อก</span>'}
        </div>`}).join("")}
    </div>

    <div class="mt-20">
      ${E("ความสำเร็จจะปลดล็อกอัตโนมัติจากข้อมูลการฝึกจริงเท่านั้น ระบบตรวจสอบใหม่ทุกครั้งที่คุณบันทึกผล")}
    </div>
  </div>`}const Bs=Object.freeze(Object.defineProperty({__proto__:null,header:Is,view:Cs},Symbol.toStringTag,{value:"Module"}));function Ks(){return{title:"ตั้งค่า",subtitle:"โปรไฟล์ โปรแกรม และข้อมูล",back:"/"}}const Fs=[{value:"light",label:"โหมดสว่าง",icon:"sun"},{value:"dark",label:"โหมดมืด",icon:"moon"},{value:"system",label:"ตามระบบ",icon:"monitor"}];function Hs(t,e){const a=e.profile,s=e.settings,n=Yt();return`<div class="page">
    <div class="section-title"><span class="row" style="gap:8px">${u("user")}<span>โปรไฟล์</span></span></div>
    <div class="card">
      <div class="field"><label>ชื่อที่ใช้แสดง</label>
        <input class="input" data-p="name" value="${W(a.name)}"/></div>
      <div class="grid g3">
        <div class="field"><label>อายุ (ปี)</label>
          <input class="input" type="number" min="10" max="100" data-p="age" value="${a.age}"/></div>
        <div class="field"><label>ส่วนสูง (ซม.)</label>
          <input class="input" type="number" min="100" max="230" data-p="heightCm" value="${a.heightCm}"/></div>
        <div class="field"><label>น้ำหนัก (กก.)</label>
          <input class="input" type="number" min="30" max="250" step="0.1" data-p="weightKg" value="${a.weightKg}"/></div>
      </div>
      <div class="grid g2">
        <div class="field"><label>เพศ</label>
          <select class="select" data-p="gender">
            <option value="male" ${a.gender==="male"?"selected":""}>ชาย</option>
            <option value="female" ${a.gender==="female"?"selected":""}>หญิง</option>
            <option value="other" ${a.gender==="other"?"selected":""}>ไม่ระบุ</option>
          </select></div>
        <div class="field"><label>ระดับความสามารถ</label>
          <select class="select" data-p="level">
            ${Object.entries(ua).map(([i,r])=>`<option value="${i}" ${a.level===i?"selected":""}>${r}</option>`).join("")}
          </select></div>
      </div>
      <div class="field"><label>เป้าหมาย</label>
        <textarea class="textarea" data-p="goals">${W(a.goals)}</textarea></div>
      <div class="grid g2">
        <div class="field" style="margin:0"><label>เวลาฝึกต่อวัน (นาที)</label>
          <input class="input" type="number" min="10" max="180" data-p="sessionMinutes" value="${a.sessionMinutes}"/></div>
        <div class="field" style="margin:0"><label>ความถี่ (วัน/สัปดาห์)</label>
          <input class="input" type="number" min="1" max="7" data-p="daysPerWeek" value="${a.daysPerWeek}"/></div>
      </div>
      <button class="btn btn-primary btn-block mt-14" data-save-profile>${u("save")} บันทึกโปรไฟล์</button>
    </div>

    <div class="section-title"><span class="row" style="gap:8px">${u("calendar")}<span>การฝึก</span></span></div>
    <div class="card">
      <div class="field"><label>วันเริ่มโปรแกรม (ระบบจะปรับเป็นวันจันทร์ของสัปดาห์นั้น)</label>
        <input class="input" type="date" data-s="startDate" value="${s.startDate}"/>
        <div class="tiny muted mt-8">ขณะนี้เริ่ม ${H(s.startDate)}</div></div>
      <div class="grid g2">
        <div class="field"><label>เวลาออกกำลังกาย</label>
          <input class="input" type="time" data-s="workoutTime" value="${s.workoutTime}"/></div>
        <div class="field"><label>เวลาพักระหว่างเซต (วินาที)</label>
          <input class="input" type="number" min="15" max="300" step="5" data-s="restSeconds" value="${s.restSeconds}"/></div>
      </div>
      <div class="grid g2">
        <div class="field" style="margin:0"><label>ระดับความยาก</label>
          <select class="select" data-s="difficulty">
            ${Object.entries(va).map(([i,r])=>`<option value="${i}" ${s.difficulty===i?"selected":""}>${r}</option>`).join("")}
          </select></div>
        <div class="field" style="margin:0"><label>หน่วยระยะทาง</label>
          <select class="select" data-s="distanceUnit">
            <option value="km" ${s.distanceUnit==="km"?"selected":""}>กิโลเมตร (กม.)</option>
            <option value="mi" ${s.distanceUnit==="mi"?"selected":""}>ไมล์ (mi)</option>
          </select></div>
      </div>
      <button class="btn btn-primary btn-block mt-14" data-save-settings>${u("save")} บันทึกการตั้งค่าการฝึก</button>
      <div class="mt-14">${E("การเปลี่ยนระดับความยากจะมีผลกับจำนวนครั้งที่แนะนำในสัปดาห์ถัดไป ข้อมูลที่บันทึกไว้แล้วจะไม่เปลี่ยน")}</div>
    </div>

    <div class="section-title"><span class="row" style="gap:8px">${u("sun")}<span>รูปแบบการแสดงผล</span></span></div>
    <div class="card">
      <div class="theme-picker">
        ${Fs.map(i=>`<button class="theme-opt ${s.theme===i.value?"active":""}" data-theme="${i.value}">
              ${u(i.icon)}${i.label}
            </button>`).join("")}
      </div>
    </div>

    <div class="section-title"><span class="row" style="gap:8px">${u("bell")}<span>การแจ้งเตือน</span></span></div>
    <div class="card">
      <div class="setting-row">
        <div class="grow">แจ้งเตือนเวลาออกกำลังกาย
          <div class="tiny muted">เวลา ${s.workoutTime} น.</div>
        </div>
        <button class="switch ${s.reminderEnabled?"on":""}" data-toggle-reminder aria-label="เปิดปิดการแจ้งเตือน"></button>
      </div>
      <div class="mt-14">${E(`ข้อจำกัดที่ต้องทราบ: แอปนี้เป็นเว็บแอป จึงแจ้งเตือนได้<b>เฉพาะตอนที่เปิดแอปค้างไว้ในเบราว์เซอร์</b>เท่านั้น ไม่สามารถแจ้งเตือนขณะปิดแอปได้ หากต้องการเตือนที่แน่นอน แนะนำให้ตั้งนาฬิกาปลุกในโทรศัพท์ควบคู่ไปด้วย${Dt()?n==="denied"?" — ขณะนี้เบราว์เซอร์ปฏิเสธสิทธิ์การแจ้งเตือนไว้":"":" — เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน"}`,"warn")}</div>
    </div>

    <div class="section-title"><span class="row" style="gap:8px">${u("save")}<span>จัดการข้อมูล</span></span></div>
    <div class="card">
      <div class="setting-row">
        <div class="grow">ส่งออกข้อมูล (JSON)
          <div class="tiny muted">บันทึกไฟล์สำรองไว้ในเครื่อง</div></div>
        <button class="btn btn-ghost btn-sm" data-export>${u("download")} ส่งออก</button>
      </div>
      <div class="setting-row">
        <div class="grow">นำเข้าข้อมูล (JSON)
          <div class="tiny muted">ข้อมูลปัจจุบันจะถูกแทนที่</div></div>
        <button class="btn btn-ghost btn-sm" data-import>${u("upload")} นำเข้า</button>
        <input type="file" accept="application/json,.json" class="hidden" data-file/>
      </div>
      <div class="setting-row">
        <div class="grow">กู้คืนจากข้อมูลสำรอง
          <div class="tiny muted">${e.lastBackup?`สำรองล่าสุด ${H(e.lastBackup.slice(0,10))}`:"ยังไม่มีข้อมูลสำรอง"}</div></div>
        <button class="btn btn-ghost btn-sm" data-restore ${e.lastBackup?"":"disabled"}>${u("refresh")} กู้คืน</button>
      </div>
      <div class="setting-row">
        <div class="grow">รีเซ็ตโปรแกรม
          <div class="tiny muted">ลบประวัติการฝึก แต่เก็บโปรไฟล์และการตั้งค่าไว้</div></div>
        <button class="btn btn-danger btn-sm" data-reset-program>รีเซ็ต</button>
      </div>
      <div class="setting-row">
        <div class="grow">ลบข้อมูลทั้งหมด
          <div class="tiny muted">คืนค่าแอปกลับเป็นเริ่มต้น</div></div>
        <button class="btn btn-danger btn-sm" data-reset-all>ลบทั้งหมด</button>
      </div>
    </div>

    <div class="mt-20">
      ${E("ข้อมูลทั้งหมดเก็บอยู่ในเบราว์เซอร์ของเครื่องนี้เท่านั้น ไม่ได้ส่งขึ้นเซิร์ฟเวอร์ใด ๆ หากล้างข้อมูลเบราว์เซอร์หรือเปลี่ยนเครื่อง ให้ใช้ไฟล์ส่งออก/นำเข้าเพื่อย้ายข้อมูล")}
    </div>

    <p class="tiny muted center mt-20">Saitama Training Tracker · v1.0.0</p>
  </div>`}function Ws(t,e){const a=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),s=URL.createObjectURL(a),n=document.createElement("a");n.href=s,n.download=e,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(s),1500)}function Vs(t,e,a){var n,i,r,l,c,d,o,p;(n=t.querySelector("[data-save-profile]"))==null||n.addEventListener("click",()=>{var f;const v={};if(t.querySelectorAll("[data-p]").forEach(h=>{v[h.dataset.p]=h.type==="number"?Number(h.value):h.value}),!((f=v.name)!=null&&f.trim())){$("กรุณากรอกชื่อ","err");return}N(h=>{Object.assign(h.profile,v)}),$("บันทึกโปรไฟล์แล้ว"),a.rerender()}),(i=t.querySelector("[data-save-settings]"))==null||i.addEventListener("click",async()=>{const v={};t.querySelectorAll("[data-s]").forEach(w=>{v[w.dataset.s]=w.type==="number"?Number(w.value):w.value});const f=T().settings.startDate,h=Et(v.startDate||f);h!==f&&Object.keys(T().sessions).length>0&&!await V({title:"เปลี่ยนวันเริ่มโปรแกรม",message:"การเปลี่ยนวันเริ่มจะทำให้สัปดาห์ของบันทึกเดิมเลื่อนตามไปด้วย ประวัติการฝึกจะไม่ถูกลบ ต้องการดำเนินการต่อหรือไม่",confirmLabel:"เปลี่ยน"})||(N(w=>{Object.assign(w.settings,v,{startDate:h}),w.settings.restSeconds=Math.max(15,Math.min(300,w.settings.restSeconds||60))}),$("บันทึกการตั้งค่าแล้ว"),a.rerender())}),t.querySelectorAll("[data-theme]").forEach(v=>{v.addEventListener("click",()=>{const f=v.dataset.theme;N(h=>{h.settings.theme=f}),Z(f),a.rerender()})}),(r=t.querySelector("[data-toggle-reminder]"))==null||r.addEventListener("click",async()=>{const v=!T().settings.reminderEnabled;v&&Dt()&&Yt()==="default"&&await qa(),N(f=>{f.settings.reminderEnabled=v}),v?(Fe(),$("เปิดการแจ้งเตือนแล้ว (ทำงานเมื่อเปิดแอปค้างไว้)","ok",4e3)):(He(),$("ปิดการแจ้งเตือนแล้ว")),a.rerender()}),(l=t.querySelector("[data-export]"))==null||l.addEventListener("click",()=>{Ws(T(),`training-backup-${_()}.json`),$("ส่งออกไฟล์แล้ว")});const s=t.querySelector("[data-file]");(c=t.querySelector("[data-import]"))==null||c.addEventListener("click",()=>s.click()),s==null||s.addEventListener("change",async()=>{var f;const v=(f=s.files)==null?void 0:f[0];if(v){try{const h=await v.text(),w=JSON.parse(h),L=Bt(w);if(!L.ok){$(L.error,"err",4e3),s.value="";return}const b=Object.keys(L.data.sessions||{}).length;if(!await V({title:"นำเข้าข้อมูล",message:`ไฟล์นี้มีบันทึกการฝึก ${b} รายการ ข้อมูลปัจจุบันทั้งหมดจะถูกแทนที่ (ระบบจะสำรองข้อมูลเดิมไว้ให้ก่อน)`,confirmLabel:"นำเข้า"})){s.value="";return}Lt(L.data,"import"),Z(L.data.settings.theme),$("นำเข้าข้อมูลเรียบร้อย"),D("/")}catch(h){$("อ่านไฟล์ไม่สำเร็จ: "+(h.message||h),"err",4500)}s.value=""}}),(d=t.querySelector("[data-restore]"))==null||d.addEventListener("click",async()=>{const v=je();if(!(v!=null&&v.data)){$("ไม่พบข้อมูลสำรอง","err");return}if(!await V({title:"กู้คืนข้อมูลสำรอง",message:`กู้คืนข้อมูลจากวันที่ ${H(v.at.slice(0,10))} ข้อมูลปัจจุบันจะถูกแทนที่`,confirmLabel:"กู้คืน"}))return;const h=Bt(v.data);if(!h.ok){$(h.error,"err");return}Lt(h.data,"restore"),Z(h.data.settings.theme),$("กู้คืนข้อมูลแล้ว"),D("/")}),(o=t.querySelector("[data-reset-program]"))==null||o.addEventListener("click",async()=>{await V({title:"รีเซ็ตโปรแกรม",message:"ประวัติการฝึก ความสำเร็จ และการปรับจำนวนครั้งทั้งหมดจะถูกลบ (ระบบจะสำรองข้อมูลเดิมไว้ให้) โปรไฟล์และการตั้งค่าจะยังอยู่",confirmLabel:"รีเซ็ตโปรแกรม",danger:!0})&&Q({title:"เริ่มโปรแกรมใหม่เมื่อไร",body:`<div class="field"><label>วันเริ่มโปรแกรมใหม่</label>
        <input class="input" type="date" data-new-start value="${_()}"/>
        <div class="tiny muted mt-8">ระบบจะปรับเป็นวันจันทร์ของสัปดาห์ที่เลือก</div></div>`,actions:[{label:"ยกเลิก",cls:"btn-ghost"},{label:"เริ่มใหม่",cls:"btn-primary",onClick:f=>{const h=f.querySelector("[data-new-start]").value||_();qe(Et(h)),$("รีเซ็ตโปรแกรมแล้ว"),D("/")}}]})}),(p=t.querySelector("[data-reset-all]"))==null||p.addEventListener("click",async()=>{await V({title:"ลบข้อมูลทั้งหมด",message:"ข้อมูลทุกอย่างจะถูกลบและคืนค่าเป็นเริ่มต้น (ระบบจะสำรองข้อมูลเดิมไว้ให้หนึ่งชุด) ต้องการดำเนินการต่อหรือไม่",confirmLabel:"ลบทั้งหมด",danger:!0})&&(Oe(),Z(T().settings.theme),$("ลบข้อมูลทั้งหมดแล้ว"),D("/"))})}const zs=Object.freeze(Object.defineProperty({__proto__:null,header:Ks,mount:Vs,view:Hs},Symbol.toStringTag,{value:"Module"}));function Us(){return{title:"คำแนะนำ",subtitle:"ฝึกอย่างปลอดภัยและยั่งยืน",back:"/"}}function Gs(){return`<div class="page">
    ${E("แอปนี้เป็นเครื่องมือช่วยติดตามการออกกำลังกาย ไม่ใช่เครื่องมือวินิจฉัยหรือคำแนะนำทางการแพทย์ หากมีโรคประจำตัว เคยบาดเจ็บ หรือไม่แน่ใจว่าร่างกายพร้อมหรือไม่ ควรปรึกษาแพทย์หรือผู้เชี่ยวชาญก่อนเริ่มโปรแกรม","warn")}

    <div class="section-title">หลักการของโปรแกรมนี้</div>
    <div class="card">
      <ul class="small muted" style="margin:0;padding-left:18px;line-height:1.95">
        <li>ออกแบบสำหรับผู้เริ่มต้น ใช้น้ำหนักตัวล้วน ไม่ต้องใช้อุปกรณ์</li>
        <li>เพิ่มความหนักทีละน้อยตลอด 12 สัปดาห์ (Progressive Overload)</li>
        <li>สัปดาห์ที่ 4 และ 8 เป็นสัปดาห์ฟื้นตัว ลดความหนักลงโดยตั้งใจ</li>
        <li>ฝึก 6 วัน พัก 1 วัน — วันพักสำคัญไม่แพ้วันฝึก</li>
        <li>ไม่มีการบังคับทำ 100 ครั้งหรือวิ่ง 10 กม. ตั้งแต่เริ่ม สิ่งเหล่านั้นเป็นเป้าหมายระยะยาวเท่านั้น</li>
      </ul>
    </div>

    <div class="section-title">วอร์มอัปและยืดเหยียด</div>
    <div class="card">
      <p class="small muted">มีหน้าแยกพร้อมโหมดจับเวลานำทีละท่า ทั้งชุดก่อนฝึกและหลังฝึก</p>
      <div class="row mt-14" style="gap:10px">
        <button class="btn btn-primary grow" data-nav="/warmup?r=warmup">${u("play")} ชุดก่อนฝึก</button>
        <button class="btn btn-ghost grow" data-nav="/warmup?r=cooldown">${u("heart")} ชุดหลังฝึก</button>
      </div>
      <div class="small muted mt-14">สรุปสั้น ๆ</div>
      <ul class="small muted" style="margin:6px 0 0;padding-left:18px;line-height:1.95">
        ${Na.map(t=>`<li>${t}</li>`).join("")}
        ${Pa.map(t=>`<li>${t}</li>`).join("")}
      </ul>
    </div>

    <div class="section-title">สัญญาณที่ควรหยุดทันที</div>
    <div class="card">
      <ul class="small muted" style="margin:0;padding-left:18px;line-height:1.95">
        <li>เจ็บแปลบ เจ็บข้อ หรือปวดร้าวลงขา/แขน</li>
        <li>เวียนหัว หน้ามืด ใจสั่น หรือแน่นหน้าอก</li>
        <li>หายใจไม่ทันจนพูดไม่เป็นคำ</li>
        <li>ฟอร์มเสียจนควบคุมไม่ได้ — หยุดเซตนั้นทันที</li>
      </ul>
      <div class="mt-14">${E("ปวดเมื่อยกล้ามเนื้อหลังฝึก 1–2 วันเป็นเรื่องปกติ แต่อาการเจ็บแหลมที่ข้อต่อไม่ปกติ ถ้าไม่แน่ใจให้พักและปรึกษาผู้เชี่ยวชาญ","warn")}</div>
    </div>

    <div class="section-title">คลังท่าออกกำลังกาย</div>
    <div class="grid g2">
      ${Object.values(B).map(t=>`<button class="card card-click" data-ex="${t.id}">
            <div class="row">
              <div class="ex-icon">${C(t.icon)}</div>
              <div class="grow">
                <div class="small bold">${t.name}</div>
                <div class="tiny muted">${t.en}</div>
              </div>
              ${u("right")}
            </div>
          </button>`).join("")}
    </div>
  </div>`}function Js(t){t.querySelectorAll("[data-ex]").forEach(e=>{e.addEventListener("click",()=>{const a=B[e.dataset.ex];Q({title:a.name,subtitle:`${a.en} · ${a.muscles}`,body:`
          <div class="ex-hero">${C(a.icon)}</div>
          <div class="label">วิธีทำ</div>
          <ol class="small muted" style="margin:0 0 14px;padding-left:18px;line-height:1.85">
            ${a.how.map(s=>`<li>${s}</li>`).join("")}
          </ol>
          ${E(a.caution,"warn")}
          ${a.easier&&a.easier!=="—"?`<div class="mt-14">${E(`ถ้ายังหนักเกินไป: ${a.easier}`)}</div>`:""}`,actions:[{label:"ปิด",cls:"btn-primary"}]})})})}const Ys=Object.freeze(Object.defineProperty({__proto__:null,header:Us,mount:Js,view:Gs},Symbol.toStringTag,{value:"Module"})),Xs=[{id:"march",name:"ยกเข่าสลับอยู่กับที่",en:"Marching in Place",icon:"march",seconds:60,target:"ทั้งตัว เพิ่มอัตราการเต้นหัวใจ",how:["ยืนตรง ยกเข่าขึ้นสลับข้างในจังหวะสบาย ๆ","แกว่งแขนตามธรรมชาติ","เริ่มช้าแล้วค่อย ๆ เร็วขึ้นจนรู้สึกอุ่นตัว"],tip:"ยังไม่ต้องยกเข่าสูง เป้าหมายคือให้ร่างกายอุ่นขึ้น ไม่ใช่เหนื่อย"},{id:"shoulder_roll",name:"หมุนไหล่ไปหน้า-หลัง",en:"Shoulder Rolls",icon:"arm_circles",seconds:30,target:"ไหล่ สะบัก",how:["ปล่อยแขนข้างลำตัว ยกไหล่ขึ้นแล้วหมุนไปด้านหลัง 8 รอบ","สลับหมุนไปด้านหน้าอีก 8 รอบ","หมุนให้เป็นวงใหญ่ที่สุดเท่าที่ไม่เจ็บ"]},{id:"arm_circles",name:"หมุนแขนเป็นวงใหญ่",en:"Arm Circles",icon:"arm_circles",seconds:30,target:"ไหล่ อก หลังส่วนบน",how:["กางแขนออกข้างลำตัวระดับไหล่","หมุนเป็นวงเล็ก ๆ ก่อน แล้วค่อย ๆ ขยายให้ใหญ่ขึ้น","หมุนไปข้างหน้า 10 รอบ แล้วสลับไปข้างหลัง 10 รอบ"],tip:"ถ้าไหล่เคยบาดเจ็บ ให้หมุนเป็นวงเล็กและช้าเท่านั้น"},{id:"torso_twist",name:"บิดลำตัวซ้าย-ขวา",en:"Torso Twists",icon:"torso_twist",seconds:30,target:"ลำตัว หลังส่วนกลาง",how:["ยืนเท้ากว้างเท่าหัวไหล่ งอศอกเล็กน้อยไว้ระดับอก","บิดลำตัวไปซ้ายและขวาสลับกันอย่างนุ่มนวล","ให้สะโพกอยู่กับที่ บิดจากช่วงลำตัว"],tip:"อย่าเหวี่ยงแรงหรือกระตุก เคลื่อนไหวให้ควบคุมได้ตลอด"},{id:"hip_circles",name:"หมุนสะโพก",en:"Hip Circles",icon:"hip_circles",seconds:30,target:"ข้อสะโพก หลังล่าง",how:["ยืนเท้ากว้างเท่าสะโพก มือเท้าเอว","หมุนสะโพกเป็นวงกลมใหญ่ 8 รอบ","สลับทิศทางอีก 8 รอบ"]},{id:"leg_swings",name:"แกว่งขาหน้า-หลัง",en:"Leg Swings",icon:"leg_swings",seconds:40,perSide:!0,target:"สะโพก ต้นขาหน้าและหลัง",how:["จับผนังหรือเก้าอี้เพื่อทรงตัว","แกว่งขาข้างหนึ่งไปหน้า-หลังอย่างผ่อนคลาย 10 ครั้ง","สลับข้าง ทำอีก 10 ครั้ง"],tip:"เริ่มจากแกว่งระยะสั้นก่อน แล้วค่อยเพิ่มระยะเมื่อรู้สึกคล่องขึ้น"},{id:"ankle_circles",name:"หมุนข้อเท้า",en:"Ankle Circles",icon:"ankle_circles",seconds:30,perSide:!0,target:"ข้อเท้า น่อง",how:["ยกเท้าข้างหนึ่งขึ้นเล็กน้อย จับที่ยึดไว้","หมุนข้อเท้าเป็นวง 8 รอบ แล้วสลับทิศอีก 8 รอบ","เปลี่ยนไปทำอีกข้าง"],tip:"สำคัญมากสำหรับวันวิ่ง ช่วยลดความเสี่ยงข้อเท้าพลิก"},{id:"cat_cow",name:"แอ่น-โก่งหลัง (Cat-Cow)",en:"Cat-Cow",icon:"cat_cow",seconds:40,target:"กระดูกสันหลัง หลังล่าง",how:["คุกเข่าสี่ขา มือใต้ไหล่ เข่าใต้สะโพก","หายใจเข้า แอ่นหลังลง เงยหน้าขึ้นเล็กน้อย","หายใจออก โก่งหลังขึ้น เก็บคาง","ทำสลับกัน 8–10 รอบช้า ๆ"]},{id:"warmup_squat",name:"สควอตเปล่า",en:"Bodyweight Squat",icon:"squat",seconds:40,target:"ต้นขา ก้น เข่า",how:["สควอตช้า ๆ 10 ครั้ง โดยไม่ต้องลงลึกสุด","ใช้เพื่อปลุกกล้ามเนื้อขาและซ้อมฟอร์ม","เน้นให้ส้นเท้าติดพื้นและหลังตรง"]},{id:"warmup_bridge",name:"Glute Bridge เบา ๆ",en:"Glute Bridge",icon:"glute_bridge",seconds:40,target:"ก้น หลังล่าง",how:["นอนหงาย ชันเข่า ยกสะโพกขึ้น-ลง 10 ครั้ง","ไม่ต้องค้างบนสุด เน้นปลุกกล้ามเนื้อก้นให้ทำงาน"],tip:"ท่านี้ช่วยให้สควอตและการวิ่งใช้แรงจากก้นได้ดีขึ้น"}],Qs=[{id:"easy_walk",name:"เดินช้า ๆ ให้ชีพจรลดลง",en:"Easy Walk",icon:"walk",seconds:120,target:"ทั้งตัว ระบบไหลเวียนเลือด",how:["เดินช้า ๆ 2 นาที หายใจเข้าออกลึก ๆ","รอให้หัวใจเต้นช้าลงก่อนเริ่มยืดค้าง"],tip:"อย่านั่งหรือนอนลงทันทีหลังฝึกหนัก ให้ร่างกายค่อย ๆ ลดระดับลง"},{id:"quad_stretch",name:"ยืดต้นขาหน้า",en:"Standing Quad Stretch",icon:"quad_stretch",seconds:60,perSide:!0,target:"ต้นขาด้านหน้า",how:["ยืนตรง จับผนังหรือเก้าอี้ด้วยมือข้างหนึ่ง","งอเข่าข้างหนึ่งไปด้านหลัง จับข้อเท้าดึงเข้าหาก้น","ให้เข่าทั้งสองชิดกัน สะโพกไม่แอ่น","ค้าง 30 วินาที แล้วสลับข้าง"],tip:"ถ้าจับข้อเท้าไม่ถึง ใช้ผ้าขนหนูคล้องข้อเท้าแล้วดึงแทน"},{id:"hamstring_stretch",name:"ยืดต้นขาหลัง",en:"Hamstring Stretch",icon:"hamstring_stretch",seconds:60,perSide:!0,target:"ต้นขาด้านหลัง",how:["นั่งบนพื้น เหยียดขาข้างหนึ่งตรง อีกข้างงอเข้าหาตัว","ดันสะโพกไปข้างหน้า ก้มลำตัวลงโดยหลังตรง","เอื้อมไปทางปลายเท้าเท่าที่หลังยังไม่โค้ง","ค้าง 30 วินาที แล้วสลับข้าง"],tip:"รู้สึกตึงพอดี ไม่ถึงกับเจ็บ ห้ามเด้งหรือกระตุก"},{id:"calf_stretch",name:"ยืดน่อง",en:"Calf Stretch",icon:"calf_stretch",seconds:60,perSide:!0,target:"น่อง เอ็นร้อยหวาย",how:["ยืนหันหน้าเข้าผนัง วางมือทั้งสองบนผนัง","ก้าวขาข้างหนึ่งไปด้านหลัง เหยียดเข่าตรง ส้นเท้าติดพื้น","ดันสะโพกไปข้างหน้าจนรู้สึกตึงที่น่อง","ค้าง 30 วินาที แล้วสลับข้าง"],tip:"สำคัญมากในวันวิ่ง น่องตึงสะสมคือสาเหตุอาการเจ็บส้นเท้าที่พบบ่อย"},{id:"figure_four",name:"ยืดสะโพกท่าเลข 4",en:"Figure-4 Stretch",icon:"figure_four",seconds:60,perSide:!0,target:"ก้น สะโพกด้านนอก",how:["นอนหงาย ชันเข่าทั้งสองข้าง","พาดข้อเท้าข้างหนึ่งบนเข่าอีกข้างให้เป็นรูปเลข 4","สอดมือไปจับใต้ต้นขาแล้วดึงเข้าหาอก","ค้าง 30 วินาที แล้วสลับข้าง"],tip:"ถ้าปวดหลังล่างจากการนั่งนาน ท่านี้ช่วยได้มาก"},{id:"chest_stretch",name:"ยืดอกและไหล่",en:"Chest & Shoulder Stretch",icon:"chest_stretch",seconds:40,target:"อก ไหล่ด้านหน้า",how:["ยืนตรง ประสานมือไว้ด้านหลัง","เหยียดแขนลงและดึงไหล่ไปด้านหลัง อกผายออก","ค้าง 20 วินาที พัก แล้วทำซ้ำอีกครั้ง"],tip:"ชดเชยท่าวิดพื้นและการนั่งก้มหน้าทั้งวัน"},{id:"child_pose",name:"ท่าเด็ก (Child Pose)",en:"Child's Pose",icon:"child_pose",seconds:45,target:"หลังล่าง สะโพก ไหล่",how:["คุกเข่า นั่งทับส้นเท้า แยกเข่าออกเล็กน้อย","ก้มลำตัวไปข้างหน้า เหยียดแขนไปให้ไกลที่สุด","วางหน้าผากลงบนพื้น หายใจเข้าออกช้า ๆ"],tip:"ถ้าเข่าไม่สบาย ให้วางหมอนหรือผ้าหนา ๆ ใต้เข่า"},{id:"breathe",name:"หายใจลึกผ่อนคลาย",en:"Deep Breathing",icon:"breathe",seconds:45,target:"ระบบประสาท การฟื้นตัว",how:["นั่งหรือนอนในท่าสบาย","หายใจเข้าทางจมูกนับ 4 กลั้นนับ 2 หายใจออกทางปากนับ 6","ทำซ้ำ 5–6 รอบ"],tip:"ช่วยให้ร่างกายเปลี่ยนเข้าสู่โหมดฟื้นตัวเร็วขึ้น"}],be={warmup:{key:"warmup",title:"วอร์มอัปก่อนฝึก",subtitle:"ยืดแบบเคลื่อนไหว — ปลุกร่างกายให้พร้อม",moves:Xs,why:"ก่อนฝึกใช้การยืดแบบเคลื่อนไหว เพื่อเพิ่มอุณหภูมิกล้ามเนื้อและเปิดช่วงการเคลื่อนไหวของข้อต่อ การยืดค้างนาน ๆ ตอนนี้จะทำให้กล้ามเนื้อออกแรงได้น้อยลงชั่วคราว"},cooldown:{key:"cooldown",title:"คูลดาวน์หลังฝึก",subtitle:"ยืดค้าง — ผ่อนคลายและฟื้นตัว",moves:Qs,why:"หลังฝึกร่างกายอุ่นแล้ว เป็นจังหวะที่เหมาะกับการยืดค้าง 20–30 วินาทีต่อท่า เพื่อผ่อนคลายกล้ามเนื้อและรักษาความยืดหยุ่น"}};function Zs(t){return t.reduce((e,a)=>e+a.seconds,0)}function se(t){return be[t.r]||be.warmup}function tn(t){return{title:"วอร์มอัป & ยืดเหยียด",subtitle:se(t).subtitle,back:t.from||"/"}}function ne(t){return t.perSide?`ข้างละ ${Math.round(t.seconds/2)} วินาที`:`${t.seconds} วินาที`}function en(t,e){return`
    <button class="ex-row" data-move="${e}" style="width:100%;text-align:left">
      <div class="ex-icon">${C(t.icon)}</div>
      <div class="grow">
        <div class="ex-name">${e+1}. ${t.name}</div>
        <div class="ex-meta">${ne(t)} · ${t.target}</div>
      </div>
      ${u("right")}
    </button>`}function an(t){const e=se(t),a=Zs(e.moves);return`<div class="page">
    ${ot([{value:"warmup",label:"ก่อนฝึก"},{value:"cooldown",label:"หลังฝึก"}],e.key,"data-routine")}

    <div class="card card-lg mt-14">
      <div class="row-between">
        <div class="grow">
          <div class="bold">${e.title}</div>
          <div class="small muted mt-8">${e.moves.length} ท่า · รวมประมาณ ${dt(a)}</div>
        </div>
        <div class="ex-icon" style="background:var(--primary-soft)">
          ${C(e.key==="warmup"?"march":"child_pose")}
        </div>
      </div>
      <button class="btn btn-primary btn-block mt-14" data-start-routine>
        ${u("play")} เริ่มโหมดจับเวลา
      </button>
      <p class="tiny muted center mt-8">แอปจะนำทีละท่าและนับเวลาให้เอง</p>
    </div>

    <div class="mt-14">${E(e.why)}</div>

    <div class="section-title">ลำดับท่า</div>
    <div class="card">
      ${e.moves.map((s,n)=>en(s,n)).join("")}
    </div>

    <div class="mt-20">
      ${E("ยืดจนรู้สึกตึงพอดี ไม่ถึงกับเจ็บ ห้ามเด้งหรือกระตุก หากมีอาการเจ็บแปลบที่ข้อต่อให้หยุดท่านั้นทันที","warn")}
    </div>

    <div class="row mt-14" style="gap:10px">
      <button class="btn btn-ghost grow" data-nav="/guide">คำแนะนำความปลอดภัย</button>
      <button class="btn btn-ghost grow" data-nav="/workout">ไปหน้าฝึกวันนี้</button>
    </div>
  </div>`}function sn(t){Q({title:t.name,subtitle:`${t.en} · ${t.target}`,body:`
      <div class="ex-hero">${C(t.icon)}</div>
      <div class="row-between card-flat" style="padding:11px;border-radius:12px;margin-bottom:14px">
        <span class="small muted">เวลาที่แนะนำ</span>
        <b>${ne(t)}</b>
      </div>
      <div class="label">วิธีทำ</div>
      <ol class="small muted" style="margin:0 0 14px;padding-left:18px;line-height:1.85">
        ${t.how.map(e=>`<li>${e}</li>`).join("")}
      </ol>
      ${t.tip?E(t.tip):""}
    `,actions:[{label:"ปิด",cls:"btn-primary"}]})}const et={id:null,wakeLock:null};async function nn(){try{"wakeLock"in navigator&&(et.wakeLock=await navigator.wakeLock.request("screen"))}catch{}}function rn(){var t,e;try{(e=(t=et.wakeLock)==null?void 0:t.release)==null||e.call(t)}catch{}et.wakeLock=null}function Tt(){et.id&&clearInterval(et.id),et.id=null,rn()}function ln(t){const e=t.moves;let a=0,s=e[0].seconds,n=!1,i=!1;const r=document.createElement("div");r.className="rest-overlay routine-player",document.body.appendChild(r),document.body.style.overflow="hidden",nn();const l=e.length;function c(){Tt(),r.remove(),document.body.style.overflow=""}function d(){Tt(),r.innerHTML=`
      <div style="max-width:420px;width:100%">
        <div class="done-badge">${u("check")}</div>
        <h2>${t.title}เสร็จแล้ว</h2>
        <p class="small muted mt-8">
          ${t.key==="warmup"?"ร่างกายพร้อมแล้ว เริ่มฝึกได้เลย":"ฟื้นตัวเรียบร้อย อย่าลืมดื่มน้ำและพักผ่อนให้พอ"}
        </p>
        <div class="row mt-20" style="gap:10px">
          <button class="btn btn-ghost grow" data-close>ปิด</button>
          <button class="btn btn-primary grow" data-go>
            ${t.key==="warmup"?"ไปหน้าฝึกวันนี้":"กลับหน้าหลัก"}
          </button>
        </div>
      </div>`,r.querySelector("[data-close]").addEventListener("click",c),r.querySelector("[data-go]").addEventListener("click",()=>{c(),D(t.key==="warmup"?"/workout":"/")}),$(`${t.title}ครบทุกท่าแล้ว`)}function o(){const v=e[a],f=e[a+1],h=v.seconds-s;r.innerHTML=`
      <div style="max-width:460px;width:100%">
        <div class="small muted">ท่าที่ ${a+1} จาก ${l} · ${t.title}</div>

        <div class="ex-hero" style="width:132px;margin:14px auto 8px">${C(v.icon)}</div>

        <h2 style="font-size:20px">${v.name}</h2>
        <div class="small muted mt-8">${ne(v)} · ${v.target}</div>

        <div class="rest-count" style="margin:14px 0 6px">${s}</div>

        <div style="max-width:320px;margin:0 auto">
          ${wt(v.seconds?h/v.seconds:0)}
        </div>

        <ul class="small muted" style="text-align:left;max-width:360px;margin:18px auto 0;padding-left:18px;line-height:1.75">
          ${v.how.map(w=>`<li>${w}</li>`).join("")}
        </ul>

        <div class="row mt-20" style="gap:8px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" data-prev ${a===0?"disabled":""}>
            ${u("left")} ก่อนหน้า
          </button>
          <button class="btn btn-primary" data-toggle>
            ${u(n?"play":"pause")} ${n?"เล่นต่อ":"พัก"}
          </button>
          <button class="btn btn-ghost btn-sm" data-next>
            ข้าม ${u("right")}
          </button>
        </div>

        <div class="tiny muted mt-14">
          ${f?`ถัดไป: ${f.name}`:"ท่าสุดท้ายแล้ว"}
        </div>
        <button class="btn btn-ghost btn-sm mt-14" data-exit>${u("x")} ออกจากโหมดจับเวลา</button>
      </div>`,r.querySelector("[data-toggle]").addEventListener("click",()=>{n=!n,o()}),r.querySelector("[data-next]").addEventListener("click",()=>p(a+1)),r.querySelector("[data-prev]").addEventListener("click",()=>p(a-1)),r.querySelector("[data-exit]").addEventListener("click",c)}function p(v){if(v>=l){d();return}a=Math.max(0,v),s=e[a].seconds,i=!1,o()}Tt(),et.id=setInterval(()=>{if(n)return;s--;const v=e[a];if(v.perSide&&!i&&s===Math.round(v.seconds/2)&&(i=!0,$("สลับข้าง","ok",2200)),s<=0){if(a+1>=l){d();return}p(a+1),$(`ต่อไป: ${e[a].name}`,"ok",1800);return}o()},1e3),o()}function cn(t,e){var s;const a=se(e);t.querySelectorAll("[data-routine]").forEach(n=>{n.addEventListener("click",()=>D("/warmup",{r:n.dataset.routine,...e.from?{from:e.from}:{}}))}),t.querySelectorAll("[data-move]").forEach(n=>{n.addEventListener("click",()=>sn(a.moves[Number(n.dataset.move)]))}),(s=t.querySelector("[data-start-routine]"))==null||s.addEventListener("click",()=>ln(a))}const dn=Object.freeze(Object.defineProperty({__proto__:null,fmtDuration:F,header:tn,mount:cn,view:an},Symbol.toStringTag,{value:"Module"})),ra=document.getElementById("app");ra.innerHTML=`
  <div class="app-shell">
    ${_a()}
    <div class="main">
      <header class="topbar"><div class="topbar-in" id="topbar"></div></header>
      <div id="view"></div>
    </div>
  </div>
  ${Ea()}
`;Wt(ra);const Rt=document.getElementById("topbar"),It=document.getElementById("view");ka(T().settings.theme,()=>$t());T().settings.reminderEnabled&&Fe();const on={"/":ta,"/workout":os,"/running":ms,"/program":ws,"/stats":Es,"/history":Rs,"/achievements":Bs,"/settings":zs,"/guide":Ys,"/warmup":dn};function ie(t,e){var n,i;const a=T(),s=t.header?t.header(e,a):{title:""};Rt.innerHTML=`
    ${s.back?`<button class="icon-btn" data-back="${s.back}" aria-label="ย้อนกลับ">${u("left")}</button>`:""}
    <div class="topbar-title">${s.title||""}${s.subtitle?`<span class="topbar-sub">${s.subtitle}</span>`:""}</div>
    ${s.right||""}`,(n=Rt.querySelector("[data-back]"))==null||n.addEventListener("click",r=>{D(r.currentTarget.dataset.back)}),It.innerHTML=t.view(e,a),(i=t.mount)==null||i.call(t,It,e,{rerender:()=>ie(t,e)}),Wt(Rt),Wt(It)}for(const[t,e]of Object.entries(on))Te(t,a=>ie(e,a));Re(()=>ie(ta,{}));Ce(t=>La(t.path));De()||setTimeout(()=>$("เบราว์เซอร์นี้ปิดการเก็บข้อมูลไว้ ข้อมูลจะหายเมื่อปิดหน้า","err",6e3),800);"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(t=>console.warn("[sw] ลงทะเบียนไม่สำเร็จ",t))});Be();window.__stt={state:$a,router:Ma};
