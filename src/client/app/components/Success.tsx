import { Backdrop } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Check } from "@mui/icons-material";
import { useState } from "react";
import { setSuccess } from "../store/successSlice";

export default function Success() {
  const success = useAppSelector((state) => state.success.value);
  const dispatch = useAppDispatch(); 
  const [timeout, setTO] = useState(null);

  if (success && !timeout) {
    const handler = setTimeout(() => {
      dispatch(setSuccess(false));
      clearTimeout(timeout);
      setTO(null);
    }, 3000);
    setTO(handler);
  }

  return (
    <Backdrop
      sx={{ color: '#fff', fontSize: "10rem", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={success}
    >
      <Check fontSize="inherit" color="success" />
    </Backdrop>
  )
}
