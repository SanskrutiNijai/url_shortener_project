import { UrlState } from '@/context';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,

  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from './ui/button';
import { Input } from "@/components/ui/input";
import Error from "@/components/Error"; 
import * as yup from 'yup';
import { QRCode } from 'react-qrcode-logo';
import { BeatLoader } from 'react-spinners';
import { createUrl } from '@/db/apiUrls';


const CreateLink = () => {

  const {user} = UrlState();
  const navigate = useNavigate();
  const ref = useRef();
  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");  

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("title is required"),
    longUrl: yup.string()
    .url("Must be a valid URL")
    .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
        ...formValues,
        [e.target.id]: e.target.value,
    });
  };

 

  const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

  

  const createNewLink = async () => {
  setErrors({});
  setError(null);
  setLoading(true);

  try {
    // Validate form fields
    await schema.validate(formValues, { abortEarly: false });

    // Convert QR canvas to blob
    const canvas = ref.current.canvasRef.current;
    const blob = await new Promise((resolve) => canvas.toBlob(resolve));

    // Call createUrl directly
    const data = await createUrl({ ...formValues, user_id: user.id }, blob);

    // Redirect to new link page
    navigate(`/link/${data[0].id}`);
  } catch (err) {
    if (err?.inner) {
      // Validation errors
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    } else {
      // Server or other error
      setError(err);
      console.error("Error creating link:", err);
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog
    defaultOpen={longLink}
    onOpenChange={(res) => {
        if (!res) setSearchParams({});
    }}>
  <DialogTrigger asChild>
    <Button variant="destructive">Create New Link</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
    </DialogHeader>

    {
      formValues?.longUrl && (
        <QRCode value={formValues?.longUrl} size={250} ref={ref}/>
      )
    }

    <Input 
    id="title" 
    placeholder="Short Link's Title" 
    value = {formValues.title}
    onChange={handleChange} />
    {errors.title && <Error message={errors.title} />}


    <Input 
    id="longUrl" 
    placeholder="Enter your Long URL" 
    value = {formValues.longUrl}
    onChange={handleChange}/>
    {errors.longUrl && <Error message={errors.longUrl} />}

    <div className="flex items-center gap-2">
        <Card className="p-2">trimrr.in</Card> /
        <Input 
        id="customUrl" 
        placeholder="Custom Link (optional)" 
        value = {formValues.customUrl}
        onChange={handleChange}/>
    </div>

    
    {error && <Error message={error.message} />}

    <DialogFooter className="sm:justify-start">
        <Button disabled={loading} onClick = {createNewLink} variant="destructive">
          {loading ? <BeatLoader size = {10} color="white" /> : "Create"}
        </Button>
    </DialogFooter>

  </DialogContent>
</Dialog>
  )
}

export default CreateLink;