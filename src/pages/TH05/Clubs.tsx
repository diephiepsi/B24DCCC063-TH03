import React from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Tag, Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormSwitch, ProFormDatePicker } from '@ant-design/pro-form';

export default ({ clubs, setClubs, apps }: any) => {
  const columns = [
    { title: 'Ảnh', dataIndex: 'avatar', valueType: 'avatar', search: false },
    { title: 'Tên CLB', dataIndex: 'name', copyable: true, sorter: true },
    { title: 'Chủ nhiệm', dataIndex: 'leader' },
    { title: 'Trạng thái', dataIndex: 'isActive', render: (v: any) => v ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Dừng</Tag> },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Space>
          <ModalForm title="Sửa CLB" initialValues={record} onFinish={async (v) => setClubs(clubs.map((c: any) => c.id === record.id ? {...v, id: c.id} : c))}>
            <a>Sửa</a>
          </ModalForm>
          <Popconfirm title="Xóa?" onConfirm={() => setClubs(clubs.filter((c: any) => c.id !== record.id))}><a style={{color:'red'}}>Xóa</a></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <ProTable
      dataSource={clubs}
      columns={columns}
      rowKey="id"
      toolBarRender={() => [
        <ModalForm
          title="Thêm CLB mới"
          trigger={<Button type="primary" icon={<PlusOutlined />}>Thêm CLB</Button>}
          onFinish={async (v: any) => setClubs([...clubs, { ...v, id: Date.now().toString() }])}
        >
          <ProFormText name="name" label="Tên CLB" rules={[{required: true}]} />
          <ProFormText name="leader" label="Chủ nhiệm" />
          <ProFormDatePicker name="foundedDate" label="Ngày thành lập" />
          <ProFormSwitch name="isActive" label="Hoạt động" />
        </ModalForm>
      ]}
    />
  );
};