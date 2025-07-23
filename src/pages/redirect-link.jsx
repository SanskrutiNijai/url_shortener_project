import { getLongUrl, storeClicks } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams(); // ✅ only this line

  console.log("🧭 URL Param id:", id); // ✅ debugging output

  //const {id} = useParams();

  const {loading, data, fn} = useFetch(getLongUrl, { id });

  const {loading: loadingStats, fn: fnStats} = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.["original-url"],
  });

  useEffect(() => {
    fn()
  }, [])

  useEffect(() => {
    /* if(!loading && data){
      console.log("Calling storeClicks", data);
      fnStats();
    }*/ 
   if (!loading && data) {
    console.log("✅ Data from Supabase:", data); // Add this
    fnStats();
  } else if (!loading && !data) {
    console.log("❌ No data found for short URL!");
  }
  }, [loading]);

  if (loading || loadingStats){
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