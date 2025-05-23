const events = [
    {
      title: "Tech Talk: AI in 2025",
      description: "Exploring the next generation of artificial intelligence applications.",
      date: new Date("2025-05-10"),
      location: "San Francisco, USA",
      topic: "Tech",
    },
    {
      title: "Future of Web Development",
      description: "Trends and tools shaping frontend and backend development.",
      date: new Date("2025-05-12"),
      location: "New York, USA",
      topic: "Tech",
    },
    {
      title: "Cybersecurity Summit",
      description: "Protecting data in an increasingly connected world.",
      date: new Date("2025-05-20"),
      location: "Toronto, Canada",
      topic: "Tech",
    },
    {
      title: "Cloud Conf 2025",
      description: "Serverless, edge computing, and cloud-native architecture.",
      date: new Date("2025-05-22"),
      location: "Amsterdam, Netherlands",
      topic: "Tech",
    },
    {
      title: "Tech Expo: Future Hardware",
      description: "Discover the latest breakthroughs in computing hardware.",
      date: new Date("2025-05-15"),
      location: "Berlin, Germany",
      topic: "Tech",
    },
    {
      title: "AR/VR Developer Day",
      description: "Workshops on building for augmented and virtual reality.",
      date: new Date("2025-05-27"),
      location: "Seoul, South Korea",
      topic: "Tech",
    },
    {
      title: "Quantum Computing Forum",
      description: "An introduction to quantum algorithms and hardware.",
      date: new Date("2025-05-30"),
      location: "Zurich, Switzerland",
      topic: "Tech",
    },
    {
      title: "DevOps World 2025",
      description: "CI/CD, monitoring, and infrastructure as code practices.",
      date: new Date("2025-06-01"),
      location: "London, UK",
      topic: "Tech",
    },
    {
      title: "Mobile Tech Conference",
      description: "Building high-performance mobile apps in 2025.",
      date: new Date("2025-06-04"),
      location: "Sydney, Australia",
      topic: "Tech",
    },
    {
      title: "Tech & Ethics Panel",
      description: "Discussing AI bias, privacy, and ethical development.",
      date: new Date("2025-06-07"),
      location: "Copenhagen, Denmark",
      topic: "Tech",
    },
  
    // --- Sport Events ---
    {
      title: "Marathon Challenge",
      description: "A 42km run through scenic routes.",
      date: new Date("2025-06-01"),
      location: "Boston, USA",
      topic: "Sport",
    },
    {
      title: "Urban Climbing Competition",
      description: "Top athletes compete in vertical urban races.",
      date: new Date("2025-06-08"),
      location: "Tokyo, Japan",
      topic: "Sport",
    },
    {
      title: "International Swim Meet",
      description: "Elite swimmers race across multiple events.",
      date: new Date("2025-06-15"),
      location: "Barcelona, Spain",
      topic: "Sport",
    },
    {
      title: "Streetball Tournament",
      description: "3v3 basketball showdown in city courts.",
      date: new Date("2025-06-18"),
      location: "Chicago, USA",
      topic: "Sport",
    },
    {
      title: "Soccer Skills Workshop",
      description: "Training sessions with pro players.",
      date: new Date("2025-06-20"),
      location: "Manchester, UK",
      topic: "Sport",
    },
    {
      title: "Yoga in the Park",
      description: "Free outdoor yoga for all levels.",
      date: new Date("2025-06-22"),
      location: "Vancouver, Canada",
      topic: "Sport",
    },
    {
      title: "CrossFit Challenge Day",
      description: "Test your endurance in a team-based fitness battle.",
      date: new Date("2025-06-25"),
      location: "Denver, USA",
      topic: "Sport",
    },
    {
      title: "Rock Climbing Workshop",
      description: "Intro to bouldering and sport climbing.",
      date: new Date("2025-06-27"),
      location: "Oslo, Norway",
      topic: "Sport",
    },
    {
      title: "Beach Volleyball Bash",
      description: "Casual matches and coaching clinics.",
      date: new Date("2025-06-29"),
      location: "Rio de Janeiro, Brazil",
      topic: "Sport",
    },
    {
      title: "Winter Sports Weekend",
      description: "Try skiing, snowboarding, and snowshoeing.",
      date: new Date("2025-12-15"),
      location: "Aspen, USA",
      topic: "Sport",
    },
  
    // --- Business Events ---
    {
      title: "Startup Pitch Fest",
      description: "Entrepreneurs pitch ideas to top investors.",
      date: new Date("2025-06-20"),
      location: "London, UK",
      topic: "Business",
    },
    {
      title: "Remote Work Summit",
      description: "Exploring the future of distributed teams.",
      date: new Date("2025-06-25"),
      location: "Amsterdam, Netherlands",
      topic: "Business",
    },
    {
      title: "Marketing in a Digital World",
      description: "How to reach audiences across platforms.",
      date: new Date("2025-06-28"),
      location: "Los Angeles, USA",
      topic: "Business",
    },
    {
      title: "Women in Leadership",
      description: "Empowering women through networking and mentorship.",
      date: new Date("2025-07-01"),
      location: "Paris, France",
      topic: "Business",
    },
    {
      title: "Fintech Forum 2025",
      description: "The latest innovations in financial technology.",
      date: new Date("2025-07-03"),
      location: "Zurich, Switzerland",
      topic: "Business",
    },
    {
      title: "Small Biz Bootcamp",
      description: "Training for small and local business owners.",
      date: new Date("2025-07-05"),
      location: "Austin, USA",
      topic: "Business",
    },
    {
      title: "Green Business Expo",
      description: "Sustainable strategies for modern companies.",
      date: new Date("2025-07-08"),
      location: "Stockholm, Sweden",
      topic: "Business",
    },
    {
      title: "Business Analytics Day",
      description: "Data-driven decision making and BI tools.",
      date: new Date("2025-07-11"),
      location: "Singapore",
      topic: "Business",
    },
    {
      title: "Corporate Innovation Summit",
      description: "Encouraging change in large organizations.",
      date: new Date("2025-07-15"),
      location: "Dubai, UAE",
      topic: "Business",
    },
    {
      title: "HR Future Forum",
      description: "The changing role of HR and workplace culture.",
      date: new Date("2025-07-17"),
      location: "Dublin, Ireland",
      topic: "Business",
    },
  
    // --- Health Events ---
    {
      title: "Mental Wellness Retreat",
      description: "Workshops on mindfulness, meditation, and stress relief.",
      date: new Date("2025-07-01"),
      location: "Bali, Indonesia",
      topic: "Health",
    },
    {
      title: "Nutrition and Fitness Expo",
      description: "Learn about diet trends and fitness tech.",
      date: new Date("2025-07-07"),
      location: "Los Angeles, USA",
      topic: "Health",
    },
    {
      title: "Global Health Conference",
      description: "Addressing worldwide healthcare challenges.",
      date: new Date("2025-07-10"),
      location: "Geneva, Switzerland",
      topic: "Health",
    },
    {
      title: "Plant-Based Living Workshop",
      description: "Transitioning to a more sustainable lifestyle.",
      date: new Date("2025-07-12"),
      location: "Melbourne, Australia",
      topic: "Health",
    },
    {
      title: "Sleep Science Symposium",
      description: "Improving sleep hygiene and productivity.",
      date: new Date("2025-07-14"),
      location: "Reykjavik, Iceland",
      topic: "Health",
    },
    {
      title: "Fitness Challenge Weekend",
      description: "Fun and competitive fitness challenges.",
      date: new Date("2025-07-16"),
      location: "Miami, USA",
      topic: "Health",
    },
    {
      title: "Holistic Health Fair",
      description: "Combining modern medicine and traditional healing.",
      date: new Date("2025-07-18"),
      location: "Cape Town, South Africa",
      topic: "Health",
    },
    {
      title: "Children’s Health Day",
      description: "Family-friendly health education activities.",
      date: new Date("2025-07-21"),
      location: "Osaka, Japan",
      topic: "Health",
    },
    {
      title: "Men's Health Forum",
      description: "Focused on mental and physical health for men.",
      date: new Date("2025-07-23"),
      location: "Phoenix, USA",
      topic: "Health",
    },
    {
      title: "Women's Wellness Weekend",
      description: "Health, fitness, and nutrition for women.",
      date: new Date("2025-07-26"),
      location: "Barcelona, Spain",
      topic: "Health",
    },
  ]

  export default events;