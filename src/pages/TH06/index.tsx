import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Card } from 'antd';
import { useModel } from 'umi';

import Explore from './components/Explore';
import Itinerary from './components/Itinerary';
import BudgetManager from './components/BudgetManager';
import Admin from './components/Admin';

const TH06Index: React.FC = () => {
  // Model nằm trong folder localStorage nên tên gọi là 'localStorage.th06'
  const model = useModel('localStorage.th06' as any); 

  return (
    <PageContainer title="ỨNG DỤNG DU LỊCH TH06">
      <Card bordered={false}>
        <Tabs defaultActiveKey="1" type="card">
          <Tabs.TabPane tab="1. Khám phá" key="1"><Explore {...model} /></Tabs.TabPane>
          <Tabs.TabPane tab="2. Lịch trình" key="2"><Itinerary {...model} /></Tabs.TabPane>
          <Tabs.TabPane tab="3. Ngân sách" key="3"><BudgetManager {...model} /></Tabs.TabPane>
          <Tabs.TabPane tab="4. Admin" key="4"><Admin {...model} /></Tabs.TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};
export default TH06Index;