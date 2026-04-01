import React from 'react';
import { 
  Table, Button, Space, Typography, Popconfirm, 
  Card, Tag, Alert, Empty, 
  Statistic,
  Col,
  Row
} from 'antd';
import { 
  DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, 
  ClockCircleOutlined, FieldTimeOutlined 
} from '@ant-design/icons';
// Đảm bảo đường dẫn này đúng để gọi các hàm format
import { formatCurrency } from '../utils';

const { Title, Text } = Typography;

const Itinerary = (props: any) => {
  // Lấy đúng tên biến từ Model localStorage.th06
  const { itinerary, setItinerary } = props;

  // 1. Hàm sắp xếp: Di chuyển điểm đến lên hoặc xuống
  const moveItem = (index: number, direction: number) => {
    if (!itinerary) return;
    const newData = [...itinerary];
    const temp = newData[index];
    newData[index] = newData[index + direction];
    newData[index + direction] = temp;
    setItinerary(newData);
  };

  // 2. Hàm xóa điểm đến khỏi lịch trình
  const removeItem = (id: string) => {
    if (!itinerary) return;
    setItinerary(itinerary.filter((item: any) => item.id !== id));
  };

  // 3. Tính toán tổng số liệu
  // Giả định thời gian di chuyển giữa mỗi điểm là 1.5 giờ theo yêu cầu đề bài
  const transferTimePerStop = 1.5;
  const totalVisitTime = itinerary?.reduce((sum: number, item: any) => sum + (item.time || 0), 0) || 0;
  const totalTransferTime = itinerary?.length > 1 ? (itinerary.length - 1) * transferTimePerStop : 0;
  const totalTripTime = totalVisitTime + totalTransferTime;

  const totalBudget = itinerary?.reduce((sum: number, item: any) => 
    sum + (item.foodCost || 0) + (item.stayCost || 0) + (item.moveCost || 0), 0) || 0;

  // 4. Định nghĩa các cột của bảng lịch trình
  const columns = [
    { 
      title: 'Thứ tự', 
      width: 100,
      render: (_: any, __: any, index: number) => (
        <Tag color="blue" style={{ fontSize: 14, padding: '4px 8px' }}>
          Ngày {index + 1}
        </Tag>
      ) 
    },
    { 
      title: 'Điểm đến & Thời gian di chuyển', 
      dataIndex: 'name',
      render: (text: string, record: any, index: number) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 16 }}>{text}</Text>
          {index > 0 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              <ClockCircleOutlined /> Di chuyển từ chặng trước: {transferTimePerStop} giờ
            </Text>
          )}
        </Space>
      )
    },
    { 
      title: 'Thời gian tham quan', 
      dataIndex: 'time', 
      align: 'center' as const,
      render: (time: number) => <Tag icon={<FieldTimeOutlined />}>{time}h</Tag>
    },
    { 
      title: 'Chi phí dự tính', 
      align: 'right' as const,
      render: (record: any) => {
        const cost = (record.foodCost || 0) + (record.stayCost || 0) + (record.moveCost || 0);
        return <Text strong style={{ color: '#fa8c16' }}>{formatCurrency(cost)}</Text>;
      }
    },
    {
      title: 'Sắp xếp',
      align: 'center' as const,
      width: 120,
      render: (_: any, __: any, index: number) => (
        <Space>
          <Button 
            size="small" 
            icon={<ArrowUpOutlined />} 
            disabled={index === 0} 
            onClick={() => moveItem(index, -1)} 
          />
          <Button 
            size="small" 
            icon={<ArrowDownOutlined />} 
            disabled={index === (itinerary?.length || 0) - 1} 
            onClick={() => moveItem(index, 1)} 
          />
        </Space>
      )
    },
    {
      title: 'Thao tác',
      align: 'center' as const,
      width: 80,
      render: (_: any, record: any) => (
        <Popconfirm title="Xóa khỏi lịch trình?" onConfirm={() => removeItem(record.id)}>
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <Card bordered={false} style={{ background: 'transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Lịch trình chuyến đi của bạn</Title>
        {itinerary?.length > 0 && (
          <Tag color="cyan">Tổng cộng {itinerary.length} địa điểm</Tag>
        )}
      </div>

      {(!itinerary || itinerary.length === 0) ? (
        <Empty 
          description="Chưa có địa điểm nào trong lịch trình" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Text type="secondary">Hãy quay lại tab <b>Khám phá</b> để thêm địa điểm yêu thích.</Text>
        </Empty>
      ) : (
        <>
          <Table 
            dataSource={itinerary} 
            columns={columns} 
            rowKey="id" 
            pagination={false} 
            bordered
            size="middle"
          />

          {/* HIỂN THỊ TÍNH TOÁN TỔNG (Yêu cầu 2: Tính toán ngân sách, thời gian) */}
          <div style={{ 
            marginTop: 24, 
            padding: '20px', 
            background: '#fffbe6', 
            border: '1px solid #ffe58f', 
            borderRadius: 8 
          }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Statistic 
                  title="Tổng thời gian chuyến đi (bao gồm di chuyển)" 
                  value={totalTripTime} 
                  precision={1}
                  suffix="giờ" 
                  valueStyle={{ color: '#d46b08' }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Statistic 
                  title="Tổng ngân sách tạm tính" 
                  value={totalBudget} 
                  formatter={(v) => formatCurrency(Number(v))}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
            </Row>
            <Alert 
              style={{ marginTop: 16 }}
              message="Lưu ý: Thời gian di chuyển giữa các điểm được tính mặc định là 1.5 giờ/chặng."
              type="info"
              showIcon
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default Itinerary;