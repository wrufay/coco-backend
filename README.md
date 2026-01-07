# backend for coco (updates pending)

## project structure

coco-backend/
│
├── src/
│ ├── config/
│ │ └── database.ts
│ │
│ ├── models/
│ │ ├── User.ts
│ │ ├── Job.ts
│ │ └── Category.ts
│ │
│ ├── controllers/
│ │ ├── authController.ts
│ │ ├── jobController.ts
│ │ └── categoryController.ts
│ │
│ ├── routes/
│ │ ├── authRoutes.ts
│ │ ├── jobRoutes.ts
│ │ └── categoryRoutes.ts
│ │
│ ├── middleware/
│ │ └── auth.ts
│ │
│ └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
