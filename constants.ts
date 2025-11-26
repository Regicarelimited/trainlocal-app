import { TrainerProfile } from './types';

export const COLORS = {
  teal: '#2DB1AE',
  yellow: '#F3C257',
  darkGrey: '#42464B',
  lightGrey: '#F4F4F4',
  blue: '#306DAC',
  pink: '#FF3366',
  darkPurple: '#2E294E',
  white: '#FFFFFF',
};

export const SPECIALISM_CATEGORIES: Record<string, string[]> = {
  "Popular": [
    "Weight Loss", "Strength Training", "Yoga", "Running", 
    "Injury Rehab", "Boxing", "Over 50s", "Pre/Post Natal",
    "Beginners", "CrossFit", "Pilates", "Online Coaching"
  ],
  "Goals": [ 
    "Fat Loss", "Muscle Gain", "Strength", "Endurance", "Flexibility", 
    "Confidence Building", "Mental Health Focus", "Wedding Prep", 
    "Holiday Shred", "Postural Correction"
  ],
  "Training Style": [
    "HIIT", "Powerlifting", "Bodybuilding", "Calisthenics", 
    "Barre", "Functional Fitness", "Olympic Lifting", "Kettlebells", "Boxing"
  ],
  "Sports": [
    "Triathlon", "Hyrox", "Cycling", "Swimming", "Golf Fitness", "Tennis Prep"
  ],
  "Health": [
    "Back Pain", "Post-Surgery", "Cardiac Rehab", "Chronic Illness Support", 
    "Menopause Support", "Mobility"
  ],
  "Groups": [
    "Seniors (70+)", "Youth & Teens", "Women Only", "Men Only", 
    "LGBTQ+ Friendly", "Disability Inclusive"
  ]
};

// Flatten tags for filtering
const allTagsRaw = Object.values(SPECIALISM_CATEGORIES).flat();
export const ALL_TAGS = Array.from(new Set(allTagsRaw)).sort();
export const POPULAR_FILTERS = SPECIALISM_CATEGORIES["Popular"];

const generateMockProfiles = (startId: number, count: number): TrainerProfile[] => {
  const firstNames = ["James", "Emily", "Michael", "Jessica", "David", "Sarah", "Robert", "Jennifer", "John", "Lisa", "William", "Ashley", "Richard", "Nicole", "Joseph", "Amanda", "Thomas", "Melissa", "Charles", "Michelle", "Daniel", "Stephanie", "Matthew", "Rebecca", "Anthony", "Laura", "Mark", "Sharon", "Donald", "Cynthia", "Paul", "Kathleen", "Steven", "Amy", "Andrew", "Shirley", "Kenneth", "Angela", "Joshua", "Helen", "Kevin", "Anna", "Brian", "Brenda", "George", "Pamela", "Edward", "Emma", "Ronald", "Samantha"];
  const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins"];
  const businessSuffixes = ["Fitness", "Training", "PT", "Performance", "Coaching", "Wellness", "Health", "Strength", "Conditioning", "Studios", "Gym", "Athletics", "Movement", "Flow", "Life"];
  const localAreas = [
    "Hastings, Town Centre", "Hastings, Old Town", "Hastings, Silverhill", "Hastings, Ore", "Hastings, Clive Vale", "Hastings, West Hill", "Hastings, Alexandra Park", "Hastings, Blacklands",
    "St Leonards, Marina", "St Leonards, Warrior Square", "St Leonards, West St Leonards", "St Leonards, Silverhill", "St Leonards, Maze Hill", "St Leonards, Bohemia", "Bulverhythe", "Hollington"
  ];
    
  const voices = ["Kore", "Fenrir", "Leda", "Orus", "Aoede", "Puck", "Zephyr", "Callirrhoe", "Charon"];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const businessName = Math.random() > 0.5 ? `${lastName} ${businessSuffixes[Math.floor(Math.random() * businessSuffixes.length)]}` : `${firstName} ${businessSuffixes[Math.floor(Math.random() * businessSuffixes.length)]}`;
    const shuffledTags = ALL_TAGS.sort(() => 0.5 - Math.random());
    const popularTag = POPULAR_FILTERS[Math.floor(Math.random() * POPULAR_FILTERS.length)];
    const baseSpecialisms = Math.random() > 0.3 ? [popularTag, ...shuffledTags] : shuffledTags;
    const mySpecialisms = Array.from(new Set(baseSpecialisms)).slice(0, Math.floor(Math.random() * 4) + 4);
      
    return {
      id: startId + i,
      name: `${firstName} ${lastName}`,
      businessName: businessName,
      location: localAreas[Math.floor(Math.random() * localAreas.length)],
      rating: (Math.random() * (5.0 - 4.5) + 4.5),
      reviews: Math.floor(Math.random() * 150) + 5,
      specialisms: mySpecialisms,
      image: `${firstName[0]}${lastName[0]}`, 
      logo: "Logo",
      logoColor: [COLORS.blue, COLORS.teal, COLORS.pink, COLORS.darkPurple, COLORS.yellow][Math.floor(Math.random() * 5)],
      price: `£${Math.floor(Math.random() * (80 - 30) + 30)}`,
      bio: `Hi, I'm ${firstName}! I am a passionate personal trainer in ${localAreas[Math.floor(Math.random() * localAreas.length)].split(',')[0]} with over ${Math.floor(Math.random() * 10) + 2} years of experience helping people transform their lives.\n\nMy philosophy is built around ${mySpecialisms[0].toLowerCase()} and ${mySpecialisms[1].toLowerCase()}. I believe that fitness should be accessible, enjoyable, and sustainable. I don't just count reps; I educate my clients on proper technique, nutrition, and mindset to ensure long-term success.\n\nWhether you are a complete beginner looking to get started or an experienced athlete aiming for a new PR, I offer personalized plans that fit your lifestyle and schedule. Let's work together to build a better, stronger you!`,
      availability: ["Mon-Fri", "Weekends", "Evenings", "Daily", "Tue, Thu"][Math.floor(Math.random() * 5)],
      voice: voices[Math.floor(Math.random() * voices.length)]
    };
  });
};

export const STATIC_PT_DATA: TrainerProfile[] = [
  {
    id: 29, 
    name: "Lynda Nash",
    businessName: "All Fit",
    location: "Hastings & St Leonards-on-sea",
    rating: 5.0,
    reviews: 12,
    specialisms: ["General Fitness", "Weight Loss", "Toning", "Over 50s", "Beginners"],
    image: "LN",
    logo: "Logo",
    logoColor: "#FF3366",
    customLogo: null,
    price: "£40",
    bio: "Welcome to All Fit! I'm Lynda, dedicated to helping you achieve your fitness goals in Hastings & St Leonards. Whether you're looking to tone up, lose weight, or just feel healthier, I'm here to support you every step of the way.\n\nI specialize in working with over 50s and beginners who might feel intimidated by traditional gym environments. My sessions are designed to be fun, effective, and safe, ensuring you build confidence as you build strength. We will focus on functional movements that improve your daily life, energy levels, and overall well-being. Let's make fitness a part of your lifestyle that you actually enjoy!",
    availability: "Mon-Sat",
    voice: "Leda",
    email: "lynda@allfit.com"
  },
];

export const MOCK_PROFILES = generateMockProfiles(200, 100);
export const PT_DATA = [...STATIC_PT_DATA, ...MOCK_PROFILES];