import { Link, useNavigate, useParams } from "react-router";
// import { stories } from "../components/stories";
import { useEffect, useMemo, useState } from "react";
import { Story as StoryValue } from "../types";

export default function Stories() {
  const params = useParams();
  const activeStoryId = params.id;
  const activeStoryIdNum = parseInt(activeStoryId ?? "");
  const navigate = useNavigate();

  const stories: Array<StoryValue> = useMemo(
    () => JSON.parse(localStorage.getItem("stories") ?? "[]") ?? [],
    []
  );

  useEffect(() => {
    if (!activeStoryId) return;
    const timeout = setTimeout(() => {
      const currentIndex = stories.findIndex(
        (story) => story.id === parseInt(activeStoryId)
      );
      const hasNext = currentIndex + 1 < stories.length;

      if (hasNext && activeStoryId) {
        console.log(`/stories/${stories[currentIndex].id}`);
        navigate(`/stories/${stories[currentIndex + 1].id}`);
      } else {
        navigate("/");
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [activeStoryId, activeStoryIdNum, navigate, stories]);

  if (!activeStoryId) {
    return <h1>Error Loading Story!</h1>;
  }

  return (
    <div className="flex gap-x-4 px-[2rem] h-screen max-w-full mx-auto items-center overflow-x-scroll snap-x snap-mandatory snap-start">
      {stories.map((story) => (
        <Link to={`/stories/${story.id}`} key={story.id}>
          <div
            className={`${
              activeStoryIdNum === story.id
                ? "h-[22rem] w-[16rem]"
                : "h-[18rem] w-[12rem]"
            } shrink-0 rounded-sm relative flex flex-col gap-y-5`}
          >
            {activeStoryIdNum === story.id && <ActiveProgressBar />}
            {activeStoryIdNum !== story.id && (
              <div className="absolute z-10 rounded-sm inset-0 bg-black/50"></div>
            )}
            <img
              className="absolute h-full top-0 bottom-0 left-0 right-0 object-cover"
              src={story.name}
              alt={story.name || "Story"}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

function ActiveProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[5px] w-full absolute -top-3 rounded-md bg-white/15 overflow-hidden">
      <div
        style={{ width: `${progress}%` }}
        className="absolute inset-y-0 bg-white"
      ></div>
    </div>
  );
}
