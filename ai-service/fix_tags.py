import json
import os

def fix_product_tags():
    file_path = os.path.join(os.path.dirname(__file__), 'products.json')
    
    with open(file_path, 'r', encoding='utf-8') as f:
        products = json.load(f)

    # Define some keyword mappings for inference
    RECIPIENT_MAP = {
        "jewelry": ["wife", "girlfriend", "partner", "mother"],
        "fashion": ["wife", "girlfriend", "sister", "friend"],
        "tech": ["brother", "son", "friend", "husband"],
        "gaming": ["brother", "son", "friend"],
        "flowers": ["wife", "girlfriend", "mother", "sister", "friend"],
        "cakes": ["kids", "family", "friends", "partner"],
        "personalized": ["parents", "mom", "dad", "couple", "friend"],
        "plants": ["parents", "mom", "dad", "friend", "colleague"],
        "home decor": ["parents", "mom", "family", "housewarming"],
        "decor": ["family", "friends", "kids"],
        "kids": ["kids", "son", "daughter", "nephew", "niece"],
        "office": ["boss", "colleague", "professional", "friend"],
        "fitness": ["friend", "partner", "brother", "sister"],
        "books": ["friend", "student", "teacher", "parents"],
        "experience": ["couple", "partner", "friend"],
        "luxury": ["wife", "husband", "partner", "boss"]
    }

    OCCASION_MAP = {
        "flowers": ["birthday", "anniversary", "valentines", "mothers day", "get well soon"],
        "cakes": ["birthday", "anniversary", "celebration", "party"],
        "jewelry": ["anniversary", "valentines", "wedding", "birthday"],
        "personalized": ["anniversary", "wedding", "birthday", "graduation"],
        "tech": ["birthday", "graduation", "new job"],
        "gaming": ["birthday", "graduation"],
        "home decor": ["housewarming", "anniversary", "wedding"],
        "decor": ["birthday", "party", "celebration", "festival"],
        "plants": ["housewarming", "birthday", "mothers day"],
        "office": ["promotion", "new job", "retirement"],
        "fashion": ["birthday", "anniversary", "festival"],
        "kids": ["birthday", "childrens day", "achievement"],
        "experience": ["anniversary", "birthday", "valentines"],
        "luxury": ["anniversary", "wedding", "birthday"]
    }

    KEYWORD_RECIPIENT = {
        "mother": ["mother", "mom"],
        "father": ["father", "dad"],
        "mom": ["mother", "mom"],
        "dad": ["father", "dad"],
        "wife": ["wife", "partner"],
        "husband": ["husband", "partner"],
        "brother": ["brother"],
        "sister": ["sister"],
        "friend": ["friend"],
        "kid": ["kids"],
        "baby": ["kids", "new parents"],
        "son": ["son", "kids"],
        "daughter": ["daughter", "kids"],
        "boss": ["boss"],
        "teacher": ["teacher"]
    }

    KEYWORD_OCCASION = {
        "birthday": ["birthday"],
        "anniversary": ["anniversary"],
        "wedding": ["wedding", "marriage"],
        "valentines": ["valentines", "romance"],
        "graduation": ["graduation"],
        "diwali": ["festival", "diwali"],
        "christmas": ["festival", "christmas"],
        "housewarming": ["housewarming", "new home"],
        "rakhi": ["rakhi", "brother", "sister"],
        "mother": ["mothers day"],
        "father": ["fathers day"]
    }

    updated_count = 0

    for p in products:
        tags = p.get("tags", {})
        if not isinstance(tags, dict):
            # If tags is a list, skip or convert (but your products.json shows dict)
            continue
            
        category = p.get("category", "").lower()
        name = p.get("name", "").lower()
        interest_tags = [t.lower() for t in tags.get("interest", [])]
        
        # 1. Fill Recipient if empty
        if not tags.get("recipient"):
            new_recipients = set()
            # Try category match
            if category in RECIPIENT_MAP:
                new_recipients.update(RECIPIENT_MAP[category])
            
            # Try keyword match in name/interests
            for kw, res in KEYWORD_RECIPIENT.items():
                if kw in name or any(kw in it for it in interest_tags):
                    new_recipients.update(res)
            
            if new_recipients:
                tags["recipient"] = list(new_recipients)
                updated_count += 1
            else:
                # Fallback for anything else
                tags["recipient"] = ["friend", "family", "someone special"]
                updated_count += 1

        # 2. Fill Occasion if empty
        if not tags.get("occasion"):
            new_occasions = set()
            # Try category match
            if category in OCCASION_MAP:
                new_occasions.update(OCCASION_MAP[category])
            
            # Try keyword match in name/interests
            for kw, res in KEYWORD_OCCASION.items():
                if kw in name or any(kw in it for it in interest_tags):
                    new_occasions.update(res)
            
            if new_occasions:
                tags["occasion"] = list(new_occasions)
                updated_count += 1
            else:
                # Fallback for anything else
                tags["occasion"] = ["birthday", "celebration", "just because"]
                updated_count += 1
        
        # Cleanup: Ensure all are lowercase and unique
        if "recipient" in tags:
            tags["recipient"] = list(set([r.lower() for r in tags["recipient"]]))
        if "occasion" in tags:
            tags["occasion"] = list(set([o.lower() for o in tags["occasion"]]))

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2)

    print(f"Updated tags for products. Total modifications triggered: {updated_count}")

if __name__ == "__main__":
    fix_product_tags()
