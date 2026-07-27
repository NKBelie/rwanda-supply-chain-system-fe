# Rwanda Supply Chain Network (RSCN) – Frontend

> **Connecting Every Product, Every Business, Every Movement.**

The **Rwanda Supply Chain Network (RSCN) Frontend** is the user interface of the Rwanda Supply Chain Network platform, built with **Next.js**, **TypeScript**, and **Tailwind CSS**. It provides a modern, responsive, and scalable web application for all stakeholders in Rwanda's supply chain ecosystem.

This repository contains only the frontend application and follows a modular architecture that supports collaboration among multiple developers.

---

## Project Overview

The frontend provides role-based dashboards and interfaces for different users across the supply chain, including farmers, manufacturers, warehouse managers, transport companies, retailers, buyers, financial institutions, and government officers.

Each user has a dedicated dashboard, navigation, permissions, and workflows while sharing the same enterprise design system.

---

## Technology Stack

* Next.js (App Router)
* React 19
* TypeScript
* Tailwind CSS
* React Hook Form
* Zod
* Lucide React
* JWT Authentication
* Google OAuth
* ESLint
* Prettier

---

## Frontend Features

### Authentication

* Email & Password Login
* Continue with Google
* Password Strength Indicator
* Forgot Password
* Reset Password
* Email Verification
* JWT Authentication
* Role Selection

---

### Role-Based Dashboards

Dedicated dashboards for:

* Super Administrator
* Government Officer
* Farmer
* Cooperative
* Manufacturer
* Supplier
* Buyer
* Retailer
* Warehouse Manager
* Transport Company
* Driver
* Financial Institution

---

### Core Modules

* Authentication
* User Profile
* Products
* Inventory
* Marketplace
* Procurement
* Warehouse Management
* Transportation
* Orders
* Analytics
* Reports
* Notifications
* Messaging
* Settings

---

## Project Structure

```text
rscn-frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   ├── (auth)/
│   │   ├── admin/
│   │   ├── government/
│   │   ├── farmer/
│   │   ├── cooperative/
│   │   ├── manufacturer/
│   │   ├── supplier/
│   │   ├── buyer/
│   │   ├── retailer/
│   │   ├── warehouse/
│   │   ├── transport/
│   │   ├── driver/
│   │   ├── bank/
│   │   ├── unauthorized/
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── common/
│   │   ├── layouts/
│   │   ├── navigation/
│   │   ├── dashboard/
│   │   ├── charts/
│   │   ├── forms/
│   │   ├── maps/
│   │   └── tables/
│   │
│   ├── features/
│   ├── hooks/
│   ├── providers/
│   ├── services/
│   ├── store/
│   ├── config/
│   ├── constants/
│   ├── contexts/
│   ├── lib/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── assets/
│
├── .env.local
├── next.config.ts
├── tsconfig.json
├── package.json
├── eslint.config.js
├── README.md
└── FRONTEND_GUIDE.md
```

---

## Design Principles

The project follows a centralized design system to ensure consistency across all dashboards.

* Single primary brand color
* Shared typography
* Shared spacing system
* Reusable UI components
* Responsive layouts
* Accessible interfaces
* Dark mode support
* Multi-language support (English, Kinyarwanda, French)

---

## Team Development Guidelines

All developers should:

* Follow the existing folder structure.
* Use reusable components from `src/components/ui` and `src/components/common`.
* Avoid duplicate components.
* Follow TypeScript best practices.
* Keep components modular and reusable.
* Write responsive interfaces.
* Maintain consistent naming conventions.
* Submit changes through Pull Requests.
* Test across different roles before committing.
* Use the mock data system for development.

### Code Style

- Use functional components with hooks
- Follow TypeScript strict mode
- Use Tailwind CSS for styling
- Implement proper error boundaries
- Add loading states for async operations
- Use proper TypeScript types (avoid `any`)
- Follow the established component patterns

---

## Git Workflow

Main branches:

* `main` – Stable production-ready code
* `develop` – Integration branch
* `48-refining-and-auths-dashboards` – Current active branch

Feature branches:

* `feature/authentication`
* `feature/business`
* `feature/logistics`
* `feature/admin`

All new work should be developed in feature branches and merged into `develop` after code review.

### Current Branch

All recent work has been committed to `48-refining-and-auths-dashboards` including:
- Authentication fixes
- All 12 dashboard implementations
- Mock data system
- Component library updates

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Clone the Repository

