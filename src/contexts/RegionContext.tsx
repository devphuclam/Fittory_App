import React, { createContext, useEffect, useState } from 'react';
import { RegionService } from '../services';
import { getRegion, setRegion } from '../api/api';

export type RegionContextType = {
  region: any | null;
  setRegion: (r: any) => void;
};

export const RegionContext = createContext<RegionContextType | null>(null);

export const RegionProvider = ({ children }: { children: React.ReactNode }) => {
  const [region, setRegionState] = useState<any | null>(null);

  useEffect(() => {
    const initRegion = async () => {
      // 1. Kiểm tra cache
      const cached = await getRegion();
      if (cached) {
        setRegionState(cached);
        return;
      }

      // 2. Nếu chưa có thì gọi API
      const regions = await RegionService.listRegions();
      const defaultRegion = regions?.[0]; // chọn region đầu tiên
      if (defaultRegion) {
        setRegionState(defaultRegion);
        await setRegion(defaultRegion); // lưu cache
      }
    };

    initRegion();
  }, []);

  const setRegion = (r: any) => {
    setRegionState(r);
    setRegion(r); // update cache luôn
  };

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};
