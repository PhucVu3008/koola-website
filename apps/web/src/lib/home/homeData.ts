/**
 * Home page display data.
 *
 * IMPORTANT: This content is derived from the provided reference image.
 * Do not add/remove items without updating the reference.
 */
export const HOME = {
  hero: {
    label: 'TECH SERVICES',
    headline: ['KOOLA', 'Innovate,', 'Create, Elevate'],
    subhead: 'Unlocking Possibilities, One Code at a Time',
    primaryCta: { label: 'Sign projects', href: '/contact' },
    secondaryCta: { label: 'Get Started', href: '/services' },
    image: {
      src: '/home/hero.jpg',
      alt: 'Team working at a laptop',
    },
    backgroundImage: '/home/hero-bg.avif',
    overlayImage: '/home/hero-bg.png', // Static PNG overlay on top
  },
  capabilities: {
    heading: 'We have multidisciplinary teams to meet any challenge.',
    items: [
      {
        title: 'Front-end',
        description:
          'Our front-end developers can understand the complex behavior between objects and act accordingly.',
        icon: 'chat',
      },
      {
        title: 'Back-end',
        description:
          'Our back-end developers are the architects of efficiency and security. They are your trusted enterprise solution.',
        icon: 'shield',
      },
      {
        title: 'Data Analysts',
        description:
          'Our data analysts are hands of a strong decision-making through strategic insights.',
        icon: 'chart',
      },
    ],
  },
  services: {
    title: 'Empowering Your Digital Vision: Our Comprehensive Tech Services.',
    items: [
      {
        title: 'Custom SoftwareDevelopment',
        description:
          'Our softwares can solve your business needs, including front-end, back-end, and mobile apps, along with any other requirement.',
        icon: 'code',
      },
      {
        title: 'QA and Testing',
        description:
          'We can provide QA services in any area; from manual testing to automation, with high quality and efficiency.',
        icon: 'spark',
      },
      {
        title: 'AI and Data Science',
        description:
          'As a leader, we can help you solve the most challenging issues and deliver best outcomes with data science and analytics.',
        icon: 'brain',
      },
      {
        title: 'UX/UI Design',
        description:
          'Our team can help make your product more attractive and usable, based on user-centric and modern design.',
        icon: 'pen',
      },
      {
        title: 'Mobile App Development',
        description:
          'We develop powerful mobile apps with scalable architecture and top-of-the-line experiences.',
        icon: 'phone',
      },
      {
        title: 'Platform and Infrastructure',
        description:
          'We can optimize your platform and infrastructure to ensure your business runs securely and efficiently.',
        icon: 'cloud',
      },
    ],
  },
  trusted: {
    title: 'Trusted by Leading Organizations',
    subtitle: 'Our 4,000+ team helps your vision come to life.',
    ctaLabel: 'Get a free quote',
    logos: ['jnj', 'microsoft', 'google', 'slack', 'lg'],
  },
  testimonials: {
    title: "We've stopped counting.",
    subtitle: 'Over 500 brands count on us.',
    helper:
      'Our 4,000+ team helps organizations almost everywhere programming languages.',
    items: [
      {
        stars: 5,
        quote:
          'Exceptional Solutions, Exceeded Expectation! Working with KOOLA has been incredible. Their team listened to our needs and delivered an outstanding product on time.',
        name: 'Mary Johnson',
      },
      {
        stars: 5,
        quote:
          'Transformed Our Business with Innovative Tech! The outcomes were beyond what we imagined. The process was smooth and transparent from start to finish.',
        name: 'Mark Williams',
      },
      {
        stars: 5,
        quote:
          'Sculpted User Experiences Beyond Imagination! The UI/UX improvements increased our engagement significantly. Truly a talented and professional team.',
        name: 'Emily Clark',
      },
    ],
  },
  valueProps: {
    title: 'Choose Us: Your Path to Innovation and Success',
    items: [
      {
        title: 'Expertise Across the Tech Spectrum',
        description:
          'Our team consists of seasoned professionals across various domains and technologies.',
        icon: 'badge',
      },
      {
        title: 'Proven Track Record of Success',
        description:
          'We deliver projects on-time and on-budget with measurable outcomes.',
        icon: 'award',
      },
      {
        title: 'Collaborative Approach; Transparent Communication',
        description:
          'We work closely with stakeholders and provide clear updates at every stage.',
        icon: 'users',
      },
      {
        title: 'Tailored Solutions for Your Needs',
        description:
          'We adapt our process to your business objectives and constraints.',
        icon: 'settings',
      },
    ],
  },
  blog: {
    title: 'Our latest insights',
    items: [
      {
        category: 'Design',
        title:
          'The Power of UI/UX: Creating Engaging Digital Experiences',
        author: 'Ben Taylor',
        date: '15 May 2025',
        image: '/home/blog-1.png',
      },
      {
        category: 'Development',
        title: 'Agile Development: The Key to Flexibility',
        author: 'Jane Lewis',
        date: '12 Dec 2025',
        image: '/home/blog-2.png',
      },
      {
        category: 'Management',
        title: 'Media App Development: Watch in 2026',
        author: 'Sarah Mitchell',
        date: '10 Jan 2026',
        image: '/home/blog-3.png',
      },
    ],
  },
  team: {
    title: "Let's Form Your Crew.",
    ctaLabel: 'Schedule a call',
    roles: [
      { role: 'Software Developers', image: '/home/team-1.jpg' },
      { role: 'QA Engineers', image: '/home/team-2.jpg' },
      { role: 'UX Designers', image: '/home/team-3.jpg' },
      { role: 'Data Scientists', image: '/home/team-4.jpg' },
      { role: 'Project Managers', image: '/home/team-5.jpg' },
    ],
  },
  primaryCta: {
    title: "Ready to Transform Your Vision into Reality? Let's Get Started!",
    ctaLabel: 'Get Quote',
    image: '/home/cta.jpg',
  },
} as const;

