import { v2 as cloudinary } from 'cloudinary';

async function retrievePDF(folderPath : string) {
  try {
    // Search for all PDFs in the specified folder
    const result = await cloudinary.search
      .expression(`folder:${folderPath}`)
      .sort_by('public_id', "desc")
      .max_results(30)
      .execute();

    console.log(`Found ${result.resources.length} PDFs`);

    const pdfDocuments = await Promise.all(
      result.resources.map(async (resource) => {
        try {
          const dataUrl = resource.secure_url;
          
          const response = await fetch(dataUrl);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          return {
            id: resource.public_id,
            filename: resource.public_id.split('/').pop(),
            url: dataUrl,
            content: buffer,
            size: resource.bytes,
            created_at: resource.created_at,
          };
        } catch (err) {
          console.error(`Error fetching ${resource.public_id}:`, err);
          return null;
        }
      })
    );

    // Filter out null results
    const validDocuments = pdfDocuments.filter(doc => doc !== null);

    return {
      total: validDocuments.length,
      documents: validDocuments
    };

  } catch (error) {
    console.error('Error retrieving PDFs:', error);
    throw error;
  }
}

export const bulkRetrieveMetadata = async function (){
  const folderPath = 'scanned/Books/*'; 
    try{
        const pdfData = await retrievePDF(folderPath);
        console.log(`Successfully retrieved ${pdfData.total} PDFs`);
        return pdfData;
    } catch(error){
        console.error(`Failed to bulk retrieve PDF metadata from ${folderPath}`)
    }
} 