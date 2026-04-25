import requests
import json

class AuraChat:
    def __init__(self):
        self.api_url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
        self.headers = {"Authorization": "Bearer hf_placeholder_key"} 
        
        self.system_prompt = (
            "You are Aura, the AI Gift Finder. Be extremely conversational and warm. "
            "Task: Find out Recipient, Occasion, Budget, and Interests. "
            "When ready, say: 'SEARCH_QUERY: [budget] [interests]'."
        )
        self.history = []
        self.step_counter = 0
        self.user_data = {}

        # High-Quality Fallback Steps with Matching Suggestions
        self.steps = [
            {
                "key": "recipient",
                "q": "A gift for {0}! How exciting. Who are they to you? (e.g. Mom, Friend)",
                "s": ["Mom", "Partner", "Friend", "Boss"]
            },
            {
                "key": "occasion",
                "q": "I love that! And what is the special occasion for {0}?",
                "s": ["Birthday", "Wedding", "Anniversary", "Just Because"]
            },
            {
                "key": "budget",
                "q": "Got it. What kind of budget are we looking at for this {0}?",
                "s": ["Under 500", "Under 1000", "Under 5000", "No limit"]
            },
            {
                "key": "interests",
                "q": "Perfect. Lastly, what are some of their hobbies or interests?",
                "s": ["Tech", "Gaming", "Fashion", "Home Decor"]
            }
        ]

    def get_response(self, user_message):
        if "reset" in user_message.lower() or "start over" in user_message.lower():
            self.history = []
            self.step_counter = 0
            self.user_data = {}
            return "No problem! I'm ready to find that perfect gift. Who are we shopping for?", ["Mom", "Partner", "Friend"]

        # NEW: Advanced Intent Detection (UX Improvement)
        user_lower = user_message.lower()
        has_budget = any(k in user_lower for k in ["under", "below", "budget", "max", "price"])
        has_product = any(k in user_lower for k in ["cake", "flower", "ring", "tech", "gaming", "plant", "watch", "gift", "something"])
        is_first_message = len(self.history) <= 1 # history starts empty, so first msg makes it len 1
        
        if is_first_message and (has_budget or has_product):
            # If user provides a complex request immediately, jump to results
            self.step_counter = 0 
            final_msg = f"Got it! I'm searching for the perfect matches based on your request. SEARCH_QUERY: {user_message}"
            return final_msg, None

        self.history.append({"role": "user", "content": user_message})

        # Try AI API
        try:
            prompt = f"<s>[INST] {self.system_prompt}\n"
            for msg in self.history[-6:]:
                prompt += f"{msg['role']}: {msg['content']}\n"
            prompt += "assistant: [/INST]"

            response = requests.post(self.api_url, headers=self.headers, json={"inputs": prompt}, timeout=5)
            if response.status_code == 200:
                bot_text = response.json()[0]['generated_text'].split("[/INST]")[-1].strip()
                self.history.append({"role": "assistant", "content": bot_text})
                
                # Dynamic Suggestions based on keywords in AI response
                suggestions = ["Tech", "Gaming", "Home", "Fashion"]
                if any(k in bot_text.lower() for k in ["budget", "price", "how much"]):
                    suggestions = ["Under 500", "Under 1000", "Under 5000"]
                elif any(k in bot_text.lower() for k in ["occasion", "event", "why"]):
                    suggestions = ["Birthday", "Anniversary", "Wedding"]
                elif any(k in bot_text.lower() for k in ["who", "shopping for"]):
                    suggestions = ["Mom", "Partner", "Friend"]
                
                return bot_text, suggestions
        except:
            pass

        # Smart Fallback (Guaranteed to be correct)
        # 1. Update user data for the step we just answered
        if self.step_counter < len(self.steps):
            key = self.steps[self.step_counter]["key"]
            self.user_data[key] = user_message
            self.step_counter += 1

        # 2. Get next question
        if self.step_counter < len(self.steps):
            step = self.steps[self.step_counter]
            # Clean up the previous answer for a more natural echo
            echo_text = user_message
            if len(echo_text) > 20: # If too long, just use the last word or a generic term
                echo_text = echo_text.split()[-1] if len(echo_text.split()) > 0 else "that"
            
            question = step["q"].format(echo_text)
            self.history.append({"role": "assistant", "content": question})
            return question, step["s"]
        
        # 3. Final Search
        interests = self.user_data.get("interests", user_message)
        budget = self.user_data.get("budget", "")
        self.step_counter = 0 # reset
        final_msg = f"Excellent! I've found some perfect matches for you. SEARCH_QUERY: {budget} {interests}"
        return final_msg, None

# Create a singleton instance
aura = AuraChat()
