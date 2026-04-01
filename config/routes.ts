export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},


	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		path: '/thuc-hanh-01',
		name: 'Thực hành 01',
		icon: 'smile',
		routes: [
			{
				path: '/thuc-hanh-01/bai-1',
				name: 'Bài 1: Đoán số',
				component: './ThucHanh01/Bai1',
			},
			{
				path: '/thuc-hanh-01/bai-2',
				name: 'Bài 2: Todo List',
				component: './ThucHanh01/Bai2',
			},
		],
	},
	{
		path: '/th02',
		name: 'Bài thực hành 02',
		icon: 'BookOutlined',
		routes: [
			{ path: '/th02/bai1', name: 'Trò chơi Oẳn Tù Tì', component: './TH02/Bai1' },
			{ path: '/th02/bai2', name: 'Ngân hàng câu hỏi', component: './TH02/Bai2' },
		],
	},
	{
		path: '/thuc-hanh-03',
		name: 'Bài thực hành 03',
		icon: 'ScheduleOutlined',
		component: './TH03/index',
	},
	{

		path: '/thuc-hanh-04',
		name: 'Bài thực hành 04',
		icon: 'FileProtectOutlined',
		routes: [
			{
				path: '/thuc-hanh-04/quan-ly',
				name: 'Quản lý văn bằng',
				icon: 'BookOutlined',
				component: './TH04/index',
			},
		],
	},
	{
		path: '/thuc-hanh-05',
		name: 'Bài thực hành 05',
		icon: 'TeamOutlined',
		component: './TH05/index',
	},
	{
		path: '/thuc-hanh-06',
		name: 'Bài thực hành 06',
		icon: 'TeamOutlined',
		component: './TH06/index',
	},
	
];
