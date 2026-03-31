-- Update careers_pride slides with real Koola team members
-- Replaces placeholder names with actual team: Nguyễn Phi Vũ (Founder),
-- Phan Tấn Quốc (Lead Developer), Vũ Minh Phúc (NodeJS Developer)

DO $$
DECLARE
  v_page_id_en BIGINT;
  v_page_id_vi BIGINT;
BEGIN
  SELECT id INTO v_page_id_en FROM pages WHERE slug = 'careers' AND locale = 'en';
  SELECT id INTO v_page_id_vi FROM pages WHERE slug = 'careers' AND locale = 'vi';

  -- Update English pride slides
  IF v_page_id_en IS NOT NULL THEN
    UPDATE page_sections
    SET payload = jsonb_build_object(
      'slides', jsonb_build_array(
        jsonb_build_object(
          'quote', 'Koola was built on the belief that technology should be accessible, impactful, and human-centered. I am proud to lead a team that turns that vision into reality every day.',
          'authorName', 'Nguyen Phi Vu',
          'authorRole', 'Founder'
        ),
        jsonb_build_object(
          'quote', 'What drives me at Koola is the opportunity to solve real problems with clean, scalable solutions. The culture here pushes us to grow constantly as engineers and as a team.',
          'authorName', 'Phan Tan Quoc',
          'authorRole', 'Lead Developer'
        ),
        jsonb_build_object(
          'quote', 'Joining Koola has accelerated my growth significantly. Every project is a chance to apply best practices and collaborate with a team that genuinely cares about quality.',
          'authorName', 'Vu Minh Phuc',
          'authorRole', 'NodeJS Developer'
        )
      )
    )
    WHERE page_id = v_page_id_en AND section_key = 'careers_pride';
  END IF;

  -- Update Vietnamese pride slides
  IF v_page_id_vi IS NOT NULL THEN
    UPDATE page_sections
    SET payload = jsonb_build_object(
      'slides', jsonb_build_array(
        jsonb_build_object(
          'quote', 'Koola được xây dựng trên niềm tin rằng công nghệ phải dễ tiếp cận, tạo ra tác động thực sự và lấy con người làm trung tâm. Tôi tự hào được dẫn dắt một đội ngũ biến tầm nhìn đó thành hiện thực mỗi ngày.',
          'authorName', 'Nguyễn Phi Vũ',
          'authorRole', 'Founder'
        ),
        jsonb_build_object(
          'quote', 'Điều thúc đẩy tôi tại Koola là cơ hội giải quyết các bài toán thực tế bằng những giải pháp tinh gọn, có khả năng mở rộng. Văn hóa ở đây giúp chúng tôi không ngừng phát triển với tư cách kỹ sư lẫn đội ngũ.',
          'authorName', 'Phan Tấn Quốc',
          'authorRole', 'Lead Developer'
        ),
        jsonb_build_object(
          'quote', 'Gia nhập Koola đã thúc đẩy sự phát triển của tôi rất nhiều. Mỗi dự án là cơ hội để áp dụng các thực tiễn tốt nhất và cộng tác với một đội ngũ thực sự quan tâm đến chất lượng.',
          'authorName', 'Vũ Minh Phúc',
          'authorRole', 'NodeJS Developer'
        )
      )
    )
    WHERE page_id = v_page_id_vi AND section_key = 'careers_pride';
  END IF;
END $$;
