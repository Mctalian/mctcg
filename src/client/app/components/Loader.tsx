import { Box, CircularProgress } from "@mui/material";
import { useAppSelector } from "../store/hooks";

export default function Loader() {
  const loading = useAppSelector((state) => state.loading.value);
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="fixed"
        top={0}
        left={0}
        width="100%"
        height="100%"
        bgcolor="rgba(255, 255, 255, 0.7)"
      >
        <CircularProgress />
      </Box>
    )
  } else {
    return <></>
  }
}
