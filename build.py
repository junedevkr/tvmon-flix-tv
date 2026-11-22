#!/usr/bin/env python3
"""크롬 확장(../tvmon-flix)의 코드를 TizenBrew 모듈 스크립트 한 개(dist/userScript.js)로 묶는다.

- chrome.storage 는 localStorage 로 바꿔 끼운다.
- CSS 는 <style> 로 넣고, 옛 TV 엔진이 모르는 문법(inset, min(), clamp(), :focus-visible)을 바꾼다.
- disable-devtool 스크립트는 화면 쪽에서 붙이지 않는다(TizenBrew 디버거와 만나면 화면이 멈출 수 있음).
사용법: python3 build.py
"""
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
EXT = HERE.parent / 'tvmon-flix'


def read(p):
    return Path(p).read_text(encoding='utf-8')


def tv_css(css):
    # inset: X → top/right/bottom/left
    def inset(m):
        val, imp = m.group(1).strip(), m.group(2) or ''
        return ''.join(f'{side}: {val}{imp}; ' for side in ('top', 'right', 'bottom', 'left')).rstrip()
    css = re.sub(r'inset:\s*([^;!}]+?)\s*(\s!important)?\s*;', inset, css)
    # TV 화면 폭(1920)에서는 min()/clamp() 결과가 늘 뒤쪽 값이다
    css = re.sub(r'clamp\(\s*[^,()]+,\s*[^,()]+,\s*([^()]+?)\s*\)', r'\1', css)
    css = re.sub(r'min\(\s*[^,()]+,\s*([^()]+?)\s*\)', r'\1', css)
    css = css.replace(':focus-visible', ':focus')
    return css


def main():
    pkg = json.loads(read(HERE / 'package.json'))
    css = '\n'.join([
        tv_css(read(EXT / 'css' / 'adblock.css')),
        tv_css(read(EXT / 'css' / 'netflix.css')),
        read(HERE / 'tv.css'),
    ])
    parts = {name: read(EXT / name) for name in ('guard.js', 'content.js', 'player.js')}
    for name, src in parts.items():
        if re.search(r'\?\?|\?\.[a-zA-Z(\[]|catch\s*\{', src):
            raise SystemExit(f'{name}: 옛 TV 엔진에서 안 되는 문법(??, ?., catch {{}})이 있습니다.')

    out = f"""/* TVMON Flix for TizenBrew v{pkg['version']} — build.py 로 만든 파일입니다. 직접 고치지 마세요. */
(function () {{
  'use strict';
  if (window.__nfxTvLoaded) return;
  window.__nfxTvLoaded = true;
  var NFX_TV = true;
  var HOST_RE = /(^|\\.)tvmon\\d*\\.[a-z.]+$/i;
  var onTvmon = HOST_RE.test(location.hostname);

  // chrome.storage 대신 localStorage
  function area(prefix) {{
    function readKey(k, def) {{
      try {{ var v = localStorage.getItem(prefix + k); return v == null ? def : JSON.parse(v); }}
      catch (e) {{ return def; }}
    }}
    return {{
      get: function (defs, cb) {{
        var o = {{}};
        Object.keys(defs || {{}}).forEach(function (k) {{ o[k] = readKey(k, defs[k]); }});
        if (cb) cb(o);
      }},
      set: function (obj, cb) {{
        Object.keys(obj).forEach(function (k) {{
          try {{ localStorage.setItem(prefix + k, JSON.stringify(obj[k])); }} catch (e) {{}}
        }});
        if (cb) cb();
      }},
      remove: function (keys, cb) {{
        [].concat(keys).forEach(function (k) {{ localStorage.removeItem(prefix + k); }});
        if (cb) cb();
      }}
    }};
  }}
  var chrome = {{ storage: {{ sync: area('nfx-sync:'), local: area('nfx-local:') }}, runtime: {{}} }};

  // 개발자도구 차단 스크립트(외부 CDN)는 붙이지 않는다. 티비몬 서버 쪽 요청은 그대로 둔다.
  if (onTvmon) {{
    var isDevtoolBlocker = function (n) {{
      return n && n.tagName === 'SCRIPT' &&
        (/disable-devtool/i.test(n.src || '') || (n.hasAttribute && n.hasAttribute('disable-devtool-auto')));
    }};
    var nativeAppend = Node.prototype.appendChild;
    var nativeInsert = Node.prototype.insertBefore;
    Node.prototype.appendChild = function (n) {{ return isDevtoolBlocker(n) ? n : nativeAppend.call(this, n); }};
    Node.prototype.insertBefore = function (n, r) {{ return isDevtoolBlocker(n) ? n : nativeInsert.call(this, n, r); }};
  }}

  var CSS = {json.dumps(css, ensure_ascii=False)};

  function run() {{
    if (onTvmon) {{
      var st = document.createElement('style');
      st.id = 'nfx-css';
      st.textContent = CSS;
      document.documentElement.appendChild(st);
    }}

    // ---- guard.js
{parts['guard.js']}
    ;
    // ---- content.js
{parts['content.js']}
    ;
    // ---- player.js
{parts['player.js']}
  }}

  if (document.documentElement) run();
  else new MutationObserver(function (m, ob) {{
    if (document.documentElement) {{ ob.disconnect(); run(); }}
  }}).observe(document, {{ childList: true }});
}})();
"""
    dist = HERE / 'dist'
    dist.mkdir(exist_ok=True)
    (dist / 'userScript.js').write_text(out, encoding='utf-8')
    print(f"dist/userScript.js v{pkg['version']} ({len(out):,} bytes)")


if __name__ == '__main__':
    main()
