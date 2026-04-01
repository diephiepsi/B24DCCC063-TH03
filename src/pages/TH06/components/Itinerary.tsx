import { Table, Button, Space, Popconfirm, Card, Tag } from 'antd';
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { formatCurrency } from '../utils';

const Itinerary = (props: any) => {
  const { itinerary, setItinerary } = props;

  const move = (index: number, direction: number) => {
    const newData = [...itinerary];
    [newData[index], newData[index + direction]] = [newData[index + direction], newData[index]];
    setItinerary(newData);
  };

  const columns = [
    { title: 'Thứ tự', render: (_:any, __:any, i:number) => <Tag color="blue">Ngày {i+1}</Tag> },
    { title: 'Điểm đến', dataIndex: 'name', render: (t:any) => <b>{t}</b> },
    { title: 'Thời gian', dataIndex: 'time', render: (v:any) => `${v} giờ` },
    { title: 'Chi phí', render: (r:any) => formatCurrency(r.foodCost + r.stayCost + r.moveCost) },
    { title: 'Sắp xếp', render: (_:any, __:any, i:number) => (
      <Space>
        <Button size="small" icon={<ArrowUpOutlined />} disabled={i === 0} onClick={() => move(i, -1)} />
        <Button size="small" icon={<ArrowDownOutlined />} disabled={i === itinerary.length - 1} onClick={() => move(i, 1)} />
      </Space>
    )},
    { title: 'Xóa', render: (_:any, r:any) => (
      <Popconfirm title="Xóa?" onConfirm={() => setItinerary(itinerary.filter((i:any) => i.id !== r.id))}>
        <Button danger size="small" icon={<DeleteOutlined />} />
      </Popconfirm>
    )}
  ];

  return <Card title="Lịch trình dự kiến" bordered={false}><Table dataSource={itinerary} columns={columns} rowKey="id" pagination={false} /></Card>;
};
export default Itinerary;