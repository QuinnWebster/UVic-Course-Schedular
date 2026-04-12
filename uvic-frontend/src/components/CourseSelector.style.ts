import styled from "@emotion/styled";
import {
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  TextField,
  FormControl,
  Select,
  Alert,
} from "@mui/material";
import { colors } from "../theme/colors";

/* Container */
export const Container = styled(Box)`
  background: ${({ theme }) => theme.card.default};
  border: 1px solid ${({ theme }) => theme.card.border};
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(20px);
`;

/* Term chip */
export const TermChip = styled(Chip)`
  color: ${colors.primary[500]};
  border-color: ${({ theme }) => theme.card.borderSelected};
  background: ${({ theme }) => theme.card.selected};
  font-size: 13px;
`;

/* Section label */
export const SectionLabel = styled(Typography)`
  color: ${({ theme }) => theme.text.disabled};
  letter-spacing: 1.5px;
  font-size: 10px;
`;

/* Row index */
export const IndexText = styled(Typography)`
  font-family: "Space Mono", monospace;
  font-size: 11px;
  color: ${({ theme }) => theme.text.disabled};
  min-width: 20px;
  text-align: right;
`;

/* FormControl */
export const StyledFormControl = styled(FormControl)`
  min-width: 120px;
`;

/* Select */
export const StyledSelect = styled(Select)`
  color: ${({ theme }) => theme.text.primary};

  .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.border.subtle};
  }

  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.text.disabled};
  }

  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${colors.primary[500]};
  }

  .MuiSvgIcon-root {
    color: ${({ theme }) => theme.text.disabled};
  }
`;

/* TextField */
export const StyledTextField = styled(TextField)`
  flex: 1;

  & label {
    color: ${({ theme }) => theme.text.disabled};
  }

  & label.Mui-focused {
    color: ${colors.primary[500]};
  }

  & .MuiInputBase-input {
    color: ${({ theme }) => theme.text.primary};
  }

  & .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.border.subtle};
  }

  & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.text.disabled};
  }

  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${colors.primary[500]};
  }
`;

/* Remove button */
export const RemoveButton = styled(IconButton)`
  color: ${({ theme }) => theme.text.disabled};

  &:hover {
    color: #ef4444;
  }
`;

/* Add button */
export const AddButton = styled(Button)`
  color: ${colors.primary[500]};
  text-transform: none;
  font-size: 13px;
  margin-bottom: 24px;

  &:hover {
    background: ${({ theme }) => theme.card.selected};
  }
`;

/* Error alert */
export const ErrorAlert = styled(Alert)`
  margin-bottom: 16px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;

  .MuiAlert-icon {
    color: #ef4444;
  }
`;

/* Submit button */
export const SubmitButton = styled(Button)`
  background: #0284c7;
  padding: 10px 0;
  border-radius: 8px;
  text-transform: none;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #0ea5e9;
  }

  &:disabled {
    background: ${({ theme }) => theme.border.subtle};
    color: ${({ theme }) => theme.text.disabled};
  }
`;
