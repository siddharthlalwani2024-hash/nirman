import { createContext, useContext, useState } from "react";

const StickyBarContext = createContext(null);

export function StickyBarProvider({ children }) {
  const [override, setOverride] = useState(null);
  return <StickyBarContext.Provider value={{ override, setOverride }}>{children}</StickyBarContext.Provider>;
}

export function useStickyBar() {
  return useContext(StickyBarContext);
}
