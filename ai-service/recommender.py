import json
import os
import re

class Recommender:
    def __init__(self):
        self.products_path = os.path.join(os.path.dirname(__file__), "products.json")
        self.products = self.load_products()

    def load_products(self):
        try:
            with open(self.products_path, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading products: {e}")
            return []

    def extract_price(self, query):
        """Extracts max price from queries like 'under 1000' or 'below 500'"""
        price_match = re.search(r'(?:under|below|budget|max|up to)\s*(\d+)', query.lower())
        if price_match:
            return int(price_match.group(1))
        return None

    def get_product(self, product_id):
        """Finds a product by its ID"""
        for p in self.products:
            if str(p.get("id")) == str(product_id):
                return p
        return None

    def get_similar_products(self, product_id, limit=6):
        """Finds similar products based on category, tags, and price"""
        target = self.get_product(product_id)
        if not target:
            return []

        scored_products = []
        for p in self.products:
            if str(p.get("id")) == str(product_id):
                continue
            
            score = 0
            # Category match
            if p.get("category") == target.get("category"):
                score += 2
            
            # Tag match
            target_tags = set(target.get("tags", []))
            p_tags = set(p.get("tags", []))
            common_tags = target_tags.intersection(p_tags)
            score += len(common_tags)
            
            # Price match (within 500)
            if abs(p.get("price", 0) - target.get("price", 0)) <= 500:
                score += 1
                
            scored_products.append({"product": p, "score": score})
            
        # Sort by score descending, then popularity descending
        scored_products.sort(key=lambda x: (x["score"], x["product"].get("popularity", 0)), reverse=True)
        
        # If the highest score is 0, fallback to just trending products
        if scored_products and scored_products[0]["score"] == 0:
            trending = sorted([p for p in self.products if str(p.get("id")) != str(product_id)], 
                              key=lambda x: x.get("popularity", 0), reverse=True)
            return trending[:limit]
            
        # Extract products from the scored list
        return [item["product"] for item in scored_products[:limit]]

    def recommend(self, query):
        query_lower = query.lower()
        max_price = self.extract_price(query_lower)
        
        # Simple tag extraction: check which product tags appear in the query
        all_tags = set()
        for p in self.products:
            all_tags.update(p["tags"])
        
        target_tags = [tag for tag in all_tags if tag in query_lower]
        
        # 1. Exact match (price + tags)
        results = []
        if max_price and target_tags:
            results = [p for p in self.products if p["price"] <= max_price and any(t in target_tags for t in p["tags"])]
        
        # 2. If no result -> close price (+500 range)
        if not results and max_price and target_tags:
            results = [p for p in self.products if p["price"] <= (max_price + 500) and any(t in target_tags for t in p["tags"])]
            
        # 3. If still no result -> ignore price, match tags
        if not results and target_tags:
            results = [p for p in self.products if any(t in target_tags for t in p["tags"])]
            
        # 4. Final fallback -> trending (based on popularity)
        if not results:
            results = sorted(self.products, key=lambda x: x.get("popularity", 0), reverse=True)[:5]

        # Sort all results by popularity and return top 12
        final_results = sorted(results, key=lambda x: x.get("popularity", 0), reverse=True)[:12]
        return final_results

engine = Recommender()
