import { Droplet, Flame, Ruler } from "lucide-react";
import { Enums } from "@/utils/enums";

interface PreferencesStepProps {
  formData: {
    reasonForJoining: number;
    drinking: number;
    smoking: number;
    height: number;
  };
  updateFormData: (field: string, value: number) => void;
}

export default function PreferencesStep({ formData, updateFormData }: PreferencesStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Your preferences
      </h2>
      <p className="text-gray-600">Tell us about your lifestyle</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for joining
          </label>
          <select
            value={formData.reasonForJoining}
            onChange={(e) =>
              updateFormData("reasonForJoining", parseInt(e.target.value))
            }
            className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          >
            <option value={Enums.ReasonForJoining.Dating}>Dating</option>
            <option value={Enums.ReasonForJoining.Friendship}>
              Friendship
            </option>
            <option value={Enums.ReasonForJoining.Networking}>
              Networking
            </option>
            <option value={Enums.ReasonForJoining.Casual}>Casual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Droplet className="inline w-4 h-4 mr-1" /> Drinking habits
          </label>
          <select
            value={formData.drinking}
            onChange={(e) =>
              updateFormData("drinking", parseInt(e.target.value))
            }
            className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          >
            <option value={Enums.Drinking.Never}>Never</option>
            <option value={Enums.Drinking.Occasionally}>
              Occasionally
            </option>
            <option value={Enums.Drinking.Socially}>Socially</option>
            <option value={Enums.Drinking.Regularly}>Regularly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Flame className="inline w-4 h-4 mr-1" /> Smoking habits
          </label>
          <select
            value={formData.smoking}
            onChange={(e) =>
              updateFormData("smoking", parseInt(e.target.value))
            }
            className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          >
            <option value={Enums.Smoking.Never}>Never</option>
            <option value={Enums.Smoking.Occasionally}>
              Occasionally
            </option>
            <option value={Enums.Smoking.Socially}>Socially</option>
            <option value={Enums.Smoking.Regularly}>Regularly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Ruler className="inline w-4 h-4 mr-1" /> Height
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.height}
            onChange={(e) =>
              updateFormData("height", parseInt(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Short</span>
            <span>Average</span>
            <span>Tall</span>
          </div>
        </div>
      </div>
    </div>
  );
}