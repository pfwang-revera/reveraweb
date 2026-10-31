(function(){
/* ---------- language detection ----------
   English pages live at the site root; translations live in /fr/ and /zh/
   with identical file names. The same site.js serves every language. */
var path=location.pathname;
var file=(path.replace(/.*\//,'')||'index.html');
var hl=(document.documentElement.lang||'en').toLowerCase();
var L=hl.indexOf('zh')===0?'zh':(hl.indexOf('fr')===0?'fr':'en');
var ROOT=L==='en'?'':'../';
var onHome=(file==='index.html');
var LANGS=[
  {code:'en',dir:'',label:'English (Global)',short:'Global / EN',hl:'en'},
  {code:'fr',dir:'fr/',label:'Français',short:'FR',hl:'fr'},
  {code:'zh',dir:'zh/',label:'简体中文',short:'中文',hl:'zh-Hans'}
];
var SOON=[['Deutsch','de'],['Español','es'],['Italiano','it'],['Nederlands','nl'],['Português','pt'],['日本語','ja'],['한국어','ko']];

var T={
 en:{partners:'Partners',resources:'Resources',contact:'Contact',login:'Log in',more:'More languages coming',soon:'Soon',
   platform:'Platform',solutions:'Solutions',pricing:'Pricing',customers:'Customers',contactSales:'Contact sales',demo:'Book a demo',menu:'Open menu',home:'Keystone home',
   tagline:'Software and expert verification. One platform for product compliance and sustainability.',
   addr:"Revera Limited<br>The Black Church, St. Mary's Place<br>Dublin 7, D07 P4AX, Ireland",
   f_overview:'Keystone overview',f_sc:'Supply chain requests',f_lca:'LCA calculator',f_eudr:'EUDR',f_dpp:'Digital Product Passport',f_onb:'Onboarding',f_ver:'Verification',
   f_every:'Every team',f_comp:'For compliance',f_it:'For IT &amp; data',f_fin:'For finance',f_wf:'Today vs Keystone',
   f_res:'Whitepapers &amp; guides',f_start:'Where to start',f_faq:'FAQ',f_company:'Company',f_about:'About',f_careers:'Careers',
   rights:'© 2026 Revera Limited. All rights reserved.',privacy:'Privacy',terms:'Terms',security:'Security'},
 fr:{partners:'Partenaires',resources:'Ressources',contact:'Contact',login:'Connexion',more:'Autres langues à venir',soon:'Bientôt',
   platform:'Plateforme',solutions:'Solutions',pricing:'Tarifs',customers:'Clients',contactSales:'Contacter les ventes',demo:'Réserver une démo',menu:'Ouvrir le menu',home:'Accueil Keystone',
   tagline:'Logiciel et vérification par des experts. Une plateforme pour la conformité et la durabilité des produits.',
   addr:"Revera Limited<br>The Black Church, St. Mary's Place<br>Dublin 7, D07 P4AX, Irlande",
   f_overview:'Présentation de Keystone',f_sc:'Demandes fournisseurs',f_lca:'Calculateur ACV',f_eudr:'EUDR',f_dpp:'Passeport numérique de produit',f_onb:'Mise en route',f_ver:'Vérification',
   f_every:'Toutes les équipes',f_comp:'Pour la conformité',f_it:'Pour l’IT et les données',f_fin:'Pour la finance',f_wf:'Aujourd’hui vs Keystone',
   f_res:'Livres blancs et guides',f_start:'Par où commencer',f_faq:'FAQ',f_company:'Entreprise',f_about:'À propos',f_careers:'Carrières',
   rights:'© 2026 Revera Limited. Tous droits réservés.',privacy:'Confidentialité',terms:'Conditions',security:'Sécurité'},
 zh:{partners:'合作伙伴',resources:'资源',contact:'联系我们',login:'登录',more:'更多语言即将推出',soon:'即将推出',
   platform:'平台',solutions:'解决方案',pricing:'价格',customers:'客户',contactSales:'联系销售',demo:'预约演示',menu:'打开菜单',home:'Keystone 首页',
   tagline:'软件加专家验证。一个平台，管理产品合规与可持续发展。',
   addr:'Revera Limited<br>The Black Church, St. Mary\'s Place<br>Dublin 7, D07 P4AX, 爱尔兰',
   f_overview:'Keystone 概览',f_sc:'供应链数据请求',f_lca:'LCA 计算器',f_eudr:'EUDR',f_dpp:'数字产品护照',f_onb:'上线接入',f_ver:'验证',
   f_every:'所有团队',f_comp:'合规团队',f_it:'IT 与数据团队',f_fin:'财务团队',f_wf:'现在 vs Keystone',
   f_res:'白皮书与指南',f_start:'从哪里开始',f_faq:'常见问题',f_company:'公司',f_about:'关于我们',f_careers:'招聘',
   rights:'© 2026 Revera Limited. 保留所有权利。',privacy:'隐私政策',terms:'服务条款',security:'安全'}
};
var t=T[L]||T.en;
function fix(s){return s.replace(/SECTOKEN/g, onHome?'#':'index.html#');}
var CUR=LANGS.filter(function(x){return x.code===L;})[0]||LANGS[0];
var CHECK='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12l4 4 10-10" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var langItems=LANGS.map(function(x){
  var href=ROOT+x.dir+file+location.hash;
  return '<a href="'+href+'" hreflang="'+x.hl+'" lang="'+x.hl+'" class="lg-opt'+(x.code===L?' lg-cur':'')+'"'+(x.code===L?' aria-current="true"':'')+'><span class="lg-n">'+x.label+'</span>'+(x.code===L?CHECK:'')+'</a>';
}).join('');
var soonItems=SOON.map(function(x){return '<li><span class="lg-n" lang="'+x[1]+'">'+x[0]+'</span><span class="lg-soon">'+t.soon+'</span></li>';}).join('');

var UTIL=fix(`<div class="util">
  <div class="wrap">
    <a href="partners.html">${t.partners}</a><span class="sep"></span>
    <a href="resources.html">${t.resources}</a><span class="sep"></span>
    <a href="contact.html">${t.contact}</a><span class="sep"></span>
    <div class="lang" id="langdd"><button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false" onclick="var d=this.parentNode,o=d.classList.toggle('open');this.setAttribute('aria-expanded',o)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" stroke="currentColor" stroke-width="1.7"/></svg>${CUR.short}<svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="lang-menu" role="menu">${langItems}<div class="lg-k">${t.more}</div><ul>${soonItems}</ul></div></div><span class="sep"></span>
    <a href="https://keystone.revera8.com">${t.login}</a>
  </div>
</div>`);
var HEADER=fix(`<header>
  <div class="wrap nav">
    <a class="brand" href="index.html" aria-label="${t.home}">keystone<span style="color:#DC2626">.</span></a>
    <nav class="nav-links" id="navlinks" aria-label="Primary">
      <a href="SECTOKENsec-features">${t.platform} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <a href="SECTOKENsec-teams">${t.solutions} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <a href="pricing.html">${t.pricing}</a>
      <a href="resources.html">${t.resources}</a>
      <a href="SECTOKENsec-cases">${t.customers}</a>
    </nav>
    <div class="nav-right">
      <a href="contact.html" class="btn btn-outline">${t.contactSales}</a>
      <a href="book-a-demo.html" class="btn btn-nav">${t.demo}</a>
      <button class="menu-btn" aria-label="${t.menu}" onclick="document.getElementById('navlinks').classList.toggle('open')"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`);
var FOOTER=fix(`<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="foot-brand">keystone<span style="color:#DC2626">.</span></div>
        <p>${t.tagline}</p>
        <p class="foot-addr">${t.addr}</p>
      </div>
      <div class="fcol"><h4>${t.platform}</h4><a href="SECTOKENsec-features">${t.f_overview}</a><a href="supply-chain.html">${t.f_sc}</a><a href="lca.html">${t.f_lca}</a><a href="eudr.html">${t.f_eudr}</a><a href="dpp.html">${t.f_dpp}</a><a href="onboarding.html">${t.f_onb}</a><a href="verification.html">${t.f_ver}</a></div>
      <div class="fcol"><h4>${t.solutions}</h4><a href="SECTOKENsec-teams">${t.f_every}</a><a href="team-compliance.html">${t.f_comp}</a><a href="it-data-brief.html">${t.f_it}</a><a href="cfo-brief.html">${t.f_fin}</a><a href="SECTOKENsec-workflow">${t.f_wf}</a></div>
      <div class="fcol"><h4>${t.resources}</h4><a href="resources.html">${t.f_res}</a><a href="dpp-eudr-checklist.html">${t.f_start}</a><a href="SECTOKENsec-faq">${t.f_faq}</a><a href="SECTOKENsec-cases">${t.customers}</a><a href="pricing.html">${t.pricing}</a></div>
      <div class="fcol"><h4>${t.f_company}</h4><a href="about.html">${t.f_about}</a><a href="partners.html">${t.partners}</a><a href="careers.html">${t.f_careers}</a><a href="contact.html">${t.contact}</a></div>
    </div>
    <div class="foot-bot">
      <span>${t.rights}</span>
      <span><a href="privacy.html">${t.privacy}</a> &nbsp; <a href="terms.html">${t.terms}</a> &nbsp; <a href="security.html">${t.security}</a> &nbsp; <a href="https://www.linkedin.com/company/revera8" target="_blank" rel="noopener">LinkedIn</a></span>
    </div>
  </div>
</footer>`);
var top=document.getElementById('kw-top'); if(top) top.outerHTML=UTIL+HEADER;
var bot=document.getElementById('kw-bottom'); if(bot) bot.outerHTML=FOOTER;
document.addEventListener('click',function(e){var d=document.getElementById('langdd');if(d&&!d.contains(e.target)){d.classList.remove('open');d.querySelector('button').setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var d=document.getElementById('langdd');if(d){d.classList.remove('open');}}});
var nl=document.getElementById('navlinks'); if(nl){document.querySelectorAll('#navlinks a').forEach(function(a){a.addEventListener('click',function(){nl.classList.remove('open');});});}
})();
