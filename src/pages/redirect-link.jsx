import { getLongUrl } from "@/db/apiUrls";
import { storeClicks } from "@/db/apiClicks";
import useFetch from "@/hooks/use-fetch";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
 
  const { id } = useParams(); 
  const {loading, data, error, fn} = useFetch(getLongUrl, { id });


 useEffect(() => {
  console.log("📡 Fetching long URL...");
    fn(); 
  }, []);

  const hasTracked = useRef(false); 

useEffect(() => {
  if (!loading && data?.original_url && !hasTracked.current) {
    hasTracked.current = true; // prevent double insertions

    (async () => {
      try {
        await storeClicks({
          id: data.id,
          originalUrl: data.original_url,
        });
      } catch (err) {
        console.error("Click tracking failed:", err);
      } finally {
        console.log("➡️ Redirecting to:", data.original_url);
        setTimeout(() => {
          console.log("➡️ Delayed redirect...");
          window.location.href = data.original_url;
        }, 1000);
      }
    })();
  } else if (!loading && !data) {
    console.warn("No long URL found for this ID.");
  }
}, [loading, data]);
  if (loading){
    return (
      <>
      <BarLoader width = {"100%"} color="#36d7b7" />
      <br />
      Redirecting...
      </>
    );
  }

  return null;
};

export default RedirectLink;