import { css } from 'styled-components';

export const fontSizeMixin = css<{ small?: boolean; medium?: boolean; big?: boolean }>`
  font-size: ${(props) =>
    props.small ? '16px' :
    props.medium ? '24px' :
    props.big ? '50px' : '18px'};
`;

export const colorMixin = css<{ white?: boolean; blue?: boolean; orange?: boolean; secondary?: boolean; color?: string }>`
  color: ${(props) =>
    props.color ? props.color :
    props.white ? 'var(--white-text-color)' :
    props.blue ? 'var(--blue-text-color)' :
    props.orange ? 'var(--orange-text-color)' :
    props.secondary ? 'var(--secondary-text-color)' : 'var(--primary-text-color)'};
`;

export const hoverColorMixin = css<{ hover?: boolean }>`
  &:hover {
    color: ${(props) => props.hover && 'var(--primary-color)'};
  }
`;

export const flexAlignMixin = css`
  display: flex;
  align-items: center;
`;

export const calcPercentage = (value?: number, margin?: string) => 
  value ? `calc(${(value / 12) * 100}% )` : `100%`;
