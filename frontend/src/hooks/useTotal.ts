import { useEffect, useState } from "react";
import axios from "axios";

interface UseTotalResult {
  total: number;
  loading: boolean;
  error: string | null;
}

export function useTotal(api: string): UseTotalResult {
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // tránh set state khi component unmount

    axios.get(api)
      .then((res) => {
        if (isMounted) {
          setTotal(res.data.count);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Không lấy được tổng");
          setLoading(false);
        }
        console.error(err);
      });

    return () => {
      isMounted = false; // cleanup
    };
  }, []);


  return { total, loading, error };
}
