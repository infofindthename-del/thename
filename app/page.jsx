'use client';
import { useState, useEffect, useRef } from 'react';

const ADMIN_PIN = '2025';
const CONTACT_EMAIL = 'info.findthename@gmail.com';
const INSTAGRAM_URL = 'https://www.instagram.com/thename_talentagency';

const PALETTES = [
  {bg:'#1a1714',accent:'#c8d622'},{bg:'#2c1810',accent:'#e8c49e'},
  {bg:'#0e1a1c',accent:'#9db3be'},{bg:'#1c0e10',accent:'#d4426a'},
  {bg:'#1a1a14',accent:'#c8d622'},{bg:'#2a1a14',accent:'#e8c49e'},
];

const CATEGORIES = [
  {key:'all',label:<>the[<em>all</em>]</>},
  {key:'Art Director',label:<>the[<em>art directors</em>]</>},
  {key:'Photographer',label:<>the[<em>photographers</em>]</>},
  {key:'Fashion Stylist',label:<>the[<em>stylists</em>]</>},
  {key:'Videomaker',label:<>the[<em>videomakers</em>]</>},
  {key:'Set Designer',label:<>the[<em>set designers</em>]</>},
  {key:'Fashion Designer',label:<>the[<em>designers</em>]</>},
];

const DAYS = ['Lu','Ma','Me','Gi','Ve','Sa','Do'];

