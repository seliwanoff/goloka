"use client";

import React, { Fragment, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { classMerge } from "@/lib/utils";

type ComponentProps = {};

const CustomBreadCrumbs: React.FC<ComponentProps> = ({}) => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  useEffect(() => {
    // ~ ======= extract paths from pathname into array -->
    setCurrentPath(() => pathname.split("/").filter(Boolean));
  }, [pathname]);

  return (
    <div className="hidden w-full py-1 lg:block">
      <Breadcrumb>
        <BreadcrumbList>
          {currentPath.map((path, idx) => {
            const route = currentPath
              // ~ ======= create routes for each item in bread crumb -->
              .map((path, pathIdx) => (pathIdx <= idx ? path : ""))
              .join("/");
            return (
              <Fragment key={idx}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/${route}`}
                    className={classMerge(
                      "cursor-pointer",
                      idx + 1 === currentPath.length &&
                        "font-semibold text-primary",
                    )}
                  >
                    {path}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {/* -- don't show separator for last item */}
                {idx + 1 < currentPath.length && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default CustomBreadCrumbs;
