import React, { createContext, useEffect, useState } from 'react';
import { RegionService } from '../services';

interface Region {
  id: string;
  name: string;
  currency_code: string;
}

interface RegionContextType {
  region: Region | null;
  setRegion: (region: Region) => void;
  loading: boolean;
  error: string | null;
}

export const RegionContext = createContext<RegionContextType | null>(null);

export const RegionProvider = ({ children }: { children: React.ReactNode }) => {
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        setLoading(true);
        const regions = await RegionService.listRegions();
        if (regions && regions.length > 0) {
          setRegion(regions[0]); // chọn region mặc định
        } else {
          setError('No regions found');
        }
      } catch (err) {
        console.error('Error fetching regions:', err);
        setError('Failed to load regions');
      } finally {
        setLoading(false);
      }
    };
    fetchRegion();
  }, []);

  return (
    <RegionContext.Provider value={{ region, setRegion, loading, error }}>
      {children}
    </RegionContext.Provider>
  );
};
