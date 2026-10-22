import React, { useState, useEffect, createContext, useContext } from 'react';
import { AuthService } from '../services/authService';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

const toAppPath = (pathname: string): string => {
  if (basePath && pathname.startsWith(basePath)) {
    return pathname.slice(basePath.length) || '/';
  }
  return pathname || '/';
};

const toBrowserPath = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}` || '/';
};

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
}

interface RouterContextType {
  path: string;
  params: Record<string, string>;
  navigate: (to: string) => void;
  replace: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  params: {},
  navigate: () => {},
  replace: () => {},
});

export const useRouter = () => useContext(RouterContext);

export function matchPath(pattern: string, pathname: string): { matches: boolean; params: Record<string, string> } {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const pPart = patternParts[i];
    const aPart = pathParts[i];

    if (pPart.startsWith(':')) {
      const paramName = pPart.slice(1);
      params[paramName] = aPart;
    } else if (pPart !== aPart) {
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return toAppPath(window.location.pathname);
    }
    return '/';
  });

  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(toAppPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      const browserPath = toBrowserPath(to);
      if (window.location.pathname !== browserPath) {
        window.history.pushState({}, '', browserPath);
        setCurrentPath(to);
      }
    }
  };

  const replace = (to: string) => {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', toBrowserPath(to));
      setCurrentPath(to);
    }
  };

  return (
    <RouterContext.Provider value={{ path: currentPath, params, navigate, replace }}>
      {children}
    </RouterContext.Provider>
  );
};
