const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");
const { Groq } = require("groq-sdk");
const ragService = require("../services/ragService");

router.use(express.json());

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const REDIRECT_URL = process.env.REDIRECT_URL;



router.get("/", async (req, res) => {
  res.send("<h1>Mentex Running</h1>");
});


router.post("/auth/create", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${REDIRECT_URL}/auth/callback`,
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({ message: "User created successfully" });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ message: "Logged in successfully", data });
});

// router.post('/chat/completion', async (req, res) => {
//   try {
//     const { userMessage, model = 'llama-3.3-70b-versatile', temperature = 0.5, maxTokens = 1024 } = req.body;

//     if (!userMessage) {
//       return res.status(400).json({ error: 'User message is required.' });
//     }

//     const completion = await groq.chat.completions.create({
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a helpful assistant.',
//         },
//         {
//           role: 'user',
//           content: userMessage,
//         },
//       ],
//       model,
//       temperature,
//       max_completion_tokens: maxTokens,
//     });

//     return res.json({ message: completion.choices[0]?.message?.content || 'No content returned.' });
//   } catch (error) {
//     console.error('Error during chat completion:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.post('/chat/stream', async (req, res) => {
//   try {
//     const { userMessage, model = 'llama-3.3-70b-versatile', temperature = 0.5, maxTokens = 800, stop } = req.body;

//     if (!userMessage) {
//       return res.status(400).json({ error: 'User message is required.' });
//     }

//     const stream = await groq.chat.completions.create({
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a helpful assistant.',
//         },
//         {
//           role: 'user',
//           content: userMessage,
//         },
//       ],
//       model,
//       temperature,
//       max_completion_tokens: maxTokens,
//       stop: stop || null,
//       stream: true,
//     });

//
//     res.setHeader('Content-Type', 'text/plain');
//     res.flushHeaders();

//     for await (const chunk of stream) {
//       const content = chunk.choices[0]?.delta?.content || '';
//       if (content) {
//         res.write(content);
//       }
//     }

//     res.end();
//   } catch (error) {
//     console.error('Error during chat stream:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.post("/api/send", async function (req, res) {
  const docUrl = req.body.uploadurl;
  const docId = req.body.docId;

  if (!docUrl || !docId) {
    return res.status(401).json({ message: "url or id missing" });
  } else {
    try {
      await ragService.processDocument(docUrl, docId);
      res.status(200).json({ message: "PDF uploaded to vector" });
    } catch (err) {
      res.status(500).json({ error: "PDF processing failed", err });
    }
  }

  // res.status(200).json({ "success": "true" });
  // console.log(fileUrl)
});

router.delete("/api/delete/:docid", async function (req, res) {
  const { docid } = req.params;
  await ragService.deleteDocument(docid);
  res
    .status(200)
    .json({ id: `${docid}`, message: "Document deleted successfully" });
});

// router.delete("/api/deletebucket", async (req, res) => {
//   const { path } = req.query.path;

//   const { data, error } = await supabase
//     .storage
//     .from("uploads")
//     .remove([path]);

//   if (error) {
//     return res.status(500).json({ success: false, error });
//   }
//   res.json({ success: true, deleted: data });
// });

module.exports = router;
