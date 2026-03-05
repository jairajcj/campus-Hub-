require('dotenv').config();
const mongoose = require('mongoose');
const News = require('./models/News');
const LostFound = require('./models/LostFound');
const Textbook = require('./models/Textbook');

const newsData = [
    {
        title: "Annual Tech Fest 2026 Announced",
        content: "Get ready for the biggest tech event of the year! Hackathons, robot wars, and guest lectures from industry leaders.",
        category: "event",
        authorName: "Aman Sharma",
        authorEmail: "aman.tech@univ.edu",
        tags: ["techfest", "hackathon", "2026"]
    },
    {
        title: "End Semester Exams Schedule Released",
        content: "The final exam timetable for all departments is now available on the university portal. Exams start from May 15th.",
        category: "academic",
        authorName: "Exam Controller",
        authorEmail: "exams@univ.edu",
        tags: ["exams", "schedule", "academic"]
    },
    {
        title: "University Won Inter-College Football Finals!",
        content: "A stunning 2-1 victory last night brings the championship trophy back home. Celebration next Monday at the main ground.",
        category: "sports",
        authorName: "Coach Vikram",
        authorPhone: "+91 99887 76655",
        tags: ["sports", "winners", "football"]
    }
];

const lfData = [
    {
        type: "lost",
        itemName: "Blue Dell Laptop Bag",
        category: "bags",
        description: "Lost a blue Dell bag containing a charger and a notebook. Left it near the library cafeteria.",
        location: "Library Cafeteria",
        dateLostFound: new Date('2026-03-01'),
        posterName: "Rahul Verma",
        posterPhone: "9876543210"
    },
    {
        type: "found",
        itemName: "Identity Card - S. Gupta",
        category: "id-cards",
        description: "Found an ID card near the main gate. Name on card is Sneha Gupta.",
        location: "Main Entrance Gate",
        dateLostFound: new Date(),
        posterName: "Security Desk",
        posterPhone: "011-234567"
    },
    {
        type: "lost",
        itemName: "Casmio Scientific Calculator",
        category: "electronics",
        description: "Black Casmio calculator with 'JK' written on the back inside the cover.",
        location: "Physics Lab 2",
        dateLostFound: new Date('2026-03-04'),
        posterName: "Jatin Kumar",
        posterEmail: "jatin.k@univ.edu"
    }
];

const textbookData = [
    {
        title: "Introduction to Algorithms",
        author: "Cormen, Leiserson, Rivest",
        subject: "Computer Science",
        category: "computer-science",
        edition: "4th Edition",
        condition: "like-new",
        price: 850,
        negotiable: true,
        description: "Very lightly used, no markings inside. Essential for 2nd year CS students.",
        sellerName: "Priya Singh",
        sellerPhone: "9123456789"
    },
    {
        title: "University Physics",
        author: "Young and Freedman",
        subject: "Physics",
        category: "science",
        edition: "15th Edition",
        condition: "good",
        price: 600,
        negotiable: false,
        description: "Good condition, some highlights in Chapter 3 and 5.",
        sellerName: "Arnav Gupta",
        sellerEmail: "arnav.g@univ.edu"
    },
    {
        title: "Modern Control Engineering",
        author: "Katsuhiko Ogata",
        subject: "Electrical Engineering",
        category: "engineering",
        edition: "5th Edition",
        condition: "fair",
        price: 400,
        negotiable: true,
        description: "Old but well maintained. Covers the entire syllabus for Control Systems.",
        sellerName: "Sandeep Rao",
        sellerPhone: "9988776655"
    }
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await News.deleteMany({});
        await LostFound.deleteMany({});
        await Textbook.deleteMany({});
        console.log("Cleared existing data.");

        // Insert new data
        await News.insertMany(newsData);
        await LostFound.insertMany(lfData);
        await Textbook.insertMany(textbookData);

        console.log("✅ Database Seeded Successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seedDB();
