# backend for coco (updates pending)

## project structure

coco-backend/
├── src/
│ ├── config/
│ │ └── database.ts  
│ ├── models/
│ │ ├── User.ts # User model with password hashing
│ │ ├── Job.ts # Job model
│ │ └── Category.ts # Category model
│ ├── controllers/
│ │ ├── authController.ts # Login/Register logic
│ │ ├── jobController.ts # CRUD for jobs
│ │ └── categoryController.ts # CRUD for categories
│ ├── routes/
│ │ ├── authRoutes.ts # /api/auth routes
│ │ ├── jobRoutes.ts # /api/jobs routes
│ │ └── categoryRoutes.ts # /api/categories routes
│ ├── middleware/
│ │ └── auth.ts # JWT authentication
│ └── server.ts # Main Express app
├── .env # Environment variables
├── tsconfig.json # TypeScript config
└── package.json # Dependencies
