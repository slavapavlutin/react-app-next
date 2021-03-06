/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/core';
import { Theme } from '@self/lib/types';
import { ComponentProps, ComponentType, useEffect, useRef, useState } from 'react';

interface Props extends React.ComponentProps<'div'> {
  children: (params: {
    Item: ComponentType<ComponentProps<'li'>>;
    setActive: (value: boolean) => void;
  }) => any;
  renderToggle: (params: { active: boolean }) => void;
}

let containerStyles = css`
  position: relative;
`;

let dropdownMenuStyles = (theme: Theme): SerializedStyles => css`
  ${theme.type === 'dark'
    ? `background: ${theme.color.backgroundActive};`
    : `background: ${theme.color.background};`}

  ${theme.type === 'dark'
    ? `box-shadow: -1px 3px 10px 3px rgba(0,0,0,0.3);`
    : `box-shadow: -1px 3px 10px 3px rgba(0,0,0,0.1);`}

  position: absolute;
  padding: 0;
  margin: 0;
  list-style: none;
  border-radius: 4px;
  font-size: 1.6rem;
  font-weight: normal;
  font-family: ${theme.font.text};
  z-index: 1;
`;

let dropdownItemStyles = (theme: Theme): SerializedStyles => css`
  display: flex;
  align-items: center;
  padding: 1rem;

  :hover {
    ${
      theme.type === 'dark'
        ? `background: ${theme.color.background};`
        : `background: ${theme.color.backgroundActive};`
    }
    color: ${theme.color.link};
    cursor: pointer;
  }
`;

let hiddenStyles = (theme: Theme): SerializedStyles => css`
  ${dropdownMenuStyles(theme)}
  visibility: hidden;
`;

function Dropdown(props: Props): React.ReactElement {
  let [active, setActive] = useState(false);
  let dropdown = useRef<HTMLUListElement>(null);
  let container = useRef<HTMLDivElement>(null);
  let { children, renderToggle, ...rest } = props;

  useEffect(() => {
    // TODO: change menu position on resize when necessary
    if (dropdown.current) {
      repositionElementAccordingToViewport(dropdown.current);
    }

    document.addEventListener('mousedown', outsideClickListener);

    return () => document.removeEventListener('mousedown', outsideClickListener);
  }, []);

  function outsideClickListener(event: MouseEvent) {
    let { current: containerElement } = container;

    if (containerElement && !containerElement.contains(event.target as HTMLElement)) {
      setActive(false);
    }
  }

  function handleToggle() {
    setActive(true);
  }

  return (
    <div css={containerStyles} ref={container} {...rest} onMouseDown={handleToggle}>
      {renderToggle({ active })}
      <ul css={active ? dropdownMenuStyles : hiddenStyles} ref={dropdown}>
        {children({ Item: DropdownMenuItem, setActive })}
      </ul>
    </div>
  );
}

function DropdownMenuItem({ children, ...rest }: ComponentProps<'li'>) {
  return (
    <li css={dropdownItemStyles} {...rest}>
      {children}
    </li>
  );
}

function repositionElementAccordingToViewport(element: HTMLElement): void {
  let viewportDimensions = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };

  if (element) {
    let dimensions = element.getBoundingClientRect();
    let overflowData = {
      x: viewportDimensions.width - (dimensions.left + dimensions.width),
      y: viewportDimensions.height - (dimensions.top + dimensions.height),
    };

    if (overflowData.x < 0) {
      element.style.right = '0';
    }

    if (overflowData.y < 0) {
      element.style.bottom = '100%';
    }
  }
}

export default Dropdown;
