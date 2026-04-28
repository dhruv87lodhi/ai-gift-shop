import { NextResponse } from "next/server";

const FREE_MODELS = [
  "google/gemini-2.0-flash-001",
  "google/gemini-2.0-pro-exp-02-05:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat:free",
];

const SYSTEM_MESSAGE = `You are a gift note writer for a premium gift shop called AuraGifts.
Write short, warm, personalized gift notes that are SPECIFIC to the occasion provided.
Output ONLY the note text. No preamble, labels, or quotes around the message.
Do NOT mention card design, colors, themes, or AI.
3–5 lines maximum.`;

export async function POST(req) {
  try {
    const { recipient, occasion, tone, previousNote, variationSeed = 0 } = await req.json();

    if (!recipient || !occasion) {
      return NextResponse.json({ success: false, error: "Missing recipient or occasion" });
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
    const googleKey = process.env.GOOGLE_API_KEY?.trim();

    if (!openRouterKey && !googleKey) {
      console.warn("[AI] No API keys configured. Using static fallback.");
      return NextResponse.json({
        text: getStaticFallback(recipient, occasion, tone, variationSeed),
        success: true,
        isFallback: true,
      });
    }

    const toneMap = {
      heartfelt: "warm, sincere, and emotional",
      funny: "light-hearted, witty, and playful",
      professional: "respectful, polished, and formal",
    };

    const openings = [
      `Begin with "Happy ${occasion}" or "Congratulations on your ${occasion}".`,
      `Begin with "${recipient}," (just their name then a comma).`,
      `Begin with "Today marks" or "On this special day".`,
      `Begin with "I wanted to" or "I just wanted to".`,
      `Begin with "Words can't fully" or "There are no words".`,
      `Begin with "To the most" or "To someone who".`,
      `Begin with "This ${occasion}" or "Your ${occasion}".`,
    ];
    const opening = openings[variationSeed % openings.length];
    const nonce = Date.now();

    // Occasion-specific context hints for the AI
    const occasionHints = {
      graduation: "mention achievement, hard work, the future, new beginnings, or pride in their accomplishment",
      birthday: "mention getting older gracefully, celebrating another year, joy, and wishes for the year ahead",
      wedding: "mention love, partnership, a shared journey, and wishes for a lifetime of happiness",
      anniversary: "mention years together, enduring love, shared memories, and looking forward to more",
      "baby shower": "mention the arrival of new life, the joy of parenthood, and excitement for the journey ahead",
      christmas: "mention the holiday spirit, warmth, family, giving, and the magic of the season",
      "mother's day": "mention gratitude for a mother's love, sacrifice, warmth, and all she means",
      "father's day": "mention a father's strength, guidance, love, and the impact he has made",
      valentine: "mention love, romance, connection, and how special the person makes you feel",
      retirement: "mention years of dedication, a well-earned rest, and exciting new adventures ahead",
      promotion: "mention hard work paying off, professional growth, pride in their success, and future achievements",
      housewarming: "mention the joy of a new home, creating memories, and making a house a home",
      farewell: "mention fond memories, the impact they had, missing them, and wishing them well on their journey",
    };

    const occasionKey = occasion.toLowerCase();
    const hint = occasionHints[occasionKey] ||
      `make the note directly about the ${occasion} — reference what this occasion means and why it matters`;

    let userPrompt = `[ref-${nonce}] Write a gift note for ${recipient} on the occasion of their ${occasion}.

Tone: ${toneMap[tone] || tone}
Opening rule: ${opening}
Occasion focus: ${hint}

Rules:
- The note MUST be about the ${occasion} specifically — not just generic love or warmth.
- 3–5 lines. Natural, human language.
- Output ONLY the note. No labels, quotes, or preamble.`;

    if (previousNote && previousNote.trim().length > 10) {
      userPrompt += `\n\nAvoid reusing sentences or structure from this previous note:\n${previousNote.slice(0, 200)}`;
    }

    // ─── OpenRouter ───────────────────────────────────────────────────────────
    if (openRouterKey) {
      for (const model of FREE_MODELS) {
        try {
          console.log(`[OpenRouter] ${model} | seed:${variationSeed}`);
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "AuraGifts",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: SYSTEM_MESSAGE },
                { role: "user", content: userPrompt },
              ],
              temperature: 1.0,
              top_p: 0.9,
              frequency_penalty: 1.0,
              presence_penalty: 0.8,
              max_tokens: 180,
            }),
            signal: AbortSignal.timeout(18000),
          });

          const data = await response.json();
          const content = data.choices?.[0]?.message?.content?.trim();

          if (!response.ok) {
            console.warn(`[OpenRouter][${model}] Error:`, data.error?.message);
            continue;
          }
          if (!content || content.length < 20) {
            console.warn(`[OpenRouter][${model}] Empty response.`);
            continue;
          }

          const cleaned = content.replace(/^[\"']|[\"']$/g, "").trim();
          console.log(`[OpenRouter][${model}] OK: "${cleaned.slice(0, 60)}..."`);
          return NextResponse.json({ text: cleaned, success: true, model });
        } catch (err) {
          console.error(`[OpenRouter][${model}] Exception:`, err.message);
        }
      }
      console.warn("[OpenRouter] All models exhausted. Trying Gemini.");
    }

    // ─── Gemini fallback ──────────────────────────────────────────────────────
    if (googleKey) {
      try {
        console.log("[Gemini] Trying gemini-1.5-flash-latest...");
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(googleKey);
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await geminiModel.generateContent(`${SYSTEM_MESSAGE}\n\n${userPrompt}`);
        const text = result.response.text()?.trim();
        if (text && text.length > 20) {
          console.log("[Gemini] OK.");
          return NextResponse.json({ text, success: true, model: "gemini-1.5-flash-latest" });
        }
      } catch (err) {
        console.error("[Gemini] Error:", err.message);
      }
    }

    // ─── Static occasion-specific fallback ───────────────────────────────────
    console.warn("[AI] All providers failed. Using static fallback.");
    return NextResponse.json({
      text: getStaticFallback(recipient, occasion, tone, variationSeed),
      success: true,
      isFallback: true,
    });

  } catch (error) {
    console.error("[AI] Unhandled error:", error.message);
    return NextResponse.json({ success: false, error: error.message });
  }
}

