import React, { createContext, useContext, useState, useEffect } from "react";
import { adminCredentials } from "../data/adminCredentials";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminCredential, setAdminCredential] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user");
    const savedAdminCred = localStorage.getItem("adminCredential");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAdminCred) {
      setAdminCredential(JSON.parse(savedAdminCred));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password, otp = null, adminRole = null) => {
    try {
      setLoading(true);

      // Admin login
      if (adminRole) {
        const credential = adminCredentials.find(
          (cred) => cred.email.toLowerCase() === email.toLowerCase() && cred.role === adminRole
        );

        if (!credential || credential.password !== password) {
          throw new Error("Invalid admin credentials");
        }

        const adminUser = {
          id: credential.id,
          name: credential.name,
          email: credential.email,
          role: credential.role,
          isAdmin: true,
        };

        // Log admin access
        const adminLog = {
          timestamp: new Date().toISOString(),
          adminName: credential.name,
          adminEmail: credential.email,
          action: "Admin Login",
          ipAddress: "127.0.0.1",
        };

        const existingLogs = JSON.parse(localStorage.getItem("admin_logs") || "[]");
        existingLogs.push(adminLog);
        localStorage.setItem("admin_logs", JSON.stringify(existingLogs));

        setUser(adminUser);
        setAdminCredential(credential);
        localStorage.setItem("user", JSON.stringify(adminUser));
        localStorage.setItem("adminCredential", JSON.stringify(credential));
        
        return adminUser;
      }

      // Student login simulation
      if (email && password) {
        const studentUser = {
          id: "student_" + Date.now(),
          name: "Student User",
          email: email,
          role: "student",
          studentId: "DBU-2024-001",
          isAdmin: false,
        };

        setUser(studentUser);
        localStorage.setItem("user", JSON.stringify(studentUser));
        
        return studentUser;
      }

      throw new Error("Invalid credentials");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Simulate Google login
      const googleUser = {
        id: "google_" + Date.now(),
        name: "Google User",
        email: "user@gmail.com",
        role: "student",
        isAdmin: false,
      };

      setUser(googleUser);
      localStorage.setItem("user", JSON.stringify(googleUser));
      
      return googleUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAdminCredential(null);
    localStorage.removeItem("user");
    localStorage.removeItem("adminCredential");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    adminCredential,
    loading,
    login,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};