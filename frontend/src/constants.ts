import {
  Heart,
  Brain,
  Leaf,
  Activity,
  Apple,
  Users,
  BookOpen,
  MessageCircle,
  Pill,
  Stethoscope,
  Smile,
  Dumbbell
} from 'lucide-react';

export const COMPANY_INFO = {
  name: "Quince Nutrition and Consultancy Ltd",
  tagline: "Let’s work together towards a healthier you and a healthier community!",
  location: "The Waterfront Karen, Water Front Medical Clinic",
  phone: "+254 720 428 704",
  email: "Info@quince-nutrition.com",
  website: "www.quince-nutrition.com",
  mission: "Our mission is to empower individuals, families, and organizations with expert-driven nutrition solutions, wellness coaching, and evidence-based guidance to achieve optimal health."
};

export const ABOUT_CONTENT = [
  "At Quince Nutrition and Consultancy Ltd, we believe that true wellness begins with the right knowledge, proper nutrition, and a balanced lifestyle.",
  "With a team of highly qualified nutritionists, dietitians, wellness coaches, and mental health experts, we provide personalized nutrition counseling, corporate wellness programs, fitness planning, and mental well-being support to help our clients lead healthier, more fulfilling lives.",
  "We specialize in preventive nutrition, medical nutrition therapy, and holistic well-being to address a wide range of health concerns, including diabetes, cardiovascular health, weight management, digestive disorders, and autoimmune conditions. Our tailored programs ensure sustainable health improvements through practical meal planning, fitness strategies, and stress management techniques.",
  "For businesses, we offer corporate wellness solutions designed to enhance employee well-being, productivity, and work-life balance. Our workplace wellness programs include nutrition education, stress reduction workshops, mental health awareness training, and customized fitness plans to create healthier, happier work environments.",
  "At Quince Nutrition, we are more than just a wellness brand – we are your trusted health partners, committed to guiding you on your journey to a healthier and more balanced life. Whether you’re looking for expert nutrition advice, mental well-being support, or corporate wellness solutions, we are here to help you thrive."
];

