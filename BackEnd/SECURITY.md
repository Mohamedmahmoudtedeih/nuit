# Security Documentation

## حماية التطبيق من الثغرات الأمنية (Application Security Protection)

### 1. حماية SQL Injection (SQL Injection Protection)

#### كيف يحمي Django من SQL Injection؟

Django ORM يستخدم **Parameterized Queries** (استعلامات معاملات) تلقائياً، مما يعني أن جميع المدخلات يتم معالجتها كقيم وليس ككود SQL.

**مثال على الحماية:**

```python
# ✅ آمن - Django ORM يحمي تلقائياً
queryset = Listing.objects.filter(location__icontains=user_input)

# Django يقوم بتحويل هذا إلى:
# SELECT * FROM listings WHERE location LIKE %s
# مع القيمة ['%user_input%'] كمعامل منفصل
```

**ماذا لو استخدمنا كود SQL مباشر؟**

```python
# ❌ خطير - لا تستخدم هذا أبداً!
from django.db import connection
cursor = connection.cursor()
cursor.execute(f"SELECT * FROM listings WHERE location = '{user_input}'")
```

**الهدف من ثغرة SQL Injection:**
- قراءة بيانات حساسة من قاعدة البيانات
- تعديل أو حذف البيانات
- تجاوز المصادقة والوصول كمسؤول
- تنفيذ أوامر SQL خبيثة

**الحادثة (Incident):**
عندما يتم دمج مدخلات المستخدم مباشرة في استعلام SQL دون معالجة، يمكن للمهاجم حقن كود SQL خبيث. على سبيل المثال:

```sql
-- إذا أدخل المستخدم: ' OR '1'='1
-- يصبح الاستعلام:
SELECT * FROM users WHERE phone = '' OR '1'='1'
-- وهذا يعيد جميع المستخدمين!
```

**الحماية في هذا التطبيق:**
- ✅ جميع الاستعلامات تستخدم Django ORM
- ✅ لا يوجد استخدام لـ `raw()` أو `execute()` مباشر
- ✅ جميع المدخلات يتم التحقق منها وتنظيفها
- ✅ استخدام Parameterized Queries تلقائياً

---

### 2. حماية XSS (Cross-Site Scripting Protection)

**الحماية المطبقة:**
- ✅ Django templates تفلتر HTML تلقائياً
- ✅ REST Framework serializers تتحقق من المدخلات
- ✅ Content Security Policy headers (في الإنتاج)

---

### 3. حماية CSRF (Cross-Site Request Forgery Protection)

**الحماية المطبقة:**
- ✅ `CSRF_COOKIE_SECURE = True` (في الإنتاج)
- ✅ `CSRF_COOKIE_HTTPONLY = True`
- ✅ Django CSRF middleware مفعل

---

### 4. حماية رفع الملفات (File Upload Security)

**القيود المطبقة:**
- ✅ حجم الملف: 10MB كحد أقصى
- ✅ أنواع الملفات المسموحة: JPEG, PNG, WebP فقط
- ✅ التحقق من أبعاد الصور (100x100 إلى 5000x5000)
- ✅ التحقق من نوع MIME
- ✅ التحقق من الامتداد

---

### 5. إعدادات الأمان (Security Settings)

**في الإنتاج (Production):**
```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']  # محدود
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
```

**في التطوير (Development):**
```python
DEBUG = True
ALLOWED_HOSTS = ['*']  # للتطوير فقط
CORS_ALLOW_ALL_ORIGINS = True  # للتطوير فقط
```

---

### 6. التحقق من المدخلات (Input Validation)

**جميع المدخلات يتم:**
- ✅ التحقق من النوع (Type validation)
- ✅ التحقق من النطاق (Range validation)
- ✅ تنظيف السلاسل (String sanitization)
- ✅ تحديد الحد الأقصى للطول (Length limits)

**مثال:**
```python
def _validate_numeric_param(self, value, param_name, min_val=None, max_val=None):
    """Validate and sanitize numeric query parameters."""
    try:
        num_value = float(value)
        if min_val is not None and num_value < min_val:
            raise ValidationError(f"{param_name} must be >= {min_val}")
        return num_value
    except (ValueError, TypeError):
        raise ValidationError(f"{param_name} must be a valid number")
```

---

### 7. المصادقة والتفويض (Authentication & Authorization)

**الحماية المطبقة:**
- ✅ JWT Authentication
- ✅ Token expiration (7 days access, 30 days refresh)
- ✅ Role-based permissions (staff/admin checks)
- ✅ Owner verification for sensitive operations

---

### 8. قاعدة البيانات (Database Security)

**الإعدادات:**
- ✅ استخدام environment variables للبيانات الحساسة
- ✅ STRICT_TRANS_TABLES mode
- ✅ UTF-8 encoding (utf8mb4)

---

## ملاحظات مهمة (Important Notes)

1. **لا تستخدم `raw()` أو `execute()` مباشرة** - استخدم Django ORM دائماً
2. **تحقق من جميع المدخلات** - لا تثق بأي مدخل من المستخدم
3. **استخدم HTTPS في الإنتاج** - دائماً
4. **احفظ SECRET_KEY آمنة** - لا ترفعها إلى Git
5. **راقب السجلات** - تتبع محاولات الاختراق

---

## اختبار الأمان (Security Testing)

لاختبار الحماية من SQL Injection، يمكنك:

1. **محاولة حقن SQL في حقول البحث:**
   ```
   Location: ' OR '1'='1
   ```
   يجب أن يتم التعامل معها كسلسلة نصية عادية، وليس ككود SQL.

2. **فحص الاستجابات:**
   - يجب ألا تظهر أخطاء SQL في الاستجابات
   - يجب أن تكون الاستجابات متسقة

---

## المراجع (References)

- [Django Security Best Practices](https://docs.djangoproject.com/en/stable/topics/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django ORM Security](https://docs.djangoproject.com/en/stable/topics/db/queries/#passing-parameters-into-raw)

