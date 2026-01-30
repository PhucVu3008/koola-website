# Admin Error Handling - Implementation Checklist

**Date**: 2026-01-30  
**Purpose**: Track error handling implementation across all admin modules  
**Standard**: Detailed validation error messages with field-level details

---

## Implementation Status

| Module | Controller | Create | Update | Delete | Frontend Form | Status |
|--------|-----------|--------|--------|--------|---------------|--------|
| **Posts** | `adminPostController.ts` | ✅ | ✅ | N/A | ✅ `PostForm.tsx` | ✅ Complete |
| **Services** | `adminServiceController.ts` | ✅ | ✅ | N/A | ✅ `ServiceForm.tsx` | ✅ Complete |
| **Pages** | `adminPagesController.ts` | ⏳ | ⏳ | ⏳ | ⏳ Need check | ⏳ Pending |
| **Jobs/Careers** | Need check | ⏳ | ⏳ | ⏳ | ⏳ Need check | ⏳ Pending |
| **Categories/Tags** | `adminTaxonomyController.ts` | ⏳ | ⏳ | ⏳ | ⏳ Need check | ⏳ Pending |
| **Nav Items** | `adminNavItemController.ts` | ⏳ | ⏳ | ⏳ | ⏳ Need check | ⏳ Pending |
| **Site Settings** | `adminSiteSettingsController.ts` | N/A | ⏳ | N/A | ⏳ Need check | ⏳ Pending |
| **Media** | `adminMediaController.ts` | ⏳ | N/A | ⏳ | ⏳ Need check | ⏳ Pending |
| **Leads** | `adminLeadController.ts` | N/A | ⏳ | ⏳ | N/A | ⏳ Pending |
| **Newsletter** | `adminNewsletterSubscriberController.ts` | N/A | N/A | ⏳ | N/A | ⏳ Pending |

**Legend:**
- ✅ Complete - Detailed error handling implemented
- ⏳ Pending - Need to check and implement
- N/A - Not applicable (no create/update for this action)

---

## Standard Pattern (MUST FOLLOW)

### Backend Controller

```typescript
export const createResource = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const body = resourceCreateSchema.parse(request.body);
    
    // ... authentication check
    // ... business logic
    
    return reply.status(201).send(successResponse(result));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.status(400).send(
        errorResponse(ErrorCodes.VALIDATION_ERROR, 'Validation failed. Please check required fields.', {
          issues: error.issues,  // ← REQUIRED
          requiredFields: ['field1', 'field2', 'field3'],  // ← REQUIRED
        })
      );
    }
    throw error;
  }
};
```

### Frontend Form

```typescript
catch (err: any) {
  // Display detailed validation errors
  if (err.message && err.message.includes('Validation')) {
    setError(`❌ ${err.message}`);
  } else {
    setError(err.message || 'Failed to save');
  }
  setSaving(false);
}
```

---

## Implementation Checklist (Per Module)

When implementing error handling for a module, complete ALL items:

### Backend Tasks
- [ ] Find controller file (e.g., `adminPagesController.ts`)
- [ ] Identify all endpoints with Zod `.parse()` calls
- [ ] Wrap each `.parse()` in try-catch block
- [ ] Check for `error.name === 'ZodError'`
- [ ] Return `errorResponse()` with:
  - [ ] `issues: error.issues`
  - [ ] `requiredFields: [...]` array
- [ ] For update endpoints with `safeParse()`:
  - [ ] Check `!success` condition
  - [ ] Return same detailed error format
- [ ] Test with invalid data (curl or Postman)

### Frontend Tasks
- [ ] Find form component (e.g., `PageForm.tsx`)
- [ ] Locate `handleSubmit()` or save function
- [ ] Wrap API calls in try-catch
- [ ] Check if error includes "Validation"
- [ ] Display detailed error with ❌ prefix
- [ ] If arrays are sent:
  - [ ] Filter null/undefined values before submit
  - [ ] Use type-safe filter: `filter((id): id is number => ...)`
- [ ] Test in browser with invalid inputs

### Testing Tasks
- [ ] Test with empty required fields
- [ ] Test with invalid types (string instead of number)
- [ ] Test with null values in arrays (if applicable)
- [ ] Verify error message shows field names
- [ ] Verify error message shows expected vs received
- [ ] Check API logs for detailed error info