export const SERVICES = [
  {
    id: "wellness",
    title: "1. Wellness",
    icon: Leaf,
    description: "Holistic strategies for a balanced life.",
    items: [
      { title: "Stress Management", desc: "Holistic stress reduction strategies, relaxation techniques, personalized wellness plans, and coping mechanisms to enhance resilience and prevent burnout." },
      { title: "Emotional Wellbeing", desc: "Professional counseling, emotional intelligence training, and mental wellness workshops to help individuals build confidence, manage emotions, and cultivate positive relationships." },
      { title: "Mindfulness & Meditation", desc: "Guided meditation sessions, breathing exercises, and mindfulness workshops to enhance focus, reduce anxiety, and improve overall mental clarity." },
      { title: "Mental Health Wellness", desc: "Therapy, wellness coaching, and personalized plans designed to address anxiety, depression, and emotional distress." },
      { title: "Work-Life Balance", desc: "Practical strategies for maintaining a balance between professional responsibilities and personal well-being, leading to improved productivity and fulfillment." },
      { title: "Corporate Wellness Programs", desc: "Tailored workplace wellness solutions, including nutrition counseling, stress reduction programs, and employee wellness challenges." },
      { title: "Personalized Fitness Plans", desc: "Customized exercise and nutrition plans, integrating fitness goals with overall well-being, ensuring sustainable health improvements." }
    ]
  },
  {
    id: "health-conditions",
    title: "2. Health Conditions",
    icon: Stethoscope,
    description: "Expert management for chronic and acute conditions.",
    items: [
      { title: "Diabetes Management", desc: "Expert dietary guidance, lifestyle coaching, and continuous glucose management support to help clients prevent and control diabetes effectively." },
      { title: "Cardiovascular Health", desc: "Heart-healthy nutrition plans, exercise routines, and stress management strategies to lower cholesterol, manage blood pressure, and improve heart function." },
      { title: "Hypertension Control", desc: "Tailored dietary plans focus on sodium reduction, potassium-rich foods, and lifestyle changes to maintain optimal blood pressure levels." },
      { title: "Obesity & Weight Management", desc: "Science-based weight management solutions, including metabolic assessments, diet optimization, and exercise routines, ensuring long-term results." },
      { title: "Digestive Disorders", desc: "Addressing gut health concerns such as IBS, acid reflux, and bloating with targeted meal plans, probiotic recommendations, and lifestyle modifications." },
      { title: "Autoimmune Conditions", desc: "Nutrition therapy for conditions like rheumatoid arthritis and lupus by reducing inflammation through anti-inflammatory diets and lifestyle adjustments." },
      { title: "Cancer Management", desc: "Nutritional support during cancer treatment, focusing on immune-boosting diets, weight maintenance, and meal strategies that alleviate treatment side effects." },
      { title: "Osteoporosis & Bone Health Support", desc: "Specialized nutrition plans to enhance bone density and reduce osteoporosis risk, incorporating calcium, vitamin D, and magnesium-rich foods." },
      { title: "Kidney Disease Nutrition Management", desc: "Customized meal plans that limit sodium, phosphorus, and potassium while ensuring adequate protein intake to slow disease progression." },
      { title: "Mental Health & Cognitive Function Nutrition", desc: "Brain-boosting meal plans rich in omega-3s, B vitamins, and antioxidants to support memory, focus, and mood." },
      { title: "Sexual Health & Reproductive Wellness", desc: "Dietary guidance rich in zinc, vitamin E, omega-3s, and antioxidants to enhance libido, improve reproductive health, and boost energy levels." }
    ]
  },
  {
    id: "products",
    title: "3. Products & Supplements",
    icon: Pill,
    description: "High-quality supplements for optimal health.",
    items: [
      { title: "Multivitamins", desc: "High-quality multivitamins tailored to individual needs, ensuring adequate nutrient intake for optimal health." },
      { title: "Vitamin D & Calcium", desc: "Expert guidance to improve bone health and immune function by optimizing Vitamin D and calcium intake." },
      { title: "Omega-3 & Fatty Acids", desc: "Supporting heart and brain health by recommending high-quality omega-3 sources, ensuring proper dosage and benefits." },
      { title: "Herbal Supplements", desc: "Insights on safe and effective herbal remedies for stress relief, immune support, and digestive health." },
      { title: "Probiotics & Gut Health", desc: "Guidance on the best probiotic strains and dietary strategies to promote a healthy gut microbiome and digestive wellness." },
      { title: "Energy & Performance Boosters", desc: "Advice on natural and safe energy-enhancing supplements to improve athletic performance, cognitive function, and daily vitality." }
    ]
  },
  {
    id: "nutrition-services",
    title: "4. Nutrition Services",
    icon: Apple,
    description: "Customized plans for your dietary needs.",
    items: [
      { title: "Personalized Diet Plans", desc: "Customized nutrition plans tailored to individual health goals, dietary preferences, and medical needs." },
      { title: "Healthy Recipe Guides", desc: "Nutritious, easy-to-make recipes that cater to different dietary requirements, making healthy eating enjoyable." },
      { title: "Weight-Loss Meal Plans", desc: "Structured meal plans designed to promote sustainable weight loss while ensuring balanced nutrition." },
      { title: "Sports & Performance Nutrition", desc: "High-performance meal strategies for athletes and active individuals to optimize endurance, recovery, and muscle growth." },
      { title: "Family & Child Nutrition Plans", desc: "Family-focused approach ensuring both adults and children receive well-balanced, age-appropriate nutrition." },
      { title: "Meal Prep Strategies", desc: "Time-saving meal preparation guides to help clients maintain healthy eating habits effortlessly." }
    ]
  },
  {
    id: "resources",
    title: "5. Resources & Learning",
    icon: BookOpen,
    description: "Education for a healthier community.",
    items: [
      { title: "Expert Health Talks", desc: "Expert-led talks educate organizations and individuals on nutrition, wellness, and disease prevention." },
      { title: "Wellness & Fitness Workshops", desc: "Interactive sessions covering fitness, nutrition, and holistic well-being to promote healthier lifestyles." },
      { title: "Mental Health Awareness Events", desc: "Awareness campaigns provide education and support for mental health challenges, reducing stigma and fostering well-being." },
      { title: "Chronic Disease Management Seminars", desc: "In-depth training on managing lifestyle diseases through proper nutrition and healthy habits." }
    ]
  },
  {
    id: "counseling",
    title: "6. Counseling and Support",
    icon: MessageCircle,
    description: "Professional support for your mental journey.",
    items: [
      { title: "Mindfulness Techniques", desc: "Practical mindfulness techniques to enhance focus, relaxation, and stress management." },
      { title: "Life Coaching & Emotional Resilience", desc: "Personalized coaching sessions to help individuals develop emotional strength and achieve personal and professional goals." },
      { title: "Cognitive Behavioral Therapy (CBT)", desc: "Evidence-based CBT methods to help clients overcome anxiety, depression, and behavioral challenges." },
      { title: "Workplace Stress Reduction", desc: "Corporate programs including stress-relief strategies, time management techniques, and productivity-enhancing wellness interventions." },
      { title: "Mental Health Counseling", desc: "One-on-one counseling sessions for individuals struggling with anxiety, depression, and emotional challenges." },
      { title: "Family & Relationship Counseling", desc: "Support for relationship issues, family dynamics, and interpersonal conflicts through effective counseling techniques." },
      { title: "Behavioral Change & Addiction Counseling", desc: "Helping clients overcome unhealthy habits, addictions, and lifestyle challenges through structured intervention strategies." },
      { title: "Life & Personal Development Counseling", desc: "Supporting individuals in personal growth, career advancement, and achieving a fulfilling life through goal-oriented coaching." }
    ]
  }
];
