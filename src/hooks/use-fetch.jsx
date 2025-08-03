import { useState } from "react";

const useFetch = (cb, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const fn = async (...args) => {
        setLoading(true);
        setError(null);
        try{
            const response =await cb(options, ...args);
            console.log("useFetch: Got response:", response);
            setData(response);
        }catch(error){
            console.error("useFetch error:", error);
            setError(error);
        }finally{
            setLoading(false);
        }
    };
    return {data, loading, error, fn};
};

export default useFetch;