/* TVMON Flix for TizenBrew v1.0.0 — build.py 로 만든 파일입니다. 직접 고치지 마세요. */
(function () {
  'use strict';
  if (window.__nfxTvLoaded) return;
  window.__nfxTvLoaded = true;
  var NFX_TV = true;
  var HOST_RE = /(^|\.)tvmon\d*\.[a-z.]+$/i;
  var onTvmon = HOST_RE.test(location.hostname);

  // chrome.storage 대신 localStorage
  function area(prefix) {
    function readKey(k, def) {
      try { var v = localStorage.getItem(prefix + k); return v == null ? def : JSON.parse(v); }
      catch (e) { return def; }
    }
    return {
      get: function (defs, cb) {
        var o = {};
        Object.keys(defs || {}).forEach(function (k) { o[k] = readKey(k, defs[k]); });
        if (cb) cb(o);
      },
      set: function (obj, cb) {
        Object.keys(obj).forEach(function (k) {
          try { localStorage.setItem(prefix + k, JSON.stringify(obj[k])); } catch (e) {}
        });
        if (cb) cb();
      },
      remove: function (keys, cb) {
        [].concat(keys).forEach(function (k) { localStorage.removeItem(prefix + k); });
        if (cb) cb();
      }
    };
  }
  var chrome = { storage: { sync: area('nfx-sync:'), local: area('nfx-local:') }, runtime: {} };

  // 개발자도구 차단 스크립트(외부 CDN)는 붙이지 않는다. 티비몬 서버 쪽 요청은 그대로 둔다.
  if (onTvmon) {
    var isDevtoolBlocker = function (n) {
      return n && n.tagName === 'SCRIPT' &&
        (/disable-devtool/i.test(n.src || '') || (n.hasAttribute && n.hasAttribute('disable-devtool-auto')));
    };
    var nativeAppend = Node.prototype.appendChild;
    var nativeInsert = Node.prototype.insertBefore;
    Node.prototype.appendChild = function (n) { return isDevtoolBlocker(n) ? n : nativeAppend.call(this, n); };
    Node.prototype.insertBefore = function (n, r) { return isDevtoolBlocker(n) ? n : nativeInsert.call(this, n, r); };
  }

  var CSS = "/* 티비몬 광고 영역 숨김.\n   매니페스트로 페이지가 그려지기 전에 들어오고, 티비몬에서만 붙는 html.nfx-ads 아래에서만 동작한다.\n   요소는 그대로 두고(이미지·스크립트 요청은 평소대로) 화면에서만 가린다. */\nhtml.nfx-ads .banner_wrap2,\nhtml.nfx-ads .banner-area,\nhtml.nfx-ads .banner-item,\nhtml.nfx-ads .row-banner,\nhtml.nfx-ads [id^=\"fixed-banner-container\"],\nhtml.nfx-ads #modal_con,\nhtml.nfx-ads a[href*=\"/1.php\"],\nhtml.nfx-ads a[href*=\"banner.php\"],\nhtml.nfx-ads a[href*=\"t.me/tvmon123\"],\nhtml.nfx-ads img[src*=\"/data/banner/\"],\nhtml.nfx-ads img[src*=\"/AD/\"] {\n  display: none !important;\n}\n\n/* ================================================================\n   TVMON Flix — 넷플릭스풍 화면\n   ================================================================ */\n:root {\n  --nfx-bg: #141414;\n  --nfx-red: #e50914;\n  --nfx-text: #ffffff;\n  --nfx-dim: #a3a3a3;\n  --nfx-card: #222;\n  --nfx-gutter: 4%;\n  --nfx-font: -apple-system, BlinkMacSystemFont, \"Apple SD Gothic Neo\", \"Pretendard\", \"Noto Sans KR\", \"Malgun Gothic\", sans-serif;\n}\n\n/* 화면을 다 만들기 전에는 원래 페이지가 번쩍 보이지 않게 가린다 */\nhtml.nfx-loading { background: #141414 !important; }\nhtml.nfx-loading body { opacity: 0 !important; }\nhtml.nfx-ui body { transition: opacity .2s ease; }\n\nhtml.nfx-ui,\nhtml.nfx-ui body {\n  background: var(--nfx-bg) !important;\n  color: var(--nfx-text) !important;\n  font-family: var(--nfx-font) !important;\n}\nhtml.nfx-ui body { margin: 0 !important; padding: 0 !important; }\n\n/* 사이트 원래 머리·옆 메뉴·하단·떠 있는 버튼 숨김 (모든 페이지 공통) */\nhtml.nfx-ui #header_wrap,\nhtml.nfx-ui .header_mobile,\nhtml.nfx-ui #side_wrap,\nhtml.nfx-ui #float,\nhtml.nfx-ui #float_search,\nhtml.nfx-ui #top_btn,\nhtml.nfx-ui #footer_wrap,\nhtml.nfx-ui #body_wrap > .notice,\nhtml.nfx-ui .search_layer {\n  display: none !important;\n}\n\n/* 직접 새로 그리는 페이지는 원래 내용 전체를 숨긴다 */\nhtml.nfx-page-home #container_wrap,\nhtml.nfx-page-list #container_wrap,\nhtml.nfx-page-search #container_wrap {\n  display: none !important;\n}\n\n/* 원래 내용을 살려 두는 페이지(재생·기타)는 여백만 정리 */\nhtml.nfx-page-watch #container_wrap,\nhtml.nfx-page-generic #container_wrap,\nhtml.nfx-page-watch #body_wrap,\nhtml.nfx-page-generic #body_wrap,\nhtml.nfx-page-watch #content_wrap,\nhtml.nfx-page-generic #content_wrap {\n  margin: 0 !important;\n  padding: 0 !important;\n  width: 100% !important;\n  max-width: none !important;\n  float: none !important;\n  left: auto !important;\n  background: transparent !important;\n  box-sizing: border-box !important;\n}\nhtml.nfx-page-generic #body_wrap { padding: 84px var(--nfx-gutter) 40px !important; }\n\n/* ---------------------------------------------------------------- 공통 */\n.nfx-scope, .nfx-scope * { box-sizing: border-box; }\n.nfx-scope { font-family: var(--nfx-font); color: var(--nfx-text); line-height: 1.4; -webkit-font-smoothing: antialiased; }\n.nfx-scope a { color: inherit; text-decoration: none; }\n.nfx-scope h1, .nfx-scope h2, .nfx-scope p {\n  margin: 0; padding: 0 !important; border: 0 !important; background: none !important;\n  float: none !important; width: auto !important; position: static !important; text-indent: 0 !important;\n  line-height: 1.3; color: inherit; letter-spacing: normal;\n}\n.nfx-scope h1::before, .nfx-scope h1::after, .nfx-scope h2::before, .nfx-scope h2::after { content: none !important; }\n.nfx-scope .nfx-watch-story { margin-bottom: 0 !important; line-height: 1.6; }\n.nfx-scope .nfx-episodes-head h2 { margin: 0 !important; }\n.nfx-scope button { font-family: inherit; }\n\n#nfx-app { min-height: 100vh; background: var(--nfx-bg); overflow-x: hidden; }\n\n/* ---------------------------------------------------------------- 머리 */\n#nfx-header {\n  position: fixed; top: 0; left: 0; right: 0; z-index: 2147483000;\n  height: 68px; padding: 0 var(--nfx-gutter);\n  display: flex; align-items: center; gap: 28px;\n  background: linear-gradient(180deg, rgba(0,0,0,.75) 10%, rgba(0,0,0,0));\n  transition: background-color .4s ease;\n}\n#nfx-header.is-solid { background-color: var(--nfx-bg); }\n#nfx-header .nfx-logo {\n  font-family: \"Bebas Neue\", \"Arial Black\", Impact, var(--nfx-font);\n  font-weight: 900; font-size: 30px; letter-spacing: 1px;\n  color: var(--nfx-red); flex: none; transform: scaleY(1.15);\n}\n#nfx-header .nfx-nav { display: flex; align-items: center; gap: 20px; flex: 1; min-width: 0; }\n#nfx-header .nfx-nav > a,\n#nfx-header .nfx-more-menu > button {\n  font-size: 14px; color: #e5e5e5; white-space: nowrap; transition: color .3s;\n  background: none; border: 0; padding: 0; cursor: pointer;\n}\n#nfx-header .nfx-nav a:hover,\n#nfx-header .nfx-more-menu > button:hover { color: #b3b3b3; }\n#nfx-header .nfx-nav a.is-active { color: #fff; font-weight: 700; }\n#nfx-header .nfx-more-menu { position: relative; }\n#nfx-header .nfx-more-list {\n  display: none; position: absolute; top: 30px; left: -16px; min-width: 170px;\n  background: rgba(0,0,0,.92); border: 1px solid rgba(255,255,255,.15); border-top: 2px solid #e5e5e5;\n  padding: 10px 0;\n}\n#nfx-header .nfx-more-menu.is-open .nfx-more-list { display: block; }\n#nfx-header .nfx-more-list a { display: block; padding: 8px 18px; font-size: 14px; color: #e5e5e5; }\n#nfx-header .nfx-more-list a:hover { text-decoration: underline; }\n\n#nfx-header .nfx-search {\n  display: flex; align-items: center; margin: 0 0 0 auto; padding: 0;\n  border: 1px solid transparent; transition: all .3s ease; height: 36px;\n}\n#nfx-header .nfx-search.is-open { background: rgba(0,0,0,.85); border-color: #fff; }\n#nfx-header .nfx-search-btn { background: none; border: 0; color: #fff; padding: 0 8px; cursor: pointer; display: flex; }\n#nfx-header .nfx-search input {\n  width: 0; padding: 0; border: 0; outline: 0; background: transparent; color: #fff;\n  font-size: 14px; transition: width .3s ease; height: 34px; font-family: inherit;\n}\n#nfx-header .nfx-search.is-open input { width: 220px; padding-right: 10px; }\n\n/* ---------------------------------------------------------------- 히어로 */\n.nfx-hero {\n  position: relative; height: 88vh; min-height: 460px;\n  overflow: hidden; margin-bottom: -6vw; z-index: 0;\n}\n/* 층 순서를 못 박는다(배경 사진이 어두운 그라데이션 위로 비치는 일 방지) */\n.nfx-hero > .nfx-hero-bg { z-index: 0; }\n.nfx-hero > .nfx-hero-shade { z-index: 1; }\n.nfx-hero > .nfx-hero-inner { z-index: 2; }\n.nfx-hero > .nfx-hero-dots { z-index: 3; }\n.nfx-hero-bg {\n  position: absolute; top: -40px; right: -40px; bottom: -40px; left: -40px; background-size: cover; background-position: center 20%;\n  filter: blur(28px) saturate(1.2) brightness(.55); transform: scale(1.1);\n  transition: background-image .6s ease;\n}\n.nfx-hero-shade {\n  position: absolute; top: 0; right: 0; bottom: 0; left: 0;\n  background:\n    linear-gradient(180deg, rgba(20,20,20,0) 45%, rgba(20,20,20,.7) 72%, var(--nfx-bg) 92%),\n    linear-gradient(77deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.4) 45%, rgba(0,0,0,0) 75%);\n}\n.nfx-hero-inner {\n  position: absolute; top: 0; right: 0; bottom: 0; left: 0; padding: 0 var(--nfx-gutter);\n  display: flex; align-items: center; justify-content: space-between; gap: 40px;\n}\n.nfx-hero-content { max-width: 560px; padding-top: 40px; }\n.nfx-hero-kicker {\n  font-size: 13px; font-weight: 700; letter-spacing: 3px; color: var(--nfx-dim);\n  text-transform: uppercase; margin-bottom: 14px;\n}\n.nfx-hero-kicker::before { content: \"T\"; color: var(--nfx-red); font-weight: 900; font-size: 22px; margin-right: 8px; vertical-align: -2px; letter-spacing: 0; }\n.nfx-hero-title {\n  font-size: 68px; font-weight: 800; line-height: 1.08;\n  text-shadow: 2px 2px 8px rgba(0,0,0,.6); margin-bottom: 14px; word-break: keep-all;\n}\n.nfx-hero-meta { font-size: 15px; color: #46d369; font-weight: 600; margin-bottom: 12px; white-space: pre; min-height: 1em; }\n.nfx-hero-story {\n  font-size: 18px; line-height: 1.55; color: #e5e5e5;\n  text-shadow: 1px 1px 4px rgba(0,0,0,.7); margin-bottom: 22px !important;\n  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; min-height: 1em;\n}\n.nfx-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }\n.nfx-hero-poster {\n  height: 78%; max-height: 620px; aspect-ratio: 2 / 3; object-fit: cover; border-radius: 6px;\n  box-shadow: 0 30px 60px rgba(0,0,0,.6); flex: none; margin-top: 30px;\n}\n.nfx-hero.is-in .nfx-hero-content { animation: nfx-fade-up .7s ease both; }\n.nfx-hero.is-in .nfx-hero-poster { animation: nfx-fade-in .9s ease both; }\n@keyframes nfx-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }\n@keyframes nfx-fade-in { from { opacity: 0; transform: scale(.97); } to { opacity: 1; transform: none; } }\n.nfx-hero-dots { position: absolute; right: var(--nfx-gutter); bottom: 9vw; display: flex; gap: 6px; z-index: 2; }\n.nfx-hero-dots button { width: 22px; height: 3px; padding: 0; border: 0; background: rgba(255,255,255,.35); cursor: pointer; }\n.nfx-hero-dots button.is-on { background: #fff; }\n\n/* ---------------------------------------------------------------- 버튼 */\n.nfx-btn {\n  display: inline-flex; align-items: center; gap: 6px; padding: 10px 26px; border-radius: 4px;\n  font-size: 17px; font-weight: 700; border: 0; cursor: pointer; white-space: pre; transition: opacity .2s, background .2s;\n}\n.nfx-btn.is-white { background: #fff; color: #000 !important; }\n.nfx-btn.is-white:hover { background: rgba(255,255,255,.75); }\n.nfx-btn.is-gray { background: rgba(109,109,110,.7); color: #fff !important; }\n.nfx-btn.is-gray:hover { background: rgba(109,109,110,.45); }\n.nfx-btn.is-on { background: rgba(70,211,105,.25); }\n\n/* ---------------------------------------------------------------- 줄(row) */\n.nfx-rows { position: relative; z-index: 2; padding-bottom: 40px; }\n.nfx-row { margin: 0 0 3vw; }\n.nfx-row-head { display: flex; align-items: baseline; gap: 14px; padding: 0 var(--nfx-gutter); margin-bottom: 10px; }\n.nfx-row-head h2 { font-size: 22px !important; font-weight: 700; color: #e5e5e5; }\n.nfx-row-more { font-size: 13px; color: #54b9c5 !important; opacity: 0; transform: translateX(-6px); transition: all .3s; }\n.nfx-row:hover .nfx-row-more { opacity: 1; transform: none; }\n.nfx-row-body { position: relative; }\n.nfx-track {\n  display: flex; gap: 8px; overflow-x: auto; overflow-y: visible; scroll-behavior: smooth;\n  padding: 18px var(--nfx-gutter) 26px; scrollbar-width: none; scroll-padding: 0 var(--nfx-gutter);\n}\n.nfx-track::-webkit-scrollbar { display: none; }\n.nfx-track > .nfx-card { flex: 0 0 calc((100% - 8px * 6) / 7); }\n.nfx-arrow {\n  position: absolute; top: 18px; bottom: 26px; width: calc(var(--nfx-gutter) - 4px); min-width: 34px; z-index: 5;\n  border: 0; color: #fff; font-size: 46px; cursor: pointer; opacity: 0; transition: opacity .2s;\n  background: rgba(20,20,20,.55);\n}\n.nfx-arrow.is-prev { left: 0; border-radius: 0 4px 4px 0; }\n.nfx-arrow.is-next { right: 0; border-radius: 4px 0 0 4px; }\n.nfx-row-body:hover .nfx-arrow { opacity: 1; }\n.nfx-arrow:hover { background: rgba(20,20,20,.8); }\n.nfx-arrow.is-hidden { display: none; }\n\n/* TOP 10 */\n.nfx-row.is-rank .nfx-track { gap: 4px; }\n.nfx-rank-item { flex: 0 0 calc((100% - 4px * 4) / 5); display: flex; align-items: flex-end; }\n.nfx-rank-num {\n  flex: 0 0 46%; margin-right: -14%; font-size: 260px; line-height: .78; font-weight: 900;\n  color: var(--nfx-bg); -webkit-text-stroke: 4px #595959; text-align: right; letter-spacing: -.08em;\n  font-family: \"Arial Black\", Impact, var(--nfx-font); user-select: none; position: relative; z-index: 0;\n}\n.nfx-rank-item .nfx-card { flex: 0 0 54%; position: relative; z-index: 1; }\n.nfx-rank-item .nfx-card .nfx-card-info { display: none; }\n\n/* 카드 */\n.nfx-card { display: block; position: relative; transition: transform .3s cubic-bezier(.2,.8,.2,1), z-index 0s .3s; z-index: 1; }\n.nfx-card-img { position: relative; aspect-ratio: 2 / 3; border-radius: 4px; overflow: hidden; background: var(--nfx-card); }\n.nfx-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }\n.nfx-noimg {\n  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center;\n  padding: 12px; font-size: 15px; font-weight: 700; color: #ddd;\n  background: linear-gradient(135deg, #3a3a3a, #1c1c1c); word-break: keep-all;\n}\n.nfx-badges { position: absolute; left: 0; top: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 6px; }\n.nfx-badge { font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 2px; background: rgba(0,0,0,.7); color: #fff; }\n.nfx-badge.is-red { background: var(--nfx-red); }\n.nfx-card-info {\n  position: absolute; left: 0; right: 0; bottom: 0; padding: 30px 10px 10px; border-radius: 0 0 4px 4px;\n  background: linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.9));\n}\n.nfx-card-title { font-size: 13px; font-weight: 700; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: keep-all; }\n.nfx-card-sub { font-size: 12px; color: var(--nfx-dim); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n@media (hover: hover) {\n  .nfx-card:hover { transform: scale(1.12); z-index: 10; transition: transform .3s cubic-bezier(.2,.8,.2,1), z-index 0s; }\n  .nfx-card:hover .nfx-card-img { box-shadow: 0 14px 30px rgba(0,0,0,.75); }\n  .nfx-track > .nfx-card:first-child:hover { transform-origin: left center; }\n  .nfx-track > .nfx-card:last-child:hover { transform-origin: right center; }\n}\n\n/* ---------------------------------------------------------------- 목록·검색 */\n.nfx-page { padding: 100px var(--nfx-gutter) 60px; }\n.nfx-page-head h1 { font-size: 38px !important; font-weight: 800; margin-bottom: 18px !important; }\n.nfx-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 26px; }\n.nfx-chip {\n  font-size: 13px; padding: 6px 14px; border-radius: 999px; cursor: pointer; font-family: inherit;\n  background: transparent; color: #ddd !important; border: 1px solid rgba(255,255,255,.35); transition: all .2s;\n}\n.nfx-chip:hover { border-color: #fff; color: #fff !important; }\n.nfx-chip.is-on { background: #fff; color: #000 !important; border-color: #fff; font-weight: 700; }\n.nfx-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 30px 10px; }\n.nfx-empty { color: var(--nfx-dim); font-size: 16px; padding: 40px 0; }\n.nfx-pager { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 40px; }\n.nfx-sentinel { height: 60px; }\n.nfx-sentinel.is-loading { background: radial-gradient(circle, var(--nfx-red) 4px, transparent 5px) center / 20px 20px no-repeat; animation: nfx-pulse 1s infinite; }\n@keyframes nfx-pulse { 50% { opacity: .3; } }\n\n.nfx-footer { padding: 30px var(--nfx-gutter) 50px; color: #666; font-size: 12px; }\n\n/* ---------------------------------------------------------------- 재생 페이지(주소로 직접 들어온 경우) */\nhtml.nfx-page-watch #bo_v {\n  margin: 0 !important; padding: 0 !important; max-width: none !important; width: 100% !important;\n  background: transparent !important; border: 0 !important;\n}\nhtml.nfx-page-watch #playerArea {\n  margin: 0 auto !important; padding: 0 !important; width: 100% !important;\n  max-width: calc(100vh * 16 / 9) !important; background: #000 !important;\n}\nhtml.nfx-page-watch #playerArea .embed-container {\n  position: relative !important; width: 100% !important; height: 0 !important;\n  padding: 0 0 56.25% !important; margin: 0 !important; overflow: hidden !important; background: #000 !important;\n}\nhtml.nfx-page-watch #playerArea iframe#view_iframe {\n  position: absolute !important; top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; border: 0 !important;\n}\nhtml.nfx-page-watch #bo_v > header,\nhtml.nfx-page-watch #bo_v_atc,\nhtml.nfx-page-watch #other_list,\nhtml.nfx-page-watch #bo_vc,\nhtml.nfx-page-watch #bo_vc_w,\nhtml.nfx-page-watch .bo_v_nb,\nhtml.nfx-page-watch #container_title,\nhtml.nfx-page-watch #bo_v .next-episode-overlay,\nhtml.nfx-page-watch #bo_v ~ *:not(.nfx-scope):not(script):not(style):not(link) {\n  display: none !important;\n}\n\n/* ---------------------------------------------------------------- 같은 화면 안의 플레이어 */\nhtml.nfx-modal, html.nfx-modal body { overflow: hidden !important; }\n#nfx-player {\n  position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 2147483100; display: none;\n  background: var(--nfx-bg); overflow-y: auto; overscroll-behavior: contain;\n}\n#nfx-player.is-open { display: block; animation: nfx-fade-in .25s ease both; }\n.nfx-pl-stage { position: relative; width: 100%; height: 100vh; background: #000; }\n.nfx-pl-frame { position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%; border: 0; background: #000; display: block; }\n.nfx-pl-cover {\n  position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 2; overflow: hidden; background: #000;\n  display: flex; align-items: center; justify-content: center; transition: opacity .5s ease;\n}\n.nfx-pl-cover.is-hidden { opacity: 0; pointer-events: none; }\n.nfx-pl-cover-bg {\n  position: absolute; top: -40px; right: -40px; bottom: -40px; left: -40px; background-size: cover; background-position: center;\n  filter: blur(30px) brightness(.45); transform: scale(1.1);\n}\n.nfx-pl-cover-mid { position: relative; display: flex; flex-direction: column; align-items: center; gap: 16px; }\n.nfx-pl-spin {\n  display: none; width: 58px; height: 58px; border-radius: 50%;\n  border: 4px solid rgba(255,255,255,.18); border-top-color: var(--nfx-red); animation: nfx-spin .9s linear infinite;\n}\n.nfx-pl-cover.is-loading .nfx-pl-spin { display: block; }\n.nfx-pl-msg { font-size: 15px; color: #ddd; text-align: center; }\n@keyframes nfx-spin { to { transform: rotate(360deg); } }\n.nfx-pl-back {\n  position: absolute; top: 18px; left: 18px; z-index: 5; width: 46px; height: 46px; border-radius: 50%;\n  border: 0; background: rgba(0,0,0,.45); color: #fff; font-size: 24px; line-height: 1; cursor: pointer;\n  opacity: 0; pointer-events: none; transition: opacity .3s, background .2s;\n}\n/* 영상 위에서 마우스를 움직일 때만 잠깐 보인다 */\n.nfx-pl-back.is-shown, .nfx-pl-back:hover, .nfx-pl-back:focus { opacity: .85; pointer-events: auto; }\n.nfx-pl-back:hover { opacity: 1; background: rgba(0,0,0,.75); }\n.nfx-pl-back.is-page { position: fixed; z-index: 2147483100; }\n\n/* 화면 안내(재생·일시정지·건너뛰기 등) */\n.nfx-osd {\n  position: absolute; left: 50%; top: 14%; transform: translateX(-50%); z-index: 6;\n  padding: 10px 18px; border-radius: 6px; background: rgba(0,0,0,.72); color: #fff;\n  font: 600 16px var(--nfx-font); white-space: nowrap; pointer-events: none;\n  opacity: 0; transition: opacity .25s;\n}\n.nfx-osd.is-on { opacity: 1; }\n.nfx-pl-stage:fullscreen { height: 100vh !important; width: 100vw !important; }\nhtml.nfx-page-watch #playerArea { position: relative !important; }\nhtml.nfx-page-watch #playerArea:fullscreen { max-width: none !important; width: 100vw !important; height: 100vh !important; }\nhtml.nfx-page-watch #playerArea:fullscreen .embed-container { height: 100% !important; padding: 0 !important; }\n.nfx-pl-body { background: var(--nfx-bg); }\n\n/* ---------------------------------------------------------------- 플레이어 틀(iframe) 안: 영상만 보이게 */\nhtml.nfx-embed, html.nfx-embed body {\n  background: #000 !important; overflow: hidden !important; margin: 0 !important; padding: 0 !important;\n}\nhtml.nfx-embed body * { visibility: hidden !important; }\nhtml.nfx-embed #playerArea, html.nfx-embed #playerArea * { visibility: visible !important; }\nhtml.nfx-embed #playerArea .next-episode-overlay,\nhtml.nfx-embed #playerArea .next-episode-overlay * { visibility: hidden !important; }\nhtml.nfx-embed #playerArea {\n  position: fixed !important; top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;\n  max-width: none !important; margin: 0 !important; padding: 0 !important; z-index: 2147483647 !important;\n  background: #000 !important;\n}\nhtml.nfx-embed #playerArea .embed-container {\n  position: absolute !important; top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important;\n  padding: 0 !important; margin: 0 !important;\n}\nhtml.nfx-embed #playerArea iframe#view_iframe {\n  position: absolute !important; top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; border: 0 !important;\n}\n\n.nfx-watch { padding: 28px var(--nfx-gutter) 60px; max-width: 1500px; margin: 0 auto; }\n.nfx-watch-top { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 40px; }\n.nfx-watch-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: 15px; color: #bcbcbc; margin-bottom: 10px; }\n.nfx-match { color: #46d369; font-weight: 700; }\n.nfx-tag { border: 1px solid rgba(255,255,255,.4); padding: 0 6px; font-size: 13px; }\n.nfx-watch-title { font-size: 44px; font-weight: 800; line-height: 1.15; word-break: keep-all; }\n.nfx-watch-ep { font-size: 18px; color: #e5e5e5; margin-top: 8px; font-weight: 600; }\n.nfx-watch-btns { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }\n.nfx-watch-story { font-size: 16px; line-height: 1.6; color: #e5e5e5; }\n.nfx-watch-side p { font-size: 14px; line-height: 1.6; color: #ddd; margin-bottom: 12px !important; word-break: keep-all; }\n.nfx-dim { color: #777; }\n\n.nfx-episodes { margin-top: 44px; }\n.nfx-episodes-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 14px; }\n.nfx-episodes-head h2 { font-size: 24px !important; font-weight: 700; }\n.nfx-episodes-tools { display: flex; gap: 8px; align-items: center; }\n.nfx-ep-filter {\n  background: #242424; color: #fff; border: 1px solid #4d4d4d; border-radius: 4px; padding: 7px 12px;\n  font-size: 13px; font-family: inherit; width: 160px; outline: 0;\n}\n.nfx-ep-list { max-height: 640px; overflow-y: auto; border-top: 1px solid #404040; scrollbar-color: #555 transparent; }\n.nfx-ep {\n  display: grid; grid-template-columns: 50px 180px minmax(0, 1fr) 40px; align-items: center; gap: 18px;\n  padding: 16px 20px; border-bottom: 1px solid #404040; border-radius: 4px; transition: background .2s;\n}\n.nfx-ep:hover { background: #2a2a2a; }\n.nfx-ep.is-current { background: #333; }\n.nfx-ep-num { font-size: 24px; color: #d2d2d2; text-align: center; }\n.nfx-ep-thumb { position: relative; aspect-ratio: 16 / 9; border-radius: 4px; overflow: hidden; background: #2f2f2f; }\n.nfx-ep-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }\n.nfx-ep-play {\n  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);\n  width: 40px; height: 40px; border-radius: 50%; border: 2px solid #fff; background: rgba(0,0,0,.5);\n  display: flex; align-items: center; justify-content: center; font-size: 14px; opacity: 0; transition: opacity .2s;\n}\n.nfx-ep:hover .nfx-ep-play, .nfx-ep.is-current .nfx-ep-play { opacity: 1; }\n.nfx-ep-title { font-size: 16px; font-weight: 700; margin-bottom: 6px; }\n.nfx-ep-date { font-size: 13px; color: var(--nfx-dim); }\n.nfx-ep.is-current .nfx-ep-date { color: #46d369; }\n\n/* 시청 진행 표시 */\n.nfx-progress { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: rgba(255,255,255,.3); z-index: 2; }\n.nfx-progress > i { display: block; height: 100%; background: var(--nfx-red); }\n.nfx-card .nfx-progress { left: 8px; right: 8px; bottom: 6px; border-radius: 2px; overflow: hidden; }\n.nfx-ep.is-done .nfx-ep-title { color: #bdbdbd; }\n.nfx-ep-mark {\n  width: 34px; height: 34px; border-radius: 50%; border: 2px solid rgba(255,255,255,.45); background: transparent;\n  color: transparent; font-size: 16px; cursor: pointer; flex: none; transition: all .2s;\n}\n.nfx-ep-mark:hover { border-color: #fff; color: rgba(255,255,255,.6); }\n.nfx-ep.is-done .nfx-ep-mark { border-color: #46d369; color: #46d369; }\n.nfx-ep-badge { font-size: 12px; color: #46d369; margin-left: 8px; font-weight: 600; }\n\n/* 키보드로 고른 항목 */\n.nfx-card:focus { outline: none; transform: scale(1.12); z-index: 10; }\n.nfx-card:focus .nfx-card-img { box-shadow: 0 0 0 3px #fff, 0 14px 30px rgba(0,0,0,.75); }\n.nfx-btn:focus, .nfx-chip:focus, .nfx-nav a:focus, .nfx-row-more:focus { outline: 3px solid #fff; outline-offset: 2px; }\n.nfx-ep:focus { outline: 3px solid #fff; outline-offset: -3px; background: #2a2a2a; }\n#nfx-player:focus { outline: none; }\n\n/* 기타 페이지 기본 어둡게 */\nhtml.nfx-page-generic #body_wrap a { color: #e5e5e5; }\n\n/* ---------------------------------------------------------------- 좁은 화면 */\n@media (max-width: 1400px) { .nfx-track > .nfx-card { flex-basis: calc((100% - 8px * 5) / 6); } }\n@media (max-width: 1100px) {\n  .nfx-track > .nfx-card { flex-basis: calc((100% - 8px * 4) / 5); }\n  .nfx-rank-item { flex-basis: calc((100% - 4px * 3) / 4); }\n  .nfx-hero-poster { display: none; }\n}\n@media (max-width: 800px) {\n  #nfx-header { gap: 14px; height: auto; min-height: 56px; flex-wrap: wrap; padding-top: 10px; padding-bottom: 6px; }\n  #nfx-header .nfx-logo { font-size: 24px; }\n  #nfx-header .nfx-nav { order: 3; flex: 0 0 100%; overflow-x: auto; gap: 16px; padding-bottom: 6px; scrollbar-width: none; }\n  #nfx-header .nfx-nav::-webkit-scrollbar { display: none; }\n  #nfx-header .nfx-more-menu { display: none; }\n  #nfx-header .nfx-search.is-open input { width: 140px; }\n  .nfx-track > .nfx-card { flex-basis: calc((100% - 8px * 2) / 3); }\n  .nfx-rank-item { flex-basis: calc((100% - 4px * 1) / 2); }\n  .nfx-arrow { display: none; }\n  .nfx-hero { min-height: 420px; margin-bottom: 0; }\n  .nfx-hero-inner { align-items: flex-end; padding-bottom: 40px; }\n  .nfx-btn { padding: 8px 18px; font-size: 15px; }\n  .nfx-page { padding-top: 120px; }\n  .nfx-grid { grid-template-columns: repeat(3, 1fr); gap: 16px 6px; }\n  .nfx-watch-top { grid-template-columns: 1fr; gap: 10px; }\n  .nfx-ep { grid-template-columns: 120px minmax(0, 1fr) 36px; padding: 12px 6px; gap: 12px; }\n  .nfx-ep-num { display: none; }\n}\n\n/* ================================================================\n   TVMON Flix — 삼성 TV(Tizen) 보정\n   옛 TV 브라우저 엔진(2019년형 이상)에서도 같은 모양이 나오게 한다.\n   ================================================================ */\n\n/* flex 간격(gap) 대신 바깥 여백 */\n#nfx-header, #nfx-header .nfx-nav, .nfx-hero-inner, .nfx-hero-btns, .nfx-hero-dots, .nfx-row-head,\n.nfx-track, .nfx-badges, .nfx-chips, .nfx-pager, .nfx-pl-cover-mid, .nfx-watch-meta, .nfx-watch-btns,\n.nfx-episodes-head, .nfx-episodes-tools { gap: 0 !important; }\n#nfx-header > * + * { margin-left: 28px; }\n#nfx-header .nfx-nav > * + * { margin-left: 22px; }\n.nfx-hero-inner > * + * { margin-left: 40px; }\n.nfx-hero-btns > * { margin: 0 14px 14px 0; }\n.nfx-row-head > * + * { margin-left: 14px; }\n.nfx-track > * + * { margin-left: 8px; }\n.nfx-row.is-rank .nfx-track > * + * { margin-left: 4px; }\n.nfx-badges > * + * { margin-top: 4px; }\n.nfx-chips > *, .nfx-pager > * { margin: 0 8px 8px 0; }\n.nfx-pl-cover-mid > * + * { margin-top: 16px; }\n.nfx-watch-meta > * { margin-right: 10px; }\n.nfx-watch-btns > * { margin: 0 12px 12px 0; }\n.nfx-episodes-tools > * + * { margin-left: 8px; }\n\n/* 가로세로 비율(aspect-ratio) 대신 위쪽 여백 비율 */\n.nfx-card-img { height: 0; padding-top: 150%; }\n.nfx-card-img > img, .nfx-card-img > .nfx-noimg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }\n.nfx-ep-thumb { height: 0; padding-top: 56.25%; }\n.nfx-ep-thumb > img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }\n.nfx-hero-poster { width: auto; }\n\n/* TV 화면(1920×1080)에 맞춘 크기 */\n.nfx-hero { height: 88vh; }\n.nfx-pl-stage { height: 100vh; }\nhtml.nfx-page-watch #playerArea { max-width: none !important; }\n.nfx-btn { font-size: 22px; padding: 14px 32px; }\n.nfx-card-title { font-size: 16px; }\n.nfx-ep-title { font-size: 20px; }\n.nfx-ep-date { font-size: 16px; }\n.nfx-watch-story { font-size: 20px; }\n.nfx-watch-side p { font-size: 18px; }\n#nfx-header .nfx-nav > a, #nfx-header .nfx-more-menu > button { font-size: 20px; }\n\n/* 리모컨 초점을 잘 보이게 */\n.nfx-card:focus { outline: none; transform: scale(1.12); z-index: 10; }\n.nfx-card:focus .nfx-card-img { box-shadow: 0 0 0 5px #fff, 0 16px 34px rgba(0,0,0,.8); }\n.nfx-btn:focus, .nfx-chip:focus, #nfx-header a:focus, #nfx-header button:focus { outline: 4px solid #fff; outline-offset: 3px; }\n.nfx-ep:focus { outline: 4px solid #fff; outline-offset: -4px; background: #2a2a2a; }\n.nfx-pl-back.is-shown { opacity: .85; pointer-events: auto; }\n\n/* 마우스용 요소는 숨김 */\n.nfx-arrow, .nfx-hero-dots, .nfx-footer, .nfx-ep-mark { display: none !important; }\n.nfx-ep { grid-template-columns: 60px 260px minmax(0, 1fr) !important; }\n.nfx-ep-list { max-height: none; overflow: visible; }\n";

  function run() {
    if (onTvmon) {
      var st = document.createElement('style');
      st.id = 'nfx-css';
      st.textContent = CSS;
      document.documentElement.appendChild(st);
    }

    // ---- guard.js
// 페이지 쪽(MAIN world)에서 실행: 티비몬 페이지와 그 안의 플레이어 프레임에서
// 다른 사이트로 열리는 팝업·팝언더 광고를 막는다.
(() => {
  'use strict';
  const HOST_RE = /(^|\.)tvmon\d*\.[a-z.]+$/i;

  let onTvmon = HOST_RE.test(location.hostname);
  const inFrame = window.top !== window;
  if (!onTvmon && inFrame) {
    try {
      const origins = location.ancestorOrigins || [];
      for (let i = 0; i < origins.length; i++) {
        if (HOST_RE.test(new URL(origins[i]).hostname)) { onTvmon = true; break; }
      }
    } catch (e) { /* 무시 */ }
  }
  if (!onTvmon) return;

  const isForeign = (url) => {
    try { return new URL(url, location.href).origin !== location.origin; }
    catch (e) { return true; }
  };
  const note = (url) => console.info('[TVMON Flix] 팝업 광고 차단:', url);

  // 1) window.open 으로 다른 사이트를 여는 팝업 차단
  const nativeOpen = window.open;
  window.open = function (url, ...rest) {
    if (url && isForeign(url)) { note(url); return null; }
    return nativeOpen.call(this, url, ...rest);
  };

  if (!inFrame) return;

  // 2) 플레이어 프레임 안: 새 창으로 다른 사이트를 여는 링크 클릭 차단
  //    (플레이어 화면을 덮은 투명 광고 링크가 주로 이 방식이다)
  const blockAnchor = (a) => a && a.href && (a.target === '_blank' || a.target === '_top') && isForeign(a.href);

  document.addEventListener('click', (ev) => {
    const a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
    if (blockAnchor(a)) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      note(a.href);
    }
  }, true);

  const nativeClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (blockAnchor(this)) { note(this.href); return; }
    return nativeClick.call(this);
  };
})();

    ;
    // ---- content.js
// TVMON Flix: 광고는 화면에서만 가리고, 넷플릭스풍 화면으로 보여 준다.
// 원칙: 사이트가 보내는 요청(광고·통계·세션)은 그대로 두고, 사용자 화면에서만 바꾼다.
(() => {
  'use strict';
  const HOST_RE = /(^|\.)tvmon\d*\.[a-z.]+$/i;
  if (!HOST_RE.test(location.hostname)) return;

  const IN_FRAME = window.top !== window;
  // 확장이 만든 플레이어 틀(iframe) 안에서만 동작하고, 그 밖의 프레임은 건드리지 않는다
  if (IN_FRAME && window.name !== 'nfx-embed') return;

  const root = document.documentElement;
  const DEFAULTS = { ui: true, adblock: true };
  const LOG = '[TVMON Flix]';
  // 삼성 TV(TizenBrew) 빌드에서는 감싸는 코드가 NFX_TV = true 를 정의한다
  const TV = typeof NFX_TV !== 'undefined' && NFX_TV === true;
  // 리모컨 키 → 키보드 키 이름. 키보드에서는 e.code 를 그대로 쓴다
  const TV_KEYS = {
    10009: 'Escape', 413: 'Escape',            // 뒤로, 정지
    10252: 'Space', 415: 'Space', 19: 'Space',  // 재생/일시정지
    417: 'KeyL', 412: 'KeyJ',                   // 빨리 감기, 되감기
    427: 'KeyN', 428: 'KeyP', 10233: 'KeyN', 10232: 'KeyP', // 채널▲▼, 다음/이전 곡
    37: 'ArrowLeft', 38: 'ArrowUp', 39: 'ArrowRight', 40: 'ArrowDown', 13: 'Enter',
  };
  const codeOf = (e) => TV_KEYS[e.keyCode] || e.code || '';

  // CSS 는 매니페스트로 페이지가 그려지기 전에 이미 들어와 있다.
  // 여기서 바로 클래스를 달아 첫 화면부터 광고와 원래 화면이 비치지 않게 한다.
  if (IN_FRAME) root.classList.add('nfx-embed', 'nfx-ads');
  else root.classList.add('nfx-ads', 'nfx-loading');

  // 키 이름은 e.code 기준(한글 입력 상태에서도 같게 동작)
  const PLAYER_KEYS = {
    Space: { type: 'toggle' }, KeyK: { type: 'toggle' },
    ArrowLeft: { type: 'seek', by: -10 }, KeyJ: { type: 'seek', by: -10 },
    ArrowRight: { type: 'seek', by: 10 }, KeyL: { type: 'seek', by: 10 },
    ArrowUp: { type: 'vol', by: 0.1 }, ArrowDown: { type: 'vol', by: -0.1 },
    KeyM: { type: 'mute' }, Digit0: { type: 'seekTo', t: 0 }, Home: { type: 'seekTo', t: 0 },
  };
  const APP_KEYS = new Set(['KeyF', 'KeyN', 'KeyP', 'Escape']);

  // ---------------------------------------------------------------- 도우미
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'style') el.setAttribute('style', v);
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    const flat = [];
    (function walk(list) { for (const c of list) { if (Array.isArray(c)) walk(c); else flat.push(c); } })(children);
    for (const c of flat) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  const abs = (u) => { try { return u ? new URL(u, location.href).href : ''; } catch (e) { return ''; } };
  const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const firstText = (el) => {
    if (!el) return '';
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && n.textContent.trim()) return n.textContent.replace(/\s+/g, ' ').trim();
    }
    return txt(el);
  };
  const imgSrc = (img) => {
    if (!img) return '';
    return abs(img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('src'));
  };
  const bigPoster = (u) => (u || '').replace('/t/p/w500/', '/t/p/w780/').replace('/t/p/w185/', '/t/p/w500/');
  const seriesKey = (href) => {
    try {
      const m = new URL(href, location.href).pathname.match(/^\/([^/]+)\/(\d+)/);
      return m ? `/${m[1]}/${m[2]}` : '';
    } catch (e) { return ''; }
  };
  const epPath = (href) => { try { return new URL(href, location.href).pathname.replace(/\/+$/, ''); } catch (e) { return ''; } };
  const dedupe = (items) => {
    const seen = new Set();
    return items.filter((it) => {
      if (!it || !it.href) return false;
      const k = seriesKey(it.href) || it.href;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  };
  const isWatchUrl = (href) => {
    try {
      const u = new URL(href, location.href);
      return u.host === location.host && /^\/[a-z_]+\/\d+(\/\d+)?\/?$/i.test(u.pathname);
    } catch (e) { return false; }
  };
  const isEditable = (t) => t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  const fmt = (sec) => {
    sec = Math.max(0, Math.floor(sec || 0));
    const hh = Math.floor(sec / 3600), mm = Math.floor((sec % 3600) / 60), ss = sec % 60;
    const p = (n) => String(n).padStart(2, '0');
    return hh ? `${hh}:${p(mm)}:${p(ss)}` : `${mm}:${p(ss)}`;
  };
  const whenReady = (fn) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  };

  const store = {
    get: (key, def) => new Promise((r) => chrome.storage.local.get({ [key]: def }, (o) => r(o[key] != null ? o[key] : def))),
    set: (key, val) => new Promise((r) => chrome.storage.local.set({ [key]: val }, r)),
  };

  // ---------------------------------------------------------------- 시청 기록·진행률(이 브라우저에만 저장)
  let PROG = {};   // { '/drama/12484/406793257': { t, d, done, opened, ts } }
  let HIST = [];   // [{ key, href, title, epTitle, img, eps:[경로…], ts }]
  let FAVS = [];
  let progTimer = 0;

  async function loadState() {
    [PROG, HIST, FAVS] = await Promise.all([store.get('progress', {}), store.get('history', []), store.get('favs', [])]);
  }
  function saveProg(now) {
    clearTimeout(progTimer);
    const write = () => {
      // 오래된 항목부터 정리해 3000개까지만 둔다
      const keys = Object.keys(PROG);
      if (keys.length > 3000) {
        keys.sort((a, b) => (PROG[a].ts || 0) - (PROG[b].ts || 0)).slice(0, keys.length - 3000).forEach((k) => delete PROG[k]);
      }
      store.set('progress', PROG);
    };
    if (now) write(); else progTimer = setTimeout(write, 4000);
  }
  const isDone = (p) => !!p && (p.done || (p.d > 0 && p.t / p.d >= 0.92));
  const tracking = (paths) => paths.some((x) => PROG[x] && PROG[x].d > 0);
  // 진행률을 받을 수 있으면 끝까지 본 회차만, 못 받으면 열어 본 회차를 '본 회차'로 친다
  function watched(path, paths, currentPath) {
    const p = PROG[path];
    if (!p) return false;
    if (isDone(p)) return true;
    return !tracking(paths) && p.opened && path !== currentPath;
  }
  function firstUnwatched(eps) {
    const paths = eps.map((e) => epPath(e.href));
    const cur = (eps.find((e) => e.current) || {}).href;
    return eps.find((e) => !watched(epPath(e.href), paths, cur && epPath(cur)));
  }
  // '시청 중인 콘텐츠'에서 누르면 열 회차: 보다 만 회차 → 그다음 안 본 회차 → 마지막에 본 회차
  function resumeHref(entry) {
    if (!entry) return '';
    const last = epPath(entry.href);
    const paths = entry.eps || [];
    const p = PROG[last];
    if (!tracking(paths) || (p && p.d > 0 && !isDone(p))) return abs(last);
    const i = paths.indexOf(last);
    for (let j = i + 1; j < paths.length; j++) if (!isDone(PROG[paths[j]])) return abs(paths[j]);
    const any = paths.find((x) => !isDone(PROG[x]));
    return abs(any || last);
  }
  const histFor = (href) => HIST.find((x) => x.key === seriesKey(href));
  const epLabel = (title, series) => (title.startsWith(series) ? title.slice(series.length).trim() : title) || title;

  async function saveHistory(d) {
    if (!d.key) return;
    const entry = {
      key: d.key, href: d.href, title: d.seriesTitle, epTitle: d.epTitle, img: d.poster,
      eps: d.eps.map((e) => epPath(e.href)), ts: Date.now(),
    };
    HIST = [entry, ...(await store.get('history', [])).filter((x) => x.key !== d.key)].slice(0, 30);
    await store.set('history', HIST);
    const path = epPath(d.href);
    PROG[path] = { ...(PROG[path] || {}), opened: true, ts: Date.now() };
    saveProg();
  }

  // ---------------------------------------------------------------- 재생 페이지 읽기
  function parseWatchDoc(doc, href) {
    const seriesTitle = firstText(doc.querySelector('#bo_v_movinfo h3')) || txt(doc.querySelector('#bo_v_title'));
    const epFull = txt(doc.querySelector('#bo_v_title')).replace(/\s*다시보기\s*$/, '');
    const epTitle = epFull.startsWith(seriesTitle) ? (epFull.slice(seriesTitle.length).trim() || epFull) : epFull;
    const castSeen = new Set();
    const cast = [...doc.querySelectorAll('.slider_act .item:not(.cloned) .name')].map(txt)
      .filter((n) => n && !castSeen.has(n) && castSeen.add(n));

    const curEl = doc.querySelector('.ep-item.current');
    const currentHref = curEl ? abs(curEl.getAttribute('href')) : href;
    const currentPath = epPath(currentHref);
    const eps = [...doc.querySelectorAll('#other_list li')].map((li) => {
      const a = li.querySelector('a[href]');
      if (!a) return null;
      const epHref = abs(a.getAttribute('href'));
      return {
        href: epHref,
        img: imgSrc(li.querySelector('img')),
        title: txt(li.querySelector('.title')) || txt(a),
        date: txt(li.querySelector('.date')),
        current: epPath(epHref) === currentPath,
      };
    }).filter(Boolean).reverse(); // 사이트는 최신화가 위 → 1화부터 보이게 뒤집는다

    return {
      href: currentHref,
      key: seriesKey(href),
      seriesTitle,
      epTitle,
      poster: imgSrc(doc.querySelector('#bo_v_poster img')),
      rating: txt(doc.querySelector('#bo_v_poster label')),
      info: [...doc.querySelectorAll('.bo_v_info dd')].map(txt).filter(Boolean),
      genres: [...doc.querySelectorAll('.ctgs dd a')].map(txt).filter((t) => t && !/트레일러/.test(t)),
      story: txt(doc.querySelector('#bo_v_movinfo .story')),
      cast,
      eps,
    };
  }

  // ---------------------------------------------------------------- 플레이어 틀(iframe) 안
  // 재생 페이지를 그대로 불러 둔 채 영상만 보이게 하고, 위(확장 화면)와 아래(영상 플레이어) 사이 말을 전한다.
  function startEmbed() {
    const view = () => document.getElementById('view_iframe');
    const up = (msg) => window.parent.postMessage({ nfx: 'up', msg }, location.origin);

    window.addEventListener('message', (e) => {
      const m = e.data;
      if (!m || typeof m !== 'object') return;
      const v = view();
      if (e.source === window.parent && m.nfx === 'cmd') {
        if (v && v.contentWindow) v.contentWindow.postMessage({ nfxCmd: m.cmd }, '*');
      } else if (v && e.source === v.contentWindow && m.nfxUp) {
        up(m.nfxUp);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isEditable(e.target)) return;
      const code = codeOf(e);
      if (!PLAYER_KEYS[code] && !APP_KEYS.has(code) && code !== 'Enter') return;
      e.preventDefault();
      up({ type: 'key', code, shift: e.shiftKey });
    }, true);
    document.addEventListener('mousemove', () => up({ type: 'move' }), { passive: true });

    whenReady(() => {
      if (!document.getElementById('playerArea')) {
        window.parent.postMessage({ nfx: 'watch-error', href: location.href }, location.origin);
        return;
      }
      try {
        window.parent.postMessage({ nfx: 'watch-data', data: parseWatchDoc(document, location.href) }, location.origin);
      } catch (e) { console.warn(LOG, e); }
    });
  }

  // ---------------------------------------------------------------- 시작
  function boot() {
    if (IN_FRAME) { startEmbed(); return; }

    const unveil = () => root.classList.remove('nfx-loading');
    setTimeout(unveil, 4000);
    try { chrome.storage.local.set({ lastOrigin: location.origin }); } catch (e) { /* 무시 */ }

    chrome.storage.sync.get(DEFAULTS, (s) => {
      if (!s.adblock) root.classList.remove('nfx-ads');
      if (!s.ui) { unveil(); return; }
      root.classList.add('nfx-ui');
      whenReady(async () => {
        try {
          await loadState();
          buildUI();
        } catch (e) {
          console.error(LOG, '화면 구성 실패, 원래 화면으로 되돌립니다.', e);
          [...root.classList].filter((c) => c.startsWith('nfx-') && c !== 'nfx-ads').forEach((c) => root.classList.remove(c));
          document.querySelectorAll('.nfx-scope, #nfx-app').forEach((n) => n.remove());
        }
        unveil();
      });
    });
  }

  // ---------------------------------------------------------------- 공통 요소
  const NAV = [
    ['홈', '/'], ['영화', '/movie'], ['한국영화', '/kor_movie'], ['드라마', '/drama'],
    ['예능', '/ent'], ['해외드라마', '/world'], ['애니', '/animation'],
  ];
  const NAV_MORE = [
    ['시사/다큐', '/sisa'], ['해외 예능·다큐', '/ott_ent'], ['극장판 애니', '/ani_movie'],
    ['추억의 드라마', '/old_drama'], ['추억의 예능', '/old_ent'], ['인기영상', '/popular'],
  ];

  let searchInput = null;
  function buildHeader() {
    const seg = '/' + (location.pathname.split('/')[1] || '');
    const navLink = ([label, href]) => h('a', { href, class: seg === href ? 'is-active' : null }, label);

    const input = h('input', { type: 'search', name: 'stx', placeholder: '제목으로 검색', autocomplete: 'off', maxlength: '20' });
    const btn = h('button', { type: 'button', class: 'nfx-search-btn', 'aria-label': '검색' }, searchIcon());
    const form = h('form', { class: 'nfx-search', action: '/search', method: 'get' }, btn, input);
    searchInput = input;
    if (location.pathname.startsWith('/search')) {
      input.value = new URL(location.href).searchParams.get('stx') || '';
      form.classList.add('is-open');
    }
    btn.addEventListener('click', () => {
      if (form.classList.contains('is-open') && input.value.trim()) { form.submit(); return; }
      form.classList.add('is-open');
      input.focus();
    });
    input.addEventListener('focus', () => form.classList.add('is-open'));
    input.addEventListener('blur', () => {
      if (!input.value.trim() && !location.pathname.startsWith('/search')) form.classList.remove('is-open');
    });

    const more = h('div', { class: 'nfx-more-menu' },
      h('button', { type: 'button' }, '더보기 ▾'),
      h('div', { class: 'nfx-more-list' }, NAV_MORE.map(navLink)));
    more.querySelector('button').addEventListener('click', () => more.classList.toggle('is-open'));
    document.addEventListener('click', (e) => { if (!more.contains(e.target)) more.classList.remove('is-open'); });

    const header = h('header', { id: 'nfx-header', class: 'nfx-scope' },
      h('a', { class: 'nfx-logo', href: '/' }, 'TVMON'),
      h('nav', { class: 'nfx-nav' }, NAV.map(navLink), more),
      form);
    const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return header;
  }

  function searchIcon() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '22');
    svg.setAttribute('height', '22');
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', 'M10.5 3a7.5 7.5 0 0 1 5.96 12.05l4.25 4.24-1.42 1.42-4.24-4.25A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z');
    p.setAttribute('fill', 'currentColor');
    svg.append(p);
    return svg;
  }

  const progressBar = (ratio) => (ratio > 0
    ? h('div', { class: 'nfx-progress' }, h('i', { style: `width:${Math.min(100, Math.round(ratio * 100))}%` }))
    : null);

  function card(item, opts = {}) {
    const img = h('img', { src: item.img, alt: '', loading: 'lazy', decoding: 'async' });
    const fallback = () => img.replaceWith(h('div', { class: 'nfx-noimg' }, item.title));
    img.addEventListener('error', fallback, { once: true });
    if (!item.img) setTimeout(fallback);

    const badges = h('div', { class: 'nfx-badges' },
      item.update ? h('span', { class: 'nfx-badge is-red' }, '새 에피소드') : null,
      item.rating && !/^0(\.0)?$/.test(item.rating) ? h('span', { class: 'nfx-badge' }, '★ ' + item.rating) : null);

    const a = h('a', { class: 'nfx-card', href: item.href, title: item.title, 'data-exact': item.exact ? '1' : null },
      h('div', { class: 'nfx-card-img' }, img, badges, progressBar(item.progress)),
      h('div', { class: 'nfx-card-info' },
        h('div', { class: 'nfx-card-title' }, item.title),
        item.sub ? h('div', { class: 'nfx-card-sub' }, item.sub) : null));

    if (opts.rank) {
      return h('div', { class: 'nfx-rank-item' }, h('span', { class: 'nfx-rank-num' }, String(opts.rank)), a);
    }
    return a;
  }

  function row(title, items, opts = {}) {
    if (!items.length) return null;
    const track = h('div', { class: 'nfx-track' }, items.map((it, i) => card(it, { rank: opts.rank ? i + 1 : 0 })));
    const prev = h('button', { class: 'nfx-arrow is-prev', 'aria-label': '이전', tabindex: '-1' }, '‹');
    const next = h('button', { class: 'nfx-arrow is-next', 'aria-label': '다음', tabindex: '-1' }, '›');
    const step = (dir) => track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: 'smooth' });
    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    const sync = () => {
      prev.classList.toggle('is-hidden', track.scrollLeft < 8);
      next.classList.toggle('is-hidden', track.scrollLeft + track.clientWidth >= track.scrollWidth - 8);
    };
    track.addEventListener('scroll', sync, { passive: true });
    requestAnimationFrame(sync);
    window.addEventListener('resize', sync);

    return h('section', { class: 'nfx-row' + (opts.rank ? ' is-rank' : ''), 'data-row': opts.id || null },
      h('div', { class: 'nfx-row-head' },
        h('h2', null, title),
        opts.more ? h('a', { href: opts.more, class: 'nfx-row-more' }, '모두 보기 ›') : null),
      h('div', { class: 'nfx-row-body' }, prev, track, next));
  }

  const grid = (items) => h('div', { class: 'nfx-grid' }, items.map((it) => card(it)));

  function buildFooter() {
    return h('footer', { class: 'nfx-footer' },
      h('span', null, TV
        ? 'TVMON Flix · 리모컨: 방향키로 고르고 확인으로 재생, 뒤로로 돌아가기'
        : 'TVMON Flix 확장 프로그램으로 보고 있습니다. 키보드: 방향키로 고르고 Enter로 재생, / 검색. 원래 화면은 툴바의 확장 아이콘에서 끌 수 있습니다.'));
  }

  // ---------------------------------------------------------------- 페이지 판별·구성
  function detectPage() {
    const p = location.pathname.replace(/\/+$/, '') || '/';
    if (p === '/' && document.querySelector('#content_wrap section .item')) return 'home';
    if (p.startsWith('/search') && document.querySelector('#bo_list')) return 'search';
    if (document.getElementById('bo_v') && document.getElementById('playerArea')) return 'watch';
    if (document.querySelector('#bo_list .mov_list')) return 'list';
    return 'generic';
  }

  function buildUI() {
    const page = detectPage();
    root.classList.add('nfx-page-' + page);
    addThemeColor();

    if (page === 'generic') { document.body.prepend(buildHeader()); return; }
    if (page === 'watch') { buildWatchPage(); installPlayerMessages(); installKeyboard(); return; }

    const main = h('main', { class: 'nfx-main' });
    document.body.append(h('div', { id: 'nfx-app', class: 'nfx-scope' }, buildHeader(), main, buildFooter()));
    if (page === 'home') buildHome(main);
    else if (page === 'list') buildList(main);
    else if (page === 'search') buildSearch(main);
    installPlayerRouting();
    installPlayerMessages();
    installKeyboard();
    // TV 에는 마우스가 없으니 처음부터 첫 항목에 초점을 둔다
    if (TV) setTimeout(() => { if (!document.activeElement || document.activeElement === document.body) spatialMove('down', document); }, 400);
  }

  // 앱 창(바로가기)으로 열었을 때 제목 표시줄도 어둡게
  function addThemeColor() {
    let m = document.querySelector('meta[name="theme-color"]');
    if (!m) { m = h('meta', { name: 'theme-color' }); document.head.append(m); }
    m.setAttribute('content', '#141414');
  }

  // ---------------------------------------------------------------- 홈
  function parseItem(el) {
    if (el.classList.contains('cloned')) return null;
    const a = el.querySelector('a[href]');
    if (!a) return null;
    const img = el.querySelector('img');
    return { href: abs(a.getAttribute('href')), img: imgSrc(img), title: txt(el.querySelector('.title')) || (img && img.alt) || '' };
  }

  function continueItems() {
    return HIST.map((x) => {
      const href = resumeHref(x);
      const p = PROG[epPath(href)];
      const epTitle = href === abs(epPath(x.href)) ? x.epTitle : '다음 회차';
      const left = p && p.d > 0 && !isDone(p) ? ` · ${Math.max(1, Math.round((p.d - p.t) / 60))}분 남음` : '';
      return { href, img: x.img, title: x.title, sub: epTitle + left, progress: p && p.d > 0 ? p.t / p.d : 0, exact: true };
    });
  }

  function buildHome(main) {
    const sections = [...document.querySelectorAll('#content_wrap section')].map((sec) => {
      const h2 = sec.querySelector('h2');
      if (!h2) return null;
      const moreA = h2.querySelector('a[href]');
      const more = moreA && moreA.getAttribute('href') !== '#' ? abs(moreA.getAttribute('href')) : null;
      const items = dedupe([...sec.querySelectorAll('.item')].map(parseItem));
      return items.length ? { title: firstText(h2), more, items } : null;
    }).filter(Boolean);

    const rankSec = sections.find((s) => /순위/.test(s.title));
    const others = sections.filter((s) => s !== rankSec);

    // 히어로: 최신 영화·드라마를 번갈아 6편
    const pool = [];
    const a = (others[0] && others[0].items) || [];
    const b = (others[1] && others[1].items) || [];
    for (let i = 0; pool.length < 6 && (i < a.length || i < b.length); i++) {
      if (a[i]) pool.push({ ...a[i], kicker: others[0].title });
      if (b[i]) pool.push({ ...b[i], kicker: others[1].title });
    }
    if (pool.length) main.append(hero(pool));

    const rowsWrap = h('div', { class: 'nfx-rows' });
    main.append(rowsWrap);
    const add = (r) => r && rowsWrap.append(r);
    add(row('시청 중인 콘텐츠', continueItems(), { id: 'continue' }));
    if (rankSec) add(row('오늘 티비몬 TOP 10', rankSec.items.slice(0, 10), { rank: true }));
    others.forEach((s) => add(row(s.title.replace(/^최신\s*/, '새로 올라온 '), s.items, { more: s.more })));
    add(row('내가 찜한 콘텐츠', FAVS, { id: 'favs' }));
  }

  // 플레이어를 닫고 홈에 돌아오면 '시청 중인 콘텐츠'·'찜' 줄을 새로 그린다
  async function refreshHomeRows() {
    const wrap = document.querySelector('.nfx-rows');
    if (!wrap) return;
    await loadState();
    const swap = (id, title, items, atStart) => {
      const old = wrap.querySelector(`.nfx-row[data-row="${id}"]`);
      const fresh = row(title, items, { id });
      if (old && fresh) old.replaceWith(fresh);
      else if (old) old.remove();
      else if (fresh) atStart ? wrap.prepend(fresh) : wrap.append(fresh);
    };
    swap('continue', '시청 중인 콘텐츠', continueItems(), true);
    swap('favs', '내가 찜한 콘텐츠', FAVS, false);
  }

  function hero(items) {
    const bg = h('div', { class: 'nfx-hero-bg' });
    const poster = h('img', { class: 'nfx-hero-poster', alt: '' });
    const kicker = h('div', { class: 'nfx-hero-kicker' });
    const title = h('div', { class: 'nfx-hero-title' });
    const play = h('a', { class: 'nfx-btn is-white', 'data-nfx-play': 'play' }, '▶  재생');
    const info = h('a', { class: 'nfx-btn is-gray', 'data-nfx-play': 'info' }, 'ⓘ  상세 정보');
    const dots = h('div', { class: 'nfx-hero-dots' });

    const wrap = h('section', { class: 'nfx-hero' }, bg,
      h('div', { class: 'nfx-hero-shade' }),
      h('div', { class: 'nfx-hero-inner' },
        h('div', { class: 'nfx-hero-content' }, kicker, title, h('div', { class: 'nfx-hero-btns' }, play, info)),
        poster),
      dots);

    let idx = -1;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const it = items[idx];
      const big = bigPoster(it.img);
      bg.style.backgroundImage = `url("${big}")`;
      poster.src = big;
      kicker.textContent = it.kicker || '';
      title.textContent = it.title;
      play.href = it.href;
      info.href = it.href;
      play.dataset.img = info.dataset.img = it.img;
      [...dots.children].forEach((d, j) => d.classList.toggle('is-on', j === idx));
      wrap.classList.remove('is-in');
      void wrap.offsetWidth;
      wrap.classList.add('is-in');
    };
    items.forEach((_, j) => dots.append(h('button', { 'aria-label': `${j + 1}번째`, tabindex: '-1', onclick: () => { show(j); restart(); } })));

    let timer = null;
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        const busy = wrap.matches(':hover') || wrap.contains(document.activeElement) || root.classList.contains('nfx-modal');
        if (!document.hidden && !busy) show(idx + 1);
      }, 9000);
    };
    show(0);
    restart();
    return wrap;
  }

  // ---------------------------------------------------------------- 목록
  function parseList(doc) {
    return [...doc.querySelectorAll('.mov_list li')].map((li) => {
      const a = li.querySelector('a.img, a[href]');
      if (!a) return null;
      const value = li.querySelector('.value');
      return {
        href: abs(a.getAttribute('href')),
        img: imgSrc(li.querySelector('img')),
        title: txt(li.querySelector('a.title')) || txt(a),
        update: !!li.querySelector('.ud_new'),
        rating: value ? txt(value) : '',
        sub: txt(li.querySelector('.country')),
      };
    }).filter((x) => x && x.href);
  }

  // 사이트의 페이지 번호를 그대로 쓴다(다음 페이지를 몰래 불러오지 않음)
  function pager() {
    const pg = document.querySelector('.pg_wrap .pg');
    if (!pg) return null;
    const items = [...pg.children].map((el) => {
      const label = [...el.childNodes].filter((n) => !(n.classList && n.classList.contains('sound_only')))
        .map((n) => n.textContent).join('').trim();
      if (!label) return null;
      if (el.tagName === 'A') return h('a', { class: 'nfx-chip', href: abs(el.getAttribute('href')) }, label);
      if (el.classList.contains('pg_current')) return h('span', { class: 'nfx-chip is-on' }, label);
      return null;
    }).filter(Boolean);
    return items.length > 1 ? h('nav', { class: 'nfx-pager' }, items) : null;
  }

  function buildList(main) {
    const sec = document.querySelector('#bo_list section');
    const title = firstText(sec && sec.querySelector('h2')) || document.title;
    const currentSort = firstText(document.querySelector('.btn_filter'));
    const sorts = [...document.querySelectorAll('.filter_layer a')].map((a) => ({ label: txt(a), href: abs(a.getAttribute('href')) }));

    main.append(h('div', { class: 'nfx-page' },
      h('div', { class: 'nfx-page-head' }, h('h1', null, title)),
      h('div', { class: 'nfx-chips' }, sorts.map((s) =>
        h('a', { href: s.href, class: 'nfx-chip' + (s.label === currentSort ? ' is-on' : '') }, s.label))),
      grid(parseList(document)),
      pager()));
  }

  // ---------------------------------------------------------------- 검색
  function parseSearch(scope) {
    return [...scope.querySelectorAll('li')].map((li) => {
      const a = li.querySelector('a.poster');
      if (!a) return null;
      const img = li.querySelector('img');
      return { href: abs(a.getAttribute('href')), img: imgSrc(img), title: txt(li.querySelector('.title')) || (img && img.alt) || '' };
    }).filter(Boolean);
  }

  function buildSearch(main) {
    const q = new URL(location.href).searchParams.get('stx') || '';
    const results = h('div', { class: 'nfx-search-results' });
    const render = (items) => {
      results.textContent = '';
      results.append(items.length ? grid(items) : h('p', { class: 'nfx-empty' }, `'${q}'와(과) 일치하는 결과가 없습니다.`));
    };
    const list = document.querySelector('#mov_con_list');
    render(list ? parseSearch(list) : []);

    // 분류 탭: 사이트의 탭 버튼을 대신 눌러 사이트가 직접 목록을 바꾸게 하고, 바뀐 결과만 다시 그린다
    const tabs = [...document.querySelectorAll('.tags_list a[data-url]')];
    const chips = h('div', { class: 'nfx-chips' }, tabs.map((t, i) => {
      const chip = h('button', { type: 'button', class: 'nfx-chip' + (i === 0 ? ' is-on' : '') }, txt(t).replace(/^#/, ''));
      chip.addEventListener('click', () => {
        chips.querySelectorAll('.nfx-chip').forEach((c) => c.classList.remove('is-on'));
        chip.classList.add('is-on');
        t.click();
      });
      return chip;
    }));
    if (list) {
      new MutationObserver(() => {
        const cur = document.querySelector('#mov_con_list');
        if (cur) render(parseSearch(cur));
      }).observe(list.parentElement || list, { childList: true, subtree: true });
    }

    main.append(h('div', { class: 'nfx-page' },
      h('div', { class: 'nfx-page-head' }, h('h1', null, q ? `'${q}' 검색 결과` : '검색')),
      tabs.length > 1 ? chips : null,
      results));
  }

  // ---------------------------------------------------------------- 같은 화면 안의 플레이어
  // 카드·회차를 누르면 재생 페이지를 통째로 틀(iframe) 안에 불러온다.
  // 사이트의 세션·광고·통계 요청은 평소처럼 그 페이지가 직접 보내고, 화면에는 영상만 보인다.
  function installPlayerRouting() {
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.target.closest && e.target.closest('.nfx-ep-mark')) return;
      const a = e.target.closest && e.target.closest('a.nfx-card, a.nfx-ep, a[data-nfx-play]');
      if (!a || !isWatchUrl(a.href)) return;
      e.preventDefault();
      let href = a.href;
      // 본 적 있는 작품 카드는 보던 회차(또는 다음 안 본 회차)로 연다
      if (a.classList.contains('nfx-card') && !a.dataset.exact) {
        const r = resumeHref(histFor(href));
        if (r) href = r;
      }
      const img = a.dataset.img || (a.querySelector('img') ? a.querySelector('img').src : '');
      openPlayer(href, {
        img,
        opener: a,
        info: a.dataset.nfxPlay === 'info',
        history: root.classList.contains('nfx-modal') ? 'replace' : 'push',
      });
    }, true);

    window.addEventListener('popstate', (e) => {
      const st = e.state;
      if (st && st.nfx === 'watch') openPlayer(st.href, { history: false });
      else if (root.classList.contains('nfx-modal')) closePlayer(true);
    });
  }

  let P = null;     // 같은 화면 플레이어
  let CTX = null;   // 지금 재생 중인 영상(같은 화면 플레이어 또는 직접 연 재생 페이지)
  let directWatch = false;

  function ensurePlayer() {
    if (P) return P;
    const backBtn = h('button', { type: 'button', class: 'nfx-pl-back', 'aria-label': '뒤로 (Esc)', title: '뒤로 (Esc)' }, '←');
    const coverBg = h('div', { class: 'nfx-pl-cover-bg' });
    const coverMsg = h('div', { class: 'nfx-pl-msg' });
    const cover = h('div', { class: 'nfx-pl-cover' }, coverBg,
      h('div', { class: 'nfx-pl-cover-mid' }, h('div', { class: 'nfx-pl-spin' }), coverMsg));
    const osd = h('div', { class: 'nfx-osd' });
    const stage = h('div', { class: 'nfx-pl-stage' }, cover, osd, backBtn);
    const body = h('div', { class: 'nfx-pl-body' });
    const el = h('div', { id: 'nfx-player', class: 'nfx-scope', role: 'dialog', 'aria-modal': 'true', tabindex: '-1' }, stage, body);
    backBtn.addEventListener('click', () => closePlayer());
    stage.addEventListener('mousemove', () => pokeBack(backBtn), { passive: true });
    document.body.append(el);
    P = { el, stage, cover, coverBg, coverMsg, osd, body, backBtn, frame: null, pushed: false, info: false, coverTimer: 0, opener: null, baseTitle: '' };
    return P;
  }

  // 뒤로가기 단추: 영상 위에서 마우스를 움직이면 2.5초 동안만 보인다
  function pokeBack(btn) {
    if (!btn) return;
    btn.classList.add('is-shown');
    clearTimeout(btn._t);
    btn._t = setTimeout(() => btn.classList.remove('is-shown'), 2500);
  }

  function openPlayer(href, opts = {}) {
    const hist = opts.history === undefined ? 'push' : opts.history;
    ensurePlayer();

    if (hist === 'push' && location.href !== href) {
      history.pushState({ nfx: 'watch', href }, '', href);
      P.pushed = true;
    } else if (hist === 'replace') {
      history.replaceState({ nfx: 'watch', href }, '', href);
    }

    if (!root.classList.contains('nfx-modal')) {
      P.baseTitle = document.title;
      P.opener = opts.opener || document.activeElement;
    }
    root.classList.add('nfx-modal');
    P.el.classList.add('is-open');
    P.el.scrollTop = 0;
    P.el.focus({ preventScroll: true });
    P.info = !!opts.info;
    P.body.textContent = '';
    P.cover.classList.remove('is-hidden', 'is-error');
    P.cover.classList.add('is-loading');
    P.coverMsg.textContent = '';
    P.coverBg.style.backgroundImage = opts.img ? `url("${bigPoster(opts.img)}")` : '';

    // 매번 새 틀을 만든다(이전 영상 정지, 브라우저 방문 기록에 틀 이동이 쌓이지 않음)
    if (P.frame) P.frame.remove();
    P.frame = h('iframe', {
      name: 'nfx-embed',
      class: 'nfx-pl-frame',
      src: href,
      allow: 'autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; screen-wake-lock',
      allowfullscreen: true,
    });
    P.stage.prepend(P.frame);
    const frame = P.frame;
    CTX = {
      mode: 'modal', data: null, stage: P.stage, osd: P.osd, back: P.backBtn,
      send: (cmd) => frame.contentWindow && frame.contentWindow.postMessage({ nfx: 'cmd', cmd }, location.origin),
    };
    clearTimeout(P.coverTimer);
    P.coverTimer = setTimeout(() => P.cover.classList.add('is-hidden'), 8000);
  }

  function onWatchData(d) {
    if (!d || !CTX) return;
    // 틀 안에서 사이트가 다음 화로 넘어간 경우 주소만 맞춘다
    if (d.href && d.href !== location.href) history.replaceState({ nfx: 'watch', href: d.href }, '', d.href);
    setContext(d);
    document.title = `${d.seriesTitle}${d.epTitle && d.epTitle !== d.seriesTitle ? ' ' + d.epTitle : ''} - TVMON`;
    if (d.poster && !P.coverBg.style.backgroundImage) P.coverBg.style.backgroundImage = `url("${bigPoster(d.poster)}")`;
    mountPanel(P.body, d, true);
    clearTimeout(P.coverTimer);
    P.coverTimer = setTimeout(() => P.cover.classList.add('is-hidden'), 600);
    if (P.info) {
      P.info = false;
      requestAnimationFrame(() => P.el.scrollTo({ top: P.stage.offsetHeight - 40, behavior: 'smooth' }));
    }
  }

  function setContext(d) {
    CTX.data = d;
    CTX.path = epPath(d.href);
    CTX.saved = PROG[CTX.path] ? { ...PROG[CTX.path] } : null; // 이어보기용(열기 전 기록)
    CTX.resumed = false;
    saveHistory(d);
  }

  function closePlayer(fromPop) {
    if (!P) return;
    if (!fromPop && P.pushed) {
      // 열 때 넣은 주소 기록을 되돌리면 popstate 에서 닫힌다
      P.pushed = false;
      history.back();
      return;
    }
    exitFs();
    P.pushed = false;
    clearTimeout(P.coverTimer);
    if (P.frame) { P.frame.remove(); P.frame = null; }
    CTX = null;
    saveProg(true);
    P.el.classList.remove('is-open');
    root.classList.remove('nfx-modal');
    if (P.baseTitle) document.title = P.baseTitle;
    const opener = P.opener;
    const openerKey = opener && opener.getAttribute && seriesKey(opener.getAttribute('href') || '');
    refreshHomeRows().then(() => {
      // 열었던 카드로 초점을 돌려준다(줄이 새로 그려졌으면 같은 작품 카드로)
      let el = opener && opener.isConnected ? opener : null;
      if (!el && openerKey) el = [...document.querySelectorAll('a.nfx-card')].find((a) => seriesKey(a.href) === openerKey);
      if (el) el.focus({ preventScroll: true });
    });
  }

  // ---------------------------------------------------------------- 재생 페이지(주소로 바로 들어온 경우)
  // 사이트 원래 플레이어를 그대로 쓰고, 둘레만 넷플릭스풍으로 바꾼다. 회차 이동은 평소처럼 페이지 이동.
  let pagePanel = null;
  function buildWatchPage() {
    directWatch = true;
    const d = parseWatchDoc(document, location.href);
    const player = document.getElementById('playerArea');
    const back = h('button', { type: 'button', class: 'nfx-pl-back is-page', 'aria-label': '뒤로 (Esc)', title: '뒤로 (Esc)' }, '←');
    back.addEventListener('click', goBackFromPage);
    document.body.append(h('div', { class: 'nfx-scope' }, back));
    player.addEventListener('mousemove', () => pokeBack(back), { passive: true });

    const osd = h('div', { class: 'nfx-osd nfx-scope' });
    player.append(osd);
    pagePanel = h('div', { class: 'nfx-scope nfx-pl-body' });
    player.after(pagePanel);

    CTX = {
      mode: 'page', data: null, stage: player, osd, back,
      send: (cmd) => {
        const v = document.getElementById('view_iframe');
        if (v && v.contentWindow) v.contentWindow.postMessage({ nfxCmd: cmd }, '*');
      },
    };
    setContext(d);
    mountPanel(pagePanel, d, false);
    document.title = `${d.seriesTitle}${d.epTitle && d.epTitle !== d.seriesTitle ? ' ' + d.epTitle : ''} - TVMON`;
  }

  function goBackFromPage() {
    let sameSite = false;
    try { sameSite = new URL(document.referrer).host === location.host; } catch (e) { /* 무시 */ }
    if (sameSite && history.length > 1) history.back();
    else location.href = '/';
  }

  // ---------------------------------------------------------------- 영상 플레이어와 주고받기
  function installPlayerMessages() {
    window.addEventListener('message', (e) => {
      const m = e.data;
      if (!m || typeof m !== 'object') return;
      if (P && P.frame && e.source === P.frame.contentWindow && e.origin === location.origin) {
        if (m.nfx === 'watch-data') onWatchData(m.data);
        else if (m.nfx === 'up') onPlayerMsg(m.msg);
        else if (m.nfx === 'watch-error') {
          P.cover.classList.remove('is-loading');
          P.cover.classList.add('is-error');
          P.coverMsg.textContent = '재생 페이지를 열지 못했습니다.';
        }
        return;
      }
      const v = document.getElementById('view_iframe');
      if (directWatch && v && e.source === v.contentWindow && m.nfxUp) onPlayerMsg(m.nfxUp);
    });
  }

  function onPlayerMsg(msg) {
    if (!CTX || !msg) return;
    switch (msg.type) {
      case 'move': pokeBack(CTX.back); break;
      case 'key': handlePlayerKey(msg.code, msg.shift); break;
      case 'state':
        CTX.gotState = true;
        showOsd(osdText(msg));
        if (msg.d > 0) trackProgress(msg.t, msg.d, false);
        break;
      case 'progress':
        maybeResume(msg);
        trackProgress(msg.t, msg.d, false, msg.paused);
        break;
      case 'ended':
        trackProgress(msg.d || msg.t, msg.d || msg.t, true);
        break;
      default:
    }
  }

  function trackProgress(t, d, ended, paused) {
    if (!CTX || !CTX.path || !(d > 0)) return;
    const prev = PROG[CTX.path] || {};
    PROG[CTX.path] = {
      ...prev, t, d, opened: true, ts: Date.now(),
      done: !!(ended || prev.done || t / d >= 0.92),
    };
    saveProg(ended || paused);
  }

  // 보다 만 회차를 다시 열면 멈춘 곳부터 이어서 재생
  function maybeResume(msg) {
    if (!CTX || CTX.resumed) return;
    CTX.resumed = true;
    const s = CTX.saved;
    if (s && s.t > 20 && s.d > 0 && !isDone(s) && msg.t < 15) {
      CTX.send({ type: 'seekTo', t: s.t });
      showOsd(`⏯ ${fmt(s.t)}부터 이어서 재생 · 처음부터 보려면 0`, 4000, true);
    }
  }

  function osdText(m) {
    switch (m.action) {
      case 'toggle': return m.paused ? '⏸ 일시정지' : '▶ 재생';
      case 'seek': return `${m.by < 0 ? '⏪ 10초' : '⏩ 10초'}   ${fmt(m.t)} / ${fmt(m.d)}`;
      case 'seekTo': return `⏮ ${fmt(m.t)}`;
      case 'vol': return `🔊 음량 ${Math.round(m.vol * 100)}%`;
      case 'mute': return m.muted ? '🔇 음소거' : '🔊 소리 켬';
      default: return '';
    }
  }

  // sticky: 이어보기 안내처럼 바로 뒤따르는 '재생' 안내에 덮이지 않게 잠시 붙잡아 둔다
  function showOsd(text, ms = 1300, sticky = false) {
    if (!CTX || !CTX.osd || !text) return;
    const now = Date.now();
    if (!sticky && CTX.osdHold > now) return;
    CTX.osdHold = sticky ? now + 1500 : 0;
    CTX.osd.textContent = text;
    CTX.osd.classList.add('is-on');
    clearTimeout(CTX.osd._t);
    CTX.osd._t = setTimeout(() => CTX.osd.classList.remove('is-on'), ms);
  }

  function sendPlayer(cmd) {
    if (!CTX) return;
    CTX.gotState = false;
    CTX.send(cmd);
    clearTimeout(CTX.stateTimer);
    CTX.stateTimer = setTimeout(() => {
      if (CTX && !CTX.gotState && !CTX.warned) {
        CTX.warned = true;
        showOsd('영상을 찾지 못했습니다. 영상을 한 번 클릭한 뒤 다시 눌러 보세요.', 3500);
      }
    }, 1500);
  }

  function gotoEp(delta) {
    if (!CTX || !CTX.data) return;
    const eps = CTX.data.eps;
    const i = eps.findIndex((e) => e.current);
    const target = i >= 0 ? eps[i + delta] : null;
    if (!target) { showOsd(delta > 0 ? '마지막 회차입니다' : '첫 회차입니다'); return; }
    if (CTX.mode === 'modal') openPlayer(target.href, { history: 'replace' });
    else location.href = target.href;
  }

  const quiet = (p) => { if (p && p.catch) p.catch(() => {}); };
  const exitFs = () => { if (document.fullscreenElement && document.exitFullscreen) quiet(document.exitFullscreen()); };

  function toggleFullscreen() {
    if (!CTX) return;
    if (document.fullscreenElement) { exitFs(); return; }
    if (CTX.stage.requestFullscreen) quiet(CTX.stage.requestFullscreen());
  }

  // 재생 중일 때의 단축키. 처리했으면 true
  function handlePlayerKey(code, shift) {
    if (!CTX) return false;
    // TV 리모컨: 확인은 재생/일시정지, ▼ 는 아래 회차 목록으로 (음량은 TV 음량 키로)
    if (TV && code === 'Enter') { sendPlayer({ type: 'toggle' }); return true; }
    if (TV && code === 'ArrowDown') {
      const panel = CTX.mode === 'modal' ? P.body : pagePanel;
      const first = panel && panel.querySelector('.nfx-watch-btns .nfx-btn, .nfx-ep');
      if (first) focusEl(first, true);
      return true;
    }
    if (TV && code === 'ArrowUp') return true;
    if (code === 'Escape') {
      if (document.fullscreenElement) { exitFs(); return true; }
      if (CTX.mode === 'modal') closePlayer(); else goBackFromPage();
      return true;
    }
    if (code === 'KeyF') { toggleFullscreen(); return true; }
    if (code === 'KeyN') { gotoEp(shift ? -1 : 1); return true; }
    if (code === 'KeyP') { gotoEp(-1); return true; }
    const cmd = PLAYER_KEYS[code];
    if (cmd) { sendPlayer(cmd); return true; }
    return false;
  }

  // ---------------------------------------------------------------- 키보드
  const FOCUSABLE = [
    '.nfx-card', '.nfx-hero-btns .nfx-btn', '.nfx-chips .nfx-chip', '.nfx-pager .nfx-chip',
    '.nfx-watch-btns .nfx-btn', '.nfx-ep', '.nfx-episodes-tools .nfx-chip',
    '#nfx-header .nfx-nav > a', '#nfx-header .nfx-more-menu > button', '#nfx-header .nfx-more-menu.is-open .nfx-more-list a',
    '#nfx-header .nfx-search-btn',
  ].join(',');

  function spatialMove(dir, scope) {
    const els = [...scope.querySelectorAll(FOCUSABLE)].filter((el) => {
      if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return false;
      if (scope === document && P && P.el.contains(el)) return false;
      return el.getClientRects().length > 0;
    });
    if (!els.length) return false;
    const cur = els.includes(document.activeElement) ? document.activeElement : null;
    if (!cur) {
      const vh = window.innerHeight;
      const first = els.find((el) => { const r = el.getBoundingClientRect(); return r.top >= 60 && r.bottom <= vh && r.left >= 0; }) || els[0];
      focusEl(first, true);
      return true;
    }
    const r = cur.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const cands = els.filter((el) => el !== cur).map((el) => {
      const b = el.getBoundingClientRect();
      return { el, x: b.left + b.width / 2, y: b.top + b.height / 2, b };
    });
    let best = null;
    if (dir === 'left' || dir === 'right') {
      const sign = dir === 'right' ? 1 : -1;
      // 같은 줄(세로로 겹치는 것) 중에서 가장 가까운 것
      const same = cands.filter((c) => (c.x - cx) * sign > 4 && c.b.top < r.bottom && c.b.bottom > r.top);
      same.sort((a, b) => Math.abs(a.x - cx) - Math.abs(b.x - cx));
      best = same[0];
    } else {
      const sign = dir === 'down' ? 1 : -1;
      const ahead = cands.filter((c) => (c.y - cy) * sign > 8 && (sign > 0 ? c.b.top >= r.top + 8 : c.b.bottom <= r.bottom - 8));
      if (ahead.length) {
        const nearest = Math.min(...ahead.map((c) => Math.abs(c.y - cy)));
        const band = ahead.filter((c) => Math.abs(c.y - cy) <= nearest + 24);
        // 다음 줄에서 화면에 보이는 것 가운데 가로 위치가 가장 가까운 것
        band.sort((a, b) => Math.abs(a.x - cx) - Math.abs(b.x - cx));
        const visible = band.filter((c) => c.b.left >= -4 && c.b.right <= window.innerWidth + 4);
        best = visible[0] || band[0];
      }
    }
    if (!best) return false;
    focusEl(best.el, dir === 'up' || dir === 'down');
    return true;
  }

  // scrollIntoView 는 넘침을 숨긴 상자(히어로 등) 안쪽까지 밀어 올려 화면이 깨지므로 스크롤을 직접 계산한다
  function focusEl(el, vertical) {
    el.focus({ preventScroll: true });
    const smooth = (box, opts) => box.scrollBy({ ...opts, behavior: 'smooth' });

    // 가로: 포스터 줄 안에서만
    const track = el.closest('.nfx-track');
    if (track) {
      const t = track.getBoundingClientRect(), r = el.getBoundingClientRect(), pad = Math.min(80, t.width * 0.06);
      if (r.left < t.left + pad) smooth(track, { left: r.left - t.left - pad });
      else if (r.right > t.right - pad) smooth(track, { left: r.right - t.right + pad });
    }
    // 회차 목록이 따로 스크롤되는 경우 그 안에서 먼저 보이게
    const list = el.closest('.nfx-ep-list');
    if (list && list.scrollHeight > list.clientHeight + 2) {
      const l = list.getBoundingClientRect(), r = el.getBoundingClientRect();
      if (r.top < l.top) list.scrollTop += r.top - l.top - 8;
      else if (r.bottom > l.bottom) list.scrollTop += r.bottom - l.bottom + 8;
    }
    // 세로: 플레이어 창 또는 페이지
    if (el.closest('#nfx-header')) return;
    const scroller = el.closest('#nfx-player');
    const r = el.getBoundingClientRect(), vh = window.innerHeight, top = 90;
    let dy = 0;
    if (vertical) dy = r.top + r.height / 2 - vh / 2;
    else if (r.top < top) dy = r.top - top;
    else if (r.bottom > vh - 20) dy = r.bottom - vh + 20;
    if (Math.abs(dy) > 2) smooth(scroller || window, { top: dy });
  }

  function installKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const t = e.target;
      const code = codeOf(e);
      if (isEditable(t)) {
        if (code === 'Escape') { e.preventDefault(); t.blur(); }
        return;
      }
      const playing = !!CTX && (CTX.mode === 'page' || root.classList.contains('nfx-modal'));
      const panel = !playing ? null : (CTX.mode === 'modal' ? P.body : pagePanel);
      const inPanel = panel && panel.contains(document.activeElement);
      const isArrow = code.startsWith('Arrow');
      const dir = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }[code];

      if (playing) {
        // 아래 정보·회차 목록에 초점이 있으면 방향키는 목록 이동, Enter/Space 는 기본 동작
        if (inPanel && (isArrow || code === 'Enter' || code === 'Space')) {
          if (!isArrow) return;
          e.preventDefault();
          if (!spatialMove(dir, panel) && dir === 'up') {
            document.activeElement.blur();
            if (CTX.mode === 'modal') P.el.focus({ preventScroll: true });
            (CTX.mode === 'modal' ? P.el : window).scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }
        // Tab 으로 정보 영역에 들어갈 수 있게 Tab 은 그대로 둔다
        if (code === 'Tab') return;
        if (handlePlayerKey(code, e.shiftKey)) { e.preventDefault(); e.stopPropagation(); }
        return;
      }

      // 둘러보기 화면
      if (dir) { e.preventDefault(); spatialMove(dir, document); return; }
      if (code === 'Slash' && searchInput) { e.preventDefault(); searchInput.focus(); return; }
      // TV 리모컨 '뒤로': 이전 페이지로(홈에서는 TV 기본 동작에 맡김)
      if (TV && e.keyCode === 10009) {
        if (location.pathname !== '/' && history.length > 1) { e.preventDefault(); history.back(); }
        return;
      }
      if (code === 'Escape' && document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    }, true);
  }

  // ---------------------------------------------------------------- 작품 정보·회차 패널
  function mountPanel(container, d, inPlayer) {
    container.textContent = '';
    container.append(watchPanel(d, inPlayer, () => mountPanel(container, d, inPlayer)));
  }

  function watchPanel(d, inPlayer, remount) {
    const curIdx = d.eps.findIndex((e) => e.current);
    const nextEp = curIdx >= 0 ? d.eps[curIdx + 1] : null;
    const prevEp = curIdx > 0 ? d.eps[curIdx - 1] : null;
    const playAttr = inPlayer ? 'play' : null;
    const unwatched = d.eps.length > 1 ? firstUnwatched(d.eps) : null;
    const neverWatched = !d.eps.some((e) => !e.current && PROG[epPath(e.href)]);

    const favBtn = h('button', { type: 'button', class: 'nfx-btn is-gray' });
    const syncFav = () => {
      const on = FAVS.some((x) => x.key === d.key);
      favBtn.textContent = on ? '✓  찜한 콘텐츠' : '+  내가 찜한 콘텐츠';
      favBtn.classList.toggle('is-on', on);
    };
    syncFav();
    favBtn.addEventListener('click', async () => {
      FAVS = await store.get('favs', []);
      if (FAVS.some((x) => x.key === d.key)) FAVS = FAVS.filter((x) => x.key !== d.key);
      else FAVS.unshift({ key: d.key, href: d.href, title: d.seriesTitle, img: d.poster, ts: Date.now() });
      FAVS = FAVS.slice(0, 100);
      await store.set('favs', FAVS);
      syncFav();
    });

    const year = d.info.map((s) => s.match(/(\d{4})-\d{2}/)).find(Boolean);
    const country = d.info.map((s) => s.match(/^국가:\s*(.+)$/)).find(Boolean);
    const lbl = (e) => epLabel(e.title, d.seriesTitle);

    return h('div', { class: 'nfx-watch' },
      h('div', { class: 'nfx-watch-top' },
        h('div', { class: 'nfx-watch-main' },
          h('div', { class: 'nfx-watch-meta' },
            d.rating && !/0\.0/.test(d.rating) ? h('span', { class: 'nfx-match' }, d.rating) : null,
            year ? h('span', null, year[1]) : null,
            country ? h('span', { class: 'nfx-tag' }, country[1]) : null,
            d.eps.length > 1 ? h('span', null, `에피소드 ${d.eps.length}개`) : null),
          h('div', { class: 'nfx-watch-title' }, d.seriesTitle),
          d.epTitle && d.epTitle !== d.seriesTitle ? h('div', { class: 'nfx-watch-ep' }, d.epTitle) : null,
          h('div', { class: 'nfx-watch-btns' },
            prevEp ? h('a', { class: 'nfx-btn is-gray', href: prevEp.href, 'data-nfx-play': playAttr, title: '이전 화 (P)' }, '◀  이전 화') : null,
            nextEp ? h('a', { class: 'nfx-btn is-white', href: nextEp.href, 'data-nfx-play': playAttr, title: '다음 화 (N)' }, '다음 화  ▶') : null,
            unwatched && !unwatched.current && !neverWatched
              ? h('a',{ class: 'nfx-btn is-gray', href: unwatched.href, 'data-nfx-play': playAttr }, `▶  안 본 회차부터 (${lbl(unwatched)})`)
              : null,
            neverWatched && curIdx > 0
              ? h('a', { class: 'nfx-btn is-gray', href: d.eps[0].href, 'data-nfx-play': playAttr }, `⏮  ${lbl(d.eps[0])}부터`)
              : null,
            favBtn),
          d.story ? h('p', { class: 'nfx-watch-story' }, d.story) : null),
        h('div', { class: 'nfx-watch-side' },
          d.cast.length ? h('p', null, h('span', { class: 'nfx-dim' }, '출연: '), d.cast.slice(0, 6).join(', ')) : null,
          d.genres.length ? h('p', null, h('span', { class: 'nfx-dim' }, '장르: '), d.genres.join(', ')) : null,
          d.info.length ? h('p', null, h('span', { class: 'nfx-dim' }, '정보: '), d.info.join(' · ')) : null,
          TV
            ? h('p', null, h('span', { class: 'nfx-dim' }, '리모컨: '), '확인 재생/정지 · ◀▶ 10초 · ▼ 회차 목록 · CH▲▼ 다음/이전 화 · 뒤로 닫기')
            : h('p', null, h('span', { class: 'nfx-dim' }, '키보드: '), 'Space 재생/정지 · ←→ 10초 · ↑↓ 음량 · F 전체화면 · N/P 다음/이전 화 · Esc 뒤로'))),
      d.eps.length > 1 ? episodeList(d, remount) : null);
  }

  function episodeList(d, remount) {
    const eps = d.eps;
    let asc = true;
    const list = h('div', { class: 'nfx-ep-list' });
    const filter = h('input', { type: 'search', class: 'nfx-ep-filter', placeholder: '회차 검색' });
    const sortBtn = h('button', { type: 'button', class: 'nfx-chip' }, '최신 화부터');
    const paths = eps.map((e) => epPath(e.href));
    const curPath = (eps.find((e) => e.current) || {}).href;

    const render = () => {
      const q = filter.value.trim();
      const arr = (asc ? eps : [...eps].reverse()).filter((e) => !q || e.title.includes(q));
      list.textContent = '';
      arr.forEach((e) => {
        const n = eps.indexOf(e) + 1;
        const path = epPath(e.href);
        const p = PROG[path];
        const done = watched(path, paths, curPath && epPath(curPath));
        const ratio = done ? 1 : (p && p.d > 0 ? p.t / p.d : 0);
        const img = h('img', { src: e.img, alt: '', loading: 'lazy' });
        img.addEventListener('error', () => img.remove(), { once: true });
        const mark = h('button', { type: 'button', class: 'nfx-ep-mark', title: done ? '안 본 회차로 표시' : '본 회차로 표시', tabindex: '-1' }, '✓');
        mark.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const cur = PROG[path] || {};
          PROG[path] = done
            ? { ...cur, done: false, opened: false, t: 0, ts: Date.now() }
            : { ...cur, done: true, opened: true, ts: Date.now() };
          saveProg(true);
          remount();
        });
        const status = e.current ? '지금 보는 중 · ' : (done ? '' : (p && p.d > 0 ? `${fmt(p.t)} 시청 · ` : ''));
        list.append(h('a', { class: 'nfx-ep' + (e.current ? ' is-current' : '') + (done ? ' is-done' : ''), href: e.href },
          h('div', { class: 'nfx-ep-num' }, String(n)),
          h('div', { class: 'nfx-ep-thumb' }, img, h('span', { class: 'nfx-ep-play' }, '▶'), progressBar(ratio)),
          h('div', { class: 'nfx-ep-body' },
            h('div', { class: 'nfx-ep-title' }, e.title, done ? h('span', { class: 'nfx-ep-badge' }, '시청 완료') : null),
            h('div', { class: 'nfx-ep-date' }, status + e.date)),
          mark));
      });
      const cur = list.querySelector('.nfx-ep.is-current');
      if (cur) requestAnimationFrame(() => { list.scrollTop = cur.offsetTop - list.clientHeight / 2 + cur.clientHeight / 2; });
    };
    sortBtn.addEventListener('click', () => {
      asc = !asc;
      sortBtn.textContent = asc ? '최신 화부터' : '1화부터';
      render();
    });
    filter.addEventListener('input', render);
    render();

    return h('div', { class: 'nfx-episodes' },
      h('div', { class: 'nfx-episodes-head' },
        h('h2', null, '회차'),
        h('div', { class: 'nfx-episodes-tools' }, filter, sortBtn)),
      list);
  }

  boot();
})();

    ;
    // ---- player.js
