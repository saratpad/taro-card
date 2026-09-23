import os
import re
import urllib.request
import urllib.parse
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONTENT_FILE = "/Users/surawut/.gemini/antigravity-ide/brain/3e1699ec-bd83-43e8-a978-5ac9aabdd82a/.system_generated/steps/4/content.md"
SOURCE_URL = "https://www.shitsuren-tarot.com/tarot/"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def get_html_content():
    if os.path.exists(CONTENT_FILE):
        with open(CONTENT_FILE, "r", encoding="utf-8") as f:
            return f.read()
    
    req = urllib.request.Request(SOURCE_URL, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode("utf-8", errors="replace")

def clean_filename(name):
    # Remove characters invalid in filenames
    name = re.sub(r'[\\/*?:"<>|]', "", name)
    return name.strip()

def parse_cards(html):
    cards = []
    
    # Identify the section containing the cards
    # The categories are:
    # Major Arcana: lines before 'ไพ่ชุดเหรียญ'
    # Pentacles: between 'ไพ่ชุดเหรียญ' and 'ไพ่ชุดถ้วย'
    # Cups: between 'ไพ่ชุดถ้วย' and 'ไพ่ชุดดาบ'
    # Swords: between 'ไพ่ชุดดาบ' and 'ไพ่ชุดไม้'
    # Wands: after 'ไพ่ชุดไม้' until 'CONTENT END'
    
    categories = [
        ("01_Major_Arcana", r'<div class="pt-cv-wrapper"><div class="pt-cv-view pt-cv-grid pt-cv-colsys" id="pt-cv-view-40337651mt">(.*?)<div class="row"', 22),
        ("02_Pentacles_เหรียญ", r'<h3>ไพ่ชุดเหรียญ</h3>\s*<div class="pt-cv-wrapper"><div class="pt-cv-view pt-cv-grid pt-cv-colsys" id="pt-cv-view-9d99850hrc">(.*?)<h3>ไพ่ชุดถ้วย</h3>', 14),
        ("03_Cups_ถ้วย", r'<h3>ไพ่ชุดถ้วย</h3>\s*<div class="pt-cv-wrapper"><div class="pt-cv-view pt-cv-grid pt-cv-colsys" id="pt-cv-view-22123ab0cb">(.*?)<h3>ไพ่ชุดดาบ</h3>', 14),
        ("04_Swords_ดาบ", r'<h3>ไพ่ชุดดาบ</h3>\s*<div class="pt-cv-wrapper"><div class="pt-cv-view pt-cv-grid pt-cv-colsys" id="pt-cv-view-c76c9c4wuz">(.*?)<h3>ไพ่ชุดไม้</h3>', 14),
        ("05_Wands_ไม้", r'<h3>ไพ่ชุดไม้</h3>\s*<div class="pt-cv-wrapper"><div class="pt-cv-view pt-cv-grid pt-cv-colsys" id="pt-cv-view-ba82908e76">(.*?)<!-- CONTENT END', 14),
    ]

    for cat_name, cat_pattern, expected_count in categories:
        match = re.search(cat_pattern, html, re.DOTALL)
        if not match:
            print(f"Warning: Category pattern not found for {cat_name}")
            continue
        
        section_html = match.group(1)
        
        # In each section, items are in <div class="col-md-2 col-sm-3 col-xs-6 pt-cv-content-item pt-cv-1-col" >
        item_blocks = re.findall(
            r'<div class="[^"]*pt-cv-content-item[^"]*"[^>]*>(.*?)</div>\s*</div>',
            section_html,
            re.DOTALL
        )
        
        print(f"[{cat_name}] Found {len(item_blocks)} cards (expected {expected_count})")
        
        idx = 0 if cat_name == "01_Major_Arcana" else 1
        for item in item_blocks:
            # Extract title: <h4 class="pt-cv-title"><a ...>TITLE</a></h4>
            title_match = re.search(r'<h4 class="pt-cv-title"><a[^>]*>(.*?)</a></h4>', item, re.DOTALL)
            title = title_match.group(1).strip() if title_match else f"card_{idx:02d}"
            
            # Extract image URL: look at srcset for original 320w or un-suffixed image
            # srcset=".../M_0-168x300.png 168w, https://.../M_0.png 320w"
            # Or src attribute
            srcset_match = re.search(r'srcset=[\"\']([^\"\']+)[\"\']', item)
            img_url = None
            if srcset_match:
                sources = srcset_match.group(1).split(',')
                for s in sources:
                    parts = s.strip().split()
                    if len(parts) == 2 and '320w' in parts[1]:
                        img_url = parts[0]
                        break
                    elif len(parts) >= 1:
                        img_url = parts[0]
            
            if not img_url:
                src_match = re.search(r'src=[\"\']([^\"\']+)[\"\']', item)
                if src_match:
                    img_url = src_match.group(1)
            
            # If thumbnail was matched, strip -168x300 to get full size
            if img_url:
                img_url = re.sub(r'-\d+x\d+(\.\w+)$', r'\1', img_url)
            
            cards.append({
                "category": cat_name,
                "index": idx,
                "title": title,
                "img_url": img_url
            })
            idx += 1

    return cards

def download_file(url, dest_path):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
        with open(dest_path, "wb") as f:
            f.write(data)
    return len(data)

def main():
    print("=" * 60)
    print(" Tarot Card Downloader (78 Cards Full Resolution) ")
    print("=" * 60)
    
    html = get_html_content()
    cards = parse_cards(html)
    print(f"\nTotal cards identified: {len(cards)} / 78")
    
    if len(cards) != 78:
        print(f"Warning: Expected 78 cards, found {len(cards)}")
    
    success_count = 0
    fail_count = 0
    
    for i, c in enumerate(cards, 1):
        cat_dir = os.path.join(BASE_DIR, c["category"])
        os.makedirs(cat_dir, exist_ok=True)
        
        ext = os.path.splitext(urllib.parse.urlparse(c["img_url"]).path)[1] or ".png"
        clean_title = clean_filename(c["title"])
        filename = f"{c['index']:02d}_{clean_title}{ext}"
        dest_path = os.path.join(cat_dir, filename)
        
        print(f"[{i:02d}/78] Downloading: {c['category']} -> {filename} ... ", end="", flush=True)
        try:
            size_bytes = download_file(c["img_url"], dest_path)
            print(f"OK ({size_bytes / 1024:.1f} KB)")
            success_count += 1
        except Exception as e:
            print(f"FAILED ({e})")
            fail_count += 1
            
    print("\n" + "=" * 60)
    print(f"Download complete: {success_count} succeeded, {fail_count} failed.")
    print(f"Cards saved to: {BASE_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
