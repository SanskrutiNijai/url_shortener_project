import supabase from "./supabase";
import { UAParser } from "ua-parser-js";

const parser = new UAParser();

export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load Clicks");
  }

  return data;
}

export const storeClicks = async ({ id, originalUrl }) => {
  try {
    
    const res = parser.getResult();
    const device = res.device?.type || "desktop";
    console.log("📱 Device:", device);

    let city = "Unknown";
    let country = "Unknown";

    try {
      const response = await fetch("https://ipapi.co/json", { timeout: 3000 }); 
      if (response.ok) {
        const json = await response.json();
        city = json.city || "Unknown";
        country = json.country_name || "Unknown";
      } else {
        console.warn("IP API fetch failed with status:", response.status);
      }
    } catch (err) {
      console.warn("Error fetching IP info:", err);
    }

    console.log("Location:", city, country);

    const { error } = await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device,
    });

    if (error) {
      console.error("Supabase insert error:", error.message);
      throw error;
    }

    
  } catch (error) {
    
    throw error;
  }
};

export async function getClicksForUrl({ url_id }) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error.message);
    throw new Error("Unable to load Stats");
  }

  return data;
}
