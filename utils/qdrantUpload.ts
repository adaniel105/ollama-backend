import * as fs from 'fs'
import * as path from 'path'
import { Poppler } from "node-poppler"
import { CohereClientV2 } from "cohere-ai";
import { QdrantClient } from '@qdrant/js-client-rest';

import dotenv from "dotenv"
// import { bulkRetrieveMetadata } from '../cloudinary/metadata.ts';
import { readImgData } from './embed.js';

dotenv.config()
const cohere = new CohereClientV2({});



//CONVERT PDFS TO IMAGES -> BASE64 -> COHERE MULTIMODAL EMBEDDINGS -> UPLOAD TO QDRANT FOR SEMANTIC SEARCH/ LLM INGESTING
const DIR_PDFS: string = 'kbase';
const INPUT_DIR: string = `${DIR_PDFS}/input`;
const OUTPUT_DIR: string = `${DIR_PDFS}/output`;
const PDF_FILENAMES: string[] = fs.readdirSync(INPUT_DIR);
const OUTPUT_FILENAMES : string[] = fs.readdirSync(OUTPUT_DIR);
const OUTPUT_FILES : string[] = OUTPUT_FILENAMES.map(name => path.join(OUTPUT_DIR, name));
export const PDF_FILES: string[] = PDF_FILENAMES.map(name => path.join(INPUT_DIR, name));
const IMG_DATA_ARRAY : string[] = []

// const poppler = new Poppler();
// const options = {
// 	firstPageToConvert: 1,
// 	lastPageToConvert: 2,
// 	pngFile: true,

// };

// for (let file in PDF_FILES){
//    //determine whether null coalescing is appropriate here later.
//    let inputFile: string = PDF_FILES[file]!
//    let inputFileName : string = inputFile.split(".")[0]?.split("/")[2]!
//    poppler.pdfToCairo(inputFile, `${OUTPUT_DIR}/${inputFileName}`, options);
// }

readImgData(OUTPUT_DIR, IMG_DATA_ARRAY);


// TURN IMAGES TO EMBEDDINGS
let response = await cohere.embed({
   model: "embed-v4.0",
   inputType: "image",
   embeddingTypes: ["float"],
   images: IMG_DATA_ARRAY,
})

let embeds = response.embeddings

console.debug(embeds)

// multimodal embeddings enable search over images directly. 
// convert query to embeddings -> retrieve results from vector db (qdrant) -> output top_k responses
const client = new QdrantClient({ host: "localhost", port: 6333 });

// First, create collection if it doesn't exist
const collectionName = "pdf_images";
const vectorSize = embeds.float[0].length; // get dim size from first embed.
console.log(vectorSize)
try {
  await client.createCollection(collectionName, {
    vectors: {
      size: vectorSize,
      distance: "Cosine"
    }
  });
} catch (error) {
  console.log("Collection may already exist, continuing...");
}

// Prepare points for upload
const points = embeds.float.map((embedding, index) => ({
  id: index,
  vector: embedding,
  payload: {
    filename: OUTPUT_FILENAMES[index],
  }
}));

// Upload to Qdrant
await client.upsert(collectionName, {
  points: points,
});

console.log(`Successfully uploaded ${points.length} embeddings to Qdrant`);