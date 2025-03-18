import * as React from "react";
import { SignInWithGithub } from "../SignInWithGithub";

export const SignInForm: React.FC = () => (
  <div className="flex flex-col gap-8 w-96 mx-auto bg-white p-8 rounded-lg shadow-sm border border-pastel-200">
    <p className="text-pastel-800 text-center text-lg">
      Welcome! Please sign in to continue
    </p>
    <SignInWithGithub />
  </div>
);