```bash
git clone <repository-url>
cd rscn-frontend
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

### First Time Setup

1. Open the application in your browser
2. Open browser console (F12)
3. Paste the mock data initialization script (see Testing section above)
4. Refresh the page
5. Login with: `admin@rscn.rw` / `Admin@2024`
6. Test all 12 dashboards with different role credentials

### Build for Production

```bash
npm run build
npm start
```

---

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Type Checking
npm run type-check   # Run TypeScript type checking
```

---

## Project Status

### ✅ Phase 1-5 Complete (100%)

**All 12 role-based dashboards implemented and ready for testing!**

#### Completed Features:

✅ **Authentication System**
- Email/Password login with JWT
- Role-based authentication
- Session management
- Mock data for testing (95+ records)
- Development mode enabled

✅ **12 Role-Based Dashboards**
- ✅ Super Admin Portal (User management, Analytics, Business oversight)
- ✅ Government Portal (Compliance, Analytics, Supply chain oversight)
- ✅ Farmer Portal (Inventory, Orders, Warehouse, Transport)
- ✅ Cooperative Portal (Members, Collections, Aggregation)
- ✅ Manufacturer Portal (Production, Procurement, Inventory)
- ✅ Supplier Portal (Products, RFQs, Orders, Inventory)
- ✅ Buyer Portal (Marketplace, Orders, Tracking, Reviews)
- ✅ Retailer Portal (Stock, Sales, Orders, Customers)
- ✅ Warehouse Portal (Batches, Requests, Reservations, Products)
- ✅ Transport Portal (Fleet, Routes, Requests, Assignments)
- ✅ Driver Portal (Deliveries, Routes, Earnings, Jobs)
- ✅ Bank Portal (Loans, Risk Assessment, Transactions)

✅ **Component Library**
- StatusBadge (30+ status types with color coding)
- EmptyState (Consistent empty states)
- LoadingState (Loading indicators)
- LocationSelector (Rwanda provinces/districts)
- Form components and templates
- Card-based layouts

✅ **Mock Data System**
- 12 test users (one per role)
- 12+ products (crops, livestock, dairy)
- 11+ warehouses (all provinces)
- 12+ batches and orders
- localStorage-based testing

---

## 🧪 Testing & Development

### Test Credentials

**Admin Account:**
```
Email: admin@rscn.rw
Password: Admin@2024
```

**Other Test Accounts:**
- Farmer: jean.baptiste@farmer.rw / Jean@2024
- Driver: patrick.n@driver.rw / Patrick@2024
- Warehouse: grace.m@warehouse.rw / Grace@2024
- Buyer: emmanuel.h@buyer.rw / Emmanuel@2024
- Government: agnes.i@government.rw / Agnes@2024

See `TEST_CREDENTIALS.md` for all 12 test accounts.

### Loading Mock Data

For first-time setup, run this in your browser console (F12):

