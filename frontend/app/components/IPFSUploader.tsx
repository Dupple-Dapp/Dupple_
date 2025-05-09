import { ChangeEvent, useState, useRef } from "react";
import axios from "axios";
import { ImagePlus, Loader2 } from "lucide-react";

type IPFSUploaderProps = {
  onUploadSuccess: (ipfsHash: string) => void;
  className?: string;
};

export default function IPFSUploader({
  onUploadSuccess,
  className = "",
}: IPFSUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
        },
      );

      onUploadSuccess(`ipfs://${res.data.IpfsHash}`);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to add photo");
    } finally {
      setIsUploading(false);
      // Reset input to allow same file re-upload
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`flex items-center justify-center aspect-square bg-gray-100 hover:bg-gray-200 rounded-md transition-colors ${className}`}
      >
        {isUploading ? (
          <Loader2 className="animate-spin text-gray-500" size={24} />
        ) : (
          <ImagePlus className="text-gray-500" size={24} />
        )}
      </button>

      {error && (
        <p className="text-xs text-red-500 mt-1 text-center">{error}</p>
      )}
    </>
  );
}
