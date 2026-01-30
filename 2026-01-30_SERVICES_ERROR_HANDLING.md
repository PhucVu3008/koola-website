# Services Admin - Enhanced Error Handling

**Date**: 2026-01-30  
**Module**: Services CRUD (Admin)  
**Status**: ✅ Complete

---

## Overview

Applied detailed error handling pattern to Services admin module, following the same standards as Posts module.

---

## Changes Made

### 1. Backend Controller - `adminServiceController.ts` ✅

#### Create Service Endpoint
```typescript
export const createService = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = adminServiceCreateSchema.parse(request.body);

    const user = request.user as any;
    const userId = Number(user?.id);
    if (!userId || Number.isNaN(userId)) {
      return reply
        .status(401)
        .send(errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required'));
    }

    const id = await adminServiceService.createService({ userId, data: body });

    return reply.status(201).send(successResponse({ id }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Validation failed. Please check required fields.', {
          issues: error.issues,  // ← All validation errors
          requiredFields: ['locale', 'title', 'slug', 'slug_group', 'excerpt', 'content_md'],
        })
      );
    }
    throw error;
  }
};
```

**What Changed:**
- ✅ Wrapped in try-catch block
- ✅ Added ZodError detection
- ✅ Return detailed error response with `issues` array
- ✅ List required fields for user guidance

---

#### Update Service Endpoint
```typescript
export const updateService = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = idParamsSchema.parse(request.params);
    const body = adminServiceUpdateSchema.parse(request.body);

    const user = request.user as any;
    const userId = Number(user?.id);
    if (!userId || Number.isNaN(userId)) {
      return reply
        .status(401)
        .send(errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required'));
    }

    // Enforce required core fields for PUT semantics.
    const required = adminServiceCreateSchema.safeParse(body);
    if (!required.success) {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Validation failed. Missing required fields.', {
          issues: required.error.issues,  // ← Field-level errors
          requiredFields: ['locale', 'title', 'slug', 'slug_group', 'excerpt', 'content_md'],
        })
      );
    }

    const updatedId = await adminServiceService.updateService({ id, userId, data: required.data });
    if (!updatedId) {
      return reply.status(404).send(errorResponse(ErrorCodes.NOT_FOUND, 'Service not found'));
    }

    return reply.send(successResponse({ id: updatedId }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Validation failed. Please check required fields.', {
          issues: error.issues,
          requiredFields: ['locale', 'title', 'slug', 'slug_group', 'excerpt', 'content_md'],
        })
      );
    }
    throw error;
  }
};
```

**What Changed:**
- ✅ Enhanced error message: "Missing required fields"
- ✅ Added try-catch for unexpected errors
- ✅ Consistent error format with Posts module
- ✅ Both safeParse failure AND try-catch handled

---

### 2. Frontend Form - `ServiceForm.tsx` ✅

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setSaving(true);
  setError('');

  try {
    // ... payload construction
    
    let resultId: number;
    
    if (mode === 'create') {
      const response = await adminApi.createService(payload);
      resultId = (response.data as any)?.id || serviceId!;
    } else if (serviceId) {
      await adminApi.updateService(serviceId, payload);
      resultId = serviceId;
      
      // Auto-sync images
      if (formData.hero_image_url) {
        try {
          await adminApi.syncServiceImages(serviceId);
        } catch (syncError) {
          console.error('Failed to sync images:', syncError);
        }
      }
    }
    
    setSavedServiceId(resultId!);
    setShowTranslationModal(true);
  } catch (err: any) {
    // ✅ Display detailed validation errors
    if (err.message && err.message.includes('Validation')) {
      setError(`❌ ${err.message}`);
    } else {
      setError(err.message || `Failed to ${mode} service`);
    }
    setSaving(false);
  }
};
```

**What Changed:**
- ✅ Check if error message includes "Validation"
- ✅ Add ❌ emoji prefix for better visibility
- ✅ Display full error message (already formatted by admin-api.ts)
- ✅ Consistent with Posts error handling

---

## Error Message Examples

### Before Enhancement
```
❌ "Invalid data"
❌ "Failed to create service"
❌ "Validation error"
```

### After Enhancement

#### Missing Required Field
```
❌ Validation Error:

• title: Required
  Expected: string
  Received: undefined

• slug: Required
  Expected: string
  Received: undefined

Required fields: locale, title, slug, slug_group, excerpt, content_md

Please fix the errors above and try again.
```

#### Invalid Field Type
```
❌ Validation Error:

• display_order: Expected number, received string
  Expected: number
  Received: "abc"

