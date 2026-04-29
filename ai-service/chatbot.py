import requests
import json
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

class GiftoraChat:
    def __init__(self):
        # Configuration
        self.google_key = os.getenv("GOOGLE_API_KEY")
        self.openrouter_key = os.getenv("OPENROUTER_API_KEY")
        self.model_name = "gemini-2.0-flash"
        
        # Configure Gemini
        if self.google_key:
            try:
                self.gemini_client = genai.Client(api_key=self.google_key)
                print(f"DEBUG: Gemini initialized with {self.model_name}")
            except Exception as e:
                print(f"DEBUG: Gemini init failed: {e}")
                self.gemini_client = None
        else:
            self.gemini_client = None

        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.openrouter_model = "mistralai/mistral-7b-instruct:free"
        
        self.system_prompt = (
            "You are Giftora, the AI Gift Finder for the Giftora platform. Be extremely conversational, warm, and helpful. "
            "Your goal is to find the perfect gift by asking about: Recipient, Occasion, Budget, and Interests. "
            "Rules:\n"
            "1. If you have enough info to suggest gifts, end your message with 'SEARCH_QUERY: [budget] [interests]'.\n"
            "2. Keep responses concise and engaging.\n"
            "3. Use temperature for variety.\n"
            "4. Start by introducing yourself as Giftora."
        )
        self.history = []
        self.step_counter = 0
        self.user_data = {}

        # Fallback sequence for when API fails
        self.steps = [
            {"key": "recipient", "q": "A gift for {0}! How exciting. Who are they to you? (e.g. Mom, Friend)", "s": ["Mom", "Partner", "Friend", "Boss"]},
            {"key": "occasion", "q": "I love that! And what is the special occasion for {0}?", "s": ["Birthday", "Wedding", "Anniversary", "Just Because"]},
            {"key": "budget", "q": "Got it. What kind of budget are we looking at for this {0}?", "s": ["Under 500", "Under 1000", "Under 5000", "No limit"]},
            {"key": "interests", "q": "Perfect. Lastly, what are some of their hobbies or interests?", "s": ["Tech", "Gaming", "Fashion", "Home Decor"]}
        ]

    def get_response(self, user_message):
        # Handle resets
        if any(word in user_message.lower() for word in ["reset", "start over", "clear"]):
            self.history = []
            self.step_counter = 0
            self.user_data = {}
            return "No problem! Let's start fresh. Who are we shopping for today?", ["Mom", "Partner", "Friend"]

        self.history.append({"role": "user", "content": user_message})

        # --- OPTION 1: Gemini (Primary) ---
        if self.gemini_client:
            try:
                context = "\n".join([f"{m['role']}: {m['content']}" for m in self.history[-6:]])
                prompt = f"{self.system_prompt}\n\nRecent Conversation:\n{context}\n\nGiftora:"

                response = self.gemini_client.models.generate_content(
                    model=self.model_name,
                    contents=prompt
                )
                if response.text:
                    bot_text = response.text.strip()
                    print(f"DEBUG: Gemini Response: {bot_text}")
                    self.history.append({"role": "assistant", "content": bot_text})
                    return bot_text, self._get_dynamic_suggestions(bot_text)
            except Exception as e:
                print(f"DEBUG: Gemini Error: {e}")

        # --- OPTION 2: OpenRouter (Secondary) ---
        if self.openrouter_key and "placeholder" not in self.openrouter_key:
            try:
                headers = {
                    "Authorization": f"Bearer {self.openrouter_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": self.openrouter_model,
                    "messages": [
                        {"role": "system", "content": self.system_prompt},
                        *self.history[-8:]
                    ],
                    "temperature": 0.8
                }
                response = requests.post(self.api_url, headers=headers, json=payload, timeout=8)
                if response.status_code == 200:
                    data = response.json()
                    bot_text = data['choices'][0]['message']['content'].strip()
                    print(f"DEBUG: OpenRouter Response: {bot_text}")
                    self.history.append({"role": "assistant", "content": bot_text})
                    return bot_text, self._get_dynamic_suggestions(bot_text)
            except Exception as e:
                print(f"DEBUG: OpenRouter Error: {e}")

        # --- OPTION 3: Fallback Logic ---
        return self._get_fallback_response(user_message)

    def _get_dynamic_suggestions(self, text):
        text = text.lower()
        if any(k in text for k in ["budget", "price", "how much"]):
            return ["Under 500", "Under 1000", "Under 5000", "No limit"]
        if any(k in text for k in ["occasion", "event", "celebrating"]):
            return ["Birthday", "Wedding", "Anniversary", "Just Because"]
        if any(k in text for k in ["who", "shopping for"]):
            return ["Mom", "Partner", "Friend", "Sister"]
        if any(k in text for k in ["interest", "hobby", "like"]):
            return ["Tech", "Gaming", "Fashion", "Home Decor", "Art"]
        return ["Surprise me", "Gift ideas", "Chat more"]

    def _get_fallback_response(self, user_message):
        # Smart Fallback sequence
        if self.step_counter < len(self.steps):
            key = self.steps[self.step_counter]["key"]
            self.user_data[key] = user_message
            self.step_counter += 1

        if self.step_counter < len(self.steps):
            step = self.steps[self.step_counter]
            echo_text = user_message.split()[-1] if user_message else "that"
            question = step["q"].format(echo_text)
            self.history.append({"role": "assistant", "content": question})
            return question, step["s"]
        
        # Final Search Trigger
        interests = self.user_data.get("interests", user_message)
        budget = self.user_data.get("budget", "moderate")
        self.step_counter = 0 # reset
        final_msg = f"I've got it! Searching for the best matches for you. SEARCH_QUERY: {budget} {interests}"
        return final_msg, None

