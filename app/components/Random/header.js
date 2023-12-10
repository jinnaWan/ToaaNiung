import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

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
    <div className="justify-center items-center bg-neutral-700 self-stretch flex w-full flex-col flex-wrap px-5 py-10 ">
      <div className="items-stretch flex w-[1224px]  justify-between gap-5 py-0.5 flex-wrap">
        <div className="flex items-center gap-3.5">
          <a href="#" className="flex items-center">
            <img
              loading="lazy"
              srcSet="https://cdn.discordapp.com/attachments/1170752491944677567/1175513295504027739/Logoggez.png?ex=656b8111&is=65590c11&hm=164e1aaaa76c6e1fcc3d450539feb7947c475ca5706f9c577b9351027d79affb&"
              className="object-contain object-center w-14 max-w-full"
            />
            <div className="pl-4 font-extrabold  tracking-[3.48px] self-stretch whitespace-nowrap mt-0.5 text-white text-center text-3xl leading-10 font-Belleza">
              TOAA-NIUNG
            </div>
          </a>
        </div>
        <div className="items-start flex justify-between gap-5 max-md:justify-center font-DMSans">
          <a
            href="/"
            className="text-white text-base font-medium leading-5 whitespace-nowrap my-auto "
          >
            Home
          </a>
          <a
            href="#"
            className="text-white text-base font-medium leading-5 self-center my-auto border-b-white border-b-4 border-solid"
          >
            Reservation
          </a>
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
      </div>
    </div>
  );
}
