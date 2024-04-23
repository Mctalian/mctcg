import { Backdrop, CircularProgress } from "@mui/material";
import { useAppSelector } from "../store/hooks";

export default function Loader() {
  const loading = useAppSelector((state) => state.loading.value);
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress />
    </Backdrop>
  )
}
