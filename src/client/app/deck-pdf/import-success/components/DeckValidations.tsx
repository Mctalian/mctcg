import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { Box } from '@mui/material';
import styles from "./DeckValidations.module.css";

export interface DeckValidationsProps {
  validations: string[];
  type: "error" | "warning";
}

export default function DeckValidations({ validations, type }: DeckValidationsProps) {
  let Icon = ErrorIcon;
  if (type === "warning") {
    Icon = WarningIcon;
  }
  if (validations.length > 0) {
    return (<Box
      sx={{
        border: "2px solid red",
        backgroundColor: "rgba(255,0,0,0.1)"
      }}
    >
      <h3><Icon sx={{ verticalAlign: "middle", margin: "0 0 3px" }} color={type} /> Your deck has {type}s:</h3>
      <ul>
        {validations.map((v) => <li className={styles.validationsList}>{v}</li>)}
      </ul>
    </Box>)
  }
  return <></>
}