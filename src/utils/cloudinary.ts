import { BlobServiceClient } from "@azure/storage-blob";

const blobServiceClient = BlobServiceClient.fromConnectionString(
    "DefaultEndpointsProtocol=https;AccountName=taut;AccountKey=yJwh4VjHfLgHP1TaqBV/z+E8qwzXmsdgXI/ui7m5Ag45n1JL5LNRZVMuaq5u59gAQJL5nDmi3UeI+AStncGmtg==;EndpointSuffix=core.windows.net"
);
const containerClient = blobServiceClient.getContainerClient(
    process.env.Blob_CONT_Name! as any
);

export const uploadDocumentToAzure = async (file: string) => {
  const data = Buffer.from("BASE-64-ENCODED-PDF", "base64");
  const blockBlobClient = containerClient.getBlockBlobClient(file);
  const response = await blockBlobClient.uploadData(data, {
    blobHTTPHeaders: {
      blobContentType: "application/pdf",
    },
  });
  if (response._response.status !== 201) {
    throw new Error(
      `Error uploading document ${blockBlobClient.name} to container ${blockBlobClient.containerName}`
    );
  }
};

export const downloadDocumentFromAzure = async (file:string) => {
  const blockBlobClient = containerClient.getBlockBlobClient(
    file
  );
  const response = await blockBlobClient.download(0);
  if (response.readableStreamBody) {
    return await streamToString(response.readableStreamBody);
  } else {
    throw new Error(
      `Error downloading document ${blockBlobClient.name} from container ${blockBlobClient.containerName}`
    );
  }
};

const streamToString = async (readableStream: NodeJS.ReadableStream) => {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    readableStream.on("data", (data) => {
      chunks.push(data);
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks).toString("base64"));
    });
    readableStream.on("error", reject);
  });
};

export const deleteDocumentFromAzure = async (file:string) => {
  const response = await containerClient.deleteBlob(file);
  if (response._response.status !== 202) {
    throw new Error(`Error deleting ${"FILENAME-TO-DELETE"}`);
  }
};
