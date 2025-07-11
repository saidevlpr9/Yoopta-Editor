import React from 'react';
import { YooptaMarkProps, createYooptaMark } from '@yoopta/editor';

export interface LeafColorProps {
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundClip?: string;
  webkitTextFillColor?: string;
  'data-type'?: string;
  'data-id'?: string;
  'data-original'?: string;
  className?: string;
}

export const CustomHighlight = createYooptaMark<YooptaMarkProps<'highlight', LeafColorProps>>({
  type: 'highlight',
  render: (props) => {
    const highlight = props.leaf?.highlight;

    const style: React.CSSProperties = {
      color: highlight?.color,
      backgroundColor: highlight?.backgroundColor,
      backgroundImage: highlight?.backgroundImage,
      WebkitTextFillColor: highlight?.webkitTextFillColor,
      backgroundClip: highlight?.backgroundClip as any,
    };

    const dataType = highlight?.['data-type'];
    const dataId = highlight?.['data-id'];
    const dataOriginal = highlight?.['data-original'];
    const customClassName = highlight?.className;

    let customStyle: React.CSSProperties = { ...style };
    let className = 'yoopta-mark-highlight';

    if (dataType === 'greenHighlight') {
      customStyle.backgroundColor = '#bbf7d0';
      className += ' green-highlight cursor-pointer hover:bg-green-200';
    } else if (dataType === 'blueHighlight') {
      customStyle.backgroundColor = '#bfdbfe';
      className += ' blue-highlight cursor-pointer hover:bg-blue-200';
    } else if (dataId) {
      className += ' custom-highlight cursor-pointer hover:opacity-80';
    }

    if (customClassName) {
      className += ' ' + customClassName;
    }

    const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (dataId) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🟨 Clicked highlight with id:', dataId);
      }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (dataId) {
        // Prevent editor selection when clicking custom highlights
        e.stopPropagation();
      }
    };

    const spanProps: React.HTMLAttributes<HTMLSpanElement> = {
      style: customStyle,
      className,
      onClick: dataId ? handleClick : undefined,
      onMouseDown: dataId ? handleMouseDown : undefined,
    };

    if (dataType) {
      (spanProps as any)['data-type'] = dataType;
    }
    if (dataId) {
      (spanProps as any)['data-id'] = dataId;
    }
    if (dataOriginal) {
      (spanProps as any)['data-original'] = dataOriginal;
    }

    return <span {...spanProps}>{props.children}</span>;
  },
});
