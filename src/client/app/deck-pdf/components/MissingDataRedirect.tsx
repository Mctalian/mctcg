import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

let timeout;

export default function MissingDataRedirect({ dataReady: dataToCheck, children }) {
  const router = useRouter();

  const dataReady = dataToCheck && dataToCheck.constructor === Object ?
    Object.keys(dataToCheck).length > 0 :
    !!dataToCheck;

  if (!dataReady) {
    if (!timeout) {
      timeout = setTimeout(() => {
        router.push('/deck-pdf');
      }, 4000);
    }
    return (
      <Box>
        <h2>Required data not found</h2>
        <p>Waiting for data...</p>
        <p>Redirecting in 3 seconds if data does not arrive.</p>
        <Button href="/deck-pdf" variant="contained">Go Now</Button>
      </Box>
    )
  }

  clearTimeout(timeout);
  timeout = null;

  return (
    <>{children}</>
  )
}
