# Pre-Deployment Checklist

## ✅ Image Organization

- [ ] Run `bash scripts/setup-images.sh` to organize images
- [ ] Verify images are in `public/images/casual/`
- [ ] Verify images are in `public/images/customized/`
- [ ] Verify images are in `public/images/formal/`
- [ ] Verify images are in `public/images/running/`
- [ ] Verify images are in `public/images/sports/`
- [ ] Verify logos are in `public/images/logos/`

## ✅ Code Verification

- [x] No linting errors
- [x] All TypeScript types correct
- [x] All imports valid
- [x] Product data updated
- [x] Categories match collection.html
- [x] Image paths updated

## ✅ Testing

- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Test home page: http://localhost:3000
- [ ] Test collections page: http://localhost:3000/collections
- [ ] Test casual category: http://localhost:3000/collections/casual
- [ ] Test customized category: http://localhost:3000/collections/customized
- [ ] Test formal category: http://localhost:3000/collections/formal
- [ ] Test running category: http://localhost:3000/collections/running
- [ ] Test sports category: http://localhost:3000/collections/sports
- [ ] Verify all images load correctly
- [ ] Test WhatsApp links
- [ ] Test filters on category pages
- [ ] Test mobile responsiveness

## ✅ Build Verification

- [ ] Run build: `npm run build`
- [ ] Verify build succeeds without errors
- [ ] Check for TypeScript errors
- [ ] Verify all pages generate correctly

## ✅ Final Checks

- [ ] All product images display
- [ ] Category images display
- [ ] Navigation works correctly
- [ ] Footer links work
- [ ] Contact form works
- [ ] WhatsApp integration works
- [ ] SEO metadata correct
- [ ] Mobile menu works

## 📝 Notes

- Images must be organized before testing
- Run the setup script first
- Verify image paths match actual files
- Test on multiple browsers
- Check mobile devices

---

**Status**: Ready for image organization and testing
**Action Required**: Run `bash scripts/setup-images.sh` first

