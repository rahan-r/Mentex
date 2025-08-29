const express = require("express");
const { systemPrompt } = require("../utils/prompt");
const ragService = require("../services/ragService");
const { Groq } = require("groq-sdk");

const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

const router = express.Router();

router.use(express.json());

router.post("/chat/stream", async (req, res) => {
  try {
    const { question, docId } = req.body;

    if (!question || !docId) {
      return res.status(400).json({ error: "Question and docId are required" });
    }

    const context = await ragService.getContext(question, docId, 4);
    const sysPrompt = systemPrompt;
    const userPrompt = `Context:\n${context}\n\nQuestion: ${question}`;

    const stream = await groqClient.chat.completions.create({
      messages: [
        { role: "system", content: sysPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_completion_tokens: 800,
      stream: true,
    });

    res.setHeader("Content-Type", "text/plain");
    res.flushHeaders();

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) res.write(content);
    }

    res.end();
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({
      error: "Failed to process query",
      details: error.message,
    });
  }
});

module.exports = router;
