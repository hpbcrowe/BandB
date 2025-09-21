"use client";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

export const TagContext = createContext();

export const TagProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [updatingTag, setUpdatingTag] = useState(null);

  /**
   * Function to create a new tag
   * This function will handle the creation of a new tag by sending a POST request to the server
   * It will also handle any errors that may occur during the process and display appropriate messages to the user.
   *  * @returns {Promise<void>}
   * @throws Will throw an error if the tag creation fails
   */
  const createTag = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/tag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, parentCategory }),
      });
      // Check if the response is ok (status in the range 200-299)
      const data = await response.json();
      if (!response.ok) {
        toast.error(data || "Failed to create tag");
      } else {
        toast.success("Tag created successfully");
        // Reset the name and parent category fields
        setName("");
        // Reset parent category
        setParentCategory("");
        // Update the tags state with the new tag
        // Assuming tags is an array of tag objects
        //This took me forever to figure out why my new tag wasn't showing up in the list after creation
        // I forgot to update the tags state with the new tag
        // Now the new tag will appear in the list immediately after creation
        // it was this  setTags([data, ...tags]);
        setTags((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error(err);
      // Display an error message to the user
      toast.error("Error creating tag");
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/tag`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data || "Failed to fetch tags");
      } else {
        setTags(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating tag");
    }
  };

  const updateTag = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/tag/${updatingTag?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatingTag),
        }
      );
      const data = await response.json();
      // Check if the response is ok (status in the range 200-299)
      // If the response is not ok, display an error message
      if (!response.ok) {
        toast.error(data || "Failed to update tag");
      } else {
        toast.success("Tag updated successfully");
        // Reset the updatingTag state
        setUpdatingTag(null);
        setParentCategory("");
        setTags((prevTags) =>
          prevTags?.map((tag) => (tag._id === data._id ? data : tag))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating tag");
    }
  };

  const deleteTag = async () => {
    try {
      const reponse = await fetch(
        `${process.env.API}/admin/tag/${updatingTag?._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await reponse.json();
      if (!reponse.ok) {
        toast.error(data || "Failed to delete tag");
      } else {
        toast.success("Tag deleted successfully");
        // Reset the updatingTag state
        setUpdatingTag(null);
        setParentCategory("");
        // Update the tags state by filtering out the deleted tag
        setTags((prevTags) => prevTags?.filter((tag) => tag._id !== data._id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting tag");
    }
  };
  return (
    <TagContext.Provider
      value={{
        name,
        setName,
        parentCategory,
        setParentCategory,
        tags,
        setTags,
        updatingTag,
        setUpdatingTag,
        createTag,
        fetchTags,
        updateTag,
        deleteTag,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

export const useTag = () => useContext(TagContext);
