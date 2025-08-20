import { useEffect, useState } from "react";
import axios from "axios";

interface UseDataResult {
  data: any;
  loading: boolean;
  error: string | null;
}

export function useData(api: string): UseDataResult {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // tránh set state khi component unmount

    axios.get(api)
      .then((res) => {
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Không lấy được dữ liệu");
          setLoading(false);
        }
        console.error(err);
      });

    return () => {
      isMounted = false; // cleanup
    };
  }, []);


  return { data, loading, error };
}
