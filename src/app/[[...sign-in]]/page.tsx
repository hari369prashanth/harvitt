"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Head from "next/head";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;
    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);
  

  return (
    <>
      {/* Add Google Fonts for styling */}
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Background video */}
      <div className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/backvid.mp4" type="video/mp4" />
        </video>

        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Sign-in form */}
        <div className="relative flex items-center justify-center h-full">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-8 w-[90%] max-w-md">
            <div className="flex flex-col items-center mb-5">
              <Image src="/logo.png" alt="Harvitt Logo" width={50} height={50} />
              <h1
                className="text-3xl font-bold text-white my-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Harvitt
              </h1>
              <h2 className="text-gray-300 text-sm mt-1">
                Sign in to your account
              </h2>
            </div>
            <SignIn.Root>
              <SignIn.Step
                name="start"
                className="flex flex-col gap-8 "
              >
                <Clerk.GlobalError className="text-sm text-red-300" />
                <Clerk.Field name="identifier" className="flex flex-col gap-1">
                  <Clerk.Label className="text-xs text-gray-200 ">
                    Username
                  </Clerk.Label>
                  <Clerk.Input
                    type="text"
                    required
                    className="p-3 rounded-md bg-gray-800 bg-opacity-50 text-white ring-1 ring-gray-500 focus:ring-blue-400"
                  />
                  <Clerk.FieldError className="text-xs text-red-300" />
                </Clerk.Field>
                <Clerk.Field name="password" className="flex flex-col gap-1">
                  <Clerk.Label className="text-xs text-gray-200">
                    Password
                  </Clerk.Label>
                  <Clerk.Input
                    type="password"
                    required
                    className="p-3 rounded-md bg-gray-800 bg-opacity-50 text-white ring-1 ring-gray-500 focus:ring-blue-400"
                  />
                  <Clerk.FieldError className="text-xs text-red-300" />
                </Clerk.Field>
                <SignIn.Action
                  submit
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm p-2 transition"
                >
                  Sign In
                </SignIn.Action>
              </SignIn.Step>
            </SignIn.Root>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
