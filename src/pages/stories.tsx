import { NavLink, useNavigate, useParams } from "react-router";
// import { stories } from "../components/stories";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Story as StoryValue } from "../types";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Stories() {
  const params = useParams();
  const activeStoryId = params.id;
  const activeStoryIdNum = parseInt(activeStoryId ?? "");
  const navigate = useNavigate();

  const stories: Array<StoryValue> = useMemo(
    () => JSON.parse(localStorage.getItem("stories") ?? "[]") ?? [],
    []
  );

  const findNext = useCallback(() => {
    if (!activeStoryId) return null;
    const currentIndex = stories.findIndex(
      (story) => story.id === parseInt(activeStoryId)
    );
    const hasNext = currentIndex + 1 < stories.length;
    if (hasNext) {
      return stories[currentIndex + 1].id;
    }
    return null;
  }, [activeStoryId, stories]);

  const findPrev = useCallback(() => {
    if (!activeStoryId) return null;
    const currentIndex = stories.findIndex(
      (story) => story.id === parseInt(activeStoryId)
    );
    if (currentIndex < 0) return null;
    const hasPrev = currentIndex >= 0 && stories.length > 0;
    if (hasPrev) {
      return stories[currentIndex - 1]?.id;
    }
    return null;
  }, [activeStoryId, stories]);

  const nextStoryId = findNext();
  const prevStoryId = findPrev();

  useEffect(() => {
    if (!activeStoryId) return;
    const timeout = setTimeout(() => {
      if (nextStoryId) {
        navigate(`/stories/${nextStoryId}`);
      } else {
        navigate("/");
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [activeStoryId, navigate, nextStoryId]);

  if (!activeStoryId) {
    return <h1>Error Loading Story!</h1>;
  }

  return (
    <div className="flex flex-col gap-4 px-4 sm:px-[2rem] justify-center h-screen md:max-w-6xl mx-auto items-center">
      <div className="w-full flex gap-2">
        {stories.map((story) => (
          <ActiveProgressBar
            key={story.id}
            storyId={story.id}
            activeStoryId={activeStoryIdNum}
          />
        ))}
      </div>
      <NavLink
        className={`${
          !prevStoryId ? "opacity-0" : "opacity-100"
        } text-white absolute left-0 h-10 w-10 z-20 bg-black/60 rounded-full shrink-0 flex justify-center items-center`}
        to={`/stories/${prevStoryId}`}
      >
        <ChevronLeft />
      </NavLink>

      {stories.map((story) => (
        <div
          key={story.id}
          className={` ${activeStoryIdNum === story.id ? "block" : "hidden"}
          h-[calc(100vh-200px)] w-full sm:w-[500px] rounded-sm relative flex flex-col gap-y-5  ${
            activeStoryIdNum === story.id ? "w-[700px]" : "w-[200px]"
          }`}
        >
          <img
            className={`absolute h-full w-full top-0 bottom-0 left-0 right-0 object-cover`}
            src={story.name}
            alt={story.name || "Story"}
          />
        </div>
      ))}
      <NavLink
        to={`/stories/${nextStoryId}`}
        className={`${
          !nextStoryId ? "opacity-0" : "opacity-100"
        } text-white absolute right-0 h-10 w-10 z-20 bg-black/60 rounded-full shrink-0 flex justify-center items-center`}
      >
        <ChevronRight />
      </NavLink>
      <NavLink
        className="fixed top-5 right-5 text-white hover:text-white/50"
        to={"/"}
      >
        <X className="size-7" />
      </NavLink>
    </div>
  );
}

function ActiveProgressBar({
  activeStoryId,
  storyId,
}: {
  storyId: number;
  activeStoryId: number;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (storyId !== activeStoryId) return;
    const duration = 3000; // Total duration in milliseconds
    const interval = 10; // Update every 10 milliseconds
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + increment;
        if (nextProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return nextProgress;
      });
    }, interval);

    return () => {
      clearInterval(timer);
      setProgress(0);
    };
  }, [activeStoryId, storyId]);

  return (
    <div className="h-[5px] w-full relative rounded-md bg-white/15 overflow-hidden">
      <div
        style={{ width: `${progress}%` }}
        className="absolute inset-y-0 bg-white"
      ></div>
    </div>
  );
}