/**
 * Locale-aware home page display data.
 *
 * Notes:
 * - We keep the same structure/items to preserve the reference layout.
 * - Vietnamese copy is a faithful translation of the current English content.
 */
export const HOME_I18N = {
  en: HOME,
  vi: {
    hero: {
      label: 'DỊCH VỤ CÔNG NGHỆ',
      headline: ['KOOLA', 'Đổi mới,', 'Tạo dựng, Nâng tầm'],
      subhead: 'Mở khóa tiềm năng, từng dòng code một',
      primaryCta: { label: 'Ký dự án', href: '/contact' },
      secondaryCta: { label: 'Bắt đầu', href: '/services' },
      image: {
        src: '/home/hero.jpg',
        alt: 'Nhóm làm việc trên laptop',
      },
      backgroundImage: '/home/hero-bg.avif',
    },
    capabilities: {
      heading: 'Chúng tôi có đội ngũ đa ngành để đáp ứng mọi thách thức.',
      items: [
        {
          title: 'Front-end',
          description:
            'Đội ngũ front-end của chúng tôi hiểu hành vi phức tạp giữa các đối tượng và xây dựng trải nghiệm mượt mà, chính xác.',
          icon: 'chat',
        },
        {
          title: 'Back-end',
          description:
            'Đội ngũ back-end là kiến trúc sư của hiệu năng và bảo mật — giải pháp đáng tin cậy cho doanh nghiệp.',
          icon: 'shield',
        },
        {
          title: 'Phân tích dữ liệu',
          description:
            'Chuyên gia phân tích dữ liệu biến dữ liệu thành insight chiến lược, giúp ra quyết định vững chắc hơn.',
          icon: 'chart',
        },
      ],
    },
    services: {
      title: 'Hiện thực hóa tầm nhìn số: Bộ dịch vụ công nghệ toàn diện.',
      items: [
        {
          title: 'Phát triển phần mềm theo yêu cầu',
          description:
            'Xây dựng phần mềm đáp ứng đúng nhu cầu doanh nghiệp: front-end, back-end, ứng dụng mobile và các yêu cầu tùy biến khác.',
          icon: 'code',
        },
        {
          title: 'QA & Kiểm thử',
          description:
            'Cung cấp dịch vụ QA đa dạng: kiểm thử thủ công đến tự động hóa, đảm bảo chất lượng cao và hiệu quả.',
          icon: 'spark',
        },
        {
          title: 'AI & Khoa học dữ liệu',
          description:
            'Hỗ trợ giải quyết các bài toán khó và tạo kết quả tốt nhất với data science, phân tích và tối ưu hóa bằng AI.',
          icon: 'brain',
        },
        {
          title: 'Thiết kế UX/UI',
          description:
            'Giúp sản phẩm hấp dẫn và dễ dùng hơn dựa trên thiết kế hiện đại, lấy người dùng làm trung tâm.',
          icon: 'pen',
        },
        {
          title: 'Phát triển ứng dụng di động',
          description:
            'Phát triển app mobile mạnh mẽ với kiến trúc mở rộng và trải nghiệm cao cấp.',
          icon: 'phone',
        },
        {
          title: 'Nền tảng & Hạ tầng',
          description:
            'Tối ưu nền tảng và hạ tầng để hệ thống vận hành an toàn, ổn định và hiệu quả.',
          icon: 'cloud',
        },
      ],
    },
    trusted: {
      title: 'Được tin dùng bởi các tổ chức hàng đầu',
      subtitle: 'Đội ngũ 4.000+ của chúng tôi giúp biến tầm nhìn thành hiện thực.',
      ctaLabel: 'Nhận báo giá miễn phí',
      logos: ['jnj', 'microsoft', 'google', 'slack', 'lg'],
    },
    testimonials: {
      title: 'Chúng tôi đã ngừng đếm.',
      subtitle: 'Hơn 500 thương hiệu tin tưởng chúng tôi.',
      helper:
        'Đội ngũ 4.000+ hỗ trợ các tổ chức gần như ở mọi nơi, trên nhiều ngôn ngữ lập trình.',
      items: [
        {
          stars: 5,
          quote:
            'Giải pháp xuất sắc, vượt kỳ vọng! Làm việc với KOOLA thật tuyệt vời. Họ lắng nghe nhu cầu và bàn giao sản phẩm đúng hạn.',
          name: 'Mary Johnson',
        },
        {
          stars: 5,
          quote:
            'Chuyển đổi doanh nghiệp bằng công nghệ sáng tạo! Kết quả vượt xa tưởng tượng. Quy trình suôn sẻ và minh bạch từ đầu đến cuối.',
          name: 'Mark Williams',
        },
        {
          stars: 5,
          quote:
            'Trải nghiệm người dùng được “tạc” ngoài sức tưởng tượng! Cải tiến UI/UX giúp tăng tương tác rõ rệt. Một đội ngũ chuyên nghiệp.',
          name: 'Emily Clark',
        },
      ],
    },
    valueProps: {
      title: 'Chọn chúng tôi: Con đường đến đổi mới và thành công',
      items: [
        {
          title: 'Chuyên môn đa lĩnh vực công nghệ',
          description:
            'Đội ngũ gồm các chuyên gia giàu kinh nghiệm trên nhiều mảng và công nghệ khác nhau.',
          icon: 'badge',
        },
        {
          title: 'Thành tích triển khai đã được chứng minh',
          description:
            'Bàn giao đúng tiến độ, đúng ngân sách với kết quả có thể đo lường.',
          icon: 'award',
        },
        {
          title: 'Hợp tác chặt chẽ; giao tiếp minh bạch',
          description:
            'Làm việc sát với stakeholder và cập nhật rõ ràng ở mọi giai đoạn.',
          icon: 'users',
        },
        {
          title: 'Giải pháp “đo ni đóng giày” theo nhu cầu',
          description:
            'Điều chỉnh quy trình theo mục tiêu và ràng buộc của doanh nghiệp.',
          icon: 'settings',
        },
      ],
    },
    blog: {
      title: 'Góc nhìn mới nhất',
      items: [
        {
          category: 'Thiết kế',
          title: 'Sức mạnh của UI/UX: Tạo trải nghiệm số hấp dẫn',
          author: 'Ben Taylor',
          date: '15 May 2023',
          image: '/home/blog-1.jpg',
        },
        {
          category: 'Phát triển',
          title: 'Phát triển Agile: Chìa khóa của sự linh hoạt',
          author: 'Jane Lewis',
          date: '12 May 2023',
          image: '/home/blog-2.jpg',
        },
        {
          category: 'Quản lý',
          title: 'Phát triển ứng dụng Media: Xu hướng 2023',
          author: 'Sarah Mitchell',
          date: '10 May 2023',
          image: '/home/blog-3.jpg',
        },
      ],
    },
    team: {
      title: 'Hãy xây dựng đội ngũ của bạn.',
      ctaLabel: 'Đặt lịch trao đổi',
      roles: [
        { role: 'Lập trình viên', image: '/home/team-1.jpg' },
        { role: 'Kỹ sư QA', image: '/home/team-2.jpg' },
        { role: 'Thiết kế UX', image: '/home/team-3.jpg' },
        { role: 'Khoa học dữ liệu', image: '/home/team-4.jpg' },
        { role: 'Quản lý dự án', image: '/home/team-5.jpg' },
      ],
    },
    primaryCta: {
      title: 'Sẵn sàng biến tầm nhìn thành hiện thực? Bắt đầu ngay!',
      ctaLabel: 'Nhận báo giá',
      image: '/home/cta.jpg',
    },
  },
} as const;

/**
 * Get home content for a locale.
 */
export function getHomeData(locale: 'en' | 'vi') {
  return HOME_I18N[locale] ?? HOME_I18N.en;
}
