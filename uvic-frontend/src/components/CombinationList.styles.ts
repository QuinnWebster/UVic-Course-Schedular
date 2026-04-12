import styled from "@emotion/styled";
import { Box, Typography, Chip } from "@mui/material";
import { colors } from "../theme/colors";

/* Container */
export const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* Header */
export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* Title */
export const Title = styled(Typography)`
  font-family: "DM Serif Display", serif;
`;

/* Subtitle */
export const Subtitle = styled(Typography)`
  color: ${({ theme }) => theme.text.disabled};
`;

/* Card */
export const ComboCard = styled(Box)<{ selected: boolean }>`
  background: ${({ theme, selected }) =>
    selected ? theme.card.selected : theme.card.default};

  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.card.borderSelected : theme.card.border};

  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(12px);
  transition: 0.2s;
  cursor: pointer;
`;

/* Header Row inside card */
export const ComboHeaderRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
`;

/* Left group (icon + text + chips container) */
export const LeftGroup = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* Option text */
export const OptionText = styled(Typography)<{ selected: boolean }>`
  font-family: "Space Mono", monospace;
  font-size: 12px;
  color: ${({ theme, selected }) =>
    selected ? colors.primary[500] : theme.text.disabled};
`;

/* Expand icon wrapper */
export const ExpandIconWrapper = styled(Box)<{ selected: boolean }>`
  display: flex;
  align-items: center;
  margin-left: 16px;
  transition: transform 0.2s;
  transform: ${({ selected }) =>
    selected ? "rotate(180deg)" : "rotate(0deg)"};
`;

/* Count chip */
export const CountChip = styled(Chip)`
  font-family: "Space Mono", monospace;
  font-size: 11px;
  background: ${({ theme }) => theme.card.selected};
  color: ${colors.primary[500]};
  border: 1px solid ${({ theme }) => theme.card.borderSelected};
`;

/* Section chip */
export const SectionChip = styled(Chip)<{ colorHex: string }>`
  height: 22px;
  font-size: 11px;
  font-family: "Space Mono", monospace;

  background: ${({ colorHex }) => `${colorHex}22`};
  color: ${({ colorHex }) => colorHex};
  border: 1px solid ${({ colorHex }) => `${colorHex}44`};
`;
