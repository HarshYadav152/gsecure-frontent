// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [sessionTime, setSessionTime] = useState(180); // 3 minutes in seconds
  const [showTimer, setShowTimer] = useState(false);
  const timerRef = useRef(null);
  
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Try to get current user from your API
        const response = await fetch(`${import.meta.env.VITE_APP_HOST}/gs/api/v1/users/getme`, {
          credentials: 'include' // Important for cookies
        });
        
        const data = await response.json();
        console.log("Auth user : ",data)
        if (response.ok) {
          setUser(data.data); // Set user data from the response
          setShowTimer(true); // Show timer when user is logged in
          startSessionTimer();
        } else {
          // If API request fails, clear user data
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserStatus();
    return () => {
      // Clean up timer on unmount
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startSessionTimer = () => {
    // Reset session time to 3 minutes (180 seconds)
    setSessionTime(180);
    
    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Start new timer that decrements the session time every second
    timerRef.current = setInterval(() => {
      setSessionTime(prevTime => {
        if (prevTime <= 1) {
          // Time's up, clear the timer and reload the page
          clearInterval(timerRef.current);
          window.location.reload();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Format the time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  // logout function
  const logout = async () => {
    try {
      // Optional: Make an API call to log out the user
      await fetch(`${import.meta.env.VITE_APP_HOST}/gs/api/v1/users/logout`, {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });

      // Clear user state and localStorage
      setUser(null);
      setShowTimer(false);
      localStorage.removeItem('accessToken');

      if (timerRef.current) clearInterval(timerRef.current);

      // Redirect to the welcome page
      navigate('/welcome');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading,isAuthenticated: !!user,logout,
      showTimer,
      sessionTimeFormatted: formatTime(sessionTime),
      resetSessionTimer: startSessionTimer
     }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);