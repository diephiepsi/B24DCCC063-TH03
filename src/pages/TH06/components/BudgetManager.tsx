import { 
  Card, Row, Col, Statistic, Progress, Alert, 
  InputNumber, Divider, Typography} from 'antd';
import { 
  WalletOutlined, WarningOutlined, CheckCircleOutlined,
  ArrowUpOutlined, FallOutlined
} from '@ant-design/icons';
import { formatCurrency, formatNumber } from '../utils';

const { Title, Text } = Typography;

const BudgetManager = (props: any) => {
  const { itinerary, budgetLimit, setBudgetLimit } = props;

  const totalFood = itinerary?.reduce((sum: number, item: any) => sum + (item.foodCost || 0), 0) || 0;
  const totalStay = itinerary?.reduce((sum: number, item: any) => sum + (item.stayCost || 0), 0) || 0;
  const totalMove = itinerary?.reduce((sum: number, item: any) => sum + (item.moveCost || 0), 0) || 0;
  
  const totalSpent = totalFood + totalStay + totalMove; 
  const isOverBudget = totalSpent > budgetLimit; 
  const diffAmount = Math.abs(totalSpent - budgetLimit);

  const percentUsed = budgetLimit > 0 ? Math.round((totalSpent / budgetLimit) * 100) : 0;

  return (
    <Card bordered={false} style={{ background: 'transparent' }}>
      <Title level={4}><WalletOutlined /> Quản lý ngân sách chuyến đi</Title>
      
      <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
        
        <Col xs={24} md={12}>
          <div style={{ padding: 20, background: '#fafafa', borderRadius: 8, marginBottom: 20 }}>
            <Text strong>1. Thiết lập Ngân sách tối đa (VNĐ):</Text>
            <InputNumber 
              style={{ width: '100%', marginTop: 8, fontSize: 18, color: '#1890ff' }}
              min={0}
              step={500000}
              value={budgetLimit}
              onChange={(v) => setBudgetLimit(v || 0)}
              formatter={(value) => formatNumber(value)}
              parser={(value) => value?.replace(/\$\s?|(,*)/g, '') || ''}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              * Đây là số tiền tối đa bạn dự kiến chi trả cho cả chuyến đi.
            </Text>
          </div>

          {isOverBudget ? (
            <Alert
              message={<Text strong style={{ color: '#cf1322' }}>CẢNH BÁO: VƯỢT NGÂN SÁCH!</Text>}
              description={
                <div>
                  Bạn đã chi tiêu vượt quá kế hoạch: <Text strong style={{ color: '#cf1322' }}>{formatCurrency(diffAmount)}</Text>.
                  <br />
                  <Text italic>Lời khuyên: Hãy xóa bớt địa điểm hoặc tăng hạn mức ngân sách.</Text>
                </div>
              }
              type="error"
              showIcon
              icon={<WarningOutlined />}
            />
          ) : (
            <Alert
              message="Ngân sách hợp lý"
              description={`Bạn vẫn còn dư ${formatCurrency(budgetLimit - totalSpent)} để chi tiêu thêm.`}
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
            />
          )}
        </Col>

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
                  <span style={{ fontSize: 26, fontWeight: 'bold' }}>{percent}%</span>
                  <span style={{ fontSize: 12, color: '#8c8c8c' }}>{isOverBudget ? 'Quá tải' : 'An toàn'}</span>
                </div>
              )}
            />
          </div>
        </Col>
      </Row>

      <Divider orientation="left">Số liệu chi tiết (Yêu cầu: Data Statistics)</Divider>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ background: '#e6f7ff' }}>
            <Statistic 
              title="Tổng chi thực tế" 
              value={totalSpent} 
              formatter={(v) => formatCurrency(Number(v))}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: isOverBudget ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic 
              title="Số tiền còn lại" 
              value={!isOverBudget ? budgetLimit - totalSpent : 0} 
              formatter={(v) => formatCurrency(Number(v))}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ background: isOverBudget ? '#fff1f0' : '#f6ffed' }}>
            <Statistic 
              title={isOverBudget ? "Vượt ngưỡng" : "Tiết kiệm được"} 
              value={diffAmount} 
              formatter={(v) => formatCurrency(Number(v))}
              prefix={isOverBudget ? <WarningOutlined /> : <FallOutlined />}
              valueStyle={{ color: isOverBudget ? '#cf1322' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Text strong>Phân tích chi tiết theo hạng mục:</Text>
        <Row gutter={[24, 16]} style={{ marginTop: 12 }}>
          <Col span={8}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Ăn uống</Text>
              <Text strong>{formatCurrency(totalFood)}</Text>
            </div>
            <Progress percent={totalSpent > 0 ? Math.round((totalFood/totalSpent)*100) : 0} size="small" strokeColor="#ff4d4f" />
          </Col>
          <Col span={8}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Lưu trú</Text>
              <Text strong>{formatCurrency(totalStay)}</Text>
            </div>
            <Progress percent={totalSpent > 0 ? Math.round((totalStay/totalSpent)*100) : 0} size="small" strokeColor="#1890ff" />
          </Col>
          <Col span={8}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Di chuyển</Text>
              <Text strong>{formatCurrency(totalMove)}</Text>
            </div>
            <Progress percent={totalSpent > 0 ? Math.round((totalMove/totalSpent)*100) : 0} size="small" strokeColor="#52c41a" />
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default BudgetManager;