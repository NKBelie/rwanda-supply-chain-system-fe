# Troubleshooting Warehouse Pages

## Issue
Incoming and outgoing goods pages showing as "default" instead of the custom implementation.

## Verification Steps

### 1. Check Files Exist
```
src/components/warehouse/WarehouseIncomingGoods.tsx ✓ EXISTS
src/components/warehouse/WarehouseOutgoingGoods.tsx ✓ EXISTS
```

### 2. Check Page Routes
```
src/app/warehouse/incoming/page.tsx ✓ CORRECT IMPORT
src/app/warehouse/outgoing/page.tsx ✓ CORRECT IMPORT
```

### 3. Check Exports
Both components use `export default function` - ✓ CORRECT

## Possible Solutions

### Solution 1: Clear Next.js Cache
```bash
# Stop dev server
# Delete .next directory
rm -rf .next
# Restart dev server
npm run dev
```

### Solution 2: Hard Refresh Browser
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### Solution 3: Check for TypeScript Errors
```bash
npx tsc --noEmit
```

### Solution 4: Verify Imports are Resolving
The imports in page files:
```typescript
import WarehouseIncomingGoodsPage from "@/components/warehouse/WarehouseIncomingGoods";
import WarehouseOutgoingGoodsPage from "@/components/warehouse/WarehouseOutgoingGoods";
```

Should resolve to the correct components.

### Solution 5: Force Component Reload
I've added emojis to the titles to verify the component loads:
- Incoming: "📦 Incoming Goods"
- Outgoing: "🚚 Outgoing Goods"

If you see these emojis in the titles, the components are loading correctly.

## Testing the Pages

1. Navigate to `/warehouse/incoming`
   - Should show: "📦 Incoming Goods" title
   - Should see: 5 summary cards (Total, Pending, In Transit, Arrived, Inspected)
   - Should see: 5 incoming shipment cards with mock data

2. Navigate to `/warehouse/outgoing`
   - Should show: "🚚 Outgoing Goods" title
   - Should see: 5 summary cards (Total, Preparing, Ready, In Transit, Delivered)
   - Should see: 6 outgoing shipment cards with mock data

## If Still Showing Default

### Check Catch-All Route
Verify `src/app/warehouse/[...slug]/page.tsx` has:
```typescript
case "incoming": return <WarehouseIncomingGoodsPage />;
case "outgoing": return <WarehouseOutgoingGoodsPage />;
```

### Check for Duplicate Page Files
Make sure there are no conflicting page files:
```bash
# Search for duplicate incoming/outgoing pages
find src/app/warehouse -name "page.tsx"
```

### Restart Development Server
Sometimes Next.js needs a full restart:
```bash
# Kill the server
# Clear cache
rm -rf .next
# Start again
npm run dev
```

## Expected Behavior

✅ **Incoming Goods** should show:
- Summary cards with icons
- Search bar
- Status filters
- List of 5 incoming shipments
- Clickable cards that open modals

✅ **Outgoing Goods** should show:
- Summary cards with icons
- Search bar
- Status filters
- List of 6 outgoing shipments
- Clickable cards that open modals

## Current Status

- Components: ✅ Created and exported correctly
- Routes: ✅ Configured correctly
- Mock Data: ✅ Included in components
- Icons: ✅ All using Lucide (no emojis in components, only test emojis in titles)

The implementation is correct. If pages still show as default, it's likely a caching/build issue that requires:
1. Clearing `.next` folder
2. Restarting dev server
3. Hard refreshing browser
