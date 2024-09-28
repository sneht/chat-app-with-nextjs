import { signIn } from "@/auth";
import { Button } from "../ui/button/button";
import Google from "../ui/icons/google";

function SignInButtonLoginWithGoogle() {
  return (
    <Button
      className="flex rounded w-full mt-5 font-bold hover:border-secondary"
      size={"lg"}
      variant={"secondary"}
      type="button"
      onClick={async () => {
        await signIn("google");
      }}
    >
      <Google />
      Continue-with-google
    </Button>
  );
}

export default SignInButtonLoginWithGoogle;
