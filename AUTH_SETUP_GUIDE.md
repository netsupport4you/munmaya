# 🔐 MUNMAYA Admin Authentication Setup Guide

## Overview

The Admin panel is now protected with Supabase Authentication. Only users with the `admin` role can access `/admin`.

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Run the SQL Schema

Go to your Supabase SQL Editor and run the complete schema from `src/lib/schema.sql`.

This will:
- ✅ Create the `products` table with proper RLS
- ✅ Create the `profiles` table with role field
- ✅ Set up auto-profile creation on signup
- ✅ Insert 3 dummy products
- ✅ Configure RLS policies (products readable by all, writable only by admins)

### Step 2: Create Your Admin Account

1. Go to `https://your-site.com/admin/login`
2. Click "সাইন আপ" (Sign Up) - OR use the Supabase dashboard to create a user
3. **The first user to sign up automatically becomes an admin**
4. After signup, you'll be redirected to the admin panel

**Alternative:** Create admin via Supabase Dashboard:
1. Go to Authentication → Users → Add User
2. Enter email and password
3. Go to Table Editor → profiles
4. Find your user and set `role` to `admin`

### Step 3: Test It

- Visit `/admin` while logged out → Redirected to `/admin/login`
- Visit `/admin` while logged in as admin → See admin panel
- Visit `/admin` while logged in as regular user → Redirected to home

---

## 📋 How Authentication Works

### Flow Diagram

```
User visits /admin
    ↓
ProtectedRoute checks auth state
    ↓
┌─ Not logged in → Redirect to /admin/login
├─ Logged in but NOT admin → Redirect to /
└─ Logged in AND admin → Show Admin panel
```

### Database Tables

#### `profiles` table
```sql
id          UUID (references auth.users)
email       TEXT
full_name   TEXT
role        TEXT ('customer' | 'admin')
created_at  TIMESTAMPTZ
```

#### `products` table RLS
```sql
SELECT: Anyone can read (storefront)
INSERT: Only admin role
UPDATE: Only admin role
DELETE: Only admin role
```

### Auto-Admin Logic

The first user to sign up automatically gets `role = 'admin'`:

```sql
CASE
  WHEN (SELECT COUNT(*) FROM profiles) = 0 THEN 'admin'
  ELSE 'customer'
END
```

---

## 🛡️ Security Features

1. **Row Level Security (RLS)** on all tables
2. **Auth state listener** - real-time session tracking
3. **Protected Route wrapper** - checks auth + role
4. **Non-admin rejection** - logs out non-admin users trying to access admin panel
5. **Session persistence** - stays logged in across page refreshes
6. **Token refresh** - automatic token renewal

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `src/lib/schema.sql` | Database schema + RLS policies |
| `src/stores/authStore.ts` | Auth state management + session listener |
| `src/components/ProtectedRoute.tsx` | Route guard component |
| `src/pages/AdminLogin.tsx` | Admin login page |
| `src/Admin.tsx` | Admin panel (auth-protected) |
| `src/main.tsx` | Routing with protected routes |
| `src/App.tsx` | Storefront (conditional admin link) |

---

## 🧪 Testing Scenarios

### Scenario 1: First User (Auto-Admin)
1. Run SQL schema
2. Visit `/admin/login`
3. Sign up with any email
4. → Automatically becomes admin
5. → Redirected to `/admin`

### Scenario 2: Non-Admin Tries Admin Panel
1. Sign up as second user (gets `customer` role)
2. Try to visit `/admin`
3. → Redirected to `/` (home page)
4. → Admin link not visible in header

### Scenario 3: Unauthenticated User
1. Sign out
2. Visit `/admin`
3. → Redirected to `/admin/login`
4. → See login form

### Scenario 4: Admin Panel Features
1. Login as admin
2. Add new product → Saved to Supabase
3. Edit product → Updated in Supabase
4. Delete product → Removed from Supabase
5. Click logout → Redirected to login page

---

## ⚙️ Configuration

### Environment Variables (.env)
```env
VITE_SUPABASE_URL=https://gjkckgjvhhdpxxzohyuu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_fG8iWUF_TFPU7jvauobhNA_BYxZqBgy
```

### Supabase Settings
- **Authentication → Providers**: Enable Email provider
- **Authentication → URL Configuration**: Set site URL
- **Authentication → Email Templates**: Customize if needed

---

## 🔧 Manual Admin Assignment

If you need to make an existing user an admin:

```sql
-- Via Supabase SQL Editor
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

Or via Table Editor:
1. Go to Table Editor → profiles
2. Find the user row
3. Change `role` from `customer` to `admin`

---

## 🚨 Troubleshooting

### "Profile not found" error
- Run the SQL schema to create the `profiles` table
- Check that the trigger `on_auth_user_created` exists

### Can't insert products as admin
- Verify your user has `role = 'admin'` in profiles table
- Check RLS policies are enabled on products table

### Redirect loop on /admin
- Clear browser storage/cookies
- Check Supabase auth settings
- Verify anon key is correct in .env

### First user isn't admin
- The trigger checks `COUNT(*) FROM profiles`
- If profiles table had data before, manually set role:
  ```sql
  UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
  ```

---

## 📝 Code Examples

### Check if user is admin
```typescript
import { useAuthStore } from './stores/authStore';

function MyComponent() {
  const { isAdmin, user } = useAuthStore();
  
  if (isAdmin()) {
    // Show admin features
  }
}
```

### Protected route usage
```typescript
import ProtectedRoute from './components/ProtectedRoute';

<Route
  path="/admin"
  element={
    <ProtectedRoute requireAdmin={true}>
      <Admin />
    </ProtectedRoute>
  }
/>
```

### Sign in programmatically
```typescript
import { useAuthStore } from './stores/authStore';

const { signIn } = useAuthStore();
const { error } = await signIn('email@example.com', 'password');
```

---

## 🎯 Next Steps

- [ ] Run SQL schema in Supabase
- [ ] Create first admin account
- [ ] Test login/logout flow
- [ ] Test admin panel CRUD operations
- [ ] Test non-admin access rejection
- [ ] Customize login page branding
- [ ] Add "Forgot password" functionality
- [ ] Add email verification
- [ ] Set up custom email templates

---

## ✅ Checklist

- [ ] SQL schema executed successfully
- [ ] `profiles` table created
- [ ] `products` table created with RLS
- [ ] Trigger `on_auth_user_created` exists
- [ ] First user signed up as admin
- [ ] `/admin/login` page works
- [ ] `/admin` redirects to login when not authenticated
- [ ] `/admin` redirects to home when not admin
- [ ] Admin can add/edit/delete products
- [ ] Logout works correctly
- [ ] Admin link only shows for admins in header

---

**Need help?** Check the Supabase dashboard logs or browser console for errors.
