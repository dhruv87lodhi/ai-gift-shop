import json
import urllib.parse

with open('products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for product in data:
    if 'loremflickr' in product['image']:
        prompt = f"{product['name']} high quality aesthetic product photography centered"
        encoded_prompt = urllib.parse.quote(prompt)
        # Add a random seed so it's deterministic but unique
        seed = product.get('id', '1')
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=500&height=500&nologo=true&seed={seed}"
        product['image'] = url

with open('products.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated all loremflickr URLs to pollinations.ai AI image generation URLs.")
