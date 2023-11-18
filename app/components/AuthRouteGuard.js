import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

const AuthRouteGuard = ({ children }) => {
  const { data: session } = useSession();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const protectedRoutesLoggedIn = ['/login', '/register'];
      const protectedRoutesLoggedOut = ['/findtable', '/admin', '/confirmbooking', '/myprofile'];
      const protectedRoutesAdmin = ['/admin'];

      if (session) {
        if (protectedRoutesLoggedIn.includes(window.location.pathname)) {
          window.location.href = '/findtable'; // Redirect logged-in users from login/register pages
        }
        if (protectedRoutesAdmin.includes(window.location.pathname) && !session.user.isAdmin) {
          window.location.href = '/findtable';
        }
      } else {
        if (protectedRoutesLoggedOut.includes(window.location.pathname)) {
          window.location.href = '/login'; // Redirect logged-out users from protected routes
        }
      }
    }, 800); // Adjust the delay time as needed (500 milliseconds)

    return () => clearTimeout(timer);
  }, [session]);

  return children;
};

export default AuthRouteGuard;