```javascript
(function() {
  const users = [
    {id:"USR-ADMIN-001",firstName:"System",lastName:"Administrator",email:"admin@rscn.rw",phone:"+250 788 000 000",passwordHash:"$2a$10$rscn.admin.hash.example.12345",role:"super_admin",verified:true,profileCompleted:true,createdAt:"2023-01-01T00:00:00.000Z"},
    {id:"USR-001",firstName:"Jean",lastName:"Baptiste",email:"jean.baptiste@farmer.rw",phone:"+250 788 123 456",passwordHash:"$2a$10$hash1",role:"farmer",verified:true,profileCompleted:true,createdAt:"2023-02-15T10:30:00.000Z"},
    {id:"USR-002",firstName:"Marie",lastName:"Claire",email:"marie.claire@farmer.rw",phone:"+250 788 234 567",passwordHash:"$2a$10$hash2",role:"farmer",verified:true,profileCompleted:true,createdAt:"2023-03-10T14:20:00.000Z"},
    {id:"USR-003",firstName:"Patrick",lastName:"Niyonzima",email:"patrick.n@driver.rw",phone:"+250 788 345 678",passwordHash:"$2a$10$hash3",role:"driver",verified:true,profileCompleted:true,createdAt:"2023-04-05T09:15:00.000Z"},
    {id:"USR-004",firstName:"Grace",lastName:"Mukamana",email:"grace.m@warehouse.rw",phone:"+250 788 456 789",passwordHash:"$2a$10$hash4",role:"warehouse",verified:true,profileCompleted:true,createdAt:"2023-05-12T11:45:00.000Z"},
    {id:"USR-005",firstName:"Emmanuel",lastName:"Habimana",email:"emmanuel.h@buyer.rw",phone:"+250 788 567 890",passwordHash:"$2a$10$hash5",role:"buyer",verified:true,profileCompleted:true,createdAt:"2023-06-20T16:30:00.000Z"},
    {id:"USR-006",firstName:"Sarah",lastName:"Uwase",email:"sarah.u@farmer.rw",phone:"+250 788 678 901",passwordHash:"$2a$10$hash6",role:"farmer",verified:true,profileCompleted:true,createdAt:"2023-07-15T13:20:00.000Z"},
    {id:"USR-007",firstName:"David",lastName:"Mugisha",email:"david.m@driver.rw",phone:"+250 788 789 012",passwordHash:"$2a$10$hash7",role:"driver",verified:true,profileCompleted:true,createdAt:"2023-08-22T10:00:00.000Z"},
    {id:"USR-008",firstName:"Agnes",lastName:"Ingabire",email:"agnes.i@government.rw",phone:"+250 788 890 123",passwordHash:"$2a$10$hash8",role:"government",verified:true,profileCompleted:true,createdAt:"2023-09-10T08:45:00.000Z"},
    {id:"USR-009",firstName:"Eric",lastName:"Mutabazi",email:"eric.m@warehouse.rw",phone:"+250 788 901 234",passwordHash:"$2a$10$hash9",role:"warehouse",verified:true,profileCompleted:true,createdAt:"2023-10-18T15:30:00.000Z"},
    {id:"USR-010",firstName:"Alice",lastName:"Kamanzi",email:"alice.k@buyer.rw",phone:"+250 788 012 345",passwordHash:"$2a$10$hash10",role:"buyer",verified:true,profileCompleted:true,createdAt:"2023-11-25T12:00:00.000Z"},
    {id:"USR-011",firstName:"Joseph",lastName:"Ndayisaba",email:"joseph.n@farmer.rw",phone:"+250 788 123 789",passwordHash:"$2a$10$hash11",role:"farmer",verified:true,profileCompleted:true,createdAt:"2023-12-05T09:30:00.000Z"},
    {id:"USR-012",firstName:"Claudine",lastName:"Uwamahoro",email:"claudine.u@farmer.rw",phone:"+250 788 234 890",passwordHash:"$2a$10$hash12",role:"farmer",verified:true,profileCompleted:true,createdAt:"2024-01-10T14:15:00.000Z"}
  ];
  localStorage.setItem('rscn_users', JSON.stringify(users));
  console.log('✅ Mock data loaded! Refresh and login with: admin@rscn.rw / Admin@2024');
})();
```

Then refresh the page and login.

---

## Contributors

Frontend Team (4 Developers)

* Frontend Developer 1 – Core Platform & Authentication
* Frontend Developer 2 – Marketplace & Business Operations
* Frontend Developer 3 – Logistics & Supply Chain
* Frontend Developer 4 – Administration & Analytics

---

## Future Enhancements

* Progressive Web App (PWA)
* Offline support
* Real-time notifications with WebSockets
* Advanced analytics dashboards
* AI-powered demand forecasting
* Performance optimization
* Automated UI testing
* Backend API integration
* Payment gateway integration
* SMS notifications
* Multi-language support (Kinyarwanda, French)
* Mobile app version
* Advanced reporting and exports
* Blockchain integration for traceability

---

## Documentation

- `README.md` - Main documentation (this file)
- `TEST_CREDENTIALS.md` - All test account credentials
- `ROLE_MISMATCH_FIX_COMPLETE.md` - Authentication fix details
- `GIT_COMMIT_SUMMARY.md` - Recent commit history
- Component documentation in respective component files

---

## Troubleshooting

### Login Issues

**Problem**: "Email not found" error
**Solution**: Run the mock data initialization script in browser console (see Testing section)

**Problem**: "Cannot read properties of undefined" error
**Solution**: Ensure mock data is loaded correctly. Clear localStorage and reload mock data.

### Development Issues

**Problem**: Port 3000 already in use
**Solution**: 
```bash
# Kill the process using port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

**Problem**: TypeScript errors
**Solution**: 
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**Problem**: Mock data not persisting
**Solution**: Check browser localStorage settings. Some browsers block localStorage in private/incognito mode.

### Common Questions

**Q**: How do I add a new dashboard?
**A**: Follow the existing dashboard structure in `src/app/[role]/` and create corresponding components in `src/components/[role]/`

**Q**: How do I add new mock data?
**A**: Update `src/lib/storage/mock-data.ts` with new records following existing patterns

**Q**: How do I test different roles?
**A**: Use the test credentials from `TEST_CREDENTIALS.md` or add new users to mock data

---

## License

This project is developed for educational and capstone purposes. Licensing will be determined before public release.
