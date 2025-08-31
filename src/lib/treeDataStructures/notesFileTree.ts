export const notesFileTree = [
	{
		name: 'Personal',
		type: 'folder',
		children: [
			{
				name: 'CompTIA A+ 220-1201',
				type: 'folder',
				children: [
					{
						name: 'Cable Types',
						type: 'folder',
						children: [
							{
								name: 'Understanding Data Measurements',
								path: '/notes/personal/cableTypeDataMeasurements',
								type: 'file'
							},
							{
								name: 'Exterior of a PC',
								path: '/notes/personal/exteriorOfAPC',
								type: 'file'
							},
							{
								name: 'USB Connector Types',
								path: '/notes/personal/usbConnectorTypes',
								type: 'file'
							},
							{
								name: 'USB Cables',
								path: '/notes/personal/usbCables',
								type: 'file'
							}
						]
					}
				]
			},
			{
				name: 'LeetCode practice problems',
				type: 'folder',
				children: [
					{
						name: 'Binary Search',
						type: 'folder',
						children: [
							{
								name: 'Koko Eating Bananas',
								path: '/notes/personal/kokoEatingBananas',
								type: 'file'
							}
						]
					}
				]
			}
		]
	},
	{
		name: 'School',
		type: 'folder',
		children: [
			{
				name: 'Computer Architecture',
				type: 'folder',
				children: [
					{
						name: 'WTF is x86, RISC-V, and ARM?',
						path: '/notes/school/wtf01',
						type: 'file'
					}
				]
			}
		]
	},
	{
		name: 'Work',
		type: 'folder',
		children: []
	}
];
