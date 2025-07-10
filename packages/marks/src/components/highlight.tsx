import React from 'react';
import { YooptaMarkProps, createYooptaMark } from '@yoopta/editor';

export interface LeafColorProps {
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundClip?: string;
  webkitTextFillColor?: string;
  // Custom data attributes with proper typing
  'data-type'?: string;
  'data-id'?: string;
  'data-original'?: string;
  className?: string;
}

export const Highlight = createYooptaMark<YooptaMarkProps<'highlight', LeafColorProps>>({
  type: 'highlight',
  render: (props) => {
    const highlight = props.leaf?.highlight;

    // Handle both old color-based highlights and new custom data highlights
    const style: React.CSSProperties = {
      color: highlight?.color,
      backgroundColor: highlight?.backgroundColor,
      backgroundImage: highlight?.backgroundImage,
      WebkitTextFillColor: highlight?.webkitTextFillColor,
      backgroundClip: highlight?.backgroundClip as any, // Type assertion for CSS property
    };

    // Handle custom data attributes
    const dataType = highlight?.['data-type'];
    const dataId = highlight?.['data-id'];
    const dataOriginal = highlight?.['data-original'];
    const customClassName = highlight?.className;

    // Apply custom styling based on data-type
    let customStyle: React.CSSProperties = { ...style };
    let className = 'yoopta-mark-highlight';

    if (dataType === 'greenHighlight') {
      customStyle.backgroundColor = '#bbf7d0';
      className += ' green-highlight cursor-pointer hover:bg-green-200';
    } else if (dataType === 'blueHighlight') {
      customStyle.backgroundColor = '#bfdbfe';
      className += ' blue-highlight cursor-pointer hover:bg-blue-200';
    } else if (dataId) {
      // Generic custom highlight
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

        // Method 1: Global function
        if (typeof window !== 'undefined' && (window as any).handleHighlightClick) {
          (window as any).handleHighlightClick(dataId);
        }

        // Method 2: Custom event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('highlightClick', {
              detail: { id: dataId, type: dataType, original: dataOriginal },
            }),
          );
        }
      }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (dataId) {
        // Prevent editor selection when clicking custom highlights
        e.stopPropagation();
      }
    };

    // Create props object with proper typing for data attributes
    const spanProps: React.HTMLAttributes<HTMLSpanElement> = {
      style: customStyle,
      className,
      onClick: dataId ? handleClick : undefined,
      onMouseDown: dataId ? handleMouseDown : undefined,
    };

    // Add data attributes conditionally
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
