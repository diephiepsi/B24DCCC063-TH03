import { useState } from 'react';
import SoVanBangForm from './QuanLySoQuyetDinh';
import QuyetDinhForm from './QuyetDinhForm';
import { SoVanBang, QuyetDinh } from './utils';

const QuanLy = () => {
	const [soVanBang, setSoVanBang] = useState<SoVanBang[]>([]);
	const [quyetDinh, setQuyetDinh] = useState<QuyetDinh[]>([]);

	return (
		<div style={{ padding: 24 }}>
			<SoVanBangForm soVanBang={soVanBang} setSoVanBang={setSoVanBang} />

			<QuyetDinhForm quyetDinh={quyetDinh} setQuyetDinh={setQuyetDinh} soVanBang={soVanBang} />
		</div>
	);
};

export default QuanLy;
