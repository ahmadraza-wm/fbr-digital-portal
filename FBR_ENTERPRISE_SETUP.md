# FBR Enterprise — Laravel + Inertia.js + Vue 3 Setup Guide

## Overview
Multi-company FBR Digital Invoicing system.
- **Backend:** Laravel 11
- **Frontend:** Inertia.js + Vue 3
- **Auth:** Laravel Breeze (Inertia + Vue)
- **DB:** MySQL

---

## STEP 1 — Install Required Packages

Run in terminal inside `fbr-enterprise` folder:

```bash
# Inertia server-side
composer require inertiajs/inertia-laravel

# Breeze with Inertia + Vue (auth scaffolding)
composer require laravel/breeze --dev
php artisan breeze:install vue

# Extra packages
composer require spatie/laravel-permission
npm install
npm run build
```

---

## STEP 2 — .env Setup

```env
APP_NAME="FBR Enterprise"
APP_URL=http://fbr-enterprise.test

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fbr_enterprise
DB_USERNAME=root
DB_PASSWORD=
```

---

## STEP 3 — Migrations

### File: `database/migrations/2024_01_01_000001_create_companies_table.php`

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('ntn')->nullable();
            $table->string('st_registration')->nullable();
            $table->string('cnic')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('head_office')->nullable();
            $table->string('sub_office')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('logo')->nullable();
            $table->text('fbr_token')->nullable(); // encrypted
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('companies'); }
};
```

### File: `database/migrations/2024_01_01_000002_add_company_id_to_users_table.php`

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->string('phone')->nullable();
            $table->enum('role', ['super_admin', 'company_admin', 'user'])->default('user');
            $table->boolean('is_active')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn(['company_id', 'phone', 'role', 'is_active']);
        });
    }
};
```

### File: `database/migrations/2024_01_01_000003_create_customers_table.php`

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('business_name');
            $table->string('ntn_cnic')->nullable();
            $table->enum('registration_type', ['Registered', 'Unregistered'])->default('Registered');
            $table->string('province')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('contact_person')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('customers'); }
};
```

### File: `database/migrations/2024_01_01_000004_create_products_table.php`

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('hs_code');
            $table->string('sale_type')->default('Goods at standard rate (default)');
            $table->string('rate')->default('18%');
            $table->string('uom')->nullable();
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('fixed_notified_price', 15, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('products'); }
};
```

### File: `database/migrations/2024_01_01_000005_create_invoices_table.php`

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('invoice_type', ['Sale Invoice', 'Debit Note'])->default('Sale Invoice');
            $table->date('invoice_date');
            $table->string('invoice_ref_no')->nullable();
            $table->string('seller_ntn_cnic')->nullable();
            $table->string('seller_business_name')->nullable();
            $table->string('seller_province')->nullable();
            $table->string('seller_address')->nullable();
            $table->string('buyer_ntn_cnic')->nullable();
            $table->string('buyer_business_name')->nullable();
            $table->string('buyer_province')->nullable();
            $table->string('buyer_address')->nullable();
            $table->enum('buyer_registration_type', ['Registered', 'Unregistered'])->default('Registered');
            $table->string('scenario_id')->nullable();
            $table->string('fbr_invoice_number')->nullable();
            $table->string('fbr_status')->nullable();
            $table->json('fbr_response')->nullable();
            $table->enum('environment', ['sandbox', 'production'])->default('sandbox');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('invoices'); }
};
```

### File: `database/migrations/2024_01_01_000006_create_invoice_items_table.php`

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained('invoices')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('hs_code');
            $table->string('product_description');
            $table->string('rate')->default('18%');
            $table->string('uom')->nullable();
            $table->decimal('quantity', 15, 4)->default(1);
            $table->decimal('total_values', 15, 2)->default(0);
            $table->decimal('value_sales_excluding_st', 15, 2)->default(0);
            $table->decimal('fixed_notified_value_or_retail_price', 15, 2)->default(0);
            $table->decimal('sales_tax_applicable', 15, 2)->default(0);
            $table->decimal('sales_tax_withheld_at_source', 15, 2)->default(0);
            $table->decimal('extra_tax', 15, 2)->default(0);
            $table->decimal('further_tax', 15, 2)->default(0);
            $table->string('sro_schedule_no')->nullable();
            $table->decimal('fed_payable', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->string('sale_type')->default('Goods at standard rate (default)');
            $table->string('sro_item_serial_no')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('invoice_items'); }
};
```

