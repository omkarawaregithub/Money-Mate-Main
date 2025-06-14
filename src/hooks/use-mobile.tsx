
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Default to false (desktop) on the server and for the initial client render.
  // This ensures server and client render the same thing initially.
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // This effect runs only on the client, after hydration.
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on mount
    checkDevice() 
    
    // Add resize listener
    window.addEventListener("resize", checkDevice)
    
    // Clean up listener on unmount
    return () => window.removeEventListener("resize", checkDevice)
  }, []) // Empty dependency array ensures this runs once on mount (client-side) and cleans up

  return isMobile
}
