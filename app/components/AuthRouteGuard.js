import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const AuthRouteGuard = ({ children, protectedRoutes }) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (protectedRoutes.includes(window.location.pathname)) {
        window.location.href = '/findtable';
      }
    }
  }, [session]);

  return children;
};

export default AuthRouteGuard;
