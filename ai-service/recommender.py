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
        """Extracts max price from queries like 'under 1000', 'below 500', or bare '1000'"""
        # Primary: keyword-based match
        price_match = re.search(r'(?:under|below|budget|max|up to)\s*(\d+)', query.lower())
        if price_match:
            return int(price_match.group(1))
        # Fallback: any standalone number (e.g., '1000 flowers')
        bare_match = re.search(r'\b(\d{3,5})\b', query)
        if bare_match:
            return int(bare_match.group(1))
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
            if abs(int(p.get("price", 0)) - int(target.get("price", 0))) <= 500:
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

    def recommend_stretch(self, query, max_price, target_tags, already_shown_ids=None, limit=6):
        """
        Returns products just above budget using 3 progressive tiers:
          Tier 1: Tag match, price within 50% over budget
          Tier 2: Category match, price within 70% over budget
          Tier 3: Most popular products anywhere above budget (up to 2x)
        Always tries to return `limit` products.
        """
        if not max_price:
            return []

        seen_ids = set(already_shown_ids or [])
        collected = []

        def add(candidates):
            for p in candidates:
                if p["id"] not in seen_ids and len(collected) < limit:
                    seen_ids.add(p["id"])
                    collected.append(p)

        above_budget = [p for p in self.products if int(p["price"]) > max_price]

        # Tier 1 — tag match within 50% over budget
        tier1_limit = int(max_price * 1.50)
        tier1 = sorted(
            [p for p in above_budget if int(p["price"]) <= tier1_limit
             and target_tags and any(t in target_tags for t in p["tags"])],
            key=lambda x: x.get("popularity", 0), reverse=True
        )
        add(tier1)

        # Tier 2 — detect categories from tags, match by category within 70% over budget
        if len(collected) < limit:
            tier2_limit = int(max_price * 1.70)
            # Infer relevant categories from target_tags
            relevant_cats = set(
                p["category"] for p in self.products
                if target_tags and any(t in target_tags for t in p.get("tags", []))
            )
            tier2 = sorted(
                [p for p in above_budget if int(p["price"]) <= tier2_limit
                 and p["category"] in relevant_cats],
                key=lambda x: x.get("popularity", 0), reverse=True
            )
            add(tier2)

        # Tier 3 — most popular above budget up to 2x (ignore tags/category)
        if len(collected) < limit:
            tier3_limit = int(max_price * 2.0)
            tier3 = sorted(
                [p for p in above_budget if int(p["price"]) <= tier3_limit],
                key=lambda x: x.get("popularity", 0), reverse=True
            )
            add(tier3)

        print(f"DEBUG stretch: {len(collected)} picks, prices: {[p['price'] for p in collected]}")
        return collected

    def parse_query(self, query):
        """Attempts to parse query as JSON, else extracts using regex."""
        try:
            data = json.loads(query)
            # Extracted fields from JSON
            recipient = data.get("recipient", "").lower()
            occasion = data.get("occasion", "").lower()
            budget_str = str(data.get("budget", ""))
            interest = data.get("interest", "").lower()
            max_price = self.extract_price(budget_str)
            return recipient, occasion, interest, max_price
        except:
            # Fallback for plain text
            query_lower = query.lower()
            max_price = self.extract_price(query_lower)
            return query_lower, query_lower, query_lower, max_price

    def score_product(self, product, recipient, occasion, interest, max_price):
        score = 0
        tags = product.get("tags", {})
        
        # If tags are still a list (legacy), convert to dict format for scoring
        if isinstance(tags, list):
            tags_dict = {"recipient": tags, "occasion": tags, "interest": tags}
        else:
            tags_dict = {
                "recipient": [t.lower() for t in tags.get("recipient", [])],
                "occasion": [t.lower() for t in tags.get("occasion", [])],
                "interest": [t.lower() for t in tags.get("interest", [])]
            }

        p_price = int(product.get("price", 0))
        p_category = product.get("category", "").lower()

        # Match checks
        rec_match = recipient and (any(r in recipient for r in tags_dict["recipient"]) or any(recipient in r for r in tags_dict["recipient"]))
        occ_match = occasion and (any(o in occasion for o in tags_dict["occasion"]) or any(occasion in o for o in tags_dict["occasion"]))
        int_match = interest and (any(i in interest for i in tags_dict["interest"]) or any(interest in i for i in tags_dict["interest"]))

        # Basic Scoring
        if rec_match:
            score += 50
        elif not recipient:
            score += 25

        if occ_match:
            score += 30
        elif not occasion:
            score += 15

        if int_match:
            score += 20
        elif not interest:
            score += 10

        if interest and p_category in interest:
            score += 10

        if max_price and p_price <= max_price:
            score += 10

        # Strict Relevance Penalties
        irrelevant = False
        mother_related_cats = ["jewelry", "fashion", "flowers", "personalized", "home decor", "cakes", "plants", "decor"]

        if "mother" in recipient or "mother's day" in occasion:
            # EXCLUDE products that do not match recipient, do not match occasion, AND belong to unrelated categories
            if not rec_match and not occ_match and p_category not in mother_related_cats:
                score -= 40
                irrelevant = True

        # Penalty for no recipient match when recipient is critical
        if recipient and not rec_match:
            if "mother" in recipient:
                if not occ_match:
                    score -= 30
                
        # Calculate match percentage (Max score theoretically 120)
        max_score = 120
        match_percentage = min(100, max(0, int((score / max_score) * 100)))
        
        return score, match_percentage, irrelevant

    def recommend_stretch(self, recipient, occasion, interest, max_price, already_shown_ids=None, limit=6):
        if not max_price:
            return []

        seen_ids = set(already_shown_ids or [])
        collected = []

        above_budget = [p for p in self.products if int(p["price"]) > max_price and p["id"] not in seen_ids]
        
        # Score the above budget products
        scored_above = []
        for p in above_budget:
            score, match_pct, irrelevant = self.score_product(p, recipient, occasion, interest, max_price)
            if not irrelevant: # Don't show irrelevant stuff even as stretch
                p_copy = p.copy()
                p_copy["matchPercentage"] = match_pct
                scored_above.append((score, p_copy))

        # Sort by score, then popularity
        scored_above.sort(key=lambda x: (x[0], x[1].get("popularity", 0)), reverse=True)
        
        # Take up to limit, ensuring they are within 2x budget for sanity
        for score, p in scored_above:
            if int(p["price"]) <= int(max_price * 2.0):
                collected.append(p)
                if len(collected) >= limit:
                    break

        return collected

    def recommend(self, query):
        recipient, occasion, interest, max_price = self.parse_query(query)
        print(f"DEBUG recommend: parsed JSON -> recipient='{recipient}', occasion='{occasion}', interest='{interest}', max_price={max_price}")

        scored_products = []
        for p in self.products:
            score, match_pct, irrelevant = self.score_product(p, recipient, occasion, interest, max_price)
            
            # Enforce price within budget for main recommendations (if budget provided)
            # If no price match, it won't be in the main recommendations
            if max_price and int(p["price"]) > max_price:
                continue
                
            if irrelevant and score < 30:
                continue

            p_copy = p.copy()
            p_copy["matchPercentage"] = match_pct
            scored_products.append((score, p_copy))

        # Sort by: 1. Highest score, 2. Price (optional tie-breaker / popularity)
        scored_products.sort(key=lambda x: (x[0], x[1].get("popularity", 0)), reverse=True)
        
        # Extract top products
        final_results = [p for score, p in scored_products][:12]
        # If absolutely no results, fallback to general popular under budget (or just popular if no budget)
        if not final_results:
            if max_price:
                fallback = [p for p in self.products if int(p["price"]) <= max_price]
            else:
                fallback = self.products[:]
                
            fallback.sort(key=lambda x: x.get("popularity", 0), reverse=True)
            for p in fallback[:12]:
                p_copy = p.copy()
                # Only add a match percentage if we actually scored it against some criteria
                if max_price:
                    p_copy["matchPercentage"] = 50 # Budget match at least
                final_results.append(p_copy)

        already_shown = [p["id"] for p in final_results]
        stretch = self.recommend_stretch(recipient, occasion, interest, max_price, already_shown_ids=already_shown)

        return final_results, stretch

engine = Recommender()