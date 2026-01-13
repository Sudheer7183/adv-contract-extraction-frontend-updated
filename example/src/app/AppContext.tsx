import React, { createContext, useState } from 'react';

interface AppContextProps {
    viewerPageActive: boolean;
    setViewerPageActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextProps>({
    viewerPageActive: false,
    setViewerPageActive: () => { },
});

export const AppProvider: React.FC = ({ children }) => {
    const [viewerPageActive, setViewerPageActive] = useState(false);

    return (
        <AppContext.Provider value={{ viewerPageActive, setViewerPageActive }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
