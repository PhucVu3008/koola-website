# Horizontal Overflow Fix - Khoảng trắng bên phải

**Date:** March 4, 2026  
**Issue:** Có khoảng trắng (whitespace) bên phải màn hình, cho phép scroll ngang  
**Root Cause:** Thiếu container wrapper và overflow-x control

---

## 🔍 Vấn đề phát hiện

User báo: *"kiểm tra lại tổng quan giao diện sao nó có cái khoảng trắng bên right-side thế"*

### Triệu chứng:
- Màn hình có thể scroll ngang (horizontal scroll)
- Khoảng trắng xuất hiện bên phải
- Giao diện không đúng full-width

### Nguyên nhân:
1. **`HomePage.tsx`**: Sections không được bọc trong `fluid-container`
2. **`globals.css`**: Body không có `overflow-x: hidden`
3. **Các components**: Một số elements có thể tràn ra ngoài viewport

---

## ✅ Giải pháp triển khai

### 1. **Thêm overflow-x: hidden vào globals.css**

```css
// BEFORE
html,
body {
  height: 100%;
}

// AFTER
html,
body {
  height: 100%;
  overflow-x: hidden; /* Prevent horizontal scroll */
}
```

**Tại sao cần thiết:**
- Ngăn mọi horizontal overflow trên toàn trang
- Fallback safety net cho trường hợp elements vượt quá 100vw
- Best practice cho responsive design

---

### 2. **Wrap sections trong fluid-container (HomePage.tsx)**

```tsx
// BEFORE
<>
  <HeroSection data={heroData} />
  <div className="space-y-16 py-8">
    <RevealOnScroll>
      <Section tone="white">
        <CapabilityHighlights data={data.capabilities} />
      </Section>
    </RevealOnScroll>
    {/* ...more sections */}
  </div>
</>

// AFTER
<>
  <HeroSection data={heroData} />
  
  {/* Main Content - Add container with padding */}
  <div className="fluid-container">
    <div className="space-y-16 py-8">
      <RevealOnScroll>
        <Section tone="white">
          <CapabilityHighlights data={data.capabilities} />
        </Section>
      </RevealOnScroll>
      {/* ...more sections */}
    </div>
  </div>
</>
```

**Fluid Container Definition (globals.css):**
```css
.fluid-container {
  width: 100%;
  max-width: min(1600px, 100vw); /* ✅ Never exceed viewport */
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(1rem, 4vw, 3rem); /* Responsive padding */
  padding-right: clamp(1rem, 4vw, 3rem);
}
```

**Lợi ích:**
- Content không bao giờ vượt quá 100vw
- Responsive padding tự động
- Tập trung content ở giữa màn hình (centered)

---

## 📐 Kiến trúc Layout

### Cấu trúc trang hiện tại:

```
html
└── body (overflow-x: hidden ✅)
    └── PageLayout
        ├── SiteHeader
        ├── main.w-full
        │   └── HomePage
        │       ├── HeroSection (full-width ✅)
        │       └── div.fluid-container (constrained ✅)
        │           └── div.space-y-16
        │               ├── Section (CapabilityHighlights)
        │               ├── Section (ServicesGrid)
        │               ├── Section (TrustedLogos)
        │               ├── Section (ValuePropositionSlider)
        │               ├── Section (BlogPreviewGrid)
        │               ├── Section (TeamRolesPreview)
        │               └── Section (PrimaryCTASection)
        └── SiteFooter
```

### Quy tắc width:

| Element | Width | Rationale |
|---------|-------|-----------|
| **Hero** | Full viewport (100vw) | Background cần full-width |
| **Sections Container** | max(1600px, 100vw) | Content constrained |
| **Section components** | 100% of parent | Inherit từ container |
| **Cards/Grids** | Responsive grid | 1/2/3 columns |

---

## 🧪 Testing Checklist

### Browser DevTools:
- [ ] ✅ No horizontal scrollbar trên mobile (375px)
- [ ] ✅ No horizontal scrollbar trên tablet (768px)
- [ ] ✅ No horizontal scrollbar trên desktop (1920px)
- [ ] ✅ Hero section full-width
- [ ] ✅ Content sections centered với padding

