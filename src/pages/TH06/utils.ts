export const formatCurrency = (val: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

export const formatNumber = (val: any) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getTypeLabel = (type: string) => {
  const labels: any = { beach: 'Biển', mountain: 'Núi', city: 'Thành phố' };
  return labels[type] || 'Khác';
};

export interface Destination {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  duration: number; // Đơn vị tính bằng giờ
}

export interface PlanDay {
  day: number;
  items: Destination[];
}

// Mock data: Danh sách các điểm đến mẫu để hiển thị trên UI
export const destinations: Destination[] = [
  {
    id: 'dest_01',
    name: 'Hồ Hoàn Kiếm & Đền Ngọc Sơn',
    location: 'Hà Nội',
    price: 30000,
    rating: 4.8,
    duration: 2,
  },
  {
    id: 'dest_02',
    name: 'Vịnh Hạ Long',
    location: 'Quảng Ninh',
    price: 500000,
    rating: 4.9,
    duration: 6,
  },
  {
    id: 'dest_03',
    name: 'Phố cổ Hội An',
    location: 'Quảng Nam',
    price: 120000,
    rating: 4.7,
    duration: 4,
  },
  {
    id: 'dest_04',
    name: 'Sun World Ba Na Hills',
    location: 'Đà Nẵng',
    price: 900000,
    rating: 4.6,
    duration: 8,
  },
  {
    id: 'dest_05',
    name: 'Chợ Bến Thành',
    location: 'TP. Hồ Chí Minh',
    price: 200000, 
    rating: 4.3,
    duration: 3,
  },
  {
    id: 'dest_06',
    name: 'Chùa Bái Đính',
    location: 'Ninh Bình',
    price: 50000,
    rating: 4.5,
    duration: 4,
  }
];