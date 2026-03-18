import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import { useModel } from 'umi'; 
import CauHinhBieuMau from './CauHinhBieuMau';
import ThongTinVanBang from './ThongTinVanBang';
import TraCuuVanBang from './TraCuuVanBang';
import { QuyetDinh, SoVanBang } from './utils';
import QuanLy from './KetHop';

const Bai4Main = () => {
	const storageModel = useModel('TH04.localStorage');

	return (
		<PageContainer title='HỆ THỐNG QUẢN LÝ VĂN BẰNG (TH04) - PTIT'>
			<Tabs type='card' style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
				<Tabs.TabPane tab='1. Cấu hình biểu mẫu' key='1'>
					<CauHinhBieuMau {...storageModel} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='2. Quyết định & Sổ' key='2'>
					
				</Tabs.TabPane>
				<Tabs.TabPane tab='3. Thông tin văn bằng' key='3'>
					<ThongTinVanBang {...storageModel} />
				</Tabs.TabPane>
				<Tabs.TabPane tab='4. Tra cứu văn bằng' key='4'>
					<TraCuuVanBang {...storageModel} />
				</Tabs.TabPane>
			</Tabs>
		</PageContainer>
	);
};

export default Bai4Main;
