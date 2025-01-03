import { Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { imageToBase64 } from "../utils/image-to-base64";
import { Story as StoryValue } from "../types";
import { formatDistance } from "date-fns";

// Function to filter items
function removeOldItems(items: StoryValue[]): StoryValue[] {
  const now = Date.now();
  const cutoffTime = now - 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  return items.filter((item) => new Date(item.date).getTime() >= cutoffTime);
}

export default function Stories() {
  const [stories, setStories] = useState<Array<StoryValue>>([]);

  // Load stories from localStorage on initial render
  useEffect(() => {
    const storedStories = JSON.parse(localStorage.getItem("stories") ?? "[]");
    if (storedStories && storedStories?.length > 0) {
      // remove expired stories
      setStories(removeOldItems(storedStories));
      localStorage.setItem("stories", JSON.stringify(storedStories));
    }
    return () => {
      setStories([]);
    };
  }, []);

  // Update localStorage whenever stories state changes
  const handleAddStory = (newStory: StoryValue) => {
    const updatedStories = [newStory, ...stories];
    setStories(updatedStories);
    localStorage.setItem("stories", JSON.stringify(updatedStories));
  };

  return (
    <div className="flex shadow-sm p-3 gap-x-2 overflow-x-scroll no-scrollbar overflow-y-hidden">
      <AddNew onAddStory={handleAddStory} />
      {stories.map((story) => (
        <Story key={story.id} {...story} />
      ))}
    </div>
  );
}

function Story({ name, id, date }: StoryValue) {
  return (
    <div className="flex flex-col gap-y-2 items-center">
      <NavLink to={`/stories/${id}`}>
        <div className="cursor-pointer h-16 w-16 relative overflow-hidden flex justify-center items-center shrink-0 rounded-full border-[2px] border-white/60 duration-300 hover:scale-110">
          <img
            className="object-cover rounded-full h-full w-full p-[2.5px]"
            src={name}
            alt="Story Image Thumbnail"
          />
        </div>
      </NavLink>
      <p className="text-xs">
        {formatDistance(date, new Date(), {
          addSuffix: false,
        })}
      </p>
    </div>
  );
}

function AddNew({
  onAddStory,
}: {
  onAddStory: (newStory: StoryValue) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64String = await imageToBase64(file);
        const newStory = {
          id: new Date().getTime(),
          name: base64String,
          viewed: false,
          date: new Date(),
        };

        // Add new story
        onAddStory(newStory);
      } catch (error) {
        console.error("Error converting image to Base64:", error);
      }
    }
  };

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        className=" cursor-pointer h-16 w-16 flex justify-center items-center shrink-0 rounded-full border-[2px] border-white/40 border-dashed hover:scale-110 duration-200"
      >
        <Plus className="text-white/40 font-bold" />
      </div>

      <input
        onChange={onUpload}
        ref={inputRef}
        type="file"
        hidden
        accept="image/*"
      />
    </>
  );
}
