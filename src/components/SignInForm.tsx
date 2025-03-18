import * as React from "react";
import { SignInWithGithub } from "../SignInWithGithub";

export const SignInForm: React.FC = () => (
  <div className="flex flex-col gap-8 w-96 mx-auto">
    <p>Log in to see the numbers</p>
    <SignInWithGithub />
  </div>
);