const G = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Archivo:wght@300;400;500;600&family=Archivo+Narrow:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--lime:#c8d622;--pink:#d4426a;--sand:#e8c49e;--terra:#7a3e30;--peach:#e8a87c;--ink:#0d0b0a;--off:#f5f0eb;--mid:#7a7068;}
html{scroll-behavior:smooth;}
body{font-family:'Archivo',sans-serif;background:var(--off);color:var(--ink);}
button,a,label,select{cursor:pointer;}
nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:24px 48px;mix-blend-mode:multiply;}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:400;letter-spacing:.5px;color:var(--ink);}
.nav-logo em{font-style:italic;}
.nav-links{display:flex;gap:28px;align-items:center;}
.nav-btn{font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;background:none;border:none;color:var(--ink);padding:0;transition:opacity .2s;opacity:.45;font-family:'Archivo Narrow',sans-serif;}
.nav-btn:hover,.nav-btn.active{opacity:1;}
.nav-admin{font-size:10px;letter-spacing:2px;text-transform:uppercase;background:var(--ink);color:var(--off);border:none;padding:7px 16px;font-family:'Archivo Narrow',sans-serif;transition:background .2s;}
.nav-admin:hover{background:var(--pink);}
.hamburger{display:none;background:none;border:none;padding:4px;flex-direction:column;gap:5px;cursor:pointer;}
.hamburger span{display:block;width:22px;height:1.5px;background:var(--ink);transition:all .3s;}
.mobile-menu{display:none;position:fixed;inset:0;background:var(--ink);z-index:99;flex-direction:column;align-items:center;justify-content:center;gap:32px;}
.mobile-menu.open{display:flex;}
.mobile-menu-btn{font-size:24px;font-family:'Cormorant Garamond',serif;font-weight:300;font-style:italic;color:var(--off);background:none;border:none;letter-spacing:-0.5px;}
.mobile-menu-btn:hover{color:var(--lime);}
.mobile-menu-close{position:absolute;top:28px;right:32px;background:none;border:none;color:rgba(245,240,235,.4);font-size:22px;}
.page{display:none;}.page.active{display:block;}
.hero{min-height:100vh;display:flex;flex-direction:column;background:var(--lime);position:relative;overflow:hidden;padding:120px 48px 80px;}
.hero-noise{position:absolute;inset:0;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px;pointer-events:none;}
.hero-label{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(13,11,10,.5);font-weight:500;margin-bottom:40px;font-family:'Archivo Narrow',sans-serif;}
.hero-headline{font-family:'Cormorant Garamond',serif;font-size:clamp(64px,10vw,140px);font-weight:300;line-height:.95;letter-spacing:-3px;color:var(--ink);max-width:1100px;}
.hero-headline em{font-style:italic;}
.hero-bottom{margin-top:auto;padding-top:80px;display:flex;justify-content:space-between;align-items:flex-end;}
.hero-desc{font-size:16px;line-height:1.7;color:rgba(13,11,10,.65);font-weight:300;max-width:460px;}
.hero-desc strong{font-weight:600;color:var(--ink);}
.hero-ctas{display:flex;gap:16px;}
.btn-bracket{font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;background:none;border:none;color:var(--ink);padding:12px 0;border-bottom:1px solid var(--ink);transition:all .2s;}
.btn-bracket:hover{color:var(--pink);border-color:var(--pink);}
.hero-scroll{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(13,11,10,.4);writing-mode:vertical-rl;font-family:'Archivo Narrow',sans-serif;}
.two-sides{display:grid;grid-template-columns:1fr 1fr;}
.side{padding:80px 60px;display:flex;flex-direction:column;justify-content:space-between;}
.side-creatives{background:var(--sand);}
.side-seekers{background:var(--terra);color:var(--off);}
.side-tag{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;margin-bottom:32px;opacity:.6;}
.side-title{font-family:'Cormorant Garamond',serif;font-size:clamp(40px,4vw,64px);font-weight:300;line-height:.95;letter-spacing:-2px;}
.side-title em{font-style:italic;}
.side-body{font-size:15px;line-height:1.7;font-weight:300;opacity:.75;max-width:400px;margin:32px 0;}
.side-cta{display:inline-flex;align-items:center;gap:10px;font-size:12px;letter-spacing:2px;text-transform:uppercase;background:none;border:none;padding:0;font-family:'Archivo Narrow',sans-serif;font-weight:500;transition:gap .2s;}
.side-creatives .side-cta{color:var(--terra);}
.side-seekers .side-cta{color:var(--off);}
.side-cta:hover{gap:18px;}
.comm-strip{background:#e8a87c;color:var(--ink);padding:100px 72px;position:relative;}
.comm-strip::before{content:'✦';position:absolute;top:56px;right:64px;font-size:14px;color:var(--ink);opacity:.15;}
.comm-tag-label{font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:var(--lime);opacity:.7;margin-bottom:28px;}
.comm-big-title{font-family:'Cormorant Garamond',serif;font-size:clamp(44px,5vw,72px);font-weight:300;line-height:.95;letter-spacing:-2px;margin-bottom:28px;}
.comm-big-title em{font-style:italic;}
.comm-body-text{font-size:15px;line-height:1.75;font-weight:300;color:rgba(245,240,235,.65);max-width:480px;margin-bottom:48px;}
.comm-body-text strong{color:var(--off);font-weight:500;}
.btn-comm{display:inline-flex;align-items:center;gap:12px;padding:18px 40px;background:var(--lime);color:var(--ink);border:none;font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;transition:all .25s;margin-bottom:14px;}
.btn-comm:hover{background:var(--off);gap:20px;}
.comm-note{font-size:11px;letter-spacing:1.5px;font-family:'Archivo Narrow',sans-serif;color:rgba(245,240,235,.3);text-transform:uppercase;}
.comm-stats{display:flex;gap:40px;margin-top:56px;padding-top:40px;border-top:1px solid rgba(245,240,235,.08);}
.comm-stat-n{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;font-style:italic;color:var(--lime);line-height:1;}
.comm-stat-l{font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:rgba(245,240,235,.35);margin-top:4px;}
.seeker-banner{background:var(--pink);padding:100px 72px;display:grid;grid-template-columns:1fr auto;gap:80px;align-items:center;}
.seeker-banner-title{font-family:'Cormorant Garamond',serif;font-size:clamp(56px,7vw,100px);font-weight:300;line-height:.9;letter-spacing:-3px;color:var(--off);}
.seeker-banner-title em{font-style:italic;}
.seeker-banner-right{display:flex;flex-direction:column;gap:16px;align-items:flex-end;}
.seeker-banner-sub{font-size:14px;color:rgba(245,240,235,.6);font-weight:300;text-align:right;line-height:1.6;max-width:320px;}
.btn-seeker{display:inline-block;padding:18px 40px;background:var(--off);color:var(--ink);text-decoration:none;font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;transition:all .2s;}
.btn-seeker:hover{background:var(--lime);}
.services{background:#ffffff;padding:100px 64px;color:var(--ink);}
.services-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:60px;}
.service-item{padding:72px 56px;background:var(--off);border:none;}
.service-num{font-family:'Cormorant Garamond',serif;font-size:80px;font-weight:300;font-style:italic;color:rgba(245,240,235,.12);line-height:1;margin-bottom:-20px;}
.service-name{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;line-height:1;letter-spacing:-1px;margin-bottom:16px;}
.service-desc{font-size:14px;line-height:1.7;opacity:.65;font-weight:300;max-width:360px;}
.service-tag{display:inline-block;margin-top:20px;font-size:10px;letter-spacing:2px;text-transform:uppercase;border:1px solid rgba(245,240,235,.3);padding:4px 12px;opacity:.6;font-family:'Archivo Narrow',sans-serif;}
.section{padding:80px 48px;}
.section-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:48px;padding-bottom:16px;border-bottom:1px solid rgba(13,11,10,.1);}
.section-title{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:300;letter-spacing:-1.5px;line-height:1;}
.section-title em{font-style:italic;}
.section-count{font-size:12px;color:var(--mid);letter-spacing:1px;font-family:'Archivo Narrow',sans-serif;}
.cat-tabs{display:flex;margin-bottom:40px;border-bottom:1px solid rgba(13,11,10,.1);overflow-x:auto;}
.cat-tab{padding:14px 20px;background:none;border:none;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;font-weight:500;color:var(--mid);transition:all .2s;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;}
.cat-tab:hover{color:var(--ink);}
.cat-tab.active{color:var(--ink);border-bottom-color:var(--ink);}
.cat-tab em{font-style:italic;font-family:'Cormorant Garamond',serif;font-size:14px;text-transform:none;letter-spacing:0;}
.search-wrap{position:relative;margin-bottom:40px;}
.search-input{width:100%;padding:20px 24px 20px 56px;background:var(--off);border:none;border-bottom:2px solid rgba(13,11,10,.15);font-family:'Cormorant Garamond',serif;font-size:22px;font-style:italic;outline:none;transition:border-color .2s;color:var(--ink);}
.search-input:focus{border-bottom-color:var(--ink);}
.search-input::placeholder{color:rgba(13,11,10,.3);}
.search-icon{position:absolute;left:20px;top:50%;transform:translateY(-50%);font-size:20px;color:var(--mid);}
.creative-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;}
.c-card{background:var(--off);border:1px solid rgba(13,11,10,.06);transition:all .3s;position:relative;overflow:hidden;}
.c-card:hover{z-index:2;transform:scale(1.01);}
.c-card:hover .c-overlay{opacity:1;}
.c-card:hover .c-img-inner{transform:scale(1.04);}
.c-img{height:280px;position:relative;overflow:hidden;}
.c-img-inner{width:100%;height:100%;transition:transform .6s;display:flex;align-items:center;justify-content:center;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:rgba(255,255,255,.3);background-size:cover;background-position:center;}
.c-overlay{position:absolute;inset:0;background:rgba(13,11,10,.5);opacity:0;transition:opacity .3s;display:flex;align-items:center;justify-content:center;}
.c-overlay-text{font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:var(--off);}
.c-body{padding:20px 24px 24px;}
.c-cat{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:var(--mid);margin-bottom:8px;}
.c-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;color:var(--ink);letter-spacing:-.3px;margin-bottom:4px;}
.c-city{font-size:12px;color:var(--mid);margin-bottom:12px;}
.c-tags{display:flex;flex-wrap:wrap;gap:6px;}
.c-tag{font-size:10px;padding:3px 10px;border:1px solid rgba(13,11,10,.15);color:var(--mid);font-family:'Archivo Narrow',sans-serif;}
.c-avail{position:absolute;top:16px;right:16px;font-size:9px;padding:3px 10px;letter-spacing:1.5px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;font-weight:500;}
.av-yes{background:var(--lime);color:var(--ink);}
.av-partial{background:var(--sand);color:var(--terra);}
.av-no{background:rgba(13,11,10,.7);color:var(--off);}
.empty-state{grid-column:1/-1;padding:80px 40px;text-align:center;border:1px dashed rgba(13,11,10,.12);}
.empty-state-title{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:300;font-style:italic;color:var(--ink);margin-bottom:12px;}
.empty-state-sub{font-size:13px;color:var(--mid);font-weight:300;line-height:1.7;max-width:400px;margin:0 auto 28px;}
.modal-bg{position:fixed;inset:0;background:rgba(13,11,10,.85);z-index:200;display:flex;align-items:flex-end;justify-content:flex-end;backdrop-filter:blur(2px);}
.modal{background:var(--off);width:560px;height:100vh;overflow-y:auto;position:relative;animation:slideIn .4s cubic-bezier(.16,1,.3,1);}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
.modal-img{height:320px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background-size:cover;background-position:center;}
.modal-img-label{font-size:13px;letter-spacing:2px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:rgba(255,255,255,.3);}
.modal-close{position:absolute;top:20px;left:20px;background:var(--off);border:none;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:14px;z-index:10;}
.modal-body{padding:36px 40px;}
.modal-cat-l{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:var(--mid);margin-bottom:10px;}
.modal-name{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;letter-spacing:-1px;line-height:1;margin-bottom:6px;}
.modal-city-l{font-size:13px;color:var(--mid);margin-bottom:28px;}
.modal-sec{font-size:9px;letter-spacing:3px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:var(--mid);margin-bottom:12px;margin-top:28px;}
.modal-bio{font-size:15px;line-height:1.75;font-weight:300;color:rgba(13,11,10,.75);}
.modal-port-item{padding:10px 0;border-bottom:1px solid rgba(13,11,10,.08);font-size:14px;color:var(--ink);display:flex;justify-content:space-between;}
.modal-port-item::after{content:'↗';font-size:12px;color:var(--mid);}
.modal-actions{display:flex;flex-direction:column;gap:10px;margin-top:32px;}
.btn-primary-full{padding:16px;background:var(--terra);color:var(--off);border:none;font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;transition:background .2s;}
.btn-primary-full:hover{background:var(--pink);}
.btn-outline-full{padding:16px;background:transparent;color:var(--ink);border:1px solid rgba(13,11,10,.2);font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;transition:all .2s;}
.btn-outline-full:hover{border-color:var(--ink);}
.avail-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;}
.avail-card{padding:32px;background:var(--off);border:1px solid rgba(13,11,10,.06);transition:all .2s;}
.avail-card:hover{background:var(--sand);}
.avail-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;letter-spacing:-.3px;margin-bottom:4px;}
.avail-role{font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:var(--mid);margin-bottom:20px;}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;}
.cal-head{font-size:9px;text-align:center;letter-spacing:1.5px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:var(--mid);padding:4px 0;}
.cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:11px;font-family:'Archivo Narrow',sans-serif;border:1px solid transparent;}
.cal-day.free{background:rgba(200,214,34,.2);color:var(--ink);border-color:rgba(200,214,34,.3);}
.cal-day.partial{background:rgba(232,196,158,.3);color:var(--terra);}
.cal-day.busy{background:rgba(13,11,10,.05);color:var(--mid);}
.cal-day.empty{opacity:0;}
.cal-legend{display:flex;gap:20px;margin-top:14px;}
.cal-legend-item{font-size:10px;color:var(--mid);display:flex;align-items:center;}
.cal-dot{width:8px;height:8px;display:inline-block;margin-right:6px;}
.seekers-hero{background:var(--terra);color:var(--off);padding:80px 48px 60px;}
.seekers-title{font-family:'Cormorant Garamond',serif;font-size:clamp(48px,7vw,96px);font-weight:300;line-height:.95;letter-spacing:-3px;margin-bottom:24px;}
.seekers-title em{font-style:italic;}
.seekers-sub{font-size:15px;line-height:1.7;opacity:.65;font-weight:300;max-width:480px;}
.overlay-form{position:fixed;inset:0;background:rgba(13,11,10,.9);z-index:300;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(4px);}
.community-modal{background:var(--off);width:100%;max-width:680px;max-height:90vh;overflow-y:auto;padding:48px;position:relative;animation:fadeUp .4s ease;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.cm-close{position:absolute;top:24px;right:24px;background:none;border:none;font-size:18px;color:var(--mid);}
.cm-label{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:var(--mid);display:block;margin-bottom:8px;}
.cm-input,.cm-select,.cm-textarea{background:transparent;border:none;border-bottom:1px solid rgba(13,11,10,.2);padding:10px 0;color:var(--ink);font-family:'Archivo',sans-serif;font-size:14px;outline:none;transition:border-color .2s;width:100%;border-radius:0;}
.cm-input:focus,.cm-select:focus,.cm-textarea:focus{border-bottom-color:var(--ink);}
.cm-textarea{resize:vertical;min-height:80px;border:1px solid rgba(13,11,10,.2);padding:10px;}
.cm-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.cm-group{display:flex;flex-direction:column;gap:8px;}
.cm-group.full{grid-column:1/-1;}
.cm-checkbox-item{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink);margin-bottom:6px;}
.cm-submit{width:100%;padding:18px;margin-top:28px;background:var(--terra);color:var(--off);border:none;font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;transition:background .2s;}
.cm-submit:hover:not(:disabled){background:var(--pink);}
.cm-submit:disabled{opacity:.4;}
.cm-success{text-align:center;padding:60px 0;}
.cm-success-icon{font-size:48px;margin-bottom:16px;}
.cm-success-title{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;font-style:italic;margin-bottom:8px;}
.cm-success-sub{font-size:14px;color:var(--mid);font-weight:300;}
.admin-gate{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--ink);padding:40px;}
.admin-gate-box{width:100%;max-width:400px;text-align:center;}
.admin-gate-title{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:300;font-style:italic;color:var(--off);margin-bottom:8px;}
.admin-gate-sub{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,240,235,.3);margin-bottom:40px;font-family:'Archivo Narrow',sans-serif;}
.admin-pin-input{width:100%;padding:16px;background:transparent;border:none;border-bottom:1px solid rgba(245,240,235,.2);color:var(--off);font-family:'Cormorant Garamond',serif;font-size:28px;text-align:center;letter-spacing:8px;outline:none;transition:border-color .2s;}
.admin-pin-input:focus{border-bottom-color:var(--lime);}
.admin-pin-btn{width:100%;padding:16px;margin-top:24px;background:var(--lime);color:var(--ink);border:none;font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;transition:all .2s;}
.admin-pin-btn:hover{background:var(--off);}
.admin-error{font-size:12px;color:var(--pink);margin-top:12px;letter-spacing:1px;font-family:'Archivo Narrow',sans-serif;}
.admin-panel{min-height:100vh;background:var(--ink);padding-top:130px;}
.admin-topbar{position:fixed;top:0;left:0;right:0;z-index:50;background:var(--ink);}
.admin-nav{border-bottom:1px solid rgba(245,240,235,.08);padding:20px 48px;display:flex;align-items:center;justify-content:space-between;}
.admin-nav-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;color:var(--lime);}
.admin-nav-exit{font-size:10px;letter-spacing:2px;background:none;border:none;color:rgba(245,240,235,.4);font-family:'Archivo Narrow',sans-serif;text-transform:uppercase;}
.admin-nav-exit:hover{color:var(--off);}
.admin-tabs{display:flex;border-bottom:1px solid rgba(245,240,235,.08);padding:0 48px;}
.admin-tab{padding:16px 24px;background:none;border:none;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:rgba(245,240,235,.3);transition:all .2s;border-bottom:2px solid transparent;margin-bottom:-1px;}
.admin-tab:hover{color:rgba(245,240,235,.6);}
.admin-tab.active{color:var(--lime);border-bottom-color:var(--lime);}
.admin-content{padding:48px;}
.admin-section-title{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:300;font-style:italic;color:var(--off);margin-bottom:8px;letter-spacing:-1px;}
.admin-sub{font-size:12px;color:rgba(245,240,235,.35);letter-spacing:1px;font-family:'Archivo Narrow',sans-serif;text-transform:uppercase;margin-bottom:32px;}
.admin-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;}
.admin-group{display:flex;flex-direction:column;gap:8px;}
.admin-group.full{grid-column:1/-1;}
.admin-label{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:rgba(245,240,235,.35);}
.admin-input,.admin-select,.admin-textarea{background:transparent;border:none;border-bottom:1px solid rgba(245,240,235,.15);padding:10px 0;color:var(--off);font-family:'Archivo',sans-serif;font-size:14px;outline:none;transition:border-color .2s;width:100%;border-radius:0;}
.admin-input:focus,.admin-select:focus,.admin-textarea:focus{border-bottom-color:var(--lime);}
.admin-select option{background:#1a1714;}
.admin-textarea{resize:vertical;min-height:80px;border:1px solid rgba(245,240,235,.12);padding:12px;}
.admin-btn{width:100%;padding:18px;margin-top:12px;background:var(--lime);color:var(--ink);border:none;font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;transition:all .2s;}
.admin-btn:hover:not(:disabled){background:var(--off);}
.admin-btn:disabled{opacity:.3;}
.admin-output{margin-top:28px;background:rgba(245,240,235,.04);border:1px solid rgba(245,240,235,.1);padding:36px;color:var(--off);font-family:'Archivo',sans-serif;font-size:13px;line-height:2;white-space:pre-wrap;}
.admin-output-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(245,240,235,.1);}
.admin-output-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:var(--lime);}
.admin-copy-btn{font-size:10px;letter-spacing:2px;text-transform:uppercase;background:none;border:1px solid rgba(245,240,235,.2);color:rgba(245,240,235,.5);padding:6px 16px;transition:all .2s;font-family:'Archivo Narrow',sans-serif;}
.admin-copy-btn:hover{border-color:var(--lime);color:var(--lime);}
.cand-card{background:rgba(245,240,235,.04);border:1px solid rgba(245,240,235,.08);padding:28px 32px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:flex-start;gap:24px;}
.cand-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;color:var(--off);margin-bottom:4px;}
.cand-meta{font-size:11px;letter-spacing:1px;font-family:'Archivo Narrow',sans-serif;color:rgba(245,240,235,.35);margin-bottom:10px;}
.cand-role-tag{font-size:9px;padding:3px 10px;border:1px solid rgba(245,240,235,.15);color:rgba(245,240,235,.5);font-family:'Archivo Narrow',sans-serif;display:inline-block;margin:2px;}
.status-badge{display:inline-block;font-size:9px;padding:3px 10px;letter-spacing:1.5px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;}
.status-approved{background:rgba(200,214,34,.15);color:var(--lime);border:1px solid rgba(200,214,34,.2);}
.status-rejected{background:rgba(212,66,106,.1);color:var(--pink);border:1px solid rgba(212,66,106,.2);}
.status-pending{background:rgba(245,240,235,.05);color:rgba(245,240,235,.35);border:1px solid rgba(245,240,235,.1);}
.btn-approve{padding:8px 20px;background:var(--lime);color:var(--ink);border:none;font-size:10px;letter-spacing:2px;font-family:'Archivo Narrow',sans-serif;text-transform:uppercase;transition:all .2s;cursor:pointer;}
.btn-approve:hover{background:var(--off);}
.btn-reject{padding:8px 20px;background:transparent;color:rgba(245,240,235,.4);border:1px solid rgba(245,240,235,.15);font-size:10px;letter-spacing:2px;font-family:'Archivo Narrow',sans-serif;text-transform:uppercase;transition:all .2s;cursor:pointer;}
.btn-reject:hover{border-color:var(--pink);color:var(--pink);}
.btn-promote{padding:8px 20px;background:var(--terra);color:var(--off);border:none;font-size:10px;letter-spacing:2px;font-family:'Archivo Narrow',sans-serif;text-transform:uppercase;transition:all .2s;cursor:pointer;}
.btn-promote:hover{background:var(--pink);}
.admin-creative-card{background:rgba(245,240,235,.04);border:1px solid rgba(245,240,235,.08);padding:20px 28px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;}
.admin-creative-name{font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--off);}
.admin-creative-meta{font-size:11px;color:rgba(245,240,235,.35);font-family:'Archivo Narrow',sans-serif;letter-spacing:1px;margin-top:2px;}
.avail-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:6px;}
.loading{display:flex;align-items:center;justify-content:center;padding:60px;font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:var(--mid);}
footer{background:var(--sand);color:var(--ink);padding:80px 48px 48px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:end;}
.footer-logo{font-family:'Cormorant Garamond',serif;font-size:64px;font-weight:300;font-style:italic;line-height:1;letter-spacing:-2px;margin-bottom:16px;}
.footer-tagline{font-size:13px;opacity:.4;font-weight:300;}
.footer-contact a{display:block;font-family:'Cormorant Garamond',serif;font-size:22px;font-style:italic;color:var(--terra);text-decoration:none;margin-bottom:8px;border-bottom:1px solid rgba(122,62,48,.3);padding-bottom:8px;}
.footer-copy{opacity:.25;font-size:11px;letter-spacing:1px;margin-top:40px;grid-column:1/-1;font-family:'Archivo Narrow',sans-serif;}
.toast{position:fixed;bottom:40px;left:50%;transform:translateX(-50%);background:var(--ink);color:var(--lime);padding:14px 32px;font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;z-index:9999;animation:toastIn .3s ease;}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.cookie-banner{position:fixed;bottom:0;left:0;right:0;background:var(--ink);color:var(--off);padding:20px 48px;z-index:8000;display:flex;align-items:center;justify-content:space-between;gap:24px;}
.cookie-text{font-size:12px;line-height:1.6;color:rgba(245,240,235,.7);max-width:700px;}
.cookie-text a{color:var(--lime);text-decoration:none;border-bottom:1px solid rgba(200,214,34,.3);}
.cookie-btn{padding:10px 28px;background:var(--lime);color:var(--ink);border:none;cursor:pointer;font-family:'Archivo Narrow',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;white-space:nowrap;transition:background .2s;}
.cookie-btn:hover{background:var(--off);}
.legal-overlay{position:fixed;inset:0;background:rgba(13,11,10,.9);z-index:400;display:flex;align-items:flex-start;justify-content:center;padding:60px 24px;overflow-y:auto;backdrop-filter:blur(4px);}
.legal-modal{background:var(--off);width:100%;max-width:760px;padding:56px;position:relative;animation:fadeUp .4s ease;}
.legal-close{position:absolute;top:24px;right:24px;background:none;border:none;cursor:pointer;font-size:18px;color:var(--mid);}
.legal-title{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:300;letter-spacing:-1px;margin-bottom:8px;}
.legal-date{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--mid);font-family:'Archivo Narrow',sans-serif;margin-bottom:40px;}
.legal-h2{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;margin-top:32px;margin-bottom:12px;}
.legal-p{font-size:14px;line-height:1.8;color:rgba(13,11,10,.75);font-weight:300;margin-bottom:12px;}
.legal-li{font-size:14px;line-height:1.8;color:rgba(13,11,10,.75);font-weight:300;padding-left:16px;margin-bottom:6px;}
.seeker-form-overlay{position:fixed;inset:0;background:rgba(13,11,10,.85);z-index:400;display:flex;align-items:flex-start;justify-content:center;padding:60px 24px;overflow-y:auto;backdrop-filter:blur(6px);}
.seeker-form-modal{background:var(--terra);width:100%;max-width:680px;padding:56px;position:relative;animation:fadeUp .4s ease;}
.seeker-form-close{position:absolute;top:24px;right:24px;background:none;border:none;cursor:pointer;font-size:18px;color:rgba(245,240,235,.4);}
.seeker-form-close:hover{color:var(--off);}
.seeker-form-title{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:300;letter-spacing:-2px;line-height:1;color:var(--off);margin-bottom:8px;}
.seeker-form-sub{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(245,240,235,.4);font-family:'Archivo Narrow',sans-serif;margin-bottom:40px;}
.seeker-field{margin-bottom:28px;}
.seeker-label{display:block;font-size:9px;letter-spacing:3px;text-transform:uppercase;font-family:'Archivo Narrow',sans-serif;color:rgba(245,240,235,.4);margin-bottom:10px;}
.seeker-input{width:100%;background:rgba(245,240,235,.06);border:none;border-bottom:1px solid rgba(245,240,235,.2);padding:14px 0;color:var(--off);font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;outline:none;transition:border-color .2s;}
.seeker-input:focus{border-bottom-color:var(--lime);}
.seeker-input::placeholder{color:rgba(245,240,235,.25);}
.seeker-textarea{width:100%;background:rgba(245,240,235,.06);border:none;border-bottom:1px solid rgba(245,240,235,.2);padding:14px 0;color:var(--off);font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;outline:none;resize:none;min-height:90px;transition:border-color .2s;}
.seeker-textarea:focus{border-bottom-color:var(--lime);}
.seeker-textarea::placeholder{color:rgba(245,240,235,.25);}
.seeker-select{width:100%;background:rgba(245,240,235,.06);border:none;border-bottom:1px solid rgba(245,240,235,.2);padding:14px 0;color:var(--off);font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;outline:none;cursor:pointer;-webkit-appearance:none;transition:border-color .2s;}
.seeker-select:focus{border-bottom-color:var(--lime);}
.seeker-select option{background:#7a3e30;color:var(--off);}
.seeker-divider{border:none;border-top:1px solid rgba(245,240,235,.1);margin:36px 0;}
.seeker-alt{font-size:13px;color:rgba(245,240,235,.45);line-height:1.7;font-weight:300;}
.seeker-alt a{color:var(--lime);text-decoration:none;border-bottom:1px solid rgba(200,214,34,.3);}
.seeker-submit{padding:20px 48px;background:var(--lime);color:var(--ink);border:none;cursor:pointer;font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;transition:all .2s;margin-top:8px;}
.seeker-submit:hover{background:var(--off);}
.seeker-submit:disabled{opacity:.4;cursor:not-allowed;}
.seeker-success{text-align:center;padding:40px 0;}
.seeker-success-icon{font-size:48px;margin-bottom:24px;}
.seeker-success-title{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:300;color:var(--off);margin-bottom:12px;}
.seeker-success-text{font-size:14px;color:rgba(245,240,235,.5);line-height:1.7;}
@media(max-width:900px){
  nav{padding:20px 24px;}
  .nav-links{display:none;}
  .hamburger{display:flex;}
  .hero{padding:100px 24px 60px;}
  .two-sides,.creative-grid,.avail-grid,.services-grid{grid-template-columns:1fr;}
  .side{padding:60px 28px;}
  .section{padding:60px 24px;}
  .modal{width:100vw;}
  .admin-form-grid{grid-template-columns:1fr;}
  .admin-content{padding:32px 24px;}
  .admin-tabs{padding:0 24px;}
  footer{grid-template-columns:1fr;gap:40px;}
  .seeker-banner{grid-template-columns:1fr;padding:60px 24px;}
  .comm-strip{padding:60px 28px;}
  .cm-grid{grid-template-columns:1fr;}
  .cand-card{flex-direction:column;}
}
`;


function AvailCalendar({calData}) {
  if(!calData) return null;
  const days = Array.from({length:30},(_,i)=>i+1);
  function getStatus(d){
    if(calData.free?.includes(d)) return 'free';
    if(calData.partial?.includes(d)) return 'partial';
    return 'busy';
  }
  return (
    <div>
      <div className="cal">
        {DAYS.map(d=><div key={d} className="cal-head">{d}</div>)}
        <div className="cal-day empty"/>
        {days.map(d=><div key={d} className={`cal-day ${getStatus(d)}`}>{d}</div>)}
      </div>
      <div className="cal-legend">
        <span className="cal-legend-item"><span className="cal-dot" style={{background:'rgba(200,214,34,.5)'}}/>Disponibile</span>
        <span className="cal-legend-item"><span className="cal-dot" style={{background:'rgba(232,196,158,.6)'}}/>Parziale</span>
        <span className="cal-legend-item"><span className="cal-dot" style={{background:'rgba(13,11,10,.15)'}}/>Occupato</span>
      </div>
    </div>
  );
}

function CreativeModal({c, onClose, onCommunity, isSeekerPage}) {
  const palIdx = c.id ? parseInt(c.id.slice(-1), 16) % PALETTES.length : 0;
  const pal = PALETTES[palIdx] || PALETTES[0];
  const avClass = c.availability==='available'?'av-yes':c.availability==='partial'?'av-partial':'av-no';
  const avLabel = c.availability==='available'?'Disponibile':c.availability==='partial'?'Parziale':'Occupato';
  const tags = typeof c.tags === 'string' ? c.tags.split(',').map(t=>t.trim()) : (c.tags||[]);
  const portfolio = typeof c.portfolio === 'string' ? c.portfolio.split('\n').filter(Boolean) : (c.portfolio||[]);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-img" style={{background:c.foto_url?'transparent':pal.bg,backgroundImage:c.foto_url?`url(${c.foto_url})`:'none',backgroundSize:'cover',backgroundPosition:'center'}}>
          {!c.foto_url && <span className="modal-img-label" style={{color:pal.accent+'66'}}>{(c.ruolo||'').toUpperCase()} · PORTFOLIO</span>}
          <span className={`c-avail ${avClass}`} style={{position:'absolute',top:16,right:16}}>{avLabel}</span>
        </div>
        <div className="modal-body">
          <div className="modal-cat-l">{c.ruolo} · {c.citta}</div>
          <div className="modal-name">{c.nome}</div>
          <div className="modal-city-l">{c.citta}, Italia</div>
          {c.bio && <><div className="modal-sec">Bio</div><div className="modal-bio">{c.bio}</div></>}
          {portfolio.length > 0 && <><div className="modal-sec">Portfolio selezionato</div>{portfolio.map(p=><div key={p} className="modal-port-item">{p}</div>)}</>}
          {tags.length > 0 && <><div className="modal-sec">Skills</div><div className="c-tags">{tags.map(t=><span key={t} className="c-tag">{t}</span>)}</div></>}
          <div className="modal-actions">
            {isSeekerPage ? (
              <button className="btn-primary-full" onClick={()=>window.location.href=`mailto:${CONTACT_EMAIL}?subject=Richiesta collaborazione -- ${c.nome}`}>Contatta questo creativo →</button>
            ) : (
              <button className="btn-primary-full" onClick={()=>{onClose();onCommunity();}}>Entra nella nostra community →</button>
            )}
            <button className="btn-outline-full" onClick={()=>window.location.href=`mailto:${CONTACT_EMAIL}`}>{isSeekerPage?'Scrivi al team':'Contattaci'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityForm({onClose}) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [gdpr, setGdpr] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const formRef = useRef();

  function handlePhoto(e) {
    const file = e.target.files[0];
    if(file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = ev => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  }

  async function submit(e) {
    e.preventDefault();
    if(!gdpr) return;
    setSending(true);
    const fd = new FormData(formRef.current);
    const roles = [...formRef.current.querySelectorAll('input[name="role"]:checked')].map(i=>i.value);
    const aree = [...formRef.current.querySelectorAll('input[name="area"]:checked')].map(i=>i.value);
    const travel = formRef.current.querySelector('input[name="travel"]:checked')?.value || '';
    const assistente = formRef.current.querySelector('input[name="assistant"]:checked')?.value || '';
    try {
      let foto_url = null;
      if(photoFile) {
        const formData = new FormData();
        formData.append('file', photoFile);
        formData.append('nome', fd.get('nome'));
        const uploadRes = await fetch('/api/upload', {method:'POST', body: formData});
        const uploadData = await uploadRes.json();
        foto_url = uploadData.url || null;
      }
      const submissionDate = new Date().toLocaleString('it-IT');
      await fetch('/api/candidatures', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          nome: fd.get('nome'),
          email: fd.get('email'),
          eta: fd.get('eta'),
          citta: fd.get('citta'),
          travel,
          aree: aree.join(', '),
          ruoli: roles.join(', '),
          assistente,
          preferenze: fd.get('preferenze'),
          esigenze: fd.get('esigenze'),
          portfolio: fd.get('portfolio'),
          foto_url,
          budget: fd.get('budget'),
          disponibilita: fd.get('disponibilita'),
          submission_date: submissionDate,
        })
      });
    } catch(err) { console.error(err); }
    setSending(false);
    setSubmitted(true);
  }

  const ROLES = ['Art Director','Fashion Stylist','Photographer','Videomaker','Model','Fashion Designer','Graphic Designer','Digital Artist','AI Artist','Creative Producer','Make-up Artist','Casting Director','Screenwriter','Copywriter','Event Planner','Set Designer','Illustrator','Content Creator / Social Media Manager'];

  return (
    <div className="overlay-form" onClick={onClose}>
      <div className="community-modal" onClick={e=>e.stopPropagation()}>
        <button className="cm-close" onClick={onClose}>✕</button>
        {!submitted ? (
          <form ref={formRef} onSubmit={submit}>
            <div style={{marginBottom:32}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'var(--mid)',marginBottom:12}}>the[name]</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,letterSpacing:-1,lineHeight:1}}>Talent<br/><em>Form</em></div>
            </div>
            <div className="cm-grid">
              <div className="cm-group full"><label className="cm-label">Nome e Cognome</label><input className="cm-input" name="nome" required placeholder="[ __________________________________ ]"/></div>
              <div className="cm-group full"><label className="cm-label">Email *</label><input className="cm-input" name="email" type="email" required placeholder="[ email@esempio.com ]"/></div>
              <div className="cm-group"><label className="cm-label">Eta</label><input className="cm-input" name="eta" type="number" min="16" max="99" placeholder="[ ___ ]"/></div>
              <div className="cm-group"><label className="cm-label">Citta di residenza</label><input className="cm-input" name="citta" placeholder="[ __________________________________ ]"/></div>
            </div>
            <div style={{margin:'24px 0',borderTop:'1px solid rgba(13,11,10,.08)',paddingTop:24}}>
              <label className="cm-label" style={{marginBottom:12}}>Sei disponibile a viaggiare per lavoro?</label>
              <label className="cm-checkbox-item"><input type="radio" name="travel" value="Si"/> Si</label>
              <label className="cm-checkbox-item"><input type="radio" name="travel" value="No"/> No</label>
            </div>
            <div style={{marginBottom:24}}>
              <label className="cm-label" style={{marginBottom:12}}>Aree geografiche disponibile a lavorare:</label>
              {['Italia','Europa','Worldwide'].map(a=>(<label key={a} className="cm-checkbox-item"><input type="checkbox" name="area" value={a}/> {a}</label>))}
            </div>
            <div style={{margin:'24px 0',borderTop:'1px solid rgba(13,11,10,.08)',paddingTop:24}}>
              <label className="cm-label" style={{marginBottom:4}}>Ruolo Creativo</label>
              <div style={{fontSize:11,color:'var(--mid)',marginBottom:14,fontStyle:'italic'}}>puoi selezionare piu di uno</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px 20px'}}>
                {ROLES.map(r=>(<label key={r} className="cm-checkbox-item"><input type="checkbox" name="role" value={r}/> {r}</label>))}
              </div>
            </div>
            <div style={{margin:'24px 0',borderTop:'1px solid rgba(13,11,10,.08)',paddingTop:24}}>
              <label className="cm-label" style={{marginBottom:12}}>Interesse a lavorare come assistente sul set?</label>
              <label className="cm-checkbox-item"><input type="radio" name="assistant" value="Si"/> Si</label>
              <label className="cm-checkbox-item"><input type="radio" name="assistant" value="No"/> No</label>
            </div>
            <div style={{margin:'24px 0',borderTop:'1px solid rgba(13,11,10,.08)',paddingTop:24}}>
              <label className="cm-label" style={{marginBottom:12}}>Preferenze tipo di progetti?</label>
              <div style={{fontSize:11,color:'var(--mid)',marginBottom:10,fontStyle:'italic'}}>editoriali, campagne, eventi, video, altro</div>
              <textarea className="cm-textarea" name="preferenze" style={{width:'100%'}} rows={3}/>
            </div>
            <div style={{marginBottom:24}}>
              <label className="cm-label" style={{marginBottom:12}}>Esigenze particolari?</label>
              <textarea className="cm-textarea" name="esigenze" style={{width:'100%'}} rows={2}/>
            </div>
            <div style={{margin:'24px 0',borderTop:'1px solid rgba(13,11,10,.08)',paddingTop:24}}>
              <label className="cm-label" style={{marginBottom:12}}>Budget indicativo per progetto</label>
              <select className="cm-select" name="budget" style={{width:'100%'}}>
                <option value="">Seleziona range budget</option>
                <option value="Fino a EUR 500">Fino a EUR 500</option>
                <option value="EUR 500 — 1.500">EUR 500 — 1.500</option>
                <option value="EUR 1.500 — 3.000">EUR 1.500 — 3.000</option>
                <option value="EUR 3.000 — 7.000">EUR 3.000 — 7.000</option>
                <option value="Oltre EUR 7.000">Oltre EUR 7.000</option>
                <option value="Da definire">Da definire</option>
              </select>
            </div>
            <div style={{marginBottom:24}}>
              <label className="cm-label" style={{marginBottom:12}}>Disponibilità (periodo o date indicative)</label>
              <input className="cm-input" name="disponibilita" style={{width:'100%'}} placeholder="Es. Giugno–Luglio 2025, dal 15/09, continuativa…"/>
            </div>
            <div style={{margin:'24px 0',borderTop:'1px solid rgba(13,11,10,.08)',paddingTop:24}}>
              <label className="cm-label" style={{marginBottom:12}}>Portfolio / Website link</label>
              <input className="cm-input" name="portfolio" style={{width:'100%'}} placeholder="[ https://... ]"/>
            </div>
            <div style={{margin:'24px 0',borderTop:'1px solid rgba(13,11,10,.08)',paddingTop:24}}>
              <label className="cm-label" style={{marginBottom:12}}>Foto di copertina</label>
              <div style={{fontSize:11,color:'var(--mid)',marginBottom:12,fontStyle:'italic'}}>Carica una foto che ti rappresenta (JPG, PNG)</div>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{width:'100%',padding:'10px 0',fontFamily:"'Archivo',sans-serif",fontSize:13,color:'var(--ink)',borderBottom:'1px solid rgba(13,11,10,.2)',background:'transparent',outline:'none'}}/>
              {photoPreview && <img src={photoPreview} style={{marginTop:12,maxWidth:'100%',maxHeight:180,objectFit:'cover'}} alt="Anteprima"/>}
            </div>
            <div style={{margin:'24px 0',background:'rgba(13,11,10,.03)',padding:20}}>
              <label className="cm-label" style={{marginBottom:14}}>Liberatoria e Consenso al Trattamento Dati</label>
              <div style={{fontSize:12,color:'var(--mid)',lineHeight:1.8,marginBottom:16,fontWeight:300}}>
                Io sottoscritto/a dichiaro di aver preso visione e di accettare quanto segue:<br/><br/>
                <strong style={{color:'var(--ink)'}}>1. Partecipazione alla piattaforma "the[name]"</strong><br/>
                Autorizzo l'utilizzo del materiale da me fornito, esclusivamente a scopo di presentazione all'interno dei canali the[name]. La partecipazione non implica alcun vincolo di esclusivita.<br/><br/>
                <strong style={{color:'var(--ink)'}}>2. Utilizzo del materiale inviato</strong><br/>
                Confermo di essere in possesso dei diritti necessari sui materiali inviati e sollevo the[name] da qualsiasi responsabilita relativa a violazioni di copyright. Autorizzo la diffusione del materiale a scopo illustrativo e non commerciale.<br/><br/>
                <strong style={{color:'var(--ink)'}}>3. Trattamento dei dati personali (GDPR UE 2016/679)</strong><br/>
                Acconsento al trattamento dei miei dati personali per finalita connesse alla partecipazione alla piattaforma. I dati non saranno ceduti a terzi.<br/><br/>
                <strong style={{color:'var(--ink)'}}>4. Revoca</strong><br/>
                Posso richiedere modifica o rimozione scrivendo a <strong>info.findthename@gmail.com</strong>
              </div>
              <label className="cm-checkbox-item" style={{fontWeight:500,fontSize:13}}>
                <input type="checkbox" checked={gdpr} onChange={e=>setGdpr(e.target.checked)}/> Io sottoscritto/a accetto i termini sopra indicati.
              </label>
            </div>
            <button type="submit" className="cm-submit" disabled={!gdpr||sending}>{sending?'Invio in corso...':'Invia →'}</button>
          </form>
        ) : (
          <div className="cm-success">
            <div className="cm-success-icon">✦</div>
            <div className="cm-success-title">candidatura ricevuta.</div>
            <div className="cm-success-sub">
              Ti risponderemo entro 7 giorni.
              <span style={{fontSize:12,marginTop:16,display:'block',opacity:.7}}>Nel frattempo segui i nostri canali:</span>
              <div style={{display:'flex',gap:16,marginTop:12,justifyContent:'center',flexWrap:'wrap'}}>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener" style={{color:'var(--terra)',fontSize:11,letterSpacing:2,textTransform:'uppercase',fontFamily:"'Archivo Narrow',sans-serif"}}>Instagram ↗</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SeekerForm({onClose}) {
  const [form, setForm] = useState({nome:'',azienda:'',email:'',cerca:'',progetto:'',dateStart:'',dateEnd:'',budget:'',note:''});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/seeker-request', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        console.error('Errore invio richiesta seeker:', json.error);
        alert('Errore durante l\'invio. Riprova o scrivici direttamente a info.findthename@gmail.com');
        setSending(false);
        return;
      }
    } catch(err) {
      console.error('Errore rete:', err);
      alert('Errore di connessione. Riprova o scrivici direttamente a info.findthename@gmail.com');
      setSending(false);
      return;
    }
    setSending(false);
    setSent(true);
  }

  return (
    <div className="seeker-form-overlay" onClick={onClose}>
      <div className="seeker-form-modal" onClick={e=>e.stopPropagation()}>
        <button className="seeker-form-close" onClick={onClose}>✕</button>
        {sent ? (
          <div className="seeker-success">
            <div className="seeker-success-icon">✦</div>
            <div className="seeker-success-title">Richiesta inviata</div>
            <div className="seeker-success-text">Ti contatteremo entro 24 ore per presentarti i profili più adatti al tuo progetto.</div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="seeker-form-title">Trova il<br/><em>talento</em></div>
            <div className="seeker-form-sub">the[name] — Richiesta creativo</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 32px'}}>
              <div className="seeker-field"><label className="seeker-label">Il tuo nome *</label><input className="seeker-input" required value={form.nome} onChange={e=>set('nome',e.target.value)} placeholder="Nome Cognome"/></div>
              <div className="seeker-field"><label className="seeker-label">Azienda / Brand *</label><input className="seeker-input" required value={form.azienda} onChange={e=>set('azienda',e.target.value)} placeholder="Brand S.r.l."/></div>
            </div>
            <div className="seeker-field"><label className="seeker-label">Email *</label><input className="seeker-input" type="email" required value={form.email} onChange={e=>set('email',e.target.value)} placeholder="email@brand.com"/></div>
            <div className="seeker-field">
              <label className="seeker-label">Cosa stai cercando? *</label>
              <select className="seeker-select" required value={form.cerca} onChange={e=>set('cerca',e.target.value)}>
                <option value="">Seleziona il ruolo creativo</option>
                <option>Photographer</option><option>Fashion Stylist</option><option>Art Director</option>
                <option>Videomaker</option><option>Model</option><option>Make-up Artist</option>
                <option>Graphic Designer</option><option>Creative Producer</option><option>Set Designer</option>
                <option>Content Creator / Social Media Manager</option><option>Digital Artist / AI Artist</option>
                <option>Piu di un ruolo — specificare nelle note</option>
              </select>
            </div>
            <div className="seeker-field">
              <label className="seeker-label">Che tipo di progetto? *</label>
              <select className="seeker-select" required value={form.progetto} onChange={e=>set('progetto',e.target.value)}>
                <option value="">Seleziona il tipo di progetto</option>
                <option>Campagna fotografica</option><option>Campagna video</option><option>Editoriale fashion</option>
                <option>Lookbook / e-commerce</option><option>Shooting prodotto</option><option>Social media content</option>
                <option>Evento</option><option>Progetto continuativo</option><option>Altro — specificare nelle note</option>
              </select>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 32px'}}>
              <div className="seeker-field"><label className="seeker-label">Data inizio</label><input className="seeker-input" type="date" value={form.dateStart} onChange={e=>set('dateStart',e.target.value)}/></div>
              <div className="seeker-field"><label className="seeker-label">Data fine</label><input className="seeker-input" type="date" value={form.dateEnd} onChange={e=>set('dateEnd',e.target.value)}/></div>
            </div>
            <div className="seeker-field">
              <label className="seeker-label">Budget indicativo</label>
              <select className="seeker-select" value={form.budget} onChange={e=>set('budget',e.target.value)}>
                <option value="">Seleziona range budget</option>
                <option>Fino a EUR 1.000</option><option>EUR 1.000 — 3.000</option><option>EUR 3.000 — 7.000</option>
                <option>EUR 7.000 — 15.000</option><option>EUR 15.000 — 30.000</option><option>Oltre EUR 30.000</option><option>Da definire</option>
              </select>
            </div>
            <div className="seeker-field"><label className="seeker-label">Note aggiuntive</label><textarea className="seeker-textarea" value={form.note} onChange={e=>set('note',e.target.value)} placeholder="Brief, requisiti specifici, riferimenti stilistici..."/></div>
            <button type="submit" className="seeker-submit" disabled={sending||!form.nome||!form.azienda||!form.email||!form.cerca||!form.progetto}>{sending?'Invio in corso...':'Invia richiesta →'}</button>
            <hr className="seeker-divider"/>
            <div className="seeker-alt">Preferisci scriverci direttamente?{' '}<a href="mailto:info.findthename@gmail.com">info.findthename@gmail.com</a>{' '}— ti risponderemo entro 24 ore con una selezione di profili su misura.</div>
          </form>
        )}
      </div>
    </div>
  );
}

function PrivacyPolicy({onClose}) {
  return (
    <div className="legal-overlay" onClick={onClose}>
      <div className="legal-modal" onClick={e=>e.stopPropagation()}>
        <button className="legal-close" onClick={onClose}>X</button>
        <div className="legal-title">Privacy Policy</div>
        <div className="legal-date">Ultimo aggiornamento: Marzo 2025</div>
        <div className="legal-h2">1. Titolare del trattamento</div>
        <p className="legal-p">Il titolare del trattamento dei dati personali e <strong>the[name]</strong>, contattabile a: <strong>info.findthename@gmail.com</strong></p>
        <div className="legal-h2">2. Dati raccolti</div>
        <p className="legal-p">Tramite il Talent Form raccogliamo: dati anagrafici (nome, eta, citta), dati professionali (ruolo, disponibilita, preferenze), link portfolio, foto di copertina, data e ora di invio.</p>
        <div className="legal-h2">3. Finalita del trattamento</div>
        <p className="legal-p">I dati vengono trattati per: gestione candidature, selezione talenti, presentazione profili a clienti tramite piattaforma, adempimenti contrattuali.</p>
        <div className="legal-h2">4. Base giuridica</div>
        <p className="legal-p">Consenso esplicito dell'interessato mediante firma della liberatoria nel Talent Form (art. 6, par. 1, lett. a GDPR UE 2016/679).</p>
        <div className="legal-h2">5. Conservazione dei dati</div>
        <p className="legal-p">I dati sono conservati per massimo 3 anni dalla raccolta, salvo diversa richiesta o obbligo di legge.</p>
        <div className="legal-h2">6. Condivisione dei dati</div>
        <p className="legal-p">I dati non vengono ceduti a terzi senza consenso. Possono essere condivisi con clienti della piattaforma nell'ambito della presentazione del profilo professionale.</p>
        <div className="legal-h2">7. Diritti dell'interessato</div>
        <p className="legal-p">Hai il diritto di: accedere ai tuoi dati, richiedere rettifica o cancellazione, opporti al trattamento, revocare il consenso. Scrivi a: <strong>info.findthename@gmail.com</strong></p>
        <div className="legal-h2">8. Cookie</div>
        <p className="legal-p">Questo sito utilizza esclusivamente cookie tecnici necessari al funzionamento. Non utilizza cookie di profilazione o tracciamento.</p>
      </div>
    </div>
  );
}

function TermsOfService({onClose}) {
  return (
    <div className="legal-overlay" onClick={onClose}>
      <div className="legal-modal" onClick={e=>e.stopPropagation()}>
        <button className="legal-close" onClick={onClose}>X</button>
        <div className="legal-title">Termini di Servizio</div>
        <div className="legal-date">Ultimo aggiornamento: Marzo 2025</div>
        <div className="legal-h2">1. Descrizione del servizio</div>
        <p className="legal-p">the[name] e una piattaforma che connette professionisti creativi con brand e aziende nel settore moda e comunicazione.</p>
        <div className="legal-h2">2. Accesso alla piattaforma</div>
        <p className="legal-p">La partecipazione come creativo richiede la compilazione del Talent Form e l'approvazione del team the[name]. La selezione e curatoriale.</p>
        <div className="legal-h2">3. Obblighi dei creativi</div>
        <p className="legal-p">I creativi si impegnano a: fornire informazioni veritiere, essere in possesso dei diritti sui materiali caricati, comunicare variazioni di disponibilita, rispettare gli accordi contrattuali.</p>
        <div className="legal-h2">4. Obblighi dei seeker</div>
        <p className="legal-p">I clienti si impegnano a: usare la piattaforma per finalita professionali, rispettare i termini di pagamento, comunicare esclusivamente tramite the[name] con i creativi selezionati.</p>
        <div className="legal-h2">5. Responsabilita</div>
        <p className="legal-p">the[name] agisce come intermediario e non e parte dei contratti tra creativi e clienti.</p>
        <div className="legal-h2">6. Legge applicabile</div>
        <p className="legal-p">Legge italiana. Foro competente: Tribunale di Firenze. Contatti: <strong>info.findthename@gmail.com</strong></p>
      </div>
    </div>
  );
}

// ── NUOVO: Tab Richieste Seeker con Match ────────────────────────
function SeekerRequestsTab({creatives, showToast}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [matchData, setMatchData] = useState({});
  const [matchLoading, setMatchLoading] = useState(null);

  useEffect(() => { loadRequests(); }, []);

  async function loadRequests() {
    setLoading(true);
    try {
      const res = await fetch('/api/seeker-requests');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await fetch('/api/seeker-requests', {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})});
    setItems(prev => prev.map(i => i.id===id ? {...i,status} : i));
    showToast('Stato aggiornato ✓');
  }

  async function doMatch(item) {
    if (matchData[item.id]) {
      setMatchData(prev => { const n={...prev}; delete n[item.id]; return n; });
      return;
    }
    setMatchLoading(item.id);
    const cercaRuoli = (item.cerca||'').split(/[,·\n]/).map(s=>s.trim()).filter(Boolean);
    const matched = creatives
      .filter(c => cercaRuoli.length===0 || cercaRuoli.includes(c.ruolo))
      .sort((a,b) => (a.availability==='available'?-1:1)-(b.availability==='available'?-1:1));
    setMatchData(prev => ({...prev,[item.id]:matched}));
    setMatchLoading(null);
  }

  return (
    <>
      <div className="admin-section-title">Richieste Seeker</div>
      <div className="admin-sub">Richieste in arrivo — fai il match con i creativi del network</div>
      {loading ? (
        <div className="loading">Caricamento...</div>
      ) : items.length===0 ? (
        <div style={{padding:'60px 0',textAlign:'center',opacity:.4,fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:'italic'}}>Nessuna richiesta ancora.</div>
      ) : items.map(item => (
        <div key={item.id} style={{background:'rgba(245,240,235,.04)',border:'1px solid rgba(245,240,235,.08)',marginBottom:8}}>
          <div style={{padding:'20px 28px',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}} onClick={()=>setExpanded(expanded===item.id?null:item.id)}>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:'var(--off)',marginBottom:2}}>{item.azienda||item.nome}</div>
              <div style={{fontSize:11,color:'rgba(245,240,235,.35)',fontFamily:"'Archivo Narrow',sans-serif",letterSpacing:1}}>
                {item.nome} · cerca: <strong style={{color:'var(--lime)'}}>{item.cerca}</strong> · {new Date(item.created_at).toLocaleDateString('it-IT')}
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:9,padding:'3px 10px',border:'1px solid',letterSpacing:1.5,textTransform:'uppercase',fontFamily:"'Archivo Narrow',sans-serif",borderColor:item.status==='handled'?'rgba(245,240,235,.25)':'var(--lime)',color:item.status==='handled'?'rgba(245,240,235,.25)':'var(--lime)'}}>{item.status==='handled'?'Gestita':'Nuova'}</span>
              <span style={{fontSize:9,color:'rgba(245,240,235,.3)'}}>{expanded===item.id?'▲':'▼'}</span>
            </div>
          </div>
          {expanded===item.id && (
            <div style={{padding:'0 28px 28px',borderTop:'1px solid rgba(245,240,235,.06)'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px 24px',margin:'20px 0'}}>
                {[['Nome',item.nome],['Email',item.email],['Azienda',item.azienda],['Cerca',item.cerca],['Tipo progetto',item.progetto],['Budget',item.budget],['Date',item.date_start?`${item.date_start} → ${item.date_end}`:'—']].map(([label,value])=>(
                  <div key={label}>
                    <div style={{fontSize:9,textTransform:'uppercase',letterSpacing:1,color:'rgba(245,240,235,.3)',fontFamily:"'Archivo Narrow',sans-serif",marginBottom:3}}>{label}</div>
                    <div style={{fontSize:13,color:'var(--off)'}}>{value||'—'}</div>
                  </div>
                ))}
                {item.note&&<div style={{gridColumn:'span 2'}}><div style={{fontSize:9,textTransform:'uppercase',letterSpacing:1,color:'rgba(245,240,235,.3)',fontFamily:"'Archivo Narrow',sans-serif",marginBottom:3}}>Note</div><div style={{fontSize:13,color:'var(--off)'}}>{item.note}</div></div>}
              </div>
              <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:20}}>
                <button onClick={()=>doMatch(item)} disabled={matchLoading===item.id} style={{padding:'10px 24px',background:'var(--lime)',border:'none',color:'var(--ink)',fontSize:10,letterSpacing:2,textTransform:'uppercase',fontFamily:"'Archivo Narrow',sans-serif",fontWeight:700,cursor:'pointer'}}>
                  {matchLoading===item.id?'Ricerca...':matchData[item.id]?'✕ Chiudi match':'⚡ MATCH'}
                </button>
                <a href={`mailto:${item.email}?subject=Re: Richiesta creativo — ${item.cerca}`} style={{padding:'10px 20px',border:'1px solid rgba(245,240,235,.2)',color:'rgba(245,240,235,.6)',fontSize:10,letterSpacing:2,textTransform:'uppercase',fontFamily:"'Archivo Narrow',sans-serif",textDecoration:'none'}}>✉ Rispondi</a>
                {item.status!=='handled'&&<button onClick={()=>updateStatus(item.id,'handled')} style={{padding:'10px 20px',border:'1px solid rgba(245,240,235,.15)',background:'none',color:'rgba(245,240,235,.4)',fontSize:10,letterSpacing:2,textTransform:'uppercase',fontFamily:"'Archivo Narrow',sans-serif",cursor:'pointer'}}>Segna gestita</button>}
              </div>
              {matchData[item.id]&&(
                <div style={{background:'rgba(200,214,34,.05)',border:'1px solid rgba(200,214,34,.15)',padding:20}}>
                  <div style={{fontSize:9,letterSpacing:3,textTransform:'uppercase',fontFamily:"'Archivo Narrow',sans-serif",color:'var(--lime)',marginBottom:16}}>
                    {matchData[item.id].length===0?'Nessun creativo disponibile per questo ruolo':`${matchData[item.id].length} creativ${matchData[item.id].length===1?'o':'i'} compatibil${matchData[item.id].length===1?'e':'i'}`}
                  </div>
                  {matchData[item.id].map(c=>(
                    <div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid rgba(245,240,235,.06)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        {c.foto_url?<img src={c.foto_url} style={{width:36,height:36,objectFit:'cover',borderRadius:'50%'}} alt={c.nome}/>:<div style={{width:36,height:36,borderRadius:'50%',background:'rgba(200,214,34,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'var(--lime)',fontWeight:600}}>{(c.nome||'?').slice(0,2).toUpperCase()}</div>}
                        <div>
                          <div style={{fontSize:14,color:'var(--off)',fontFamily:"'Cormorant Garamond',serif"}}>{c.nome}</div>
                          <div style={{fontSize:10,color:'rgba(245,240,235,.35)',letterSpacing:1,fontFamily:"'Archivo Narrow',sans-serif"}}>{c.ruolo} · {c.citta}</div>
                        </div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <span style={{fontSize:9,padding:'2px 8px',border:`1px solid ${c.availability==='available'?'var(--lime)':'rgba(245,240,235,.2)'}`,color:c.availability==='available'?'var(--lime)':'rgba(245,240,235,.4)',letterSpacing:1}}>{c.availability==='available'?'Disponibile':'Non disp.'}</span>
                        {c.portfolio&&<a href={c.portfolio} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:'var(--lime)',textDecoration:'none',letterSpacing:1}}>Portfolio →</a>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
}


function AdminGate({onSuccess}) {
  const [pin,setPin] = useState('');
  const [error,setError] = useState(false);
  function check(){
    if(pin===ADMIN_PIN){onSuccess();}
    else{setError(true);setPin('');setTimeout(()=>setError(false),2000);}
  }
  return (
    <div className="admin-gate">
      <div className="admin-gate-box">
        <div className="admin-gate-title">the[name]</div>
        <div className="admin-gate-sub">accesso riservato</div>
        <input className="admin-pin-input" type="password" maxLength={6} value={pin}
          onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==='Enter'&&check()}
          placeholder="····" autoFocus/>
        {error&&<div className="admin-error">PIN errato</div>}
        <button className="admin-pin-btn" onClick={check}>Entra →</button>
      </div>
    </div>
  );
}

function AdminPanel({onExit}) {
  const [tab, setTab] = useState('candidature');
  const [candidatures, setCandidatures] = useState([]);
  const [creatives, setCreatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [newCreative, setNewCreative] = useState({nome:'',ruolo:'',citta:'',bio:'',tags:'',portfolio:'',availability:'available'});
  const [creativesSearch, setCreativesSearch] = useState('');
  const [doc, setDoc] = useState('booking');
  const [output, setOutput] = useState('');
  const [bc, setBc] = useState({docNum:'',docDate:'',projectName:'',serviceDate:'',serviceLocation:'',revisions:'',projectDesc:'',clientName:'',clientContact:'',clientEmail:'',clientVat:'',t1Name:'',t1Role:'',t1Fee:'',t2Name:'',t2Role:'',t2Fee:'',t3Name:'',t3Role:'',t3Fee:'',agencyFee:'',agencyIban:'',agencyVat:'',agencySignatory:'',usageRights:'',territory:'',duration:'',exclusivity:'No',paymentTerms:'30',sigPlace:''});
  const sb = (k,v) => setBc(p=>({...p,[k]:v}));
  const [q, setQ] = useState({docNum:'',quotDate:'',validity:'',clientName:'',clientContact:'',projectName:'',projectDesc:'',contentOutput:'',usageRights:'',artDir:'',prodTeam:'',photo:'',video:'',stylist:'',stylistAss:'',shopping:'',mua:'',models:'',equipment:'',digital:'',graphic:'',location:'',insurance:'',contingency:'',extraItem:'',extraCost:'',totalProd:'',agencyFeePct:'',agencyFee:'',totalNet:'',vat:'',totalGross:'',timeCreative:'',timePreprod:'',timeProd:'',timePost:'',timeTotal:'',revisions:'',usageDuration:'',sigPlace:''});
  const sq = (k,v) => setQ(p=>({...p,[k]:v}));
  const [nda, setNda] = useState({disclosingParty:'',disclosingEmail:'',receivingParty:'',receivingEmail:'',projectName:'',projectDesc:'',ndaDuration:'2',jurisdiction:'Firenze',docDate:'',sigPlace:''});
  const sn = (k,v) => setNda(p=>({...p,[k]:v}));
  const [lic, setLic] = useState({licenseNumber:'',licDate:'',talentName:'',talentEmail:'',clientName:'',clientEmail:'',contentDesc:'',productionDate:'',projectName:'',fileCount:'',fileFormats:'',exclusivity:'No',licenseType:'',usageMedia:'',territory:'',usageDuration:'',outputFormats:'',licenseFee:'',paymentDueDate:'',jurisdiction:'Firenze',sigPlace:''});
  const sl = (k,v) => setLic(p=>({...p,[k]:v}));

  function DocDiv({text}) {
    return <div style={{fontSize:9,letterSpacing:3,textTransform:'uppercase',fontFamily:"'Archivo Narrow',sans-serif",color:'var(--lime)',opacity:.5,margin:'28px 0 16px',paddingTop:20,borderTop:'1px solid rgba(245,240,235,.06)'}}>{text}</div>;
  }
  function DocF({label,k,obj,setter,placeholder='',type='text'}) {
    return (<div className="admin-group"><label className="admin-label">{label}</label><input className="admin-input" type={type} value={obj[k]||''} onChange={e=>setter(k,e.target.value)} placeholder={placeholder}/></div>);
  }
  function DocFF({label,k,obj,setter,placeholder=''}) {
    return (<div className="admin-group full"><label className="admin-label">{label}</label><input className="admin-input" value={obj[k]||''} onChange={e=>setter(k,e.target.value)} placeholder={placeholder}/></div>);
  }
  function DocT({label,k,obj,setter}) {
    return (<div className="admin-group full"><label className="admin-label">{label}</label><textarea className="admin-textarea" value={obj[k]||''} onChange={e=>setter(k,e.target.value)}/></div>);
  }
  function DocS({label,k,obj,setter,options}) {
    return (<div className="admin-group"><label className="admin-label">{label}</label><select className="admin-select" value={obj[k]||''} onChange={e=>setter(k,e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></div>);
  }

  function generateBooking() {
    const total = [bc.t1Fee,bc.t2Fee,bc.t3Fee,bc.agencyFee].filter(Boolean).reduce((a,b)=>a+parseFloat(b||0),0);
    setOutput(`BOOKING CONFIRMATION — the[name]\nDoc: ${bc.docNum} · Data: ${bc.docDate}\n\nPROGETTO: ${bc.projectName}\nData servizio: ${bc.serviceDate} · Luogo: ${bc.serviceLocation}\nRevisioni incluse: ${bc.revisions}\nDescrizione: ${bc.projectDesc}\n\nCLIENTE: ${bc.clientName} · ${bc.clientContact}\nEmail: ${bc.clientEmail} · P.IVA: ${bc.clientVat}\n\nCREATIVI:${bc.t1Name?`\n· ${bc.t1Name} — ${bc.t1Role} — EUR ${bc.t1Fee}`:''}${bc.t2Name?`\n· ${bc.t2Name} — ${bc.t2Role} — EUR ${bc.t2Fee}`:''}${bc.t3Name?`\n· ${bc.t3Name} — ${bc.t3Role} — EUR ${bc.t3Fee}`:''}\n\nFEE AGENZIA: EUR ${bc.agencyFee}\nTOTALE: EUR ${total}\nIBAN: ${bc.agencyIban} · P.IVA: ${bc.agencyVat}\nFirmatario: ${bc.agencySignatory}\n\nDIRITTI: ${bc.usageRights} · ${bc.territory} · ${bc.duration} · Esclusiva: ${bc.exclusivity}\nPagamento: ${bc.paymentTerms} giorni\n\nFirmato a ${bc.sigPlace}, il ___________\n\nthe[name] _______________     ${bc.clientName} _______________`);
  }
  function generateQuotation() {
    setOutput(`PRODUCTION QUOTATION — the[name]\nPreventivo: ${q.docNum} · Data: ${q.quotDate} · Validità: ${q.validity}\n\nCLIENTE: ${q.clientName} · ${q.clientContact}\nPROGETTO: ${q.projectName}\n${q.projectDesc}\nOutput: ${q.contentOutput}\nUsage: ${q.usageRights}\n\nVOCI DI BUDGET (EUR escluso IVA):\n· Direzione Artistica: ${q.artDir}\n· Production team: ${q.prodTeam}\n· Fotografo+Crew+Post: ${q.photo}\n· Video+Crew+Post: ${q.video}\n· Stylist: ${q.stylist} · Ass: ${q.stylistAss} · Shopping: ${q.shopping}\n· MUA+Hair: ${q.mua} · Modelli: ${q.models}\n· Attrezzatura: ${q.equipment} · Digital: ${q.digital} · Graphic: ${q.graphic}\n· Location: ${q.location} · Assicurazione: ${q.insurance}\n· Imprevisti 5%: ${q.contingency}${q.extraItem?`\n· ${q.extraItem}: ${q.extraCost}`:''}\n\nTotale produzione: EUR ${q.totalProd}\nAgency fee ${q.agencyFeePct}%: EUR ${q.agencyFee}\nTotale imponibile: EUR ${q.totalNet}\nIVA 22%: EUR ${q.vat}\nTOTALE IVA INCLUSA: EUR ${q.totalGross}\n\nTEMPISTICHE: Totale ${q.timeTotal} · Revisioni: ${q.revisions}\nDurata diritti: ${q.usageDuration}\n\nFirmato a ${q.sigPlace}, il ___________`);
  }
  function generateNDA() {
    setOutput(`ACCORDO DI RISERVATEZZA (NDA) — the[name]\nData: ${nda.docDate}\n\nPARTI:\nDivulgante: ${nda.disclosingParty} · ${nda.disclosingEmail}\nRicevente: ${nda.receivingParty} · ${nda.receivingEmail}\n\nPROGETTO: ${nda.projectName}\n${nda.projectDesc}\n\nLe parti si impegnano a mantenere riservate tutte le informazioni condivise nell'ambito della collaborazione descritta, per una durata di ${nda.ndaDuration} anni dalla firma del presente accordo.\n\nForo competente: ${nda.jurisdiction}\n\nFirmato a ${nda.sigPlace}, il ___________\n\n${nda.disclosingParty} _______________     ${nda.receivingParty} _______________`);
  }
  function generateLicensing() {
    setOutput(`IMAGE LICENSING AGREEMENT — the[name]\nLicenza: ${lic.licenseNumber} · Data: ${lic.licDate}\n\nLICENZIANTE: ${lic.talentName} · ${lic.talentEmail}\nLICENZIATARIO: ${lic.clientName} · ${lic.clientEmail}\n\nMATERIALE: ${lic.contentDesc}\nProduzione: ${lic.productionDate} · Progetto: ${lic.projectName}\nFile: ${lic.fileCount} · Formati: ${lic.fileFormats}\n\nUTILIZZO:\nMedia: ${lic.usageMedia} · Territorio: ${lic.territory}\nDurata: ${lic.usageDuration} · Esclusiva: ${lic.exclusivity}\nFormati output: ${lic.outputFormats}\n\nFEE: EUR ${lic.licenseFee} · Scadenza: ${lic.paymentDueDate}\nForo: ${lic.jurisdiction}\n\nFirmato a ${lic.sigPlace}, il ___________\n\n${lic.talentName} _______________     ${lic.clientName} _______________`);
  }

  function printDoc() {
    const dataMap = {booking:bc,quotation:q,nda:nda,licensing:lic};
    fetch('/api/pdf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:doc,data:dataMap[doc]||{}})})
    .then(r=>r.blob()).then(blob=>{
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download=`thename-${doc}-${Date.now()}.pdf`;a.click();URL.revokeObjectURL(url);
    });
  }

  const docStyle = {padding:"10px 20px",background:"none",border:"1px solid rgba(245,240,235,.15)",fontFamily:"'Archivo Narrow',sans-serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",transition:"all .2s",marginRight:8,marginBottom:8};
  const docStyleActive = {...docStyle,background:"rgba(200,214,34,.08)",borderColor:"var(--lime)",color:"var(--lime)"};
  const docStyleInactive = {...docStyle,color:"rgba(245,240,235,.4)"};

  function CreativeSelector({onSelect}) {
    if(!creatives||creatives.length===0) return null;
    return (
      <div style={{marginBottom:20,padding:"16px 20px",background:"rgba(200,214,34,.06)",border:"1px solid rgba(200,214,34,.15)"}}>
        <div style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",fontFamily:"'Archivo Narrow',sans-serif",color:"var(--lime)",opacity:.7,marginBottom:10}}>Auto-compila da creativo nel network</div>
        <select className="admin-select" defaultValue="" onChange={e=>{const found=creatives.find(c=>c.id===e.target.value);if(found)onSelect(found);}}>
          <option value="">-- Seleziona creativo --</option>
          {creatives.map(c=>(<option key={c.id} value={c.id}>{c.nome} -- {c.ruolo} -- {c.citta}</option>))}
        </select>
      </div>
    );
  }

  useEffect(()=>{ loadData(); },[]);

  async function loadData() {
    setLoading(true);
    try {
      const [c1,c2] = await Promise.all([
        fetch('/api/candidatures').then(r=>r.json()),
        fetch('/api/creatives').then(r=>r.json()),
      ]);
      setCandidatures(Array.isArray(c1)?c1:[]);
      setCreatives(Array.isArray(c2)?c2:[]);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  async function updateStatus(id,status) {
    await fetch('/api/candidatures',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})});
    setCandidatures(cs=>cs.map(c=>c.id===id?{...c,status}:c));
    showToast(status==='approved'?'Candidatura approvata ✓':'Candidatura rifiutata');
  }

  async function promoteToCreative(cand) {
    // Usa promote:true → il PATCH handler inserisce in creatives UNA SOLA VOLTA
    const res = await fetch('/api/candidatures', {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ id: cand.id, status: 'approved', promote: true }),
    });
    const json = await res.json();
    if (!res.ok) { alert('Errore: ' + (json.error || 'operazione fallita')); return; }
    await loadData();
    showToast('Creativo accettato e aggiunto al network ✓');
  }

  async function addCreative() {
    if(!newCreative.nome) return;
    await fetch('/api/creatives',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...newCreative,visible:true})});
    setNewCreative({nome:'',ruolo:'',citta:'',bio:'',tags:'',portfolio:'',availability:'available'});
    await loadData();
    showToast('Creativo aggiunto ✓');
  }

  async function removeCreative(id) {
    if(!window.confirm('Rimuovere questo creativo dalla piattaforma?')) return;
    await fetch('/api/creatives',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});
    await loadData();
    showToast('Creativo rimosso');
  }

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(''),2500);}

  function downloadPDF(c) {
    fetch('/api/pdf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'candidatura',data:c})})
    .then(r=>r.blob()).then(blob=>{
      const url=URL.createObjectURL(blob);const a=document.createElement('a');
      a.href=url;a.download=`thename-candidatura-${(c.nome||'').replace(/\s+/g,'-')}.pdf`;a.click();URL.revokeObjectURL(url);
    });
  }

  return (
    <>
      <div className="admin-topbar">
        <div className="admin-nav">
          <div className="admin-nav-title">the[name] · admin</div>
          <button className="admin-nav-exit" onClick={onExit}>← Esci</button>
        </div>
        <div className="admin-tabs">
          {[['candidature','Candidature'],['network','Network'],['richieste','Richieste Seeker'],['documenti','Documenti']].map(([key,label])=>(
            <button key={key} className={`admin-tab${tab===key?' active':''}`} onClick={()=>setTab(key)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="admin-panel">
        <div className="admin-content">
          {tab==='candidature' && (
            <>
              <div className="admin-section-title">Candidature</div>
              <div className="admin-sub">{candidatures.length} candidature ricevute</div>
              {loading?<div className="loading">Caricamento...</div>:candidatures.map(c=>(
                <div key={c.id} className="cand-card">
                  <div style={{flex:1}}>
                    <div className="cand-name">{c.nome}</div>
                    <div className="cand-meta">{c.citta} · {c.submission_date}</div>
                    <div>{(c.ruoli||'').split(',').map(r=><span key={r} className="cand-role-tag">{r.trim()}</span>)}</div>
                    {c.portfolio&&<div style={{fontSize:12,marginTop:8,color:'rgba(245,240,235,.4)'}}>{c.portfolio}</div>}
                    <div style={{marginTop:12}}><span className={`status-badge status-${c.status||'pending'}`}>{c.status||'pending'}</span></div>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
                    {c.foto_url&&<img src={c.foto_url} style={{width:64,height:64,objectFit:'cover',marginBottom:8}} alt="foto"/>}
                    <button className="btn-approve" onClick={()=>promoteToCreative(c)}>✓ Accetta al network →</button>
                    <button className="btn-reject" onClick={()=>updateStatus(c.id,'rejected')}>Rifiuta</button>
                    <button className="admin-copy-btn" onClick={()=>downloadPDF(c)}>PDF</button>
                  </div>
                </div>
              ))}
            </>
          )}
          {tab==='network' && (
            <>
              <div className="admin-section-title">Network</div>
              <div className="admin-sub">Aggiungi e gestisci creativi</div>
              <div style={{marginBottom:40,padding:32,background:'rgba(245,240,235,.04)',border:'1px solid rgba(245,240,235,.08)'}}>
                <div style={{fontSize:11,letterSpacing:2,color:'var(--lime)',fontFamily:"'Archivo Narrow',sans-serif",textTransform:'uppercase',marginBottom:20}}>Aggiungi creativo manualmente</div>
                <div className="admin-form-grid">
                  <div className="admin-group"><label className="admin-label">Nome</label><input className="admin-input" value={newCreative.nome} onChange={e=>setNewCreative(p=>({...p,nome:e.target.value}))} placeholder="Nome Cognome"/></div>
                  <div className="admin-group"><label className="admin-label">Ruolo</label><input className="admin-input" value={newCreative.ruolo} onChange={e=>setNewCreative(p=>({...p,ruolo:e.target.value}))} placeholder="Art Director"/></div>
                  <div className="admin-group"><label className="admin-label">Città</label><input className="admin-input" value={newCreative.citta} onChange={e=>setNewCreative(p=>({...p,citta:e.target.value}))} placeholder="Milano"/></div>
                  <div className="admin-group"><label className="admin-label">Disponibilità</label>
                    <select className="admin-select" value={newCreative.availability} onChange={e=>setNewCreative(p=>({...p,availability:e.target.value}))}>
                      <option value="available">Disponibile</option><option value="partial">Parziale</option><option value="busy">Occupato</option>
                    </select>
                  </div>
                  <div className="admin-group full"><label className="admin-label">Bio</label><textarea className="admin-textarea" value={newCreative.bio} onChange={e=>setNewCreative(p=>({...p,bio:e.target.value}))}/></div>
                  <div className="admin-group full"><label className="admin-label">Tags (virgola separati)</label><input className="admin-input" value={newCreative.tags} onChange={e=>setNewCreative(p=>({...p,tags:e.target.value}))} placeholder="Fashion, Editorial, Commercial"/></div>
                  <div className="admin-group full"><label className="admin-label">Portfolio (un link per riga)</label><textarea className="admin-textarea" value={newCreative.portfolio} onChange={e=>setNewCreative(p=>({...p,portfolio:e.target.value}))}/></div>
                </div>
                <button className="admin-btn" onClick={addCreative} disabled={!newCreative.nome}>Aggiungi al network →</button>
              </div>
              <div>
                <input className="admin-input" style={{marginBottom:24}} placeholder="Cerca nel network..." value={creativesSearch} onChange={e=>setCreativesSearch(e.target.value)}/>
                {loading?<div className="loading">Caricamento...</div>:creatives
                  .filter(c=>!creativesSearch||c.nome?.toLowerCase().includes(creativesSearch.toLowerCase())||c.ruolo?.toLowerCase().includes(creativesSearch.toLowerCase()))
                  .map(c=>{
                    const avColor=c.availability==='available'?'var(--lime)':c.availability==='partial'?'var(--sand)':'rgba(245,240,235,.2)';
                    return (
                      <div key={c.id} className="admin-creative-card">
                        <div style={{display:'flex',gap:16,alignItems:'center'}}>
                          {c.foto_url&&<img src={c.foto_url} style={{width:48,height:48,objectFit:'cover'}} alt="foto"/>}
                          <div><div className="admin-creative-name">{c.nome}</div><div className="admin-creative-meta"><span className="avail-dot" style={{background:avColor}}/>{c.ruolo} · {c.citta}</div></div>
                        </div>
                        <button className="btn-reject" onClick={()=>removeCreative(c.id)}>Rimuovi</button>
                      </div>
                    );
                  })
                }
              </div>
            </>
          )}
          {tab==='richieste' && (
            <SeekerRequestsTab creatives={creatives} showToast={showToast} />
          )}
          {tab==='documenti' && (
            <>
              <div className="admin-section-title">Documenti</div>
              <div className="admin-sub">Genera documenti professionali the[name]</div>
              <div style={{marginBottom:28,flexWrap:"wrap",display:"flex",gap:4}}>
                {[["booking","01 · Booking Confirmation"],["quotation","02 · Production Quotation"],["nda","03 · NDA"],["licensing","04 · Image Licensing"]].map(([key,label])=>(
                  <button key={key} onClick={()=>{setDoc(key);setOutput('');}} style={doc===key?docStyleActive:docStyleInactive}>{label}</button>
                ))}
              </div>
              <div style={{fontSize:12,color:"rgba(245,240,235,.3)",fontFamily:"'Archivo Narrow',sans-serif",letterSpacing:.5,marginBottom:32}}>
                {doc==="booking"&&"Contratto di ingaggio tra agenzia e cliente per creativi selezionati"}
                {doc==="quotation"&&"Preventivo di produzione dettagliato per brand e clienti"}
                {doc==="nda"&&"Accordo di riservatezza per brief, strategie e materiali inediti"}
                {doc==="licensing"&&"Licenza di utilizzo immagini e contenuti prodotti dai creativi"}
              </div>
              {doc==="booking" && (<>
                <CreativeSelector onSelect={c=>setBc(p=>({...p,t1Name:c.nome||'',t1Role:c.ruolo||''}))}/>
                <DocDiv text="INTESTAZIONE"/><div className="admin-form-grid"><DocF label="N. Documento" k="docNum" obj={bc} setter={sb} placeholder="BC-2025-001"/><DocF label="Data" k="docDate" obj={bc} setter={sb} type="date"/></div>
                <DocDiv text="PROGETTO"/><div className="admin-form-grid"><DocF label="Nome progetto" k="projectName" obj={bc} setter={sb} placeholder="Campagna SS26"/><DocF label="Data servizio" k="serviceDate" obj={bc} setter={sb} type="date"/><DocF label="Luogo" k="serviceLocation" obj={bc} setter={sb} placeholder="Milano"/><DocF label="Revisioni incluse" k="revisions" obj={bc} setter={sb} placeholder="3"/><DocT label="Descrizione" k="projectDesc" obj={bc} setter={sb}/></div>
                <DocDiv text="CLIENTE"/><div className="admin-form-grid"><DocF label="Azienda" k="clientName" obj={bc} setter={sb} placeholder="Brand S.r.l."/><DocF label="Referente" k="clientContact" obj={bc} setter={sb} placeholder="Nome Cognome"/><DocF label="Email" k="clientEmail" obj={bc} setter={sb} placeholder="email@brand.com"/><DocF label="P.IVA" k="clientVat" obj={bc} setter={sb} placeholder="IT00000000000"/></div>
                <DocDiv text="CREATIVI"/><div className="admin-form-grid"><DocF label="Talent 1 Nome" k="t1Name" obj={bc} setter={sb} placeholder="Elena Visconti"/><DocF label="Ruolo" k="t1Role" obj={bc} setter={sb} placeholder="Art Director"/><DocF label="Compenso EUR" k="t1Fee" obj={bc} setter={sb} placeholder="2.000"/><div/><DocF label="Talent 2 Nome" k="t2Name" obj={bc} setter={sb} placeholder="Marco Aurelio"/><DocF label="Ruolo" k="t2Role" obj={bc} setter={sb} placeholder="Fotografo"/><DocF label="Compenso EUR" k="t2Fee" obj={bc} setter={sb} placeholder="3.000"/><div/><DocF label="Talent 3 Nome" k="t3Name" obj={bc} setter={sb}/><DocF label="Ruolo" k="t3Role" obj={bc} setter={sb}/><DocF label="Compenso EUR" k="t3Fee" obj={bc} setter={sb}/></div>
                <DocDiv text="FEE AGENZIA"/><div className="admin-form-grid"><DocF label="Fee the[name] EUR" k="agencyFee" obj={bc} setter={sb} placeholder="2.000"/><DocF label="IBAN" k="agencyIban" obj={bc} setter={sb} placeholder="IT00 X000 0000 0000"/><DocF label="P.IVA the[name]" k="agencyVat" obj={bc} setter={sb} placeholder="IT00000000000"/><DocF label="Firmatario" k="agencySignatory" obj={bc} setter={sb} placeholder="Nome Cognome"/></div>
                <DocDiv text="DIRITTI E UTILIZZI"/><div className="admin-form-grid"><DocFF label="Utilizzi concessi" k="usageRights" obj={bc} setter={sb} placeholder="Social, Web, Stampa"/><DocF label="Territorio" k="territory" obj={bc} setter={sb} placeholder="Italia"/><DocF label="Durata" k="duration" obj={bc} setter={sb} placeholder="24 mesi"/><DocS label="Esclusiva" k="exclusivity" obj={bc} setter={sb} options={["No","Si"]}/><DocS label="Termini pagamento" k="paymentTerms" obj={bc} setter={sb} options={["30","60"]}/><DocF label="Luogo firma" k="sigPlace" obj={bc} setter={sb} placeholder="Firenze"/></div>
                <button className="admin-btn" onClick={generateBooking} disabled={!bc.clientName}>Genera Booking Confirmation</button>
              </>)}
              {doc==="quotation" && (<>
                <DocDiv text="INTESTAZIONE"/><div className="admin-form-grid"><DocF label="N. Preventivo" k="docNum" obj={q} setter={sq} placeholder="QT-2025-001"/><DocF label="Data" k="quotDate" obj={q} setter={sq} type="date"/><DocF label="Validita" k="validity" obj={q} setter={sq} placeholder="7 giorni"/></div>
                <DocDiv text="CLIENTE E PROGETTO"/><div className="admin-form-grid"><DocF label="Cliente" k="clientName" obj={q} setter={sq} placeholder="Brand S.r.l."/><DocF label="Referente" k="clientContact" obj={q} setter={sq} placeholder="Nome Cognome"/><DocF label="Nome progetto" k="projectName" obj={q} setter={sq} placeholder="Campagna SS26"/><DocT label="Descrizione" k="projectDesc" obj={q} setter={sq}/><DocT label="Content Output" k="contentOutput" obj={q} setter={sq}/><DocFF label="Usage Rights" k="usageRights" obj={q} setter={sq}/></div>
                <DocDiv text="BUDGET VOCI (EUR escluso IVA)"/><div className="admin-form-grid"><DocF label="Direzione Artistica" k="artDir" obj={q} setter={sq} placeholder="4.000"/><DocF label="Production team" k="prodTeam" obj={q} setter={sq} placeholder="4.000"/><DocF label="Fotografo + Crew + Post" k="photo" obj={q} setter={sq} placeholder="8.000"/><DocF label="Director + Crew Video + Post" k="video" obj={q} setter={sq} placeholder="4.000"/><DocF label="Stylist" k="stylist" obj={q} setter={sq} placeholder="1.500"/><DocF label="Stylist Assistant" k="stylistAss" obj={q} setter={sq} placeholder="300"/><DocF label="Shopping" k="shopping" obj={q} setter={sq} placeholder="200"/><DocF label="Make-up e Hair" k="mua" obj={q} setter={sq} placeholder="1.200"/><DocF label="Modelli/e" k="models" obj={q} setter={sq} placeholder="4.600"/><DocF label="Attrezzatura extra" k="equipment" obj={q} setter={sq} placeholder="1.000"/><DocF label="Digital specialist" k="digital" obj={q} setter={sq} placeholder="500"/><DocF label="Graphic designer" k="graphic" obj={q} setter={sq} placeholder="500"/><DocF label="Location" k="location" obj={q} setter={sq} placeholder="da quotare"/><DocF label="Assicurazione" k="insurance" obj={q} setter={sq} placeholder="1.500"/><DocF label="Fondo imprevisti 5%" k="contingency" obj={q} setter={sq} placeholder="1.500"/><DocF label="Voce extra (nome)" k="extraItem" obj={q} setter={sq} placeholder="Travel"/><DocF label="Voce extra (importo)" k="extraCost" obj={q} setter={sq} placeholder="800"/></div>
                <DocDiv text="RIEPILOGO"/><div className="admin-form-grid"><DocF label="Totale produzione" k="totalProd" obj={q} setter={sq} placeholder="70.000"/><DocF label="Agency fee %" k="agencyFeePct" obj={q} setter={sq} placeholder="20"/><DocF label="Agency fee EUR" k="agencyFee" obj={q} setter={sq} placeholder="14.000"/><DocF label="Totale imponibile" k="totalNet" obj={q} setter={sq} placeholder="84.000"/><DocF label="IVA 22%" k="vat" obj={q} setter={sq} placeholder="18.480"/><DocF label="Totale IVA inclusa" k="totalGross" obj={q} setter={sq} placeholder="102.480"/></div>
                <DocDiv text="TEMPISTICHE"/><div className="admin-form-grid"><DocF label="Fase creativa" k="timeCreative" obj={q} setter={sq} placeholder="2-3 settimane"/><DocF label="Pre-produzione" k="timePreprod" obj={q} setter={sq} placeholder="1-2 settimane"/><DocF label="Produzione" k="timeProd" obj={q} setter={sq} placeholder="1 settimana"/><DocF label="Post-produzione" k="timePost" obj={q} setter={sq} placeholder="2-3 settimane"/><DocF label="Totale" k="timeTotal" obj={q} setter={sq} placeholder="6-9 settimane"/><DocF label="Revisioni incluse" k="revisions" obj={q} setter={sq} placeholder="3"/><DocF label="Durata diritti" k="usageDuration" obj={q} setter={sq} placeholder="12 mesi"/><DocF label="Luogo firma" k="sigPlace" obj={q} setter={sq} placeholder="Firenze"/></div>
                <button className="admin-btn" onClick={generateQuotation} disabled={!q.clientName}>Genera Production Quotation</button>
              </>)}
              {doc==="nda" && (<>
                <CreativeSelector onSelect={c=>setNda(p=>({...p,receivingParty:c.nome||''}))}/>
                <DocDiv text="PARTI"/><div className="admin-form-grid"><DocF label="Parte Divulgante" k="disclosingParty" obj={nda} setter={sn} placeholder="Brand S.r.l."/><DocF label="Email Divulgante" k="disclosingEmail" obj={nda} setter={sn} placeholder="email@brand.com"/><DocF label="Parte Ricevente" k="receivingParty" obj={nda} setter={sn} placeholder="Nome Cognome"/><DocF label="Email Ricevente" k="receivingEmail" obj={nda} setter={sn} placeholder="email@studio.com"/></div>
                <DocDiv text="PROGETTO"/><div className="admin-form-grid"><DocF label="Nome progetto" k="projectName" obj={nda} setter={sn} placeholder="Campagna SS26"/><DocT label="Descrizione collaborazione" k="projectDesc" obj={nda} setter={sn}/></div>
                <DocDiv text="CONDIZIONI"/><div className="admin-form-grid"><DocF label="Durata riservatezza (anni)" k="ndaDuration" obj={nda} setter={sn} placeholder="2"/><DocF label="Foro competente" k="jurisdiction" obj={nda} setter={sn} placeholder="Firenze"/><DocF label="Data documento" k="docDate" obj={nda} setter={sn} type="date"/><DocF label="Luogo firma" k="sigPlace" obj={nda} setter={sn} placeholder="Firenze"/></div>
                <button className="admin-btn" onClick={generateNDA} disabled={!nda.disclosingParty||!nda.receivingParty}>Genera NDA</button>
              </>)}
              {doc==="licensing" && (<>
                <CreativeSelector onSelect={c=>setLic(p=>({...p,talentName:c.nome||''}))}/>
                <DocDiv text="PARTI"/><div className="admin-form-grid"><DocF label="N. Licenza" k="licenseNumber" obj={lic} setter={sl} placeholder="LIC-2025-001"/><DocF label="Data" k="licDate" obj={lic} setter={sl} type="date"/><DocF label="Licenziante (Creativo)" k="talentName" obj={lic} setter={sl} placeholder="Nome Cognome"/><DocF label="Email Creativo" k="talentEmail" obj={lic} setter={sl} placeholder="email@creativo.com"/><DocF label="Licenziatario (Cliente)" k="clientName" obj={lic} setter={sl} placeholder="Brand S.r.l."/><DocF label="Email Cliente" k="clientEmail" obj={lic} setter={sl} placeholder="email@brand.com"/></div>
                <DocDiv text="CONTENUTO LICENZIATO"/><div className="admin-form-grid"><DocT label="Descrizione materiale" k="contentDesc" obj={lic} setter={sl}/><DocF label="Data produzione" k="productionDate" obj={lic} setter={sl} type="date"/><DocF label="Progetto" k="projectName" obj={lic} setter={sl} placeholder="Campagna SS26"/><DocF label="Numero file" k="fileCount" obj={lic} setter={sl} placeholder="30"/><DocF label="Formati file" k="fileFormats" obj={lic} setter={sl} placeholder="JPG, TIFF, RAW"/></div>
                <DocDiv text="UTILIZZO E CORRISPETTIVO"/><div className="admin-form-grid"><DocS label="Esclusiva" k="exclusivity" obj={lic} setter={sl} options={["No","Si"]}/><DocF label="Tipo licenza" k="licenseType" obj={lic} setter={sl} placeholder="non esclusiva"/><DocFF label="Media / Canali" k="usageMedia" obj={lic} setter={sl} placeholder="Social, Web, Stampa"/><DocF label="Territorio" k="territory" obj={lic} setter={sl} placeholder="Italia"/><DocF label="Durata" k="usageDuration" obj={lic} setter={sl} placeholder="12 mesi"/><DocF label="Formati uscita" k="outputFormats" obj={lic} setter={sl} placeholder="JPG 300dpi"/><DocF label="Fee EUR" k="licenseFee" obj={lic} setter={sl} placeholder="2.000"/><DocF label="Scadenza pagamento" k="paymentDueDate" obj={lic} setter={sl} type="date"/><DocF label="Foro competente" k="jurisdiction" obj={lic} setter={sl} placeholder="Firenze"/><DocF label="Luogo firma" k="sigPlace" obj={lic} setter={sl} placeholder="Firenze"/></div>
                <button className="admin-btn" onClick={generateLicensing} disabled={!lic.clientName||!lic.talentName}>Genera Image Licensing Agreement</button>
              </>)}
              {output && (
                <div className="admin-output">
                  <div className="admin-output-header">
                    <span className="admin-output-label">{doc==="booking"?"Booking Confirmation":doc==="quotation"?"Production Quotation":doc==="nda"?"NDA — Riservatezza":"Image Licensing"} the[name]</span>
                    <div style={{display:"flex",gap:8}}>
                      <button className="admin-copy-btn" onClick={()=>{navigator.clipboard.writeText(output);showToast("copiato");}}>Copia</button>
                      <button className="admin-copy-btn" onClick={printDoc}>Stampa / PDF</button>
                    </div>
                  </div>
                  {output}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {toast&&<div className="toast">{toast}</div>}
    </>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showCommunity, setShowCommunity] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [toast, setToast] = useState('');
  const [creatives, setCreatives] = useState([]);
  const [loadingCreatives, setLoadingCreatives] = useState(true);
  const [lang, setLang] = useState('it');
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSeekerForm, setShowSeekerForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(()=>{
    fetch('/api/creatives').then(r=>r.json()).then(data=>{
      setCreatives(Array.isArray(data)?data:[]);
      setLoadingCreatives(false);
    }).catch(()=>setLoadingCreatives(false));
  },[]);

  const filtered = creatives.filter(c=>{
    const matchCat = cat==='all'||c.ruolo===cat;
    const tags = typeof c.tags==='string'?c.tags:'';
    const matchSearch = !search||
      c.nome?.toLowerCase().includes(search.toLowerCase())||
      c.ruolo?.toLowerCase().includes(search.toLowerCase())||
      c.citta?.toLowerCase().includes(search.toLowerCase())||
      tags.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function navTo(p){setPage(p);setCat('all');setSearch('');setMobileMenuOpen(false);window.scrollTo(0,0);}
  const isSeekerPage = page==='seekers';

  function EmptyState({onJoin}) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">the[creatives] — coming soon</div>
        <div className="empty-state-sub">Il network è in fase di selezione curatoriale. I profili approvati appariranno qui a breve.</div>
        <button className="btn-bracket" onClick={onJoin}>Vuoi far parte del network? →</button>
      </div>
    );
  }

  function CreativeGrid({items}) {
    if(items.length===0) return <EmptyState onJoin={()=>setShowCommunity(true)}/>;
    const palettes = ['#1a1714','#2c1810','#0e1a1c','#1c0e10','#1a1a14','#2a1a14'];
    const accents = ['#c8d622','#e8c49e','#9db3be','#d4426a','#c8d622','#e8c49e'];
    return (
      <div className="creative-grid">
        {items.map((c,i)=>{
          const bg=palettes[i%palettes.length];
          const ac=accents[i%accents.length];
          const avCls=c.availability==='available'?'av-yes':c.availability==='partial'?'av-partial':'av-no';
          const avLabel=c.availability==='available'?'Disponibile':c.availability==='partial'?'Parziale':'Occupato';
          const tags=typeof c.tags==='string'?c.tags.split(',').map(t=>t.trim()).filter(Boolean):[];
          return (
            <div key={c.id} className="c-card" onClick={()=>setSelected(c)}>
              <div className="c-img" style={{background:c.foto_url?'transparent':bg}}>
                <div className="c-img-inner" style={{color:ac+'66',backgroundImage:c.foto_url?`url(${c.foto_url})`:'none',backgroundSize:'cover',backgroundPosition:'center'}}>
                  {!c.foto_url&&(c.ruolo||'').toUpperCase()}
                </div>
                <div className="c-overlay"><span className="c-overlay-text">Vedi profilo →</span></div>
                <span className={`c-avail ${avCls}`}>{avLabel}</span>
              </div>
              <div className="c-body">
                <div className="c-cat">{c.ruolo}</div>
                <div className="c-name">{c.nome}</div>
                <div className="c-city">{c.citta}</div>
                <div className="c-tags">{tags.slice(0,3).map(t=><span key={t} className="c-tag">{t}</span>)}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  useEffect(()=>{
    document.title = 'the[name] — Network di Creativi & Production Agency';
    let desc = document.querySelector('meta[name="description"]');
    if(!desc){desc=document.createElement('meta');desc.name='description';document.head.appendChild(desc);}
    desc.content = 'the[name] è un network selezionato di creativi e una production agency indipendente.';
  },[]);

  if(showAdmin) {
    if(!adminAuth) return (<><style>{G}</style><AdminGate onSuccess={()=>setAdminAuth(true)}/></>);
    return (<><style>{G}</style><AdminPanel onExit={()=>{setShowAdmin(false);setAdminAuth(false);}}/></>);
  }

  return (
    <>
      <style>{G}</style>
      <div className={`mobile-menu${mobileMenuOpen?' open':''}`}>
        <button className="mobile-menu-close" onClick={()=>setMobileMenuOpen(false)}>✕</button>
        <button className="mobile-menu-btn" onClick={()=>navTo('home')}>home</button>
        <button className="mobile-menu-btn" onClick={()=>navTo('creatives')}>the[creatives]</button>
        <button className="mobile-menu-btn" onClick={()=>{setShowSeekerForm(true);setMobileMenuOpen(false);}}>the[seekers]</button>
        <button className="mobile-menu-btn" onClick={()=>navTo('availability')}>{lang==='it'?'disponibilità':'availability'}</button>
        <button className="mobile-menu-btn" onClick={()=>{setShowAdmin(true);setMobileMenuOpen(false);}}>Admin</button>
        <button onClick={()=>setLang(l=>l==='it'?'en':'it')} style={{background:'none',border:'1px solid rgba(245,240,235,.3)',cursor:'pointer',fontSize:11,letterSpacing:2,fontFamily:"'Archivo Narrow',sans-serif",fontWeight:500,color:'var(--off)',padding:'8px 20px',marginTop:8}}>{lang==='it'?'EN':'IT'}</button>
      </div>
      <nav>
        <div className="nav-logo" onClick={()=>navTo('home')}>the[<em>name</em>]</div>
        <div className="nav-links">
          {[['home','home'],['creatives','the[creatives]'],['seekers','the[seekers]'],['availability',lang==='it'?'disponibilita':'availability']].map(([key,label])=>(
            <button key={key} className={`nav-btn${page===key?' active':''}`}
              onClick={()=>key==='seekers'?setShowSeekerForm(true):navTo(key)}>{label}</button>
          ))}
          <button onClick={()=>setLang(l=>l==='it'?'en':'it')} style={{background:'none',border:'1px solid currentColor',cursor:'pointer',fontSize:9,letterSpacing:2,fontFamily:"'Archivo Narrow',sans-serif",fontWeight:500,color:'inherit',padding:'4px 10px',opacity:.5,transition:'opacity .2s'}}>{lang==='it'?'EN':'IT'}</button>
          <button className="nav-btn nav-admin" onClick={()=>setShowAdmin(true)}>Admin</button>
        </div>
        <button className="hamburger" onClick={()=>setMobileMenuOpen(true)} aria-label="Menu"><span/><span/><span/></button>
      </nav>

      {page==='home' && (
        <>
          <div className="hero">
            <div className="hero-noise"/>
            <div className="hero-label">Network · Production Agency</div>
            <h1 className="hero-headline">Unfold<br/>the unseen.<br/>Find the[<em>name</em>].<br/>Be the[<em>name</em>].</h1>
            <div className="hero-bottom">
              <p className="hero-desc">
                {lang==='it'?"the[name] è un network selezionato di creativi e una production agency indipendente.":"the[name] is a curated network of creatives and an independent production agency."}
                <br/><strong>the[creatives]</strong> · <strong>the[seekers]</strong>
              </p>
              <div className="hero-ctas">
                <button className="btn-bracket" onClick={()=>navTo('creatives')}>the[creatives] →</button>
                <button className="btn-bracket" onClick={()=>setShowSeekerForm(true)}>the[seekers] →</button>
              </div>
              <div className="hero-scroll">Scroll</div>
            </div>
          </div>
          <div className="seeker-banner">
            <div className="seeker-banner-title">{lang==='it'?"sei un":"are you a"}<br/><em>{lang==='it'?"seeker?":"seeker?"}</em></div>
            <div className="seeker-banner-right">
              <p className="seeker-banner-sub">{lang==='it'?"Hai un progetto in mente e stai cercando il creativo giusto? Scrivici direttamente.":"Have a project in mind and looking for the right creative? Contact us directly."}</p>
              <button className="btn-seeker" onClick={()=>setShowSeekerForm(true)} style={{border:'none',cursor:'pointer'}}>{lang==='it'?'Cerca il talento →':'Find the talent →'}</button>
            </div>
          </div>
          <div className="comm-strip">
            <div className="comm-tag-label">the[community]</div>
            <div className="comm-big-title">{lang==='it'?"Sei un":"Are you a"}<br/><em>{lang==='it'?"creativo?":"creative?"}</em><br/>{lang==='it'?"Entra nel":"Join the"}<br/>{lang==='it'?"network.":"network."}</div>
            <p className="comm-body-text">{lang==='it'?"the[name] seleziona ":"the[name] selects "}<strong>{lang==='it'?"talenti emergenti e professionisti affermati":"emerging talents and established professionals"}</strong>{lang==='it'?" del mondo moda, comunicazione e cultura visiva.":" from fashion, communication and visual culture."}</p>
            <div>
              <button className="btn-comm" onClick={()=>setShowCommunity(true)}>{lang==='it'?'Compila il Talent Form →':'Fill in the Talent Form →'}</button>
              <div className="comm-note">{lang==='it'?"Selezione curatoriale · Risposta entro 7 giorni":"Curatorial selection · Response within 7 days"}</div>
            </div>
            <div className="comm-stats">
              <div><div className="comm-stat-n">50+</div><div className="comm-stat-l">{lang==='it'?"figure creative":"creatives"}</div></div>
              <div><div className="comm-stat-n">10</div><div className="comm-stat-l">{lang==='it'?"città italiane":"italian cities"}</div></div>
              <div><div className="comm-stat-n">100%</div><div className="comm-stat-l">{lang==='it'?"selezionati":"curated"}</div></div>
            </div>
          </div>
          <div className="services" style={{background:'#fff'}}>
            <div className="section-title" style={{color:'var(--ink)'}}>{lang==='it'?"chi siamo?":"who we are?"}<br/><em style={{color:'var(--terra)'}}>{lang==='it'?"Persone che credono nel potenziale.":"People who believe in potential."}</em><br/>{lang==='it'?"E lo attivano.":"And activate it."}</div>
            <div className="services-grid">
              {[
                {num:'01',name:lang==='it'?'Scouting professionale':'Professional Scouting',desc:lang==='it'?'Non siamo un database. Siamo una piattaforma curatoriale.':'We are not a database. We are a curatorial platform.',tag:'Curated'},
                {num:'02',name:lang==='it'?'Produzione end-to-end':'End-to-end Production',desc:lang==='it'?'Gestione completa dei progetti dal concept al delivery.':'Complete project management from concept to delivery.',tag:'Full Service'},
                {num:'03',name:lang==='it'?'Piattaforma digitale':'Digital Platform',desc:lang==='it'?'Portfolio Builder, Smart Search, Matchmaking.':'Portfolio Builder, Smart Search, Matchmaking.',tag:'Aspirational'},
                {num:'04',name:lang==='it'?'Media brand':'Media Brand',desc:lang==='it'?'Li raccontiamo. Newsletter, case study, trend report.':'We tell their stories. Newsletter, case studies, trend reports.',tag:'Aspirational'},
              ].map(s=>(
                <div key={s.num} className="service-item">
                  <div className="service-num">{s.num}</div>
                  <div className="service-name">{s.name}</div>
                  <div className="service-desc">{s.desc}</div>
                  <div className="service-tag">{s.tag}</div>
                </div>
              ))}
            </div>
          </div>
          <footer>
            <div><div className="footer-logo">the[<em>name</em>]</div><div className="footer-tagline">{lang==='it'?"questo è solo l'inizio.":"this is just the beginning."}</div></div>
            <div className="footer-contact">
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              <div style={{display:'flex',gap:20,marginTop:20}}>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener" style={{color:'var(--off)',textDecoration:'none',fontFamily:"'Archivo Narrow',sans-serif",fontSize:10,letterSpacing:2,textTransform:'uppercase',opacity:.5}}>Instagram ↗</a>
                <a href="https://www.linkedin.com/company/findthename" target="_blank" rel="noopener" style={{color:'var(--off)',textDecoration:'none',fontFamily:"'Archivo Narrow',sans-serif",fontSize:10,letterSpacing:2,textTransform:'uppercase',opacity:.5}}>LinkedIn ↗</a>
              </div>
            </div>
            <div className="footer-copy">
              {lang==='it'?'© 2026 the[name] · Network selezionato di creativi · Production agency indipendente':'© 2026 the[name] · Curated network of creatives · Independent production agency'}
              {' '}·{' '}
              <button onClick={()=>setShowPrivacy(true)} style={{background:'none',border:'none',cursor:'pointer',color:'inherit',fontSize:'inherit',opacity:.6,textDecoration:'underline',padding:0,fontFamily:'inherit',letterSpacing:'inherit'}}>Privacy Policy</button>
              {' '}·{' '}
              <button onClick={()=>setShowTerms(true)} style={{background:'none',border:'none',cursor:'pointer',color:'inherit',fontSize:'inherit',opacity:.6,textDecoration:'underline',padding:0,fontFamily:'inherit',letterSpacing:'inherit'}}>Termini di Servizio</button>
            </div>
          </footer>
        </>
      )}

      {page==='creatives' && (
        <div style={{paddingTop:80}}>
          <div className="section">
            <div className="section-header">
              <div className="section-title">the[<em>creatives</em>]</div>
              <div className="section-count">{filtered.length} profili selezionati</div>
            </div>
            <div className="cat-tabs">
              {CATEGORIES.map(c=><button key={c.key} className={`cat-tab${cat===c.key?' active':''}`} onClick={()=>setCat(c.key)}>{c.label}</button>)}
            </div>
            {loadingCreatives?<div className="loading">Caricamento profili...</div>:<CreativeGrid items={filtered}/>}
          </div>
        </div>
      )}

      {page==='seekers' && (
        <div style={{paddingTop:80}}>
          <div className="seekers-hero">
            <div className="seekers-title">trova<br/><em>il creativo</em><br/>giusto.</div>
            <p className="seekers-sub">Non è una gallery. Ogni profilo in the[name] è selezionato per linguaggio, coerenza e potenziale.</p>
          </div>
          <div className="section">
            <div className="search-wrap">
              <span className="search-icon">↳</span>
              <input className="search-input" placeholder="Cerca per ruolo, skill, citta..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <div className="cat-tabs">
              {CATEGORIES.map(c=><button key={c.key} className={`cat-tab${cat===c.key?' active':''}`} onClick={()=>setCat(c.key)}>{c.label}</button>)}
            </div>
            {loadingCreatives?<div className="loading">Caricamento profili...</div>:<CreativeGrid items={filtered}/>}
            <div style={{marginTop:60,padding:'60px 0',borderTop:'1px solid rgba(13,11,10,.1)',textAlign:'center'}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:300,fontStyle:'italic',marginBottom:12}}>Non trovi quello che cerchi?</div>
              <div style={{fontSize:14,color:'var(--mid)',marginBottom:28,fontWeight:300}}>Scrivici direttamente — curiamo ogni ricerca su misura.</div>
              <a href={`mailto:${CONTACT_EMAIL}`} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontStyle:'italic',color:'var(--ink)',borderBottom:'1px solid var(--ink)',paddingBottom:4,textDecoration:'none'}}>{CONTACT_EMAIL}</a>
            </div>
          </div>
        </div>
      )}

      {page==='availability' && (
        <div style={{paddingTop:80}}>
          <div className="section">
            <div className="section-header">
              <div className="section-title">disponibilita<br/><em>corrente</em></div>
              <div className="section-count">{creatives.length} creativi</div>
            </div>
            <div className="avail-grid">
              {creatives.map(c=>{
                const avCls=c.availability==='available'?'av-yes':c.availability==='partial'?'av-partial':'av-no';
                const avLabel=c.availability==='available'?'Disponibile':c.availability==='partial'?'Parziale':'Occupato';
                return (
                  <div key={c.id} className="avail-card" onClick={()=>setSelected(c)}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
                      <div><div className="avail-name">{c.nome}</div><div className="avail-role">{c.ruolo} · {c.citta}</div></div>
                      <span className={`c-avail ${avCls}`} style={{position:'static'}}>{avLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selected&&<CreativeModal c={selected} onClose={()=>setSelected(null)} onCommunity={()=>setShowCommunity(true)} isSeekerPage={isSeekerPage}/>}
      {showCommunity&&<CommunityForm onClose={()=>setShowCommunity(false)}/>}
      {showPrivacy&&<PrivacyPolicy onClose={()=>setShowPrivacy(false)}/>}
      {showTerms&&<TermsOfService onClose={()=>setShowTerms(false)}/>}
      {showSeekerForm&&<SeekerForm onClose={()=>setShowSeekerForm(false)}/>}
      {toast&&<div className="toast">{toast}</div>}

      {!cookieAccepted&&(
        <div className="cookie-banner">
          <div className="cookie-text">
            Questo sito utilizza cookie tecnici necessari al funzionamento. Raccogliamo dati personali tramite il Talent Form nel rispetto del GDPR UE 2016/679.{' '}
            <button onClick={()=>setShowPrivacy(true)} style={{background:'none',border:'none',color:'var(--lime)',cursor:'pointer',fontSize:12,textDecoration:'underline',padding:0}}>Privacy Policy</button>
            {' '}·{' '}
            <button onClick={()=>setShowTerms(true)} style={{background:'none',border:'none',color:'var(--lime)',cursor:'pointer',fontSize:12,textDecoration:'underline',padding:0}}>Termini di Servizio</button>
          </div>
          <button className="cookie-btn" onClick={()=>setCookieAccepted(true)}>Accetto</button>
        </div>
      )}
    </>
  );
}
