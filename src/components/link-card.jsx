import React from 'react';
import {Link} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Download, Trash as Delete } from 'lucide-react';


const TRIMRR_URL = import.meta.env.VITE_TRIMRR_URL;

const LinkCard = ({url, fetchurls}) => {
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
        <Button>
            <Copy />
        </Button>
        <Button>
            <Download />
        </Button>
        <Button>
            <Delete />
        </Button>

    </div>
  </div>
  );
}

export default LinkCard;