import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const AuthRouteGuard = ({ children }) => {
  const { data: session } = useSession();
  const isInitialMount = useRef(true);
  const getCurrentDateTime = () => {
    const now = new Date();
    const thailandOffset = 7 * 60; // Thailand is UTC+7
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const thailandTime = new Date(utcTime + thailandOffset * 60000);

    const year = thailandTime.getFullYear();
    const month = `${thailandTime.getMonth() + 1}`.padStart(2, "0");
    const day = `${thailandTime.getDate()}`.padStart(2, "0");
    const hours = `${thailandTime.getHours()}`.padStart(2, "0");
    const minutes = `${thailandTime.getMinutes()}`.padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const sendThailandTimeToDatabase = async () => {
    try {
      const thailandTime = getCurrentDateTime();
      // Assuming you have an API endpoint to receive the time data
      await axios.post('/api/cron', { thailandTime });
      console.log('Thailand time sent to the database:', thailandTime);
    } catch (error) {
      console.error('Error sending Thailand time to the database:', error);
    }
  };

  useEffect(() => {
    if (!isInitialMount.current) {
      const timer = setInterval(() => {
        sendThailandTimeToDatabase(); // Send Thailand time to the database every minute
      }, 60000); // Send data every minute (60000 milliseconds)

      return () => clearInterval(timer);
    }

    isInitialMount.current = false;

    return undefined; // No cleanup needed for the initial mount
  }, []);

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