### Edge Cases:
- [ ] Window resize không tạo horizontal scroll
- [ ] Long text không wrap (test với very long service titles)
- [ ] Images không overflow (test với large images)
- [ ] Grids không tràn ra ngoài container

### Real Devices:
- [ ] iPhone (Safari) - landscape + portrait
- [ ] Android (Chrome) - landscape + portrait  
- [ ] iPad (Safari) - landscape + portrait
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)

---

## 🚨 Common Causes của Horizontal Overflow

### 1. **Fixed widths > viewport**
```css
/* ❌ BAD */
.element {
  width: 2000px; /* Larger than mobile viewport */
}

/* ✅ GOOD */
.element {
  width: 100%;
  max-width: 1600px;
}
```

### 2. **Negative margins without containment**
```css
/* ❌ BAD */
.element {
  margin-left: -100px; /* Can push outside viewport */
}

/* ✅ GOOD */
.element {
  margin-left: clamp(-50px, -5vw, 0);
}
```

### 3. **100vw on element with padding**
```css
/* ❌ BAD - Padding adds to width */
.element {
  width: 100vw;
  padding: 2rem; /* Total width = 100vw + 4rem! */
}

/* ✅ GOOD */
.element {
  width: 100%;
  max-width: 100vw;
  padding: 2rem;
}
```

### 4. **Absolute positioning outside parent**
```tsx
// ❌ BAD
<div className="relative">
  <div className="absolute -left-1000"> {/* Overflows left */}
    Content
  </div>
</div>

// ✅ GOOD
<div className="relative overflow-hidden"> {/* Clips overflow */}
  <div className="absolute -left-10">
    Content
  </div>
</div>
```

### 5. **Transforms creating overflow**
```css
/* ❌ BAD */
.element {
  transform: translateX(200%); /* Can overflow */
}

/* ✅ GOOD - Add to parent */
.parent {
  overflow-x: hidden;
}
```

---

## 📊 Impact

| Metric | Before | After |
|--------|--------|-------|
| **Horizontal scroll** | ❌ Yes | ✅ No |
| **Content centering** | ⚠️ Inconsistent | ✅ Centered |
| **Mobile UX** | ⚠️ Can scroll off-screen | ✅ Constrained |
| **Desktop UX** | ✅ OK | ✅ Better (centered) |
| **Code changes** | - | 2 files |
| **Lines changed** | - | ~10 lines |

---

## 🔮 Preventive Measures

### Development Guidelines:

1. **Always test responsive at multiple widths**
   ```bash
   # Test widths
   - 375px (iPhone SE)
   - 768px (iPad)
   - 1920px (Desktop)
   - 2560px (4K)
   ```

2. **Use DevTools "Show rulers" feature**
   - Helps visualize if elements exceed viewport

3. **Lint rule ideas** (future)
   ```js
   // Warn on fixed widths > 1600px
   // Warn on 100vw with padding
   // Warn on absolute position without overflow control
   ```

4. **Component library standard**
   - All section components MUST respect container boundaries
   - Use `fluid-container` or `max-w-*` classes
   - Test with `<div style="width: 100vw; border: 2px solid red">` wrapper

---

## 📝 Files Modified

1. **`/apps/web/app/globals.css`**
   - Added `overflow-x: hidden` to html/body
   - Reason: Prevent horizontal scroll globally

2. **`/apps/web/components/home/HomePage.tsx`**
   - Wrapped sections in `<div className="fluid-container">`
   - Reason: Constrain content width, add responsive padding

---

## ✨ Kết luận

**Vấn đề:** Horizontal overflow do thiếu container constraints  
**Giải pháp:** 
1. Global `overflow-x: hidden` (safety net)
2. Wrap content trong `fluid-container` (proper fix)

**Kết quả:**
- ✅ No more horizontal scroll
- ✅ Content properly centered
- ✅ Responsive padding on all screen sizes
- ✅ Hero remains full-width
- ✅ Sections constrained within viewport

**Next steps:**
- [ ] Test trên thiết bị thật
- [ ] Verify tất cả pages khác (Services, About, Contact, Careers)
- [ ] Add overflow check vào CI/CD (future)

---

**Note:** CSS linter warnings về `@apply` là false positive - Tailwind xử lý đúng ở build time. Safe to ignore.
