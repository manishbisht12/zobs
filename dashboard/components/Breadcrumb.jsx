"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { IoIosArrowForward } from "react-icons/io";

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Convert pathname to breadcrumb items
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    
    // Check if this is an employer or admin route
    const isEmployerRoute = paths.includes('employer');
    const isAdminRoute = paths.includes('admin');
    
    let breadcrumbs = [];
    let filteredPaths = [];
    
    if (isEmployerRoute) {
      breadcrumbs = [{ name: 'Dashboard', path: '/dashboard' }, { name: 'Employer', path: '/employer/dashboard' }];
      // Filter out 'dashboard' and 'employer' from paths
      filteredPaths = paths.filter(path => path !== 'dashboard' && path !== 'employer');
      
      if (filteredPaths.length === 0) {
        breadcrumbs[1].isLast = true;
        return breadcrumbs;
      }
      
      filteredPaths.forEach((path, index) => {
        const capitalizedPath = path.charAt(0).toUpperCase() + path.slice(1);
        const fullPath = '/employer/' + filteredPaths.slice(0, index + 1).join('/');
        breadcrumbs.push({
          name: capitalizedPath,
          path: fullPath,
          isLast: index === filteredPaths.length - 1
        });
      });
    } else if (isAdminRoute) {
      breadcrumbs = [{ name: 'Dashboard', path: '/dashboard' }, { name: 'Admin', path: '/admin/dashboard' }];
      // Filter out 'dashboard' and 'admin' from paths
      filteredPaths = paths.filter(path => path !== 'dashboard' && path !== 'admin');
      
      if (filteredPaths.length === 0) {
        breadcrumbs[1].isLast = true;
        return breadcrumbs;
      }
      
      filteredPaths.forEach((path, index) => {
        const capitalizedPath = path.charAt(0).toUpperCase() + path.slice(1);
        const fullPath = '/admin/' + filteredPaths.slice(0, index + 1).join('/');
        breadcrumbs.push({
          name: capitalizedPath,
          path: fullPath,
          isLast: index === filteredPaths.length - 1
        });
      });
    } else {
      breadcrumbs = [{ name: 'Zobs', path: '/dashboard' }];
      // Filter out 'dashboard' from the paths
      filteredPaths = paths.filter(path => path !== 'dashboard');
      
      if (filteredPaths.length === 0) {
        breadcrumbs[0].isLast = true;
        return breadcrumbs;
      }
      
      filteredPaths.forEach((path, index) => {
        const capitalizedPath = path.charAt(0).toUpperCase() + path.slice(1);
        const fullPath = '/dashboard/' + filteredPaths.slice(0, index + 1).join('/');
        breadcrumbs.push({
          name: capitalizedPath,
          path: fullPath,
          isLast: index === filteredPaths.length - 1
        });
      });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="mb-6">
      <ol className="flex items-center text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <IoIosArrowForward className="mx-3 text-gray-400" />
            )}
            {breadcrumb.isLast ? (
              <span className="text-gray-500">{breadcrumb.name}</span>
            ) : (
              <Link 
                href={breadcrumb.path} 
                className="text-gray-900 hover:text-gray-700 transition-colors"
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

