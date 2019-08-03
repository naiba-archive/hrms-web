import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router';

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起，页面好像找不到了"
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        返回首页
      </Button>
    }
  ></Result>
);

export default NoFoundPage;
