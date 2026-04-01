import React, { useState, useMemo } from 'react';
import {
  Table, Button, Space, Modal, Input, Tag, Typography,
  Card, message, Popconfirm, Form, Select, Switch, Timeline, Empty, Radio
} from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined, HistoryOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Applications = (props: any) => {
  const { apps, setApps, clubs } = props;

  const [keys, setKeys] = useState<React.Key[]>([]);
  const [rejOpen, setRejOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [rs, setRs] = useState(''); 
  const [logs, setLogs] = useState<any[] | null>(null);
  const [kw, setKw] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('admin'); 
  const [form] = Form.useForm();

  const filteredData = useMemo(() => 
    apps.filter((i: any) => i.fullName?.toLowerCase().includes(kw.toLowerCase())), 
    [apps, kw]
  );

  // --- LOGIC XỬ LÝ ---

  const handleUpdateStatus = (ids: React.Key[], status: string, note?: string) => {
    const lg = {
      admin: 'Quản trị viên',
      action: status,
      date: moment().format('HH:mm DD/MM/YYYY'),
      note: note || (status === 'Approved' ? 'Hồ sơ đạt yêu cầu' : ''),
    };

    const newData = apps.map((item: any) => {
      if (ids.includes(item.id)) {
        return { 
          ...item, 
          status, 
          history: [lg, ...(item.history || [])] 
        };
      }
      return item;
    });

    setApps(newData);
    setKeys([]);
    message.success(`Đã ${status === 'Approved' ? 'Duyệt' : 'Từ chối'} thành công`);
  };

  const handleSave = (values: any) => {
    if (editingItem) {
      const newData = apps.map((i: any) => i.id === editingItem.id ? { ...i, ...values } : i);
      setApps(newData);
      message.success('Cập nhật đơn thành công');
    } else {
      const newApp = {
        id: Date.now().toString(),
        ...values,
        status: 'Pending',
        history: [{
          admin: 'Hệ thống',
          action: 'Tạo đơn',
          date: moment().format('HH:mm DD/MM/YYYY'),
          note: 'Ứng viên nộp đơn đăng ký'
        }],
      };
      setApps([newApp, ...apps]);
      message.success('Đã nộp đơn thành công');
    }
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const columns: any[] = [
    {
      title: 'Thông tin ứng viên',
      dataIndex: 'fullName',
      render: (text: string, record: any) => (
        <div>
          <Text strong>{text}</Text> <br />
          <small>{record.email} - {record.phone}</small>
        </div>
      ),
    },
    {
      title: 'CLB Đăng ký',
      dataIndex: 'clubId',
      render: (id: string) => {
        const club = clubs.find((c: any) => c.id === id);
        return <Tag color="blue">{club?.name || 'N/A'}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => {
        const colors: any = { Pending: 'orange', Approved: 'green', Rejected: 'red' };
        const labels: any = { Pending: 'Chờ duyệt', Approved: 'Đã duyệt', Rejected: 'Từ chối' };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: 'Lịch sử',
      align: 'center',
      render: (_: any, record: any) => (
        <Button size="small" icon={<HistoryOutlined />} onClick={() => setLogs(record.history)}>Xem</Button>
      ),
    },
    {
      title: 'Thao tác',
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          {/* Nút sửa chỉ hiện cho Admin hoặc User khi đơn đang Pending */}
          {(role === 'admin' || record.status === 'Pending') && (
            <Button 
              size="small" 
              icon={<EditOutlined />} 
              onClick={() => {
                setEditingItem(record);
                form.setFieldsValue(record);
                setIsModalOpen(true);
              }} 
            />
          )}
          {role === 'admin' && (
            <Popconfirm title="Xóa đơn này?" onConfirm={() => setApps(apps.filter((a: any) => a.id !== record.id))}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Input.Search 
            placeholder="Tìm ứng viên..." 
            onSearch={setKw} 
            onChange={(e) => setKw(e.target.value)}
            style={{ width: 200 }} 
          />
          <Switch 
            checkedChildren="ADMIN" unCheckedChildren="USER" 
            checked={role === 'admin'} onChange={(v) => {
              setRole(v ? 'admin' : 'user');
              setKeys([]); // Reset chọn hàng loạt khi đổi quyền
            }} 
          />
        </Space>
        
        {/* CHỖ SỬA QUAN TRỌNG: Chỉ User mới thấy nút Tạo đơn */}
        {role === 'user' && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }}>
            Tạo đơn đăng ký
          </Button>
        )}
      </div>

      {role === 'admin' && keys.length > 0 && (
        <div style={{ marginBottom: 16, padding: '10px', background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '4px' }}>
          <Text strong>Quản lý {keys.length} đơn đã chọn: </Text>
          <Space style={{ marginLeft: 16 }}>
            <Button type="primary" onClick={() => handleUpdateStatus(keys, 'Approved')}>Duyệt hàng loạt</Button>
            <Button danger onClick={() => setRejOpen(true)}>Từ chối hàng loạt</Button>
          </Space>
        </div>
      )}

      <Table
        rowKey="id"
        // Chỉ Admin mới có checkbox chọn nhiều hàng
        rowSelection={role === 'admin' ? { selectedRowKeys: keys, onChange: setKeys } : undefined}
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        bordered
      />

      <Modal 
        title={editingItem ? 'Sửa thông tin đơn' : 'Nộp đơn đăng ký mới'} 
        visible={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 15 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="gender" label="Giới tính" initialValue="Nam">
              <Radio.Group><Radio value="Nam">Nam</Radio><Radio value="Nữ">Nữ</Radio></Radio.Group>
            </Form.Item>
            <Form.Item name="clubId" label="Câu lạc bộ" rules={[{ required: true }]}>
              <Select options={clubs.map((c: any) => ({ label: c.name, value: c.id }))} />
            </Form.Item>
          </div>
          <Form.Item name="address" label="Địa chỉ"><Input /></Form.Item>
          <Form.Item name="strength" label="Sở trường"><Input /></Form.Item>
          <Form.Item name="reason" label="Lý do đăng ký"><TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận từ chối"
        visible={rejOpen}
        onCancel={() => setRejOpen(false)}
        onOk={() => {
          if (!rs.trim()) return message.warning('Bắt buộc nhập lý do từ chối!');
          handleUpdateStatus(keys, 'Rejected', rs);
          setRs('');
          setRejOpen(false);
        }}
      >
        <Text strong>Lý do từ chối:</Text>
        <TextArea value={rs} onChange={(e) => setRs(e.target.value)} rows={4} style={{ marginTop: 10 }} />
      </Modal>

      <Modal title="Lịch sử thao tác" visible={!!logs} onCancel={() => setLogs(null)} footer={null}>
        {logs && logs.length > 0 ? (
          <Timeline style={{ marginTop: 20 }}>
            {logs.map((l, i) => (
              <Timeline.Item key={i} color={l.action === 'Approved' ? 'green' : l.action === 'Rejected' ? 'red' : 'blue'}>
                <Text strong>{l.admin}</Text> - <Tag>{l.action}</Tag> <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>{l.date}</Text>
                <div style={{ marginTop: 5, padding: '5px', background: '#f5f5f5' }}>{l.note}</div>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : <Empty />}
      </Modal>
    </Card>
  );
};

export default Applications;