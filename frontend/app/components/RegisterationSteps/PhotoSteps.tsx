import { Camera } from "lucide-react";

interface PhotosStepProps {
  formData: {
    profilePic: string;
  };
  updateFormData: (field: string, value: string | number | boolean | null) => void;
}

export default function PhotosStep({ formData, updateFormData }: PhotosStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Profile photos</h2>
      <p className="text-gray-600">Add your NFT profile picture</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture NFT (URL or NFT ID)
          </label>
          <input
            type="text"
            value={formData.profilePic}
            onChange={(e) => updateFormData("profilePic", e.target.value)}
            placeholder="Enter your NFT URL or token ID"
            className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          />
        </div>

        <div className="flex justify-center">
          <div className="w-48 h-48 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
            {formData.profilePic ? (
              <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-200 overflow-hidden">
                <p className="text-center text-sm text-gray-600 p-4">
                  Your NFT: {formData.profilePic}
                </p>
              </div>
            ) : (
              <>
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Enter NFT above
                </span>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          This will be your primary profile photo
        </p>
      </div>
    </div>
  );
}