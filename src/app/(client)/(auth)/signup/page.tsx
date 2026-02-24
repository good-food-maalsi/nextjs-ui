import { Icons } from "@/components/icons";

import { RegisterForm } from "./_components/register-form";

export default function SignupPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left side - Video (50%) */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/login/login_video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Right side - Register Form (50%) */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center gap-5 px-6">
        <Icons.logo className="size-32" />
        <RegisterForm />
        <p className="text-sm text-muted-foreground">Version 0.0.1</p>
      </div>
    </div>
  );
}
