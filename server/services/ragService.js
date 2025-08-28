const { QdrantClient } = require("@qdrant/js-client-rest");
const { MistralAIEmbeddings } = require("@langchain/mistralai");
const { ChatGroq } = require("@langchain/groq");
const { QdrantVectorStore } = require("@langchain/qdrant");
const {
  WebPDFLoader,
} = require("@langchain/community/document_loaders/web/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { PromptTemplate } = require("@langchain/core/prompts");
const { RetrievalQAChain } = require("langchain/chains");
const {
  createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");

const QDRANT_COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME;

// const promptTemplate = PromptTemplate.fromTemplate(`
//   You are Mentex, an assistant for question-answering tasks.
//   Use the following pieces of retrieved context to answer the question.
//   If you don't know the answer, just say that you don't know.
//   Use three sentences maximum and keep the answer concise.
//  Question: {input}
//  Context: {context}
//  Answer: `);

const embeddings = new MistralAIEmbeddings({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-embed",
  temperature: 0.1,
});

// const model = new ChatGroq({
//   apiKey: process.env.GROQ_API_KEY,
//   model: "llama-3.1-8b-instant",
//   temperature: 0.5,
//   maxTokens: 600,
// });

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

async function getVectorStore() {
  const collections = await client.getCollections();
  if (
    !collections.collections.some((col) => col.name === QDRANT_COLLECTION_NAME)
  ) {
    await client.createCollection(QDRANT_COLLECTION_NAME, {
      vectors: {
        size: 1024,
        distance: "Cosine",
      },
    });
  }

  // // Ensure payload index for docId exists (integer type)
  // try {
  //   // ensure correct index type for UUID docId: keyword
  //   try {
  //     await client.deletePayloadIndex(QDRANT_COLLECTION_NAME, {
  //       field_name: 'docId',
  //     });
  //   } catch (_) {}
  //   await client.createPayloadIndex(QDRANT_COLLECTION_NAME, {
  //     field_name: 'docId',
  //     field_schema: { type: 'keyword' },
  //   });
  // } catch (err) {
  //   // Ignore if already exists or index creation is not necessary
  // }

  return new QdrantVectorStore(embeddings, {
    client: client,
    collectionName: QDRANT_COLLECTION_NAME,
  });
}

module.exports.processDocument = async function (docUrl, docId) {
  const response = await fetch(docUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }

  const pdfBlob = await response.blob();

  const loader = new WebPDFLoader(pdfBlob, {
    splitPages: true,
    parsedItemSeparator: "",
  });

  const docs = await loader.load();
  // console.log(docs)

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);
  // console.log(`Split into ${splitDocs.metadata.pdf} chunks`);

  splitDocs.forEach((doc) => {
    doc.metadata.docId = String(docId).trim();
  });

  // console.log(splitDocs)

  const vectorStore = await getVectorStore();
  await vectorStore.addDocuments(splitDocs);
  // console.log('added to qdrant')
};

// module.exports.generateResponse = async function (question, docId) {
//     const vectorStore = await getVectorStore();
//     const id = String(docId).trim();

//    const combineDocsChain = await createStuffDocumentsChain({
//   llm: model,
//   prompt: promptTemplate,
// });
// const retriever = vectorStore.asRetriever({
//   filter: {
//     must: [
//       { key: "metadata.docId", match: { value: id } },
//     ],
//   },
// });

// const retrievalChain = await createRetrievalChain({
//   combineDocsChain,
//   retriever,
// });
// return retrievalChain;
// }

module.exports.getContext = async function (question, docId, k = 4) {
  const vectorStore = await getVectorStore();
  const id = String(docId).trim();
  const filter = { must: [{ key: "metadata.docId", match: { value: id } }] };
  const docs = await vectorStore.similaritySearch(question, k, filter);
  const context = docs
    .map((d, i) => `[[Chunk ${i + 1}]]\n${d.pageContent}`)
    .join("\n\n");
  return context;
};

module.exports.deleteDocument = async function (docId) {
  const id = String(docId).trim();

  await client.delete(QDRANT_COLLECTION_NAME, {
    filter: {
      must: [
        {
          key: "metadata.docId",
          match: { value: id },
        },
      ],
    },
  });
  console.log(`Deleted all vectors`);
};
