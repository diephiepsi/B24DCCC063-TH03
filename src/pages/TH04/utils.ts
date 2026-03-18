export interface TruongDuLieu {
	id: string;
	tenTruong: string;
	kieuDuLieu: 'String' | 'Number' | 'Date';
}

export type SoVanBang = {
	id: number;
	year: number;
	currentNumber: number;
};

export interface QuyetDinh {
	id: number;
	soQD: string;
	ngayBanHanh: string;
	trichYeu: string;
	soVanBangId: number;
}

export interface VanBang {
	id: string;
	soVaoSo: number;
	soHieuVB: string;
	maSV: string;
	hoTen: string;
	ngaySinh: string;
	quyetDinhId: string;
	duLieuDong: Record<string, any>; // Lưu các trường cấu hình thêm
}