class GiftoraSellerChat:
    def __init__(self):
        self.google_key = os.getenv("GOOGLE_API_KEY")
        self.openrouter_key = os.getenv("OPENROUTER_API_KEY")
        self.model_name = "gemini-2.0-flash"
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.openrouter_model = "mistralai/mistral-7b-instruct:free"
        
        if self.google_key:
            try:
                self.gemini_client = genai.Client(api_key=self.google_key)
            except Exception:
                self.gemini_client = None
        else:
            self.gemini_client = None

        self.system_prompt = (
            "You are an AI assistant for gift shop sellers on the Giftora platform in India. "
            "Provide helpful, actionable advice. Consider: "
            "- Upcoming Indian festivals and occasions (Rakhi, Diwali, Christmas, Valentine's Day, etc.)\n"
            "- Current gift trends in India\n"
            "- Price points in INR (₹)\n"
            "- Local market dynamics\n"
            "- Seasonal demand patterns\n"
            "Format your response with:\n"
            "- Clear, concise bullet points\n"
            "- Specific product suggestions with price ranges\n"
            "- Actionable next steps\n"
            "- Keep response under 200 words. Be specific and practical."
        )
        self.history = []

    def get_response(self, user_message, context="New seller on Giftora platform"):
        self.history.append({"role": "user", "content": user_message})
        
        prompt = f"{self.system_prompt}\n\nSeller Context: {context}\n\nSeller: {user_message}\nAssistant:"
        
        if self.gemini_client:
            try:
                response = self.gemini_client.models.generate_content(
                    model=self.model_name,
                    contents=prompt
                )
                if response.text:
                    bot_text = response.text.strip()
                    self.history.append({"role": "assistant", "content": bot_text})
                    return bot_text
            except Exception as e:
                print(f"DEBUG: Seller Gemini Error: {e}")

        if self.openrouter_key and "placeholder" not in self.openrouter_key:
            try:
                headers = {
                    "Authorization": f"Bearer {self.openrouter_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": self.openrouter_model,
                    "messages": [
                        {"role": "system", "content": self.system_prompt},
                        *self.history[-4:]
                    ],
                    "temperature": 0.8
                }
                response = requests.post(self.api_url, headers=headers, json=payload, timeout=8)
                if response.status_code == 200:
                    data = response.json()
                    bot_text = data['choices'][0]['message']['content'].strip()
                    self.history.append({"role": "assistant", "content": bot_text})
                    return bot_text
            except Exception as e:
                print(f"DEBUG: Seller OpenRouter Error: {e}")
                
        # Basic Fallback
        if "sell" in user_message.lower():
            fallback = "Trending this week:\n• Personalized Mugs (₹300 - ₹500)\n• Artificial Plants (₹400 - ₹800)\nI recommend updating your inventory for the upcoming season!"
        elif "price" in user_message.lower():
            fallback = "For typical gifts, aim for a 30-40% margin. Start with competitive pricing to build your shop's reputation."
        elif "festival" in user_message.lower() or "season" in user_message.lower():
            fallback = "Upcoming major festivals include Diwali, Navratri, and Rakhi. Start preparing your inventory 1-2 months in advance!"
        else:
            fallback = "That's a great question! For a new seller, focusing on top-quality listings and competitive pricing is key. How else can I help?"
            
        self.history.append({"role": "assistant", "content": fallback})
        return fallback

# Create instances
giftora = GiftoraChat()
seller_chat = GiftoraSellerChat()
