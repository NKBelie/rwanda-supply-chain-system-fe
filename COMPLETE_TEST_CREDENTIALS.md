# 🔐 Complete Test Credentials - All 12 Roles

## Quick Reference Table

| # | Role | Email | Password | Dashboard |
|---|------|-------|----------|-----------|
| 1 | **Super Admin** | `admin@rscn.rw` | `Admin@2024` | `/admin/dashboard` |
| 2 | **Government** | `agnes.i@government.rw` | `Agnes@2024` | `/government/dashboard` |
| 3 | **Farmer** | `jean.baptiste@farmer.rw` | `Jean@2024` | `/farmer/dashboard` |
| 4 | **Cooperative** | `therese.m@cooperative.rw` | `Therese@2024` | `/cooperative/dashboard` |
| 5 | **Manufacturer** | `vincent.r@manufacturer.rw` | `Vincent@2024` | `/manufacturer/dashboard` |
| 6 | **Supplier** | `christine.u@supplier.rw` | `Christine@2024` | `/supplier/dashboard` |
| 7 | **Buyer** | `emmanuel.h@buyer.rw` | `Emmanuel@2024` | `/buyer/dashboard` |
| 8 | **Retailer** | `francois.h@retailer.rw` | `Francois@2024` | `/retailer/dashboard` |
| 9 | **Warehouse** | `grace.m@warehouse.rw` | `Grace@2024` | `/warehouse/dashboard` |
| 10 | **Transport** | `robert.n@transport.rw` | `Robert@2024` | `/transport/dashboard` |
| 11 | **Driver** | `patrick.n@driver.rw` | `Patrick@2024` | `/driver/dashboard` |
| 12 | **Bank** | `sylvie.u@bank.rw` | `Sylvie@2024` | `/bank/dashboard` |

---

## 📋 Detailed Credentials

### 1. 👨‍💼 Super Admin
```
Name:     System Administrator
Email:    admin@rscn.rw
Password: Admin@2024
Role:     super_admin
Phone:    +250 788 000 000
```
**Dashboard Features:**
- User Management (Create, Edit, Suspend users)
- Platform Analytics
- Business Oversight
- System Settings
- Reports & Exports
- Audit Logs

---

### 2. 🏛️ Government Officer
```
Name:     Agnes Ingabire
Email:    agnes.i@government.rw
Password: Agnes@2024
Role:     government
Phone:    +250 788 890 123
```
**Dashboard Features:**
- National Overview
- Supply Chain Analytics
- Compliance Monitoring
- Business Registration Verification
- Policy Implementation
- Statistical Reports

---

### 3. 🌾 Farmer
```
Name:     Jean Baptiste
Email:    jean.baptiste@farmer.rw
Password: Jean@2024
Role:     farmer
Phone:    +250 788 123 456
```
**Dashboard Features:**
- Product Inventory Management
- Order Management
- Warehouse Storage Requests
- Transport Booking
- Sales Analytics
- Marketplace Listings
- Buyer Connections

---

### 4. 🤝 Cooperative
```
Name:     Thérèse Mukamugema
Email:    therese.m@cooperative.rw
Password: Therese@2024
Role:     cooperative
Phone:    +250 788 111 222
```
**Dashboard Features:**
- Member Management
- Crop Collection & Aggregation
- Bulk Sales Management
- Financial Tracking
- Member Payments
- Quality Control
- Storage Coordination

---

### 5. 🏭 Manufacturer
```
Name:     Vincent Rutayisire
Email:    vincent.r@manufacturer.rw
Password: Vincent@2024
Role:     manufacturer
Phone:    +250 788 222 333
```
**Dashboard Features:**
- Production Planning
- Raw Material Procurement
- Inventory Management
- Order Processing
- Quality Control
- Transport Coordination
- Supplier Management

---

### 6. 📦 Supplier
```
Name:     Christine Uwimana
Email:    christine.u@supplier.rw
Password: Christine@2024
Role:     supplier
Phone:    +250 788 333 444
```
**Dashboard Features:**
- Product Catalogue Management
- RFQ (Request for Quote) Management
- Order Fulfillment
- Inventory Control
- Delivery Tracking
- Payment Management
- Customer Relations

