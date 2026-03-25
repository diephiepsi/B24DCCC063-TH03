import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import { useModel } from 'umi';
import Clubs from './Clubs';
import Applications from './Applications';
import Members from './Members';
import Reports from './Reports';

const TH05Index = () => {
  const model = useModel('localStorage.th05'); 

  return (
    <PageContainer title="QUẢN LÝ CÂU LẠC BỘ (TH05)">
      <Tabs type="card">
        <Tabs.TabPane tab="1. Danh sách CLB" key="1"><Clubs {...model} /></Tabs.TabPane>
        <Tabs.TabPane tab="2. Đơn đăng ký" key="2"><Applications {...model} /></Tabs.TabPane>
        <Tabs.TabPane tab="3. Thành viên" key="3"><Members {...model} /></Tabs.TabPane>
        <Tabs.TabPane tab="4. Thống kê" key="4"><Reports {...model} /></Tabs.TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default TH05Index;