---

## STEP 4 — Models

### File: `app/Models/Company.php`

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Company extends Model
{
    protected $fillable = [
        'name', 'ntn', 'st_registration', 'cnic', 'email', 'phone',
        'head_office', 'sub_office', 'address', 'city', 'province',
        'postal_code', 'logo', 'fbr_token', 'is_active',
    ];

    protected $casts = [
        'fbr_token' => 'encrypted',
        'is_active'  => 'boolean',
    ];

    protected $hidden = ['fbr_token'];

    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo ? Storage::url($this->logo) : null;
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
```

### File: `app/Models/Customer.php`

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    protected $fillable = [
        'company_id', 'business_name', 'ntn_cnic', 'registration_type',
        'province', 'address', 'phone', 'email', 'contact_person', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
```

### File: `app/Models/Product.php`

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'company_id', 'name', 'description', 'hs_code', 'sale_type',
        'rate', 'uom', 'unit_price', 'fixed_notified_price', 'is_active',
    ];

    protected $casts = [
        'is_active'           => 'boolean',
        'unit_price'          => 'decimal:2',
        'fixed_notified_price' => 'decimal:2',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
```

### File: `app/Models/Invoice.php`

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    protected $fillable = [
        'company_id', 'customer_id', 'user_id', 'invoice_type', 'invoice_date',
        'invoice_ref_no', 'seller_ntn_cnic', 'seller_business_name',
        'seller_province', 'seller_address', 'buyer_ntn_cnic',
        'buyer_business_name', 'buyer_province', 'buyer_address',
        'buyer_registration_type', 'scenario_id', 'fbr_invoice_number',
        'fbr_status', 'fbr_response', 'environment', 'submitted_at',
    ];

    protected $casts = [
        'fbr_response' => 'array',
        'invoice_date' => 'date',
        'submitted_at' => 'datetime',
    ];

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function customer(): BelongsTo { return $this->belongsTo(Customer::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function items(): HasMany { return $this->hasMany(InvoiceItem::class); }

    public function getTotalSalesAttribute(): float
    {
        return $this->items->sum('value_sales_excluding_st');
    }

    public function getTotalTaxAttribute(): float
    {
        return $this->items->sum('sales_tax_applicable');
    }
}
```

### File: `app/Models/InvoiceItem.php`

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id', 'product_id', 'hs_code', 'product_description', 'rate',
        'uom', 'quantity', 'total_values', 'value_sales_excluding_st',
        'fixed_notified_value_or_retail_price', 'sales_tax_applicable',
        'sales_tax_withheld_at_source', 'extra_tax', 'further_tax',
        'sro_schedule_no', 'fed_payable', 'discount', 'sale_type', 'sro_item_serial_no',
    ];

    protected $casts = [
        'quantity'                              => 'decimal:4',
        'total_values'                          => 'decimal:2',
        'value_sales_excluding_st'              => 'decimal:2',
        'fixed_notified_value_or_retail_price'  => 'decimal:2',
        'sales_tax_applicable'                  => 'decimal:2',
        'sales_tax_withheld_at_source'          => 'decimal:2',
        'extra_tax'                             => 'decimal:2',
        'further_tax'                           => 'decimal:2',
        'fed_payable'                           => 'decimal:2',
        'discount'                              => 'decimal:2',
    ];

    public function invoice(): BelongsTo { return $this->belongsTo(Invoice::class); }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }
}
```

### Update: `app/Models/User.php`

```php
<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'phone', 'company_id', 'role', 'is_active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'is_active'         => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function isSuperAdmin(): bool { return $this->role === 'super_admin'; }
    public function isCompanyAdmin(): bool { return $this->role === 'company_admin'; }

    public function companyId(): ?int
    {
        return $this->company_id;
    }
}
```

---

## STEP 5 — Seeders

### File: `database/seeders/DatabaseSeeder.php`

```php
<?php
namespace Database\Seeders;

