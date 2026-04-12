import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";

/* Page wrapper */
export const PageWrapper = styled(Box)`
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 80px;
  background: ${({ theme }) => theme.bg.primary};
`;

/* Header container */
export const Header = styled(Box)`
  text-align: center;
`;

/* Badge */
export const Badge = styled(Box)`
  display: inline-block;
  font-family: "Space Mono", monospace;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;

  color: ${({ theme }) => theme.text.primary};
  background: ${({ theme }) => theme.card.selected};

  padding: 4px 12px;
  margin-bottom: 16px;

  border: 1px solid ${({ theme }) => theme.border.subtle};
  border-radius: 20px;
`;

/* Title */
export const Title = styled(Typography)`
  font-family: "DM Serif Display", serif;
  line-height: 1.1;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 12px;

  font-size: 56px;

  @media (max-width: 600px) {
    font-size: 38px;
  }
`;

/* Highlight word */
export const Highlight = styled("span")`
  font-style: italic;
  color: ${({ theme }) => theme.text.primary};
`;

/* Subtitle */
export const Subtitle = styled(Typography)`
  color: ${({ theme }) => theme.text.disabled};
  max-width: 380px;
  margin: 0 auto;
`;

/* Form wrapper */
export const FormWrapper = styled(Box)`
  margin-top: 24px;
`;
