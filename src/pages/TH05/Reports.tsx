import React from 'react';
import { Card, Row, Col, Statistic, Button } from 'antd';
import * as XLSX from 'xlsx';

export default ({ apps, clubs }: any) => {
  const exportExcel = () => {
    const data = apps.filter((a: any) => a.status === 'Approved').map((a: any) => ({
      'Họ tên': a.fullName,
      'CLB': clubs.find((c:any) => c.id === a.clubId)?.name,
      'SĐT': a.phone
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");
    XLSX.writeFile(wb, "DanhSachThanhVien.xlsx");
  };

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Tổng CLB" value={clubs.length} /></Card></Col>
        <Col span={6}><Card><Statistic title="Đã duyệt" value={apps.filter((a:any)=>a.status==='Approved').length} valueStyle={{color: '#3f8600'}} /></Card></Col>
        <Col span={6}><Card><Statistic title="Đang chờ" value={apps.filter((a:any)=>a.status==='Pending').length} /></Card></Col>
        <Col span={6}><Button type="primary" block onClick={exportExcel}>Xuất file Excel</Button></Col>
      </Row>
      {/* Thêm ColumnChart tại đây sử dụng thư viện @ant-design/plots */}
    </div>
  );
};