use App\Models\Company;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::create([
            'name'     => 'Super Admin',
            'email'    => 'admin@fbr.com',
            'password' => bcrypt('password'),
            'role'     => 'super_admin',
            'is_active' => true,
        ]);

        // Sample Company (WIX Apparel)
        $company = Company::create([
            'name'            => 'WIX Apparel (Wearable Industry Xperts)',
            'ntn'             => 'E460714',
            'st_registration' => '32-77-8763-465-63',
            'email'           => 'info@wixapparel.com',
            'phone'           => '+92-42-0000000',
            'province'        => 'Punjab',
            'head_office'     => 'House #135/A, Dubai Town, Raiwind Road, Lahore',
            'sub_office'      => 'Near Chitti Kothi, Raiwind Road, Lahore',
            'is_active'       => true,
        ]);

        // Company Admin
        User::create([
            'name'       => 'WIX Admin',
            'email'      => 'admin@wixapparel.com',
            'password'   => bcrypt('password'),
            'role'       => 'company_admin',
            'company_id' => $company->id,
            'is_active'  => true,
        ]);

        // Sample Customers
        Customer::insert([
            [
                'company_id'        => $company->id,
                'business_name'     => 'Skipper Bikers Int.',
                'ntn_cnic'          => '3234952',
                'registration_type' => 'Registered',
                'province'          => 'Punjab',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'company_id'        => $company->id,
                'business_name'     => 'Al-Kareem Textiles',
                'ntn_cnic'          => '4567890',
                'registration_type' => 'Registered',
                'province'          => 'Sindh',
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ]);

        // Sample Products
        Product::insert([
            ['company_id' => $company->id, 'name' => 'LSF (Pink)', 'hs_code' => '6006.1000', 'rate' => '18%', 'uom' => 'Metre', 'unit_price' => 1460, 'sale_type' => 'Goods at standard rate (default)', 'created_at' => now(), 'updated_at' => now()],
            ['company_id' => $company->id, 'name' => '2x1 L/Rib', 'hs_code' => '6006.2100', 'rate' => '18%', 'uom' => 'KG', 'unit_price' => 1500, 'sale_type' => 'Goods at standard rate (default)', 'created_at' => now(), 'updated_at' => now()],
            ['company_id' => $company->id, 'name' => 'Dori (Pink)', 'hs_code' => '5806.3200', 'rate' => '18%', 'uom' => 'Metre', 'unit_price' => 17, 'sale_type' => 'Goods at standard rate (default)', 'created_at' => now(), 'updated_at' => now()],
            ['company_id' => $company->id, 'name' => 'LSF (Teal)', 'hs_code' => '6006.1000', 'rate' => '18%', 'uom' => 'Metre', 'unit_price' => 1460, 'sale_type' => 'Goods at standard rate (default)', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
```

---

## STEP 6 — Middleware (Role Check)

### File: `app/Http/Middleware/EnsureRole.php`

```php
<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        if (! in_array(auth()->user()?->role, $roles)) {
            abort(403, 'Unauthorized');
        }
        return $next($request);
    }
}
```

Register in `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'role' => \App\Http\Middleware\EnsureRole::class,
    ]);
})
```

---

## STEP 7 — Controllers

### File: `app/Http/Controllers/DashboardController.php`

```php
<?php
namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $companyId = $user->company_id;

        $invoiceQuery = Invoice::with('items')
            ->when($companyId, fn($q) => $q->where('company_id', $companyId));

        $recentInvoices = (clone $invoiceQuery)
            ->with(['customer', 'items'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($inv) => [
                'id'              => $inv->id,
                'invoice_type'    => $inv->invoice_type,
                'invoice_date'    => $inv->invoice_date?->format('Y-m-d'),
                'buyer_name'      => $inv->customer?->business_name ?? $inv->buyer_business_name,
                'fbr_invoice_number' => $inv->fbr_invoice_number,
                'fbr_status'      => $inv->fbr_status,
                'total_sales'     => $inv->items->sum('value_sales_excluding_st'),
                'total_tax'       => $inv->items->sum('sales_tax_applicable'),
                'items_count'     => $inv->items->count(),
            ]);

        $stats = [
            'total_invoices'   => (clone $invoiceQuery)->count(),
            'valid_invoices'   => (clone $invoiceQuery)->where('fbr_status', 'Valid')->count(),
            'total_sales'      => (clone $invoiceQuery)->with('items')->get()->sum('total_sales'),
            'total_tax'        => (clone $invoiceQuery)->with('items')->get()->sum('total_tax'),
            'total_customers'  => Customer::when($companyId, fn($q) => $q->where('company_id', $companyId))->count(),
            'total_products'   => Product::when($companyId, fn($q) => $q->where('company_id', $companyId))->count(),
        ];

        // Monthly data for chart
        $monthly = [];
        for ($m = 1; $m <= 12; $m++) {
            $monthInvoices = (clone $invoiceQuery)
                ->with('items')
                ->whereMonth('invoice_date', $m)
                ->whereYear('invoice_date', date('Y'))
                ->get();
            $monthly[] = [
                'month' => $m,
                'sales' => $monthInvoices->sum('total_sales'),
                'tax'   => $monthInvoices->sum('total_tax'),
            ];
        }

        $companies = $user->isSuperAdmin() ? Company::count() : null;

        return Inertia::render('Dashboard', compact('stats', 'recentInvoices', 'monthly', 'companies'));
    }
}
```

### File: `app/Http/Controllers/CompanyController.php`

```php
<?php
namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::withCount('users')
            ->when(request('search'), fn($q, $s) => $q->where('name', 'like', "%$s%")->orWhere('ntn', 'like', "%$s%"))
            ->latest()
            ->paginate(15)
            ->through(fn($c) => [
                'id'            => $c->id,
                'name'          => $c->name,
                'ntn'           => $c->ntn,
                'email'         => $c->email,
                'province'      => $c->province,
                'phone'         => $c->phone,
                'logo_url'      => $c->logo_url,
                'is_active'     => $c->is_active,
                'users_count'   => $c->users_count,
                'fbr_token_set' => !empty($c->getRawOriginal('fbr_token')),
            ]);

        return Inertia::render('Admin/Companies/Index', ['companies' => $companies, 'filters' => request()->only('search')]);
    }

    public function create()
    {
        return Inertia::render('Admin/Companies/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'ntn'             => 'nullable|string|max:20',
            'st_registration' => 'nullable|string|max:50',
            'email'           => 'nullable|email',
            'phone'           => 'nullable|string',
            'province'        => 'nullable|string',
            'head_office'     => 'nullable|string',
            'sub_office'      => 'nullable|string',
            'city'            => 'nullable|string',
            'postal_code'     => 'nullable|string',
            'fbr_token'       => 'nullable|string',
            'is_active'       => 'boolean',
            'logo'            => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        Company::create($validated);

        return redirect()->route('admin.companies.index')->with('success', 'Company created successfully.');
    }

    public function edit(Company $company)
    {
        return Inertia::render('Admin/Companies/Edit', [
            'company' => array_merge($company->toArray(), ['logo_url' => $company->logo_url, 'has_fbr_token' => !empty($company->getRawOriginal('fbr_token'))]),
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'ntn'             => 'nullable|string|max:20',
            'st_registration' => 'nullable|string|max:50',
            'email'           => 'nullable|email',
            'phone'           => 'nullable|string',
            'province'        => 'nullable|string',
            'head_office'     => 'nullable|string',
            'sub_office'      => 'nullable|string',
            'city'            => 'nullable|string',
            'postal_code'     => 'nullable|string',
            'fbr_token'       => 'nullable|string',
            'is_active'       => 'boolean',
            'logo'            => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($company->logo) Storage::disk('public')->delete($company->logo);
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        // Only update fbr_token if provided
        if (empty($validated['fbr_token'])) unset($validated['fbr_token']);

        $company->update($validated);

        return back()->with('success', 'Company updated successfully.');
    }

    public function destroy(Company $company)
    {
        if ($company->logo) Storage::disk('public')->delete($company->logo);
        $company->delete();

        return redirect()->route('admin.companies.index')->with('success', 'Company deleted.');
    }
}
```

### File: `app/Http/Controllers/UserController.php`

```php
<?php
namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('company:id,name')
            ->when(request('search'), fn($q, $s) => $q->where('name', 'like', "%$s%")->orWhere('email', 'like', "%$s%"))
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Users/Index', ['users' => $users, 'filters' => request()->only('search')]);
    }

    public function create()
    {
        $companies = Company::select('id', 'name')->where('is_active', true)->get();
        return Inertia::render('Admin/Users/Create', compact('companies'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users',
            'password'   => 'required|min:8|confirmed',
            'role'       => 'required|in:super_admin,company_admin,user',
            'company_id' => 'nullable|exists:companies,id',
            'phone'      => 'nullable|string',
            'is_active'  => 'boolean',
        ]);

        User::create($validated);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $companies = Company::select('id', 'name')->where('is_active', true)->get();
        return Inertia::render('Admin/Users/Edit', ['user' => $user, 'companies' => $companies]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email,' . $user->id,
            'password'   => 'nullable|min:8|confirmed',
            'role'       => 'required|in:super_admin,company_admin,user',
            'company_id' => 'nullable|exists:companies,id',
            'phone'      => 'nullable|string',
            'is_active'  => 'boolean',
        ]);

        if (empty($validated['password'])) unset($validated['password']);

        $user->update($validated);

        return back()->with('success', 'User updated.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User deleted.');
    }
}
```

### File: `app/Http/Controllers/CustomerController.php`

```php
<?php
namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    private function companyId(): int
    {
        return auth()->user()->company_id;
    }

    public function index()
    {
        $customers = Customer::where('company_id', $this->companyId())
            ->when(request('search'), fn($q, $s) => $q->where('business_name', 'like', "%$s%")->orWhere('ntn_cnic', 'like', "%$s%"))
            ->latest()
            ->paginate(15);

        return Inertia::render('Customers/Index', ['customers' => $customers, 'filters' => request()->only('search')]);
    }

    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_name'     => 'required|string|max:255',
            'ntn_cnic'          => 'nullable|string|max:20',
            'registration_type' => 'required|in:Registered,Unregistered',
            'province'          => 'nullable|string',
            'address'           => 'nullable|string',
            'phone'             => 'nullable|string',
            'email'             => 'nullable|email',
            'contact_person'    => 'nullable|string',
            'is_active'         => 'boolean',
        ]);

        $validated['company_id'] = $this->companyId();
        Customer::create($validated);

        return redirect()->route('customers.index')->with('success', 'Customer created.');
    }

    public function edit(Customer $customer)
    {
        $this->authorize('update', $customer);
        return Inertia::render('Customers/Edit', compact('customer'));
    }

    public function update(Request $request, Customer $customer)
    {
        $this->authorize('update', $customer);

        $validated = $request->validate([
            'business_name'     => 'required|string|max:255',
            'ntn_cnic'          => 'nullable|string|max:20',
            'registration_type' => 'required|in:Registered,Unregistered',
            'province'          => 'nullable|string',
            'address'           => 'nullable|string',
            'phone'             => 'nullable|string',
            'email'             => 'nullable|email',
            'contact_person'    => 'nullable|string',
            'is_active'         => 'boolean',
        ]);

        $customer->update($validated);

        return back()->with('success', 'Customer updated.');
    }

    public function destroy(Customer $customer)
    {
        $this->authorize('delete', $customer);
        $customer->delete();
        return redirect()->route('customers.index')->with('success', 'Customer deleted.');
    }
}
```

### File: `app/Http/Controllers/ProductController.php`

```php
<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    private function companyId(): int { return auth()->user()->company_id; }

    public function index()
    {
        $products = Product::where('company_id', $this->companyId())
            ->when(request('search'), fn($q, $s) => $q->where('name', 'like', "%$s%")->orWhere('hs_code', 'like', "%$s%"))
            ->latest()
            ->paginate(15);

        return Inertia::render('Products/Index', ['products' => $products, 'filters' => request()->only('search')]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'description'         => 'nullable|string',
            'hs_code'             => 'required|string|max:20',
            'sale_type'           => 'required|string',
            'rate'                => 'required|string',
            'uom'                 => 'nullable|string',
            'unit_price'          => 'nullable|numeric|min:0',
            'fixed_notified_price' => 'nullable|numeric|min:0',
            'is_active'           => 'boolean',
        ]);

        $validated['company_id'] = $this->companyId();
        Product::create($validated);

        return redirect()->route('products.index')->with('success', 'Product created.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'description'         => 'nullable|string',
            'hs_code'             => 'required|string|max:20',
            'sale_type'           => 'required|string',
            'rate'                => 'required|string',
            'uom'                 => 'nullable|string',
            'unit_price'          => 'nullable|numeric|min:0',
            'fixed_notified_price' => 'nullable|numeric|min:0',
            'is_active'           => 'boolean',
        ]);

        $product->update($validated);
        return back()->with('success', 'Product updated.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted.');
    }
}
```

### File: `app/Http/Controllers/InvoiceController.php`

```php
<?php
namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    private function companyId(): int { return auth()->user()->company_id; }

    public function index()
    {
        $invoices = Invoice::with(['customer', 'items'])
            ->where('company_id', $this->companyId())
            ->when(request('search'), fn($q, $s) =>
                $q->where('fbr_invoice_number', 'like', "%$s%")
                  ->orWhereHas('customer', fn($cq) => $cq->where('business_name', 'like', "%$s%"))
            )
            ->latest()
            ->paginate(15)
            ->through(fn($inv) => [
                'id'                 => $inv->id,
                'invoice_type'       => $inv->invoice_type,
                'invoice_date'       => $inv->invoice_date?->format('Y-m-d'),
                'buyer_name'         => $inv->customer?->business_name ?? $inv->buyer_business_name,
                'fbr_invoice_number' => $inv->fbr_invoice_number,
                'fbr_status'         => $inv->fbr_status,
                'environment'        => $inv->environment,
                'total_sales'        => $inv->items->sum('value_sales_excluding_st'),
                'total_tax'          => $inv->items->sum('sales_tax_applicable'),
                'items_count'        => $inv->items->count(),
                'submitted_at'       => $inv->submitted_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('Invoices/Index', ['invoices' => $invoices, 'filters' => request()->only('search')]);
    }

    public function create()
    {
        $customers = Customer::where('company_id', $this->companyId())->where('is_active', true)->get(['id', 'business_name', 'ntn_cnic', 'registration_type', 'province', 'address']);
        $products = Product::where('company_id', $this->companyId())->where('is_active', true)->get();
        $company = auth()->user()->company;

        return Inertia::render('Invoices/Create', compact('customers', 'products', 'company'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_type'           => 'required|in:Sale Invoice,Debit Note',
            'invoice_date'           => 'required|date',
            'customer_id'            => 'nullable|exists:customers,id',
            'buyer_ntn_cnic'         => 'nullable|string',
            'buyer_business_name'    => 'required|string',
            'buyer_province'         => 'required|string',
            'buyer_address'          => 'nullable|string',
            'buyer_registration_type' => 'required|in:Registered,Unregistered',
            'invoice_ref_no'         => 'nullable|string',
            'scenario_id'            => 'nullable|string',
            'environment'            => 'required|in:sandbox,production',
            'items'                  => 'required|array|min:1',
            'items.*.hs_code'        => 'required|string',
            'items.*.product_description' => 'required|string',
            'items.*.rate'           => 'required|string',
            'items.*.uom'            => 'required|string',
            'items.*.quantity'       => 'required|numeric',
            'items.*.value_sales_excluding_st' => 'required|numeric',
            'items.*.sales_tax_applicable'     => 'required|numeric',
            'items.*.sale_type'      => 'required|string',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $company = auth()->user()->company;

            $invoice = Invoice::create([
                ...$validated,
                'company_id'            => $this->companyId(),
                'user_id'               => auth()->id(),
                'seller_ntn_cnic'       => $company->ntn,
                'seller_business_name'  => $company->name,
                'seller_province'       => $company->province,
                'seller_address'        => $company->head_office,
            ]);

            foreach ($validated['items'] as $item) {
                $invoice->items()->create($item);
            }

            $this->invoice = $invoice;
        });

        return redirect()->route('invoices.index')->with('success', 'Invoice created.');
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(['items', 'customer', 'company']);
        return Inertia::render('Invoices/Show', compact('invoice'));
    }

    public function submitToFbr(Invoice $invoice)
    {
        $invoice->load(['items', 'company']);
        $company = $invoice->company;

        $fbrToken = $company->fbr_token; // auto-decrypted
        if (!$fbrToken) {
            return back()->withErrors(['fbr' => 'FBR token not configured for this company.']);
        }

        $isSandbox = $invoice->environment === 'sandbox';
        $url = $isSandbox
            ? 'https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb'
            : 'https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata';

        $payload = [
            'invoiceType'          => $invoice->invoice_type,
            'invoiceDate'          => $invoice->invoice_date->format('Y-m-d'),
            'sellerNTNCNIC'        => $invoice->seller_ntn_cnic,
            'sellerBusinessName'   => $invoice->seller_business_name,
            'sellerProvince'       => $invoice->seller_province,
            'sellerAddress'        => $invoice->seller_address,
            'buyerNTNCNIC'         => $invoice->buyer_ntn_cnic,
            'buyerBusinessName'    => $invoice->buyer_business_name,
            'buyerProvince'        => $invoice->buyer_province,
            'buyerAddress'         => $invoice->buyer_address,
            'buyerRegistrationType' => $invoice->buyer_registration_type,
            'invoiceRefNo'         => $invoice->invoice_ref_no ?? '',
            'items'                => $invoice->items->map(fn($item) => [
                'hsCode'                          => $item->hs_code,
                'productDescription'              => $item->product_description,
                'rate'                            => $item->rate,
                'uoM'                             => $item->uom,
                'quantity'                        => (float) $item->quantity,
                'totalValues'                     => (float) $item->total_values,
                'valueSalesExcludingST'            => (float) $item->value_sales_excluding_st,
                'fixedNotifiedValueOrRetailPrice' => (float) $item->fixed_notified_value_or_retail_price,
                'salesTaxApplicable'              => (float) $item->sales_tax_applicable,
                'salesTaxWithheldAtSource'        => (float) $item->sales_tax_withheld_at_source,
                'extraTax'                        => (float) $item->extra_tax,
                'furtherTax'                      => (float) $item->further_tax,
                'sroScheduleNo'                   => $item->sro_schedule_no ?? '',
                'fedPayable'                      => (float) $item->fed_payable,
                'discount'                        => (float) $item->discount,
                'saleType'                        => $item->sale_type,
                'sroItemSerialNo'                 => $item->sro_item_serial_no ?? '',
            ])->toArray(),
        ];

        if ($isSandbox && $invoice->scenario_id) {
            $payload['scenarioId'] = $invoice->scenario_id;
        }

        try {
            $response = Http::withToken($fbrToken)
                ->timeout(30)
                ->post($url, $payload);

            $result = $response->json();
            $status = $result['validationResponse']['status'] ?? 'Unknown';
            $fbrNumber = $result['invoiceNumber'] ?? null;

            $invoice->update([
                'fbr_invoice_number' => $fbrNumber,
                'fbr_status'         => $status,
                'fbr_response'       => $result,
                'submitted_at'       => now(),
            ]);

            return back()->with('success', "Invoice submitted to FBR. Status: $status");
        } catch (\Exception $e) {
            return back()->withErrors(['fbr' => 'FBR API error: ' . $e->getMessage()]);
        }
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return redirect()->route('invoices.index')->with('success', 'Invoice deleted.');
    }
}
```

---

## STEP 8 — Routes

### File: `routes/web.php`

```php
<?php
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Admin Routes (super_admin only)
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('companies', CompanyController::class);
        Route::resource('users', UserController::class);
    });

    // Company Routes (company_admin + user)
    Route::resource('customers', CustomerController::class);
    Route::resource('products', ProductController::class);

    // Invoices
    Route::resource('invoices', InvoiceController::class)->except(['edit', 'update']);
    Route::post('invoices/{invoice}/submit-fbr', [InvoiceController::class, 'submitToFbr'])->name('invoices.submit-fbr');
});

