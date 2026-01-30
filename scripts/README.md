# Database Migration Scripts

## Update About Page Images

### Quick Run (Recommended)

```bash
# Make script executable
chmod +x scripts/update-about-images.sh

# Run the script
./scripts/update-about-images.sh
```

## Email Configuration Testing

### Test Email Setup

Test your SMTP configuration and send a test email.

```bash
# Make script executable
chmod +x scripts/test-email-config.sh

# Test with default recipient (from .env NOTIFICATION_EMAIL)
./scripts/test-email-config.sh

# Test with custom recipient
./scripts/test-email-config.sh your-email@example.com
```

**What it tests**:
- ✅ SMTP environment variables are set
- ✅ SMTP connection is successful
- ✅ Test email can be sent

**Prerequisites**:
- Docker container must be running
- SMTP credentials must be configured in `apps/api/.env`
- `nodemailer` package must be installed (`npm install` in api container)

---

### Manual Run

**Option 1: Using migration file**
```bash
# Copy migration to container
docker cp migrations/013_update_about_images.sql koola-postgres:/tmp/

# Run migration (use correct credentials!)
docker-compose exec postgres psql -U koola_user -d koola_db -f /tmp/013_update_about_images.sql
```

**Option 2: Interactive SQL**
```bash
# Connect to database
docker-compose exec postgres psql -U koola_user -d koola_db

# Then paste SQL commands from migrations/013_update_about_images.sql
```

**Option 3: Direct SQL execution**
```bash
docker-compose exec postgres psql -U koola_user -d koola_db << 'EOF'
UPDATE page_sections
SET payload = jsonb_set(payload, '{image,src}', '"/images/about/intro.jpg"')
WHERE section_key = 'about_intro'
  AND page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en');

UPDATE page_sections
SET payload = jsonb_set(payload, '{image,src}', '"/images/about/story.jpg"')
WHERE section_key = 'about_story'
  AND page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'en');

UPDATE page_sections
SET payload = jsonb_set(payload, '{image,src}', '"/images/about/intro.jpg"')
WHERE section_key = 'about_intro'
  AND page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi');

UPDATE page_sections
SET payload = jsonb_set(payload, '{image,src}', '"/images/about/story.jpg"')
WHERE section_key = 'about_story'
  AND page_id = (SELECT id FROM pages WHERE slug = 'about' AND locale = 'vi');

SELECT 
  p.locale,
  ps.section_key,
  ps.payload->'image'->>'src' as image_src
FROM page_sections ps
JOIN pages p ON ps.page_id = p.id
WHERE p.slug = 'about'
  AND ps.section_key IN ('about_intro', 'about_story')
ORDER BY p.locale, ps.section_key;
EOF
```

## Database Credentials

From `docker-compose.yml`:
- **Host**: localhost
- **Port**: 5432
- **Database**: `koola_db`
- **User**: `koola_user`
- **Password**: `koola_password`
- **Container**: `koola-postgres`

## Common Issues

### Error: "role 'koola' does not exist"
❌ Wrong: `-U koola`
✅ Correct: `-U koola_user`

### Error: "database 'koola' does not exist"
❌ Wrong: `-d koola`
✅ Correct: `-d koola_db`

### Error: "command not found: #"
Remove the `#` comment lines when copying commands. Use the script instead.

## Verify Changes

After running migration:
```bash
# Check database
docker-compose exec postgres psql -U koola_user -d koola_db -c "
SELECT 
  p.locale,
  ps.section_key,
  ps.payload->'image'->>'src' as image_src
FROM page_sections ps
JOIN pages p ON ps.page_id = p.id
WHERE p.slug = 'about'
  AND ps.section_key IN ('about_intro', 'about_story')
ORDER BY p.locale, ps.section_key;
"

# Visit the page
open http://localhost:3000/en/about
open http://localhost:3000/vi/about
```

Expected output:
```
 locale | section_key  |        image_src        
--------+--------------+-------------------------
 en     | about_intro  | /images/about/intro.jpg
 en     | about_story  | /images/about/story.jpg
 vi     | about_intro  | /images/about/intro.jpg
 vi     | about_story  | /images/about/story.jpg
```
