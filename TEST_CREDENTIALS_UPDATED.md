# 🔐 RSCN Frontend - Test Credentials

## Quick Access - All 12 Role Accounts

| # | Role | Email | Password | Dashboard |
|---|------|-------|----------|-----------|
| 1 | **Super Admin** | `admin@rscn.rw` | `Admin@2024` | `/admin/dashboard` |
| 2 | **Farmer** | `jean.baptiste@farmer.rw` | `Jean@2024` | `/farmer/dashboard` |
| 3 | **Driver** | `patrick.n@driver.rw` | `Patrick@2024` | `/driver/dashboard` |
| 4 | **Warehouse Manager** | `grace.m@warehouse.rw` | `Grace@2024` | `/warehouse/dashboard` |
| 5 | **Buyer** | `emmanuel.h@buyer.rw` | `Emmanuel@2024` | `/buyer/dashboard` |
| 6 | **Government Officer** | `agnes.i@government.rw` | `Agnes@2024` | `/government/dashboard` |
| 7 | **Farmer (Alt)** | `marie.claire@farmer.rw` | `Marie@2024` | `/farmer/dashboard` |
| 8 | **Driver (Alt)** | `david.m@driver.rw` | `David@2024` | `/driver/dashboard` |
| 9 | **Warehouse (Alt)** | `eric.m@warehouse.rw` | `Eric@2024` | `/warehouse/dashboard` |
| 10 | **Buyer (Alt)** | `alice.k@buyer.rw` | `Alice@2024` | `/buyer/dashboard` |
| 11 | **Farmer 3** | `sarah.u@farmer.rw` | `Sarah@2024` | `/farmer/dashboard` |
| 12 | **Farmer 4** | `joseph.n@farmer.rw` | `Joseph@2024` | `/farmer/dashboard` |

---

## 📋 Detailed Credentials by Role

### 1. 👨‍💼 Super Admin
```
Email:    admin@rscn.rw
Password: Admin@2024
Role:     super_admin
Access:   Full platform governance
```
**Features:**
- User Management
- Analytics & Reports
- Business Oversight
- System Settings
- Platform Administration

---

### 2. 🌾 Farmer (5 Test Accounts)

**Account 1:**
```
Email:    jean.baptiste@farmer.rw
Password: Jean@2024
Name:     Jean Baptiste
```

**Account 2:**
```
Email:    marie.claire@farmer.rw
Password: Marie@2024
Name:     Marie Claire
```

**Account 3:**
```
Email:    sarah.u@farmer.rw
Password: Sarah@2024
Name:     Sarah Uwase
```

**Account 4:**
```
Email:    joseph.n@farmer.rw
Password: Joseph@2024
Name:     Joseph Ndayisaba
```

**Account 5:**
```
Email:    claudine.u@farmer.rw
Password: Claudine@2024
Name:     Claudine Uwamahoro
```

**Features:**
- Product Inventory
- Order Management
- Warehouse Requests
- Transport Booking
- Sales Analytics
- Marketplace Access

---

### 3. 🚚 Driver (2 Test Accounts)

**Account 1:**
```
Email:    patrick.n@driver.rw
Password: Patrick@2024
Name:     Patrick Niyonzima
```

**Account 2:**
```
Email:    david.m@driver.rw
Password: David@2024
Name:     David Mugisha
```

**Features:**
- Active Deliveries
- Delivery History
- Route Planning
- Earnings Tracking
- Job Assignments
- Navigation & Maps

---

### 4. 🏭 Warehouse Manager (2 Test Accounts)

**Account 1:**
```
Email:    grace.m@warehouse.rw
Password: Grace@2024
Name:     Grace Mukamana
```

**Account 2:**
```
Email:    eric.m@warehouse.rw
Password: Eric@2024
Name:     Eric Mutabazi
```

**Features:**
- Incoming Goods
- Batch Management
- Outgoing Goods
- Storage Requests
- Reservations
- Inventory Control

---

### 5. 🛒 Buyer (2 Test Accounts)

**Account 1:**
```
Email:    emmanuel.h@buyer.rw
Password: Emmanuel@2024
Name:     Emmanuel Habimana
```

**Account 2:**
```
Email:    alice.k@buyer.rw
Password: Alice@2024
Name:     Alice Kamanzi
```

**Features:**
- Browse Products
- Place Orders
- Track Deliveries
- Order History
- Product Reviews
- Payment Management

---

### 6. 🏛️ Government Officer

```
Email:    agnes.i@government.rw
Password: Agnes@2024
Name:     Agnes Ingabire
Role:     government
```

**Features:**
- Platform Overview
- Analytics Dashboard
- Compliance Monitoring
- Business Reports
- Supply Chain Oversight
- Policy Management

---

## 🚀 How to Use These Credentials

### Step 1: Load Mock Data
Open browser console (F12) and paste:

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
  console.log('✅ Mock data loaded successfully!');
  console.log('📦 Total users:', users.length);
  console.log('🔐 Login with: admin@rscn.rw / Admin@2024');
  console.log('🔄 Refresh the page (F5) to login');
})();
```

### Step 2: Refresh Page
Press `F5` or `Ctrl+R` to reload the application

### Step 3: Login
Use any of the credentials above to test different dashboards

---

## 🎯 Testing Tips

### Test Different Roles
1. Login with admin credentials first to see the full admin dashboard
2. Logout and test farmer, driver, warehouse roles
3. Each role has a different dashboard and features

### Password Pattern
All passwords follow the pattern: `FirstName@2024`
- Admin → `Admin@2024`
- Jean → `Jean@2024`
- Marie → `Marie@2024`

### Troubleshooting
- **"Email not found"**: Run the mock data script in console
- **Login not working**: Clear localStorage and reload mock data
- **Wrong dashboard**: Check the role in mock data matches expected role

---

## 📊 Role Distribution

- **Super Admin**: 1 account
- **Farmer**: 5 accounts
- **Driver**: 2 accounts
- **Warehouse**: 2 accounts
- **Buyer**: 2 accounts
- **Government**: 1 account

**Total**: 13 test accounts across 6 active roles

---

## 🔒 Security Note

**⚠️ IMPORTANT**: These are test credentials for development only!
- Do NOT use in production
- Mock data is stored in browser localStorage
- No real authentication or encryption
- For testing and demonstration purposes only

---

## 📝 Additional Resources

- `README.md` - Complete project documentation
- `ROLE_MISMATCH_FIX_COMPLETE.md` - Authentication fix details
- `GIT_COMMIT_SUMMARY.md` - Recent development history
- `src/lib/storage/mock-data.ts` - Mock data source code

---

**Need help?** Check the troubleshooting section in the main README.md
