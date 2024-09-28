import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function EmailVerifiedPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Email Verified Successfully!</h1>
      <p className="mb-4">
        Your email has been verified. You can now use all features of the app.
      </p>
      <a href="/" className="text-blue-500 hover:underline">
        Go to Home Page
      </a>
    </div>
  );
}
