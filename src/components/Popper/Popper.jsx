import React, { useState } from "react";
import styled from "styled-components";
import { usePopper } from "react-popper";
import Portal from "../../utils/Portal";

export const TooltipArrow = styled.div`
  width: 0.6rem;
  height: 0.6rem;
  &::before {
    content: "";
    background: #b94a48;
    width: 0.6rem;
    height: 0.6rem;
    transform: translate(-50%, -50%) rotate(45deg);
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const TipWrapper = styled.div`
  background: #b94a48;
  border-radius: 5px;
  color: white;
  padding: 0.8rem;
  font-weight: 300;
  font-size: 13px;
  z-index: 99;
  max-width: 318px;

  &[data-popper-placement^="right"] {
    ${TooltipArrow} {
      left: 0px;
    }
  }

  &[data-popper-placement^="left"] {
    ${TooltipArrow} {
      right: -0.6rem;
    }
  }

  &[data-popper-placement^="top"] {
    ${TooltipArrow} {
      bottom: -0.6rem;
    }
  }

  &[data-popper-placement^="bottom"] {
    ${TooltipArrow} {
      top: 0px;
    }
  }
`;

const Popper = ({ children, trigger, placement, offsetNum }) => {
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);

  const { styles, attributes } = usePopper(trigger, popperElement, {
    placement,
    modifiers: [
      { name: "arrow", options: { element: arrowElement } },
      {
        name: "offset",
        options: {
          offset: [0, parseInt(offsetNum || 8)],
        },
      },
    ],
  });

  return (
    <Portal>
      <TipWrapper
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        {children}
        <TooltipArrow ref={setArrowElement} style={styles.arrow} />
      </TipWrapper>
    </Portal>
  );
};

export default Popper;
