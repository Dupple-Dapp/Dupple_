"use client";

import { useState, useEffect } from "react";
import { CheckCircle, ChevronRight } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import ProfileStep from "../components/RegisterationSteps/ProfileSteps";
import PreferencesStep from "../components/RegisterationSteps/PreferenceSteps";
import InterestsStep from "../components/RegisterationSteps/InterestsSteps";
import PhotosStep from "../components/RegisterationSteps/PhotoSteps";
import { Enums } from "@/utils/enums";
import { useRegisterUser } from "@/hooks/useRegisterUser";
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
  const [step, setStep] = useState(1);
    const router = useRouter();
    const { registerUser, isPending, isSuccess, error } = useRegisterUser();

  const [formData, setFormData] = useState({
    ens: "",
    description: "",
    profilePic: "",
    gender: Enums.Gender.Male,
    interestedIn: Enums.Gender.Female,
    relationshipStatus: Enums.RelationshipStatus.Single,
    height: 3,
    selectedHobbies: [] as number[],
    reasonForJoining: Enums.ReasonForJoining.Dating,
    drinking: Enums.Drinking.Socially,
    smoking: Enums.Smoking.Never,
  });

  const allowedHobbies = [
    "Reading", "Gaming", "Cooking", "Sports", "Music", "Travel", 
    "Relaxing", "Football", "Barbecues", "Cuddles", "Meeting people", 
    "Tennis", "Writing", "Horror", "Coffee", "Baking", "Hiking", 
    "Gardening", "Foodie", "Skiing", "Museums and galleries", "Wine", 
    "Art", "Coding", "Festivals",
  ];

  const totalSteps = 4;

  const updateFormData = (field: string, value: string | number | boolean | null | number[]) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const toggleHobby = (hobby:string) => {
    const hobbyIndex = allowedHobbies.indexOf(hobby);
    if (hobbyIndex === -1) return;

    const currentHobbies = [...formData.selectedHobbies];
    const hobbyIndexInSelected = currentHobbies.indexOf(hobbyIndex);

    if (hobbyIndexInSelected === -1) {
      currentHobbies.push(hobbyIndex);
    } else {
      currentHobbies.splice(hobbyIndexInSelected, 1);
    }

    updateFormData("selectedHobbies", currentHobbies);
  };

  const isHobbySelected = (hobby:string) => {
    const hobbyIndex = allowedHobbies.indexOf(hobby);
    return formData.selectedHobbies.includes(hobbyIndex);
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (isPending) return;

    try {
      if (
        !formData.ens ||
        !formData.description ||
        formData.selectedHobbies.length === 0
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      console.log("FormData:", formData);

      registerUser({
        ens: formData.ens,
        description: formData.description,
        profilePic: formData.profilePic,
        interestedIn: formData.interestedIn,
        gender: formData.gender,
        relationshipStatus: formData.relationshipStatus,
        height: formData.height,
        hobbyIndices: formData.selectedHobbies,
        reason: formData.reasonForJoining,
        drinking: formData.drinking,
        smoking: formData.smoking,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to send transaction");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Transaction confirmed on blockchain!");
      router.push("/profile");
    }
    if (error) {
      console.error("Transaction error:", error);
      toast.error("Transaction failed");
    }
  }, [isSuccess, error, router]);


  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="flex justify-between items-center relative">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === step;
            const isCompleted = stepNum < step;

            return (
              <div
                key={stepNum}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                  ${
                    isActive
                      ? "border-purple-600 bg-purple-50 text-purple-600"
                      : isCompleted
                      ? "border-purple-600 bg-purple-600 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : stepNum}
                </div>
                <span
                  className={`text-xs mt-2 font-medium
                  ${
                    isActive
                      ? "text-purple-600"
                      : isCompleted
                      ? "text-purple-600"
                      : "text-gray-400"
                  }`}
                >
                  {stepNum === 1
                    ? "Profile"
                    : stepNum === 2
                    ? "Preferences"
                    : stepNum === 3
                    ? "Interests"
                    : "Photos"}
                </span>
              </div>
            );
          })}

          <div className="absolute top-5 h-1 w-full bg-gray-200 -z-10">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ProfileStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 2:
        return (
          <PreferencesStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      case 3:
        return (
          <InterestsStep 
            formData={formData} 
            updateFormData={updateFormData}
            allowedHobbies={allowedHobbies}
            toggleHobby={toggleHobby}
            isHobbySelected={isHobbySelected}
          />
        );
      case 4:
        return (
          <PhotosStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 sm:p-8">
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-purple-600">dupple</h1>
        </div>

        {renderStepIndicator()}

        <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
          {renderStep()}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="button"
              onClick={nextStep}
              disabled={
                (step === 3 && formData.selectedHobbies.length === 0) ||
                isPending
              }
              className={`py-2 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 flex items-center ${
                (step === 3 && formData.selectedHobbies.length === 0) ||
                isPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isPending ? (
                "Processing..."
              ) : step === totalSteps ? (
                "Register on Blockchain"
              ) : (
                <>
                  Continue
                  <ChevronRight className="ml-1 w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already registered?{" "}
            <a
              href="/login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Connect wallet
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}