import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
import { Button,  Popconfirm, Image, Card, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Admin = (props: any) => {
  const { destinations, setDestinations } = props;

  const handleSave = async (v: any, id?: string) => {
    const item = { ...v, price: (v.foodCost || 0) + (v.stayCost || 0) + (v.moveCost || 0) };
    if (id) setDestinations(destinations.map((d: any) => d.id === id ? { ...item, id } : d));
    else setDestinations([{ ...item, id: Date.now().toString() }, ...destinations]);
    return true;
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12}><Card><Statistic title="Tổng điểm đến" value={destinations.length} /></Card></Col>
        <Col span={12}><Card><Statistic title="Doanh thu dự kiến" value={destinations.reduce((s:any, d:any) => s + d.price, 0)} suffix="đ" /></Card></Col>
      </Row>
      <ProTable dataSource={destinations} rowKey="id" search={{ labelWidth: 'auto' }}
        columns={[
          { title: 'Ảnh', dataIndex: 'image', search: false, render: (v: any) => <Image src={v} width={50} /> },
          { title: 'Tên', dataIndex: 'name' },
          { title: 'Loại', dataIndex: 'type', valueEnum: { beach: 'Biển', mountain: 'Núi', city: 'Phố' } },
          { title: 'Đánh giá', dataIndex: 'rating', search: false },
          { title: 'Thao tác', valueType: 'option', render: (_: any, r: any) => [
            <ModalForm key="e" title="Sửa" trigger={<Button type="link" icon={<EditOutlined />} />} initialValues={r} onFinish={v => handleSave(v, r.id)}><FormFields /></ModalForm>,
            <Popconfirm key="d" title="Xóa?" onConfirm={() => setDestinations(destinations.filter((d:any) => d.id !== r.id))}><Button type="link" danger icon={<DeleteOutlined />} /></Popconfirm>
          ]}
        ]}
        toolBarRender={() => [<ModalForm key="a" title="Thêm" trigger={<Button type="primary" icon={<PlusOutlined />}>Thêm</Button>} onFinish={handleSave}><FormFields /></ModalForm>]}
      />
    </div>
  );
};

const FormFields = () => (
  <>
    <ProFormText name="name" label="Tên điểm đến" rules={[{ required: true }]} />
    <ProFormText name="image" label="URL Ảnh" rules={[{ required: true }]} />
    <ProFormSelect name="type" label="Loại" options={[{ label: 'Biển', value: 'beach' }, { label: 'Núi', value: 'mountain' }, { label: 'Phố', value: 'city' }]} />
    <div style={{ display: 'flex', gap: 10 }}>
      <ProFormDigit name="foodCost" label="Ăn uống" width="sm" />
      <ProFormDigit name="stayCost" label="Lưu trú" width="sm" />
      <ProFormDigit name="moveCost" label="Di chuyển" width="sm" />
    </div>
    <div style={{ display: 'flex', gap: 10 }}>
      <ProFormDigit name="rating" label="Đánh giá" width="sm" />
      <ProFormDigit name="time" label="Thời gian tham quan" width="sm" />
    </div>
  </>
);
export default Admin;