import { useEffect, useState } from 'react';

function useUrlChange(callback) {
    const [location, setLocation] = useState(window.location.href);

    useEffect(() => {
        const handleLocationChange = () => {
            setLocation(window.location.href);  // Update the location state
        };

        // Listen for popstate (URL changes)
        window.addEventListener('popstate', handleLocationChange);

        // Also listen for pushState and replaceState calls
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = (...args) => {
            originalPushState.apply(history, args);
            handleLocationChange();
        };

        history.replaceState = (...args) => {
            originalReplaceState.apply(history, args);
            handleLocationChange();
        };

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('popstate', handleLocationChange);
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
        };
    }, []);

    useEffect(() => {
        callback(location);  // Trigger the callback whenever the location changes
    }, [location, callback]);
}

export default useUrlChange;