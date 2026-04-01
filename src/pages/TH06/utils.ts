export const formatCurrency = (val: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

export const formatNumber = (val: any) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getTypeLabel = (type: string) => {
  const labels: any = { beach: 'Biển', mountain: 'Núi', city: 'Thành phố' };
  return labels[type] || 'Khác';
};