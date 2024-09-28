import { useFormStatus } from "react-dom";
import ButtonLoader from "../ui/button-loader/button-loader";
import { Button } from "../ui/button/button";

function SignInButton({ isValid }: { isValid: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      className="rounded mt-5 font-bold cursor-pointer hover:border"
      size={"lg"}
      type="submit"
      disabled={!isValid || pending}
    >
      {pending ? "Checking..." : "Sign In"}
    </Button>
  );
}

export default SignInButton;
