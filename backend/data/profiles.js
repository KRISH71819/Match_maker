/**
 * ════════════════════════════════════════════════════════════════════
 * TDC Matchmaker — 100 Realistic Indian Profiles
 * ════════════════════════════════════════════════════════════════════
 * 50 male + 50 female profiles with comprehensive biodata fields
 * inspired by Shaadi.com, BharatMatrimony, and Jeevansathi formats.
 * Includes Indian-specific fields: familyType, diet, horoscope, manglik.
 */

// ─── Data pools for generating realistic combinations ───
const maleFirstNames = [
  "Arjun", "Rohan", "Aditya", "Vikram", "Karan", "Siddharth", "Nikhil", "Rahul", "Varun", "Ankit",
  "Dhruv", "Harsh", "Kunal", "Mihir", "Pranav", "Rishi", "Sahil", "Tarun", "Uday", "Yash",
  "Aman", "Ishaan", "Manish", "Neeraj", "Dev", "Gaurav", "Jay", "Kabir", "Lakshya", "Omkar",
  "Parth", "Rajat", "Samar", "Tushar", "Vivek", "Abhinav", "Chirag", "Deepak", "Farhan", "Girish",
  "Hemant", "Jayant", "Keshav", "Lalit", "Mayank", "Nakul", "Prateek", "Ritesh", "Suresh", "Tanmay"
];

const femaleFirstNames = [
  "Priya", "Ananya", "Shreya", "Neha", "Pooja", "Divya", "Kavya", "Meera", "Riya", "Sakshi",
  "Aisha", "Bhavna", "Chandni", "Diya", "Esha", "Falak", "Gauri", "Heena", "Isha", "Juhi",
  "Kiara", "Lavanya", "Mahi", "Naina", "Paridhi", "Radhika", "Simran", "Tanvi", "Urvi", "Vaishnavi",
  "Aditi", "Bhoomika", "Charvi", "Deepika", "Ekta", "Falguni", "Garima", "Hiral", "Ira", "Jhanvi",
  "Kriti", "Latika", "Mansi", "Nidhi", "Pallavi", "Rhea", "Sanya", "Tara", "Uma", "Vaani"
];

const lastNames = [
  "Sharma", "Gupta", "Patel", "Singh", "Verma", "Mehta", "Joshi", "Kapoor", "Malhotra", "Reddy",
  "Kumar", "Iyer", "Nair", "Chatterjee", "Banerjee", "Desai", "Shah", "Bhat", "Rao", "Agarwal",
  "Chopra", "Khanna", "Sinha", "Mishra", "Pandey", "Trivedi", "Kulkarni", "Deshpande", "Menon", "Pillai"
];

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad",
  "Jaipur", "Lucknow", "Chandigarh", "Indore", "Kochi", "Gurgaon", "Noida", "Nashik"
];

const colleges = [
  "IIT Bombay", "IIT Delhi", "IIM Ahmedabad", "BITS Pilani", "NIT Trichy", "Delhi University",
  "St. Xavier's College", "Christ University", "Manipal Institute", "SRCC Delhi",
  "IIT Madras", "IIM Bangalore", "NMIMS Mumbai", "Symbiosis Pune", "VIT Vellore",
  "Anna University", "Jadavpur University", "IIIT Hyderabad", "Amity University", "SRM Chennai"
];

const degrees = [
  "B.Tech Computer Science", "MBA Finance", "B.Com Honours", "B.Tech Mechanical", "MBBS",
  "B.Arch", "M.Tech AI/ML", "BBA", "CA", "B.Tech Electrical",
  "MSc Data Science", "B.Tech Civil", "LLB", "BDS", "B.Sc Physics",
  "MBA Marketing", "M.Tech Robotics", "BA Economics", "PhD Biotechnology", "B.Pharm"
];

const companies = [
  "Google", "Microsoft", "Amazon", "Flipkart", "Infosys", "TCS", "Wipro", "Deloitte",
  "Goldman Sachs", "JP Morgan", "McKinsey", "BCG", "Razorpay", "CRED", "Swiggy",
  "Zomato", "PhonePe", "Paytm", "Reliance Industries", "Tata Group",
  "HDFC Bank", "ICICI Bank", "Accenture", "EY", "PwC"
];

const designations = [
  "Software Engineer", "Senior Analyst", "Product Manager", "Consultant", "Data Scientist",
  "UX Designer", "Marketing Manager", "Business Analyst", "Investment Banker", "Doctor",
  "Architect", "Lawyer", "Research Scientist", "Operations Manager", "Chartered Accountant",
  "VP Engineering", "Associate Director", "Team Lead", "Founder", "Management Trainee"
];

const religions = ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist"];
const castes = [
  "Brahmin", "Kshatriya", "Vaishya", "Kayastha", "Maratha", "Rajput", "Agarwal",
  "Iyer", "Nair", "Reddy", "Patel", "Jat", "Bania", "Khatri", "Sindhi"
];

const languages = [
  "Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati",
  "Kannada", "Malayalam", "Punjabi", "Urdu", "Odia"
];

const diets = ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan"];
const familyTypes = ["Nuclear", "Joint"];
const yesNoMaybe = ["Yes", "No", "Maybe"];
const maritalStatuses = ["Never Married", "Divorced", "Widowed"];
const statuses = ["New Lead", "In Progress", "Match Sent", "Paused", "Closed"];

