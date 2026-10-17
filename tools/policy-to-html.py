#!/usr/bin/env python3
"""Copy the official Lucent privacy policies, word for word, into the site's privacy pages.

The text is never retyped or rewritten: this script reads the official Markdown files from the
app repository (Lucent-Project/Lucent, PRIVACY/ folder) and converts only their *formatting* to HTML.

Setup (once): put the official files in policy-src/ using their original names:

    policy-src/PRIVACY.md          -> privacy.html        (English)
    policy-src/PRIVACY.zh-CN.md    -> zh/privacy.html     (简体中文)
    policy-src/PRIVACY.ja.md       -> ja/privacy.html     (日本語)
    policy-src/PRIVACY.ko.md       -> ko/privacy.html     (한국어)

Run from the repository root (any Python 3.8+, no packages needed):

    python tools/policy-to-html.py            # converts every file that is present
    python tools/policy-to-html.py ja         # or just one language

It is safe to run again whenever a policy changes: it replaces what sits between the
<!--policy:start--> and <!--policy:end--> markers in the page, and points the page's
"Read the full privacy policy" button at the on-page copy (all links stay on this website).
"""
import html
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

CFG = {
    'en': dict(page='privacy.html', src='PRIVACY.md', kicker='THE FULL POLICY', toc='Contents',
               button='Read the full privacy policy ↓'),
    'zh': dict(page='zh/privacy.html', src='PRIVACY.zh-CN.md', kicker='完整政策', toc='目录',
               button='阅读完整隐私政策 ↓'),
    'ja': dict(page='ja/privacy.html', src='PRIVACY.ja.md', kicker='ポリシー全文', toc='目次',
               button='プライバシーポリシー全文を読む ↓'),
    'ko': dict(page='ko/privacy.html', src='PRIVACY.ko.md', kicker='전문', toc='목차',
               button='개인정보처리방침 전문 읽기 ↓'),
}

warnings = []


def esc(s, quote=False):
    return html.escape(s, quote=quote)


