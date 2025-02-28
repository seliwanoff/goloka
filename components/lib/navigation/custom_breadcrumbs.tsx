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
  const [displayPath, setDisplayPath] = useState<string[]>([]); // Only shows last 2 segments

  useEffect(() => {
    const paths = pathname.split("/").filter(Boolean);
    setCurrentPath(paths); // Store full path as an array
    setDisplayPath(paths.slice(-2)); // Display only last 2 segments
  }, [pathname]);

  return (
    <div className="hidden w-full py-1 lg:block">
      <Breadcrumb>
        <BreadcrumbList>
          {displayPath.map((path, idx) => {
            const route = currentPath
              .slice(0, currentPath.length - displayPath.length + idx + 1)
              .join("/"); // Create correct route link

            return (
              <Fragment key={idx}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/${route}`}
                    className={classMerge(
                      "cursor-pointer",
                      idx + 1 === displayPath.length &&
                        "font-semibold text-blue-600",
                    )}
                  >
                    {path}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {/* Don't show separator for last item */}
                {idx + 1 < displayPath.length && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default CustomBreadCrumbs;
