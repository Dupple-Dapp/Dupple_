import { useState } from "react";
import IPFSUploader from "./IPFSUploader";
import Head from "next/head";

export default function UploadPage() {
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  const handleUploadComplete = (hash: string) => {
    setIpfsHash(hash);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <Head>
        <title>Upload to IPFS</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Upload Image to IPFS
        </h1>

        <IPFSUploader onUploadComplete={handleUploadComplete} />

        {ipfsHash && (
          <div className="mt-8 p-4 bg-green-50 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Upload Successful!</h2>
            <p className="mb-2">IPFS Hash:</p>
            <code className="block p-2 bg-gray-800 text-green-400 rounded-md overflow-x-auto">
              {ipfsHash}
            </code>
            <p className="mt-4">
              View your file at:{" "}
              <a
                href={`https://gateway.pinata.cloud/ipfs/${ipfsHash.replace("ipfs://", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open in Pinata Gateway
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
