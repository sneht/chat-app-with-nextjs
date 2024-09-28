import { useFormStatus } from "react-dom";
import { Button } from "../ui/button/button";

function CreateProfileSubmitButton({ isValid }: { isValid: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      disabled={!isValid || pending}
      size={"lg"}
    >
      {pending ? "Creating Profile..." : "Create Profile"}
    </Button>
  );
}

export default CreateProfileSubmitButton;
