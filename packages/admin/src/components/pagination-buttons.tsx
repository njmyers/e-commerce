import * as React from 'react';
import { Button } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';

import { UsePaginationReturn } from './use-pagination';

import './paginated-buttons.css';

export function PaginationButtons({
  handleBackClick,
  handleNextClick,
  hasNext,
  hasPrevious,
}: UsePaginationReturn) {
  return (
    <div className="paginated-buttons">
      <Button onClick={handleBackClick} disabled={!hasPrevious}>
        <LeftOutlined />
        Previous
      </Button>
      <Button onClick={handleNextClick} disabled={!hasNext}>
        Next
        <RightOutlined />
      </Button>
    </div>
  );
}
