import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs, Card } from 'antd';
import { useModel } from 'umi';

import Clubs from './Clubs';
import Applications from './Applications';
import Members from './Members';
import Reports from './Reports';

const { TabPane } = Tabs;

const TH05Index: React.FC = () => {
	const model = useModel('localStorage.th05' as any);

	return (
		<PageContainer title='HỆ THỐNG QUẢN LÝ CÂU LẠC BỘ (TH05)'>
			<Card bordered={false}>
				<Tabs defaultActiveKey='1' type='card'>
					<TabPane tab='1. Danh sách CLB' key='1'>
						<Clubs {...model} />
					</TabPane>

					<TabPane tab='2. Đơn đăng ký' key='2'>
						<Applications {...model} />
					</TabPane>

					<TabPane tab='3. Thành viên' key='3'>
						<Members {...model} />
					</TabPane>

					<TabPane tab='4. Thống kê' key='4'>
						<Reports {...model} />
					</TabPane>
				</Tabs>
			</Card>
		</PageContainer>
	);
};

export default TH05Index;
