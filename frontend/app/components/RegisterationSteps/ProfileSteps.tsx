import { User } from "lucide-react";
import { Enums } from "@/utils/enums";

interface ProfileStepProps {
  formData: {
    ens: string;
    gender: number;
    interestedIn: number;
    relationshipStatus: number;
  };
  updateFormData: (field: string, value: string | number) => void;
}

export default function ProfileStep({ formData, updateFormData }: ProfileStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Create your profile
      </h2>
      <p className="text-gray-600">
        Let us get started with your basic profile information
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ENS Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.ens}
              onChange={(e) => updateFormData("ens", e.target.value)}
              className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              placeholder="Your ENS name or username"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) =>
              updateFormData("gender", parseInt(e.target.value))
            }
            className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          >
            <option value={Enums.Gender.Male}>Male</option>
            <option value={Enums.Gender.Female}>Female</option>
            <option value={Enums.Gender.NonBinary}>Non-binary</option>
            <option value={Enums.Gender.Other}>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Looking for
          </label>
          <select
            value={formData.interestedIn}
            onChange={(e) =>
              updateFormData("interestedIn", parseInt(e.target.value))
            }
            className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          >
            <option value={Enums.Gender.Male}>Men</option>
            <option value={Enums.Gender.Female}>Women</option>
            <option value={Enums.Gender.NonBinary}>
              Non-binary people
            </option>
            <option value={Enums.Gender.Other}>Everyone</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relationship Status
          </label>
          <select
            value={formData.relationshipStatus}
            onChange={(e) =>
              updateFormData(
                "relationshipStatus",
                parseInt(e.target.value)
              )
            }
            className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
          >
            <option value={Enums.RelationshipStatus.Single}>
              Single
            </option>
            <option value={Enums.RelationshipStatus.InRelationship}>
              In a relationship
            </option>
            <option value={Enums.RelationshipStatus.Married}>
              Married
            </option>
            <option value={Enums.RelationshipStatus.Complicated}>
              It is complicated
            </option>
            <option value={Enums.RelationshipStatus.OpenRelationship}>
              Open relationship
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}