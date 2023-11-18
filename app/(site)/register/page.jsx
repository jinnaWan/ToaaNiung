"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const session = useSession();
  console.log(session);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("api/emailExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        toast.error("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/login");
        toast.success("Registration successful. You can now log in.");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
      toast.error("An error occurred during registration.");
    }
  };

  return (
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
          onSubmit={handleSubmit}
          className="justify-center items-center  self-stretch flex flex-col w-full mt-10 max-md:mt-10 font-OpenSans"
        >
          <div className="  self-stretch flex flex-col w-full">
            <div className="text-neutral-950 text-3xl  leading-10 self-center whitespace-nowrap ">
              Create account
            </div>
            <div className="items-start self-stretch flex grow flex-col w-full mt-6">
              <input
                onChange={(e) => setName(e.target.value)}
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Name"
                className=" text-black text-base leading-6 self-stretch whitespace-nowrap  border border-[color:var(--border-normal-day,#DBDBDB)] w-full mt-6 pl-3 pr-20 py-3 rounded-xl border-solid max-md:pr-5"
              ></input>
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                className=" text-black  text-base leading-6 self-stretch whitespace-nowrap  border border-[color:var(--border-normal-day,#DBDBDB)] w-full mt-6 pl-3 pr-20 py-3 rounded-xl border-solid max-md:pr-5"
              ></input>
              <input
                onChange={(e) => setPassword(e.target.value)}
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
          Already sign up?{" "}
          <a
            href="/login"
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
          loading="lazy"
          srcSet="https://cdn.discordapp.com/attachments/1170752491944677567/1171114993975033927/Right_image.png?ex=655b80d4&is=65490bd4&hm=96cc3239f5ab950461eef42a13e684d0d0bca846806f10aa6179ec4e2564f88b&"
          className="aspect-[0.95] object-contain object-center  overflow-hidden w-full self-end h-full"
        />
      </div>
    </div>
  );
}
