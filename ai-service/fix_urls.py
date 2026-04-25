import json
import urllib.request
from concurrent.futures import ThreadPoolExecutor

fallbacks = [
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80",
    "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=500&q=80",
    "https://images.unsplash.com/photo-1511398248880-928d3f11467a?w=500&q=80",
    "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=500&q=80",
    "https://images.unsplash.com/photo-1577046848358-4501cb0d7b29?w=500&q=80"
]

fallback_idx = 0

def get_fallback():
    global fallback_idx
    url = fallbacks[fallback_idx % len(fallbacks)]
    fallback_idx += 1
    return url

def check_url(idx, url):
    try:
        req = urllib.request.Request(url, method="HEAD", headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req, timeout=5)
        return idx, url, response.status == 200
    except Exception as e:
        return idx, url, False

def fix_json(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    urls = [p.get('image') for p in data if 'image' in p]
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(check_url, i, data[i].get('image')) for i in range(len(data)) if 'image' in data[i]]
        results = [f.result() for f in futures]
    
    broken_count = 0
    for idx, url, is_valid in results:
        if not is_valid:
            data[idx]['image'] = get_fallback()
            broken_count += 1
            
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
        
    print(f"Fixed {broken_count} broken URLs in {filepath}")

fix_json('products.json')

# fix mockData.js
import re
import os
mockDataPath = os.path.join("..", "data", "mockData.js")
with open(mockDataPath, 'r') as f:
    content = f.read()

urls = re.findall(r'image:\s*"(https://images.unsplash.com/[^"]+)"', content)

for url in urls:
    idx, u, is_valid = check_url(0, url)
    if not is_valid:
        content = content.replace(f'"{url}"', f'"{get_fallback()}"')

with open(mockDataPath, 'w') as f:
    f.write(content)

print(f"Fixed URLs in mockData.js")
