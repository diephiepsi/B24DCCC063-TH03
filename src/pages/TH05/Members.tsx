import React, { useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, message, Tag, Space, Alert } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';

const Members = (props: any) => {
  const { apps, setApps, clubs } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Lọc danh sách
  const memberData = apps.filter((item: any) => item.status === 'Approved');

  // Hàm xử lý đổi CLB cho 1 hoặc nhiều người
  const handleChangeClub = async (values: { targetClubId: string }) => {
    const newApps = apps.map((item: any) => {
      if (selectedRowKeys.includes(item.id)) {
        return { ...item, clubId: values.targetClubId };
      }
      return item;
    });
    
    setApps(newApps);
    setSelectedRowKeys([]); // Reset lựa chọn sau khi xong
    message.success(`Đã chuyển ${selectedRowKeys.length} thành viên sang CLB mới thành công!`);
    return true;
  };

  const columns: ProColumns[] = [
    { title: 'Họ tên', dataIndex: 'fullName', copyable: true },
    { title: 'Email', dataIndex: 'email', search: false },
    { title: 'Số điện thoại', dataIndex: 'phone' },
    { 
      title: 'Câu lạc bộ hiện tại', 
      dataIndex: 'clubId',
      render: (id: any) => {
        const club = clubs.find((c: any) => c.id === id);
        return <Tag color="blue">{club?.name || 'N/A'}</Tag>;
      },
      // Cho phép lọc theo CLB ngay trên bảng
      valueEnum: clubs.reduce((acc: any, curr: any) => {
        acc[curr.id] = { text: curr.name };
        return acc;
      }, {}),
    },
    { title: 'Sở trường', dataIndex: 'strength', search: false },
  ];

  return (
    <ProTable
      headerTitle="Danh sách thành viên chính thức"
      dataSource={memberData}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      // Cấu hình chọn nhiều dòng
      rowSelection={{
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
      }}
      // Hiển thị thanh công cụ khi có dòng được chọn
      tableAlertRender={({ selectedRowKeys }) => (
        <Space size={24}>
          <span>Đã chọn <b>{selectedRowKeys.length}</b> thành viên</span>
          <a onClick={() => setSelectedRowKeys([])}>Bỏ chọn</a>
        </Space>
      )}
      tableAlertOptionRender={() => (
        <ModalForm
          title="Thay đổi Câu lạc bộ"
          trigger={
            <Button type="primary" icon={<SwapOutlined />}>
              Chuyển CLB ({selectedRowKeys.length})
            </Button>
          }
          onFinish={handleChangeClub}
          modalProps={{ destroyOnClose: true }}
          width={400}
        >
          <Alert 
            message={`Bạn đang thực hiện đổi CLB cho ${selectedRowKeys.length} thành viên đã chọn.`}
type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />
          <ProFormSelect
            name="targetClubId"
            label="Chọn Câu lạc bộ muốn chuyển đến"
            options={clubs.map((c: any) => ({ label: c.name, value: c.id }))}
            rules={[{ required: true, message: 'Vui lòng chọn CLB đích!' }]}
          />
        </ModalForm>
      )}
    />
  );
};

export default Members;