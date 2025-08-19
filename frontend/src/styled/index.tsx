import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { fontSizeMixin, colorMixin, hoverColorMixin, flexAlignMixin, calcPercentage } from './mixins';

// style Text
export const FontBody = styled.p`
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
`;

export const Title = styled(FontBody)<{
  small?: boolean;
  medium?: boolean;
  big?: boolean;
  white?: boolean;
  blue?: boolean;
}>`
  ${fontSizeMixin};
  ${colorMixin};
  font-weight: 700;
  text-transform: none;
  line-height: 1.4;
  margin: 0 0 15px;
  user-select: none;
`;

export const SupTitle = styled(FontBody)<{
  small?: boolean;
  medium?: boolean;
  big?: boolean;
  orange?: boolean;
  white?: boolean;
  blue?: boolean;
}>`
  ${fontSizeMixin};
  ${colorMixin};
  font-weight: 700;
  user-select: none;
  margin: 10px 0;
`;

export const Text = styled(FontBody)<{
  secondary?: boolean;
  white?: boolean;
  small?: boolean;
  bold?: boolean;
  color?: string;
}>`
  width: 100%;
  margin: 0 0 14px;
  ${fontSizeMixin};
  font-weight: ${(props) => (props.bold ? 'bold' : 400)};
  ${colorMixin};
  line-height: 1.625;
  text-align: justify;
`;

export const Icon = styled(FontAwesomeIcon)<{
  small?: boolean;
  medium?: boolean;
  big?: boolean;
  white?: boolean;
  blue?: boolean;
  orange?: boolean;
  hover?: boolean;
}>`
  margin: 0 10px 0 0;
  ${fontSizeMixin};
  padding: 5px 5px 0;
  ${colorMixin};
  ${hoverColorMixin};
`;

// style box
export const Wrapper = styled.div`
  max-width: 100%;
  width: 1250px;
  margin: 0 auto;
`;

export const WrapperPadding = styled.div`
  padding: 100px 0;
`;

export const FlexBox = styled.div`
  ${flexAlignMixin};
  width: 100%;
`;

export const RowStretch = styled(FlexBox)`
  align-items: stretch;
`;

export const RowBetween = styled(FlexBox)`
  justify-content: space-between;
`;

export const RowAround = styled(FlexBox)`
  justify-content: space-around;
`;

export const RowEvenly = styled(FlexBox)`
  justify-content: space-evenly;
`;

export const CenterBox = styled.div`
  text-align: center;
`;

// Grid system
export const Grid = styled.div`
  width: 100%;
  display: block;
  padding: 0;
`;

export const GridWide = styled(Grid)`
  max-width: 1200px;
  margin: 0 auto;
`;

export const GridRow = styled.div<{ margin?: string }>`
  display: flex;
  flex: 1;
  flex-wrap: wrap;

  --grid-margin: ${({ margin }) => margin || '4px'};

  margin-left: calc(-1 * var(--grid-margin));
  margin-right: calc(-1 * var(--grid-margin));
  margin-top: calc(1 * var(--grid-margin));
  margin-bottom: calc(1 * var(--grid-margin));
`;

export const GridCol = styled.div<{ col: number; md?: number; sm?: number }>`
  
  flex: 0 0 ${({ col }) => calcPercentage(col, "var(--grid-margin)")};
  max-width: ${({ col }) => calcPercentage(col, "var(--grid-margin)")};
  padding-left: var(--grid-margin);
  padding-right: var(--grid-margin);

  @media (max-width: 768px) {
    flex: 0 0 ${({ md, col }) => calcPercentage(md || col, "var(--grid-margin)")};
    max-width: ${({ md, col }) => calcPercentage(md || col, "var(--grid-margin)")};
  }

  @media (max-width: 576px) {
    flex: 0 0 ${({ sm, col }) => calcPercentage(sm || col, "var(--grid-margin)")};
    max-width: ${({ sm, col }) => calcPercentage(sm || col, "var(--grid-margin)")};
  }
`;

