import { 
  Card, Row, Col, Statistic, Progress, Alert, 
  InputNumber, Divider, Typography, 
} from 'antd';
import { 
  WalletOutlined, WarningOutlined, CheckCircleOutlined,
  ArrowUpOutlined, FallOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const BudgetManager = (props: any) => {
  // Lấy dữ liệu từ Model localStorage.th06
  const { itinerary, budgetLimit, setBudgetLimit } = props;

  // 1. TÍNH TOÁN SỐ LIỆU (DATA)
  const totalFood = itinerary?.reduce((sum: number, item: any) => sum + (item.foodCost || 0), 0) || 0;
  const totalStay = itinerary?.reduce((sum: number, item: any) => sum + (item.stayCost || 0), 0) || 0;
  const totalMove = itinerary?.reduce((sum: number, item: any) => sum + (item.moveCost || 0), 0) || 0;
  
  const totalSpent = totalFood + totalStay + totalMove; // Đây là 8 triệu
  const isOverBudget = totalSpent > budgetLimit; // 8tr > 500k => TRUE
  const diffAmount = Math.abs(totalSpent - budgetLimit); // Số tiền chênh lệch

  // Tính phần trăm (Chart)
  const percentUsed = budgetLimit > 0 ? Math.round((totalSpent / budgetLimit) * 100) : 0;

  return (
    <Card bordered={false}>
      <Title level={4}><WalletOutlined /> Quản lý ngân sách chuyến đi</Title>
      
      <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
        {/* PHẦN NHẬP DỮ LIỆU & CẢNH BÁO (ALERTS) */}
        <Col xs={24} md={12}>
          <div style={{ padding: 20, background: '#fafafa', borderRadius: 8, marginBottom: 20 }}>
            <Text strong>1. Thiết lập Ngân sách tối đa của bạn (VNĐ):</Text>
            <InputNumber 
              style={{ width: '100%', marginTop: 8, fontSize: 18, color: '#1890ff' }}
              min={0}
              step={100000}
              value={budgetLimit}
              onChange={(v) => setBudgetLimit(v || 0)}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              * Đây là số tiền tối đa bạn có thể chi cho chuyến đi này.
            </Text>
          </div>

          {/* HIỂN THỊ ALERT THEO TRẠNG THÁI */}
          {isOverBudget ? (
            <Alert
              message={<Text strong style={{ color: '#cf1322' }}>CẢNH BÁO: VƯỢT NGÂN SÁCH!</Text>}
              description={
                <div>
                  <Text>Bạn đã chi tiêu vượt quá kế hoạch </Text>
                  <Text strong style={{ color: '#cf1322' }}>{diffAmount.toLocaleString()} VNĐ</Text>.
                  <br />
                  <Text italic>Lời khuyên: Hãy xóa bớt địa điểm hoặc tăng ngân sách tối đa.</Text>
                </div>
              }
              type="error"
              showIcon
              icon={<WarningOutlined />}
            />
          ) : (
            <Alert
              message="Ngân sách hợp lý"
              description={`Bạn còn dư ${(budgetLimit - totalSpent).toLocaleString()} VNĐ để chi tiêu thêm.`}
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
            />
          )}
        </Col>

        {/* BIỂU ĐỒ PHÂN TÍCH (CHARTS) */}
        <Col xs={24} md={12} style={{ textAlign: 'center' }}>
          <Text strong>Mức độ sử dụng ngân sách</Text>
          <div style={{ marginTop: 20 }}>
            <Progress
              type="circle"
              percent={percentUsed}
              strokeColor={isOverBudget ? '#ff4d4f' : '#52c41a'}
              status={isOverBudget ? 'exception' : 'normal'}
              width={180}
              format={(percent) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 24, fontWeight: 'bold' }}>{percent}%</span>
                  <span style={{ fontSize: 12 }}>{isOverBudget ? 'Quá tải' : 'An toàn'}</span>
                </div>
              )}
            />
          </div>
        </Col>
      </Row>

      <Divider orientation="left">Số liệu chi tiết (Data Statistics)</Divider>

      {/* SỐ LIỆU CHI TIẾT (DATA) */}
      <Row gutter={16}>
        <Col span={8}>
          <Card size="small" style={{ background: '#e6f7ff' }}>
            <Statistic 
              title="Tổng chi phí thực tế" 
              value={totalSpent} 
              suffix="đ" 
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: isOverBudget ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic 
              title="Số tiền còn lại" 
              value={!isOverBudget ? budgetLimit - totalSpent : 0} 
              suffix="đ" 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" style={{ background: isOverBudget ? '#fff1f0' : '#f6ffed' }}>
            <Statistic 
              title={isOverBudget ? "Số tiền bị vượt" : "Tiết kiệm được"} 
              value={diffAmount} 
              suffix="đ" 
              prefix={isOverBudget ? <WarningOutlined /> : <FallOutlined />}
              valueStyle={{ color: isOverBudget ? '#cf1322' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Text strong>Phân tích hạng mục chi tiêu:</Text>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col span={8}>
            <Text type="secondary">Ăn uống: </Text><Text strong>{totalFood.toLocaleString()}đ</Text>
            <Progress percent={totalSpent > 0 ? Math.round((totalFood/totalSpent)*100) : 0} size="small" strokeColor="#ff4d4f" />
          </Col>
          <Col span={8}>
            <Text type="secondary">Lưu trú: </Text><Text strong>{totalStay.toLocaleString()}đ</Text>
            <Progress percent={totalSpent > 0 ? Math.round((totalStay/totalSpent)*100) : 0} size="small" strokeColor="#1890ff" />
          </Col>
          <Col span={8}>
            <Text type="secondary">Di chuyển: </Text><Text strong>{totalMove.toLocaleString()}đ</Text>
            <Progress percent={totalSpent > 0 ? Math.round((totalMove/totalSpent)*100) : 0} size="small" strokeColor="#52c41a" />
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default BudgetManager;