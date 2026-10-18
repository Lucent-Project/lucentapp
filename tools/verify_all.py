#!/usr/bin/env python3
import glob
import os
import re
import sys

def verify():
    errors = []
    
    # Check app.js
    rc = os.system('node --check app.js')
    if rc != 0:
        errors.append('node --check app.js failed')
        
    expected_locales = [
        '', 'zh', 'ja', 'ko', # 4 existing
        'zh-Hant', 'es', 'fr', 'de', 'pt', 'ru', 'it', 'nl', 'ar', 'tr' # 10 new
    ]
    
    expected_pages = [
        'index.html', 'download.html', 'features.html', 'about.html',
        'support.html', 'privacy.html', 'terms.html', 'license.html', 'changelog.html'
    ]
    
    # 1. Check directories and file count
    all_html_files = []
    for loc in expected_locales:
        if loc == '':
            loc_files = glob.glob('*.html')
            # 404.html + 9 pages = 10 pages
            if len(loc_files) != 10:
                errors.append(f'Root directory has {len(loc_files)} files, expected 10')
            all_html_files.extend(loc_files)
        else:
            if not os.path.isdir(loc):
                errors.append(f'Directory {loc} does not exist')
                continue
            loc_files = glob.glob(f'{loc}/*.html')
            if len(loc_files) != 9:
                errors.append(f'Directory {loc} has {len(loc_files)} files, expected 9: {loc_files}')
            all_html_files.extend(loc_files)
            
    if len(all_html_files) != 127:
        errors.append(f'Total HTML files count is {len(all_html_files)}, expected 127')
        
    # 2. Check detect script in every HTML file
    script_needle = "var LOCALES=['en','zh','zh-Hant','es','ar','fr','pt','ru','de','ja','tr','ko','it','nl'];"
    missing_script = []
    for f in all_html_files:
        content = open(f, encoding='utf-8').read()
        if script_needle not in content:
            missing_script.append(f)
    if missing_script:
        errors.append(f'{len(missing_script)} files missing new detect script: {missing_script[:5]}...')
        
    # 3. Check dropdown in all content pages (112 pages)
    # changelog.html (14) + 404.html (1) = 15 pages do not have dropdown
    # 127 - 15 = 112 pages
    dropdown_order = [
        'English', '简体中文', '繁體中文', 'Español', 'العربية', 'Português',
        'Français', 'Русский', 'Deutsch', '日本語', 'Türkçe', '한국어', 'Italiano', 'Nederlands'
    ]
    
    dd_pages = [f for f in all_html_files if not f.endswith('changelog.html') and f != '404.html']
    if len(dd_pages) != 112:
        errors.append(f'Expected 112 pages with dropdown, found {len(dd_pages)}')
        
    bad_dropdown = []
    for f in dd_pages:
        content = open(f, encoding='utf-8').read()
        m = re.search(r'<div class="menu">(.*?)</div>', content)
        if not m:
            bad_dropdown.append((f, 'no menu div'))
            continue
        menu_html = m.group(1)
        labels = re.findall(r'>([^<]+)</a>', menu_html)
        if labels != dropdown_order:
            bad_dropdown.append((f, f'wrong labels: {labels}'))
            continue
        # Check current item has class="cur" aria-current="true"
        cur_matches = re.findall(r'class="cur" aria-current="true"', menu_html)
        if len(cur_matches) != 1:
            bad_dropdown.append((f, f'found {len(cur_matches)} active links in dropdown'))
            
    if bad_dropdown:
        errors.append(f'{len(bad_dropdown)} pages have incorrect dropdown: {bad_dropdown[:5]}')
        
    # 4. Check ar pages have dir="rtl"
    ar_files = glob.glob('ar/*.html')
    for f in ar_files:
        content = open(f, encoding='utf-8').read()
        if 'dir="rtl"' not in content:
            errors.append(f'{f} missing dir="rtl"')
        if 'lang="ar"' not in content:
            errors.append(f'{f} missing lang="ar"')
            
    # 5. Check non-ar pages do NOT have dir="rtl"
    non_ar_files = [f for f in all_html_files if not f.startswith('ar/')]
    for f in non_ar_files:
        content = open(f, encoding='utf-8').read()
        if 'dir="rtl"' in content:
            errors.append(f'{f} unexpectedly has dir="rtl"')
            
    # 6. Check sitemap.xml
    sitemap = open('sitemap.xml', encoding='utf-8').read()
    url_matches = re.findall(r'<url>', sitemap)
    if len(url_matches) != 112:
        errors.append(f'sitemap.xml has {len(url_matches)} <url> entries, expected 112')
        
    if errors:
        print(f"VERIFICATION FAILED with {len(errors)} issues:")
        for e in errors:
            print(" -", e)
        return False
    else:
        print("ALL VERIFICATION CHECKS PASSED!")
        print(f"Total HTML files: {len(all_html_files)}")
        print(f"Pages with 14-entry dropdown: {len(dd_pages)}")
        print("sitemap.xml has exactly 112 url entries.")
        return True

if __name__ == '__main__':
    ok = verify()
    sys.exit(0 if ok else 1)
