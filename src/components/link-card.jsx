import React from 'react';
import {Link} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Download, Trash } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { BeatLoader } from 'react-spinners';
import { deleteUrl } from '@/db/apiUrls';


const TRIMRR_URL = import.meta.env.VITE_TRIMRR_URL;

const LinkCard = ({url, fetchurls}) => {

    const downloadImage = () => {
        const imageUrl = url?.qr;
        const fileName = url?.title;

        const anchor = document.createElement("a");
        anchor.href = imageUrl;
        anchor.download = fileName;

        document.body.appendChild(anchor);

        anchor.click();
        document.body.removeChild(anchor);
    }

    const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, url?.id);
  return (
  <div className='flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg'>
    <img src={url?.qr} 
    className='h-32 object-contain ring ring-blue-500 self-start'
    alt="QR code" />
    <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 text-white">
    <span className='text-3xl font-extrabold hover:underline cursor-pointer'>
        {url?.title}</span>
    <span className='text-2xl text-blue-400 font-bold hover:underline cursor-pointer'>
        {TRIMRR_URL}{url?.custom_url ? url?.custom_url : url.short_url}
    </span>
    <span className='flex items-center gap-1 hover:underline cursor-pointer'>{url?.["original-url"]}</span>
    <span className='flex items-end font-extralight text-sm flex-1'>
        {new Date(url?.created_at).toLocaleString()}
    </span>
    </Link>

    <div className='flex gaap-2'>
        <Button onClick={() => navigator.clipboard.writeText(`https://trimrr.in/${url?.short_url}`)}>
            <Copy />
        </Button>
        <Button onClick={downloadImage}>
            <Download />
        </Button>
        <Button onClick={() => fnDelete().then(() => fetchurls())}>
            {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
        </Button>

    </div>
  </div>
  );
}

export default LinkCard;