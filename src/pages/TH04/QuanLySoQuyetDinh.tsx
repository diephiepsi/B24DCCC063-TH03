import { useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
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
		{ title: 'ID', dataIndex: 'id' },
		{ title: 'Năm', dataIndex: 'year' },
		{ title: 'Số hiện tại', dataIndex: 'currentNumber' },
		{
			title: 'Thao tác',
			render: (_: any, record: SoVanBang) => (
				<>
					<Button type='link' onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Button type='link' danger onClick={() => handleDelete(record.id)}>
						Xóa
					</Button>
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
		message.success('Đã xóa sổ');
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			if (editing) {
				setSoVanBang(soVanBang.map((item) => (item.id === editing.id ? { ...item, ...values } : item)));
				message.success('Cập nhật sổ thành công');
			} else {
				const newItem: SoVanBang = {
					id: Date.now(),
					year: values.year,
					currentNumber: 0,
				};
				setSoVanBang([...soVanBang, newItem]);
				message.success('Thêm sổ thành công');
			}
			setOpen(false);
			form.resetFields();
		} catch {
			message.error('Lỗi');
		}
	};

	return (
		<div style={{ marginBottom: 24, padding: 16, background: '#fff' }}>
			<h3>Quản lý sổ văn bằng</h3>
			<Button type='primary' onClick={handleAdd} style={{ marginBottom: 12 }}>
				Thêm
			</Button>
			<Table rowKey='id' columns={columns} dataSource={soVanBang} />
			<Modal visible={open} title={editing ? 'Sửa sổ' : 'Thêm sổ'} onOk={handleSubmit} onCancel={() => setOpen(false)}>
				<Form form={form} layout='vertical'>
					<Form.Item name='year' label='Năm' rules={[{ required: true, message: 'Nhập năm' }]}>
						<Input type='number' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default SoVanBangForm;
