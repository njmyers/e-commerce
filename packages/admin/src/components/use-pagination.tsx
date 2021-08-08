import * as React from 'react';
import * as Schema from '../types';

export interface CursorState {
  current: string;
  stack: string[];
}

export interface UsePaginationArgs {
  pageInfo?:
    | Schema.CustomerPageInfo
    | Schema.MerchantPageInfo
    | Schema.ProductsPageInfo
    | Schema.OrderPageInfo;
}

export interface UsePaginationReturn {
  handleNextClick: () => void;
  handleBackClick: () => void;
  cursor: CursorState;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function usePagination({ pageInfo }: UsePaginationArgs) {
  const [cursor, setCursor] = React.useState<CursorState>({
    current: '',
    stack: [],
  });

  const handleNextClick = () => {
    if (!pageInfo) {
      return;
    }

    const { endCursor, hasNextPage } = pageInfo;

    if (!hasNextPage) {
      return;
    }

    setCursor(prevCursor => {
      return {
        current: endCursor,
        stack: [...prevCursor.stack, prevCursor.current],
      };
    });
  };

  const handleBackClick = () => {
    if (!pageInfo) {
      return;
    }

    setCursor(prevCursor => {
      return {
        current: prevCursor.stack.slice(-1)[0],
        stack: prevCursor.stack.slice(0, -1),
      };
    });
  };

  return {
    cursor,
    hasNext: Boolean(pageInfo?.hasNextPage),
    hasPrevious: cursor.stack.length > 0,
    handleBackClick,
    handleNextClick,
  };
}