require __DIR__.'/auth.php';
```

---

## STEP 9 — Inertia Root Layout

### File: `resources/js/app.js` — Replace with:

```js
import './bootstrap';
import '../css/app.css';
import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'FBR Enterprise';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .mount(el);
    },
    progress: {
        color: '#1a3a6b',
    },
});
```

---

## STEP 10 — Blade Layout

### File: `resources/views/app.blade.php`

```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    @routes
    @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
```

---

## STEP 11 — Run Commands

```bash
# Generate app key
php artisan key:generate

# Create storage link
php artisan storage:link

# Run migrations + seed
php artisan migrate --seed

# Start dev server
php artisan serve
npm run dev
```

---

## Login Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@fbr.com | password |
| Company Admin | admin@wixapparel.com | password |

---

## STEP 12 — Policies (Company Scope)

### File: `app/Policies/CustomerPolicy.php`

```php
<?php
namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
{
    public function update(User $user, Customer $customer): bool
    {
        return $user->isSuperAdmin() || $user->company_id === $customer->company_id;
    }

    public function delete(User $user, Customer $customer): bool
    {
        return $user->isSuperAdmin() || $user->company_id === $customer->company_id;
    }
}
```

Register in `app/Providers/AppServiceProvider.php`:
```php
use App\Models\Customer;
use App\Policies\CustomerPolicy;
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::policy(Customer::class, CustomerPolicy::class);
}
```

---

## Vue Pages — Paste These in `resources/js/Pages/`

> The Vue pages will use Inertia's `useForm`, `Link`, and `router`.
> In the fbr-enterprise project, tell Kiro:
> "Create all Vue pages for Dashboard, Admin/Companies, Admin/Users, Customers, Products, Invoices using Inertia.js + Vue 3 based on the controllers above."
