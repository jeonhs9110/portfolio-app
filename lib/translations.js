export const translations = {
  ko: {
    nav: {
      about: '소개',
      experience: '경력',
      skills: '기술',
      projects: '프로젝트',
      contact: '연락처',
    },
    hero: {
      greeting: '안녕하세요',
      name: '전현식입니다',
      subtitle: 'AI 시스템 설계 · 전략',
      description: '복잡한 문제를 AI 시스템으로 재설계합니다. 대한민국 국회와 주요 법무법인에서 외교·해외 업무를 주도하며 다져 온 전략적 사고와 이해관계 조율 감각을, 이제는 데이터 파이프라인부터 모델링, 의사결정 루프까지 이어지는 AI 솔루션을 설계하는 데 씁니다. "모델을 한 번 호출하는 것"이 아니라, 문제를 정의하고 조직과 사용자에게 스며드는 시스템을 그리는 일에 집중합니다.',
      cta: '프로젝트 보기',
      scroll: '스크롤하여 탐색',
    },
    about: {
      section: '01 / 소개',
      title: '문제를 AI 시스템으로\n재설계합니다',
      bio: '미국 Miami University에서 국제학(전문분야: 경제개발)을 전공하고, 대한민국 국회의원실과 법무법인 충정·광장에서 5년간 외교·해외 업무를 주도했습니다. 복잡한 이해관계 속에서 문제를 정의하고 합의를 만들어 낸 경험은, 지금 AI 솔루션을 설계하는 방식의 기반이 됩니다 — 사용자·데이터·모델·비즈니스 목표를 하나의 일관된 시스템으로 연결하는 관점.',
      stats: [
        { label: '교육', value: '마이애미 대학교 (졸업)', image: '/miami-logo.png' },
        { label: '수료', value: '[IBM x RedHat]\nAI Transformation - AX Academy', image: '/ibmxredhat-logo.png' },
      ],
    },
    experience: {
      section: '04 / 경력',
      title: '이전 경력',
      downloadKo: '한국어 이력서 다운로드',
      downloadEn: '영문 이력서 다운로드',
      jobs: [
        {
          period: '2019.07 ~ 2025.06',
          role: '외교 및 행정',
          company: '전 국회의원 비서관',
          desc: '대한민국 국회 및 주요 법무법인(충정, 광장)에서 국회의원 보좌 및 해외 행정 업무를 주도하며 뛰어난 커뮤니케이션과 문제 해결 능력을 입증했습니다.',
          achievements: [
            {
              category: '<법무법인 광장 (2022.04 ~ 2025.06)>',
              items: [
                '한국-중동 지속가능발전 포럼 설립 및 관리, 세미나/이벤트 조정',
                '한국 정부 기관 및 민간 기업 고위급 회의/해외 출장 관리, 한국-중동 교류 촉진',
                '의원실 보좌진 긴밀 관계 유지, 고객 입법 조정 촉진/규제 완화 활동'
              ]
            },
            {
              category: '<법무법인 충정 (2020.07 ~ 2022.04)>',
              items: [
                '방한 외국 고위 인사 관계 관리, 한국 기업 협력 지원',
                '회의 시 한-영 통역 역할 수행'
              ]
            },
            {
              category: '<대한민국 국회 (2019.07 ~ 2020.05)>',
              items: [
                '한국 도입 가능 해외 입법 연구',
                '피감기관 정보/데이터 요청 및 분석',
                '외국 VIP 관계 증진 및 대량 이메일 서신 관리'
              ]
            }
          ]
        },
        {
          period: '2018.04 ~ 2019.02',
          role: '인력 관리 매니저 및 Apple 서비스 어드바이저',
          company: 'Concentrix Korea',
          desc: 'Apple 고객지원센터에서 인력 관리 및 최고 수준의 기술 지원을 담당하였습니다.',
          achievements: [
            {
              category: null,
              items: [
                '글로벌 오피스 및 고객 표준에 따른 콜센터 상담원 일정 관리',
                '전반적인 성과를 높이기 위해 시스템 비효율성 식별 및 개선',
                'Tier 4 시니어 어드바이저(최고 레벨)로서 인바운드 고객 Apple 제품 관련 기술 문의 지원'
              ]
            }
          ]
        }
      ]
    },
    skills: {
      section: '03 / 기술 스택',
      title: '다루는 기술들',
      categories: [
        { name: 'AI / ML 모델링', items: ['PyTorch', 'TensorFlow', 'Graph Attention Network', 'Transformer', 'PPO 강화학습', 'XGBoost', 'LightGBM', 'HDBSCAN'] },
        { name: 'LLM · Agentic 시스템', items: ['GPT-4o / 4o-mini', '프롬프트 엔지니어링', 'Agentic Workflow (Writer · Critic · Editor)', 'GraphRAG', '임베딩 / 벡터 검색', 'LLM 비용 최적화'] },
        { name: '백엔드 · API', items: ['Python', 'FastAPI', 'Flask', 'Node.js', 'SQLAlchemy', 'WebSocket', 'REST API 설계'] },
        { name: '프론트엔드', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
        { name: '데이터 / 인프라', items: ['PostgreSQL', 'ChromaDB', 'Supabase', 'Docker Compose', 'Google Cloud (Cloud Run · Cloud SQL)', 'AWS EC2', 'Vercel'] },
        { name: '데이터 수집 · 자동화', items: ['Selenium', 'Puppeteer', 'Playwright', 'BeautifulSoup', 'YouTube Data API', 'Meta Graph API'] },
      ],
    },
    projects: {
      section: '02 / 프로젝트',
      title: '주요 프로젝트',
      viewProject: '프로젝트 보기',
      viewVideo: '기능 영상',
      viewGithub: 'GitHub 보기',
    },
    contact: {
      section: '05 / 연락처',
      title: 'The Future is a Step Closer',
      subtitle: '새로운 기회나 협업을 환영합니다. 편하게 연락주세요.',
      email: '이메일',
      cv_ko: 'Korean Resume',
      cv_en: 'English Resume',
      portfolio_ko: 'Korean Portfolio',
      portfolio_en: 'English Portfolio',
      phone: '전화번호',
    },
    footer: {
      copy: '© 2025 전현식. All rights reserved.',
    },
  },
  en: {
    nav: {
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
    },
    hero: {
      greeting: "Hello, I'm",
      name: 'Hyunsik Jeon',
      subtitle: 'Designing End-to-End AI Systems',
      description: 'I turn ambiguous problems into end-to-end AI systems. Five years leading diplomatic and overseas affairs at the Korean National Assembly and top-tier Korean law firms sharpened my instinct for stakeholders and strategic context — I now apply it to designing AI solutions from data pipeline to modeling to decision loop, rather than dropping a model into a feature and calling it done.',
      cta: 'View Projects',
      scroll: 'Scroll to discover',
    },
    about: {
      section: '01 / About',
      title: "Turning problems into\nAI systems, end to end",
      bio: 'Graduated from Miami University with a degree in International Studies (concentration: Economic Development), then led overseas affairs and legislative support for 5 years across the Korean National Assembly, HMP Law, and Lee & Ko. Defining problems and brokering alignment in complex stakeholder environments is exactly what now grounds how I design AI systems — connecting users, data, models, and business objectives into one coherent whole.',
      stats: [
        { label: 'Education', value: 'Miami University (Graduated)', image: '/miami-logo.png' },
        { label: 'Certificate', value: '[IBM x RedHat]\nAI Transformation - AX Academy', image: '/ibmxredhat-logo.png' },
      ],
    },
    experience: {
      section: '04 / Experience',
      title: 'Prior Career',
      downloadKo: 'Download Korean Resume',
      downloadEn: 'Download English Resume',
      jobs: [
        {
          period: 'Jul. 2019 ~ Jun. 2025',
          role: 'Foreign Relations and Administration',
          company: 'Former National Assembly Secretary',
          desc: 'Directed overseas affairs and legislative support across three major organizations (National Assembly, HMP Law, Lee & Ko), demonstrating elite problem-solving and communication.',
          achievements: [
            {
              category: '<Lee & Ko (Apr. 2022 ~ Jun. 2025)>',
              items: [
                'Established and managed the Korea-Middle East Sustainable Development forum, coordinating seminars and events.',
                'Administered high-level meetings and trips abroad with Korean government organizations and private entities to foster Korea-Middle East exchange.',
                'Maintained close relations with the staff of parliamentary members to advocate for legislative adjustments or mitigate regulatory risks to serve clients.'
              ]
            },
            {
              category: '<HMP Law (Jul. 2020 ~ Apr. 2022)>',
              items: [
                'Managed close relations with foreign dignitaries to the Republic of Korea to assist cooperation with Korean companies.',
                'Served as a Korean-English interpreter during meetings.'
              ]
            },
            {
              category: '<National Assembly of Korea (Jul. 2019 ~ May. 2020)>',
              items: [
                'Researched foreign legislations that could be implemented in Korea.',
                'Requested and analyzed information and data from overseen organizations for hearings and legislation.',
                'Organized foreign VIP relations and managed high-volume email correspondence on key occasions.'
              ]
            }
          ]
        },
        {
          period: 'Apr. 2018 ~ Feb. 2019',
          role: 'Workforce Manager and Apple Service Advisor',
          company: 'Concentrix Korea',
          desc: 'Managed call center operations and provided top-tier technical support for Apple products.',
          achievements: [
            {
              category: null,
              items: [
                'Managed call center attendants’ schedules according to global office and client standards.',
                'Identified and reported system inefficiencies to increase overall performance.',
                'Assisted in-call customers with Apple products as a Tier 4 Senior Advisor (Highest Level).'
              ]
            }
          ]
        }
      ]
    },
    skills: {
      section: '03 / Tech Stack',
      title: 'What I Work With',
      categories: [
        { name: 'AI / ML Modeling', items: ['PyTorch', 'TensorFlow', 'Graph Attention Network', 'Transformer', 'PPO Reinforcement Learning', 'XGBoost', 'LightGBM', 'HDBSCAN'] },
        { name: 'LLM · Agentic Systems', items: ['GPT-4o / 4o-mini', 'Prompt Engineering', 'Agentic Workflows (Writer · Critic · Editor)', 'GraphRAG', 'Embeddings / Vector Search', 'LLM Cost Optimization'] },
        { name: 'Backend · APIs', items: ['Python', 'FastAPI', 'Flask', 'Node.js', 'SQLAlchemy', 'WebSocket', 'REST API Design'] },
        { name: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
        { name: 'Data · Infrastructure', items: ['PostgreSQL', 'ChromaDB', 'Supabase', 'Docker Compose', 'Google Cloud (Cloud Run · Cloud SQL)', 'AWS EC2', 'Vercel'] },
        { name: 'Data Collection · Automation', items: ['Selenium', 'Puppeteer', 'Playwright', 'BeautifulSoup', 'YouTube Data API', 'Meta Graph API'] },
      ],
    },
    projects: {
      section: '02 / Projects',
      title: 'Featured Projects',
      viewProject: 'View Project',
      viewVideo: 'Demo Video',
      viewGithub: 'View GitHub',
    },
    contact: {
      section: '05 / Contact',
      title: "The Future is a Step Closer",
      subtitle: 'I am open to new opportunities and collaborations. Feel free to reach out.',
      email: 'Email',
      cv_ko: 'Korean Resume',
      cv_en: 'English Resume',
      portfolio_ko: 'Korean Portfolio',
      portfolio_en: 'English Portfolio',
      phone: 'Phone',
    },
    footer: {
      copy: '© 2025 Hyunsik Jeon. All rights reserved.',
    },
  },
};