---

## Priority Order

### High Priority (User-facing CRUD)
1. ✅ Posts (complete)
2. ✅ Services (complete)
3. ⏳ Pages - User-facing content
4. ⏳ Jobs/Careers - User-facing content

### Medium Priority (Admin configuration)
5. ⏳ Categories/Tags - Content taxonomy
6. ⏳ Nav Items - Site navigation
7. ⏳ Site Settings - Configuration

### Low Priority (Admin tools)
8. ⏳ Media - File management
9. ⏳ Leads - View only (update status)
10. ⏳ Newsletter - View/delete only

---

## Quick Reference

### Common Required Fields by Module

**Posts:**
```typescript
requiredFields: ['locale', 'title', 'slug', 'content_md']
```

**Services:**
```typescript
requiredFields: ['locale', 'title', 'slug', 'slug_group', 'excerpt', 'content_md']
```

**Pages:**
```typescript
requiredFields: ['locale', 'title', 'slug', 'template']  // Need to verify
```

**Categories/Tags:**
```typescript
requiredFields: ['name', 'slug', 'kind']  // Need to verify
```

**Nav Items:**
```typescript
requiredFields: ['locale', 'label', 'url', 'position']  // Need to verify
```

---

## Files to Update (Per Module)

### Example: Pages Module

**Backend:**
1. `apps/api/src/controllers/adminPagesController.ts`
   - Update `createPage()`
   - Update `updatePage()`
   - Update `deletePage()` (if needed)

**Frontend:**
2. Find page form component (search for `PageForm` or check pages admin routes)
3. Update error handling in submit function
4. Add null filtering if arrays are used

**Testing:**
5. Open `/admin/en/pages/new`
6. Test with invalid data
7. Verify error messages

---

## Testing Commands

### Backend API Testing (curl)

```bash
# Test create with empty body
curl -X POST http://localhost:4000/v1/admin/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{}'

# Expected: Detailed validation errors

# Test create with invalid type
curl -X POST http://localhost:4000/v1/admin/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": 123}'  # Should be string

# Expected: "Expected string, received number"
```

### Frontend Testing (Browser)

```
1. Open admin page: /admin/en/[module]/new
2. Leave required fields empty
3. Click Save
4. Check error message includes field names
5. Fill one field incorrectly (e.g., enter text in number field)
6. Click Save
7. Check error shows expected vs received type
```

---

## Documentation

Each completed module should have:
- [ ] Backend controller updated
- [ ] Frontend form updated
- [ ] Tested with invalid data
- [ ] Entry in this checklist marked ✅
- [ ] Optional: Specific notes in module docs

**Main Documentation:**
- Error Handling Guide: `2026-01-30_ERROR_HANDLING_IMPROVEMENT.md`
- Services Example: `2026-01-30_SERVICES_ERROR_HANDLING.md`
- Instructions: `.github/copilot-instructions.md`

---

## Common Issues & Solutions

### Issue: "Error message not showing field details"
**Cause:** Backend not returning `issues` array  
**Solution:** Check error response includes `error.issues`

### Issue: "Frontend shows [object Object]"
**Cause:** Trying to display object instead of string  
**Solution:** Use `err.message` or JSON.stringify for debugging

### Issue: "Error says 'received null' in array"
**Cause:** Form sends `[null]` instead of `[]`  
**Solution:** Filter arrays before submit:
```typescript
const validIds = arr.filter((id): id is number => id != null);
```

### Issue: "ZodError not caught"
**Cause:** Parse call not wrapped in try-catch  
**Solution:** Add try-catch around ALL `.parse()` calls

---

## Next Actions

### Today
- [ ] Check Pages controller and form
- [ ] Implement error handling if needed
- [ ] Test Pages create/edit with invalid data

### This Week
- [ ] Complete Jobs/Careers module
- [ ] Complete Categories/Tags module
- [ ] Complete Nav Items module

### Next Week
- [ ] Complete remaining modules
- [ ] Review all error messages for consistency
- [ ] Add inline field validation (stretch goal)

---

**Last Updated**: 2026-01-30  
**Status**: 2/10 modules complete (Posts, Services)  
**Next**: Pages module