/**
 * Occasion-specific fallback notes.
 * Keyed by normalised occasion name → tone → array of variants.
 * Falls back to a generic set if the occasion isn't found.
 */
function getStaticFallback(recipient, occasion, tone, seed = 0) {
  const occ = occasion.toLowerCase();

  const occasionNotes = {
    graduation: {
      heartfelt: [
        `Dear ${recipient}, all those early mornings, late nights, and endless hard work have led to this incredible moment. You've earned every bit of this achievement and I couldn't be more proud. Congratulations on your graduation — the world is ready for you.`,
        `${recipient}, watching you cross this finish line fills my heart with so much pride. Your graduation is a testament to your dedication, resilience, and brilliance. Here's to the amazing future you are about to build.`,
        `To ${recipient} — a graduate! Your journey to this milestone has been nothing short of inspiring. All that effort, sacrifice, and determination has paid off beautifully. Congratulations, and may every dream you chase from here come true.`,
      ],
      funny: [
        `Congratulations ${recipient}! You survived exams, assignments, and questionable cafeteria food to finally get that degree. I always knew you'd make it — mostly because giving up would have been too much paperwork. 🎓`,
        `${recipient}, you did it! All those years of studying and you still managed to stay sane. That alone deserves an honorary degree. Now go forth, conquer the world, and maybe finally get some sleep. 🎉`,
        `Happy Graduation ${recipient}! You went in as a student and came out as someone their parents can finally brag about. The hard part is over — until the student loans kick in. Proud of you! 😄`,
      ],
      professional: [
        `Dear ${recipient}, please accept my sincerest congratulations on your graduation. This achievement reflects your commitment, discipline, and intellectual perseverance. I wish you great success in the exciting chapter that lies ahead.`,
        `To ${recipient}, on the occasion of your graduation — a well-deserved milestone reached through dedication and hard work. May this achievement open doors to a fulfilling and prosperous career. Warmest congratulations.`,
        `Dear ${recipient}, your graduation is a significant accomplishment and a proud moment for all who know you. I hope this success is the foundation for a distinguished and rewarding professional journey. With warm regards.`,
      ],
    },
    birthday: {
      heartfelt: [
        `Happy Birthday ${recipient}! Another year older, another year of memories made, lessons learned, and love shared. I hope this birthday brings you as much joy as you bring to everyone around you. Wishing you a beautiful year ahead.`,
        `To ${recipient} on your birthday — may this day be a small reflection of how wonderful you truly are. Every year you grow more into the amazing person you were always meant to be. Celebrating you today and always.`,
        `Dear ${recipient}, birthdays are nature's way of telling us to eat more cake and celebrate people we love. Today we celebrate you — your laughter, your kindness, and everything that makes you, you. Happy Birthday!`,
      ],
      funny: [
        `Happy Birthday ${recipient}! You don't look a day over... well, let's just say you're aging like fine wine — getting better and a little more expensive. Enjoy your special day! 🥂`,
        `${recipient}, another year older! But hey, at least you're not as old as you'll be next year. Chin up, grab some cake, and let's pretend the candles are just decorative. 🎂`,
        `Happy Birthday ${recipient}! The older you get, the wiser you become. Or at least that's what I'll keep telling myself too. Here's to another year of pretending we have it all figured out! 🎉`,
      ],
      professional: [
        `Dear ${recipient}, wishing you a very happy birthday. May this year bring you continued success, good health, and new opportunities. It's a pleasure to know you and I hope your day is as remarkable as you are.`,
        `To ${recipient}, on your birthday — may this milestone be the start of your best year yet. Wishing you joy, prosperity, and every happiness in the year ahead. Warmest wishes.`,
        `Dear ${recipient}, please accept my warmest birthday wishes. May the coming year bring you fulfillment both personally and professionally. With kind regards.`,
      ],
    },
    wedding: {
      heartfelt: [
        `Dear ${recipient}, today you begin the most beautiful chapter of your life. May your marriage be filled with love that deepens with every passing year, laughter that carries you through every challenge, and a partnership that is your greatest adventure. Congratulations!`,
        `To ${recipient} on your wedding day — love like this is rare and beautiful. May you and your partner always choose each other, cherish each other, and find joy in the ordinary moments you share. Wishing you a lifetime of happiness together.`,
        `${recipient}, today is the start of forever. May your marriage be a safe harbour, a source of endless joy, and the greatest love story you'll ever live. Congratulations on your wedding.`,
      ],
      funny: [
        `Congratulations ${recipient}! You found someone willing to put up with you forever — that's either true love or very poor judgment. Either way, we're celebrating! 💍`,
        `Happy Wedding Day ${recipient}! Marriage is about finding that one special person you want to annoy for the rest of your life. Sounds like you've found yours. Cheers! 🥂`,
        `${recipient}, today you gain a partner, and apparently lose half your wardrobe space. Worth it! Wishing you both a lifetime of happiness and roomy closets. 😄`,
      ],
      professional: [
        `Dear ${recipient}, please accept my warmest congratulations on your wedding day. May this union bring you great happiness, mutual respect, and a life filled with love and shared purpose. With heartfelt best wishes.`,
        `To ${recipient} on this joyous occasion — congratulations on your marriage. May your partnership be a source of strength, joy, and enduring fulfilment. Warmest regards.`,
        `Dear ${recipient}, wishing you every happiness on your wedding day. May your marriage be long, loving, and filled with the very best life has to offer. With sincere congratulations.`,
      ],
    },
    anniversary: {
      heartfelt: [
        `Dear ${recipient}, every year together is a treasure and a testament to a love that only grows stronger. Happy Anniversary — here's to all the years behind you and all the beautiful ones still ahead.`,
        `To ${recipient} on your anniversary — the years may pass, but the love you share only deepens. May today remind you of every wonderful reason you chose each other, and every reason you'd do it all again. Congratulations.`,
        `${recipient}, anniversaries are proof that love isn't just a feeling — it's a daily choice, beautifully made. Happy Anniversary and here's to many more years of choosing each other.`,
      ],
      funny: [
        `Happy Anniversary ${recipient}! Another year of putting up with each other and still choosing to stay — that's either love or stubbornness. Either way, we respect it! 🥂`,
        `${recipient}, congratulations on another year of marriage! They say the secret to a long relationship is a short memory. Clearly it's working for you! Happy Anniversary! 😄`,
        `Happy Anniversary ${recipient}! You've made it another year. That deserves cake, a toast, and probably a small trophy. Keep up the great work! 🎉`,
      ],
      professional: [
        `Dear ${recipient}, congratulations on your anniversary. This milestone is a reflection of commitment, partnership, and enduring love. Wishing you continued joy and happiness together. With warm regards.`,
        `To ${recipient} on this special anniversary — may the years ahead be as rewarding as those behind you. With sincere congratulations and warmest wishes.`,
        `Dear ${recipient}, please accept my warmest congratulations on your anniversary. It is a wonderful occasion and I wish you both continued happiness and fulfilment. Kindly.`,
      ],
    },
    christmas: {
      heartfelt: [
        `Dear ${recipient}, may this Christmas fill your home with warmth, your heart with joy, and your life with the love of those who matter most. Wishing you a truly magical holiday season and a wonderful year to come.`,
        `To ${recipient} — at this special time of year, I'm reminded of how grateful I am to have you in my life. Wishing you a Christmas full of peace, laughter, and all the things that make you happiest. Happy Holidays!`,
        `${recipient}, Christmas is a time to celebrate love, family, and the gift of being together. I hope this season brings you everything your heart desires. Wishing you a warm and wonderful Christmas.`,
      ],
      funny: [
        `Merry Christmas ${recipient}! May your turkey be juicy, your gifts be exactly what you wanted, and your relatives only stay for the agreed amount of time. Happy Holidays! 🎄`,
        `Ho ho ho ${recipient}! Santa checked his list twice and you made the nice one — barely. Enjoy your gift and have a wonderfully festive Christmas! 🎅`,
        `Merry Christmas ${recipient}! May your eggnog be strong, your WiFi be stronger, and your holiday season be filled with more joy than awkward family conversations. 🎁`,
      ],
      professional: [
        `Dear ${recipient}, wishing you and your loved ones a wonderful Christmas and a prosperous New Year. May this festive season bring you rest, joy, and time to celebrate all you have achieved. With warm holiday wishes.`,
        `To ${recipient} — Season's Greetings and warmest wishes for a joyful Christmas. May the New Year bring you continued success and happiness. With kind regards.`,
        `Dear ${recipient}, please accept my best wishes for a happy Christmas and a bright New Year ahead. Thank you for everything and I hope the season is a wonderful one for you. Warmly.`,
      ],
    },
    retirement: {
      heartfelt: [
        `Dear ${recipient}, after years of dedication and hard work, the time has finally come to enjoy the life you've truly earned. Your retirement is not an ending — it's the beginning of the most exciting chapter yet. Wishing you all the rest and adventure you deserve.`,
        `To ${recipient} on your retirement — what a remarkable journey it has been. Your commitment and passion have left an impact that will long be remembered. Now go enjoy every moment of this well-deserved freedom. You've earned it!`,
        `${recipient}, retirement means the chance to wake up each morning and do exactly what makes you happy. After everything you've given, it's finally your turn. Wishing you a retirement filled with joy, health, and wonderful adventures.`,
      ],
      funny: [
        `Congratulations on your retirement ${recipient}! Now you can do all the things you kept saying you'd do when you had the time. No more excuses! The golf course / garden / couch awaits. 🎉`,
        `Happy Retirement ${recipient}! Welcome to the stage of life where every day is Saturday and nobody can tell you what to do. Must be nice! Enjoy every second. 😄`,
        `${recipient}, you've officially graduated from working for a living! Now the only deadlines you need to worry about are dinner reservations. Congratulations and enjoy it all! 🥂`,
      ],
      professional: [
        `Dear ${recipient}, on behalf of all who have had the pleasure of working alongside you, congratulations on your retirement. Your professionalism, dedication, and expertise have been an inspiration. Wishing you a fulfilling and well-deserved retirement.`,
        `To ${recipient} — your retirement marks the end of a distinguished career and the beginning of a richly deserved new chapter. Thank you for your service and contribution. With deep respect and warmest wishes.`,
        `Dear ${recipient}, please accept my sincere congratulations on your retirement. It has been a privilege. I wish you every happiness and good health in the years ahead. With kind regards.`,
      ],
    },
    promotion: {
      heartfelt: [
        `Dear ${recipient}, this promotion is the result of your talent, effort, and perseverance — every bit of it earned. I'm so incredibly proud of you and excited to see where this next chapter takes you. You deserve every bit of this success.`,
        `${recipient}, congratulations on your promotion! Watching you grow and reach this milestone has been inspiring. Your hard work and dedication have truly paid off. Here's to the amazing things you'll achieve from here.`,
        `To ${recipient} — this promotion is just the latest proof of what those of us who know you have always believed: you are exceptional. Congratulations and here's to an incredible future ahead.`,
      ],
      funny: [
        `Congratulations on the promotion ${recipient}! More responsibility, more stress, slightly better coffee in the meetings — welcome to the next level! You absolutely earned it. 🎉`,
        `${recipient}, you got promoted! Now you get to stress about completely different things. Moving on up! Seriously though, so proud of you. You deserve this. 😄`,
        `Happy Promotion ${recipient}! They finally figured out what the rest of us already knew — you're too good for your old job. Congratulations on officially being a big deal! 🥂`,
      ],
      professional: [
        `Dear ${recipient}, congratulations on your well-deserved promotion. This achievement is a reflection of your exceptional work ethic, skill, and commitment. I look forward to seeing the excellent contributions you will make in your new role.`,
        `To ${recipient} — on the occasion of your promotion, please accept my sincerest congratulations. Your dedication and professionalism have been exemplary and this recognition is richly deserved. Best wishes in your new position.`,
        `Dear ${recipient}, congratulations on your promotion. It is a testament to your hard work and talent. I have every confidence you will excel in this new role. With warmest regards.`,
      ],
    },
  };

  // Normalize the occasion key for matching
  const key = Object.keys(occasionNotes).find((k) => occ.includes(k));

  if (key) {
    const toneNotes = occasionNotes[key][tone] || occasionNotes[key].heartfelt;
    return toneNotes[seed % toneNotes.length];
  }

  // Generic fallback for unlisted occasions
  const generic = {
    heartfelt: [
      `Dear ${recipient}, on this wonderful ${occasion}, I want you to know how much you mean to me. May this special day be everything you hoped for and more. With all my love and warmest wishes.`,
      `To ${recipient} — celebrating your ${occasion} fills my heart with joy. You deserve every happiness today and always. Wishing you a day as beautiful as the person you are.`,
      `${recipient}, this ${occasion} is a moment worth celebrating and I'm so glad to share it with you. Here's to you and everything wonderful that lies ahead. With love always.`,
    ],
    funny: [
      `Happy ${occasion} ${recipient}! I thought long and hard about what to say, and settled on this: you're great, this is a big deal, and I got you a gift. You're welcome. 🎉`,
      `${recipient}! Happy ${occasion}! Whatever this celebration calls for — cake, champagne, or a well-deserved nap — I hope you get all of it. Cheers to you! 😄`,
    ],
    professional: [
      `Dear ${recipient}, please accept my warmest wishes on the occasion of your ${occasion}. It is a pleasure to acknowledge this milestone and I hope the day brings you great joy and satisfaction. With kind regards.`,
      `To ${recipient} — on this ${occasion}, I extend my sincerest congratulations and best wishes. May this be a memorable and fulfilling occasion. Warmly.`,
    ],
  };

  const toneNotes = generic[tone] || generic.heartfelt;
  return toneNotes[seed % toneNotes.length];
}
