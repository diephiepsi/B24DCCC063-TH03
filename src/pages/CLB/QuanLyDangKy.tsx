import React, { useState } from 'react';
import { Table, Button, Space, Modal, Input, Tag, message, Typography, Card, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	HistoryOutlined,
	EditOutlined,
	DeleteOutlined,
	UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface RegistrationHistory {
	adminName: string;
	action: RegistrationStatus;
	time: string;
	reason?: string;
}

export interface RegistrationRecord {
	id: string;
	fullName: string;
	email: string;
	phone: string;
	gender: 'Male' | 'Female' | 'Other';
	address: string;
	talent: string;
	clubId: string;
	clubName: string;
	reason: string;
	status: RegistrationStatus;
	note?: string;
	history: RegistrationHistory[];
}

const QuanLyDangKy = () => {
	const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
	const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);
	const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
	const [rejectReason, setRejectReason] = useState('');
	const [currentHistory, setCurrentHistory] = useState<RegistrationHistory[] | null>(null);

	const updateStatus = (ids: React.Key[], newStatus: RegistrationStatus, reason?: string) => {
		const timestamp = moment().format('HH:mm DD/MM/YYYY');
		const historyEntry: RegistrationHistory = {
			adminName: 'Quản trị viên',
			action: newStatus,
			time: timestamp,
			reason: reason || (newStatus === 'Approved' ? 'Đã phê duyệt' : ''),
		};

		const updatedList = registrations.map((item) => {
			if (ids.includes(item.id)) {
				return {
					...item,
					status: newStatus,
					note: reason,
					history: [historyEntry, ...item.history],
				};
			}
			return item;
		});

		setRegistrations(updatedList);
		setSelectedIds([]);
		message.success(`Thực hiện thành công cho ${ids.length} bản ghi`);
	};

	const onApproveBatch = () => {
		Modal.confirm({
			title: 'Xác nhận phê duyệt',
			content: `Bạn có chắc chắn muốn duyệt ${selectedIds.length} đơn đăng ký đã chọn?`,
			okText: 'Xác nhận',
			cancelText: 'Hủy',
			onOk: () => updateStatus(selectedIds, 'Approved'),
		});
	};

	const onRejectBatch = () => {
		if (!rejectReason.trim()) {
			return message.error('Vui lòng nhập lý do từ chối!');
		}
		updateStatus(selectedIds, 'Rejected', rejectReason);
		setIsRejectModalVisible(false);
		setRejectReason('');
	};

	const columns: ColumnsType<RegistrationRecord> = [
		{
			title: 'Thông tin ứng viên',
			key: 'userInfo',
			render: (_, record) => (
				<Space direction='vertical' size={0}>
					<Text strong style={{ fontSize: '15px' }}>
						{record.fullName}
					</Text>
					<Text type='secondary' style={{ fontSize: '12px' }}>
						{record.email}
					</Text>
					<Text type='secondary' style={{ fontSize: '12px' }}>
						{record.phone}
					</Text>
				</Space>
			),
			sorter: (a, b) => a.fullName.localeCompare(b.fullName),
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'clubName',
			render: (name) => (
				<Tag icon={<UserOutlined />} color='blue'>
					{name}
				</Tag>
			),
			filters: [
				{ text: 'CLB IT', value: 'IT' },
				{ text: 'CLB Marketing', value: 'Marketing' },
			],
			onFilter: (value, record) => record.clubName.includes(value as string),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			align: 'center',
			render: (status: RegistrationStatus) => {
				const config = {
					Pending: { color: 'orange', text: 'Chờ duyệt' },
					Approved: { color: 'green', text: 'Thành viên' },
					Rejected: { color: 'red', text: 'Từ chối' },
				};
				return (
					<Tag color={config[status].color} style={{ borderRadius: '10px', padding: '0 10px' }}>
						{config[status].text.toUpperCase()}
					</Tag>
				);
			},
		},
		{
			title: 'Hành động',
			key: 'action',
			align: 'center',
			render: (_, record) => (
				<Space split={<span style={{ color: '#eee' }}>|</span>}>
					<Tooltip title='Xem lịch sử thao tác'>
						<Button
							type='text'
							icon={<HistoryOutlined style={{ color: '#1890ff' }} />}
							onClick={() => setCurrentHistory(record.history)}
						/>
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button type='text' icon={<EditOutlined style={{ color: '#faad14' }} />} />
					</Tooltip>
					<Tooltip title='Xóa đơn'>
						<Button type='text' danger icon={<DeleteOutlined />} />
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
				<Title level={3} style={{ margin: 0 }}>
					Quản lý đơn đăng ký
				</Title>
				<Space>
					<Button
						type='primary'
						icon={<CheckCircleOutlined />}
						disabled={selectedIds.length === 0}
						onClick={onApproveBatch}
						style={{ borderRadius: '6px' }}
					>
						Duyệt nhanh ({selectedIds.length})
					</Button>
					<Button
						danger
						icon={<CloseCircleOutlined />}
						disabled={selectedIds.length === 0}
						onClick={() => setIsRejectModalVisible(true)}
						style={{ borderRadius: '6px' }}
					>
						Từ chối ({selectedIds.length})
					</Button>
				</Space>
			</div>

			<Table
				rowSelection={{
					selectedRowKeys: selectedIds,
					onChange: (keys) => setSelectedIds(keys),
				}}
				columns={columns}
				dataSource={registrations}
				rowKey='id'
				pagination={{ pageSize: 8 }}
				style={{ border: '1px solid #f0f0f0', borderRadius: '8px' }}
			/>

			<Modal
				title={
					<Text strong style={{ fontSize: '18px' }}>
						Xác nhận từ chối đơn
					</Text>
				}
				visible={isRejectModalVisible}
				onOk={onRejectBatch}
				onCancel={() => setIsRejectModalVisible(false)}
				okText='Gửi thông báo từ chối'
				okButtonProps={{ danger: true, style: { borderRadius: '6px' } }}
				cancelButtonProps={{ style: { borderRadius: '6px' } }}
			>
				<Paragraph>
					Bạn đang thực hiện từ chối <b>{selectedIds.length}</b> đơn đăng ký. Vui lòng nhập lý do cụ thể để gửi cho ứng
					viên:
				</Paragraph>
				<TextArea
					rows={4}
					placeholder='Ví dụ: Thông tin không đầy đủ hoặc không phù hợp với tiêu chí câu lạc bộ...'
					value={rejectReason}
					onChange={(e) => setRejectReason(e.target.value)}
					style={{ borderRadius: '8px' }}
				/>
			</Modal>

			<Modal
				title={
					<Text strong style={{ fontSize: '18px' }}>
						Lịch sử phê duyệt
					</Text>
				}
				visible={!!currentHistory}
				onCancel={() => setCurrentHistory(null)}
				footer={null}
				width={500}
			>
				<div style={{ padding: '10px 0' }}>
					{currentHistory?.map((item, index) => (
						<div
							key={index}
							style={{
								padding: '12px',
								marginBottom: '10px',
								background: '#fafafa',
								borderRadius: '8px',
								borderLeft: `4px solid ${item.action === 'Approved' ? '#52c41a' : '#f5222d'}`,
							}}
						>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
								<Text strong>{item.adminName}</Text>
								<Text type='secondary' style={{ fontSize: '12px' }}>
									{item.time}
								</Text>
							</div>
							<Tag color={item.action === 'Approved' ? 'green' : 'red'}>
								{item.action === 'Approved' ? 'ĐÃ DUYỆT' : 'TỪ CHỐI'}
							</Tag>
							{item.reason && (
								<div style={{ marginTop: '8px', color: '#595959', fontSize: '13px' }}>
									<b>Ghi chú:</b> {item.reason}
								</div>
							)}
						</div>
					))}
					{(!currentHistory || currentHistory.length === 0) && (
						<div style={{ textAlign: 'center', padding: '30px' }}>
							<Text type='secondary'>Chưa có dữ liệu lịch sử</Text>
						</div>
					)}
				</div>
			</Modal>
		</Card>
	);
};

export default QuanLyDangKy;
