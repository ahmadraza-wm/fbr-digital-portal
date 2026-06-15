# Laravel Backend API Structure

## Database Tables

### companies
```sql
id, name, ntn, st_registration, cnic, email, phone,
head_office, sub_office, address, city, province, postal_code,
logo (string - path), fbr_token (encrypted), is_active,
created_at, updated_at
```

### users
```sql
id, company_id (FK), name, email, phone, password,
role (enum: admin, company_admin, user),
is_active, created_at, updated_at
```

### customers
```sql
id, company_id (FK), business_name, ntn_cnic,
registration_type (enum: Registered, Unregistered),
province, address, phone, email, contact_person,
is_active, created_at, updated_at
```

### products
```sql
id, company_id (FK), name, description, hs_code,
sale_type, rate, uom, unit_price, fixed_notified_price,
is_active, created_at, updated_at
```

### invoices
```sql
id, company_id (FK), customer_id (FK), user_id (FK),
invoice_type, invoice_date, invoice_ref_no,
seller_ntn_cnic, seller_business_name, seller_province, seller_address,
buyer_ntn_cnic, buyer_business_name, buyer_province, buyer_address,
buyer_registration_type, scenario_id,
fbr_invoice_number, fbr_status, fbr_response (json),
submitted_at, created_at, updated_at
```

### invoice_items
```sql
id, invoice_id (FK), product_id (FK nullable),
hs_code, product_description, rate, uom, quantity,
total_values, value_sales_excluding_st,
fixed_notified_value_or_retail_price,
sales_tax_applicable, sales_tax_withheld_at_source,
extra_tax, further_tax, sro_schedule_no,
fed_payable, discount, sale_type, sro_item_serial_no
```

---

## API Routes (routes/api.php)

```php
// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->group(function () {

    // Companies (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('companies', CompanyController::class);
        Route::post('companies/{company}/fbr-token', [CompanyController::class, 'saveFbrToken']);
        Route::get('companies/{company}/fbr-token', [CompanyController::class, 'getFbrToken']);
    });

    // Users (admin only)
    Route::middleware('role:admin')->apiResource('users', UserController::class);

    // Customers (company scoped)
    Route::apiResource('customers', CustomerController::class);

    // Products (company scoped)
    Route::apiResource('products', ProductController::class);

    // Invoices
    Route::apiResource('invoices', InvoiceController::class);
    Route::post('invoices/{invoice}/submit-fbr', [InvoiceController::class, 'submitToFbr']);
    Route::post('invoices/{invoice}/validate-fbr', [InvoiceController::class, 'validateWithFbr']);
});
```

---

## Key Controllers

### CompanyController
- `index()` - list all companies (admin) or own company (company_admin)
- `store()` - create company with logo upload
- `update()` - update with logo, encrypt fbr_token
- `saveFbrToken()` - admin sets FBR token for a company
- `getFbrToken()` - returns masked token

### CustomerController
- Scoped by `company_id` from authenticated user
- `index()` - search by name, ntn_cnic

### ProductController
- Scoped by `company_id`
- `index()` - search by name, hs_code

### InvoiceController
- `submitToFbr()` - reads company fbr_token, calls FBR API, saves response
- `validateWithFbr()` - validate without submitting

---

## Middleware: RoleMiddleware
```php
// app/Http/Middleware/RoleMiddleware.php
public function handle($request, Closure $next, ...$roles)
{
    if (!in_array(auth()->user()->role, $roles)) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    return $next($request);
}
```

## Company Scoping (BaseController or Trait)
```php
// All queries scoped to authenticated user's company
protected function companyId(): int
{
    return auth()->user()->company_id;
}
```

## FBR Token Encryption
```php
// In Company model
protected $casts = [
    'fbr_token' => 'encrypted', // Laravel built-in encryption
];
```

## Logo Upload
```php
// In CompanyController::store()
if ($request->hasFile('logo')) {
    $path = $request->file('logo')->store('logos', 'public');
    $company->logo = $path;
    $company->logo_url = Storage::url($path);
}
```

---

## Response Format (consistent)
```json
{
  "success": true,
  "message": "Company created successfully",
  "data": { ... }
}
```

## Pagination
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 72
  }
}
```
