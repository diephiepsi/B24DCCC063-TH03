import { useState } from 'react';
import { Card, Row, Col, Rate, Tag, Select, Space, Button, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { formatCurrency, getTypeLabel } from '../utils';

const Explore = (props: any) => {
  const { destinations, itinerary, setItinerary } = props;
  const [filterType, setFilterType] = useState('all');

  const filtered = destinations.filter((d: any) => filterType === 'all' || d.type === filterType);

  const handleAdd = (item: any): void => {
    if (itinerary.some((i: any) => i.id === item.id)) {
      message.warning('Đã có trong lịch trình!');
      return;
    }
    setItinerary([...itinerary, item]);
    message.success('Đã thêm vào lịch trình');
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Select defaultValue="all" style={{ width: 200, marginBottom: 20 }} onChange={setFilterType}
        options={[{ label: 'Tất cả', value: 'all' }, { label: 'Biển', value: 'beach' }, { label: 'Núi', value: 'mountain' }, { label: 'Thành phố', value: 'city' }]} 
      />
      <Row gutter={[16, 16]}>
        {filtered.map((item: any) => (
          <Col xs={24} sm={12} lg={6} key={item.id}>
            <Card hoverable cover={<img src={item.image} style={{ height: 180, objectFit: 'cover' }} />}
              actions={[<Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd(item)}>Thêm</Button>]}
            >
              <Card.Meta title={item.name} description={
                <Space direction="vertical">
                  <Tag color="blue">{getTypeLabel(item.type)}</Tag>
                  <Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} />
                  <Typography.Text strong style={{ color: '#f5222d' }}>{formatCurrency(item.price)}</Typography.Text>
                </Space>
              } />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default Explore;