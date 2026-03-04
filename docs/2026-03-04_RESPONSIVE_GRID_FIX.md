# Responsive Grid Layout Fix

**Date:** March 4, 2026  
**Issue:** Các thẻ card hiển thị 3 cột cố định trên mọi màn hình, gây khó đọc trên mobile  
**Solution:** Chuyển sang responsive grid: Mobile 1 cột, Tablet 2 cột, Desktop 3 cột

---

## 🔍 Vấn đề phát hiện

Người dùng phản hồi: *"các thẻ card không cần thiết nằm đúng vị trí như bản website, mỗi thẻ một nằm trên một hàng thôi thì thông tin nó hiển thị mới rõ chứ"*

### Nguyên nhân:
- Tất cả grid components đều dùng `grid-cols-3` cố định
- Trên mobile (width < 640px), 3 cột quá chật → text bị cắt, khó nhấn
- Không tuân theo nguyên tắc mobile-first design

---

## ✅ Components đã sửa

### 1. **CapabilityHighlights.tsx** (Team roles section)
```tsx
// BEFORE
<div className="grid grid-cols-3 gap-8">

// AFTER
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
```

**Section:** "We have multidisciplinary teams to meet any challenge"  
**Cards:** Front-end, Back-end, Data Analysts

---

### 2. **ServicesGrid.tsx** (Our Services section)
```tsx
// BEFORE
<div className="grid grid-cols-3 gap-7">

// AFTER
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
```

**Section:** "Our Services"  
**Cards:** IoT System Integration, Industrial Automation, IT Infrastructure, Smart Building, Cloud Infrastructure, Cybersecurity

---

### 3. **ValuePropositionSlider.tsx** (Choose Us section)
```tsx
// BEFORE
<div className="grid grid-cols-3 gap-7 ...">

// AFTER
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 ...">
```

**Thêm logic responsive slider:**
```tsx
const [itemsPerPage, setItemsPerPage] = useState(3);

useEffect(() => {
  const updateItemsPerPage = () => {
    if (window.innerWidth < 640) {
      setItemsPerPage(1); // mobile
    } else if (window.innerWidth < 1024) {
      setItemsPerPage(2); // tablet
    } else {
      setItemsPerPage(3); // desktop
    }
  };
  
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
  return () => window.removeEventListener('resize', updateItemsPerPage);
}, []);
```

**Section:** "Choose Us: Your Path to Innovation and Success"  
**Cards:** Expertise, Track Record, Collaborative Approach, Tailored Solutions (slider)

---

### 4. **BlogPreviewGrid.tsx** (Our latest insights section)
```tsx
// BEFORE
<div className="grid grid-cols-3 gap-7 ...">

// AFTER  
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 ...">
```

**Cũng thêm responsive slider logic tương tự ValuePropositionSlider**

**Section:** "Our latest insights"  
**Cards:** Blog preview cards (slider)

---

### 5. **CareersNewsPreview.tsx** (Careers news section)
```tsx
// BEFORE
<div className="grid grid-cols-3 gap-6">

// AFTER
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
```

**Section:** Careers page news preview  
**Cards:** Latest 3 blog posts

---

### 6. **CompanyTimeline.tsx** (About page timeline)
```tsx
// BEFORE
<div className="mt-6 grid grid-cols-3 gap-6">

// AFTER
<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
```

**Section:** About page timeline  
**Cards:** Company milestones by year

---

## 📱 Breakpoints sử dụng

| Screen | Width | Columns | Gap |
|--------|-------|---------|-----|
| **Mobile** | < 640px | 1 cột | 1.5rem (gap-6) |
| **Tablet** | 640px - 1023px | 2 cột | 1.5rem (gap-6) |
| **Desktop** | ≥ 1024px | 3 cột | 1.75rem - 2rem (gap-7/gap-8) |

**Tailwind classes:**
- `grid-cols-1` - Mobile (default)
- `sm:grid-cols-2` - Tablet (≥640px)
- `lg:grid-cols-3` - Desktop (≥1024px)

---

## 🎯 Kết quả

### Trước khi sửa:
- ❌ Mobile: 3 cột chật chội, text bị cắt
- ❌ Khó nhấn vào card (touch target quá nhỏ)
- ❌ Không tận dụng không gian màn hình

### Sau khi sửa:
- ✅ Mobile: 1 cột rộng rãi, dễ đọc
- ✅ Tablet: 2 cột cân đối
- ✅ Desktop: 3 cột như thiết kế ban đầu
- ✅ Touch-friendly (mỗi card chiếm full width trên mobile)
- ✅ Responsive slider controls tự động điều chỉnh

---

## 🧪 Testing

### Browser DevTools:
```bash
# Test breakpoints
- 375px (iPhone SE) - 1 cột ✅
- 640px (Tablet) - 2 cột ✅
- 768px (iPad) - 2 cột ✅
- 1024px (Laptop) - 3 cột ✅
- 1440px (Desktop) - 3 cột ✅
```

### Real devices:
- [ ] iPhone (Safari) - Cần test
- [ ] Android (Chrome) - Cần test
- [ ] iPad (Safari) - Cần test

---

## 📝 Best Practices Applied

1. **Mobile-First Design** ✅
   - Default `grid-cols-1` cho mobile
   - Progressive enhancement với `sm:` và `lg:` modifiers

2. **Touch Targets** ✅
   - Cards chiếm full width trên mobile
   - Dễ nhấn, không bị miss-tap

3. **Fluid Spacing** ✅
   - Gap nhỏ hơn trên mobile (gap-6 vs gap-7/gap-8)
   - Tiết kiệm không gian, tránh overflow

4. **Performance** ✅
   - Slider components chỉ render số items cần thiết
   - Resize listener có cleanup function

5. **Accessibility** ✅
   - Slider controls có `disabled` state rõ ràng
   - Card hover states vẫn hoạt động trên desktop

---

## 🔮 Next Steps

1. **Test trên thiết bị thật**
   - iPhone (iOS Safari quirks)
   - Android (Chrome, Samsung Browser)
   - iPad (touch interactions)

2. **Performance audit**
   - Lighthouse mobile score
   - Bundle size impact (minimal, chỉ thêm event listeners)

3. **Edge cases**
   - Window resize performance
   - SSR hydration (slider states)
   - Orientation change (landscape → portrait)

4. **Documentation**
   - Update component docs với responsive examples
   - Add Storybook stories cho các breakpoints

---

## 📊 Impact

| Metric | Before | After |
|--------|--------|-------|
| **Mobile UX** | ⚠️ Poor | ✅ Good |
| **Touch Target Size** | ❌ ~33% width | ✅ 100% width |
| **Readability** | ❌ Text cắt | ✅ Full text |
| **Desktop** | ✅ Good | ✅ Good (unchanged) |
| **Lines Changed** | - | ~150 lines |
| **Components Updated** | - | 6 components |

---

**Tóm tắt:** Đã sửa tất cả grid layouts từ cố định 3 cột sang responsive (1/2/3 cột tùy màn hình). Mobile UX cải thiện đáng kể, desktop không thay đổi. Cần test trên thiết bị thật để validate.
