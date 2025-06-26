import { useEffect, useRef } from "react";
import Upload from "../upload/Upload";
import "./newPrompt.css";
import { useState } from "react";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  const chat = model.startChat({
    history:
      data?.history?.map(({ role, parts }) => ({
        role,
        parts: [{ text: parts[0].text }],
      })) || [],

    generationConfig: {
      //maxOutputToken: 100,
    },
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient
        .invalidateQueries({ queryKey: ["chats", data._id] })
        .then(() => {
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    // Optional: show typing animation before model responds
    setAnswer("•");
    let dots = 0;
    const typingInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      setAnswer("•" + "•".repeat(dots));
    }, 400);

    const promptInput =
      Object.keys(img.aiData).length > 0 ? [img.aiData, text] : [text];

    try {
      const result = await chat.sendMessageStream(promptInput);

      clearInterval(typingInterval); // stop animation

      let currentText = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();

        // Word-by-word split
        const words = chunkText.split(" ");
        for (let word of words) {
          currentText += word + " ";
          setAnswer(currentText);
          await new Promise((res) => setTimeout(res, 50)); // slow reveal
        }
      }
      mutation.mutate();
    } catch (err) {
      console.error("Streaming failed:", err);
      setAnswer("⚠️ Error generating response");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false);

    e.target.reset();
  };

  // in production we don't need this
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {}
      {img.isLoading && <div className="">Loading...</div>}
      {import.meta.env.VITE_IMAGE_KIT_ENDPOINT && img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="400"
          className="uploaded-img"
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown remarkPlugins={[remarkGfm]}>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
