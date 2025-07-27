import { getLongUrl } from "@/db/apiUrls";
import { storeClicks } from "@/db/apiClicks";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams(); // ✅ only this line



  const {loading, data, error, fn} = useFetch(getLongUrl, { id });

  const {loading: loadingStats, fn: fnStats} = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url
  });

  useEffect(() => {
    fn()
  }, [])


  useEffect(() => {
  if (!loading) {
  
    if (data) {
      fnStats();
    } else {
      console.log("No data found for short URL!");
    }
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