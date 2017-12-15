import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { units, px, colors, fontSizes } from '../variables';

const Container = styled.div`
  display: flex;
  align-items: center;
  font-size: ${props => props.fontSize};
  color: ${colors.gray2};
  cursor: pointer;
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  margin-right: ${px(units.half)};
  user-select: none;

  &:last-of-type {
    margin-right: 0;
  }
`;

const Indicator = styled.span`
  width: ${props => px(props.radius)};
  height: ${props => px(props.radius)};
  margin-right: ${props => px(props.radius / 2)};
  background: ${props => props.color};
  border-radius: 100%;
`;

export default class Legend extends PureComponent {
  render() {
    const {
      onClick,
      color,
      text,
      fontSize = fontSizes.small,
      radius = units.minus - 1,
      disabled = false,
      className
    } = this.props;

    return (
      <Container
        onClick={onClick}
        disabled={disabled}
        fontSize={fontSize}
        className={className}
      >
        <Indicator color={color} radius={radius} />
        {text}
      </Container>
    );
  }
}
