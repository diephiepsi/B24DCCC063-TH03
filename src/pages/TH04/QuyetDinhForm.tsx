import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { QuyetDinh, SoVanBang } from './utils';

type Props = {
	quyetDinh: QuyetDinh[];
	setQuyetDinh: React.Dispatch<React.SetStateAction<QuyetDinh[]>>;
	soVanBang: SoVanBang[];
};

const QuyetDinhForm = ({ quyetDinh, setQuyetDinh, soVanBang }: Props) => {
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<QuyetDinh | null>(null);
	const [form] = Form.useForm();

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
		},
		{
			title: 'Số quyết định',
			dataIndex: 'soQD',
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'ngayBanHanh',
			render: (text: string) => new Date(text).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Trích yếu',
			dataIndex: 'trichYeu',
		},
		{
			title: 'Sổ văn bằng',
			dataIndex: 'soVanBangId',
			render: (id: number) => {
				const so = soVanBang.find((s) => s.id === id);
				return so ? `Năm ${so.year}` : '';
			},
		},
		{
			title: 'Thao tác',
			render: (_: any, record: QuyetDinh) => (
				<>
					<Button type='link' onClick={() => handleEdit(record)}>
						Sửa
					</Button>

					<Popconfirm title='Xóa?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</>
			),
		},
	];

	const handleAdd = () => {
		if (soVanBang.length === 0) {
			message.warning('Tạo sổ trước');
			return;
		}

		setEditing(null);
		form.resetFields();
		setOpen(true);
	};

	const handleEdit = (record: QuyetDinh) => {
		setEditing(record);
		form.setFieldsValue(record);
		setOpen(true);
	};

	const handleDelete = (id: number) => {
		setQuyetDinh(quyetDinh.filter((item) => item.id !== id));
		message.success('Đã xóa');
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			const existed = quyetDinh.find((item) => item.soQD === values.soQD && item.id !== editing?.id);

			if (existed) {
				message.error('Trùng số quyết định');
				return;
			}

			if (editing) {
				setQuyetDinh(quyetDinh.map((item) => (item.id === editing.id ? { ...item, ...values } : item)));
				message.success('Cập nhật');
			} else {
				const newItem: QuyetDinh = {
					id: Date.now(),
					soQD: values.soQD,
					ngayBanHanh: values.ngayBanHanh,
					trichYeu: values.trichYeu,
					soVanBangId: values.soVanBangId,
				};

				setQuyetDinh([...quyetDinh, newItem]);
				message.success('Thêm');
			}

			setOpen(false);
			form.resetFields();
		} catch {
			message.error('Lỗi');
		}
	};

	return (
		<div style={{ marginTop: 24, padding: 16, background: '#fff' }}>
			<h3>Quản lý quyết định</h3>

			<Button type='primary' onClick={handleAdd} style={{ marginBottom: 12 }}>
				Thêm
			</Button>

			<Table rowKey='id' columns={columns} dataSource={quyetDinh} />

			<Modal visible={open} title={editing ? 'Sửa' : 'Thêm'} onOk={handleSubmit} onCancel={() => setOpen(false)}>
				<Form form={form} layout='vertical'>
					<Form.Item name='soQD' label='Số quyết định' rules={[{ required: true, message: 'Nhập' }]}>
						<Input />
					</Form.Item>

					<Form.Item name='ngayBanHanh' label='Ngày' rules={[{ required: true, message: 'Chọn' }]}>
						<Input type='date' />
					</Form.Item>

					<Form.Item name='trichYeu' label='Trích yếu' rules={[{ required: true, message: 'Nhập' }]}>
						<Input />
					</Form.Item>

					<Form.Item name='soVanBangId' label='Sổ' rules={[{ required: true, message: 'Chọn' }]}>
						<Select>
							{soVanBang.map((so) => (
								<Select.Option key={so.id} value={so.id}>
									Năm {so.year}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuyetDinhForm;