---

### 7. 🛒 Buyer
```
Name:     Emmanuel Habimana
Email:    emmanuel.h@buyer.rw
Password: Emmanuel@2024
Role:     buyer
Phone:    +250 788 567 890
```
**Dashboard Features:**
- Product Marketplace
- Browse & Search Products
- Place Orders
- Track Deliveries
- Order History
- Product Reviews
- Payment Management
- Wishlist

---

### 8. 🏪 Retailer
```
Name:     François Habimana
Email:    francois.h@retailer.rw
Password: Francois@2024
Role:     retailer
Phone:    +250 788 444 555
```
**Dashboard Features:**
- Stock Management
- Point of Sale (POS)
- Sales Tracking
- Purchase Orders
- Supplier Management
- Customer Management
- Sales Reports
- Inventory Alerts

---

### 9. 🏭 Warehouse Manager
```
Name:     Grace Mukamana
Email:    grace.m@warehouse.rw
Password: Grace@2024
Role:     warehouse
Phone:    +250 788 456 789
```
**Dashboard Features:**
- Incoming Goods Processing
- Batch Management
- Outgoing Goods
- Storage Requests
- Reservations
- Inventory Control
- Capacity Management
- Quality Checks

---

### 10. 🚛 Transport Company
```
Name:     Robert Nkurunziza
Email:    robert.n@transport.rw
Password: Robert@2024
Role:     transport
Phone:    +250 788 555 666
```
**Dashboard Features:**
- Fleet Management
- Transport Requests
- Route Planning
- Driver Assignment
- Vehicle Tracking
- Shipment Management
- Payment Processing
- Performance Analytics

---

### 11. 🚚 Driver
```
Name:     Patrick Niyonzima
Email:    patrick.n@driver.rw
Password: Patrick@2024
Role:     driver
Phone:    +250 788 345 678
```
**Dashboard Features:**
- Active Deliveries
- Delivery History
- Route Navigation
- Earnings Tracking
- Job Assignments
- Document Upload
- Performance Metrics
- Location Updates

---

### 12. 🏦 Bank / Financial Institution
```
Name:     Sylvie Uwase
Email:    sylvie.u@bank.rw
Password: Sylvie@2024
Role:     bank
Phone:    +250 788 666 777
```
**Dashboard Features:**
- Loan Applications
- Credit Risk Assessment
- Business Verification
- Transaction History
- Customer Profiles
- Payment Processing
- Financial Analytics
- Compliance Reports

---

## 🚀 Setup Instructions

### Step 1: Load All Mock Data

Open your browser console (press **F12**), paste this script, and press **Enter**:

```javascript
(function() {
  const users = [
    {id:"USR-ADMIN-001",firstName:"System",lastName:"Administrator",email:"admin@rscn.rw",phone:"+250 788 000 000",passwordHash:"$2a$10$rscn.admin.hash.example.12345",role:"super_admin",verified:true,profileCompleted:true,createdAt:"2023-01-01T00:00:00.000Z"},
    {id:"USR-GOV-001",firstName:"Agnes",lastName:"Ingabire",email:"agnes.i@government.rw",phone:"+250 788 890 123",passwordHash:"$2a$10$hash8",role:"government",verified:true,profileCompleted:true,createdAt:"2023-09-10T08:45:00.000Z"},
    {id:"USR-001",firstName:"Jean",lastName:"Baptiste",email:"jean.baptiste@farmer.rw",phone:"+250 788 123 456",passwordHash:"$2a$10$hash1",role:"farmer",verified:true,profileCompleted:true,createdAt:"2023-02-15T10:30:00.000Z"},
    {id:"USR-COOP-001",firstName:"Thérèse",lastName:"Mukamugema",email:"therese.m@cooperative.rw",phone:"+250 788 111 222",passwordHash:"$2a$10$hashcoop",role:"cooperative",verified:true,profileCompleted:true,createdAt:"2023-06-01T08:00:00.000Z"},
    {id:"USR-MANUF-001",firstName:"Vincent",lastName:"Rutayisire",email:"vincent.r@manufacturer.rw",phone:"+250 788 222 333",passwordHash:"$2a$10$hashmanuf",role:"manufacturer",verified:true,profileCompleted:true,createdAt:"2023-06-05T09:00:00.000Z"},
    {id:"USR-SUPP-001",firstName:"Christine",lastName:"Uwimana",email:"christine.u@supplier.rw",phone:"+250 788 333 444",passwordHash:"$2a$10$hashsupp",role:"supplier",verified:true,profileCompleted:true,createdAt:"2023-06-10T10:00:00.000Z"},
    {id:"USR-005",firstName:"Emmanuel",lastName:"Habimana",email:"emmanuel.h@buyer.rw",phone:"+250 788 567 890",passwordHash:"$2a$10$hash5",role:"buyer",verified:true,profileCompleted:true,createdAt:"2023-06-20T16:30:00.000Z"},
    {id:"USR-RET-001",firstName:"François",lastName:"Habimana",email:"francois.h@retailer.rw",phone:"+250 788 444 555",passwordHash:"$2a$10$hashret",role:"retailer",verified:true,profileCompleted:true,createdAt:"2023-06-15T11:00:00.000Z"},
    {id:"USR-004",firstName:"Grace",lastName:"Mukamana",email:"grace.m@warehouse.rw",phone:"+250 788 456 789",passwordHash:"$2a$10$hash4",role:"warehouse",verified:true,profileCompleted:true,createdAt:"2023-05-12T11:45:00.000Z"},
    {id:"USR-TRANS-001",firstName:"Robert",lastName:"Nkurunziza",email:"robert.n@transport.rw",phone:"+250 788 555 666",passwordHash:"$2a$10$hashtrans",role:"transport",verified:true,profileCompleted:true,createdAt:"2023-06-20T12:00:00.000Z"},
    {id:"USR-003",firstName:"Patrick",lastName:"Niyonzima",email:"patrick.n@driver.rw",phone:"+250 788 345 678",passwordHash:"$2a$10$hash3",role:"driver",verified:true,profileCompleted:true,createdAt:"2023-04-05T09:15:00.000Z"},
    {id:"USR-BANK-001",firstName:"Sylvie",lastName:"Uwase",email:"sylvie.u@bank.rw",phone:"+250 788 666 777",passwordHash:"$2a$10$hashbank",role:"bank",verified:true,profileCompleted:true,createdAt:"2023-06-25T13:00:00.000Z"}
  ];
  
  localStorage.setItem('rscn_users', JSON.stringify(users));
  
  console.log('✅ ALL 12 ROLES LOADED SUCCESSFULLY!');
  console.log('📦 Total users:', users.length);
  console.log('');
  console.log('🔐 TEST CREDENTIALS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1.  Super Admin:    admin@rscn.rw / Admin@2024');
  console.log('2.  Government:     agnes.i@government.rw / Agnes@2024');
  console.log('3.  Farmer:         jean.baptiste@farmer.rw / Jean@2024');
  console.log('4.  Cooperative:    therese.m@cooperative.rw / Therese@2024');
  console.log('5.  Manufacturer:   vincent.r@manufacturer.rw / Vincent@2024');
  console.log('6.  Supplier:       christine.u@supplier.rw / Christine@2024');
  console.log('7.  Buyer:          emmanuel.h@buyer.rw / Emmanuel@2024');
  console.log('8.  Retailer:       francois.h@retailer.rw / Francois@2024');
  console.log('9.  Warehouse:      grace.m@warehouse.rw / Grace@2024');
  console.log('10. Transport:      robert.n@transport.rw / Robert@2024');
  console.log('11. Driver:         patrick.n@driver.rw / Patrick@2024');
  console.log('12. Bank:           sylvie.u@bank.rw / Sylvie@2024');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('🔄 Now refresh the page (F5) and login!');
})();
```

### Step 2: Refresh the Page
Press **F5** or **Ctrl+R** to reload the application

