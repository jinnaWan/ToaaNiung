"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Login() {
  const router = useRouter();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // Function to handle user login
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const login = await signIn("credentials", { ...data, redirect: false, callbackUrl: '/findtable' });
      console.log("Login Response:", login);
  
      if (login.ok) {
        toast.success("Successfully Logged in! Redirecting...");
        // Use the callbackUrl from the response to determine where to redirect
        router.push(login.url || "/findtable");
      } else {
        toast.error("Login failed.");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };
  

  return (
    <>
      <div className="flex flex-wrap bg-[linear-gradient(180deg,#FFF5EB_0%,#FFF_47.47%)] justify-items-center">
        <div className="pl-40 pr-40 sm:w-full  xl:w-1/2  h-full flex flex-col  mt-16 self-end  justify-items-center">
          <div className="  self-center flex w-[99px] max-w-full flex-col  justify-center items-center">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/014f9ad4-f36d-414c-98c6-5777cbc9d5a8?"
              className="aspect-[2.15] object-contain object-center w-full overflow-hidden self-stretch"
            />
            <div className="text-neutral-950 text-xs font-extrabold leading-4 tracking-[3.48px] self-stretch whitespace-nowrap mt-2.5 font-Nunito">
              TOAA-NIUNG
            </div>
          </div>
          <form
            onSubmit={loginUser}
            className="justify-center items-center  self-stretch flex flex-col w-full mt-10 max-md:mt-10 font-OpenSans"
          >
            <div className="  self-stretch flex flex-col w-full">
              <div className="text-neutral-950 text-3xl  leading-10 self-center whitespace-nowrap ">
                Log In
              </div>
              <div className="items-start self-stretch flex grow flex-col w-full mt-6">
                <input
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  className=" text-black  text-base leading-6 self-stretch whitespace-nowrap  border border-[color:var(--border-normal-day,#DBDBDB)] w-full mt-6 pl-3 pr-20 py-3 rounded-xl border-solid max-md:pr-5"
                ></input>
                <input
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  className=" text-black  text-base leading-6 self-stretch whitespace-nowrap  border border-[color:var(--border-normal-day,#DBDBDB)] w-full mt-6 pl-3 pr-20 py-3 rounded-xl border-solid max-md:pr-5"
                ></input>
              </div>
            </div>

            <div className="items-start self-stretch flex grow flex-col w-full mt-8">
              <button
                type="submit"
                className="justify-center bg-zinc-950  items-center text-white item-center self-stretch flex w-full flex-col px-20 py-3 rounded-xl max-md:px-5 hover:bg-neutral-700 hover:text-black "
              >
                Continue
              </button>
            </div>
          </form>

          <p className="mt-10 self-center text-center text-sm text-gray-500 font-OpenSans">
            Doesn&apos;t have an account yet?{" "}
            <a
              href="/register"
              className="font-semibold leading-6 text-black hover:text-gray-800"
            >
              Click here
            </a>
          </p>

          <div className="items-start self-center flex w-[194px] max-w-full gap-2 mt-48 max-md:mt-10">
            <div className="text-gray-600 text-base leading-6"></div>
            <div className="text-blue-600 text-center text-base font-semibold leading-6 self-stretch whitespace-nowrap"></div>
          </div>
        </div>

        <div className=" sm:w-full xl:w-1/2  bg-gray-500 h-full">
          <img
            style={{ objectFit: 'cover'}}
            loading="lazy"
            srcSet="/image/Landing4.jpeg"
            className="aspect-[0.95] object-contain object-center  overflow-hidden w-full self-end h-full"
          />
        </div>
      </div>
    </>
  );
}