// 티비몬 페이지 안에 들어간 영상 플레이어 프레임에서만 동작한다.
// - 키보드로 재생/정지·건너뛰기·음량 조절
// - 시청 진행률을 위(티비몬 화면)로 알려 이어보기에 쓰게 한다
// - 마우스 움직임을 알려 뒤로가기 단추를 잠깐 보이게 한다
// 플레이어가 보내는 요청에는 손대지 않는다.
(() => {
  'use strict';
  if (window.top === window) return;
  const HOST_RE = /(^|\.)tvmon\d*\.[a-z.]+$/i;
  if (HOST_RE.test(location.hostname)) return;
  let underTvmon = false;
  try {
    const a = location.ancestorOrigins || [];
    for (let i = 0; i < a.length; i++) {
      if (HOST_RE.test(new URL(a[i]).hostname)) { underTvmon = true; break; }
    }
  } catch (e) { /* 무시 */ }
  if (!underTvmon) return;

  const LOCAL = {
    Space: { type: 'toggle' }, KeyK: { type: 'toggle' },
    ArrowLeft: { type: 'seek', by: -10 }, KeyJ: { type: 'seek', by: -10 },
    ArrowRight: { type: 'seek', by: 10 }, KeyL: { type: 'seek', by: 10 },
    ArrowUp: { type: 'vol', by: 0.1 }, ArrowDown: { type: 'vol', by: -0.1 },
    KeyM: { type: 'mute' }, Digit0: { type: 'seekTo', t: 0 }, Home: { type: 'seekTo', t: 0 },
  };
  const UP = new Set(['KeyF', 'KeyN', 'KeyP', 'Escape']);
  const TV_KEYS = {
    10009: 'Escape', 413: 'Escape', 10252: 'Space', 415: 'Space', 19: 'Space',
    417: 'KeyL', 412: 'KeyJ', 427: 'KeyN', 428: 'KeyP', 10233: 'KeyN', 10232: 'KeyP',
    37: 'ArrowLeft', 38: 'ArrowUp', 39: 'ArrowRight', 40: 'ArrowDown',
  };
  const codeOf = (e) => TV_KEYS[e.keyCode] || e.code || '';

  const up = (msg) => { try { window.parent.postMessage({ nfxUp: msg }, '*'); } catch (e) { /* 무시 */ } };
  const childWins = () => [...document.querySelectorAll('iframe')].map((f) => f.contentWindow).filter(Boolean);
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const isEditable = (t) => t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

  function findVideo(node) {
    const v = node.querySelector('video');
    if (v) return v;
    for (const el of node.querySelectorAll('*')) {
      if (el.shadowRoot) { const x = findVideo(el.shadowRoot); if (x) return x; }
    }
    return null;
  }

  let video = null;
  function getVideo() {
    if (video && video.isConnected) return video;
    video = findVideo(document);
    if (video) bind(video);
    return video;
  }

  const dur = (v) => (isFinite(v.duration) ? v.duration : 0);
  function report(v) { if (dur(v)) up({ type: 'progress', t: v.currentTime, d: dur(v), paused: v.paused }); }
  function bind(v) {
    v.addEventListener('playing', () => report(v));
    v.addEventListener('pause', () => report(v));
    v.addEventListener('ended', () => up({ type: 'ended', t: v.currentTime, d: dur(v) }));
  }
  setInterval(() => { const v = getVideo(); if (v && !v.paused) report(v); }, 5000);

  function run(cmd) {
    const v = getVideo();
    if (!v) { childWins().forEach((w) => w.postMessage({ nfxCmd: cmd }, '*')); return; }
    const end = dur(v) ? dur(v) - 1 : 1e9;
    switch (cmd.type) {
      case 'toggle':
        if (v.paused) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
        break;
      case 'seek': v.currentTime = clamp(v.currentTime + cmd.by, 0, end); break;
      case 'seekTo': v.currentTime = clamp(cmd.t, 0, end); break;
      case 'vol': v.muted = false; v.volume = clamp(Math.round((v.volume + cmd.by) * 10) / 10, 0, 1); break;
      case 'mute': v.muted = !v.muted; break;
      default: return;
    }
    setTimeout(() => up({
      type: 'state', action: cmd.type, by: cmd.by, paused: v.paused,
      t: v.currentTime, d: dur(v), vol: v.volume, muted: v.muted,
    }), cmd.type === 'toggle' ? 150 : 40);
  }

  window.addEventListener('message', (e) => {
    const m = e.data;
    if (!m || typeof m !== 'object') return;
    if (e.source === window.parent && m.nfxCmd) run(m.nfxCmd);
    else if (m.nfxUp && e.source !== window.parent && childWins().includes(e.source)) up(m.nfxUp);
  });

  // 플레이어 자체 단축키와 겹치지 않도록 먼저 받아서 처리한다
  const swallow = (e) => { e.preventDefault(); e.stopImmediatePropagation(); };
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || isEditable(e.target)) return;
    const code = codeOf(e);
    if (LOCAL[code]) { swallow(e); run(LOCAL[code]); }
    else if (UP.has(code)) { swallow(e); up({ type: 'key', code, shift: e.shiftKey }); }
  }, true);
  window.addEventListener('keyup', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || isEditable(e.target)) return;
    const code = codeOf(e);
    if (LOCAL[code] || UP.has(code)) swallow(e);
  }, true);

  let lastMove = 0;
  window.addEventListener('mousemove', () => {
    const now = Date.now();
    if (now - lastMove > 300) { lastMove = now; up({ type: 'move' }); }
  }, { passive: true, capture: true });
})();

  }

  if (document.documentElement) run();
  else new MutationObserver(function (m, ob) {
    if (document.documentElement) { ob.disconnect(); run(); }
  }).observe(document, { childList: true });
})();
