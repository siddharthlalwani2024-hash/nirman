import { createContext, useContext, useMemo, useState } from "react";

const StickyBarContext = createContext(null);

export function StickyBarProvider({ children }) {
  const [override, setOverride] = useState(null);
  const value = useMemo(() => ({ override, setOverride }), [override]);
  return <StickyBarContext.Provider value={value}>{children}</StickyBarContext.Provider>;
}

export function useStickyBar() {
  return useContext(StickyBarContext);
}
