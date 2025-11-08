import { CohereClientV2 } from "cohere-ai";
import { PDF_FILES } from "./qdrantUpload";

const cohere = new CohereClientV2({});


cohere.embed({
    model: "embed-v4.0",
    inputType: "image",
    embeddingTypes: ["float"],
    images: PDF_FILES
})
