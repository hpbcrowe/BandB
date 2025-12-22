"use client";
import { useEffect } from "react";
import { useTag } from "@/context/tag";

/**
 *  TagList component to display a list of tags.
 * @returns   {JSX.Element}
 */
export default function TagList() {
  const { tags, fetchTags, setUpdatingTag } = useTag();
  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <>
      <h4>{console.log(tags)}</h4>
      {Array.isArray(tags) &&
        tags?.map((t) => (
          <button className="btn" key={t._id} onClick={() => setUpdatingTag(t)}>
            {t.name}
          </button>
        ))}
    </>
  );
}