Please fix the errors above and try again.
```

---

## Services Form Field Mapping

**Important:** Form fields have different names than API/DB fields.

| Form Field | API/DB Field | Type | Required |
|------------|--------------|------|----------|
| `title` | `title` | string | ✅ Yes |
| `slug` | `slug` | string | ✅ Yes |
| `slug_group` | `slug_group` | string | ✅ Yes |
| `short_description` | `excerpt` | string | ✅ Yes |
| `description` | `content_md` | string | ✅ Yes |
| `hero_image_url` | `hero_asset_id` | number | No |
| `icon_name` | `icon_name` | string | No |
| `display_order` | `sort_order` | number | No |
| `meta_title` | `seo_title` | string | No |
| `meta_description` | `seo_description` | string | No |

**Form to API Mapping:**
```typescript
const payload = {
  locale: formData.locale,
  title: formData.title,
  slug: formData.slug,
  slug_group: formData.slug_group,
  excerpt: formData.short_description,          // ← mapped
  content_md: formData.description,             // ← mapped
  hero_asset_id: parseInt(formData.hero_image_url) || null,  // ← mapped + converted
  icon_name: formData.icon_name,
  status: formData.status,
  sort_order: formData.display_order,           // ← mapped
  seo_title: formData.meta_title,               // ← mapped
  seo_description: formData.meta_description,   // ← mapped
  canonical_url: '',
  published_at: formData.status === 'published' ? new Date().toISOString() : null,
};
```

---

## Common Validation Errors & Solutions

### Error: "title: Required"
**Cause:** Title field is empty

**Solution:**
```typescript
// Frontend validation
if (!formData.title.trim()) {
  setError('Title is required');
  return false;
}
```

---

### Error: "slug_group: Required"
**Cause:** Slug group not selected or empty

**Solution:**
```typescript
// Ensure slug_group is set
if (!formData.slug_group) {
  setError('Slug group is required');
  return false;
}
```

---

### Error: "excerpt: Required"
**Cause:** Short description field is empty

**Solution:**
```typescript
// Frontend validation
if (!formData.short_description.trim()) {
  setError('Short description is required');
  return false;
}

// Map to API field
payload.excerpt = formData.short_description;  // ← Don't forget mapping!
```

---

### Error: "hero_asset_id: Expected number, received string"
**Cause:** Image URL sent as string instead of parsing to number

**Solution:**
```typescript
// ✅ CORRECT: Parse to number or null
hero_asset_id: formData.hero_image_url ? parseInt(formData.hero_image_url) : null

// ❌ WRONG: Send as string
hero_asset_id: formData.hero_image_url  // This is a string!
```

---

## Testing Validation Errors

### Test Case 1: Create Service with Empty Fields
```bash
# Open admin panel
open http://localhost:3000/admin/en/services/new

# Steps:
1. Don't fill any fields
2. Click Save
3. Expected: See validation errors for all required fields
```

**Expected Error:**
```
❌ Validation Error:

• title: Required
• slug: Required
• slug_group: Required
• excerpt: Required
• content_md: Required
```

---

### Test Case 2: Create Service with Invalid Display Order
```bash
# Steps:
1. Fill required fields
2. Enter "abc" in Display Order field (expects number)
3. Click Save
4. Expected: See specific error about display_order
```

**Expected Error:**
```
❌ Validation Error:

• sort_order: Expected number, received string
  Expected: number
  Received: "abc"
```

---

### Test Case 3: Update Service with Missing Short Description
```bash
# Steps:
1. Edit existing service
2. Clear the "Short Description" field
3. Click Save
4. Expected: See error about excerpt field
```

**Expected Error:**
```
❌ Validation Error:

• excerpt: Required
  Expected: string
  Received: undefined

Required fields: locale, title, slug, slug_group, excerpt, content_md
```

---

## Files Modified

1. **Backend Controller**
   - `apps/api/src/controllers/adminServiceController.ts`
   - Added try-catch to `createService()`
   - Added try-catch to `updateService()`
   - Enhanced error messages with `issues` and `requiredFields`

2. **Frontend Form**
   - `apps/web/src/components/admin/ServiceForm.tsx`
   - Enhanced error display in `handleSubmit()`
   - Check for "Validation" in error message
   - Add ❌ prefix for visibility

3. **Instructions**
   - `.github/copilot-instructions.md`
   - Added **mandatory** error handling section
   - Code examples for create/update patterns
   - Checklist for new CRUD endpoints
   - Reference to documentation

---

## Consistency with Posts Module

Both Posts and Services now follow the **exact same error handling pattern**:

| Aspect | Posts | Services | Status |
|--------|-------|----------|--------|
| Backend try-catch | ✅ | ✅ | Consistent |
| ZodError detection | ✅ | ✅ | Consistent |
| `issues` in response | ✅ | ✅ | Consistent |
| `requiredFields` hint | ✅ | ✅ | Consistent |
| Frontend error check | ✅ | ✅ | Consistent |
| Detailed display | ✅ | ✅ | Consistent |

**API Response Format:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed. Missing required fields.",
    "details": {
      "issues": [
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "undefined",
          "path": ["title"],
          "message": "Required"
        }
      ],
      "requiredFields": ["locale", "title", "slug", "slug_group", "excerpt", "content_md"]
    }
  }
}
```

