import { Poppler } from "node-poppler"

const file = "papers.pdf";
const poppler = new Poppler();
const options = {
	firstPageToConvert: 1,
	lastPageToConvert: 2,
	pngFile: true,
};
const outputFile = `test_document.png`;

const res = await poppler.pdfToCairo(file, outputFile, options);
console.log(res);