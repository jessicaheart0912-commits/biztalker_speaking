const MODULES = [
  {
    id: 'networking',
    title: '자기소개하며 네트워킹하기',
    titleEn: 'Networking Through Self-Introduction',
    emoji: '🤝',
    color: '#6ea8fe',
    summary: '행사/미팅 현장에서 첫인사부터 연락처 교환, 자기 역할 소개, 성장 계획 설명까지 연습합니다.',
    tags: ['Networking','LinkedIn','Self-Intro','Contact Exchange'],
    lessons: [
      {
        id: 'n1', title: '첫 인사와 대화 열기', titleEn: 'Opening a Conversation',
        expressions: [
          ['Is this your first time at the summit?','이번 행사 처음 오신 건가요?'],
          ['What brings you here today?','오늘 여기 오신 이유가 무엇인가요?'],
          ['Nice to meet you! I\'m [Name] from [Company].','반갑습니다! 저는 [회사]의 [이름]입니다.'],
          ['Pretty exciting so far.','지금까지 꽤 흥미롭네요.'],
          ['We should definitely catch up later.','나중에 꼭 다시 얘기 나눠요.']
        ],
        scenario: {
          title: '컨퍼런스 첫 만남', titleEn: 'First Meeting at a Conference',
          brief: '행사장에서 처음 만난 사람과 자연스럽게 대화를 시작하는 상황입니다.',
          turns: [
            {role:'A', line:'Hey there, I\'m Olivia. I work at Summit Tech.'},
            {role:'B', line:'Nice to meet you, Olivia. I\'m Jake, from Nexis Group.'},
            {role:'A', line:'Likewise! Is this your first time at the summit?'},
            {role:'B', line:'Yeah, it is. Pretty exciting so far. What brings you here today?'},
            {role:'A', line:'I\'m looking to expand my network and explore new partnerships.'},
            {role:'B', line:'Same here. We should definitely catch up later!'}
          ]
        },
        quiz: [
          { q:'"오늘 여기 오신 이유가 무엇인가요?"를 영어로 쓰면?', a:'What brings you here today?' },
          { q:'"이번 행사 처음 오신 건가요?"는?', a:'Is this your first time at the summit?' },
          { q:'"지금까지 꽤 흥미롭네요"를 영어로?', a:'Pretty exciting so far.' }
        ],
        speaking: 'Is this your first time at the summit?'
      },
      {
        id: 'n2', title: '연락처 교환', titleEn: 'Exchanging Contact Info',
        expressions: [
          ['We should connect on LinkedIn.','링크드인에서 연결해요.'],
          ['Mind if I grab your contact info?','연락처 받아도 될까요?'],
          ['I\'ll shoot you a message.','메시지 하나 보낼게요.'],
          ['Let\'s stay in touch.','계속 연락해요.'],
          ['Expand the network','인맥을 넓히다']
        ],
        scenario: {
          title: '링크드인 연결 제안', titleEn: 'Proposing LinkedIn Connection',
          brief: '짧은 네트워킹 대화 이후 연락처를 교환하고 다음 소통을 약속합니다.',
          turns: [
            {role:'A', line:'I\'ve really enjoyed talking with you today.'},
            {role:'B', line:'Me too. We should connect on LinkedIn.'},
            {role:'A', line:'Absolutely. Mind if I grab your contact info?'},
            {role:'B', line:'Of course! Here\'s my card. I\'ll shoot you a message this evening.'},
            {role:'A', line:'Perfect. Let\'s stay in touch.'}
          ]
        },
        quiz: [
          { q:'"연락처 받아도 될까요?"는?', a:'Mind if I grab your contact info?' },
          { q:'"메시지 하나 보낼게요"의 자연스러운 표현은?', a:'I\'ll shoot you a message.' },
          { q:'"인맥을 넓히다"를 영어로?', a:'Expand the network' }
        ],
        speaking: 'We should connect on LinkedIn.'
      },
      {
        id: 'n3', title: '내 역할 소개', titleEn: 'Introducing Your Role',
        expressions: [
          ['I head up marketing.','저는 마케팅을 총괄합니다.'],
          ['I run campaigns and manage brand strategy.','캠페인을 운영하고 브랜드 전략을 관리합니다.'],
          ['I work closely with the dev team.','개발팀과 긴밀히 협업합니다.'],
          ['I help businesses manage cash flow.','기업의 자금 흐름 관리를 돕습니다.'],
          ['Looking to scale','확장을 목표로 하고 있습니다']
        ],
        scenario: {
          title: '직무 소개', titleEn: 'Explaining Your Job',
          brief: '상대방이 무슨 일을 하는지 물었을 때 자신 있게 소개합니다.',
          turns: [
            {role:'A', line:'So what do you do at your company?'},
            {role:'B', line:'I head up marketing. Basically, I run campaigns and manage brand strategy.'},
            {role:'A', line:'That sounds like a broad role.'},
            {role:'B', line:'It is. I also work closely with the dev team on product launches.'},
            {role:'A', line:'Impressive! Is your company looking to scale?'},
            {role:'B', line:'Yes, we\'re looking to scale into the APAC region this year.'}
          ]
        },
        quiz: [
          { q:'"마케팅을 총괄하다"는?', a:'I head up marketing.' },
          { q:'"개발팀과 긴밀히 협업하다"는?', a:'I work closely with the dev team.' },
          { q:'"확장을 목표로 하고 있다"는?', a:'Looking to scale' }
        ],
        speaking: 'I head up marketing and run brand campaigns.'
      },
      {
        id: 'n4', title: '성장 계획 이야기하기', titleEn: 'Talking About Growth Plans',
        expressions: [
          ['We\'re looking to scale.','저희는 확장을 계획하고 있어요.'],
          ['We\'re expanding into new markets.','새 시장으로 확장 중입니다.'],
          ['We\'re focused on long-term partnerships.','장기 파트너십에 집중하고 있습니다.'],
          ['We\'re based in Seoul, but we operate globally.','서울에 본사가 있지만 글로벌로 운영합니다.']
        ],
        scenario: {
          title: '회사 성장 방향 설명', titleEn: 'Sharing Company Growth Plans',
          brief: '비즈니스 파트너에게 자사의 성장 계획을 간결하게 설명합니다.',
          turns: [
            {role:'A', line:'What\'s your company focused on this year?'},
            {role:'B', line:'We\'re looking to scale. We\'re expanding into new markets in Southeast Asia.'},
            {role:'A', line:'That sounds exciting. Are you based locally?'},
            {role:'B', line:'We\'re based in Seoul, but we operate globally.'},
            {role:'A', line:'We\'d love to explore long-term partnerships.'},
            {role:'B', line:'Same here. We\'re very focused on long-term partnerships.'}
          ]
        },
        quiz: [
          { q:'"확장을 계획하고 있다"는?', a:'We\'re looking to scale.' },
          { q:'"새 시장으로 확장 중이다"는?', a:'We\'re expanding into new markets.' },
          { q:'"장기 파트너십에 집중하고 있다"는?', a:'We\'re focused on long-term partnerships.' }
        ],
        speaking: 'We\'re looking to scale and expand into new markets this year.'
      }
    ]
  },
  {
    id: 'meeting',
    title: '멋지게 회의 주도하기',
    titleEn: 'Leading Meetings Effectively',
    emoji: '📋',
    color: '#a78bfa',
    summary: '회의 시작, 의견 조율, 분석, 아이디어 제안, 마무리, 후속 커뮤니케이션까지 다룹니다.',
    tags: ['Meeting','Agenda','Idioms','Follow-up'],
    lessons: [
      {
        id: 'm1', title: '회의 시작과 목적 제시', titleEn: 'Opening a Meeting',
        expressions: [
          ['Let\'s get started, shall we?','자, 시작해볼까요?'],
          ['The purpose of today\'s meeting is to...','오늘 회의의 목적은 ...입니다.'],
          ['kick things off','회의를 시작하다'],
          ['set the tone','분위기를 조성하다'],
          ['Let\'s quickly go over the agenda.','안건을 간단히 살펴보겠습니다.']
        ],
        scenario: {
          title: 'Q3 전략 회의 시작', titleEn: 'Opening a Q3 Strategy Meeting',
          brief: '매니저가 회의를 시작하고, 목적과 안건을 명확하게 제시합니다.',
          turns: [
            {role:'Manager', line:'Good morning, everyone. Let\'s get started, shall we?'},
            {role:'Manager', line:'The purpose of today\'s meeting is to align on our Q3 strategy.'},
            {role:'Team', line:'Do we all have the agenda?'},
            {role:'Manager', line:'Yes. Let\'s kick things off by reviewing last quarter\'s results.'},
            {role:'Manager', line:'I\'d like to set the tone: we\'re here to make decisions, not just discuss.'},
            {role:'Team', line:'Understood. Let\'s quickly go over the agenda.'}
          ]
        },
        quiz: [
          { q:'"오늘 회의의 목적은 ...입니다"의 영어 패턴은?', a:'The purpose of today\'s meeting is to...' },
          { q:'"회의를 시작하다"에 해당하는 숙어는?', a:'kick things off' },
          { q:'"분위기를 조성하다"에 해당하는 숙어는?', a:'set the tone' }
        ],
        speaking: 'The purpose of today\'s meeting is to review our Q3 priorities.'
      },
      {
        id: 'm2', title: '의견 권유와 보류 표현', titleEn: 'Opinions and Hesitation',
        expressions: [
          ['Would anyone like to speak up?','의견 있으신 분 말씀해 주세요.'],
          ['speak up','솔직하게 의견을 내다'],
          ['sit on the fence','결정을 보류하다 / 중립을 지키다'],
          ['I\'m not ready to commit yet.','아직 확정하기는 어렵습니다.'],
          ['That\'s a valid point.','그건 맞는 말이에요.']
        ],
        scenario: {
          title: '의견 조율 상황', titleEn: 'Managing Different Opinions',
          brief: '팀원들의 다양한 의견을 이끌어내고 결정을 보류하는 상황을 연습합니다.',
          turns: [
            {role:'Manager', line:'Before we decide, I\'d like everyone to speak up.'},
            {role:'A', line:'I think we should increase the budget by 20%.'},
            {role:'B', line:'That\'s a valid point, but I\'m still sitting on the fence.'},
            {role:'B', line:'I\'m not ready to commit yet without more data.'},
            {role:'Manager', line:'That\'s fair. Let\'s gather more input and revisit next week.'}
          ]
        },
        quiz: [
          { q:'"의견을 솔직하게 내다"에 해당하는 표현은?', a:'speak up' },
          { q:'"결정을 보류하다"에 해당하는 표현은?', a:'sit on the fence' },
          { q:'"그건 맞는 말이에요"를 영어로?', a:'That\'s a valid point.' }
        ],
        speaking: 'I\'m still sitting on the fence about this proposal.'
      },
      {
        id: 'm3', title: '분석 제시와 회신 약속', titleEn: 'Analysis and Follow-up',
        expressions: [
          ['drill down into','자세히 파고들다'],
          ['bounce back with an answer','답을 가지고 다시 회신하다'],
          ['Let me look into that.','그 부분은 확인해보겠습니다.'],
          ['I\'ll get back to you by Friday.','금요일까지 답드리겠습니다.'],
          ['Could you run the numbers?','수치를 계산해봐 주시겠어요?']
        ],
        scenario: {
          title: '예산 분석 요청', titleEn: 'Requesting Budget Analysis',
          brief: '회의에서 데이터 추가 분석이 필요할 때 요청하고 회신을 약속하는 상황입니다.',
          turns: [
            {role:'CFO', line:'Can you confirm the Q3 budget impact?'},
            {role:'Analyst', line:'We need to drill down into the numbers first.'},
            {role:'CFO', line:'Could you run the numbers and bounce back with an answer?'},
            {role:'Analyst', line:'Let me look into that. I\'ll get back to you by Friday.'},
            {role:'CFO', line:'Perfect. That works for us.'}
          ]
        },
        quiz: [
          { q:'"자세히 파고들다"의 영어 표현은?', a:'drill down into' },
          { q:'"답을 가지고 다시 회신하다"는?', a:'bounce back with an answer' },
          { q:'"수치를 계산해봐 주시겠어요?"는?', a:'Could you run the numbers?' }
        ],
        speaking: 'We need to drill down into the numbers before making a decision.'
      },
      {
        id: 'm4', title: '아이디어 제안과 추진', titleEn: 'Ideas and Execution',
        expressions: [
          ['run with an idea','아이디어를 추진하다'],
          ['think outside the box','틀을 깨고 창의적으로 생각하다'],
          ['What if we tried a new approach?','새로운 방법을 시도해보는 건 어떨까요?'],
          ['That idea has a lot of potential.','그 아이디어는 가능성이 높네요.'],
          ['Let\'s pilot this.','이걸 시범 운영해봅시다.']
        ],
        scenario: {
          title: '신규 캠페인 아이디어 제안', titleEn: 'Proposing a New Campaign Idea',
          brief: '마케팅팀이 새로운 접근 방식을 제안하고 팀이 실행을 결정하는 상황입니다.',
          turns: [
            {role:'Manager', line:'We need to think outside the box for this campaign.'},
            {role:'A', line:'What if we tried a gamified onboarding approach?'},
            {role:'Manager', line:'I like that. That idea has a lot of potential.'},
            {role:'B', line:'Should we run with it and let\'s pilot this for Q3?'},
            {role:'Manager', line:'Let\'s do it. Start building the brief this week.'}
          ]
        },
        quiz: [
          { q:'"아이디어를 추진하다"의 영어 표현은?', a:'run with an idea' },
          { q:'"창의적으로 생각하다"의 숙어는?', a:'think outside the box' },
          { q:'"이걸 시범 운영해봅시다"는?', a:'Let\'s pilot this.' }
        ],
        speaking: 'Let\'s think outside the box and run with this new idea.'
      },
      {
        id: 'm5', title: '회의 마무리와 후속 공유', titleEn: 'Wrapping Up and Following Up',
        expressions: [
          ['tie up loose ends','남은 일을 정리하다'],
          ['keep someone in the loop','지속적으로 소식을 공유하다'],
          ['touch base','간단히 다시 소통하다'],
          ['put something in writing','문서로 남기다'],
          ['circle back','다시 연락하다']
        ],
        scenario: {
          title: '회의 종료 후 액션 정리', titleEn: 'Post-Meeting Wrap-Up',
          brief: '회의를 마무리하고 후속 액션 아이템과 공유 방식을 정리합니다.',
          turns: [
            {role:'Manager', line:'Before we wrap up, let\'s tie up loose ends.'},
            {role:'A', line:'I\'ll put the action items in writing and send them out.'},
            {role:'Manager', line:'Please keep everyone in the loop on the timeline.'},
            {role:'B', line:'I\'ll touch base with the dev team tomorrow.'},
            {role:'Manager', line:'Great. Let\'s circle back next Thursday to check progress.'}
          ]
        },
        quiz: [
          { q:'"남은 일을 정리하다"의 표현은?', a:'tie up loose ends' },
          { q:'"지속적으로 소식을 공유하다"는?', a:'keep someone in the loop' },
          { q:'"문서로 남기다"는?', a:'put something in writing' }
        ],
        speaking: 'I\'ll put the action items in writing and keep everyone in the loop.'
      }
    ]
  },
  {
    id: 'product',
    title: '제품소개 강력하게 하기',
    titleEn: 'Powerful Product Presentations',
    emoji: '🚀',
    color: '#34d399',
    summary: '제품 차별점 소개, 기술 강점 어필, 사용자 친화성 설명, 약점을 장점으로 전환하는 방어 전략 연습.',
    tags: ['Product','Pitch','Trade-off','Objection Handling'],
    lessons: [
      {
        id: 'p1', title: '제품 차별점 설명', titleEn: 'What Makes It Different',
        expressions: [
          ['walk someone through','상세히 설명하다 / 단계별로 안내하다'],
          ['What makes our product different is...','우리 제품의 차별점은 ...입니다'],
          ['key features','핵심 기능'],
          ['automate the entire process seamlessly','전체 프로세스를 매끄럽게 자동화하다'],
          ['stands out from the competition','경쟁사와 차별화되다']
        ],
        scenario: {
          title: '제품 소개 미팅', titleEn: 'Product Introduction Meeting',
          brief: '처음 만나는 클라이언트에게 제품의 차별점과 핵심 기능을 소개합니다.',
          turns: [
            {role:'Sales', line:'Let me walk you through the key features of our new platform.'},
            {role:'Client', line:'Great. What makes your product different from others?'},
            {role:'Sales', line:'What makes our product different is its ability to automate the entire process seamlessly.'},
            {role:'Client', line:'Can you give me a specific example?'},
            {role:'Sales', line:'Sure. For instance, our system stands out from the competition with zero manual data entry.'},
            {role:'Client', line:'That\'s impressive. We\'ve been looking for exactly that.'}
          ]
        },
        quiz: [
          { q:'"상세히 설명하다"의 영어 표현은?', a:'walk someone through' },
          { q:'"우리 제품의 차별점은 ...입니다"의 패턴은?', a:'What makes our product different is...' },
          { q:'"경쟁사와 차별화되다"는?', a:'stands out from the competition' }
        ],
        speaking: 'Let me walk you through the key features of our platform.'
      },
      {
        id: 'p2', title: '최첨단 기술력 어필', titleEn: 'Highlighting Technology',
        expressions: [
          ['cutting-edge','최첨단의'],
          ['It\'s designed to...','~하도록 설계되었습니다'],
          ['optimize performance','성능을 최적화하다'],
          ['reduce manual work','수작업을 줄이다'],
          ['built on state-of-the-art architecture','최신 아키텍처 위에 구축된']
        ],
        scenario: {
          title: '기술 설명 세션', titleEn: 'Tech Explanation',
          brief: '클라이언트에게 제품의 기술적 우수성을 설명합니다.',
          turns: [
            {role:'Sales', line:'Our platform uses cutting-edge AI technology.'},
            {role:'Client', line:'What is it designed to do exactly?'},
            {role:'Sales', line:'It\'s designed to optimize performance and reduce manual work by up to 70%.'},
            {role:'Client', line:'Is it built on reliable infrastructure?'},
            {role:'Sales', line:'Absolutely. It\'s built on state-of-the-art architecture with 99.9% uptime.'}
          ]
        },
        quiz: [
          { q:'"최첨단의"는?', a:'cutting-edge' },
          { q:'"~하도록 설계되었다"의 패턴은?', a:'It\'s designed to...' },
          { q:'"성능을 최적화하다"는?', a:'optimize performance' }
        ],
        speaking: 'Our system is cutting-edge and designed to optimize performance.'
      },
      {
        id: 'p3', title: '사용자 친화성과 시장 선도', titleEn: 'Usability and Market Leadership',
        expressions: [
          ['ahead of the curve','시대를 앞서다'],
          ['user-friendly','사용자 친화적인'],
          ['It only takes a few minutes to get started.','시작하는 데 몇 분밖에 걸리지 않습니다.'],
          ['get the most out of','최대한 활용하다'],
          ['no steep learning curve','가파른 학습 곡선이 없다']
        ],
        scenario: {
          title: '제품 사용 편의성 설명', titleEn: 'Demonstrating Ease of Use',
          brief: '고객이 실제 사용 편의성에 대해 우려할 때 설득력 있게 설명합니다.',
          turns: [
            {role:'Client', line:'Is there a steep learning curve?'},
            {role:'Sales', line:'Not at all. It only takes a few minutes to get started.'},
            {role:'Sales', line:'The interface is very user-friendly — no steep learning curve.'},
            {role:'Client', line:'How do teams usually get the most out of it?'},
            {role:'Sales', line:'We provide onboarding support, and most teams are ahead of the curve within a week.'}
          ]
        },
        quiz: [
          { q:'"사용자 친화적인"은?', a:'user-friendly' },
          { q:'"시대를 앞서다"는?', a:'ahead of the curve' },
          { q:'"최대한 활용하다"는?', a:'get the most out of' }
        ],
        speaking: 'It\'s user-friendly and helps teams get the most out of the platform quickly.'
      },
      {
        id: 'p4', title: '약점을 장점으로 바꾸기', titleEn: 'Turning Weaknesses into Strengths',
        expressions: [
          ['turn a challenge into an opportunity','도전을 기회로 바꾸다'],
          ['While it may seem like a drawback, it actually allows us to...','단점처럼 보이지만, 오히려 ...하게 해줍니다'],
          ['data integrity','데이터 무결성'],
          ['optimized for speed and security','속도와 보안에 최적화된'],
          ['trade-off for better performance','더 나은 성능을 위한 절충']
        ],
        scenario: {
          title: '제품 단점 방어', titleEn: 'Handling Product Objections',
          brief: '고객이 제품의 약점을 지적했을 때 논리적으로 장점으로 전환합니다.',
          turns: [
            {role:'Client', line:'We noticed it doesn\'t support older legacy systems. That\'s a concern.'},
            {role:'Sales', line:'I understand. While it may seem like a drawback, it actually allows us to maintain data integrity.'},
            {role:'Client', line:'So there\'s no workaround?'},
            {role:'Sales', line:'Think of it as a trade-off for better performance. The system is optimized for speed and security.'},
            {role:'Sales', line:'We\'re essentially turning a challenge into an opportunity to modernize your stack.'},
            {role:'Client', line:'That\'s a fair point. We\'ve been wanting to upgrade anyway.'}
          ]
        },
        quiz: [
          { q:'"단점처럼 보이지만..."의 패턴은?', a:'While it may seem like a drawback, it actually allows us to...' },
          { q:'"도전을 기회로 바꾸다"는?', a:'turn a challenge into an opportunity' },
          { q:'"데이터 무결성"은?', a:'data integrity' }
        ],
        speaking: 'While it may seem like a drawback, it actually improves speed and security.'
      },
      {
        id: 'p5', title: '큰 그림과 절충안', titleEn: 'Big Picture and Trade-Offs',
        expressions: [
          ['put things in perspective','넓은 시야에서 보다 / 전체 맥락을 파악하다'],
          ['a trade-off','절충 / 하나를 위해 다른 것을 포기함'],
          ['If we look at the bigger picture...','큰 그림에서 보면...'],
          ['long-term value','장기적 가치'],
          ['increases efficiency by over 30%','효율성을 30% 이상 향상시키다']
        ],
        scenario: {
          title: '장기 가치 설득', titleEn: 'Communicating Long-Term Value',
          brief: '단기 불편보다 장기 가치 중심으로 의사결정자를 설득합니다.',
          turns: [
            {role:'Client', line:'The migration process sounds complex and expensive.'},
            {role:'Sales', line:'I hear you. But if we look at the bigger picture, the ROI is clear.'},
            {role:'Sales', line:'Let me put things in perspective: the initial setup is a trade-off.'},
            {role:'Client', line:'What\'s the long-term value exactly?'},
            {role:'Sales', line:'In the first year alone, our clients report it increases efficiency by over 30%.'},
            {role:'Client', line:'That\'s a compelling case.'}
          ]
        },
        quiz: [
          { q:'"넓은 시야에서 보다"의 숙어는?', a:'put things in perspective' },
          { q:'"절충안"은?', a:'a trade-off' },
          { q:'"큰 그림에서 보면"은?', a:'If we look at the bigger picture...' }
        ],
        speaking: 'If we look at the bigger picture, the long-term value is undeniable.'
      }
    ]
  },
  {
    id: 'export',
    title: '수출시장 확대 논의하기',
    titleEn: 'Discussing Export Market Expansion',
    emoji: '🌏',
    color: '#fb923c',
    summary: '시장 진입, 생산 확대, 창의적 전략, 주도권 확보, 문제 해결, 정보 업데이트를 중심으로 연습합니다.',
    tags: ['Export','Market Entry','Expansion','Leadership'],
    lessons: [
      {
        id: 'e1', title: '시장 진입과 확대', titleEn: 'Market Entry and Scale-Up',
        expressions: [
          ['break into a market','시장에 진입하다'],
          ['ramp up','확대하다 / 증가시키다'],
          ['localized campaigns','현지화 캠페인'],
          ['rising demand','증가하는 수요'],
          ['Southeast Asian market','동남아시아 시장']
        ],
        scenario: {
          title: '동남아 시장 진입 논의', titleEn: 'Discussing Southeast Asia Entry',
          brief: '팀 회의에서 새 시장 진입 전략과 마케팅 확대 방안을 논의합니다.',
          turns: [
            {role:'Alex', line:'Let\'s talk about breaking into the Southeast Asian market.'},
            {role:'Mina', line:'We\'re seeing rising demand there. We need to ramp up our localized campaigns.'},
            {role:'Alex', line:'Agreed. Do we have the capacity to break into Vietnam and Thailand first?'},
            {role:'Sophie', line:'Yes, but we\'ll need to ramp up production by at least 20% to meet demand.'},
            {role:'Alex', line:'Let\'s make that a priority for Q3.'}
          ]
        },
        quiz: [
          { q:'"시장에 진입하다"의 숙어는?', a:'break into a market' },
          { q:'"확대하다"의 표현은?', a:'ramp up' },
          { q:'"현지화 캠페인"은?', a:'localized campaigns' }
        ],
        speaking: 'We need to ramp up our localized campaigns to break into the Southeast Asian market.'
      },
      {
        id: 'e2', title: '창의적 전략과 주도권', titleEn: 'Creative Strategy and Leadership',
        expressions: [
          ['think outside the box','창의적으로 생각하다'],
          ['take the lead','주도권을 잡다 / 이끌다'],
          ['coordinate with partners','파트너와 조율하다'],
          ['brainstorm new approaches','새 접근 방식을 브레인스토밍하다'],
          ['gain a competitive edge','경쟁 우위를 확보하다']
        ],
        scenario: {
          title: '수출 전략 브레인스토밍', titleEn: 'Brainstorming Export Tactics',
          brief: '기존 방식에서 벗어나 새로운 시장 전략을 논의하고 담당자를 지정합니다.',
          turns: [
            {role:'Alex', line:'We need to think outside the box if we want to gain a competitive edge.'},
            {role:'Mina', line:'I can take the lead on brainstorming new approaches with our local agents.'},
            {role:'Alex', line:'That\'s great. Can you also coordinate with our regional partners?'},
            {role:'Mina', line:'Of course. I\'ll reach out this week.'},
            {role:'Sophie', line:'Maybe we can run a pilot before the full launch to reduce risk.'},
            {role:'Alex', line:'Good thinking. Let\'s think outside the box on the pilot design too.'}
          ]
        },
        quiz: [
          { q:'"창의적으로 생각하다"는?', a:'think outside the box' },
          { q:'"주도권을 잡다"는?', a:'take the lead' },
          { q:'"파트너와 조율하다"는?', a:'coordinate with partners' }
        ],
        speaking: 'I\'ll take the lead and think outside the box to find new approaches.'
      },
      {
        id: 'e3', title: '문제 해결과 실행 시작', titleEn: 'Problem-Solving and Kick-Off',
        expressions: [
          ['sort out','(문제를) 해결하다 / 정리하다'],
          ['get the ball rolling','시작하다 / 본격적으로 착수하다'],
          ['shipping routes','배송 경로'],
          ['regulatory requirements','규정 요건'],
          ['clear obstacles','장애물을 제거하다']
        ],
        scenario: {
          title: '실행 전 장애물 정리', titleEn: 'Clearing Obstacles Before Launch',
          brief: '본격적인 실행에 앞서 물류와 규정 이슈를 파악하고 해결합니다.',
          turns: [
            {role:'Alex', line:'Before we get the ball rolling, we need to sort out logistics.'},
            {role:'David', line:'Specifically, we need to sort out the shipping routes to Thailand.'},
            {role:'Sophie', line:'There are also regulatory requirements to clear obstacles before we can export.'},
            {role:'Alex', line:'Let\'s tackle those this week. David, can you own the regulatory side?'},
            {role:'David', line:'Yes. I\'ll prepare a summary by Wednesday.'},
            {role:'Alex', line:'Perfect. Then we\'ll be ready to really get the ball rolling.'}
          ]
        },
        quiz: [
          { q:'"문제를 해결하다"는?', a:'sort out' },
          { q:'"시작하다 / 본격 착수하다"는?', a:'get the ball rolling' },
          { q:'"규정 요건"은?', a:'regulatory requirements' }
        ],
        speaking: 'Before we get the ball rolling, we need to sort out the regulatory requirements.'
      },
      {
        id: 'e4', title: '업데이트와 팔로업', titleEn: 'Updates and Follow-Up',
        expressions: [
          ['keep me posted','계속 업데이트해 주세요'],
          ['status update','현황 업데이트'],
          ['next steps','다음 단계'],
          ['on track','일정대로 진행 중인'],
          ['flag any issues','문제가 있으면 알려주세요']
        ],
        scenario: {
          title: '진행 현황 공유 회의', titleEn: 'Progress Update Meeting',
          brief: '팀원들이 각자의 진행 상황을 공유하고 다음 단계를 확인합니다.',
          turns: [
            {role:'Alex', line:'Let\'s go over next steps. Is everything on track?'},
            {role:'Mina', line:'Marketing is on track. I\'ll send a status update by Thursday.'},
            {role:'David', line:'Regulations are mostly sorted. Please keep me posted on any shipment changes.'},
            {role:'Sophie', line:'Production is fine, but please flag any issues with demand forecasts.'},
            {role:'Alex', line:'Great. Keep me posted on all fronts, and we\'ll review again next week.'}
          ]
        },
        quiz: [
          { q:'"계속 업데이트해 주세요"는?', a:'keep me posted' },
          { q:'"일정대로 진행 중인"은?', a:'on track' },
          { q:'"다음 단계"는?', a:'next steps' }
        ],
        speaking: 'Please keep me posted on any changes and flag any issues right away.'
      }
    ]
  },
  {
    id: 'smalltalk',
    title: '원어민처럼 비즈니스 스몰토크',
    titleEn: 'Business Small Talk Like a Native',
    emoji: '☕',
    color: '#f472b6',
    summary: '해외출장 도착 스몰토크, 현지 문화 대화, 바이어 한국 방문 환대, 미팅 전후 마무리 멘트를 연습합니다.',
    tags: ['Small Talk','Travel','Native-like','Rapport'],
    lessons: [
      {
        id: 's1', title: '출장 도착 스몰토크', titleEn: 'Arrival Small Talk',
        expressions: [
          ['The flight wasn\'t too bad, actually.','비행이 그렇게 나쁘지는 않았어요.'],
          ['Thanks again for arranging the pickup.','픽업 준비해주셔서 다시 감사합니다.'],
          ['Your city is beautiful. I wish I had more time to explore.','도시가 정말 아름다워요. 둘러볼 시간이 더 있으면 좋겠네요.'],
          ['Can\'t complain — I slept through most of it.','별로 불평할 건 없어요. 대부분 자면서 왔거든요.'],
          ['Jet lag is setting in a bit.','시차 적응이 조금 힘드네요.']
        ],
        scenario: {
          title: '공항 픽업 후 이동 중 대화', titleEn: 'Chat After Airport Pickup',
          brief: '공항에서 픽업 후 호텔로 이동하면서 나누는 자연스러운 스몰토크입니다.',
          turns: [
            {role:'Host', line:'Welcome! How was your flight from Seoul?'},
            {role:'Guest', line:'The flight wasn\'t too bad, actually. Can\'t complain — I slept through most of it.'},
            {role:'Host', line:'That\'s the best way to travel! Did you have any trouble finding us at arrivals?'},
            {role:'Guest', line:'Not at all. Thanks again for arranging the pickup — that was a huge help.'},
            {role:'Host', line:'Of course! What do you think of the city so far?'},
            {role:'Guest', line:'Your city is beautiful. I wish I had more time to explore. Jet lag is setting in a bit, but I\'m excited.'}
          ]
        },
        quiz: [
          { q:'"비행이 그렇게 나쁘지 않았어요"는?', a:'The flight wasn\'t too bad, actually.' },
          { q:'"픽업 준비해주셔서 감사합니다"는?', a:'Thanks again for arranging the pickup.' },
          { q:'"시차 적응이 힘드네요"는?', a:'Jet lag is setting in a bit.' }
        ],
        speaking: 'The flight wasn\'t too bad, actually. Thanks for arranging the pickup.'
      },
      {
        id: 's2', title: '문화와 분위기 이야기', titleEn: 'Talking About Culture and Vibe',
        expressions: [
          ['That grows on you.','갈수록 정이 들어요 / 점점 좋아지게 돼요.'],
          ['It\'s got such a good vibe.','분위기가 정말 좋아요.'],
          ['Any must-visit spots you\'d recommend?','꼭 가봐야 할 곳 추천해주실 수 있나요?'],
          ['You\'ve really nailed the balance between modern and traditional.','전통과 현대의 균형을 기가 막히게 잘 잡으셨네요.'],
          ['That\'s right up my alley.','제 취향에 딱 맞아요.']
        ],
        scenario: {
          title: '서울 인상 나누기', titleEn: 'Sharing First Impressions of Seoul',
          brief: '서울에 처음 방문한 바이어와 도시 분위기와 문화에 대해 자연스럽게 이야기합니다.',
          turns: [
            {role:'Host', line:'So, first impressions of Seoul?'},
            {role:'Buyer', line:'Honestly, it\'s got such a good vibe. The energy here is amazing.'},
            {role:'Host', line:'It takes a little getting used to, but…'},
            {role:'Buyer', line:'That grows on you very quickly though! I love how you\'ve nailed the balance between modern and traditional.'},
            {role:'Host', line:'I\'m glad you feel that way. Any must-visit spots you\'d like to explore this trip?'},
            {role:'Buyer', line:'I heard the Han River parks are beautiful. That\'s right up my alley.'}
          ]
        },
        quiz: [
          { q:'"갈수록 정이 들어요"는?', a:'That grows on you.' },
          { q:'"분위기가 정말 좋아요"는?', a:'It\'s got such a good vibe.' },
          { q:'"제 취향에 딱 맞아요"는?', a:'That\'s right up my alley.' }
        ],
        speaking: 'Seoul has such a good vibe. It really grows on you.'
      },
      {
        id: 's3', title: '바이어 한국 방문 환대', titleEn: 'Welcoming a Buyer to Korea',
        expressions: [
          ['Welcome to Korea!','한국에 오신 걸 환영합니다!'],
          ['When did you land?','언제 도착하셨어요?'],
          ['Have you had a chance to try Korean BBQ yet?','한국식 바비큐를 드셔보셨나요?'],
          ['Already feels like I\'m in good hands.','벌써 믿음이 가네요.'],
          ['You\'re going to love it here.','여기가 마음에 드실 거예요.']
        ],
        scenario: {
          title: '한국 방문 바이어 첫 환영', titleEn: 'Welcoming an Overseas Buyer',
          brief: '한국에 처음 방문한 해외 바이어를 따뜻하게 맞이하고 첫 인상을 편안하게 해줍니다.',
          turns: [
            {role:'Host', line:'Welcome to Korea! How was your journey?'},
            {role:'Buyer', line:'Fantastic, thank you. When did I land? Just two hours ago, feels like five minutes!'},
            {role:'Host', line:'Ha! We\'re so glad you\'re here. You\'re going to love it here.'},
            {role:'Buyer', line:'Already feels like I\'m in good hands. Thank you so much for the warm welcome.'},
            {role:'Host', line:'Of course! Have you had a chance to try Korean BBQ yet?'},
            {role:'Buyer', line:'Not yet, but I\'ve been looking forward to it. Any good spots nearby?'}
          ]
        },
        quiz: [
          { q:'"한국에 오신 걸 환영합니다"는?', a:'Welcome to Korea!' },
          { q:'"벌써 믿음이 가네요"는?', a:'Already feels like I\'m in good hands.' },
          { q:'"여기가 마음에 드실 거예요"는?', a:'You\'re going to love it here.' }
        ],
        speaking: 'Welcome to Korea! Have you had a chance to try Korean BBQ yet?'
      },
      {
        id: 's4', title: '원어민 반응 표현', titleEn: 'Native-Like Reaction Phrases',
        expressions: [
          ['You\'re blowing my mind.','완전 놀랐어요 / 충격이에요.'],
          ['It lives up to the hype.','소문만큼 정말 좋네요.'],
          ['You had me at "free samples".','\"무료 샘플\"이라는 말에 바로 설득됐어요.'],
          ['That\'s wild.','대박이다 / 말도 안 돼.'],
          ['I\'m totally on board.','완전 동의해요 / 함께할게요.']
        ],
        scenario: {
          title: '원어민처럼 반응하기', titleEn: 'Reacting Like a Native Speaker',
          brief: '놀라운 소식이나 제안에 원어민스럽게 반응하는 표현을 연습합니다.',
          turns: [
            {role:'A', line:'We just secured a deal with three new clients this week.'},
            {role:'B', line:'That\'s wild! Three in one week?'},
            {role:'A', line:'Yes. And they\'re all in the fintech space.'},
            {role:'B', line:'You\'re blowing my mind. How did you close them so fast?'},
            {role:'A', line:'We offered free pilot access for 30 days.'},
            {role:'B', line:'You had me at "free pilot". And does the product live up to the hype?'},
            {role:'A', line:'Our retention rate is 94%, so… I think it lives up to the hype.'},
            {role:'B', line:'I\'m totally on board. Count me in.'}
          ]
        },
        quiz: [
          { q:'"소문만큼 정말 좋네요"는?', a:'It lives up to the hype.' },
          { q:'"완전 놀랐어요"의 원어민 표현은?', a:'You\'re blowing my mind.' },
          { q:'"완전 동의해요 / 함께할게요"는?', a:'I\'m totally on board.' }
        ],
        speaking: 'That\'s wild! It totally lives up to the hype.'
      },
      {
        id: 's5', title: '미팅 전후 마무리 멘트', titleEn: 'Pre and Post-Meeting Wrap-Up',
        expressions: [
          ['I\'m looking forward to hearing your insights.','당신의 인사이트를 듣길 기대합니다.'],
          ['Really appreciate you taking the time today.','오늘 시간 내주셔서 정말 감사합니다.'],
          ['Great catching up with you.','오랜만에 이야기 나눠서 좋았습니다.'],
          ['Let\'s keep the momentum going.','이 흐름 계속 이어가요.'],
          ['Looking forward to next steps.','다음 단계가 기대됩니다.']
        ],
        scenario: {
          title: '미팅 직후 마무리', titleEn: 'Post-Meeting Close',
          brief: '비즈니스 미팅 직후 자연스럽고 프로다운 마무리 멘트로 좋은 인상을 남깁니다.',
          turns: [
            {role:'Host', line:'Before we head out, I just want to say — really appreciate you taking the time today.'},
            {role:'Guest', line:'My pleasure! Great catching up with you. It was a productive session.'},
            {role:'Host', line:'Absolutely. I\'m looking forward to hearing your insights once you review the proposal.'},
            {role:'Guest', line:'Will do. Let\'s keep the momentum going — I\'ll send over feedback by next Friday.'},
            {role:'Host', line:'Perfect. Looking forward to next steps.'}
          ]
        },
        quiz: [
          { q:'"오늘 시간 내주셔서 감사합니다"는?', a:'Really appreciate you taking the time today.' },
          { q:'"이 흐름 계속 이어가요"는?', a:'Let\'s keep the momentum going.' },
          { q:'"다음 단계가 기대됩니다"는?', a:'Looking forward to next steps.' }
        ],
        speaking: 'Really appreciate your time today. Let\'s keep the momentum going.'
      }
    ]
  },
  {
    id: 'negotiation',
    title: '멋지게 협상하기',
    titleEn: 'Negotiating with Confidence',
    emoji: '🤜',
    color: '#fbbf24',
    summary: '탐색전, 조건 제시, 반대 조율, 딜 마무리, 사후 관계 구축까지 협상 전체 흐름을 단계별로 연습합니다.',
    tags: ['Negotiation','Deal','Objection','Rapport'],
    lessons: [
      {
        id: 'g1', title: '첫 미팅과 탐색전', titleEn: 'Opening and Exploring',
        expressions: [
          ['open the discussion','협상을 시작하다'],
          ['test the waters','반응을 살펴보다 / 분위기를 파악하다'],
          ['outline our goals','목표를 개괄하다'],
          ['Before making any firm offers...','확정 제안을 하기 전에...'],
          ['I\'d like to understand your priorities first.','먼저 귀사의 우선순위를 파악하고 싶습니다.']
        ],
        scenario: {
          title: '첫 협상 미팅', titleEn: 'First Negotiation Meeting',
          brief: '첫 미팅에서 의도를 드러내되 너무 빨리 입장을 확정하지 않고 상대 반응을 파악합니다.',
          turns: [
            {role:'ABC Corp', line:'Thank you for joining us. Let\'s open the discussion by outlining our goals.'},
            {role:'GlobalTech', line:'Absolutely. We\'re happy to be here.'},
            {role:'ABC Corp', line:'We\'d like to test the waters before making any firm offers.'},
            {role:'GlobalTech', line:'We appreciate that approach. I\'d like to understand your priorities first.'},
            {role:'ABC Corp', line:'Our main priorities are quality, timeline, and long-term partnership.'},
            {role:'GlobalTech', line:'Great. Those align well with what we can offer.'}
          ]
        },
        quiz: [
          { q:'"협상을 시작하다"는?', a:'open the discussion' },
          { q:'"반응을 살펴보다"는?', a:'test the waters' },
          { q:'"확정 제안을 하기 전에"는?', a:'Before making any firm offers...' }
        ],
        speaking: 'We\'d like to test the waters before making any firm offers.'
      },
      {
        id: 'g2', title: '조건 제시와 우위 확보', titleEn: 'Putting Terms on the Table',
        expressions: [
          ['put something on the table','제안을 내놓다'],
          ['gain the upper hand','우위를 점하다'],
          ['volume discount','대량 할인'],
          ['pricing terms','가격 조건'],
          ['bundled package','묶음 패키지']
        ],
        scenario: {
          title: '조건 제안 협상', titleEn: 'Proposing Terms Strategically',
          brief: '상대방의 반응을 고려하며 전략적으로 조건을 제안합니다.',
          turns: [
            {role:'Seller', line:'We\'re prepared to put a volume discount on the table.'},
            {role:'Buyer', line:'That\'s interesting. What kind of percentage are we talking about?'},
            {role:'Seller', line:'We can offer 15% on orders over 500 units. That helps you gain the upper hand on cost.'},
            {role:'Buyer', line:'We also need flexible pricing terms.'},
            {role:'Seller', line:'We can do that. We could also look at a bundled package if that helps.'},
            {role:'Buyer', line:'That would definitely make this more attractive.'}
          ]
        },
        quiz: [
          { q:'"제안을 내놓다"는?', a:'put something on the table' },
          { q:'"우위를 점하다"는?', a:'gain the upper hand' },
          { q:'"가격 조건"은?', a:'pricing terms' }
        ],
        speaking: 'We\'re ready to put a volume discount on the table today.'
      },
      {
        id: 'g3', title: '반대와 절충', titleEn: 'Pushing Back and Finding Middle Ground',
        expressions: [
          ['push back','반대하다 / 반발하다'],
          ['meet halfway','절충하다 / 중간 지점에서 타협하다'],
          ['That\'s a sticking point for us.','그 부분이 우리한테는 걸림돌이에요.'],
          ['revised proposal','수정 제안'],
          ['find common ground','공통점을 찾다']
        ],
        scenario: {
          title: '배송 조건 절충', titleEn: 'Negotiating Delivery Terms',
          brief: '조건 차이가 있을 때 상대 입장을 존중하면서 절충안을 제시합니다.',
          turns: [
            {role:'Buyer', line:'We need delivery in 30 days. That\'s essential for us.'},
            {role:'Seller', line:'I have to push back on that timeline — 30 days isn\'t feasible for this volume.'},
            {role:'Buyer', line:'That\'s a sticking point for us. We can\'t move the launch date.'},
            {role:'Seller', line:'Could we meet halfway? How about 40 days, and we prioritize your order?'},
            {role:'Buyer', line:'We could work with 38 days if you can guarantee it.'},
            {role:'Seller', line:'Agreed. Let me draw up a revised proposal with those terms.'}
          ]
        },
        quiz: [
          { q:'"반대하다"는?', a:'push back' },
          { q:'"절충하다"는?', a:'meet halfway' },
          { q:'"수정 제안"은?', a:'revised proposal' }
        ],
        speaking: 'I have to push back, but maybe we can meet halfway at 38 days.'
      },
      {
        id: 'g4', title: '딜 마무리와 유연성 확보', titleEn: 'Sealing the Deal',
        expressions: [
          ['seal the deal','딜을 마무리하다 / 계약을 체결하다'],
          ['leave room for flexibility','유연성을 남겨두다'],
          ['final terms','최종 조건'],
          ['contract draft','계약 초안'],
          ['mutual benefit','상호 이익']
        ],
        scenario: {
          title: '최종 계약 마무리', titleEn: 'Closing the Deal',
          brief: '합의 직전, 마지막 유연성을 남겨두고 최종 조건을 정리하며 계약을 체결합니다.',
          turns: [
            {role:'Seller', line:'I think we\'re very close to sealing the deal here.'},
            {role:'Buyer', line:'Agreed. Can we leave a little room for flexibility on order quantities?'},
            {role:'Seller', line:'We can allow a 10% variance. The final terms will reflect that.'},
            {role:'Buyer', line:'That works for us. This feels like a true mutual benefit.'},
            {role:'Seller', line:'Absolutely. I\'ll have the contract draft ready by tomorrow morning.'},
            {role:'Buyer', line:'Looking forward to it. Let\'s seal the deal.'}
          ]
        },
        quiz: [
          { q:'"딜을 마무리하다"는?', a:'seal the deal' },
          { q:'"유연성을 남겨두다"는?', a:'leave room for flexibility' },
          { q:'"계약 초안"은?', a:'contract draft' }
        ],
        speaking: 'We\'re close to sealing the deal. Let\'s leave some room for flexibility.'
      },
      {
        id: 'g5', title: '사후 관리와 관계 구축', titleEn: 'Follow-Up and Rapport Building',
        expressions: [
          ['touch base','다시 연락하다 / 간단히 소통하다'],
          ['build rapport','친밀한 관계를 구축하다'],
          ['long-term partnership','장기 파트너십'],
          ['after-sales support','사후 지원'],
          ['Glad we could make this work.','이렇게 성사될 수 있어서 기쁩니다.']
        ],
        scenario: {
          title: '협상 후 관계 유지', titleEn: 'Maintaining the Relationship Post-Deal',
          brief: '딜 이후에도 장기 협력과 신뢰 관계를 위한 대화를 나눕니다.',
          turns: [
            {role:'A', line:'It was a pleasure working this out with you.'},
            {role:'B', line:'Same here. Glad we could make this work.'},
            {role:'A', line:'Let\'s touch base next week after the contract is signed.'},
            {role:'B', line:'Of course. I\'d also like to build rapport with your operations team.'},
            {role:'A', line:'I\'ll set up an intro call. Strong long-term partnership is very important to us.'},
            {role:'B', line:'Absolutely. We also provide comprehensive after-sales support, so you\'re in good hands.'}
          ]
        },
        quiz: [
          { q:'"다시 연락하다"는?', a:'touch base' },
          { q:'"친밀한 관계를 구축하다"는?', a:'build rapport' },
          { q:'"사후 지원"은?', a:'after-sales support' }
        ],
        speaking: 'Let\'s touch base next week and keep building our long-term partnership.'
      }
    ]
  }
];