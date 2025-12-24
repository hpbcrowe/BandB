"use client";

import { useEffect } from "react";

import { priceRanges } from "@/utils/filterData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Stars from "@/components/product/Stars";
import { useCategory } from "@/context/category";
import { useTag } from "@/context/tag";

export default function ProductFilter({ searchParams }) {
  const pathname = "/shop/";
  const { minPrice, maxPrice, ratings, category, tag, brand } = searchParams;

  //context
  const { fetchCategoriesPublic, categories } = useCategory();
  const { fetchTagsPublic, tags } = useTag();

  useEffect(() => {
    fetchCategoriesPublic();
    fetchTagsPublic();
  }, []);

  const activeButton = "btn btn-primary btn-raised mx-1 rounded-pill";
  const button = "btn  btn-raised mx-1 rounded-pill";

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

      <p className="mt-4 alert alert-primary">Ratings</p>
      <div className="row d-flex align-items-center mx-1">
        {[5, 4, 3, 2, 1]?.map((ratingValue) => {
          const isActive = String(ratings) === String(ratingValue);
          const url = {
            pathname,
            query: {
              ...searchParams,
              ratings: ratingValue,
              page: 1,
            },
          };

          return (
            <div key={ratingValue}>
              {" "}
              <Link
                href={url}
                className={
                  isActive
                    ? "btn btn-primary btn-raised mx-1 rounded-pill"
                    : "btn btn-raised mx-1 rounded-pill"
                }
              >
                <Stars rating={ratingValue} />
              </Link>
              {isActive && (
                <span
                  onClick={() => handleRemoveFilter(["ratings"])}
                  className="pointer"
                >
                  X
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 alert alert-primary">Categories</p>
      <div className="row d-flex align-items-center mx-1 filter-scroll">
        {categories?.map((c) => {
          const isActive = category === c._id;

          const url = {
            pathname,
            query: {
              ...searchParams,
              category: c?._id,
              page: 1,
            },
          };

          return (
            <div key={c?._id}>
              {" "}
              <Link href={url} className={isActive ? activeButton : button}>
                {c?.name}
              </Link>
              {isActive && (
                <span
                  onClick={() => handleRemoveFilter(["category"])}
                  className="pointer"
                >
                  X
                </span>
              )}
            </div>
          );
        })}
      </div>

      {category && (
        <>
          <p className="mt-4 alert alert-primary">Tags</p>
          <div className="row d-flex align-items-center mx-1 filter-scroll">
            {tags
              ?.filter((t) => t?.parentCategory === category)
              ?.map((t) => {
                const isActive = tag === t._id;

                const url = {
                  pathname,
                  query: {
                    ...searchParams,
                    tag: t?._id,
                    page: 1,
                  },
                };

                return (
                  <div key={t?._id}>
                    {" "}
                    <Link
                      href={url}
                      className={isActive ? activeButton : button}
                    >
                      {t?.name}
                    </Link>
                    {isActive && (
                      <span
                        onClick={() => handleRemoveFilter(["tag"])}
                        className="pointer"
                      >
                        X
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </>
      )}

      {<pre>{/*JSON.stringify(tags, null, 4)*/}</pre>}
    </div>
  );
}