### Step 3: Test Login
Start with: `admin@rscn.rw` / `Admin@2024`

### Step 4: Test All Dashboards
Logout and login with different role credentials to test each dashboard

---

## 🧪 Testing Workflow

### Recommended Testing Order:

1. **Admin First** - Login as Super Admin to see full platform capabilities
2. **Supply Side** - Test Farmer → Cooperative → Manufacturer → Supplier
3. **Demand Side** - Test Buyer → Retailer
4. **Logistics** - Test Warehouse → Transport → Driver
5. **Support Services** - Test Bank → Government

### Testing Checklist:

- [ ] Super Admin - User management works
- [ ] Government - Analytics dashboard loads
- [ ] Farmer - Can view inventory and orders
- [ ] Cooperative - Member management accessible
- [ ] Manufacturer - Production modules work
- [ ] Supplier - Product catalogue displays
- [ ] Buyer - Marketplace loads products
- [ ] Retailer - Stock management works
- [ ] Warehouse - Batch management accessible
- [ ] Transport - Fleet management works
- [ ] Driver - Delivery list displays
- [ ] Bank - Loan applications visible

---

## 🎯 Password Pattern

All passwords follow: **`FirstName@2024`**

Examples:
- Admin → `Admin@2024`
- Jean → `Jean@2024`
- Thérèse → `Therese@2024` (no accents in password)
- François → `Francois@2024` (no accent in password)

---

## 🔄 Additional Test Accounts (If Needed)

You can add more users by updating `src/lib/storage/mock-data.ts`:

```typescript
{
  id: "USR-CUSTOM-001",
  firstName: "YourName",
  lastName: "YourLastName",
  email: "your.email@role.rw",
  phone: "+250 788 XXX XXX",
  passwordHash: "$2a$10$yourhash",
  role: "farmer", // or any other role
  verified: true,
  profileCompleted: true,
  createdAt: new Date().toISOString(),
}
```

---

## ⚠️ Important Notes

### Development Only
- These credentials are for **testing and development only**
- Do NOT use in production
- Mock data is stored in browser localStorage
- Clear localStorage to reset data

### Browser Compatibility
- Works in Chrome, Firefox, Edge, Safari
- Requires localStorage enabled
- Private/Incognito mode may block localStorage

### Data Persistence
- Mock data persists until localStorage is cleared
- Data is browser-specific (not shared across devices)
- Clearing browser data will remove all mock data

---

## 🐛 Troubleshooting

### "Email not found" Error
**Solution**: Run the mock data script in console again

### Login not working
**Solution**: 
1. Open console (F12)
2. Type: `localStorage.clear()`
3. Press Enter
4. Reload mock data script
5. Refresh page

### Dashboard not loading
**Solution**: Check that the role in localStorage matches the expected format (lowercase with underscores)

### Wrong dashboard after login
**Solution**: Logout, clear localStorage, reload mock data, login again

---

## 📊 Role Summary

| Role Type | Count | Purpose |
|-----------|-------|---------|
| Administration | 1 | Platform management |
| Government | 1 | Oversight & compliance |
| Supply Chain | 5 | Production & distribution |
| Logistics | 3 | Storage & transport |
| Financial | 1 | Financing & verification |
| Retail | 2 | Sales & purchasing |

**Total: 12 unique roles** covering the complete supply chain ecosystem

---

## 📚 Related Documentation

- `README.md` - Complete project setup
- `ROLE_MISMATCH_FIX_COMPLETE.md` - Authentication details
- `GIT_COMMIT_SUMMARY.md` - Recent changes
- `src/lib/storage/mock-data.ts` - Source of truth for mock data

---

## ✅ Verification Steps

After loading mock data:

1. ✅ Console shows "ALL 12 ROLES LOADED SUCCESSFULLY!"
2. ✅ Console lists all 12 credentials
3. ✅ Refresh page shows login screen
4. ✅ Login with admin credentials redirects to `/admin/dashboard`
5. ✅ Each role redirects to its corresponding dashboard

---

**🎉 Ready to test all 12 dashboards!**

**Need help?** Check the troubleshooting section or main README.md
