import React, { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Modal, Input, Space, message } from 'antd';

export default ({ apps, setApps, clubs }: any) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleProcess = (ids: string[], status: 'Approved' | 'Rejected', reason?: string) => {
    const newApps = apps.map((item: any) => {
      if (ids.includes(item.id)) {
        const log = { admin: 'Admin', time: new Date().toLocaleString(), action: status, reason };
        return { ...item, status, note: reason, history: [...(item.history || []), log] };
      }
      return item;
    });
    setApps(newApps);
    setSelectedKeys([]);
    message.success(`Đã xử lý ${ids.length} đơn`);
  };

  return (
    <ProTable
      dataSource={apps}
      rowSelection={{ onChange: (keys: any) => setSelectedKeys(keys) }}
      tableAlertRender={({ selectedRowKeys }) => (
        <Space size={24}>
          <span>Đã chọn {selectedRowKeys.length} đơn</span>
          <Button type="primary" size="small" onClick={() => handleProcess(selectedRowKeys as string[], 'Approved')}>Duyệt nhanh</Button>
          <Button danger size="small" onClick={() => {
            Modal.confirm({
              title: 'Lý do từ chối',
              content: <Input.TextArea id="rej_reason" />,
              onOk: () => {
                const reason = (document.getElementById('rej_reason') as HTMLTextAreaElement).value;
                handleProcess(selectedRowKeys as string[], 'Rejected', reason);
              }
            });
          }}>Từ chối nhanh</Button>
        </Space>
      )}
      columns={[
        { title: 'Họ tên', dataIndex: 'fullName' },
        { title: 'CLB', dataIndex: 'clubId', valueEnum: clubs.reduce((acc: any, c: any) => ({...acc, [c.id]: c.name}), {}) },
        { title: 'Trạng thái', dataIndex: 'status', valueEnum: { Pending: {text: 'Chờ', status: 'Warning'}, Approved: {text: 'Đã duyệt', status: 'Success'}, Rejected: {text: 'Từ chối', status: 'Error'} } },
      ]}
    />
  );
};