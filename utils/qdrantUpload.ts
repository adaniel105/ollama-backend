import * as fs from 'fs'
import * as path from 'path'


const DIR_PDFS: string = 'kbase'; 
const PDF_FILENAMES: string[] = fs.readdirSync(DIR_PDFS);

export const PDF_FILES: string[] = PDF_FILENAMES.map(f => path.join(DIR_PDFS, f));

//upload a single file to qdrant
const upload_pdf_to_vectorstore = async (file_path: string, vector_store_id: string) : Promise<any> => {
   let pdf_file = path.basename(file_path)
}