def inline(s):
    stash = []

    def keep(h):
        stash.append(h)
        return '\x00%d\x00' % (len(stash) - 1)

    s = re.sub(r'(`+)(.+?)\1', lambda m: keep('<code>' + esc(m.group(2).strip()) + '</code>'), s)
    s = re.sub(r'<br\s*/?>', lambda m: keep('<br>'), s)
    s = re.sub(r'<(https?://[^<>\s]+)>',
               lambda m: keep('<a href="%s" target="_blank" rel="noopener">%s</a>' % (esc(m.group(1), True), esc(m.group(1)))), s)
    s = re.sub(r'<([^<>\s@/]+@[^<>\s]+)>',
               lambda m: keep('<a href="mailto:%s">%s</a>' % (esc(m.group(1), True), esc(m.group(1)))), s)

    def link(m):
        url = m.group(2)
        ext = ' target="_blank" rel="noopener"' if re.match(r'https?://', url) else ''
        return keep('<a href="%s"%s>%s</a>' % (esc(url, True), ext, esc(m.group(1))))

    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', link, s)
    s = esc(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', s)
    return re.sub(r'\x00(\d+)\x00', lambda m: stash[int(m.group(1))], s)


def plain(s):
    s = re.sub(r'[`*_]', '', s)
    s = re.sub(r'<([^<>\s]+)>', r'\1', s)
    return re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', s).strip()


LIST_RE = re.compile(r'^(\s*)([-*+]|\d+[.)])\s+(.*)$')
HR_RE = re.compile(r'^\s{0,3}([-*_])(\s*\1){2,}\s*$')
HEAD_RE = re.compile(r'^(#{1,6})\s+(.*?)\s*#*\s*$')
SEP_RE = re.compile(r'^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$')
FENCE_RE = re.compile(r'^\s*(```|~~~)')


def is_block_start(line):
    return bool(HEAD_RE.match(line) or HR_RE.match(line) or FENCE_RE.match(line) or line.lstrip().startswith('>'))


def split_row(line):
    line = line.strip()
    if line.startswith('|'):
        line = line[1:]
    if line.endswith('|') and not line.endswith('\\|'):
        line = line[:-1]
    return [c.strip().replace('\\|', '|') for c in re.split(r'(?<!\\)\|', line)]


class Renderer:
    def __init__(self):
        self.ids = {}
        self.toc = []
        self.toc_done = False

    def heading_id(self, text):
        m = re.match(r'^(\d+(?:\.\d+)*)[.\s]', text)
        if m:
            base = 'policy-' + m.group(1).replace('.', '-')
        else:
            slug = re.sub(r'[^\w\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]+', '-', plain(text)).strip('-').lower()
            base = 'policy-' + (slug or 'section')
        n = self.ids.get(base, 0)
        self.ids[base] = n + 1
        return base if n == 0 else '%s-%d' % (base, n + 1)

    def render_list(self, items):
        out = []
        i = 0

        def build(level_indent):
            nonlocal i
            ordered = items[i]['ordered']
            tag = 'ol' if ordered else 'ul'
            parts = ['<%s>' % tag]
            while i < len(items) and items[i]['indent'] >= level_indent:
                it = items[i]
                if it['indent'] > level_indent:
                    break
                body = inline(' '.join(it['text']))
                i += 1
                if i < len(items) and items[i]['indent'] > it['indent']:
                    body += build(items[i]['indent'])
                parts.append('<li>%s</li>' % body)
            parts.append('</%s>' % tag)
            return ''.join(parts)

        while i < len(items):
            out.append(build(items[i]['indent']))
        return '\n'.join(out)

    def blocks(self, lines):
        out = []
        n = len(lines)
        i = 0
        while i < n:
            line = lines[i]
            if not line.strip():
                i += 1
                continue
            if FENCE_RE.match(line):
                fence = FENCE_RE.match(line).group(1)
                i += 1
                buf = []
                while i < n and not lines[i].strip().startswith(fence):
                    buf.append(lines[i])
                    i += 1
                i += 1
                out.append('<pre><code>%s</code></pre>' % esc('\n'.join(buf)))
                continue
            m = HEAD_RE.match(line)
            if m:
                level = len(m.group(1))
                text = m.group(2)
                if level == 2 and not self.toc_done:
                    self.toc_done = True
                    out.append('@@TOC@@')
                hid = self.heading_id(text) if level >= 2 else None
                if level == 2:
                    self.toc.append((hid, plain(text)))
                tag = 'h%d' % min(level + 1, 6)
                if level == 1:
                    out.append('<%s class="policy-title">%s</%s>' % (tag, inline(text), tag))
                else:
                    out.append('<%s id="%s">%s</%s>' % (tag, hid, inline(text), tag))
                i += 1
                continue
            if HR_RE.match(line):
                out.append('<hr>')
                i += 1
                continue
            if '|' in line and i + 1 < n and SEP_RE.match(lines[i + 1]) and '-' in lines[i + 1]:
                head = split_row(line)
                i += 2
                rows = []
                while i < n and lines[i].strip() and '|' in lines[i]:
                    rows.append(split_row(lines[i]))
                    i += 1
                t = ['<div class="table-wrap"><table><thead><tr>']
                t += ['<th>%s</th>' % inline(c) for c in head]
                t.append('</tr></thead><tbody>')
                for r in rows:
                    r = (r + [''] * len(head))[:len(head)]
                    t.append('<tr>' + ''.join('<td>%s</td>' % inline(c) for c in r) + '</tr>')
                t.append('</tbody></table></div>')
                out.append(''.join(t))
                continue
            if line.lstrip().startswith('>'):
                buf = []
                while i < n and lines[i].lstrip().startswith('>'):
                    buf.append(re.sub(r'^\s*>\s?', '', lines[i]))
                    i += 1
                out.append('<blockquote>%s</blockquote>' % '\n'.join(self.blocks(buf)))
                continue
            if LIST_RE.match(line):
                items = []
                while i < n:
                    l = lines[i]
                    lm = LIST_RE.match(l)
                    if lm and not HR_RE.match(l):
                        items.append({'indent': len(lm.group(1).expandtabs(4)), 'ordered': lm.group(2)[0].isdigit(),
                                      'text': [lm.group(3)]})
                        i += 1
                        continue
                    if not l.strip():
                        j = i + 1
                        while j < n and not lines[j].strip():
                            j += 1
                        if j < n and (LIST_RE.match(lines[j]) and not HR_RE.match(lines[j]) or lines[j].startswith(('  ', '\t'))):
                            i = j
                            continue
                        break
                    if is_block_start(l) and not l.startswith((' ', '\t')):
                        break
                    items[-1]['text'].append(l.strip())
                    i += 1
                out.append(self.render_list(items))
                continue
            buf = [line.strip()]
            i += 1
            while i < n and lines[i].strip() and not is_block_start(lines[i]) \
                    and not (re.match(r'^\s*[-*+]\s+', lines[i])) \
                    and not ('|' in lines[i] and i + 1 < n and SEP_RE.match(lines[i + 1])):
                buf.append(lines[i].strip())
                i += 1
            text = ' '.join(buf)
            if text.startswith('<') and not re.match(r'^<(https?://|[^<>\s@/]+@)', text):
                warnings.append('raw HTML kept as text: ' + text[:60])
            if re.fullmatch(r'\*\*[^*]+\*\*', text):
                out.append('<p class="meta">%s</p>' % inline(text))
            else:
                out.append('<p>%s</p>' % inline(text))
        return out


LIMIT = 4500  # max visual weight per glass card (very tall blurred panels fail to paint in some browsers)


def weight(h):
    t = re.sub(r'<[^>]+>', '', h)
    return sum(2 if ord(ch) > 0x2E7F else 1 for ch in t)


def to_cards(blocks):
    head, sections, cur = [], [], None
    for b in blocks:
        if b.startswith('<h3 id='):
            cur = [b]
            sections.append(cur)
        elif cur is None:
            head.append(b)
        else:
            cur.append(b)
    cards = []
    for sec in sections:
        if sum(weight(b) for b in sec) <= LIMIT:
            cards.append(sec)
            continue
        chunks, c = [], []
        for b in sec:
            if b.startswith('<h4 id=') and c:
                chunks.append(c)
                c = []
            c.append(b)
        chunks.append(c)
        if len(chunks) > 1 and not any(x.startswith('<h4 id=') for x in chunks[0]):
            chunks[1] = chunks[0] + chunks[1]
            chunks = chunks[1:]
        acc, accw = [], 0
        for ch in chunks:
            w = sum(weight(b) for b in ch)
            if acc and accw + w > LIMIT:
                cards.append(acc)
                acc, accw = [], 0
            acc += ch
            accw += w
        if acc:
            cards.append(acc)
    return head, cards


def convert(md, cfg):
    md = md.lstrip('\ufeff').replace('\r\n', '\n').replace('\r', '\n')
    r = Renderer()
    body = r.blocks(md.split('\n'))
    if r.toc:
        toc = ('<nav class="policy-toc" aria-label="%s"><p class="toc-label">%s</p><ul>%s</ul></nav>'
               % (esc(cfg['toc'], True), esc(cfg['toc']),
                  ''.join('<li><a href="#%s">%s</a></li>' % (i, esc(t)) for i, t in r.toc)))
    else:
        toc = ''
    head, cards = to_cards([b.replace('@@TOC@@', toc) for b in body])
    head = ['<div class="kicker">%s</div>' % esc(cfg['kicker'])] + head
    panels = ['<div class="panel glass prose">\n%s\n</div>' % '\n'.join(c) for c in [head] + cards]
    return ('<!--policy:start-->\n<div class="policy" id="policy">\n%s\n</div>\n<!--policy:end-->' % '\n'.join(panels))


def patch_page(cfg, block):
    path = ROOT / cfg['page']
    s = path.read_text(encoding='utf-8')
    s, n = re.subn(r'<!--policy:start-->.*?<!--policy:end-->', lambda m: block, s, count=1, flags=re.S)
    if n != 1:
        sys.exit('%s: policy markers not found' % cfg['page'])

    def rewire(m):
        return '<a class="btn ghost" data-policy-link href="#policy">%s</a>' % cfg['button']

    s, n = re.subn(r'<a [^>]*data-policy-link[^>]*>(.*?)</a>', rewire, s, count=1, flags=re.S)
    if n != 1:
        sys.exit('%s: policy button not found' % cfg['page'])
    path.write_text(s, encoding='utf-8', newline='\n')


def main(argv):
    langs = argv or list(CFG)
    done = 0
    for lang in langs:
        if lang not in CFG:
            sys.exit('unknown language %r (use: %s)' % (lang, ', '.join(CFG)))
        cfg = CFG[lang]
        src = ROOT / 'policy-src' / cfg['src']
        if not src.exists():
            print('skip %-2s  (policy-src/%s not found)' % (lang, cfg['src']))
            continue
        warnings.clear()
        patch_page(cfg, convert(src.read_text(encoding='utf-8'), cfg))
        print('done %-2s  %s -> %s%s' % (lang, cfg['src'], cfg['page'],
                                          ('   [' + '; '.join(warnings) + ']') if warnings else ''))
        done += 1
    if not done:
        sys.exit('nothing converted')


if __name__ == '__main__':
    main(sys.argv[1:])
