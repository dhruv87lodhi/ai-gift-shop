import json
import urllib.request
from concurrent.futures import ThreadPoolExecutor

def check_url(url):
    try:
        req = urllib.request.Request(url, method="HEAD", headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req, timeout=5)
        return url, response.status
    except Exception as e:
        return url, str(e)

with open('products.json', 'r') as f:
    products = json.load(f)

urls = [p['image'] for p in products]

print("Checking", len(urls), "URLs...")
broken = []
with ThreadPoolExecutor(max_workers=10) as executor:
    results = executor.map(check_url, urls)
    for url, status in results:
        if status != 200:
            broken.append((url, status))

print("Broken URLs:")
for b in broken:
    print(b)
