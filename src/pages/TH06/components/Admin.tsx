import React, { useState } from 'react';
import {
	Row,
	Col,
	Card,
	Button,
	Modal,
	Form,
	Input,
	Select,
	InputNumber,
	Rate,
	Space,
	Popconfirm,
	message,
	Statistic,
} from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ColumnChart from '@/components/Chart/ColumnChart';

const { Option } = Select;

const Admin = ({ destinations, setDestinations, itinerary }: any) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<any>(null);
	const [form] = Form.useForm();

	const handleSave = (values: any) => {
		const price = (values.foodCost || 0) + (values.stayCost || 0) + (values.moveCost || 0);
		const dataToSave = { ...values, price };
		if (editingItem) {
			setDestinations(destinations.map((d: any) => (d.id === editingItem.id ? { ...d, ...dataToSave } : d)));
			message.success('Cập nhật thành công');
		} else {
			const newItem = { ...dataToSave, id: Date.now().toString() };
			setDestinations([...destinations, newItem]);
			message.success('Đã thêm điểm đến mới');
		}
		setIsModalOpen(false);
	};

	const columns: ProColumns[] = [
		{
			title: 'Ảnh',
			dataIndex: 'image',
			search: false,
			width: 80,
			render: (url: any) => (
				<img src={url} alt='img' style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
			),
		},
		{ title: 'Tên điểm đến', dataIndex: 'name' },
		{
			title: 'Loại hình',
			dataIndex: 'type',
			valueEnum: { beach: { text: 'Biển' }, mountain: { text: 'Núi' }, city: { text: 'Thành phố' } },
		},
		{ title: 'Địa điểm', dataIndex: 'location' },
		{
			title: 'Đánh giá',
			dataIndex: 'rating',
			search: false,
			render: (val: any) => <Rate disabled defaultValue={val} allowHalf style={{ fontSize: 12 }} />,
		},
		{ title: 'Thời gian', dataIndex: 'timeToVisit', search: false, render: (val: any) => `${val} giờ` },
		{
			title: 'Chi phí ước tính',
			search: false,
			render: (_: any, r: any) => (
				<Space direction='vertical' size={0}>
					<small>Ăn uống: {r.foodCost?.toLocaleString()} đ</small>
					<small>Lưu trú: {r.stayCost?.toLocaleString()} đ</small>
					<small>Di chuyển: {r.moveCost?.toLocaleString()} đ</small>
					<small style={{ fontWeight: 'bold' }}>
						Tổng:{' '}
						{r.price?.toLocaleString() || ((r.foodCost || 0) + (r.stayCost || 0) + (r.moveCost || 0)).toLocaleString()}{' '}
						đ
					</small>
				</Space>
			),
		},
		{
			title: 'Thao tác',
			valueType: 'option',
			render: (_: any, record: any) => [
				<Button
					key='edit'
					type='text'
					icon={<EditOutlined />}
					onClick={() => {
						setEditingItem(record);
						form.setFieldsValue(record);
						setIsModalOpen(true);
					}}
				/>,
				<Popconfirm
					key='del'
					title='Xóa điểm đến?'
					onConfirm={() => {
						setDestinations(destinations.filter((d: any) => d.id !== record.id));
						message.success('Xóa thành công');
					}}
				>
					<Button danger type='text' icon={<DeleteOutlined />} />
				</Popconfirm>,
			],
		},
	];

	const popData = destinations.map((d: any) => ({
		name: d.name,
		count: itinerary?.filter((i: any) => i.id === d.id).length || 0,
	}));

	const chartData = {
		xAxis: popData.map((d: any) => d.name),
		yAxis: [popData.map((d: any) => d.count)],
		yLabel: ['Số lượt xếp vào lịch trình'],
	};

	const totalRevenue =
		itinerary?.reduce(
			(sum: number, i: any) => sum + (i.price || (i.foodCost || 0) + (i.stayCost || 0) + (i.moveCost || 0)),
			0,
		) || 0;

	return (
		<div>
			<Row gutter={[24, 24]}>
				<Col xs={24}>
					<ProTable
						headerTitle='Quản lý thư viện điểm đến'
						request={async (params: any) => {
							const { name, type } = params;
							let data = [...destinations];
							if (name) data = data.filter((i) => i.name?.toLowerCase().includes(name.toLowerCase()));
							if (type) data = data.filter((i) => i.type === type);
							return { data, success: true };
						}}
						params={{ destinations }}
						columns={columns}
						rowKey='id'
						pagination={{ pageSize: 5 }}
						search={{ labelWidth: 'auto' }}
						toolBarRender={() => [
							<Button
								key='add'
								type='primary'
								icon={<PlusOutlined />}
								onClick={() => {
									setEditingItem(null);
									form.resetFields();
									setIsModalOpen(true);
								}}
							>
								Thêm điểm đến
							</Button>,
						]}
					/>
				</Col>
				<Col xs={24} lg={8}>
					<Card title='Thống kê hệ thống' style={{ height: '100%' }}>
						<Row gutter={16}>
							<Col span={12}>
								<Statistic title='Lượt lập lịch' value={itinerary?.length || 0} />
							</Col>
							<Col span={12}>
								<Statistic title='Tổng ngân sách người dùng' value={totalRevenue} suffix='VNĐ' />
							</Col>
						</Row>
					</Card>
				</Col>
				<Col xs={24} lg={16}>
					<Card title='Điểm đến phổ biến' style={{ height: '100%' }}>
						<ColumnChart {...chartData} height={200} />
					</Card>
				</Col>
			</Row>

			<Modal
				title={editingItem ? 'Cập nhật điểm đến' : 'Thêm mới điểm đến'}
				visible={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				onOk={() => form.submit()}
				width={650}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={handleSave}>
					<Row gutter={16}>
						<Col span={16}>
							<Form.Item name='name' label='Tên địa danh' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='type' label='Loại hình' rules={[{ required: true }]}>
								<Select>
									<Option value='beach'>Biển</Option>
									<Option value='mountain'>Núi</Option>
									<Option value='city'>Thành phố</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='location' label='Vị trí / Địa điểm'>
								<Input />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='description' label='Mô tả'>
								<Input.TextArea rows={2} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='image' label='Link hình đại diện (URL)' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='timeToVisit' label='Thời gian tham quan (Giờ)' rules={[{ required: true }]}>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='rating' label='Đánh giá' rules={[{ required: true }]}>
								<Rate allowHalf />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='foodCost' label='Phí Ăn uống (VNĐ)' rules={[{ required: true }]}>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='stayCost' label='Phí Lưu trú (VNĐ)' rules={[{ required: true }]}>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='moveCost' label='Phí Di chuyển (VNĐ)' rules={[{ required: true }]}>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};
export default Admin;
