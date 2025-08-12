import * as React from "react"
import { useViewMode } from "@/context/view-mode"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const { mode } = useViewMode()
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (mode === "mobile") {
      setIsMobile(true)
      return
    }
    if (mode === "desktop") {
      setIsMobile(false)
      return
    }
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [mode])

  return isMobile
}
