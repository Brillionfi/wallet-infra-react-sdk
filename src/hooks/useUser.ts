import { useState, useEffect } from "react";
import { useBrillionContext } from "../BrillionContext";

export const useUser = (endpoint: string) => {
  const sdk = useBrillionContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      /* try {
        const response = await sdk.authenticateUser();
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      } */
    };
    fetchData();
  }, [endpoint, sdk]);

  return { data, loading, error };
};
