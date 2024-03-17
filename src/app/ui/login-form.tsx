"use client";

import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { Button } from "./button";
import { useFormStatus } from "react-dom";

export default function LoginForm() {
  return (
    <div className={`w-1/2 h-4/5 bg-white`}>
      <form action="" className="w-full h-full flex items-center flex-col">
        <Image
          src={"/img/AITA.png"}
          alt="AITA service logo"
          width={120}
          height={120}
        />
        <p className="text-xl mt-8">Wellcome to AITA CMS for companies</p>
        <p className="text-xl">Please Login</p>
        <div className="w-3/4 mt-8 shadow-2xl rounded-lg p-8 border-2 border-gray-100">
          <label
            className="mb-2 block text-xs font-medium text-gray-900 self-start"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="text"
            name="password"
            placeholder="user@example.com"
            className="w-full h-8 border-2 border-red-400 rounded-lg p-2"
          />
          <label
            className="mb-2 mt-4 block text-xs font-medium text-gray-900 self-start"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="12345678"
            className="w-full h-8 border-2 border-red-400 rounded-lg p-2"
          />
          <LoginButton />
        </div>
      </form>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-8 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
