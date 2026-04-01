import React, { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  Form,
  Switch,
  message,
  Space,
  Tag,
  Avatar,
  Typography,
  Card,
  Popconfirm,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import TinyEditor from '@/components/TinyEditor';

const { Title } = Typography;

const ClubManagement = (props: any) => {
  // Lấy dữ liệu từ Model th05 truyền qua index.tsx
  const { clubs, setClubs, apps } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMembersOpen, setIsViewMembersOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<any>(null);
  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [form] = Form.useForm();

  // --- XỬ LÝ LƯU DỮ LIỆU ---
  const handleSave = async (values: any) => {
    try {
      if (editingClub) {
        const newClubs = clubs.map((c: any) => 
          c.id === editingClub.id ? { ...c, ...values } : c
        );
        setClubs(newClubs);
        message.success('Cập nhật thông tin CLB thành công!');
      } else {
        const newClub = {
          ...values,
          id: Date.now().toString(),
          avatar: values.avatar || 'https://picsum.photos/id/1005/200',
        };
        setClubs([...clubs, newClub]);
        message.success('Thêm mới câu lạc bộ thành công!');
      }
      setIsModalOpen(false);
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  // --- CẤU HÌNH CỘT CỦA BẢNG ---
  const columns: ProColumns[] = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      search: false,
      width: 70,
      render: (url: any) => (
        <Avatar 
          src={typeof url === 'string' ? url : url?.[0]?.thumbUrl} 
          size={48} 
          shape="square" 
        />
      ),
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      copyable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'established',
      valueType: 'date',
      width: 130,
      sorter: (a, b) => new Date(a.established).getTime() - new Date(b.established).getTime(),
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'president',
      width: 150,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      search: false,
      width: 80,
      render: (text: any) => (
        <Tooltip title="Xem chi tiết mô tả HTML">
          <Button 
            type="text" 
            icon={<InfoCircleOutlined />} 
            onClick={() => Modal.info({
              title: 'Mô tả chi tiết',
              content: <div dangerouslySetInnerHTML={{ __html: text }} />,
              width: 600,
            })}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      width: 120,
      valueEnum: {
        true: { text: 'Có', status: 'Success' },
        false: { text: 'Không', status: 'Error' },
      },
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 160,
      render: (_, record) => [
        <Button 
          key="edit" 
          type="link" 
          icon={<EditOutlined />} 
          onClick={() => {
            setEditingClub(record);
            form.setFieldsValue(record);
            setIsModalOpen(true);
          }} 
        />,
        <Popconfirm 
          key="del" 
          title="Xóa CLB này?" 
          onConfirm={() => {
            setClubs(clubs.filter((c: any) => c.id !== record.id));
            message.success('Đã xóa thành công');
          }}
        >
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>,
        <Button 
          key="mem" 
          type="link" 
          icon={<TeamOutlined />} 
          onClick={() => {
            setSelectedClub(record);
            setIsViewMembersOpen(true);
          }}
        />,
      ],
    },
  ];

  return (
    <Card bordered={false} style={{ background: 'transparent' }}>
      <ProTable
        columns={columns}
        /** * FIX LỖI 2339: Thêm kiểu ': any' vào biến params.
         * Điều này giúp TypeScript hiểu rằng params có thể chứa bất kỳ thuộc tính nào (name, president...)
         */
        request={async (params: any) => {
          const { name, president, active } = params;
          let data = [...clubs];

          if (name) {
            data = data.filter(i => i.name?.toLowerCase().includes(name.toLowerCase()));
          }
          if (president) {
            data = data.filter(i => i.president?.toLowerCase().includes(president.toLowerCase()));
          }
          if (active !== undefined) {
            data = data.filter(i => String(i.active) === active);
          }
          
          return {
            data: data,
            success: true,
          };
        }}
        // Buộc Table load lại khi mảng clubs trong model thay đổi
        params={{ clubs }} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
        search={{ labelWidth: 'auto' }}
        headerTitle={<Title level={4} style={{ margin: 0 }}>Quản lý CLB</Title>}
        toolBarRender={() => [
          <Button 
            key="add" 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingClub(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
          >
            Thêm mới
          </Button>,
        ]}
      />

      {/* MODAL THÊM / SỬA */}
      <Modal
        title={editingClub ? 'Chỉnh sửa Câu lạc bộ' : 'Thêm Câu lạc bộ mới'}
        visible={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        width={750}
        destroyOnClose
        okText="Lưu dữ liệu"
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 20 }}>
          <Form.Item name="avatar" label="Ảnh đại diện (Link URL)">
            <Input placeholder="Nhập link ảnh (ví dụ: https://picsum.photos/200)" />
          </Form.Item>

          <Form.Item 
            name="name" 
            label="Tên câu lạc bộ" 
            rules={[{ required: true, message: 'Tên CLB là bắt buộc' }]}
          >
            <Input placeholder="Nhập tên câu lạc bộ..." />
          </Form.Item>

          <div style={{ display: 'flex', gap: '20px' }}>
            <Form.Item name="established" label="Ngày thành lập" style={{ flex: 1 }}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="president" label="Chủ nhiệm CLB" style={{ flex: 1 }}>
              <Input placeholder="Họ tên người đứng đầu" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Mô tả chi tiết (HTML)">
            <TinyEditor />
          </Form.Item>

          <Form.Item name="active" label="Trạng thái hoạt động" valuePropName="checked">
            <Switch checkedChildren="Đang mở" unCheckedChildren="Tạm dừng" />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL XEM DANH SÁCH THÀNH VIÊN */}
      <Modal
        title={`Thành viên chính thức: ${selectedClub?.name}`}
        visible={isViewMembersOpen}
        onCancel={() => setIsViewMembersOpen(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <ProTable
          search={false}
          toolBarRender={false}
          dataSource={apps?.filter((a: any) => a.clubId === selectedClub?.id && a.status === 'Approved') || []}
          columns={[
            { title: 'Họ tên', dataIndex: 'fullName' },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Số điện thoại', dataIndex: 'phone' },
            { 
              title: 'Trạng thái', 
              render: () => <Tag color="green">Đã tham gia</Tag> 
            },
          ]}
          rowKey="id"
        />
      </Modal>
    </Card>
  );
};

export default ClubManagement;