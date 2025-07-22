import { UrlState } from '@/context';
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const CreateLink = () => {

  const {user} = UrlState();
  const navigate = useNavigate();
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

  return (
    <Dialog
    defaultOpen={longLink}
    onOpenChange={(res) => {
        if (!res) setSearchParams({});
    }}>
  <DialogTrigger>
    <Button variant="destructive">Create New Link</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
    </DialogHeader>

    <Input 
    id="title" 
    placeholder="Short Link's Title" 
    value = {formValues.title}
    onChange={handleChange} />
    <Error message={"some error"} />

    <Input 
    id="longUrl" 
    placeholder="Enter your Long URL" 
    value = {formValues.longUrl}
    onChange={handleChange}/>
    <Error message={"some error"} />

    <div className="flex items-center gap-2">
        <Card className="p-2">trimrr.in</Card> /
        <Input 
        id="customUrl" 
        placeholder="Custom Link (optional)" 
        value = {formValues.customUrl}
        onChange={handleChange}/>
    </div>

    
    <Error message={"some error"} />

    <DialogFooter className="sm:justify-start">
        <Button variant="destructive">Create</Button>
    </DialogFooter>

  </DialogContent>
</Dialog>
  )
}

export default CreateLink;