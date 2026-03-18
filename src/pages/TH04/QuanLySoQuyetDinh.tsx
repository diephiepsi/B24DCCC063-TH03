import { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { SoVanBang } from './utils';

type Props = {
	soVanBang: SoVanBang[];
	setSoVanBang: React.Dispatch<React.SetStateAction<SoVanBang[]>>;
};

const SoVanBangForm = ({ soVanBang, setSoVanBang }: Props) => {
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<SoVanBang | null>(null);
	const [form] = Form.useForm();

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
		},
		{
			title: 'Năm',
			dataIndex: 'year',
		},
		{
			title: 'Số hiện tại',
			dataIndex: 'currentNumber',
		},
		{
			title: 'Thao tác',
			render: (_: any, record: SoVanBang) => (
				<>
					<Button type='link' onClick={() => handleEdit(record)}>
						Xem
					</Button>

					<Popconfirm title='Xóa sổ này?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</>
			),
		},
	];

	const handleAdd = () => {
		setEditing(null);
		form.resetFields();
		setOpen(true);
	};

	const handleEdit = (record: SoVanBang) => {
		setEditing(record);
		form.setFieldsValue(record);
		setOpen(true);
	};

	const handleDelete = (id: number) => {
		setSoVanBang(soVanBang.filter((item) => item.id !== id));
		message.success('Đã xóa');
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			const year = Number(values.year);

			const existed = soVanBang.find((item) => item.year === year);

			if (existed) {
				message.error('Năm đã tồn tại');
				return;
			}

			const newItem: SoVanBang = {
				id: Date.now(),
				year,
				currentNumber: 1,
			};

			setSoVanBang([...soVanBang, newItem]);
			message.success('Thêm thành công');

			setOpen(false);
			form.resetFields();
		} catch {
			message.error('Lỗi nhập liệu');
		}
	};

	return (
		<div style={{ padding: 16, background: '#fff' }}>
			<h3>Quản lý sổ văn bằng</h3>

			<Button type='primary' onClick={handleAdd} style={{ marginBottom: 12 }}>
				Thêm
			</Button>

			<Table rowKey='id' columns={columns} dataSource={[...soVanBang].sort((a, b) => b.year - a.year)} />

			<Modal visible={open} title={editing ? 'Chi tiết' : 'Thêm'} onOk={handleSubmit} onCancel={() => setOpen(false)}>
				<Form form={form}>
					<Form.Item name='year' label='Năm' rules={[{ required: true, message: 'Nhập năm' }]}>
						<Input type='number' disabled={!!editing} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default SoVanBangForm;
