#!/usr/bin/env python3
"""Helper utility for generating dropdowns, changelog stubs, and validating HTML files."""

import os
import re

LOCALES = [
    ('', 'en', 'en', 'English', 'EN', 'Language'),
    ('zh', 'zh-CN', 'zh-CN', '简体中文', '中文', '语言'),
    ('zh-Hant', 'zh-Hant', 'zh-Hant', '繁體中文', '繁中', '語言'),
    ('es', 'es', 'es', 'Español', 'ES', 'Idioma'),
    ('ar', 'ar', 'ar', 'العربية', 'عربي', 'اللغة'),
    ('pt', 'pt', 'pt', 'Português', 'PT', 'Idioma'),
    ('fr', 'fr', 'fr', 'Français', 'FR', 'Langue'),
    ('ru', 'ru', 'ru', 'Русский', 'RU', 'Язык'),
    ('de', 'de', 'de', 'Deutsch', 'DE', 'Sprache'),
    ('ja', 'ja', 'ja', '日本語', '日本語', '言語'),
    ('tr', 'tr', 'tr', 'Türkçe', 'TR', 'Dil'),
    ('ko', 'ko', 'ko', '한국어', '한국어', '언어'),
    ('it', 'it', 'it', 'Italiano', 'IT', 'Lingua'),
    ('nl', 'nl', 'nl', 'Nederlands', 'NL', 'Taal'),
]

SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>'

DETECT_SCRIPT = "<script>(function(){try{var K='lucent-lang',p=location.pathname;var LOCALES=['en','zh','zh-Hant','es','ar','fr','pt','ru','de','ja','tr','ko','it','nl'];var m=p.match(/\\/(zh-Hant|zh|ja|ko|es|fr|de|pt|ru|it|nl|ar|tr)(\\/|$)/);var cur=m?m[1]:'en';var s=null;try{s=localStorage.getItem(K)}catch(e){}var base=p.replace(/\\/(zh-Hant|zh|ja|ko|es|fr|de|pt|ru|it|nl|ar|tr)(\\/|$)/,'$2');var go=function(t){if(LOCALES.indexOf(t)===-1)t='en';if(t===cur)return;var np=t==='en'?base:base.replace(/\\/([^\\/]*)$/,'/'+t+'/$1');location.replace(np+location.search+location.hash)};if(s){go(s);return}if(m){try{localStorage.setItem(K,cur)}catch(e){}return}var l=(navigator.language||navigator.userLanguage||'').toLowerCase();if(l){var t='en';if(l.indexOf('zh-hant')===0||l.indexOf('zh-tw')===0||l.indexOf('zh-hk')===0||l.indexOf('zh-mo')===0)t='zh-Hant';else if(l.indexOf('zh')===0)t='zh';else if(l.indexOf('es')===0)t='es';else if(l.indexOf('ar')===0)t='ar';else if(l.indexOf('fr')===0)t='fr';else if(l.indexOf('pt')===0)t='pt';else if(l.indexOf('ru')===0)t='ru';else if(l.indexOf('de')===0)t='de';else if(l.indexOf('ja')===0)t='ja';else if(l.indexOf('tr')===0)t='tr';else if(l.indexOf('ko')===0)t='ko';else if(l.indexOf('it')===0)t='it';else if(l.indexOf('nl')===0)t='nl';go(t);return}var ac=new AbortController(),tm=setTimeout(function(){ac.abort()},3000);fetch('https://ipapi.co/country/',{signal:ac.signal}).then(function(r){clearTimeout(tm);return r.text()}).then(function(c){c=(c||'').trim().toUpperCase();go(c==='CN'||c==='HK'||c==='MO'||c==='TW'?'zh':c==='JP'?'ja':c==='KR'?'ko':'en')}).catch(function(){clearTimeout(tm)})}catch(e){}})();</script>"

def get_dropdown(cur_dir, page_name):
    cur_info = next(x for x in LOCALES if x[0] == cur_dir)
    _, _, _, _, short_label, summary_label = cur_info
    
    links = []
    for t_dir, t_lang, t_hreflang, t_label, _, _ in LOCALES:
        if cur_dir == '':
            href = page_name if t_dir == '' else f'{t_dir}/{page_name}'
        else:
            if t_dir == '':
                href = f'../{page_name}'
            elif t_dir == cur_dir:
                href = page_name
            else:
                href = f'../{t_dir}/{page_name}'
        
        is_cur = (t_dir == cur_dir)
        cur_attr = ' class="cur" aria-current="true"' if is_cur else ''
        links.append(f'<a href="{href}" lang="{t_lang}" hreflang="{t_hreflang}"{cur_attr}>{t_label}</a>')
    
    return f'<details class="lang"><summary aria-label="{summary_label}">{SVG}<span>{short_label}</span></summary><div class="menu">' + ''.join(links) + '</div></details>'

CHANGELOG_STUBS = {
    'zh-Hant': ('更新日誌 — Lucent', '正在跳轉至<a href="download.html#changelog">下載與更新日誌</a>…'),
    'es': ('Registro de cambios — Lucent', 'Redirigiendo a <a href="download.html#changelog">Descarga y registro de cambios</a>…'),
    'ar': ('سجل التغييرات — Lucent', 'جارٍ إعادة التوجيه إلى <a href="download.html#changelog">التنزيل وسجل التغييرات</a>…'),
    'pt': ('Registro de alterações — Lucent', 'Redirecionando para <a href="download.html#changelog">Download e registro de alterações</a>…'),
    'fr': ('Journal des modifications — Lucent', 'Redirection vers <a href="download.html#changelog">Téléchargement et journal des modifications</a>…'),
    'ru': ('История изменений — Lucent', 'Перенаправление на страницу <a href="download.html#changelog">Скачивание и история изменений</a>…'),
    'de': ('Änderungsprotokoll — Lucent', 'Weiterleitung zu <a href="download.html#changelog">Download &amp; Änderungsprotokoll</a>…'),
    'tr': ('Değişiklik Günlüğü — Lucent', '<a href="download.html#changelog">İndirme ve Değişiklik Günlüğü</a> sayfasına yönlendiriliyorsunuz…'),
    'it': ('Registro delle modifiche — Lucent', 'Reindirizzamento a <a href="download.html#changelog">Download e registro delle modifiche</a>…'),
    'nl': ('Wijzigingslogboek — Lucent', 'Doorverwijzen naar <a href="download.html#changelog">Downloaden en wijzigingslogboek</a>…'),
}

def get_changelog_stub(cur_dir):
    title, body = CHANGELOG_STUBS[cur_dir]
    lang_attr = 'lang="ar" dir="rtl"' if cur_dir == 'ar' else f'lang="{cur_dir}"'
    return f"""<!DOCTYPE html>
<html {lang_attr}>
<head>
{DETECT_SCRIPT}
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="canonical" href="https://lucent-project.github.io/lucentapp/{cur_dir}/download.html#changelog">
<meta http-equiv="refresh" content="0; url=download.html#changelog">
<script>location.replace('download.html#changelog')</script>
</head>
<body>
<p>{body}</p>
</body>
</html>
"""

if __name__ == '__main__':
    import sys
    print("Locale helper loaded. Ready.")
