export const routes = {
	auth: {
		"register/signup": {
			method: "POST",
			path: "/auth/(register|signup)",
			body: {
				email: {
					type: "string",
					required: true,
					description: "Email of the user",
				},
				password: {
					type: "string",
					required: true,
					description: "Password of the user",
				},
				role: {
					type: ["admin", "user", "author"],
					required: false,
					default: "user",
					description: "Role of the user",
				},
			},
		},
		"login/signin": {
			method: "POST",
			path: "/auth/(login|signin)",
			body: {
				email: {
					type: "string",
					required: true,
					description: "Email of the user",
				},
				password: {
					type: "string",
					required: true,
					description: "Password of the user",
				},
				role: {
					type: ["admin", "user", "author"],
					required: false,
					default: "user",
					description: "Role of the user",
				},
			},
		},
		"reset-password": {
			method: "POST",
			path: "/auth/reset-password",
			body: {
				email: {
					type: "string",
					required: true,
					description: "Email of the user",
				},
				password: {
					type: "string",
					required: true,
					description: "Password of the user",
				},
				newPassword: {
					type: "string",
					required: true,
					description: "New Password of the user",
				},
			},
		},
		"forgot-password": {
			todo: "to be implemented",
		},
	},
	home: {
		method: "GET",
		path: "/",
	},
	book: {
		list: {
			method: "GET",
			path: "/book/list",
			query: {
				title: {
					type: "string",
					required: false,
					description: "Title of the book",
				},
				authors: {
					type: "string",
					required: false,
					description: "Authors of the book",
				},
				priceRange: {
					type: "string",
					required: false,
					description: "Price range of the book",
				},
				sellCount: {
					type: "string",
					required: false,
					description: "Sell count of the book",
				},
				limit: {
					type: "number",
					required: false,
					description: "Limit of the books",
				},
				page: {
					type: "number",
					required: false,
					description: "Page number",
				},
				sort: {
					type: ["asc", "desc"],
					required: false,
					description: "Sort the books",
				},
			},
		},
		create: {
			method: "POST",
			path: "/book/create",
			body: {
				id: {
					type: "string",
					required: false,
					description: "ID of the book",
				},
				title: {
					type: "string",
					required: true,
					description: "Title of the book",
				},
				description: {
					type: "string",
					required: true,
					description: "Description of the book",
				},
				authors: {
					type: "array",
					required: true,
					description: "IDs of the book authors",
				},
				price: {
					type: "string",
					required: true,
					description: "Price of the book",
				},
			},
		},
		update: {
			method: "POST",
			path: "/book/update",
			body: {
				id: {
					type: "string",
					required: true,
					description: "ID of the book",
				},
				title: {
					type: "string",
					required: true,
					description: "Title of the book",
				},
				description: {
					type: "string",
					required: true,
					description: "Description of the book",
				},
				authors: {
					type: "array",
					required: true,
					description: "IDs of the book authors",
				},
				price: {
					type: "string",
					required: true,
					description: "Price of the book",
				},
			},
		},
		delete: {
			method: "GET",
			path: "/book/delete/:id",
			params: {
				id: {
					type: "string",
					required: true,
					description: "ID of the book",
				},
			},
		},
	},
	store: {
		"buy/purchase": {
			method: "GET",
			path: "/store/(buy|purchase)",
			query: {
				id: {
					type: "string",
					required: true,
					description: "ID of the book",
				},
				quantity: {
					type: "string",
					required: false,
					default: "1",
					description: "Quantity of the book",
				},
			},
		},
	},
	user: {
		list: {
			method: "GET",
			path: "/user/list",
		},
		update: {
			method: "POST",
			path: "/user/update",
			body: {
				email: {
					type: "string",
					required: false,
					description: "Email of the user",
				},
				name: {
					type: "string",
					required: false,
					description: "Name of the user",
				},
				username: {
					type: "string",
					required: false,
					description: "Username of the user",
				},
			},
		},
		"change-role": {
			method: "POST",
			path: "/user/change-role",
			body: {
				id: {
					type: "string",
					required: true,
					description: "ID of the user",
				},
				role: {
					type: ["admin", "user", "author"],
					required: true,
					description: "Role of the user",
				},
			},
		},
	},
	delete: {
		method: "GET",
		path: "/user/delete/:id",
		params: {
			id: {
				type: "string",
				required: true,
				description: "ID of the user",
			},
		},
	},
};
