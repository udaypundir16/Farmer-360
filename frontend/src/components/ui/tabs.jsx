import { useState, createContext, useContext } from 'react';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }) {
  return <div className={`flex border-b ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className = '' }) {
  const ctx = useContext(TabsContext);
  const isActive = ctx?.activeTab === value;
  return (
    <button
      type="button"
      onClick={() => ctx?.setActiveTab?.(value)}
      data-state={isActive ? 'active' : 'inactive'}
      className={`px-4 py-2 font-medium transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = '' }) {
  const ctx = useContext(TabsContext);
  if (ctx?.activeTab !== value) return null;
  return <div className={`mt-4 ${className}`}>{children}</div>;
}