---

## Updated Instructions

### New Mandatory Rule Added to `.github/copilot-instructions.md`

```markdown
### API Error Handling Standard (MANDATORY)

**Every API controller method that uses Zod validation MUST implement detailed error handling.**

#### Required Pattern for All Create/Update Endpoints:
[... code examples ...]

#### When Creating New CRUD Endpoints:

**Checklist** (MUST complete all):
- [ ] Wrap `.parse()` calls in try-catch
- [ ] Check for `error.name === 'ZodError'`
- [ ] Return `errorResponse()` with `issues` and `requiredFields`
- [ ] Frontend filters null values from arrays
- [ ] Frontend displays detailed error messages
- [ ] Test with invalid data to verify error messages
```

**Impact:**
- All future CRUD endpoints MUST follow this pattern
- No more generic error messages
- Consistent error handling across all modules

---

## Prevention Guidelines

### Backend Best Practices

#### ✅ DO: Wrap Zod parse in try-catch
```typescript
try {
  const body = schema.parse(request.body);
  // ... logic
} catch (error: any) {
  if (error.name === 'ZodError') {
    return reply.status(400).send(
      errorResponse(ErrorCodes.VALIDATION_ERROR, '...', {
        issues: error.issues,
        requiredFields: [...]
      })
    );
  }
  throw error;
}
```

#### ❌ DON'T: Parse without error handling
```typescript
const body = schema.parse(request.body);  // Unhandled ZodError!
```

---

### Frontend Best Practices

#### ✅ DO: Check for validation errors
```typescript
catch (err: any) {
  if (err.message && err.message.includes('Validation')) {
    setError(`❌ ${err.message}`);
  } else {
    setError(err.message || 'Failed to save');
  }
}
```

#### ❌ DON'T: Show generic errors
```typescript
catch (err: any) {
  setError('Failed to save');  // No details!
}
```

---

### Form Validation Best Practices

#### ✅ DO: Validate before submit
```typescript
const validateForm = (): boolean => {
  if (!formData.title.trim()) {
    setError('Title is required');
    return false;
  }
  // ... more checks
  return true;
};
```

#### ❌ DON'T: Skip frontend validation
```typescript
// Sending invalid data to API without checking
await adminApi.createService(formData);
```

---

## Benefits

### For Users
✅ **Clear error messages** - Know exactly what's wrong  
✅ **Field-level details** - See which field has error  
✅ **Expected vs Received** - Understand what's needed  
✅ **Actionable feedback** - Know how to fix the error

### For Developers
✅ **Easier debugging** - Errors include field paths  
✅ **Type safety** - Zod validates at runtime  
✅ **Consistent pattern** - All modules follow same structure  
✅ **Better logging** - Detailed errors in API logs

### For API
✅ **Standardized responses** - Always return same format  
✅ **Validation at edge** - Catch errors before processing  
✅ **Type information** - Include expected/received types  
✅ **Production-ready** - Handle all error cases

---

## Next Steps

### Immediate
- ✅ Services error handling complete
- ✅ Instructions updated with mandatory rules
- [ ] Test Services create/edit with invalid data

### Short-term
- [ ] Apply same pattern to other admin modules:
  - [ ] Pages CRUD
  - [ ] Jobs/Careers CRUD
  - [ ] Categories/Tags CRUD
  - [ ] Site Settings
  - [ ] Navigation Items

### Long-term
- [ ] Add inline field validation (before submit)
- [ ] Show errors next to fields (not just alert)
- [ ] Real-time validation as user types
- [ ] Toast notifications instead of alerts

---

## Related Documentation

- **Error Handling Guide**: `2026-01-30_ERROR_HANDLING_IMPROVEMENT.md`
- **Posts Implementation**: `apps/api/src/controllers/adminPostController.ts`
- **API Client**: `apps/web/src/lib/admin-api.ts` (handles error formatting)
- **Instructions**: `.github/copilot-instructions.md` (mandatory rules)

---

**Status**: ✅ Services Error Handling Complete  
**Next**: Apply pattern to remaining admin modules  
**Impact**: Consistent, detailed error messages across all CRUD operations
