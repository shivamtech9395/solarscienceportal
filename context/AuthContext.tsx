'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee } from '@/types';

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  isSuperAdmin: boolean;
}

interface AuthContextType {
  isAdminAuthenticated: boolean;
  adminUser: AdminUser | null;
  loginAdmin: (emailOrUser: string, password: string) => boolean;
  logoutAdmin: () => void;

  currentEmployee: Employee | null;
  loginEmployee: (phone: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logoutEmployee: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permanent Super Admin Credentials
const PERMANENT_SUPER_ADMIN = {
  email: 'aetherovate2047@gmail.com',
  password: 'shivam@2047',
  name: 'Super Admin',
  role: 'Master Administrator'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const adminAuth = localStorage.getItem('solar_admin_auth');
      const adminData = localStorage.getItem('solar_admin_data');
      if (adminAuth === 'true' && adminData) {
        setIsAdminAuthenticated(true);
        setAdminUser(JSON.parse(adminData));
      }

      const empData = localStorage.getItem('solar_employee_user');
      if (empData) {
        setCurrentEmployee(JSON.parse(empData));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAdmin = (emailOrUser: string, password: string): boolean => {
    const cleanUser = emailOrUser.trim().toLowerCase();

    // 1. Check Permanent Master Super Admin
    if (
      (cleanUser === PERMANENT_SUPER_ADMIN.email.toLowerCase() ||
       cleanUser === 'aetherovate2047' ||
       cleanUser === 'admin') &&
      password === PERMANENT_SUPER_ADMIN.password
    ) {
      const user: AdminUser = {
        email: PERMANENT_SUPER_ADMIN.email,
        name: PERMANENT_SUPER_ADMIN.name,
        role: PERMANENT_SUPER_ADMIN.role,
        isSuperAdmin: true
      };
      setIsAdminAuthenticated(true);
      setAdminUser(user);
      localStorage.setItem('solar_admin_auth', 'true');
      localStorage.setItem('solar_admin_data', JSON.stringify(user));
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('solar_admin_auth');
    localStorage.removeItem('solar_admin_data');
  };

  const loginEmployee = async (phone: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/employees');
      if (!res.ok) throw new Error('Failed to load employee records');
      const employees: Employee[] = await res.json();

      const cleanPhone = phone.replace(/\D/g, '');
      const emp = employees.find(
        (e) => e.phone.replace(/\D/g, '') === cleanPhone
      );

      if (!emp) {
        return { success: false, error: 'Mobile number not registered in staff directory.' };
      }

      if (emp.pin && emp.pin !== pin) {
        return { success: false, error: 'Invalid 4-digit PIN.' };
      }

      setCurrentEmployee(emp);
      localStorage.setItem('solar_employee_user', JSON.stringify(emp));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed. Please check credentials.' };
    }
  };

  const logoutEmployee = () => {
    setCurrentEmployee(null);
    localStorage.removeItem('solar_employee_user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminUser,
        loginAdmin,
        logoutAdmin,
        currentEmployee,
        loginEmployee,
        logoutEmployee,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
