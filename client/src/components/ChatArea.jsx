"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useEffect, useState } from "react";
import { Response } from "@/components/ai-elements/response";
import { Cpu } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/source";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { server_url } from "@/lib/API";

const models = [
  {
    name: "GPT 5",
    value: "openai/gpt-4o",
  },
  {
    name: "Claude Opus 4.1",
    value: "deepseek/deepseek-r1",
  },
];

// const suggestions = [
//   'Can you explain how to play tennis?',
// ];

const ChatArea = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [currDoc, setCurrDoc] = useState("");

  useEffect(() => {
    let currentDoc = localStorage.getItem("currentDoc");
    setCurrDoc(currentDoc);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      message: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setStatus("loading");
    setInput("");

    try {
      const res = await fetch(`${server_url}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input, docId: currDoc }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let currentMessageId = Date.now();

      setMessages((prev) => [
        ...prev,
        { id: currentMessageId, role: "assistant", message: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === currentMessageId
              ? { ...msg, message: assistantMessage }
              : msg
          )
        );
      }
    } catch (err) {
      console.error("Chat stream error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: " Error streaming response.",
        },
      ]);
    }

    setStatus("idle");
  };

  return (
    <div className="flex flex-col h-full w-[529px] border-l">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message, idx) => (
              <Message from={message.role} key={message.id || idx}>
                <MessageContent>
                  <Response>{message.message}</Response>
                </MessageContent>
              </Message>
            ))}
            {status === "loading" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        {/* <Suggestions>
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                
                suggestion={suggestion}
              />
            ))}
          </Suggestions> */}

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton
                variant={webSearch ? "default" : "ghost"}
                onClick={() => setWebSearch(!webSearch)}
              >
                <Cpu size={16} />
                <span>Priority Mode</span>
              </PromptInputButton>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem
                      key={model.value}
                      value={model.value}
                    >
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default ChatArea;
