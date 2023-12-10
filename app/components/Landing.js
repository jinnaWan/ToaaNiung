"use client";
import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const generateRadialGradient = (color1, color2, color3) => {
  return `radial-gradient(138.06% 1036.51% at 95.25% -2.54%, ${color1} 0%, ${color2} 50%, ${color3} 100%)`;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MyComponent(props) {
  const { data: session } = useSession();
  const router = useRouter();
  const tealColor = "#009688";
  const greenColor = "#4CAF50";
  const blueColor = "#2196F3";
  const radialGradient = generateRadialGradient(
    tealColor,
    greenColor,
    blueColor
  );

  const handleSignOut = async () => {
    try {
      const result = await signOut({ redirect: false }); // Use { redirect: false } to prevent automatic redirection
      if (!result.error) {
        // Manual redirection to the login page
        router.push("/login");
      } else {
        // Handle sign-out failure, e.g., show an error message
        toast.error("Sign-out failed.");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("An error occurred during sign-out.");
    }
  };

  return (
    <div className="shadow-sm bg-white flex flex-col border-0 border-solid border-black">
      <div className="flex-col justify-start items-center overflow-hidden self-stretch relative z-[1] flex min-h-[840px] w-full pb-20 max-md:max-w-full">
        <img
          loading="lazy"
          src="https://media.discordapp.net/attachments/1170752491944677567/1170753746888818708/Hero_section.png?ex=655a3064&is=6547bb64&hm=08797518129097098fa65d511bb6ff6d6b56601db5bff4ae1177ff7b6086f314&=&width=1388&height=607"
          className="absolute z-[-1] h-full w-full object-cover object-center inset-0"
        />
        <div className="justify-center items-center self-stretch flex w-full flex-col flex-wrap px-5 py-10 ">
          <div className="items-stretch flex w-[1224px]  justify-between gap-5 py-0.5 flex-wrap">
            <div className="flex items-center gap-3.5">
              <a href="/login" className="flex items-center">
                <img
                  loading="lazy"
                  srcSet="https://cdn.discordapp.com/attachments/1170752491944677567/1175513295504027739/Logoggez.png?ex=656b8111&is=65590c11&hm=164e1aaaa76c6e1fcc3d450539feb7947c475ca5706f9c577b9351027d79affb&"
                  className="object-contain object-center w-14 max-w-full"
                />
                <div className="shadow-2xl pl-4 text-white text-xl font-extrabold leading-4 tracking-[3.48px] self-stretch whitespace-nowrap mt-4 font-Belleza">
                  TOAA-NIUNG
                </div>
              </a>
            </div>
            <div className="items-start flex justify-between gap-5 max-md:justify-center font-DMSans">
              <a
                href=""
                className="text-white border-b-4 text-base font-medium leading-5 whitespace-nowrap my-auto "
              >
                Home
              </a>
              {session ? (
                <a
                  href="/findtable"
                  className="text-white text-base font-medium leading-5 whitespace-nowrap my-auto "
                >
                  Reservation
                </a>
              ) : /* Render alternative component or hide the link */
              null}
              <a
                href=""
                className="text-white text-base font-medium leading-5 self-center my-auto"
              >
                Promotion
              </a>
              <a
                href=""
                className="text-white text-base font-medium leading-5 self-center whitespace-nowrap my-auto"
              >
                Contact
              </a>
            </div>
            {session ? (
              <div className="justify-between items-stretch self-center flex gap-5 my-auto">
                {/* User dropdown */}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      <div className="text-gray-700 font-normal">
                        {session?.user.name}
                      </div>
                      <ChevronDownIcon
                        className="-mr-1 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={() => router.push("/myprofile")} // Redirect to My Profile page
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm cursor-pointer"
                              )}
                            >
                              My Profile
                            </a>
                          )}
                        </Menu.Item>
                        {session?.user.isAdmin && ( // Check if the user is an admin
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={() => router.push("/admin")} // Redirect to Admin page
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm cursor-pointer"
                                )}
                              >
                                Admin
                              </a>
                            )}
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={handleSignOut} // Call handleSignOut for logout action
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm cursor-pointer"
                              )}
                            >
                              Logout
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <a
                href="/login"
                className="items-center flex justify-between gap-2"
              >
                <div className="text-white text-base leading-5 my-auto">
                  Login
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/bf7e83d4-a318-4454-a45a-afaa34ab4504?"
                  className="aspect-square object-contain object-center w-6 overflow-hidden self-stretch shrink-0 max-w-full"
                />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="items-center self-stretch flex w-full flex-col px-20 py-20 max-md:max-w-full max-md:px-5 max-md:py-24">
        <div className="items-center flex w-full flex-col max-md:max-w-full max-md:px-5 max-md:py-24">
          <div className="items-stretch flex w-[975px] max-w-full flex-col">
            <div className="text-black text-6xl font-bold self-center leading-[70px] whitespace-nowrap max-md:max-w-full max-md:text-4xl">
              Recommended promotions for you!!
            </div>
            <div className="text-neutral-600 text-xl self-center font-medium leading-6 whitespace-nowrap mt-2">
              Recommended products for today
            </div>
          </div>
          <div className="items-stretch flex w-[1224px] max-w-full flex-col mt-20 -mb-8 max-md:mt-10 max-md:mb-2.5">
            <div className="max-md:max-w-full">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                <div className="flex flex-col items-stretch w-[61%] max-md:w-full max-md:ml-0">
                  <img
                    loading="lazy"
                    srcSet="https://media.discordapp.net/attachments/1170752491944677567/1170752690679193610/image.png?ex=655a2f68&is=6547ba68&hm=7876629bc7cf2552cc5fb991bf6ef45da39de342c44873ee3fd2a2dbc8ebd59c&=&width=930&height=426"
                    className="aspect-[2.18] object-contain object-center w-full self-stretch overflow-hidden max-md:max-w-full"
                  />
                </div>
                <div className="flex flex-col items-stretch w-[39%] ml-5 max-md:w-full max-md:ml-0">
                  <div className="flex flex-col my-auto px-14 max-md:max-w-full max-md:mt-10 max-md:px-5">
                    <div className="items-stretch self-stretch flex flex-col">
                      <div className="text-cyan-700 text-base leading-5 whitespace-nowrap">
                        Great value promotion!
                      </div>
                      <div className="text-black text-4xl font-medium leading-10 mt-1">
                        Kurobuta Crispy Pork
                      </div>
                    </div>
                    <div className="items-stretch self-stretch flex flex-col mt-6">
                      <div className="text-neutral-600 text-base leading-5">
                        When ordering more than 4 food items
                      </div>
                      <div className="items-stretch flex w-[125px] max-w-full gap-2 mt-4 self-start">
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3abb1957-d6a0-44a8-b628-c35116105c4a?"
                          className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
                        />
                        <div className="text-cyan-700 text-base font-bold leading-5 whitespace-nowrap mt-1 self-start">
                          <span className="font-bold">10 Jun 2024</span>
                          <span className=""> </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href="/login"
                      className="mt-6 text-center rounded-[64px] w-fit h-10 bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Book now
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-32 max-md:max-w-full max-md:mt-10">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                <div className="flex flex-col items-stretch w-[39%] max-md:w-full max-md:ml-0">
                  <div className="flex flex-col my-auto px-14 max-md:max-w-full max-md:mt-10 max-md:px-5">
                    <div className="items-stretch self-stretch flex flex-col">
                      <div className="text-cyan-700 text-base leading-5 whitespace-nowrap">
                        Great value promotion!
                      </div>
                      <div className="text-black text-4xl font-medium leading-10 mt-1">
                        Jay Fai’s Dim Sum
                      </div>
                    </div>
                    <div className="items-stretch self-stretch flex flex-col mt-6">
                      <div className="text-neutral-600 text-base leading-5">
                        Get 10 trays of dim sum free when you collect expenses
                        of 200 baht or more at the end of your receipt.
                      </div>
                      <div className="items-stretch flex w-[126px] max-w-full gap-2 mt-4 self-start">
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/5c4d1309-9480-4712-a0a5-5795bc397662?"
                          className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
                        />
                        <div className="text-cyan-700 text-base font-bold leading-5 whitespace-nowrap mt-1 self-start">
                          <span className="font-bold">10 Sep 2024</span>
                          <span className=""> </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href="/login"
                      className="mt-6 text-center rounded-[64px] w-fit h-10 bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Book now
                    </a>
                  </div>
                </div>
                <div className="flex flex-col items-stretch w-[61%] ml-5 max-md:w-full max-md:ml-0">
                  <img
                    loading="lazy"
                    srcSet="https://media.discordapp.net/attachments/1170752491944677567/1170754518573662288/image.png?ex=65636b9c&is=6550f69c&hm=ecc0230621598196f421f8fef395637139420d200d35972424004a21f9d6015f&=&width=930&height=451"
                    className="aspect-[1.95] object-contain object-center w-full self-stretch overflow-hidden max-md:max-w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-col items-center overflow-hidden self-stretch relative z-[1] flex min-h-[334px] w-full mt-7 pt-20 pb-32 px-20 max-md:max-w-full max-md:pb-24 max-md:px-5">
        <img
          loading="lazy"
          srcSet="https://media.discordapp.net/attachments/1170752491944677567/1170754984447594676/CTA_1.png?ex=655a318b&is=6547bc8b&hm=359384595b4c198d57738022705f7c71cfa0874541be2444ed74aeec989b5982&=&width=1440&height=217"
          className="absolute z-[-1] h-full w-full object-cover object-center inset-0 "
        />
        <div className="relative self-center flex mb-0 w-36 max-w-full flex-col max-md:mb-2.5 font-DMSans">
          <a
            href="/login"
            className=" text-xl self-center mt-6 text-center rounded-[64px] w-fit h-fit text-teal-600  px-4 py-3 font-semibold bg-white shadow-sm hover:bg-teal-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Book Now
          </a>
        </div>
      </div>
      <div className="items-center bg-orange-50 flex w-full flex-col p-20 max-md:max-w-full max-md:px-5">
        <div className="justify-between w-[1224px] max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-[28%] max-md:w-full max-md:ml-0">
              <div className="items-stretch flex flex-col mt-2 max-md:mt-10">
                <div className="text-black text-4xl leading-10 backdrop-blur-[2px] whitespace-nowrap font-Belleza">
                  TOAA-NIUNG
                </div>
                <div className="text-neutral-600 text-base leading-5 mt-6 font-DMSans">
                  Customers can make reservations and queue online, it is
                  convenient and simple for customers.
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[72%] ml-5 max-md:w-full max-md:ml-0">
              <div className="items-center flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap max-md:mt-10">
                <div className="text-neutral-800 text-center text-base  grow shrink basis-auto mx-auto font-DMSans">
                  Open every day, Monday - Friday, 10:00 a.m. - 9:00 p.m.
                </div>
                <div className="items-stretch self-stretch flex grow basis-[0%] flex-col font-DMSans">
                  <div className="text-neutral-800  text-base leading-5 whitespace-nowrap">
                    Email:{" "}
                    <a href="mailto:dechawat357@gmail.com" target="_blank">
                      dechawat357@gmail.com
                    </a>
                  </div>
                  <div className="text-neutral-800  text-base leading-5 whitespace-nowrap mt-2">
                    Address: 123 Main Street, Cityville, CA 12345
                  </div>
                  <div className="text-neutral-800  text-base leading-5 whitespace-nowrap mt-2">
                    Phone: (123) 456-7890
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="justify-between items-center flex w-[1224px] max-w-full gap-5 mt-20 max-md:flex-wrap max-md:mt-10">
          <div className="text-neutral-600 text-sm leading-4 grow shrink basis-auto my-auto font-DMSans">
            © TOAA-NIUNG 2023. Make a restaurant reservation
          </div>
          <div className="items-center self-stretch flex justify-between gap-4">
            <div className="text-neutral-600 text-sm leading-4 my-auto font-DMSans">
              Contact :
            </div>
            <div className="items-stretch self-stretch flex gap-2 max-md:justify-center">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/617e24d4-0ca5-438c-b85a-7e61069ee0ff?"
                className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b02bd5df-db8f-428a-ab57-0691c4385f59?"
                className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/252303ef-ef8c-4ced-b120-f11f695c4ad8?"
                className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
