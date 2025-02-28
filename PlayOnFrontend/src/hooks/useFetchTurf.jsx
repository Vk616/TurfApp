import { useEffect, useState } from "react";
import { getTurfById } from "../api/turfApi";

const useFetchTurf = (turfId) => {
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTurf() {
      try {
        const data = await getTurfById(turfId);
        setTurf(data);
      } catch (error) {
        console.error("Error fetching turf:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTurf();
  }, [turfId]);

  return { turf, loading };
};

export default useFetchTurf;
