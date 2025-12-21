"use client";

import { priceRanges } from "@/utils/filterData";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductFilter({ searchParams }) {
  const pathname = "/shop/";
  const { minPrice, maxPrice, ratings, category, tag, brand } = searchParams;
  const activeButton = "btn btn-primary btn-raised mx-1 rounded-pill";
  const button = "btn btn-secondary btn-raised mx-1 rounded-pill";

  const router = useRouter();

  const handleRemoveFilter = (filterName) => {
    const updatedSearchParams = { ...searchParams };
    //delete updatedSearchParams[filterName];
    // if filterName is string
    if (typeof filterName === "string") {
      delete updatedSearchParams[filterName];
    }
    //if filterName is an array of filter names, remove all of them

    if (Array.isArray(filterName)) {
      filterName.forEach((name) => {
        delete updatedSearchParams[name];
      });
    }
    // Update the URL with the new search parameters
    // This would typically involve using a router or history API
    //reset page to 1 when updating new filtering options
    updatedSearchParams.page = 1;
    const queryString = new URLSearchParams(updatedSearchParams).toString();
    const newUrl = `${pathname}?${queryString}`;
    // For example, using Next.js router:
    // router.push(newUrl);
    router.push(newUrl);
  };

  return (
    <div>
      <p className="lead">Filter Products</p>
      <Link className="text-danger" href="/shop">
        Clear Filters
      </Link>
      <p className="mt-4 alert alert-primary">Price</p>
      <div className="row d-flex align-items-center mx-1">
        {priceRanges?.map((range) => {
          const url = {
            pathname,
            query: {
              ...searchParams,
              minPrice: range?.min,
              maxPrice: range?.max,
              page: 1,
            },
          };
          const isActive =
            minPrice === String(range?.min) && maxPrice === String(range?.max);
          // Generate a unique key for each range
          // use a stable scalar key; prefer label, fall back to min-max
          const key = range?.label ?? `${range?.min ?? 0}-${range?.max ?? 0}`;
          return (
            <div key={range?.label}>
              {" "}
              <Link
                key={key}
                href={url}
                className={isActive ? activeButton : button}
              >
                {range?.label}
              </Link>
              {isActive && (
                <span
                  onClick={() => handleRemoveFilter(["minPrice", "maxPrice"])}
                  className="pointer"
                >
                  X
                </span>
              )}
            </div>
          );
        })}
      </div>
      <pre>{JSON.stringify(searchParams, null, 4)}</pre>
    </div>
  );
}
