import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';

export default ({ apps, setApps, clubs }: any) => {
  const members = apps.filter((a: any) => a.status === 'Approved');

  const moveClub = (ids: string[], targetClbId: string) => {
    setApps(apps.map((a: any) => ids.includes(a.id) ? {...a, clubId: targetClbId} : a));
  };

  return (
    <ProTable
      dataSource={members}
      rowSelection={{}}
      tableAlertRender={({ selectedRowKeys }) => (
        <ModalForm
          title={`Chuyển CLB cho ${selectedRowKeys.length} thành viên`}
          trigger={<Button size="small">Chuyển CLB</Button>}
          onFinish={async (v) => { moveClub(selectedRowKeys as string[], v.targetId); return true; }}
        >
          <ProFormSelect name="targetId" label="Chọn CLB mới" options={clubs.map((c:any) => ({label: c.name, value: c.id}))} />
        </ModalForm>
      )}
      columns={[
        { title: 'Họ tên', dataIndex: 'fullName' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'CLB Hiện tại', dataIndex: 'clubId', renderText: (id) => clubs.find((c:any) => c.id === id)?.name },
      ]}
    />
  );
};