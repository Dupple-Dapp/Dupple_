interface InterestsStepProps {
   formData: {
     description: string;
     selectedHobbies: number[];
   };
   updateFormData: (field: string, value: string | number | boolean) => void;
   allowedHobbies: string[];
   toggleHobby: (hobby: string) => void;
   isHobbySelected: (hobby: string) => boolean;
 }
 
 export default function InterestsStep({ 
   formData, 
   updateFormData, 
   allowedHobbies, 
   toggleHobby, 
   isHobbySelected 
 }: InterestsStepProps) {
   return (
     <div className="space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">About you</h2>
       <p className="text-gray-600">
         Let others know what makes you unique
       </p>
 
       <div className="space-y-4">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
             Description
           </label>
           <textarea
             value={formData.description}
             onChange={(e) =>
               updateFormData("description", e.target.value)
             }
             className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 h-32"
             placeholder="Tell potential matches about yourself..."
             required
           ></textarea>
           <p className="text-xs text-gray-500 mt-1">
             <span
               className={
                 formData.description.length > 300 ? "text-red-500" : ""
               }
             >
               {formData.description.length}
             </span>
             /300 characters
           </p>
         </div>
 
         <div className="space-y-2">
           <label className="block text-sm font-medium text-gray-700">
             Your hobbies (select at least one)
           </label>
           <div className="flex flex-wrap gap-2 text-gray-700">
             {allowedHobbies.map((hobby) => (
               <button
                 key={hobby}
                 type="button"
                 onClick={() => toggleHobby(hobby)}
                 className={`py-1 px-3 rounded-full border text-sm focus:outline-none focus:ring-2 
                   ${
                     isHobbySelected(hobby)
                       ? "bg-purple-600 text-white border-purple-600"
                       : "border-gray-300 hover:bg-purple-50 hover:border-purple-300"
                   }`}
               >
                 {hobby}
               </button>
             ))}
           </div>
           {formData.selectedHobbies.length === 0 && (
             <p className="text-xs text-red-500">
               Please select at least one hobby
             </p>
           )}
         </div>
       </div>
     </div>
   );
 }