const maleBios = [
  "A curious soul who loves exploring new cuisines and trekking on weekends. Looking for someone who values deep conversations over small talk.",
  "Tech enthusiast by day, amateur chef by night. Believes the best relationships are built on mutual respect and shared laughter.",
  "Passionate about fitness and financial independence. Seeking a partner who is ambitious yet grounded.",
  "An old-school romantic who enjoys long drives and Bollywood classics. Family-oriented and values tradition with a modern outlook.",
  "Love traveling, reading non-fiction, and debating ideas over chai. Looking for an intellectual equal who can challenge me.",
  "Startup founder juggling code and coffee. Want someone who understands the hustle but also knows when to slow down.",
  "Sports lover — cricket on weekends, gym on weekdays. Value loyalty and honesty above everything else.",
  "Music is my therapy. Can go from Arijit Singh to Pink Floyd in one playlist. Looking for my duet partner.",
  "Foodie at heart, runner by habit. Believe in growing together and supporting each other's dreams.",
  "Simple guy with big dreams. Love my family, my dog, and a good cup of filter coffee."
];

const femaleBios = [
  "Creative soul who paints, writes, and overthinks in equal measure. Looking for someone who appreciates both silence and chaos.",
  "Corporate by day, classical dancer by evening. Want a partner who respects ambition and celebrates femininity.",
  "Travel addict with 15 countries on the list. Seeking someone adventurous who's also comfortable doing nothing on a Sunday.",
  "Bookworm, dog mom, and chai over coffee. Value emotional intelligence and a good sense of humor.",
  "Believe in balancing career and relationships. Looking for a partner, not a provider. Equality matters.",
  "Medical professional who still finds time to bake and binge-watch shows. Want someone who values quality time.",
  "Fitness enthusiast who loves yoga and hiking. Seeking a mindful partner who values wellness and personal growth.",
  "Art lover, museum hopper, and weekend brunch enthusiast. Looking for someone who appreciates the finer things.",
  "Strong-willed, independent, and fiercely loyal. Want a partner who sees me as an equal and a teammate.",
  "Love my family, my work, and my alone time. Seeking someone who adds value without adding chaos."
];

// ─── Utility functions ───
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomDate(startYear, endYear) {
  const year = randomInt(startYear, endYear);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function calculateAge(dob) {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

// ─── Generate profiles ───
const profiles = [];

for (let i = 0; i < 200; i++) {
  const isMale = i % 2 === 0;
  const nameIndex = Math.floor(i / 2);
  const firstName = isMale
    ? maleFirstNames[nameIndex % maleFirstNames.length]
    : femaleFirstNames[nameIndex % femaleFirstNames.length];
  const lastName = pick(lastNames);
  const dob = isMale ? randomDate(1988, 1998) : randomDate(1990, 2000);
  const age = calculateAge(dob);
  const heightCm = isMale ? randomInt(165, 190) : randomInt(150, 175);
  const heightFeet = Math.floor(heightCm / 30.48);
  const heightInches = Math.round((heightCm / 30.48 - heightFeet) * 12);
  const income = pick([
    "3-5 LPA", "5-8 LPA", "8-12 LPA", "12-18 LPA", "18-25 LPA",
    "25-40 LPA", "40-60 LPA", "60-100 LPA", "1 Cr+"
  ]);

  // Parse income to a numeric value for matching algorithm
  const incomeMap = {
    "3-5 LPA": 4, "5-8 LPA": 6.5, "8-12 LPA": 10, "12-18 LPA": 15,
    "18-25 LPA": 21, "25-40 LPA": 32, "40-60 LPA": 50, "60-100 LPA": 80, "1 Cr+": 120
  };

  const profile = {
    id: `TDC${String(i + 1).padStart(4, '0')}`,
    firstName,
    lastName,
    gender: isMale ? "Male" : "Female",
    dateOfBirth: dob,
    age,
    country: "India",
    city: pick(cities),
    height: `${heightFeet}'${heightInches}"`,
    heightCm,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: `+91 ${randomInt(70000, 99999)}${randomInt(10000, 99999)}`,
    college: pick(colleges),
    degree: pick(degrees),
    company: pick(companies),
    designation: pick(designations),
    income,
    incomeNumeric: incomeMap[income],
    maritalStatus: pick(maritalStatuses),
    languages: pickN(languages, randomInt(2, 4)),
    siblings: `${randomInt(0, 3)} Brother(s), ${randomInt(0, 2)} Sister(s)`,
    caste: pick(castes),
    religion: pick(religions),
    wantKids: pick(yesNoMaybe),
    openToRelocate: pick(yesNoMaybe),
    openToPets: pick(yesNoMaybe),
    // Indian-specific fields (from research on Shaadi.com, BharatMatrimony)
    familyType: pick(familyTypes),
    dietaryPreference: pick(diets),
    horoscope: pick(["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]),
    manglik: pick(["Yes", "No", "Doesn't Matter"]),
    motherTongue: pick(["Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi"]),
    fatherOccupation: pick(["Businessman", "Government Officer", "Doctor", "Engineer", "Retired", "Teacher", "Advocate", "Farmer"]),
    familyValues: pick(["Traditional", "Moderate", "Liberal"]),
    complexion: pick(["Fair", "Wheatish", "Dusky"]),
    // Matchmaker metadata
    status: pick(statuses),
    assignedMatchmaker: "Krish Ajudiya",
    profilePhoto: `https://picsum.photos/seed/${firstName.toLowerCase()}${i}/400/400`,
    bio: isMale ? maleBios[i % maleBios.length] : femaleBios[(i - 50) % femaleBios.length],
    createdAt: randomDate(2024, 2025),
    notes: "",
  };

  profiles.push(profile);
}

module.exports = profiles;
